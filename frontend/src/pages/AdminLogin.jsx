import { useState } from "react";
import { http } from "../api/client";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "../components/primitives";

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isMobile = window.innerWidth < 768;

  const handleLogin = async () => {

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      localStorage.clear();

      const res = await http.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem(
        "sx_token",
        res.token || res.access_token
      );

      const me = await http.get("/auth/me");

      const role = (me.role || "").toUpperCase();

      localStorage.setItem("sx_role", role);

      if (role !== "ADMIN") {
        setError("Access denied — not an admin account.");
        return;
      }

      sessionStorage.setItem("admin_logged", "true");

      navigate("/admin/disputes");

    } catch (e) {

      setError("Invalid credentials.");

    } finally {

      setLoading(false);

    }
  };

  const handleKey = e => {
    if (e.key === "Enter") handleLogin();
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#07080f",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: isMobile
          ? "10px 16px 40px"
          : "40px",

        position: "relative",

        overflow: "hidden",
        overflowX: "hidden",

        isolation: "isolate"
      }}
    >

      <ParticleField />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(7,8,15,.72), rgba(7,8,15,.96))",
          zIndex: 0
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",

          top: "50%",
          left: "50%",

          transform: "translate(-50%,-50%)",

          width: isMobile ? 420 : 700,
          height: isMobile ? 320 : 500,

          background:
            "radial-gradient(ellipse,rgba(255,200,50,.08),transparent 70%)",

          filter: "blur(40px)",

          pointerEvents: "none",

          zIndex: 0
        }}
      />

      {/* Background rings */}
      {[280, 200, 130].map((sz, i) => (
        <div
          key={i}
          style={{
            position: "absolute",

            top: "50%",
            left: "50%",

            width: isMobile ? sz * 0.8 : sz,
            height: isMobile ? sz * 0.8 : sz,

            borderRadius: "50%",

            border: `1px solid rgba(255,200,50,${
              .03 + i * .04
            })`,

            transform: "translate(-50%,-50%)",

            animation:
              `${i % 2 ? "spinCCW" : "spinCW"} ${
                20 + i * 6
              }s linear infinite`,

            pointerEvents: "none",

            zIndex: 0
          }}
        />
      ))}

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",

          top: isMobile ? 20 : 30,
          left: isMobile ? 16 : 30,

          zIndex: 10,

          padding: isMobile
            ? "10px 14px"
            : "12px 18px",

          borderRadius: 14,

          border:
            "1px solid rgba(255,255,255,.08)",

          background:
            "rgba(255,255,255,.03)",

          color: "white",

          fontSize: isMobile ? 11 : 13,

          letterSpacing: 3,
          textTransform: "uppercase",

          cursor: "pointer",

          display: "flex",
          alignItems: "center",
          gap: 10,

          backdropFilter: "blur(10px)",

          transition: "all .25s"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor =
            "rgba(255,200,50,.35)";

          e.currentTarget.style.color =
            "#ffc832";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor =
            "rgba(255,255,255,.08)";

          e.currentTarget.style.color =
            "white";
        }}
      >
        ← Back to Home
      </button>

      {/* Login Card */}
      <div
        style={{
          position: "relative",

          width: "100%",
          maxWidth: 440,

          zIndex: 2,

          animation:
            "fadeUp .6s .1s ease both"
        }}
      >

        {/* Glow border */}
        <div
          style={{
            position: "absolute",
            inset: -1,

            borderRadius: 28,

            background:
              "linear-gradient(135deg,rgba(255,200,50,.3),rgba(255,107,53,.12))",

            filter: "blur(1px)"
          }}
        />

        {/* Card */}
        <div
          style={{
            position: "relative",

            background:
              "linear-gradient(145deg,rgba(13,14,22,.94),rgba(8,9,16,.96))",

            backdropFilter: "blur(16px)",

            borderRadius: 28,

            border:
              "1px solid rgba(255,255,255,.08)",

            overflow: "hidden"
          }}
        >

          {/* top line */}
          <div
            style={{
              height: 1,

              background:
                "linear-gradient(90deg,transparent,#ffc832 40%,#ff6b35 60%,transparent)"
            }}
          />

          <div
            style={{
              padding: isMobile
                ? "34px 22px 24px"
                : "40px 36px 36px"
            }}
          >

            {/* Logo */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 28
              }}
            >

              <div
                style={{
                  position: "relative",

                  width: isMobile ? 48 : 56,
                  height: isMobile ? 48 : 56
                }}
              >

                {[56, 42, 28].map((sz, i) => (

                  <div
                    key={i}
                    style={{
                      position: "absolute",

                      top: "50%",
                      left: "50%",

                      width: isMobile
                        ? sz * 0.85
                        : sz,

                      height: isMobile
                        ? sz * 0.85
                        : sz,

                      borderRadius: "50%",

                      border:
                        `1px solid rgba(255,200,50,${
                          .2 + i * .25
                        })`,

                      transform:
                        "translate(-50%,-50%)",

                      animation:
                        `${i % 2
                          ? "spinCCW"
                          : "spinCW"} ${
                          8 + i * 3
                        }s linear infinite`
                    }}
                  />

                ))}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >

                  <div
                    style={{
                      width: 10,
                      height: 10,

                      borderRadius: "50%",

                      background: "#ffc832",

                      boxShadow:
                        "0 0 20px rgba(255,200,50,.6)"
                    }}
                  />

                </div>
              </div>
            </div>

            {/* Heading */}
            <h2
              className="clash"
              style={{
                fontSize: isMobile ? 28 : 37,

                fontWeight: 700,

                color: "white",

                textAlign: "center",

                marginBottom: 6,

                lineHeight: 1.1
              }}
            >
              Admin Access
            </h2>

            <p
              style={{
                fontSize: isMobile ? 15 : 19,

                color: "rgba(255,255,255,.32)",

                textAlign: "center",

                marginBottom: 32,

                lineHeight: 1.6
              }}
            >
              Restricted area — authorised personnel only
            </p>

            {/* Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >

              {[
                {
                  label: "Email Address",
                  type: "email",
                  val: email,
                  set: setEmail
                },
                {
                  label: "Password",
                  type: "password",
                  val: password,
                  set: setPassword
                }
              ].map(f => (

                <div
                  key={f.label}
                  style={{ position: "relative" }}
                >

                  <input
                    type={f.type}

                    value={f.val}

                    onChange={e =>
                      f.set(e.target.value)
                    }

                    onKeyDown={handleKey}

                    placeholder=" "

                    disabled={loading}

                    style={{
                      width: "100%",

                      background:
                        "rgba(255,255,255,.06)",

                      border:
                        "1px solid rgba(255,255,255,.1)",

                      borderRadius: 12,

                      padding:
                        "18px 16px 6px",

                      color: "white",

                      fontSize: 14,

                      outline: "none",

                      fontFamily: "inherit",

                      transition:
                        "border-color .25s",

                      boxSizing: "border-box",

                      opacity: loading ? .6 : 1
                    }}

                    onFocus={e =>
                      e.target.style.borderColor =
                        "rgba(255,200,50,.6)"
                    }

                    onBlur={e =>
                      e.target.style.borderColor =
                        "rgba(255,255,255,.1)"
                    }
                  />

                  <label
                    style={{
                      position: "absolute",

                      top: 7,
                      left: 16,

                      fontSize: 8,

                      letterSpacing: 3,

                      textTransform: "uppercase",

                      color:
                        "rgba(255,255,255,.3)",

                      pointerEvents: "none"
                    }}
                  >
                    {f.label}
                  </label>

                </div>

              ))}

              {/* Error */}
              {error && (
                <div
                  style={{
                    background:
                      "rgba(255,80,80,.1)",

                    border:
                      "1px solid rgba(255,80,80,.25)",

                    borderRadius: 10,

                    padding: "10px 14px",

                    fontSize: 12,

                    color: "#ff9090"
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}

                disabled={loading}

                style={{
                  marginTop: 4,

                  background: loading
                    ? "rgba(255,200,50,.45)"
                    : "#ffc832",

                  color: "#000",

                  borderRadius: 12,

                  padding: isMobile
                    ? "15px"
                    : "16px",

                  fontSize: 14,

                  letterSpacing: 4,

                  textTransform: "uppercase",

                  fontWeight: 700,

                  border: "none",

                  width: "100%",

                  boxShadow: loading
                    ? "none"
                    : "0 0 40px rgba(255,200,50,.25)",

                  transition: "all .3s",

                  cursor: loading
                    ? "not-allowed"
                    : "pointer"
                }}
              >
                {loading
                  ? "Verifying..."
                  : "Enter Admin Panel →"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}