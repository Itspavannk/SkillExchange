import React, { useState } from "react";
import useResponsive from "../hooks/useResponsive";
import { ParticleField } from "../components/primitives";

const faqs = [
  {
    q: "How does SkillExchange work?",
    a: "SkillExchange allows users to teach skills and earn credits instead of money. Those credits can later be used to learn from others."
  },
  {
    q: "How does escrow protection work?",
    a: "Credits are safely held in escrow when a booking is made. They are released only after successful session completion."
  },
  {
    q: "How can I raise a dispute?",
    a: "Go to Sessions → Open the booking → Click Raise Dispute and describe the issue."
  },
  {
    q: "How are credits transferred?",
    a: "Credits automatically transfer after both participants confirm successful completion of the session."
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. Pending bookings can be cancelled before the scheduled session time."
  }
];

function FAQItem({ item, i, open, setOpen, isMobile }) {
  const active = open === i;

  return (
    <div
      style={{
        borderRadius: isMobile ? 22 : 28,
        overflow: "hidden",
        background:
          "linear-gradient(145deg,rgba(16,17,26,.88),rgba(12,13,20,.92))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: active
          ? "1px solid rgba(255,200,50,.22)"
          : "1px solid rgba(255,255,255,.07)",
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div
        onClick={() => setOpen(active ? null : i)}
        style={{
          padding: isMobile ? "20px" : "26px 30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16
        }}
      >
        <h3
          className="clash"
          style={{
            margin: 0,
            color: "white",
            fontSize: isMobile ? 20 : 28,
            lineHeight: 1.3
          }}
        >
          {item.q}
        </h3>

        <div
          style={{
            minWidth: isMobile ? 38 : 42,
            width: isMobile ? 38 : 42,
            height: isMobile ? 38 : 42,
            borderRadius: "50%",
            background: active
              ? "rgba(255,200,50,.15)"
              : "rgba(255,255,255,.05)",
            border: active
              ? "1px solid rgba(255,200,50,.3)"
              : "1px solid rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: active ? "#ffc832" : "white",
            fontSize: isMobile ? 20 : 24,
            transition: "all .3s"
          }}
        >
          {active ? "−" : "+"}
        </div>
      </div>

      <div
        style={{
          maxHeight: active ? 300 : 0,
          overflow: "hidden",
          transition: "all .45s cubic-bezier(.16,1,.3,1)"
        }}
      >
        <div
          style={{
            padding: isMobile ? "0 20px 22px" : "0 30px 28px",
            color: "rgba(255,255,255,.5)",
            lineHeight: 1.9,
            fontSize: isMobile ? 15 : 17
          }}
        >
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function HelpCenterPage() {
  const [open, setOpen] = useState(0);

  const { isMobile, isTablet } = useResponsive();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07080f",
        padding: isMobile
          ? "110px 16px 40px"
          : isTablet
          ? "130px 32px 70px"
          : "140px 80px 100px",
        position: "relative",
        overflow: "hidden",
        overflowX: "hidden",
        isolation: "isolate"
      }}
    >

      <ParticleField />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(7,8,15,.72), rgba(7,8,15,.96))",
          zIndex: 0
        }}
      />

      {/* background glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: isMobile ? 350 : 700,
          height: isMobile ? 350 : 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,200,50,.12), transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: isMobile ? 40 : 70
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 18
          }}
        >

          <div
            style={{
              width: isMobile ? 40 : 52,
              height: 1,
              background: "#ffc832"
            }}
          />

          <div
            style={{
              color: "#ffc832",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontSize: isMobile ? 11 : 13
            }}
          >
            Support & Guidance
          </div>

        </div>

        <h1
          className="clash"
          style={{
            margin: 0,
            color: "white",
            fontSize: isMobile
              ? "clamp(42px,12vw,62px)"
              : "clamp(60px,8vw,120px)",
            lineHeight: 1
          }}
        >
          Help Center
        </h1>

        <p
          style={{
            marginTop: 26,
            maxWidth: 760,
            color: "rgba(255,255,255,.5)",
            lineHeight: 1.9,
            fontSize: isMobile ? 15 : 18
          }}
        >
          Everything you need to know about bookings, credits,
          escrow protection, disputes, and mentoring on SkillExchange.
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: isMobile ? 36 : 50,
          maxWidth: 900
        }}
      >
        <input
          placeholder="Search help articles..."
          style={{
            width: "100%",
            padding: isMobile ? "18px 20px" : "24px 30px",
            borderRadius: isMobile ? 20 : 26,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            outline: "none",
            color: "white",
            fontSize: isMobile ? 15 : 18,
            backdropFilter: "blur(20px)",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* FAQ */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 16 : 22,
          maxWidth: 1000,
          position: "relative",
          zIndex: 2
        }}
      >
        {faqs.map((f, i) => (
          <FAQItem
            key={i}
            item={f}
            i={i}
            open={open}
            setOpen={setOpen}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Support Card */}
      <div
        style={{
          marginTop: isMobile ? 40 : 60,
          maxWidth: 1000,
          padding: isMobile ? "24px" : "36px",
          borderRadius: isMobile ? 24 : 34,
          background:
            "linear-gradient(145deg,rgba(16,17,26,.88),rgba(12,13,20,.92))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,200,50,.15)",
          position: "relative",
          overflow: "hidden",
          zIndex: 2
        }}
      >

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #ffc832, transparent)"
          }}
        />

        <div
          className="clash"
          style={{
            color: "white",
            fontSize: isMobile ? 28 : 40,
            marginBottom: 18,
            lineHeight: 1.2
          }}
        >
          Need More Help?
        </div>

        <p
          style={{
            color: "rgba(255,255,255,.5)",
            lineHeight: 1.8,
            maxWidth: 700,
            fontSize: isMobile ? 15 : 17
          }}
        >
          Our support team is available to assist you with disputes,
          technical issues, bookings, and account-related questions.
        </p>

        <button
          style={{
            marginTop: 28,
            width: isMobile ? "100%" : "auto",
            padding: isMobile ? "16px 22px" : "18px 28px",
            borderRadius: 18,
            border: "none",
            background: "#ffc832",
            color: "#000",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 20px 60px rgba(255,200,50,.22)"
          }}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}