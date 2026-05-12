import { useEffect, useRef } from "react";
import { useCounter } from "../hooks";


export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const mp = useRef({ x: -200, y: -200 });
  const rp = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const mv = (e) => {
      mp.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
      const isButton = !!e.target.closest("button,a,[data-tip]");
      if (ring.current) {
        ring.current.style.width = (isButton ? 56 : 28) + "px";
        ring.current.style.height = (isButton ? 56 : 28) + "px";
      }
    };

    const tick = () => {
      rp.current.x += (mp.current.x - rp.current.x) * 0.11;
      rp.current.y += (mp.current.y - rp.current.y) * 0.11;
      if (ring.current) {
        ring.current.style.left = rp.current.x + "px";
        ring.current.style.top = rp.current.y + "px";
      }
      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", mv);
    tick();
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  return (
    <>
      {/* Dot — small, pointerEvents none, does NOT cover page */}
      <div
        ref={dot}
        style={{
          position: "fixed",
          zIndex: 99999,
          pointerEvents: "none",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#ffc832",
          transform: "translate(-50%,-50%)",
          transition: "width .15s, height .15s",
        }}
      />
      {/* Ring — larger, pointerEvents none */}
      <div
        ref={ring}
        style={{
          position: "fixed",
          zIndex: 99998,
          pointerEvents: "none",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,200,50,.5)",
          transform: "translate(-50%,-50%)",
          transition:
            "width .35s cubic-bezier(.23,1,.32,1), height .35s cubic-bezier(.23,1,.32,1)",
        }}
      />
    </>
  );
}

/* ── Magnetic Button ─────────────────────────────────────────
   Safe version — guards against null ref, never breaks click.
   ─────────────────────────────────────────────────────────── */
export function MagneticButton({ children, onClick, style, disabled }) {
  const ref = useRef(null);

  const mv = (e) => {
    if (!ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const x = (e.clientX - b.left - b.width / 2) * 0.35;
    const y = (e.clientY - b.top - b.height / 2) * 0.35;
    ref.current.style.transform = `translate(${x}px,${y}px) scale(1.04)`;
  };

  const lv = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0) scale(1)";
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={mv}
      onMouseLeave={lv}
      style={{
        ...style,
        transition: "transform .4s cubic-bezier(.23,1,.32,1)",
      }}
    >
      {children}
    </button>
  );
}

/* ── 3D Tilt Card ────────────────────────────────────────────*/
export function TiltCard({ children, style }) {
  const ref = useRef(null);

  const mv = (e) => {
    if (!ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)`;
    ref.current.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };

  const lv = () => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(900px) rotateY(0) rotateX(0) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={mv}
      onMouseLeave={lv}
      style={{
        ...style,
        transition: "transform .5s cubic-bezier(.23,1,.32,1)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

/* ── Animated Counter ────────────────────────────────────────*/
export function AnimatedCounter({ to, suffix = "" }) {
  const [ref, value] = useCounter(to);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ── Particle Canvas ─────────────────────────────────────────*/
export function ParticleField() {
  const cvs = useRef(null);
  useEffect(() => {
    const c = cvs.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, pts, raf;

    const resize = () => {
      W = c.width = c.offsetWidth;
      H = c.height = c.offsetHeight;
    };
    const init = () => {
      resize();
      pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.6 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,50,${p.a * 0.3})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j],
            dx = p.x - q.x,
            dy = p.y - q.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,200,50,${(1 - d / 120) * 0.07})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Grain Overlay ───────────────────────────────────────────*/
export function GrainOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        pointerEvents: "none" /* MUST be none — never blocks clicks */,
        opacity: 0.025,
        mixBlendMode: "overlay",
        animation: "grain 1.2s steps(1) infinite",
      }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* ── Section Label ───────────────────────────────────────────*/
export function SectionLabel({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 18,
      }}
    >
      <div style={{ width: 40, height: 1, background: "#ffc832" }} />
      <span
        style={{
          fontSize: 18,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#ffc832",
          fontWeight: 700,
        }}
      >
        {text}
      </span>
    </div>
  );
}
