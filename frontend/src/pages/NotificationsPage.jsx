import React from "react";
import useResponsive from "../hooks/useResponsive";

const notifications = [
  {
    title: "Session Starting Soon",
    message: "Your UI/UX Mentorship session starts in 30 minutes.",
    time: "Now",
    color: "#ffc832",
    icon: "⏳",
  },
  {
    title: "Credits Released",
    message: "+15 CR added after successful session completion.",
    time: "1 hour ago",
    color: "#22c55e",
    icon: "⬡",
  },
  {
    title: "New Review Received",
    message: "Akash rated your React session ★★★★★",
    time: "Yesterday",
    color: "#b06aff",
    icon: "★",
  },
  {
    title: "Booking Confirmed",
    message: "Python Basics session confirmed successfully.",
    time: "2 days ago",
    color: "#38bdf8",
    icon: "✓",
  },
];
export default function NotificationsPage() {
  const { isMobile } = useResponsive();
  return (
    <div
      style={{
        overflowX: "hidden",
        minHeight: "100vh",
        padding: isMobile ? "110px 16px 40px" : "140px 80px 80px",
        background: "#07080f",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 50,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "#ffc832",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            Activity Center
          </div>

          <h1
            className="clash"
            style={{
              fontSize: "clamp(48px,6vw,90px)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Notifications
          </h1>
        </div>

        <button
          style={{
            width: isMobile ? "100%" : "auto",
            fontSize: isMobile ? 12 : 14,
            justifyContent: "center",
            padding: "14px 24px",
            borderRadius: 18,
            border: "1px solid rgba(255,200,50,.25)",
            background: "rgba(255,200,50,.08)",
            color: "#ffc832",
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 1000,
        }}
      >
        {notifications.map((n, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              padding: isMobile ? "20px" : "28px 30px",
              borderRadius: 28,
              background: "linear-gradient(145deg,#10111a,#0c0d14)",
              border: "1px solid rgba(255,255,255,.07)",
              overflow: "hidden",
              transition: "all .35s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = `${n.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
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
                background: `linear-gradient(90deg, transparent, ${n.color}, transparent)`,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {/* icon */}
              <div
                style={{
                  minWidth: isMobile ? 50 : 58,
                  height: isMobile ? 50 : 58,
                  fontSize: isMobile ? 20 : 24,
                  borderRadius: 18,
                  background: `${n.color}15`,
                  border: `1px solid ${n.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: n.color,
                  fontWeight: 700,
                }}
              >
                {n.icon}
              </div>

              {/* content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    className="clash"
                    style={{
                      margin: 0,
                      fontSize: isMobile ? 22 : 28,
                    }}
                  >
                    {n.title}
                  </h3>

                  <span
                    style={{
                      color: "rgba(255,255,255,.35)",
                      fontSize: 14,
                      letterSpacing: 1,
                    }}
                  >
                    {n.time}
                  </span>
                </div>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    color: "rgba(255,255,255,.5)",
                    lineHeight: 1.7,
                    fontSize: isMobile ? 15 : 17,
                  }}
                >
                  {n.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
