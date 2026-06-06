export default function Logo({ size = 32, showText = true, textColor = "#4F46E5" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#4F46E5" />
        <path d="M10 8h20v26l-4-3-4 3-4-3-4 3-4-3V8z" fill="white" />
        <rect x="14" y="13" width="12" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="17" width="8" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="21" width="10" height="1.5" rx="0.75" fill="#4F46E5" />
        <circle cx="29" cy="29" r="7" fill="#10B981" />
        <path d="M26 29l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span style={{ fontSize: size * 0.6, fontWeight: "700", color: textColor, letterSpacing: "-0.5px", fontFamily: "'Google Sans', sans-serif" }}>
          Receipt<span style={{ color: "#10B981" }}>Loop</span>
        </span>
      )}
    </div>
  )
}