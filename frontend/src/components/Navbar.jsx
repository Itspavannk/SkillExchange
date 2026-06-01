import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagneticButton } from "./primitives";
import { NAV_LINKS } from "../data/constants";
import { useScrolled } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";

export default function Navbar({ onOpenModal, onAddSkill }) {
  const scrolled = useScrolled(5);
  const { isAuth, user, authLogout } = useAuth();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isMobile, isTablet, isLaptop } = useResponsive();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "14px 16px" : isTablet ? "16px 28px" : "16px 28px",
        transition: "all .6s ease",
        background: scrolled ? "rgba(7,8,15,.93)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.05)" : "none",
        width: "100%",
        overflow: "visible",

        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 8 : 10,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {" "}
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: isMobile ? 58 : isTablet ? 84 : 90,

            height: isMobile ? 58 : isTablet ? 84 : 90,
            objectFit: "contain",
            position: "relative",
            top: isMobile ? 0 : -4,
            right: isMobile ? 0 : 0,
          }}
        />
        <span
          className="clash"
          style={{
            fontSize: isMobile ? 22 : isTablet ? 28 : 30,
            fontWeight: 700,
            color: "white",
            letterSpacing: isMobile ? 0.5 : 2,
            whiteSpace: "nowrap",
          }}
        >
          SkillExchange
        </span>
      </div>

      {/* Center nav links */}
      {location.pathname === "/" && !isTablet && !isMobile && (
        <div
          style={{
            display: "flex",
            gap: 2,
            marginLeft: isTablet ? 16 : 40,
            marginRight: isTablet ? 16 : 20,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 40,
            padding: "6px 6px",
          }}
        >
          {NAV_LINKS.map((n) => (
            <a
              key={n.label}
              href={n.href}
              data-tip={n.label.toUpperCase()}
              style={{
                padding: isTablet ? "12px 8px" : "12px 8px",
                borderRadius: 30,
                fontSize: isTablet ? 10 : 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "rgba(255,255,255,.36)",
                textDecoration: "none",
                transition: "all .3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
                e.target.style.background = "rgba(255,255,255,.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "rgba(255,255,255,.36)";
                e.target.style.background = "transparent";
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
      )}

      {isMobile && (
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => {
              const next = !menuOpen;

              setMenuOpen(next);

              document.body.style.overflow = next ? "hidden" : "auto";
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.04)",
              color: "white",
              fontSize: 22,
              flexShrink: 0,
              cursor: "pointer",
              backdropFilter: "blur(20px)",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* Right side */}
      {isAuth && user && !isMobile ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 12,
          }}
        >
          {/* + List Skill */}
          <MagneticButton
            onClick={onAddSkill}
            style={{
              border: "1px solid rgba(255,200,50,.3)",
              color: "#ffc832",
              borderRadius: 30,
              padding: isMobile ? "12px 14px" : "16px 20px",

              fontSize: isMobile ? 12 : 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
              background: "transparent",
            }}
          >
            + Skill
          </MagneticButton>

          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {/* Trigger pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255,200,50,.2)",
                background: "rgba(255,200,50,.06)",
                borderRadius: 40,
                padding: "7px 16px",
                cursor: "pointer",
              }}
            >
              {/* Avatar */}
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ffc832",
                  }}
                />
              ) : null}

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#ffc832,#ff8a00)",
                  display: user?.profileImage ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 12,
                  border: "2px solid #ffc832",
                  flexShrink: 0,
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>

              {/* Credits */}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#ffc832" }}>
                {user.credits ?? 0} CR
              </span>

              <span
                style={{
                  width: 1,
                  height: 14,
                  background: "rgba(255,255,255,.12)",
                }}
              />

              {/* Name */}
              <span style={{ fontSize: 16, color: "rgba(255,255,255,.7)" }}>
                {user.name}
              </span>

              <span style={{ fontSize: 25, color: "rgba(255,255,255,.3)" }}>
                ▾
              </span>
            </div>

            {/* Dropdown */}
            <div
              style={{
                position: "absolute",
                top: "calc(100%)",
                right: 7,
                width: 200,
                background: "#0d0e16",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,.6)",
                opacity: hovering ? 1 : 0,
                transform: hovering
                  ? "translateY(0) scale(1)"
                  : "translateY(-8px) scale(.97)",
                pointerEvents: hovering ? "all" : "none",
                transition: "opacity .25s, transform .25s",
                zIndex: 300,
                padding: "10px",
              }}
            >
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,#ffc832,transparent)",
                }}
              />
              {[
                {
                  label: "Home",
                  action: () => {
                    window.location.href = "/";
                  },
                },
                { label: "Sessions", action: () => navigate("/sessions") },
                {
                  label: "Notifications",
                  action: () => navigate("/notifications"),
                },
                {
                  label: "Leaderboard",
                  action: () => navigate("/leaderboard"),
                },
                { label: "My Skills", action: () => navigate("/my-skills") },
                { label: "Profile", action: () => navigate("/profile") },
                { label: "Help Center", action: () => navigate("/help") },
                ...(user?.role === "admin"
                  ? [
                      {
                        label: "Admin Dashboard",
                        action: () => navigate("/admin/disputes"),
                      },
                    ]
                  : []),
                {
                  label: "Sign Out",
                  action: () => {
                    authLogout();
                    navigate("/");
                    document.body.style.overflow = "auto";
                  },
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={item.action}
                  style={{
                    padding: "15px 25px",
                    fontSize: 16,
                    color: "rgba(255,255,255,.6)",
                    cursor: "pointer",
                    transition: "all .2s",
                    borderBottom:
                      i < 2 ? "1px solid rgba(255,255,255,.04)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,200,50,.08)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,.6)";
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <MagneticButton
            onClick={() => {
              authLogout();
              navigate("/");
              document.body.style.overflow = "auto";
            }}
            style={{
              border: "1px solid rgba(255,255,255,.2)",
              color: "rgba(255,255,255,.5)",
              borderRadius: 30,
              padding: "17px 20px",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
              background: "transparent",
            }}
          >
            Sign Out
          </MagneticButton>
        </div>
      ) : (
        !isMobile && (
          <MagneticButton
            onClick={onOpenModal}
            style={{
              background: "#ffc832",
              borderRadius: 40,
              padding: "25px 24px",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#000",
              border: "none",
            }}
          >
            Get Started →
          </MagneticButton>
        )
      )}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            width: "60%",
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: 200,
            background: "rgba(10,12,20,.96)",
            border: "1px solid rgba(255,255,255,.08)",
            overflowX: "hidden",
            right: 10,
            left: "auto",
            top: "calc(100% + 1px)",
            zIndex: 999,
            borderRadius: 28,
            backdropFilter: "blur(30px)",
            padding: "12px 0",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            gap: isTablet ? 0 : 2,
            boxShadow: "0 30px 100px rgba(0,0,0,.55)",
          }}
        >
          {isAuth ? (
            <>
              {[
                { label: "Home", action: () => navigate("/") },
                { label: "Sessions", action: () => navigate("/sessions") },
                {
                  label: "Notifications",
                  action: () => navigate("/notifications"),
                },
                {
                  label: "Leaderboard",
                  action: () => navigate("/leaderboard"),
                },
                { label: "My Skills", action: () => navigate("/my-skills") },
                { label: "Profile", action: () => navigate("/profile") },
                { label: "Help Center", action: () => navigate("/help") },

                ...(user?.role === "admin"
                  ? [
                      {
                        label: "Admin Dashboard",
                        action: () => navigate("/admin/disputes"),
                      },
                    ]
                  : []),
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setMenuOpen(false);
                  }}
                  style={{
                    padding: "15px 12px",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,.05)",
                    color: "rgba(255,255,255,.75)",
                    fontSize: 16,
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </button>
              ))}
              {isAuth && (
                <MagneticButton
                  onClick={() => {
                    setMenuOpen(false);
                    onAddSkill();
                  }}
                  style={{
                    width: "100%",
                    justifyContent: "center",

                    border: "1px solid rgba(255,200,50,.3)",
                    color: "#ffc832",

                    borderRadius: 18,
                    padding: "16px 18px",

                    fontSize: 14,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    fontWeight: 700,

                    background: "transparent",

                    marginTop: 12,
                  }}
                >
                  + Skill
                </MagneticButton>
              )}

              <button
                onClick={() => {
                  authLogout();
                  navigate("/");
                  document.body.style.overflow = "auto";
                }}
                style={{
                  padding: "18px 22px",
                  background: "transparent",
                  border: "none",
                  color: "#ff7b7b",
                  fontSize: 16,
                  textAlign: "left",
                  fontWeight: 700,
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "14px 22px",
                    textDecoration: "none",
                    color: "white",
                    fontSize: 14,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </a>
              ))}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenModal();
                }}
                style={{
                  margin: "12px",
                  padding: "14px",
                  borderRadius: 18,
                  border: "none",
                  background: "#ffc832",
                  color: "#000",
                  fontWeight: 700,
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
