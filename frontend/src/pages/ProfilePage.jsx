import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { http } from "../api/client";
import { ParticleField, MagneticButton } from "../components/primitives";
import { transferCredits } from "../api/index";
import useResponsive from "../hooks/useResponsive";

// ── Utilities ──────────────────────────────────────────────────────────
function CountUp({ to, duration = 1400 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    let cur = 0;
    const step = to / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [to]);
  return <>{val.toLocaleString()}</>;
}

function Stars({ rating, size = 14, interactive = false, onSet }) {
  const [hov, setHov] = useState(0);
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onMouseEnter={() => interactive && setHov(n)}
          onMouseLeave={() => interactive && setHov(0)}
          onClick={() => interactive && onSet?.(n)}
          style={{ fontSize:size, color: n<=(hov||Math.round(rating)) ? "#ffc832" : "rgba(255,255,255,.15)",
            cursor: interactive?"pointer":"default", transition:"color .15s, transform .15s",
            transform: interactive && n<=(hov||rating) ? "scale(1.2)" : "scale(1)", display:"inline-block" }}>★</span>
      ))}
    </span>
  );
}

const STATUS_CFG = {
  pending:                 { label:"Pending",    color:"#ffc832", bg:"rgba(255,200,50,.12)"  },
  teacher_marked_complete: { label:"In Review",  color:"#38bdf8", bg:"rgba(56,189,248,.12)"  },
  completed:               { label:"Completed",  color:"#22c55e", bg:"rgba(34,197,94,.12)"   },
  cancelled:               { label:"Cancelled",  color:"#ef4444", bg:"rgba(239,68,68,.12)"   },
  disputed:                { label:"Disputed",   color:"#f97316", bg:"rgba(249,115,22,.12)"  },
};

const TX_CFG = {
  escrow_hold:     { label:"Escrow Hold",    color:"#ffc832", icon:"⬡", dir: "out" },
  escrow_release:  { label:"Payment",        color:"#22c55e", icon:"◎", dir: "in"  },
  refund:          { label:"Refund",         color:"#38bdf8", icon:"↩", dir: "in"  },
  manual_transfer: { label:"Transfer",       color:"#b06aff", icon:"◈", dir: null  },
  admin_grant:     { label:"Admin Grant",    color:"#ff6b35", icon:"✦", dir: "in"  },
  dispute_refund:  { label:"Dispute Refund", color:"#f97316", icon:"⚖", dir: "in"  },
};

function StatusPill({ status }) {
  const s = STATUS_CFG[status] || { label:status, color:"#999", bg:"rgba(153,153,153,.1)" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, background:s.bg, border:`1px solid ${s.color}25` }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.color, display:"inline-block" }}/>
      <span style={{ fontSize:15, letterSpacing:2, textTransform:"uppercase", fontWeight:700, color:s.color }}>{s.label}</span>
    </span>
  );
}

// ── Modal shell ────────────────────────────────────────────────────────
function Modal({ onClose, children, maxWidth = 460, isMobile }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", backdropFilter:"blur(24px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000,padding:isMobile ? 12 : 20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"relative", width:"100%",maxWidth:isMobile ? "95vw" : maxWidth, animation:"modalIn .4s cubic-bezier(.16,1,.3,1) both" }}>
        <div style={{ position:"absolute", inset:-1, borderRadius:28, background:"linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.1))", filter:"blur(1px)" }}/>
     <div style={{
  position:"relative",
  background:"#0d0e16",
  borderRadius:28,
  border:"1px solid rgba(255,255,255,.08)",
  overflowY:"auto",
  maxHeight:"90vh"
}}>
          <div style={{ height:1, background:"linear-gradient(90deg,transparent,#ffc832 40%,#ff6b35 60%,transparent)" }}/>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Transfer Credits Modal ─────────────────────────────────────────────
