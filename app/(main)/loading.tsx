export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <svg
          className="absolute animate-spin"
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="48" cy="48" r="44" stroke="#f3d5d3" strokeWidth="4" />
          <path
            d="M48 4 A44 44 0 0 1 92 48"
            stroke="#d73a31"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Francesco's Pizza Kitchen"
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
