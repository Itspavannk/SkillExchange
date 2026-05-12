import { useState } from "react";
import { createSkill } from "../api/skills";
import useResponsive from "../hooks/useResponsive";

const CATEGORIES = [
  "Engineering", "UI/UX Design","Programming", "Data Science", "Music", "Language",
  "Photography", "Design", "Marketing", "Finance", "Writing",
  "Architecture", "Cooking", "Film", "Strategy", "Branding",
  "Animation", "Business", "Health & Fitness", "Gaming", "Teaching", "Others"
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.3)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.1)", borderRadius: 12,
  padding: "13px 16px", color: "white", fontSize: 15,
  outline: "none", fontFamily: "inherit", transition: "border-color .25s",
  boxSizing: "border-box",
};

export default function AddSkillModal({ open, onClose, onCreated }) {
  const { isMobile } = useResponsive();
  const [title,          setTitle]          = useState("");
  const [description,    setDescription]    = useState("");
  const [category,       setCategory]       = useState("");
  const [level,          setLevel]          = useState("");
  const [creditsPerHour, setCreditsPerHour] = useState("");
  const [err,            setErr]            = useState("");
  const [busy,           setBusy]           = useState(false);

  const reset = () => {
    setTitle(""); setDescription(""); setCategory("");
    setLevel(""); setCreditsPerHour(""); setErr("");
  };

  const submit = async () => {
    setErr("");
    if (!title.trim())       { setErr("Title is required.");                        return; }
    if (!description.trim()) { setErr("Description is required.");                  return; }
    if (description.length > 500) {
      setErr("Description cannot exceed 500 characters.");
      return;
    }
    if (!category)           { setErr("Please select a category.");                 return; }
    if (!level)              { setErr("Please select a level.");                    return; }
    if (!creditsPerHour || isNaN(creditsPerHour) || Number(creditsPerHour) < 1) {
      setErr("Enter a valid credits per hour (min 1)."); return;
    }
    setBusy(true);
    try {
      const skill = await createSkill({
        title: title.trim(), description: description.trim(),
        category, level, creditsPerHour: Number(creditsPerHour),
      });
      reset(); onClose();
      if (onCreated) onCreated(skill);
    } catch (e) {
      setErr(
  "Could not create skill. Please shorten the description."
);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div onClick={() => !busy && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
    padding: isMobile ? 12 : 20, background: "rgba(0,0,0,.82)", backdropFilter: "blur(28px)",
    }}>
      <div onClick={e => e.stopPropagation()}
     style={{
  position: "relative",

  width:isMobile ? "94vw" : "100%",
  maxWidth:isMobile ? "94vw" : 520,

  animation: "modalIn .5s cubic-bezier(.16,1,.3,1) both"
}}>

        <div style={{ position: "absolute", inset: -1,borderRadius: isMobile ? 22 : 28, background: "linear-gradient(135deg,rgba(255,200,50,.3),rgba(255,107,53,.15))", filter: "blur(1px)" }} />

        <div style={{ position: "relative", background: "#0d0e16",borderRadius: isMobile ? 22 : 28, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#ffc832 40%,#ff6b35 60%,transparent)" }} />

          <div className="hide-scrollbar" style={{ padding:isMobile ? "22px 18px 24px" : "32px 36px 36px",maxHeight: "85vh",overflowY:"auto",
msOverflowStyle:"none",
scrollbarWidth:"none", }}>
            <button onClick={() => !busy && onClose()} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✕</button>

            <h2 className="clash" style={{ fontSize:isMobile ? 24 : 32,fontWeight: 700, color: "white", marginBottom: 6 }}>List a Skill</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.3)",marginBottom:isMobile ? 20 : 28 }}>Share your expertise and earn credits</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Row 1: Category + Level */}
              <div style={{ display: "grid",gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <Field label="Category">
                  <select value={category} onChange={e => setCategory(e.target.value)} disabled={busy}
                    style={{ ...inputStyle, color: category ? "white" : "rgba(255,255,255,.3)" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(255,200,50,.6)")}
                    onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,.1)")}>
                    <option value="" disabled>Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#0d0e16", color: "white" }}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Level">
                  <select value={level} onChange={e => setLevel(e.target.value)} disabled={busy}
                    style={{ ...inputStyle, color: level ? "white" : "rgba(255,255,255,.3)" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(255,200,50,.6)")}
                    onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,.1)")}>
                    <option value="" disabled>Select...</option>
                    {LEVELS.map(l => <option key={l} value={l} style={{ background: "#0d0e16" }}>{l}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row 2: Title */}
              <Field label="Skill Title">
                <input value={title} onChange={e => setTitle(e.target.value)}
                  disabled={busy} placeholder="e.g. Python Programming" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(255,200,50,.6)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
              </Field>

              {/* Row 3: Description */}
              <Field label="Description">
               <textarea value={description} maxLength={500}onChange={e => setDescription(e.target.value)}
                  disabled={busy} placeholder="Describe what you'll teach and what learners will gain..."
                  rows={isMobile ? 4 : 3}style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={e => (e.target.style.borderColor = "rgba(255,200,50,.6)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />

                  <div
  style={{
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    color:
      description.length > 450
        ? "#ff6b6b"
        : "rgba(255,255,255,.4)"
  }}
>
  {description.length}/500
</div>
              </Field>

              {/* Row 4: Credits */}
              <Field label="Credits Per Hour">
                <input type="number" min="1" value={creditsPerHour}
                  onChange={e => setCreditsPerHour(e.target.value)}
                  disabled={busy} placeholder="e.g. 10" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(255,200,50,.6)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
              </Field>

              {err && (
                <div style={{ background: "rgba(255,80,80,.1)", border: "1px solid rgba(255,80,80,.3)", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#ff9090" }}>
                  ⚠ {err}
                </div>
              )}

              <button onClick={submit} disabled={busy} style={{
                marginTop: 4, background: busy ? "rgba(255,200,50,.45)" : "#ffc832",
                color: "#000", borderRadius: 12, padding: "16px", fontSize: 15,
                letterSpacing: 4, textTransform: "uppercase", fontWeight: 700,
                border: "none", width: "100%",
                boxShadow: busy ? "none" : "0 0 40px rgba(255,200,50,.3)",
                transition: "all .3s", cursor: busy ? "not-allowed" : "pointer",
              }}>
                {busy ? "Creating..." : "List Skill →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}