function TransferModal({ onClose, onDone }) {
  const [email, setEmail]   = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr]       = useState("");
  const [busy, setBusy]     = useState(false);
  const [done, setDone]     = useState(false);
  const { isMobile } = useResponsive();

  const submit = async () => {
    if (!email.trim() || !amount || isNaN(amount) || Number(amount) < 1) { setErr("Valid email and amount required."); return; }
    setBusy(true); setErr("");
    try {
      await transferCredits({ receiverEmail: email.trim(), amount: Number(amount) });
      setDone(true);
      setTimeout(() => { onDone(); onClose(); }, 1400);
    } catch(e) { setErr(e.message || "Transfer failed."); }
    setBusy(false);
  };

  return (
    <Modal onClose={onClose} isMobile={isMobile}>
      <div style={{ padding:isMobile ? "24px 18px 28px" : "36px 36px 40px"}}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.4)", fontSize:isMobile ? 16 : 20, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>✕</button>
        {done ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:63, marginBottom:12, animation:"fadeUp .5s ease" }}>✓</div>
            <h3 className="clash" style={{ fontSize:33, color:"#22c55e" }}>Credits Sent!</h3>
          </div>
        ) : (
          <>
            <h3 className="clash" style={{ fontSize:isMobile ? 28 : 35,color:"white", marginBottom:6 }}>Transfer Credits</h3>
            <p style={{ fontSize:isMobile ? 14 : 19, color:"rgba(255,255,255,.3)", marginBottom:28 }}>Send credits to another member instantly</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { label:"Recipient Email", type:"email",  val:email,  set:setEmail,  ph:"member@example.com" },
                { label:"Amount (CR)",     type:"number", val:amount, set:setAmount, ph:"e.g. 20" },
              ].map(f => (
                <div key={f.label} style={{ position:"relative" }}>
                  <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} disabled={busy}
                    style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"14px 16px", color:"white",fontSize:isMobile ? 16 : 21, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color .25s" }}
                    onFocus={e=>(e.target.style.borderColor="rgba(255,200,50,.6)")}
                    onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.1)")}/>
                  <label style={{ position:"absolute", top:-9, left:12, fontSize:15, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,.3)", background:"#0d0e16", padding:"0 4px" }}>{f.label}</label>
                </div>
              ))}
              {err && <p style={{ color:"#ff9090", fontSize:19 }}>⚠ {err}</p>}
              <button onClick={submit} disabled={busy}
                style={{ padding:"15px", background:busy?"rgba(255,200,50,.4)":"#ffc832", border:"none", borderRadius:12, color:"#000", fontSize:17, fontWeight:700, letterSpacing:4, textTransform:"uppercase", cursor:busy?"not-allowed":"pointer", boxShadow:"0 0 30px rgba(255,200,50,.2)", transition:"all .3s" }}>
                {busy ? "Sending…" : "Send Credits →"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ── Edit Profile Modal ─────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onDone, preview, setPreview }) {
  const [oldPw,   setOldPw]   = useState("");
  const [newPw,   setNewPw]   = useState("");
  const [err,     setErr]     = useState("");
  const [success, setSuccess] = useState("");
  const [busy,    setBusy]    = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
const { updateUser } = useAuth();
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [tempPreview, setTempPreview] = useState(null);
  const { isMobile } = useResponsive();



const handleUpload = async () => {
  if (!selectedFile) return;

  try {
    setUploading(true);
    setUploadMsg("");
    setUploadError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("http://localhost:8080/users/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sx_token")}`
      },
      body: formData
    });


const data = await res.json();

console.log(data);
setPreview(data.imageUrl);

updateUser({
  profileImage: data.imageUrl
});

setTempPreview(null);
setSelectedFile(null);
setPreview(data.imageUrl);

updateUser({
  profileImage: data.imageUrl
});
    setUploadMsg("Profile updated successfully ✓");

    // auto hide
    setTimeout(() => setUploadMsg(""), 2500);

  } catch (e) {
    console.error(e);

    setUploadError("Upload failed ❌");
    setTimeout(() => setUploadError(""), 2500);
  }

  setUploading(false);
};

const handleRemovePhoto = async () => {
  try {
    setUploading(true);

    await fetch("http://localhost:8080/users/remove-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sx_token")}`
      }
    });

    setPreview(null);
    setSelectedFile(null);
    setTempPreview(null);

    // update global user
    updateUser({ profileImage: null });

    setUploadMsg("Profile photo removed ✓");

    setTimeout(() => setUploadMsg(""), 2500);

  } catch (e) {
    console.error(e);
    setUploadError("Failed to remove photo");
    setTimeout(() => setUploadError(""), 2500);
  }

  setUploading(false);
};

        const savePassword = async () => {
          if (!oldPw || !newPw) {
            setErr("Both fields required");
            return;
          }



          if (newPw.length < 6) {
            setErr("Password must be at least 6 characters");
            return;
          }

          if (oldPw === newPw) {
            setErr("New password must be different");
            return;
          }

          setBusy(true);
          setErr("");
          setSuccess("");

          try {
            await http.post("/auth/change-password", {
              oldPassword: oldPw,
              newPassword: newPw
            });

            setSuccess("Password changed successfully ✅");
            setOldPw("");
            setNewPw("");

          } catch (e) {
            setErr(e.response?.data?.message || "Wrong current password");
          }

          setBusy(false);
        };
        

  return (
   <Modal onClose={onClose} maxWidth={isMobile ? "95%" : 550}>
      <div style={{padding:isMobile ? "24px 18px 28px" : "36px 36px 40px" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:isMobile ? 34 : 28,
height:isMobile ? 34 : 28,borderRadius:"50%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.4)", fontSize:isMobile ? 16 : 20, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>✕</button>
        <h3 className="clash" style={{ fontSize:isMobile ? 28 : 35, color:"white", marginBottom:6 }}>Edit Profile</h3>
        <p style={{ fontSize:isMobile ? 14 : 19, color:"rgba(255,255,255,.3)", marginBottom:28 }}>Update your display name or password</p>

        {/* Upload Profile Image */}
<div style={{ border:"1px solid rgba(255,255,255,.08)", borderRadius:16,padding:isMobile ? 12 : 20, background:"rgba(255,255,255,.02)",display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
textAlign:"center",
gap:isMobile ? 14:20, marginBottom:20 }}>
  
  {/* Avatar preview */}
  <div style={{ width:isMobile ? 60 : 70,
height:isMobile ? 60 : 70,borderRadius:"50%", overflow:"hidden", border:"2px solid #ffc832", flexShrink:0, background:"linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.15))", display:"flex", alignItems:"center", justifyContent:"center" }}>
{preview || user?.profileImage ? (
  <img
  src={tempPreview || preview || user.profileImage}
    alt="avatar"
    style={{
      width:"100%",
      height:"100%",
      objectFit:"cover"
    }}
  />
) : (
  <span
    className="clash"
    style={{
      fontSize:26,
      fontWeight:700,
      color:"white"
    }}
  >
    {user.name?.[0]?.toUpperCase()}
  </span>
)}
  </div>

  {/* Right side controls */}
  <div style={{ flex:1 }}>
    <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:10 }}>Profile Photo</div>
    <div style={{
  display:"flex",
  alignItems:isMobile ? "stretch" : "center",
  flexDirection:isMobile ? "column" : "row",
  gap:10,
  width:"100%"
}}>
      <input type="file" id="fileUpload" accept="image/*" hidden
onChange={e => {
  const f = e.target.files[0];

  setSelectedFile(f);

  if (f) {
setTempPreview(URL.createObjectURL(f));  }
}}/>
      <label htmlFor="fileUpload" style={{ width:isMobile ? "100%" : "auto",
textAlign:"center",
boxSizing:"border-box",padding:"12px 16px", borderRadius:10, background:"rgba(255,200,50,.08)", border:"1px solid rgba(255,200,50,.3)", color:"#ffc832", fontSize:15, fontWeight:600, cursor:"pointer" }}>
        {selectedFile ? "✓ " + selectedFile.name.slice(0,15) : "Choose Photo"}
      </label>

      {user?.profileImage && !selectedFile && (
  <button
    onClick={handleRemovePhoto}
    type="button"
    style={{
      width:isMobile ? "100%" : "auto",
      padding: "12px 16px",
      borderRadius: 10,
      background: "rgba(239,68,68,.08)",
      border: "1px solid rgba(239,68,68,.3)",
      color: "#ef4444",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer"
    }}
  >
    Remove Photo
  </button>
)}
      {selectedFile && (
        <button onClick={handleUpload} disabled={uploading}
          style={{width:isMobile ? "100%" : "auto", padding:"12px 16px", borderRadius:10, background: uploading ? "rgba(255,200,50,.4)" : "#ffc832", border:"none", color:"#000", fontSize:15, fontWeight:700, cursor:"pointer" }}>
          {uploading ? "Uploading…" : "Upload →"}
        </button>
      )}
    </div>
    {uploadMsg   && <div style={{ color:"#22c55e", fontSize:12, marginTop:6 }}>✓ {uploadMsg}</div>}
    {uploadError && <div style={{ color:"#ef4444", fontSize:12, marginTop:6 }}>✕ {uploadError}</div>}
  </div>
</div>


        {/* Password section */}
        <div style={{padding:isMobile ? 12 : 20, borderRadius:16, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ fontSize:isMobile ? 12:16, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:12 }}>Change Password</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Current Password", val:oldPw, set:setOldPw },
              { label:"New Password",     val:newPw, set:setNewPw },
            ].map(f => (
              <input key={f.label} type="password" placeholder={f.label} value={f.val} onChange={e=>f.set(e.target.value)} disabled={busy}
                style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:"white",fontSize:isMobile ? 14 : 21, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                onFocus={e=>(e.target.style.borderColor="rgba(255,200,50,.6)")}
                onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.1)")}/>
            ))}
            <button onClick={savePassword} disabled={busy}
              style={{ padding:"12px", background:"rgba(255,200,50,.15)", border:"1px solid rgba(255,200,50,.3)", borderRadius:10, color:"#ffc832", fontSize:isMobile? 12:17, fontWeight:700, letterSpacing:3, textTransform:"uppercase", cursor:"pointer" }}>
              Change Password
            </button>
          </div>
        </div>

        <div style={{
  height: 1,
  background: "rgba(255,255,255,.08)",
  margin: "20px 0"
}} />


      <div style={{
  marginTop: 24,
  display: "flex",
  gap: 15,
  justifyContent: "flex-end",
  flexWrap: "wrap"
}}>

  <button
    onClick={() => {
      localStorage.clear();
      window.location.href = "/";
    }}
    style={{
      padding: isMobile ? "9px 12px" :"15px 18px",
      background: "rgba(255,0,0,.05)",
      border: "1px solid rgba(255,0,0,.3)",
      borderRadius: 10,
      color: "#7f2b2b",
      fontSize: 17,
      fontWeight: 700,
      cursor: "pointer"
    }}
  >
    Logout
  </button>

