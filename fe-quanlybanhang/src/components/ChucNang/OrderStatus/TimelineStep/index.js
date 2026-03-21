import "./TimelineStep.css";

const ORDER_STATUSES = [
  { key: "PENDING",  label: "Đặt món ăn thành công",   sublabel: "Đơn hàng đã được ghi nhận",      icon: "🛒", color: "#4CAF50", bg: "#E8F5E9", ring: "#A5D6A7" },
  { key: "COOKING",  label: "Đã xác nhận",            sublabel: "Bếp đang chuẩn bị món ăn",       icon: "✅", color: "#2196F3", bg: "#E3F2FD", ring: "#90CAF9" },
  { key: "COOKED",   label: "Đã làm xong",            sublabel: "Món ăn đã sẵn sàng phục vụ",     icon: "🍽️", color: "#FF9800", bg: "#FFF3E0", ring: "#FFCC80" },
  { key: "SERVED",     label: "Đã phục vụ món ăn ",  sublabel: "Cảm ơn quý khách!",              icon: "🎉", color: "#00BCD4", bg: "#E0F7FA", ring: "#80DEEA" },
//   { key: "PAID",   label: "Đã phục vụ",         sublabel: "Vui lòng thanh toán tại quầy",   icon: "💰", color: "#9C27B0", bg: "#F3E5F5", ring: "#CE93D8" },
  { key: "CANCELLED",label: "Đã huỷ",                 sublabel: "Đơn hàng bị huỷ",                icon: "❌", color: "#F44336", bg: "#FFEBEE", ring: "#EF9A9A" },
];



function TimelineStep({ step, index, currentIndex, isLast }) {
  
  const isPast    = index < currentIndex;
  const isCurrent = index === currentIndex;
  const isFuture  = index > currentIndex;

 
  return (
    <div className="tl-item">
      <div className="tl-left">
        <div
          className="tl-dot"
          style={{
            background:  isFuture ? "#e0e0e0" : step.color,
            boxShadow:   isCurrent ? `0 0 0 4px ${step.ring}, 0 0 18px ${step.color}44` : "none",
          }}
        >
          <span className="tl-dot-icon">{isFuture ? "○" : step.icon}</span>
        </div>
        {!isLast && (
          <div
            className="tl-line"
            style={{
              background: isPast
                ? `linear-gradient(to bottom, ${step.color}, ${ORDER_STATUSES[index + 1]?.color || step.color})`
                : isCurrent
                ? `linear-gradient(to bottom, ${step.color}88, #e0e0e0)`
                : "#e0e0e0",
            }}
          />
        )}
      </div>
      <div
        className="tl-content"
        style={{
          background:   isCurrent ? step.bg : isFuture ? "#fafafa" : "#fff",
          borderColor:  isCurrent ? step.ring : isPast ? "#f0f0f0" : "#ececec",
          opacity:      isFuture ? 0.5 : 1,
        }}
      >
        <div>
          <p className="tl-label" style={{ color: isFuture ? "#bdbdbd" : isCurrent ? step.color : "#555" }}>
            {step.label}
          </p>
          <p className="tl-sublabel">{step.sublabel}</p>
        </div>
        {isCurrent && <div className="tl-badge" style={{ background: step.color }}>Hiện tại</div>}
        {isPast     && <div className="tl-check"  style={{ color: step.color }}>✓</div>}
      </div>
    </div>
  );


  
}

export default TimelineStep;