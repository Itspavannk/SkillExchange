import React from "react";
import useResponsive from "../hooks/useResponsive";
import { ParticleField } from "../components/primitives";
const leaders = [
  {
    rank: 1,
    name: "Pavan Naik",
    skill: "React Mentor",
    sessions: 148,
    rating: 4.9,
    credits: 1240,
    glow: "#ffc832",
  },
  {
    rank: 2,
    name: "Madhura",
    skill: "UI/UX Expert",
    sessions: 121,
    rating: 4.8,
    credits: 980,
    glow: "#c0c0c0",
  },
  {
    rank: 3,
    name: "Rahul",
    skill: "Python Coach",
    sessions: 97,
    rating: 4.7,
    credits: 870,
    glow: "#cd7f32",
  },
  {
    rank: 4,
    name: "Sneha",
    skill: "AI Mentor",
    sessions: 80,
    rating: 4.6,
    credits: 740,
    glow: "#8b5cf6",
    background: "#07080f",
  },
];

export default function LeaderboardPage() {
  const { isMobile, isTablet } = useResponsive();
  return (
    <div
      style={{
        isolation: "isolate",
        overflowX: "hidden",
        minHeight: "100vh",
        padding: isMobile
          ? "110px 16px 40px"
          : isTablet
            ? "130px 32px 60px"
            : "140px 80px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticleField />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(7,8,15,.75), rgba(7,8,15,.96))",
          zIndex: 0,
        }}
      />

      {/* background glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: isMobile ? 350 : 700,
          height: isMobile ? 350 : 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,200,50,.12), transparent 90%)",
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 300,
          background:
            "radial-gradient(circle, rgba(255,200,50,.08), transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          marginBottom: isMobile ? 40 : 70,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: isMobile ? 40 : 52,
              height: 1,
              background: "#ffc832",
            }}
          />

          <div
            style={{
              color: "#ffc832",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontSize: isMobile ? 12 : 14,
            }}
          >
            Global Rankings
          </div>
        </div>

        <h1
          className="clash"
          style={{
            fontSize: isMobile
              ? "clamp(50px,8vw,120px)"
              : "clamp(60px,8vw,120px)",
            lineHeight: 1,
            margin: 0,
            color: "white",
          }}
        >
          Leaderboard
        </h1>

        <p
          style={{
            marginTop: 24,
            color: "rgba(255,255,255,.55)",
            maxWidth: 700,
            lineHeight: 1.8,
            fontSize: isMobile ? 15 : 18,
          }}
        >
          Discover the top mentors, highest rated experts, and most active
          learners on SkillExchange.
        </p>
      </div>

      {/* Top cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit,minmax(280px,1fr))",
          gap: isMobile ? 18 : 24,
          position: "relative",
          zIndex: 2,
        }}
      >
        {leaders.map((u, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: isMobile ? 24 : 34,
              padding: isMobile ? "24px 20px" : "34px 30px",
              background:
                "linear-gradient(145deg,rgba(16,17,26,.88),rgba(12,13,20,.92))",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid rgba(255,255,255,.06)`,
              transition: "all .45s cubic-bezier(.16,1,.3,1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 30px 80px ${u.glow}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* glow line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${u.glow}, transparent)`,
              }}
            />

            {/* rank */}
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                fontSize: isMobile ? 60 : 90,
                fontWeight: 700,
                color: "rgba(255,255,255,.03)",
                lineHeight: 1,
              }}
            >
              {u.rank}
            </div>

            {/* profile */}
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${u.glow}, #ffffff22)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: isMobile ? 24 : 30,
                marginBottom: 28,
                border: `2px solid ${u.glow}`,
              }}
            >
              {u.name[0]}
            </div>

            <h2
              className="clash"
              style={{
                color: "white",
                margin: 0,
                fontSize: 34,
              }}
            >
              #{u.rank} {u.name}
            </h2>

            <div
              style={{
                marginTop: 10,
                color: u.glow,
                fontSize: 15,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {u.skill}
            </div>

            {/* stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                marginTop: 34,
              }}
            >
              <div
                style={{
                  padding: "18px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,.025)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,.35)",
                    fontSize: isMobile ? 11 : 13,
                    marginBottom: 8,
                  }}
                >
                  Sessions
                </div>
                <div style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
                  {u.sessions}
                </div>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,.025)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,.35)",
                    fontSize: isMobile ? 11 : 13,
                    marginBottom: 8,
                  }}
                >
                  Rating
                </div>
                <div style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
                  ★ {u.rating}
                </div>
              </div>
            </div>

            {/* credits */}
            <div
              style={{
                marginTop: 24,
                padding: "20px",
                borderRadius: 22,
                background: `${u.glow}12`,
                border: `1px solid ${u.glow}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: isMobile ? 14 : 0,
              }}
            >
              <span style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>
                Total Credits
              </span>

              <span
                style={{
                  color: u.glow,
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {u.credits} CR
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
