// FRAMEWORKS
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";

// COMPONENTS
import "./ScanQrPage.css";




let jsQRLoaded = false;
let jsQRLoading = false;
let jsQRCallbacks = [];

function loadJsQR() {
  return new Promise((resolve, reject) => {
    if (window.jsQR) { resolve(window.jsQR); return; }
    if (jsQRLoading) { jsQRCallbacks.push({ resolve, reject }); return; }
    jsQRLoading = true;
    jsQRCallbacks.push({ resolve, reject });
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    script.onload = () => {
      jsQRLoaded = true;
      jsQRCallbacks.forEach(cb => cb.resolve(window.jsQR));
      jsQRCallbacks = [];
    };
    script.onerror = () => {
      jsQRCallbacks.forEach(cb => cb.reject(new Error('Failed to load jsQR')));
      jsQRCallbacks = [];
    };
    document.head.appendChild(script);
  });
}

function decodeQRFromImage(imageDataUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const jsQR = await loadJsQR();
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          resolve(code.data);
        } else {
          reject(new Error('Không tìm thấy mã QR trong ảnh'));
        }
      };
      img.onerror = () => reject(new Error('Không thể đọc ảnh'));
      img.src = imageDataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

function ScanQrPage() {
  const nguoidung = JSON.parse(sessionStorage.getItem('nguoidung'));
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);


  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleScan = async () => {
    if (!imageUrl) return;
    setScanning(true);
    setResult(null);
    setError(null);
    try {
      // Simulate slight delay for UX
      await new Promise(r => setTimeout(r, 1200));
      const data = await decodeQRFromImage(imageUrl);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleResultAction = () => {
    if (!result) return;
    // If result looks like a URL, navigate
    if (/^https?:\/\//.test(result)) {
      window.open(result, '_blank');
    } else {
      // Try to navigate if it looks like an internal route
      navigate(result);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    setError(null);
    setScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  return (
    <main className="ScanQrPage">
      <div className="qr-card">
        <div className="qr-header">
          <span className="label">QR Scanner</span>
          <h1>Quét mã QR</h1>
          <p>Tải ảnh chứa mã QR để giải mã nội dung</p>
        </div>

        {/* Upload Zone or Preview */}
        {!imageUrl ? (
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="upload-icon-wrap">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="drop-zone-text">
              <strong>Nhấn để chọn ảnh</strong> hoặc kéo thả vào đây
              <span className="hint">PNG · JPG · WEBP · BMP · GIF</span>
            </div>
          </div>
        ) : scanning ? (
          <div className="scanning-wrap">
            <img src={imageUrl} alt="QR code" className="scanning-img" />
            <div className="scan-line" />
            <div className="scan-corners" />
            <div className="scanning-label">ĐANG QUÉT...</div>
          </div>
        ) : (
          <div className="preview-wrap">
            <img src={imageUrl} alt="QR code" className="preview-img" />
            <div className="preview-overlay">
              <button className="change-btn" onClick={() => fileInputRef.current?.click()}>
                Đổi ảnh
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* Result */}
        {(result || error) && !scanning && (
          <div className="result-wrap">
            <div className="result-label">Kết quả</div>
            <div className={`result-box ${result ? 'success' : 'error'}`}>
              <div className="result-dot" />
              <div className="result-text">{result || error}</div>
              {result && (
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  title="Sao chép"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className="scan-btn"
          onClick={result ? handleResultAction : handleScan}
          disabled={!imageUrl || scanning}
        >
          {scanning
            ? 'Đang xử lý...'
            : result
              ? (/^https?:\/\//.test(result) ? 'Mở đường dẫn →' : 'Điều hướng →')
              : 'Quét mã QR'}
        </button>

        {imageUrl && !scanning && (
          <span className="reset-link" onClick={handleReset}>
            ← Chọn ảnh khác
          </span>
        )}

        <div className="divider" />

        <div className="formats-note">
          {['QR Code', 'URL', 'Text', 'vCard', 'WiFi', 'Email'].map(f => (
            <span key={f} className="format-tag">{f}</span>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ScanQrPage;


