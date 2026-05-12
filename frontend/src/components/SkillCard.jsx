import { useState } from "react";
import { TiltCard } from "./primitives";
import { useReveal, useResponsive } from "../hooks";
import { CATEGORY_ACCENT, DEFAULT_ACCENT } from "../data/constants";

export default function SkillCard({ skill, index, onSelect }) {
  const [ref, visible] = useReveal(index * 80);
  const [hov, setHov] = useState(false);
  const { isMobile } = useResponsive();

  const {
    title = "Untitled",
    description = "",
    category = "General",
    level = "",
    creditsPerHour = 0,
    ownerName = "Unknown",
    ownerAverageRating = 0,
    ownerRatingCount = 0,
    skillAverageRating = 0,
    skillRatingCount = 0,
  } = skill;

  const normalizedCategory = category?.trim().toLowerCase();
  const accent = Object.keys(CATEGORY_ACCENT).find(
    (k) => k.toLowerCase() === normalizedCategory,
  )
    ? CATEGORY_ACCENT[
        Object.keys(CATEGORY_ACCENT).find(
          (k) => k.toLowerCase() === normalizedCategory,
        )
      ]
    : DEFAULT_ACCENT;

  const safeName = ownerName || "Unknown";

  const initials = safeName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const skillRating = skillAverageRating || 0;
  const teacherRating = ownerAverageRating || 0;

  function Stars({ rating, color }) {
    return (
      <div style={{ display: "flex", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            style={{
              fontSize: isMobile ? 18 : 25,
              color: n <= Math.round(rating) ? color : "rgba(255,255,255,.12)",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(55px)",
        transition: "opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)",
        height: "100%",
      }}
    >
      <TiltCard
        style={{
          height: "100%",

          minHeight: isMobile ? 380 : 530,
          maxHeight: isMobile ? 380 : 530,

          width: "100%",

          minWidth: isMobile ? 0 : 380,
          maxWidth: isMobile ? "100%" : 380,
        }}
      >
        <div
          onClick={() => onSelect(skill)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(145deg,#10111a,#0c0d14)",
            border: `1px solid ${hov ? accent + "35" : "rgba(255,255,255,.07)"}`,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            borderRadius: 24,
            padding: isMobile ? 10 : 22,
            overflow: "hidden",
            transition: "border-color .4s",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: 24,
              opacity: hov ? 1 : 0,
              background:
                "radial-gradient(280px at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.035),transparent 70%)",
              transition: "opacity .5s",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 16,
              right: 16,
              height: 1,
              background: `linear-gradient(90deg,transparent,${accent},transparent)`,
              opacity: hov ? 1 : 0,
              transition: "opacity .4s",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -32,
              right: -32,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: accent,
              filter: "blur(56px)",
              opacity: hov ? 0.2 : 0,
              transition: "opacity .7s",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginBottom: isMobile ? 10 : 16,
                alignSelf: "flex-start",
                padding: isMobile ? "4px 10px" : "5px 12px",
                borderRadius: 30,
                border: `1px solid ${accent}30`,
                background: `${accent}12`,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: accent,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: accent,
                }}
              >
                {category}
              </span>
            </div>

            <h3
              className="clash"
              style={{
                fontSize: isMobile ? 20 : 30,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.15,
                marginBottom: isMobile ? 2 : 6,
              }}
            >
              {title}
            </h3>
            <div
              className="premium-scroll"
              style={{
                color: "rgba(255,255,255,.58)",
                fontSize: isMobile ? 11 : 15,
                lineHeight: 1.45,
                marginTop: isMobile ? 4 : 8,
                marginBottom: isMobile ? 2 : 5,

                minHeight: isMobile ? 75 : 130,
                maxHeight: isMobile ? 75 : 130,

                overflowY: "auto",
                overflowX: "hidden",

                wordBreak: "break-word",
                whiteSpace: "pre-wrap",

                paddingRight: 6,
                scrollbarWidth: "thin",
              }}
            >
              {description}
            </div>
            {level && (
              <p
                style={{
                  fontSize: isMobile ? 9 : 13,
                  color: `${accent}90`,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: isMobile ? 4 : 10,
                }}
              >
                {level}
              </p>
            )}

            {/* Dual Rating Block */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 10,
                marginBottom: isMobile ? 5 : 10,
                padding: isMobile ? "6px 8px" : "10px 12px",
                background: "rgba(255,255,255,.03)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: isMobile ? 8 : 12,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.3)",
                    marginBottom: 5,
                  }}
                >
                  Skill Rating
                </div>
                <Stars rating={skillRating} color={accent} />
                <div
                  style={{
                    fontSize: isMobile ? 10 : 13,
                    color: "rgba(255,255,255,.45)",
                    marginTop: 3,
                  }}
                >
                  {skillRatingCount > 0 ? (
                    <>
                      {skillRating.toFixed(1)} · {skillRatingCount}{" "}
                      {skillRatingCount === 1 ? "review" : "reviews"}
                    </>
                  ) : (
                    <span
                      style={{
                        color: "rgba(255,255,255,.2)",
                        fontStyle: "italic",
                      }}
                    >
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  borderLeft: "1px solid rgba(255,255,255,.06)",
                  paddingLeft: 10,
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 8 : 12,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.3)",
                    marginBottom: 3,
                  }}
                >
                  Teacher Rating
                </div>
                <Stars rating={teacherRating} color="#ffc832" />
                <div
                  style={{
                    fontSize: isMobile ? 9 : 13,
                    color: "rgba(255,255,255,.45)",
                    marginTop: 3,
                  }}
                >
                  {ownerRatingCount > 0 ? (
                    <>
                      {teacherRating.toFixed(1)} · {ownerRatingCount}{" "}
                      {ownerRatingCount === 1 ? "review" : "reviews"}
                    </>
                  ) : (
                    <span
                      style={{
                        color: "rgba(255,255,255,.2)",
                        fontStyle: "italic",
                      }}
                    >
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: isMobile ? 5 : 8,
                borderTop: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `linear-gradient(135deg,${accent}50,${accent}15)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {initials}
                </div>
                <span
                  style={{
                    fontSize: isMobile ? 13 : 20,
                    maxWidth: isMobile ? 120 : "unset",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "rgba(255,255,255,.7)",
                  }}
                >
                  {ownerName}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  className="clash"
                  style={{
                    fontSize: isMobile ? 22 : 28,
                    fontWeight: 700,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  {creditsPerHour}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 8 : 12,
                    color: "rgba(255,255,255,.8)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  credits/hr
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
