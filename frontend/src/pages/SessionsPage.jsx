import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { http } from "../api/client";
import { MagneticButton, ParticleField } from "../components/primitives";
import {
  confirmBooking,
  completeBooking,
  cancelBooking,
  raiseDispute,
} from "../api/bookings";
import useResponsive from "../hooks/useResponsive";

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
        padding: isMobile ? 14 : 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: isMobile ? "94vw" : 460,
          animation: "modalIn .4s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 24,
            background:
              "linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.1))",
            filter: "blur(1px)",
          }}
        />
        <div
          style={{
            position: "relative",
            background: "#0d0e16",
            borderRadius: 24,
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

// ── Confirm modal ──────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <div style={{ padding: "32px 32px 28px", textAlign: "center" }}>
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
          ⚡
        </div>
        <h3
          className="clash"
          style={{ fontSize: 22, color: "white", marginBottom: 10 }}
        >
          Confirm Action
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,.5)",
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <MagneticButton
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 12,
              color: "rgba(255,255,255,.6)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </MagneticButton>
          <MagneticButton
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              background: "#ffc832",
              border: "none",
              borderRadius: 12,
              color: "#000",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Confirm
          </MagneticButton>
        </div>
      </div>
    </Modal>
  );
}

// ── Status config ──────────────────────────────────────────────────────
const STATUS = {
  pending: {
    label: "Pending",
    color: "#ffc832",
    bg: "rgba(255,200,50,.12)",
    dot: "#ffc832",
  },
  teacher_marked_complete: {
    label: "Awaiting",
    color: "#38bdf8",
    bg: "rgba(56,189,248,.12)",
    dot: "#38bdf8",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
    bg: "rgba(34,197,94,.12)",
    dot: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,.12)",
    dot: "#ef4444",
  },
  disputed: {
    label: "Disputed",
    color: "#f97316",
    bg: "rgba(249,115,22,.12)",
    dot: "#f97316",
  },
};

