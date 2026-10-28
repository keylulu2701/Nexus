export function Logo({ groesse = 28 }: { groesse?: number }) {
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox="0 0 512 512"
      aria-hidden
      style={{ filter: 'drop-shadow(0 0 6px rgb(157 107 255 / 0.55))' }}
    >
      <defs>
        <linearGradient id="nx-logo-strich" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9D6BFF" />
          <stop offset="1" stopColor="#22E5FF" />
        </linearGradient>
      </defs>
      <path
        d="M148 372 V140 L364 372 V140"
        fill="none"
        stroke="url(#nx-logo-strich)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="148" cy="372" r="34" fill="#080814" stroke="#9D6BFF" strokeWidth="18" />
      <circle cx="148" cy="140" r="34" fill="#080814" stroke="#9D6BFF" strokeWidth="18" />
      <circle cx="364" cy="372" r="34" fill="#080814" stroke="#22E5FF" strokeWidth="18" />
      <circle cx="364" cy="140" r="34" fill="#080814" stroke="#22E5FF" strokeWidth="18" />
    </svg>
  )
}