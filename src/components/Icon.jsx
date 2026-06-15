// Minimal 16px stroke icon set — monochrome (currentColor) per the
// one-accent discipline; no multicolored per-card icons.

const paths = {
  home: <path d="M2.5 6.5 8 2l5.5 4.5V13a1 1 0 0 1-1 1h-3v-4h-3v4h-3a1 1 0 0 1-1-1V6.5Z" />,
  chart: (
    <>
      <path d="M2.5 13.5h11" />
      <path d="M4.5 13.5V8" />
      <path d="M8 13.5V4" />
      <path d="M11.5 13.5V6.5" />
    </>
  ),
  phone: <path d="M3.2 2.5h2.4l1 2.8-1.5 1.2a8.5 8.5 0 0 0 4.4 4.4l1.2-1.5 2.8 1v2.4a1.2 1.2 0 0 1-1.3 1.2A11.5 11.5 0 0 1 2 3.8a1.2 1.2 0 0 1 1.2-1.3Z" />,
  pipeline: (
    <>
      <path d="M2.5 3.5h11" />
      <path d="M4.5 8h7" />
      <path d="M6.5 12.5h3" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2 6.5h12" />
    </>
  ),
  inbox: (
    <>
      <path d="M2.5 9.5h3l1 1.5h3l1-1.5h3" />
      <path d="M3.5 3.5h9l1 6v3a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-3l1-6Z" />
    </>
  ),
  spark: <path d="M8 2.5 9.4 6.6 13.5 8l-4.1 1.4L8 13.5 6.6 9.4 2.5 8l4.1-1.4L8 2.5Z" />,
  send: (
    <>
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <path d="M2.5 6h11" />
      <path d="M5.5 1.5v2M10.5 1.5v2" />
    </>
  ),
  grid: (
    <>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </>
  ),
  target: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2" />
    </>
  ),
  palette: (
    <>
      <path d="M8 2.5a5.5 5.5 0 1 0 0 11c.9 0 1.2-.6.9-1.3-.4-.9.2-1.7 1.2-1.7h1.4c1 0 2-.8 2-2A5.9 5.9 0 0 0 8 2.5Z" />
      <circle cx="5.5" cy="6" r="0.5" />
      <circle cx="8.5" cy="4.8" r="0.5" />
      <circle cx="11" cy="6.5" r="0.5" />
    </>
  ),
  chevronDown: <path d="m4 6 4 4 4-4" />,
  chevronsUpDown: <path d="m5 6 3-3 3 3M5 10l3 3 3-3" />,
  arrowRight: <path d="M3 8h10m0 0L9.5 4.5M13 8l-3.5 3.5" />,
  info: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 7.5v3.2" />
      <path d="M8 5.2v.1" />
    </>
  ),
};

export default function Icon({ name, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