<button
  onClick={() => setShowDelete(true)}
  style={{
    padding: "10px 18px",
    background: "rgba(255,0,0,.05)",
    border: "1px solid rgba(255,0,0,.2)",
    borderRadius: 10,
    color: "#ff4d4d",
    fontSize: 14,
    cursor: "pointer"
  }}
>
  Delete Account
</button>

</div>

        {err     && <p style={{ color:"#ff9090", fontSize:isMobile ? 14 : 19, marginTop:12 }}>⚠ {err}</p>}
        {success && <p style={{ color:"#22c55e", fontSize:isMobile ? 14 : 19, marginTop:12 }}>✓ {success}</p>}
      </div>

{showDelete && (
  <Modal
  onClose={() => setShowDelete(false)}
  maxWidth={420}
  isMobile={isMobile}
>
    <div style={{ padding: "30px" }}>

      <h3 style={{ color: "white", fontSize: 24, marginBottom: 10 }}>
        Delete Account
      </h3>

      <p style={{ color: "rgba(255,255,255,.4)", marginBottom: 20 }}>
        This action cannot be undone. All your data will be permanently deleted.
      </p>

      <div style={{
display:"flex",
flexDirection:isMobile ? "column" : "row",
justifyContent:"flex-end",
gap:10
      }}>

        {/* Cancel */}
        <button
          onClick={() => setShowDelete(false)}
          style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 10,
            color: "white",
            cursor: "pointer",
            width:isMobile ? "100%" : "auto"
          }}
        >
          Cancel
        </button>

        {/* Confirm */}
        <button
          onClick={async () => {
            try {
              await http.delete("/auth/delete-account");
              localStorage.clear();
              window.location.href = "/";
            } catch {
              setErr("Failed to delete account");
            }
          }}
          style={{
            padding: "15px 16px",
            background: "#ff4d4d",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            width:isMobile ? "100%" : "auto"
          }}
        >
          Delete
        </button>

      </div>
    </div>
  </Modal>
)}
    

    </Modal>

    
  );
  
}

// ── Achievements config ────────────────────────────────────────────────
function computeBadges(learnerBooks, teacherBooks, reviews) {
  const completed = [...learnerBooks, ...teacherBooks].filter(b=>b.status==="completed");
  const badges = [];
  if (completed.length >= 1)  badges.push({ id:"first_session", icon:"◎", label:"First Session",    desc:"Completed your first session",         color:"#22c55e" });
  if (teacherBooks.filter(b=>b.status==="completed").length >= 3) badges.push({ id:"teacher3",   icon:"⬡", label:"Rising Teacher",     desc:"Completed 3 sessions as teacher",      color:"#38bdf8" });
  if (learnerBooks.filter(b=>b.status==="completed").length >= 3) badges.push({ id:"learner3",   icon:"◈", label:"Eager Learner",      desc:"Completed 3 sessions as learner",      color:"#b06aff" });
  if (reviews.length >= 5)    badges.push({ id:"reviewed5",     icon:"★", label:"Well Reviewed",    desc:"Received 5+ reviews",                  color:"#ffc832" });
  if (completed.length >= 10) badges.push({ id:"session10",     icon:"◎", label:"Session Master",   desc:"10 sessions completed",                color:"#22c55e" });
  const avgR = reviews.length ? reviews.reduce((s,r)=>s+r.rating,0)/reviews.length : 0;
  if (reviews.length >= 3 && avgR >= 4.5) badges.push({ id:"star",   icon:"★", label:"5-Star Teacher",   desc:"Average rating of 4.5+",               color:"#ffc832" });
  return badges;
}

// ── Credit mini bar chart ──────────────────────────────────────────────
function CreditChart({ transactions, userId }) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleString("default",{month:"short"}), year:d.getFullYear(), month:d.getMonth(), earned:0, spent:0 });
  }
  transactions.forEach(tx => {
    const d = new Date(tx.createdAt);
    const m = months.find(m=>m.year===d.getFullYear()&&m.month===d.getMonth());
    if (!m) return;
    if (tx.receiverId === userId) m.earned += tx.amount;
    if (tx.senderId   === userId) m.spent  += tx.amount;
  });
  const max = Math.max(...months.flatMap(m=>[m.earned, m.spent]), 1);
  return (
    <div>
      <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:80, marginBottom:8 }}>
        {months.map((m,i) => (
          <div key={i} style={{ flex:1, display:"flex", gap:2, alignItems:"flex-end", height:"100%" }}>
            <div title={`Earned: ${m.earned}`} style={{ flex:1, background:"rgba(34,197,94,.4)", borderRadius:"3px 3px 0 0", height:`${(m.earned/max)*100}%`, minHeight:2, transition:"height .8s ease", cursor:"pointer" }}
              onMouseEnter={e=>(e.target.style.background="rgba(34,197,94,.7)")}
              onMouseLeave={e=>(e.target.style.background="rgba(34,197,94,.4)")}/>
            <div title={`Spent: ${m.spent}`} style={{ flex:1, background:"rgba(255,200,50,.35)", borderRadius:"3px 3px 0 0", height:`${(m.spent/max)*100}%`, minHeight:2, transition:"height .8s ease", cursor:"pointer" }}
              onMouseEnter={e=>(e.target.style.background="rgba(255,200,50,.65)")}
              onMouseLeave={e=>(e.target.style.background="rgba(255,200,50,.35)")}/>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {months.map((m,i) => (
          <div key={i} style={{ flex:1, textAlign:"center", fontSize:16, color:"rgba(255,255,255,.25)", letterSpacing:1 }}>{m.label}</div>
        ))}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:10 }}>
        <span style={{ fontSize:17, color:"rgba(34,197,94,.7)", display:"flex", alignItems:"center", gap:5 }}><span style={{ width:8, height:8, borderRadius:2, background:"rgba(34,197,94,.5)", display:"inline-block" }}/>Earned</span>
        <span style={{ fontSize:17, color:"rgba(255,200,50,.7)", display:"flex", alignItems:"center", gap:5 }}><span style={{ width:8, height:8, borderRadius:2, background:"rgba(255,200,50,.4)", display:"inline-block" }}/>Spent</span>
      </div>
    </div>
  );
}

