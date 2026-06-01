import { useEffect, useState } from "react";
import { http } from "../api/client";
import { MagneticButton, ParticleField } from "../components/primitives";
import { useNavigate } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";
// ADD this import at the top:
import GlobalStyles from "../styles/GlobalStyles";
// ADD import:
import { Cursor, GrainOverlay } from "../components/primitives";

function Modal({ onClose, children }) {
  const { isMobile } = useResponsive();
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: isMobile ? 16 : 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          animation: "modalIn .4s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: isMobile ? 20 : 24,
            background:
              "linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.1))",
            filter: "blur(1px)",
          }}
        />
        <div
          style={{
            position: "relative",
            background:
              "linear-gradient(145deg,rgba(13,14,22,.94),rgba(8,9,16,.96))",
            backdropFilter: "blur(16px)",
            borderRadius: isMobile ? 20 : 24,
            border: "1px solid rgba(255,255,255,.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg,transparent,#ffc832 40%,#ff6b35 60%,transparent)",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

const STATUS_COLOR = {
  open: { color: "#ffc832", bg: "rgba(255,200,50,.12)" },
  resolved: { color: "#22c55e", bg: "rgba(34,197,94,.12)" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,.12)" },
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmData, setConfirmData] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const fetchDisputes = async () => {
    try {
      const data = await http.get("/disputes/admin");
      setDisputes(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdminLogged = sessionStorage.getItem("admin_logged");
    if (!isAdminLogged) {
      localStorage.removeItem("sx_role");
      navigate("/admin/login");
      return;
    }
    fetchDisputes();
  }, []);

  const resolve = async (id, refund) => {
    try {
      await http.post(`/disputes/admin/${id}/resolve?refund=${refund}`);
      fetchDisputes();
    } catch (e) {
      console.error(e);
    }
  };

  const ask = (message, action) => setConfirmData({ message, action });

  const filtered =
    filter === "all" ? disputes : disputes.filter((d) => d.status === filter);
  const counts = {
    all: disputes.length,
    open: disputes.filter((d) => d.status === "open").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
    rejected: disputes.filter((d) => d.status === "rejected").length,
  };

  const pad = isMobile
    ? "110px 16px 48px"
    : isTablet
      ? "120px 32px 60px"
      : "120px 48px 80px";

  return (
    <div
      style={{
        background: "#07080f",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <GlobalStyles />
      <Cursor />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ParticleField />
      </div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(to bottom,rgba(7,8,15,.72),rgba(7,8,15,.96))",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "10%",
          width: isMobile ? 300 : 600,
          height: isMobile ? 180 : 300,
          background:
            "radial-gradient(ellipse,rgba(255,200,50,.04),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
          padding: pad,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 24 : 32,
          boxSizing: "border-box",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ width: "100%" }}>
            {/* Back button */}
            <button
              onClick={() => navigate("/")}
              style={{
                marginBottom: isMobile ? 18 : 24,
                padding: isMobile ? "10px 14px" : "12px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
                color: "white",
                fontSize: isMobile ? 11 : 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                transition: "all .25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,200,50,.35)";
                e.currentTarget.style.color = "#ffc832";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                e.currentTarget.style.color = "white";
              }}
            >
              ← Back to Home
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: isMobile ? 24 : 32,
                  height: 1,
                  background: "#ffc832",
                }}
              />
              <span
                style={{
                  fontSize: isMobile ? 11 : 15,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "#ffc832",
                  fontWeight: 700,
                }}
              >
                Admin Panel
              </span>
            </div>

            <h1
              className="clash"
              style={{
                fontSize: isMobile
                  ? "clamp(34px,10vw,52px)"
                  : "clamp(42px,5vw,70px)",
                lineHeight: 1,
                margin: 0,
              }}
            >
              <span style={{ color: "white" }}>Dispute </span>
              <span style={{ color: "#ffc832", fontStyle: "italic" }}>
                Resolution
              </span>
            </h1>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 10 : 16,
              overflowX: isMobile ? "auto" : "visible",
              width: isMobile ? "100%" : "auto",
              paddingBottom: isMobile ? 4 : 0,
              scrollbarWidth: "none",
            }}
          >
            {[
              { label: "Open", val: counts.open, color: "#ffc832" },
              { label: "Resolved", val: counts.resolved, color: "#22c55e" },
              { label: "Rejected", val: counts.rejected, color: "#ef4444" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: isMobile ? "12px 16px" : "16px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.07)",
                  textAlign: "center",
                  minWidth: isMobile ? 90 : 120,
                  flexShrink: 0,
                }}
              >
                <div
                  className="clash"
                  style={{
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.3)",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: isMobile ? "auto" : "visible",
            width: isMobile ? "100%" : "fit-content",
            padding: 4,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 50,
            scrollbarWidth: "none",
            boxSizing: "border-box",
          }}
        >
          {["open", "resolved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: isMobile ? "10px 14px" : "10px 22px",
                borderRadius: 40,
                fontSize: isMobile ? 10 : 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 700,
                border: "none",
                transition: "all .3s",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
                background: filter === f ? "#ffc832" : "transparent",
                color: filter === f ? "#000" : "rgba(255,255,255,.35)",
              }}
            >
              {f}{" "}
              {counts[f] > 0 && (
                <span style={{ opacity: 0.7 }}>({counts[f]})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              color: "rgba(255,255,255,.3)",
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid rgba(255,200,50,.3)",
                borderTopColor: "#ffc832",
                animation: "spinCW .8s linear infinite",
              }}
            />
            Loading disputes...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: isMobile ? "40px 20px" : "60px 40px",
              borderRadius: 24,
              border: "1px dashed rgba(255,255,255,.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: isMobile ? 34 : 40, marginBottom: 16 }}>
              ⚖
            </div>
            <p
              style={{
                color: "rgba(255,255,255,.3)",
                fontSize: isMobile ? 12 : 14,
                letterSpacing: 2,
              }}
            >
              NO DISPUTES FOUND
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile || isTablet ? "1fr" : "repeat(2,minmax(0,1fr))",
              gap: isMobile ? 16 : 20,
            }}
          >
            {filtered.map((d) => {
              const sc = STATUS_COLOR[d.status] || {
                color: "#999",
                bg: "rgba(153,153,153,.1)",
              };
              return (
                <div
                  key={d.id}
                  style={{
                    position: "relative",
                    padding: isMobile ? 18 : 28,
                    borderRadius: isMobile ? 20 : 24,
                    background:
                      "linear-gradient(145deg,rgba(16,17,26,.88),rgba(12,13,20,.92))",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,.07)",
                    overflow: "hidden",
                    transition: "border-color .3s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,200,50,.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,.07)")
                  }
                >
                  {/* Top shimmer */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg,transparent,${sc.color}50,transparent)`,
                    }}
                  />

                  {/* Status + booking ID */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 30,
                        background: sc.bg,
                        border: `1px solid ${sc.color}30`,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sc.color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: isMobile ? 10 : 11,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: sc.color,
                        }}
                      >
                        {d.status}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: isMobile ? 13 : 15,
                        color: "rgba(255,255,255,.2)",
                        letterSpacing: 2,
                      }}
                    >
                      #{d.bookingId}
                    </span>
                  </div>

                  {/* Skill title */}
                  <h3
                    className="clash"
                    style={{
                      fontSize: isMobile ? 22 : 28,
                      color: "white",
                      marginBottom: 16,
                      lineHeight: 1.2,
                      wordBreak: "break-word",
                    }}
                  >
                    {d.skillTitle || "Session"}
                  </h3>

                  {/* Parties */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? 10 : 8,
                      marginBottom: 16,
                      padding: isMobile ? 12 : 14,
                      background: "rgba(255,255,255,.03)",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    {[
                      { label: "Raised By", val: d.raisedByName },
                      { label: "Teacher", val: d.teacherName },
                      { label: "Learner", val: d.learnerName },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          gap: isMobile ? 2 : 8,
                          alignItems: isMobile ? "flex-start" : "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,.25)",
                            minWidth: isMobile ? "auto" : 80,
                            flexShrink: 0,
                          }}
                        >
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontSize: isMobile ? 14 : 15,
                            color: "rgba(255,255,255,.75)",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reason */}
                  <div
                    style={{
                      padding: isMobile ? 12 : 14,
                      background: "rgba(249,115,22,.06)",
                      border: "1px solid rgba(249,115,22,.15)",
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: "rgba(249,115,22,.6)",
                        marginBottom: 6,
                      }}
                    >
                      Reason
                    </div>
                    <p
                      style={{
                        fontSize: isMobile ? 13 : 14,
                        color: "rgba(255,255,255,.65)",
                        lineHeight: 1.7,
                        margin: 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {d.reason}
                    </p>
                  </div>

                  {/* Actions */}
                  {d.status === "open" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      <MagneticButton
                        onClick={() =>
                          ask("Refund credits to the learner?", () =>
                            resolve(d.id, true),
                          )
                        }
                        style={{
                          padding: "13px",
                          background: "rgba(34,197,94,.15)",
                          border: "1px solid rgba(34,197,94,.3)",
                          borderRadius: 12,
                          color: "#22c55e",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        ✓ Refund
                      </MagneticButton>
                      <MagneticButton
                        onClick={() =>
                          ask("Reject this dispute?", () =>
                            resolve(d.id, false),
                          )
                        }
                        style={{
                          padding: "13px",
                          background: "rgba(239,68,68,.12)",
                          border: "1px solid rgba(239,68,68,.25)",
                          borderRadius: 12,
                          color: "#ef4444",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        ✕ Reject
                      </MagneticButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirmData && (
        <Modal onClose={() => setConfirmData(null)}>
          <ConfirmModalContent
            confirmData={confirmData}
            setConfirmData={setConfirmData}
          />
        </Modal>
      )}
    </div>
  );
}

function ConfirmModalContent({ confirmData, setConfirmData }) {
  const { isMobile } = useResponsive();
  return (
    <div
      style={{
        padding: isMobile ? "26px 20px" : "32px 32px 28px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(255,200,50,.1)",
          border: "1px solid rgba(255,200,50,.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          margin: "0 auto 16px",
        }}
      >
        ⚖
      </div>
      <h3
        className="clash"
        style={{
          fontSize: isMobile ? 22 : 24,
          color: "white",
          marginBottom: 10,
        }}
      >
        Confirm Action
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,.5)",
          fontSize: isMobile ? 14 : 15,
          lineHeight: 1.7,
          marginBottom: 28,
        }}
      >
        {confirmData.message}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 12,
        }}
      >
        <MagneticButton
          onClick={() => setConfirmData(null)}
          style={{
            flex: 1,
            padding: "13px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
            color: "rgba(255,255,255,.6)",
            fontSize: 13,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Cancel
        </MagneticButton>
        <MagneticButton
          onClick={async () => {
            await confirmData.action();
            setConfirmData(null);
          }}
          style={{
            flex: 1,
            padding: "13px",
            background: "#ffc832",
            border: "none",
            borderRadius: 12,
            color: "#000",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Confirm
        </MagneticButton>
      </div>
    </div>
  );
}
