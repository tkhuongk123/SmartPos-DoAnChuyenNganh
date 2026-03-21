
import "./MainLayout.css";

function ScanQrLayout({ children }) {
    return (
        <div className="ScanQrLayout">
            <div className="ScanQrLayout_Header">
            </div>
            <div className="ScanQrLayout_Main">
                {children}
            </div>
        </div>
    )
}

export default ScanQrLayout;
