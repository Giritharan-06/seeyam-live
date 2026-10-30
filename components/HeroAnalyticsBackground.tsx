export default function HeroAnalyticsBackground() {
  return (
    <div aria-hidden="true" className="hero-ambient">
      <div className="hero-ambient__glow hero-ambient__glow--blue" />
      <div className="hero-ambient__glow hero-ambient__glow--violet" />
      <div className="hero-ambient__glow hero-ambient__glow--gold" />
      <div className="hero-ambient__grid" />
      <div className="hero-ambient__lines">
        <svg viewBox="0 0 1440 760" fill="none" preserveAspectRatio="xMidYMid slice">
          <path className="hero-ambient__track" d="M-80 610C180 610 210 240 520 350S910 750 1110 380S1390 100 1520 160" />
          <path className="hero-ambient__flow" d="M-80 610C180 610 210 240 520 350S910 750 1110 380S1390 100 1520 160" />
          <path className="hero-ambient__track hero-ambient__track--gold" d="M-40 720C260 480 400 760 720 540S1150 80 1500 300" />
          <path className="hero-ambient__flow hero-ambient__flow--gold" d="M-40 720C260 480 400 760 720 540S1150 80 1500 300" />
          <circle cx="520" cy="350" r="5" fill="#60a5fa" />
          <circle cx="1110" cy="380" r="7" fill="#a78bfa" />
          <circle cx="720" cy="540" r="4" fill="#fbbf24" />
        </svg>
      </div>
      <div className="hero-ambient__shape hero-ambient__shape--ring" />
      <div className="hero-ambient__shape hero-ambient__shape--diamond" />
      <div className="hero-ambient__shape hero-ambient__shape--dot" />
      <div className="hero-ambient__veil" />
    </div>
  );
}
