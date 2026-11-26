// Inline SVG flags: flag emoji do not render on Windows.

export function VietnamFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="20" fill="#da251d" />
      <polygon
        fill="#ff0"
        points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"
      />
    </svg>
  )
}

const STRIPE = 100 / 13

export function UsFlag() {
  return (
    <svg viewBox="0 0 190 100" aria-hidden="true">
      <rect width="190" height="100" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * STRIPE} width="190" height={STRIPE} fill="#b22234" />
      ))}
      <rect width="76" height={7 * STRIPE} fill="#3c3b6e" />
      {/* simplified stars: a dot grid, too small to tell apart at tab size anyway */}
      <pattern id="us-stars" width="12.6" height="10.8" patternUnits="userSpaceOnUse">
        <circle cx="6.3" cy="5.4" r="2.2" fill="#fff" />
      </pattern>
      <rect width="76" height={7 * STRIPE} fill="url(#us-stars)" />
    </svg>
  )
}