// ── Session Card ───────────────────────────────────────────────────────
function SessionCard({ b, tab, refresh }) {
  console.log("BOOKING DATA:", b);
  const [busy, setBusy] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [reason, setReason] = useState("");
  const [disputeErr, setDisputeErr] = useState("");
  const [disputeBusy, setDisputeBusy] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [link, setLink] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const { isMobile } = useResponsive();

  const s = STATUS[b.status] || {
    label: b.status,
    color: "#999",
    bg: "rgba(153,153,153,.1)",
    dot: "#999",
  };

  const ask = (message, action) => setConfirmData({ message, action });

  const doAction = async (type) => {
    setBusy(true);
    try {
      if (type === "confirm") await confirmBooking(b.id);
      if (type === "complete") await completeBooking(b.id);
      if (type === "cancel") await cancelBooking(b.id);
      await refresh();
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const submitDispute = async () => {
    if (!reason.trim()) {
      setDisputeErr("Please describe the issue.");
      return;
    }
    setDisputeBusy(true);
    try {
      await raiseDispute(b.id, reason);
      setShowDispute(false);
      setReason("");
      refresh();
    } catch (e) {
      setDisputeErr("Failed to submit dispute.");
    }
    setDisputeBusy(false);
  };

  const submitReview = async () => {
    if (!rating) {
      setReviewErr("Please select a rating.");
      return;
    }
    setReviewBusy(true);
    try {
      await http.post(`/reviews/${b.id}`, { rating, comment });
      setShowReview(false);
      setRating(0);
      setComment("");
    } catch (e) {
      setReviewErr("Failed to submit review.");
    }
    setReviewBusy(false);
  };

  const sessionStart = new Date(b.scheduledAt);
  const cancelDeadline = new Date(sessionStart.getTime() + 15 * 60 * 1000);

  const canCancel = b.status === "pending" && new Date() < cancelDeadline;

  return (
    <>
      <div
        style={{
          position: "relative",
          padding: isMobile ? 18 : 28,
          borderRadius: 24,
          background: "linear-gradient(145deg,#10111a,#0c0d14)",
          border: "1px solid rgba(255,255,255,.07)",
          transition: "border-color .3s, transform .3s",
          overflow: "hidden",
          minHeight: isMobile ? "auto" : 450,
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,200,50,.2)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Top shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg,transparent,${s.color}50,transparent)`,
          }}
        />

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 15px",
            borderRadius: 30,
            background: s.bg,
            border: `1px solid ${s.color}30`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: s.dot,
            }}
          />
          <span
            style={{
              fontSize: 15,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              fontWeight: 700,
              color: s.color,
            }}
          >
            {s.label}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          {/* Title */}
          <h2
            className="clash"
            style={{
              fontSize: isMobile ? 26 : 35,
              color: "white",
              marginBottom: 18,
              lineHeight: 1.2,
            }}
          >
            {b.skill?.title || "Session"}
          </h2>

          {/* Meta */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.25)",
                  width: 100,
                }}
              >
                {tab === "teacher" ? "Student :" : "Teacher :"}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 16 : 20,
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {tab === "teacher" ? b.learner?.name : b.teacher?.name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.25)",
                  width: 90,
                }}
              >
                Hours :
              </span>
              <span
                style={{
                  fontSize: isMobile ? 16 : 20,
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {b.hours}h
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.25)",
                  width: 90,
                }}
              >
                Credits :
              </span>
              <span
                style={{
                  fontSize: isMobile ? 16 : 20,
                  color: "#ffc832",
                  fontWeight: 700,
                }}
              >
                {b.totalCredits ?? "—"} CR
              </span>
            </div>

            {b.scheduledAt && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 14,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.25)",
                    width: 90,
                  }}
                >
                  Date :
                </span>

                <span
                  style={{ fontSize: isMobile ? 14 : 18, color: "#38bdf8" }}
                >
                  {new Date(b.scheduledAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {b.meetingLink && b.status === "pending" && (
          <a
            href={b.meetingLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginTop: 5,
              marginBottom: 15,
              background: "#38bdf8",
              padding: "10px",
              borderRadius: 10,
              textAlign: "center",
              color: "#000",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: 2,
            }}
          >
            🔗 Join Session
          </a>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: "auto",
          }}
        >
          {tab === "teacher" && b.status === "pending" && !b.meetingLink && (
            <>
              <MagneticButton
                onClick={() => setShowLinkBox(true)}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "#ffc832",
                  border: "none",
                  borderRadius: 12,
                  color: "#000",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Add Link
              </MagneticButton>

              {showLinkBox && (
                <div style={{ marginTop: 10 }}>
                  <input
                    placeholder="Paste meeting link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                      background: "#10111a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,.2)",
                    }}
                  />

                  <MagneticButton
                    disabled={!link || linkBusy}
                    onClick={async () => {
                      try {
                        setLinkBusy(true);

                        await http.post(
                          `/bookings/${b.id}/meeting-link?link=${link}`,
                        );

                        setShowLinkBox(false);
                        setLink("");
                        refresh();
                      } catch (e) {
                        console.error(e);
                      }

                      setLinkBusy(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#22c55e",
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {linkBusy ? "Saving..." : "Save Link"}
                  </MagneticButton>
                </div>
              )}
            </>
          )}

          {tab === "teacher" && b.status === "pending" && b.meetingLink && (
            <MagneticButton
              onClick={() =>
                ask("Mark this session as completed?", () =>
                  doAction("complete"),
                )
              }
              disabled={busy}
              style={{
                width: "100%",
                padding: "11px",
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? "..." : "Mark Complete"}
            </MagneticButton>
          )}
          {tab === "learner" && canCancel && (
            <MagneticButton
              onClick={() =>
                ask("Cancel this booking?", () => doAction("cancel"))
              }
              disabled={busy}
              style={{
                width: "100%",
                padding: "11px",
                background: "rgba(239,68,68,.15)",
                border: "1px solid rgba(239,68,68,.3)",
                borderRadius: 12,
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Cancel Booking
            </MagneticButton>
          )}
          {tab === "learner" && b.status === "teacher_marked_complete" && (
            <MagneticButton
              onClick={() =>
                ask("Confirm the session is completed?", () =>
                  doAction("confirm"),
                )
              }
              disabled={busy}
              style={{
                width: "100%",
                padding: "11px",
                background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {busy ? "..." : "Confirm Session"}
            </MagneticButton>
          )}
          {tab === "learner" && b.status === "completed" && !b.hasDispute && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 20,
              }}
            >
              <MagneticButton
                onClick={() => setShowReview(true)}
                style={{
                  padding: "11px",
                  background: "rgba(34,197,94,.15)",
                  border: "1px solid rgba(34,197,94,.3)",
                  borderRadius: 12,
                  color: "#22c55e",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Rate Session
              </MagneticButton>
              <MagneticButton
                onClick={() => setShowDispute(true)}
                style={{
                  padding: "11px",
                  background: "rgba(249,115,22,.12)",
                  border: "1px solid rgba(249,115,22,.25)",
                  borderRadius: 12,
                  color: "#f97316",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Raise Dispute
              </MagneticButton>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onConfirm={async () => {
            await confirmData.action();
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}

      {/* Dispute modal */}
      {showDispute && (
        <Modal onClose={() => setShowDispute(false)}>
          <div style={{ padding: "32px 32px 28px" }}>
            <h3
              className="clash"
              style={{ fontSize: 28, color: "white", marginBottom: 6 }}
            >
              Raise a Dispute
            </h3>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,.35)",
                marginBottom: 20,
              }}
            >
              Describe the issue with this session
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What went wrong?"
              style={{
                width: "100%",
                height: 100,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                color: "white",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            {disputeErr && (
              <p style={{ color: "#ff9090", fontSize: 15, marginTop: 8 }}>
                ⚠ {disputeErr}
              </p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <MagneticButton
                onClick={() => setShowDispute(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  color: "rgba(255,255,255,.6)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </MagneticButton>
              <MagneticButton
                onClick={submitDispute}
                disabled={disputeBusy}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f97316",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  opacity: disputeBusy ? 0.6 : 1,
                }}
              >
                {disputeBusy ? "Submitting..." : "Submit Dispute"}
              </MagneticButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Review modal */}
      {showReview && (
        <Modal onClose={() => setShowReview(false)}>
          <div style={{ padding: "32px 32px 28px" }}>
            <h3
              className="clash"
              style={{ fontSize: 28, color: "white", marginBottom: 6 }}
            >
              Rate this Session
            </h3>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,.35)",
                marginBottom: 20,
              }}
            >
              How was your experience?
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: 36,
                    cursor: "pointer",
                    color:
                      star <= (hoverRating || rating)
                        ? "#ffc832"
                        : "rgba(255,255,255,.15)",
                    transition: "color .15s, transform .15s",
                    transform:
                      star <= (hoverRating || rating)
                        ? "scale(1.2)"
                        : "scale(1)",
                    display: "inline-block",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback (optional)..."
              style={{
                width: "100%",
                height: 90,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                color: "white",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            {reviewErr && (
              <p style={{ color: "#ff9090", fontSize: 12, marginTop: 8 }}>
                ⚠ {reviewErr}
              </p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <MagneticButton
                onClick={() => setShowReview(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  color: "rgba(255,255,255,.6)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </MagneticButton>
              <MagneticButton
                onClick={submitReview}
                disabled={reviewBusy || !rating}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#ffc832",
                  border: "none",
                  borderRadius: 12,
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  opacity: !rating || reviewBusy ? 0.5 : 1,
                }}
              >
                {reviewBusy ? "Submitting..." : "Submit Review"}
              </MagneticButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function SessionsPage() {
  useAuth();
  const [learner, setLearner] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [tab, setTab] = useState("learner");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { isMobile, isTablet } = useResponsive();

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [l, t] = await Promise.all([
        http.get(`/bookings/me/learner`),
        http.get(`/bookings/me/teacher`),
      ]);
      setLearner(l || []);
      setTeacher(t || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const roleData = tab === "learner" ? learner : teacher;

  const data =
    statusFilter === "all"
      ? roleData
      : roleData.filter((b) => {
          if (statusFilter === "completed") {
            return ["completed", "refunded", "rejected"].includes(b.status);
          }
          return b.status === statusFilter;
        });

  const counts = { learner: learner.length, teacher: teacher.length };

  return (
    <div
      style={{
        background: "#07080f",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticleField />

      {/* Glow */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse,rgba(255,200,50,.04),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: isMobile
            ? "110px 16px 60px"
            : isTablet
              ? "120px 32px 70px"
              : "120px 80px 80px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 36 : 60 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 10 : 16,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 40, height: 1, background: "#ffc832" }} />
            <span
              style={{
                fontSize: 16,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#ffc832",
                fontWeight: 700,
              }}
            >
              Your Activity
            </span>
          </div>
          <h1
            className="clash"
            style={{
              fontSize: isMobile
                ? "clamp(38px,12vw,58px)"
                : "clamp(48px,6vw,85px)",
              lineHeight: 1,
              marginBottom: 0,
            }}
          >
            <span style={{ color: "white" }}>My </span>
            <span style={{ color: "#ffc832", fontStyle: "italic" }}>
              Sessions
            </span>
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: isMobile ? 6 : 8,

            overflowX: isMobile ? "auto" : "visible",
            overflowY: "hidden",

            paddingBottom: isMobile ? 6 : 0,

            scrollbarWidth: "none",
            msOverflowStyle: "none",

            width: isMobile ? "100%" : "fit-content",
            marginBottom: 48,
            padding: 6,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 50,
          }}
        >
          {["learner", "teacher"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: isMobile ? "10px 18px" : "10px 24px",
                width: isMobile ? "100%" : "auto",
                borderRadius: 40,
                fontSize: isMobile ? 10 : 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
                border: "none",
                transition: "all .3s",
                cursor: "pointer",
                background: tab === t ? "#ffc832" : "transparent",
                color: tab === t ? "#000" : "rgba(255,255,255,.5)",
              }}
            >
              {t === "learner" ? "As Learner" : "As Teacher"}
              {counts[t] > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 7px",
                    borderRadius: 20,
                    background:
                      tab === t ? "rgba(0,0,0,.2)" : "rgba(255,200,50,.15)",
                    color: tab === t ? "#000" : "#ffc832",
                    fontSize: 12,
                  }}
                >
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 10,

            overflowX: "auto",
            overflowY: "hidden",

            whiteSpace: "nowrap",

            paddingBottom: 6,
            marginBottom: 30,

            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "teacher_marked_complete", label: "Awaiting" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
            { key: "disputed", label: "Disputed" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              style={{
                fontSize: isMobile ? 14 : 18,
                flexShrink: 0,
                whiteSpace: "nowrap",
                padding: "8px 16px",
                borderRadius: 20,
                cursor: "pointer",
                background: statusFilter === s.key ? "#ffc832" : "transparent",
                color: statusFilter === s.key ? "#000" : "rgba(255,255,255,.5)",
                border:
                  statusFilter === s.key
                    ? "none"
                    : "1px solid rgba(255,255,255,.1)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              color: "rgba(255,255,255,.3)",
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
            Loading sessions...
          </div>
        ) : data.length === 0 ? (
          <div
            style={{
              padding: "60px 40px",
              borderRadius: 24,
              border: "1px dashed rgba(255,255,255,.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>◎</div>
            <p
              style={{
                color: "rgba(255,255,255,.3)",
                fontSize: 18,
                letterSpacing: 2,
              }}
            >
              NO SESSIONS YET
            </p>
          </div>
        ) : (
          <div
            className="hide-scrollbar"
            style={
              isMobile
                ? {
                    display: "flex",

                    overflowX: "auto",
                    overflowY: "hidden",

                    gap: 16,

                    paddingBottom: 6,

                    scrollSnapType: "x mandatory",

                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }
                : {
                    display: "grid",

                    gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",

                    gap: 24,
                  }
            }
          >
            {data.map((b) => (
              <div
                key={b.id}
                style={
                  isMobile
                    ? {
                        minWidth: "88%",
                        maxWidth: "88%",

                        flexShrink: 0,

                        scrollSnapAlign: "start",
                      }
                    : {}
                }
              >
                <SessionCard b={b} tab={tab} refresh={fetchData} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