// ── Activity Timeline ──────────────────────────────────────────────────
const BATCH = 6;

function Timeline({ learnerBooks, teacherBooks, reviews }) {
  const [visible, setVisible] = useState(BATCH);
  const { isMobile } = useResponsive();

  const allEvents = [
    ...learnerBooks.map(b => ({ date: new Date(b.createdAt), type:"booking", color:"#b06aff", icon:"◈", title:`Booked: ${b.skill?.title}`,       sub:`${b.hours}h · ${b.totalCredits} CR · ${b.status}` })),
    ...teacherBooks.map(b => ({ date: new Date(b.createdAt), type:"teach",   color:"#38bdf8", icon:"⬡", title:`Teaching: ${b.skill?.title}`,     sub:`${b.hours}h · ${b.totalCredits} CR · ${b.status}` })),
    ...reviews.map(r      => ({ date: new Date(r.createdAt), type:"review",  color:"#22c55e", icon:"★", title:`Review from ${r.reviewerName}`,   sub:`${r.rating}/5 stars${r.comment ? " — "+r.comment.slice(0,40)+"…" : ""}` })),
  ].sort((a, b) => b.date - a.date);

  const events  = allEvents.slice(0, visible);
  const hasMore = visible < allEvents.length;

  if (!allEvents.length) return (
    <div style={{ padding:"60px 20px", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:20 }}>No activity yet</div>
  );

  return (
    <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h3 className="clash" style={{ fontSize:25, color:"white" }}>Activity Timeline</h3>
        <span style={{ fontSize:16, color:"rgba(255,255,255,.25)", letterSpacing:2 }}>{allEvents.length} EVENTS</span>
      </div>

      {/* Scrollable fixed-height window */}
      <div style={{
        height: 480,
        overflowY: "auto",
        paddingRight: 8,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,200,50,.2) transparent",
      }}>
        <div style={{ position:"relative", paddingLeft:28 }}>
          {/* Vertical line */}
          <div style={{ position:"absolute", left:7, top:8, bottom:0, width:1, background:"linear-gradient(rgba(255,200,50,.25),transparent)" }}/>

          {events.map((e, i) => (
            <div key={i} style={{ position:"relative", marginBottom:16 }}>
              {/* Dot */}
              <div style={{ position:"absolute", left:-22, top:6, width:10, height:10, borderRadius:"50%", background:e.color, boxShadow:`0 0 8px ${e.color}60` }}/>
              <div
                style={{ padding:"12px 16px", borderRadius:14, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", transition:"border-color .25s" }}
                onMouseEnter={ev => ev.currentTarget.style.borderColor = e.color+"35"}
                onMouseLeave={ev => ev.currentTarget.style.borderColor = "rgba(255,255,255,.06)"}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2, flexWrap:"wrap", gap:4 }}>
                  <span style={{ fontSize:isMobile ? 14 : 18, color:"white", fontWeight:600 }}>{e.icon} {e.title}</span>
                  <span style={{ fontSize:15, color:"rgba(255,255,255,.22)", letterSpacing:1, whiteSpace:"nowrap" }}>
                    {e.date.toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" })}
                  </span>
                </div>
                <span style={{ fontSize:16, color:"rgba(255,255,255,.35)" }}>{e.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show more button */}
      {hasMore && (
        <div style={{ marginTop:16, textAlign:"center" }}>
          <button
            onClick={() => setVisible(v => v + BATCH)}
            style={{ padding:"10px 28px", background:"rgba(255,200,50,.08)", border:"1px solid rgba(255,200,50,.2)", borderRadius:30, color:"#ffc832", fontSize:15, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer", transition:"all .25s" }}
            onMouseEnter={e => e.target.style.background="rgba(255,200,50,.15)"}
            onMouseLeave={e => e.target.style.background="rgba(255,200,50,.08)"}>
            Show More · {allEvents.length - visible} remaining
          </button>
        </div>
      )}

      {/* Collapse button when fully expanded */}
      {!hasMore && visible > BATCH && (
        <div style={{ marginTop:16, textAlign:"center" }}>
          <button
            onClick={() => setVisible(BATCH)}
            style={{ padding:"10px 28px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:30, color:"rgba(255,255,255,.35)", fontSize:15, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer" }}>
            Collapse ↑
          </button>
        </div>
      )}
    </div>
  );
}


// ── Session List with scroll + show more ──────────────────────────────
const SESSION_BATCH = 5;
function SessionList({ data, color, otherKey }) {
  const [visible, setVisible] = React.useState(SESSION_BATCH);
  const { isMobile } = useResponsive();
  const shown   = data.slice(0, visible);
  const hasMore = visible < data.length;
  return (
    <div>
      <div style={{ height:420, overflowY:"auto", display:"flex", flexDirection:"column", gap:10,
        paddingRight:6, scrollbarWidth:"thin", scrollbarColor:"rgba(255,200,50,.2) transparent" }}>
        {shown.map(b => (
          <div key={b.id} style={{ padding:"16px 18px", borderRadius:16, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.06)", transition:"border-color .3s", flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=color+"30"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.06)"}>
            <div style={{display:"flex",

flexDirection:isMobile ? "column" : "row",

alignItems:isMobile ? "flex-start" : "center",

justifyContent:"space-between",

gap:isMobile ? 10 : 0,

marginBottom:6 }}>
              <span style={{fontSize:isMobile ? 16 : 21,color:"white", fontWeight:600 }}>{b.skill?.title}</span>
              <StatusPill status={b.status}/>
            </div>
            <div style={{ display:"flex", gap:12, flexDirection:isMobile ? "column" : "row",fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.3)", flexWrap:"wrap" }}>
              <span>{b.hours}h</span>
              <span>·</span>
              <span style={{ color }}>{b.totalCredits} CR</span>
              {b[otherKey] && <><span>·</span><span>{b[otherKey].name}</span></>}
              {b.hasDispute && <span style={{ color:"#f97316" }}>· Disputed</span>}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button onClick={() => setVisible(v => v + SESSION_BATCH)}
          style={{ marginTop:12, width:"100%", padding:"10px", background:"rgba(255,200,50,.07)", border:"1px solid rgba(255,200,50,.18)", borderRadius:12, color:"#ffc832", fontSize:13, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer", transition:"all .25s" }}
          onMouseEnter={e=>e.target.style.background="rgba(255,200,50,.14)"}
          onMouseLeave={e=>e.target.style.background="rgba(255,200,50,.07)"}>
          Show More · {data.length - visible} more
        </button>
      )}
      {!hasMore && visible > SESSION_BATCH && (
        <button onClick={() => setVisible(SESSION_BATCH)}
          style={{ marginTop:12, width:"100%", padding:"10px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, color:"rgba(255,255,255,.3)", fontSize:13, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer" }}>
          Collapse ↑
        </button>
      )}
    </div>
  );
}

// ── Transaction List with scroll + show more ───────────────────────────
const TX_BATCH = 6;
function TxList({ transactions, userId }) {
  const [visible, setVisible] = React.useState(TX_BATCH);
  const { isMobile } = useResponsive();
  const shown   = transactions.slice(0, visible);
  const hasMore = visible < transactions.length;
  return (
    <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>
      <div style={{display:"flex",

flexDirection:isMobile ? "column" : "row",

alignItems:isMobile ? "flex-start" : "center",

justifyContent:"space-between",

gap:isMobile ? 12 : 0, marginBottom:20 }}>
        <h3 className="clash" style={{ fontSize:25, color:"white" }}>Transaction History</h3>
        <span style={{ fontSize:14, color:"rgba(255,255,255,.25)", letterSpacing:2 }}>{transactions.length} TOTAL</span>
      </div>
      {transactions.length === 0 ? (
        <p style={{ color:"rgba(255,255,255,.2)", fontSize:20 }}>No transactions yet</p>
      ) : (
        <>
          <div style={{ height:420, overflowY:"auto", display:"flex", flexDirection:"column", gap:8,
            paddingRight:6, scrollbarWidth:"thin", scrollbarColor:"rgba(255,200,50,.2) transparent" }}>
            {shown.map(tx => {
              const cfg      = TX_CFG[tx.type] || { label:tx.type, color:"#999", icon:"◎" };
              const isIn     = tx.receiverId === userId;
              const isOut    = tx.senderId   === userId;
              const sign     = isIn ? "+" : isOut ? "-" : "±";
              const amtColor = isIn ? "#22c55e" : isOut ? "#ff6b35" : "#999";
              return (
                <div key={tx.id} style={{ display:"flex",
flexDirection:isMobile ? "column" : "row",
alignItems:isMobile ? "flex-start" : "center",
justifyContent:"space-between",
gap:isMobile ? 10 : 0,padding:"14px 18px", borderRadius:14, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.05)", transition:"border-color .3s", flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=cfg.color+"25"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.05)"}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`${cfg.color}15`, border:`1px solid ${cfg.color}25`, display:"flex", alignItems:"center", justifyContent:"center",fontSize:isMobile ? 16 : 21, color:cfg.color, flexShrink:0 }}>
                      {cfg.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:isMobile ? 16 : 20, color:"white", fontWeight:600, marginBottom:2 }}>{cfg.label}</div>
                      <div style={{ fontSize:15, color:"rgba(255,255,255,.25)", letterSpacing:1 }}>
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : ""}
                      </div>
                    </div>
                  </div>
                  <div className="clash" style={{fontSize:isMobile ? 18 : 24, fontWeight:700, color:amtColor, whiteSpace:"nowrap" }}>{sign}{tx.amount} CR</div>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <button onClick={() => setVisible(v => v + TX_BATCH)}
              style={{ marginTop:14, width:"100%", padding:"11px", background:"rgba(255,200,50,.07)", border:"1px solid rgba(255,200,50,.18)", borderRadius:12, color:"#ffc832", fontSize:13, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer", transition:"all .25s" }}
              onMouseEnter={e=>e.target.style.background="rgba(255,200,50,.14)"}
              onMouseLeave={e=>e.target.style.background="rgba(255,200,50,.07)"}>
              Show More · {transactions.length - visible} more
            </button>
          )}
          {!hasMore && visible > TX_BATCH && (
            <button onClick={() => setVisible(TX_BATCH)}
              style={{ marginTop:14, width:"100%", padding:"11px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, color:"rgba(255,255,255,.3)", fontSize:13, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer" }}>
              Collapse ↑
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Main ProfilePage ───────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [reviews,       setReviews]       = useState([]);
  const [learnerBooks,  setLearnerBooks]  = useState([]);
  const [teacherBooks,  setTeacherBooks]  = useState([]);
  const [transactions,  setTransactions]  = useState([]);
  const [tab,           setTab]           = useState("overview");
  const [loading,       setLoading]       = useState(true);
  const [showTransfer,  setShowTransfer]  = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [preview, setPreview] = useState(null);
  const { isMobile, isTablet } = useResponsive();
  

  useEffect(() => {
    if (!user) return;
    Promise.all([
      http.get(`/reviews/user/${user.id}`),
      http.get("/bookings/me/learner"),
      http.get("/bookings/me/teacher"),
      http.get("/transactions/me"),
    ]).then(([r,l,t,tx]) => {
      setReviews(r||[]);
      setLearnerBooks(l||[]);
      setTeacherBooks(t||[]);
      setTransactions(tx||[]);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return null;

  const avgRating     = user.ratingCount > 0 ? (user.ratingTotal / user.ratingCount).toFixed(1) : null;
  const completedL    = learnerBooks.filter(b=>b.status==="completed").length;
  const completedT    = teacherBooks.filter(b=>b.status==="completed").length;
  const totalL        = learnerBooks.length;
  const totalT        = teacherBooks.length;
  const totalCreditsEarned = transactions
  .filter(tx => 
    tx.receiverId === user.id &&
    tx.type === "escrow_release"
  )
  .reduce((s, tx) => s + tx.amount, 0);

const totalCreditsSpent = transactions
  .filter(tx => 
    tx.senderId === user.id &&
    tx.type === "escrow_release"
  )
  .reduce((s, tx) => s + tx.amount, 0);
  const badges        = computeBadges(learnerBooks, teacherBooks, reviews);
  const initials      = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const memberSince   = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—";

  // Pending actions
  const pendingActions = [
    ...teacherBooks.filter(b=>b.status==="pending").map(b=>({ type:"complete", booking:b, msg:`Mark "${b.skill?.title}" as complete`, color:"#22c55e" })),
    ...learnerBooks.filter(b=>b.status==="teacher_marked_complete").map(b=>({ type:"confirm", booking:b, msg:`Confirm session: "${b.skill?.title}"`, color:"#38bdf8" })),
  ];

  const TABS = [
    { id:"overview",  label:"Overview"   },
    { id:"sessions",  label:"Sessions"   },
    { id:"reviews",   label:"Reviews"    },
    { id:"credits",   label:"Credits"    },
    { id:"timeline",  label:"Timeline"   },
  ];

  return (
<div style={{
  background:"#07080f",

  minHeight:"100vh",

  position:"relative",

  overflowX:"hidden"
}}>      <ParticleField/>
      <div style={{ position:"fixed", top:"-15%", left:"-5%",  width:600, height:500, background:"radial-gradient(ellipse,rgba(255,200,50,.05),transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", bottom:"5%",  right:"-5%", width:500, height:500, background:"radial-gradient(ellipse,rgba(176,106,255,.04),transparent 65%)", pointerEvents:"none" }}/>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── BANNER ── */}
        <div style={{ position:"relative", height:260, background:"linear-gradient(135deg,#07080f 0%,#0d0e1a 60%,#080a12 100%)", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:.025, backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(255,200,50,.25),rgba(255,107,53,.15),transparent)" }}/>
          {[320,230,150].map((sz,i)=>(
            <div key={i} style={{ position:"absolute", top:"50%", right:"6%", width:sz, height:sz, borderRadius:"50%", border:`1px solid rgba(255,200,50,${.035+i*.03})`, transform:"translateY(-50%)", animation:`${i%2?"spinCCW":"spinCW"} ${22+i*7}s linear infinite`, pointerEvents:"none" }}/>
          ))}
        </div>

       <div style={{
  maxWidth:1200,
  margin:"0 auto",

  padding:
    isMobile
      ? "0 16px"
      : isTablet
      ? "0 30px"
      : "0 60px"
}}>

          {/* ── PROFILE HEADER ── */}
<div style={{
  position:"relative",

  marginTop:isMobile ? -90 : -120,

  display:"flex",

  flexDirection:isMobile ? "column" : "row",

  alignItems:isMobile ? "center" : "flex-end",

  justifyContent:"space-between",

  textAlign:isMobile ? "center" : "left",

  flexWrap:"wrap",

  gap:20,

  paddingBottom:36,

  borderBottom:"1px solid rgba(255,255,255,.06)"
}}>           <div style={{
  display:"flex",

  flexDirection:isMobile ? "column" : "row",

  alignItems:isMobile ? "center" : "flex-end",

  gap:24
}}>
              {/* Avatar */}
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", inset:-3, borderRadius:28, background:"linear-gradient(135deg,#ffc832,#ff6b35)", zIndex:0 }}/>
        <div style={{ position:"relative", zIndex:1,width:isMobile ? 90 : 110,
height:isMobile ? 90 : 110, borderRadius:24, background:"linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.15))", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid #07080f", overflow:"hidden" }}>
          {user?.profileImage ? (
            <img
            src={user.profileImage}
              alt="avatar"
              style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:24 }}
            />
) : (
    <span className="clash" style={{ fontSize:45, fontWeight:700, color:"white" }}>{initials}</span>

)}
                </div>
              </div>
              <div style={{ paddingBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <h1 className="clash" style={{fontSize:isMobile ? 24 : 39,fontWeight:700, color:"white", lineHeight:1 }}>{user.name}</h1>
                  {user.role === "admin" && <span style={{ padding:"3px 10px", borderRadius:20, background:"rgba(176,106,255,.2)", border:"1px solid rgba(176,106,255,.4)", fontSize:16, letterSpacing:3, color:"#b06aff", fontWeight:700, textTransform:"uppercase" }}>Admin</span>}
                  {badges.length >= 5 && <span style={{ padding:"3px 10px", borderRadius:20, background:"rgba(255,200,50,.1)", border:"1px solid rgba(255,200,50,.3)", fontSize:16, letterSpacing:3, color:"#ffc832", fontWeight:700, textTransform:"uppercase" }}>Pro</span>}
                </div>
                <p style={{fontSize:isMobile ? 14 : 19,  color:"rgba(255,255,255,.35)", marginBottom:8 }}>{user.email}</p>
               <div style={{
  display:"flex",
  alignItems:"center",
  justifyContent:isMobile ? "center" : "flex-start",
  flexWrap:"wrap",
  gap:10
}}>
                  {avgRating ? <><Stars rating={parseFloat(avgRating)} size={12}/><span style={{ fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.4)" }}>{avgRating} ({user.ratingCount})</span></> : <span style={{ fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.2)" }}>No ratings yet</span>}
                  <span style={{ width:1, height:10, background:"rgba(255,255,255,.1)" }}/>
                  <span style={{ fontSize:17, color:"rgba(255,255,255,.25)", letterSpacing:2 }}>JOINED {memberSince.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
<div style={{
  display:"flex",

  flexDirection:isMobile ? "column" : "row",

  width:isMobile ? "100%" : "auto",

  gap:10,

  paddingBottom:6,

  flexWrap:"wrap"
}}>              <button onClick={() => setShowEdit(true)}
                style={{ padding:"10px 20px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:40, color:"rgba(255,255,255,.6)", fontSize:17, letterSpacing:3, textTransform:"uppercase", fontWeight:600, cursor:"pointer", transition:"all .3s",width:isMobile ? "100%" : "auto" }}
                onMouseEnter={e=>{e.target.style.borderColor="rgba(255,255,255,.25)";e.target.style.color="white";}}
                onMouseLeave={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";e.target.style.color="rgba(255,255,255,.6)";}}>
                ✎ Edit Profile
              </button>
              <button onClick={() => setShowTransfer(true)}
                style={{ padding:"10px 20px", background:"rgba(255,200,50,.08)", border:"1px solid rgba(255,200,50,.25)", borderRadius:40, color:"#ffc832", fontSize:17, letterSpacing:3, textTransform:"uppercase", fontWeight:700, cursor:"pointer", transition:"all .3s",width:isMobile ? "100%" : "auto" }}
                onMouseEnter={e=>e.target.style.background="rgba(255,200,50,.15)"}
                onMouseLeave={e=>e.target.style.background="rgba(255,200,50,.08)"}>
                ◈ Transfer
              </button>
              <div style={{ display:"flex", alignItems:"center",justifyContent:"center", gap:8, padding:"9px 18px", borderRadius:40, background:"rgba(255,200,50,.1)", border:"1px solid rgba(255,200,50,.25)" }}>
                <span className="clash" style={{ fontSize:27, fontWeight:700, color:"#ffc832" }}>{user.credits}</span>
                <span style={{ fontSize:16, letterSpacing:3, color:"rgba(255,200,50,.7)", textTransform:"uppercase" }}>Credits</span>
              </div>
            </div>
          </div>

          {/* ── PENDING ACTIONS BANNER ── */}
          {pendingActions.length > 0 && (
            <div style={{ margin:"28px 0 0", padding:"18px 24px", borderRadius:16, background:"rgba(255,200,50,.06)", border:"1px solid rgba(255,200,50,.2)", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#ffc832", animation:"pingDot 1.5s ease-out infinite" }}/>
                <span style={{ fontSize:17, letterSpacing:3, textTransform:"uppercase", color:"#ffc832", fontWeight:700 }}>Action Required</span>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {pendingActions.map((a,i) => (
                  <span key={i} style={{ padding:"6px 14px", borderRadius:20, background:a.color+"20", border:`1px solid ${a.color}30`,fontSize:isMobile ? 14 : 19, color:a.color, cursor:"pointer" }}
                    onClick={() => setTab("sessions")}>
                    {a.msg} →
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── STATS ── */}
          <div style={{ display:"grid", gridTemplateColumns:
  isMobile
    ? "1fr"
    : isTablet
    ? "1fr 1fr"
    : "repeat(3,1fr)",gap:16, padding:"28px 0 36px" }}>
            {[
              { label:"Total Sessions", val:totalL+totalT,         color:"#22c55e", icon:"◎" },
              { label:"As Teacher",     val:totalT,                color:"#38bdf8", icon:"⬡" },
              { label:"As Learner",     val:totalL,                color:"#b06aff", icon:"◈" },
              { label:"CR Earned",     val:totalCreditsEarned,    color:"#22c55e", icon:"↑" },
              { label:"CR Spent",      val:totalCreditsSpent,     color:"#ff6b35", icon:"↓" },
            ].map(s => (
              <div key={s.label} style={{ padding:"20px 18px", borderRadius:18, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)", position:"relative", overflow:"hidden", transition:"border-color .3s, transform .3s", cursor:"default" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color+"40";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${s.color}50,transparent)` }}/>
                <div style={{ position:"absolute", bottom:-16, right:-16, width:60, height:60, borderRadius:"50%", background:s.color, filter:"blur(30px)", opacity:.1 }}/>
                <div style={{ fontSize:isMobile ? 16 : 20, color:s.color, marginBottom:8 }}>{s.icon}</div>
                <div className="clash" style={{fontSize:isMobile ? 24 : 39,fontWeight:700, color:"white", lineHeight:1, marginBottom:4 }}>
                  {loading ? "—" : <CountUp to={s.val}/>}
                </div>
                <div style={{ fontSize:15, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,.28)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── BADGES ── */}
          {badges.length > 0 && (
            <div style={{ marginBottom:36 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:28, height:1, background:"#ffc832" }}/>
                <span style={{ fontSize:16, letterSpacing:4, textTransform:"uppercase", color:"#ffc832", fontWeight:700 }}>Achievements</span>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {badges.map(b => (
                  <div key={b.id} title={b.desc} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:30, background:`${b.color}12`, border:`1px solid ${b.color}30`, transition:"transform .2s, border-color .2s", cursor:"default" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.borderColor=b.color+"60";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor=b.color+"30";}}>
                    <span style={{fontSize:isMobile ? 16 : 21, color:b.color }}>{b.icon}</span>
                    <span style={{ fontSize:isMobile ? 14 : 18, fontWeight:700, color:b.color, letterSpacing:1 }}>{b.label}</span>
                  </div>
                ))}
                {Array(Math.max(0,6-badges.length)).fill(0).map((_,i)=>(
                  <div key={`lock-${i}`} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:30, background:"rgba(255,255,255,.02)", border:"1px dashed rgba(255,255,255,.07)" }}>
                    <span style={{fontSize:isMobile ? 16 : 21, color:"rgba(255,255,255,.15)" }}>🔒</span>
                    <span style={{fontSize:isMobile ? 14 : 18,color:"rgba(255,255,255,.15)", letterSpacing:1 }}>Locked</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TABS ── */}
<div style={{
  display:"flex",

  gap:2,

  marginBottom:36,

  padding:4,

  background:"rgba(255,255,255,.03)",

  border:"1px solid rgba(255,255,255,.06)",

  borderRadius:50,

  width:isMobile ? "100%" : "fit-content",

  overflowX:isMobile ? "auto" : "visible",

  flexWrap:isMobile ? "nowrap" : "wrap"
}}>            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding:"11px 24px", borderRadius:40, fontSize:16, letterSpacing:3, textTransform:"uppercase", fontWeight:700, border:"none", transition:"all .25s", cursor:"pointer",
                  background: tab===t.id ? "#ffc832" : "transparent",
                  color:      tab===t.id ? "#000"    : "rgba(255,255,255,.35)" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div style={{ paddingBottom:100 }}>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div style={{ display:"grid",gridTemplateColumns:
  isMobile
    ? "1fr"
    : "1fr 1fr", gap:28 }}>
                {/* Recent activity */}
                <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <h3 className="clash" style={{ fontSize:25, color:"white", marginBottom:20 }}>Recent Sessions</h3>
                  {[...learnerBooks,...teacherBooks].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5).map(b=>(
                    <div key={b.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <div>
                        <div style={{ fontSize:isMobile ? 16 : 20, color:"white", fontWeight:600, marginBottom:2 }}>{b.skill?.title}</div>
                        <div style={{ fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.3)" }}>{b.hours}h · {b.totalCredits} CR</div>
                      </div>
                      <StatusPill status={b.status}/>
                    </div>
                  ))}
                  {!learnerBooks.length&&!teacherBooks.length&&<p style={{ color:"rgba(255,255,255,.2)", fontSize:20 }}>No sessions yet</p>}
                </div>

                {/* Credit chart */}
                <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <h3 className="clash" style={{ fontSize:25, color:"white", marginBottom:20 }}>Credit Activity (6 months)</h3>
                  <CreditChart transactions={transactions} userId={user.id}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, padding:"12px 14px", borderRadius:12, background:"rgba(255,255,255,.03)" }}>
                    <div>
                      <div style={{ fontSize:17, color:"rgba(255,255,255,.3)", letterSpacing:2, marginBottom:3 }}>TOTAL EARNED</div>
                      <div className="clash" style={{ fontSize:29, color:"#22c55e", fontWeight:700 }}>+{totalCreditsEarned}</div>
                    </div>
                    <div style={{ width:1, background:"rgba(255,255,255,.06)" }}/>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:17, color:"rgba(255,255,255,.3)", letterSpacing:2, marginBottom:3 }}>TOTAL SPENT</div>
                      <div className="clash" style={{ fontSize:29, color:"#ff6b35", fontWeight:700 }}>-{totalCreditsSpent}</div>
                    </div>
                  </div>
                </div>

                {/* Recent reviews */}
                <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <h3 className="clash" style={{ fontSize:25, color:"white", marginBottom:20 }}>Recent Reviews</h3>
                  {reviews.slice(0,4).map(r=>(
                    <div key={r.id} style={{ padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:isMobile ? 14 : 19, color:"rgba(255,255,255,.5)", fontWeight:600 }}>{r.reviewerName}</span>
                        <Stars rating={r.rating} size={11}/>
                      </div>
                      {r.comment && <p style={{ fontSize:isMobile ? 14 : 19, color:"rgba(255,255,255,.4)", margin:0, lineHeight:1.5, fontStyle:"italic" }}>"{r.comment}"</p>}
                    </div>
                  ))}
                  {!reviews.length && <p style={{ color:"rgba(255,255,255,.2)", fontSize:20 }}>No reviews yet</p>}
                </div>

                {/* Badges overview */}
                <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <h3 className="clash" style={{ fontSize:25, color:"white", marginBottom:20 }}>Achievements</h3>
                  {badges.length === 0 ? (
                    <p style={{ color:"rgba(255,255,255,.2)", fontSize:20 }}>Complete sessions to earn badges</p>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {badges.map(b=>(
                        <div key={b.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:12, background:`${b.color}08`, border:`1px solid ${b.color}20` }}>
                          <span style={{ fontSize:25, color:b.color }}>{b.icon}</span>
                          <div>
                            <div style={{ fontSize:isMobile ? 14 : 19, fontWeight:700, color:b.color }}>{b.label}</div>
                            <div style={{ fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.3)" }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SESSIONS */}
            {tab === "sessions" && (
              <div style={{ display:"grid",gridTemplateColumns:
  isMobile
    ? "1fr"
    : "1fr 1fr", gap:24 }}>
                {[
                  { label:"As Learner", data:learnerBooks, color:"#b06aff", otherKey:"teacher" },
                  { label:"As Teacher", data:teacherBooks, color:"#38bdf8", otherKey:"learner" },
                ].map(col=>(
                  <div key={col.label}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:col.color }}/>
                      <span style={{ fontSize:17, letterSpacing:4, textTransform:"uppercase", color:col.color, fontWeight:700 }}>{col.label}</span>
                      <span style={{ padding:"2px 8px", borderRadius:20, background:`${col.color}15`, fontSize:17, color:col.color }}>{col.data.length}</span>
                    </div>
                    {col.data.length === 0 ? (
                      <div style={{ padding:"30px 20px", borderRadius:16, border:"1px dashed rgba(255,255,255,.06)", textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:20 }}>No sessions</div>
                    ) : (
                      <SessionList data={col.data} color={col.color} otherKey={col.otherKey} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* REVIEWS */}
            {tab === "reviews" && (
              <div>
                {/* Summary */}
                <div style={{ padding:"28px 32px", borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)", marginBottom:24, display:"flex", alignItems:"center", gap:isMobile ? 20 : 40, flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center", minWidth:100 }}>
                    <div className="clash" style={{fontSize:isMobile ? 50 : 71, fontWeight:700, color:"#ffc832", lineHeight:1 }}>{avgRating||"—"}</div>
                    <Stars rating={parseFloat(avgRating)||0} size={16}/>
                    <div style={{ fontSize:17, color:"rgba(255,255,255,.3)", marginTop:6, letterSpacing:2 }}>{user.ratingCount} REVIEWS</div>
                  </div>
                  <div style={{ flex:1, minWidth:200 }}>
                    {[5,4,3,2,1].map(star=>{
                      const count = reviews.filter(r=>r.rating===star).length;
                      const pct   = reviews.length ? (count/reviews.length)*100 : 0;
                      return (
                        <div key={star} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <span style={{ fontSize:isMobile ? 14 : 18, color:"rgba(255,255,255,.4)", width:8 }}>{star}</span>
                          <span style={{ fontSize:isMobile ? 14 : 18, color:"#ffc832" }}>★</span>
                          <div style={{ flex:1, height:4, background:"rgba(255,255,255,.05)", borderRadius:4 }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#ffc832,#ff6b35)", borderRadius:4, transition:"width .8s ease" }}/>
                          </div>
                          <span style={{ fontSize:17, color:"rgba(255,255,255,.3)", width:20 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <div style={{ padding:"60px 40px", borderRadius:24, border:"1px dashed rgba(255,255,255,.08)", textAlign:"center" }}>
                    <div style={{ fontSize:55, marginBottom:16 }}>★</div>
                    <p style={{ color:"rgba(255,255,255,.3)", fontSize:isMobile ? 16 : 21,letterSpacing:2 }}>NO REVIEWS YET</p>
                  </div>
                ) : (
                  <div style={{ display:"grid",gridTemplateColumns:
  isMobile
    ? "1fr"
    : "repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
                    {reviews.map(r=>(
                      <div key={r.id} style={{ padding:24, borderRadius:20, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)", position:"relative", overflow:"hidden" }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,200,50,.2)"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(255,200,50,.3),transparent)" }}/>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,rgba(255,200,50,.3),rgba(255,107,53,.15))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:isMobile ? 14 : 19, fontWeight:700, color:"white" }}>{r.reviewerName?.[0]?.toUpperCase()}</div>
                            <span style={{ fontSize:isMobile ? 14 : 19, color:"rgba(255,255,255,.7)", fontWeight:600 }}>{r.reviewerName}</span>
                          </div>
                          <Stars rating={r.rating} size={12}/>
                        </div>
                        {r.comment && <p style={{ fontSize:isMobile ? 16 : 20, color:"rgba(255,255,255,.5)", lineHeight:1.65, margin:0, fontStyle:"italic" }}>"{r.comment}"</p>}
                        <div style={{ marginTop:10, fontSize:16, color:"rgba(255,255,255,.2)", letterSpacing:2 }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CREDITS */}
            {tab === "credits" && (
              <div>
                {/* Chart */}
                <div style={{ padding:28, borderRadius:24, background:"linear-gradient(145deg,#10111a,#0c0d14)", border:"1px solid rgba(255,255,255,.07)", marginBottom:24 }}>
                  <h3 className="clash" style={{ fontSize:25, color:"white", marginBottom:20 }}>Credit Flow — Last 6 Months</h3>
                  <CreditChart transactions={transactions} userId={user.id}/>
                </div>

                {/* Transaction list */}
                <TxList transactions={transactions} userId={user.id} />
              </div>
            )}

            {/* TIMELINE */}
            {tab === "timeline" && (
              <Timeline learnerBooks={learnerBooks} teacherBooks={teacherBooks} reviews={reviews}/>
            )}

          </div>
        </div>
      </div>

      {showTransfer && <TransferModal onClose={()=>setShowTransfer(false)} onDone={refreshUser}/>}
      {showEdit     && <EditProfileModal 
  user={user} 
  onClose={()=>setShowEdit(false)} 
  onDone={refreshUser}
  preview={preview}
  setPreview={setPreview}
/>}
    </div>
  );
}