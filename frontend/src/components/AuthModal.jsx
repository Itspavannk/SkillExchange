import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { http } from "../api/client";
import useResponsive from "../hooks/useResponsive";

// Input component
function Input({ label, type = "text", value, onChange, disabled }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=" "
        style={{
          width: "100%",
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 12,
          padding: "18px 16px 6px",
          color: "white",
          fontSize: 14,
          outline: "none",
          transition: "border-color .25s",
          opacity: disabled ? 0.5 : 1
        }}
      />

      <label style={{
        position: "absolute",
        top: 7,
        left: 16,
        fontSize: 8,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "rgba(255,255,255,.3)"
      }}>
        {label}
      </label>
    </div>
  );
}

export default function AuthModal({ open, onClose }) {

  const [tab,setTab] = useState("login");

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");

  const [resetEmail,setResetEmail] = useState("");
  const [resetToken,setResetToken] = useState("");
  const [newPassword,setNewPassword] = useState("");

  const [err,setErr] = useState("");
  const [busy,setBusy] = useState(false);

  const { authLogin, authRegister } = useAuth();
  const { isMobile } = useResponsive();

  const reset = () => {
    setName("");
    setEmail("");
    setPass("");
    setErr("");
  };

  const switchTab = (t) => {
    setTab(t);
    reset();
  };

  const submit = async () => {

    setErr("");

    try {

      setBusy(true);

      // FORGOT PASSWORD
      if(tab === "forgot"){

        await http.post("/auth/forgot-password",{ email: resetEmail });

        setErr("Reset token generated. Check server console.");
        setTab("reset");
        setBusy(false);
        return;
      }

      // RESET PASSWORD
      if(tab === "reset"){

        await http.post("/auth/reset-password",{
          token: resetToken,
          newPassword: newPassword
        });

        setErr("Password updated. Please login.");
        setTab("login");
        setBusy(false);
        return;
      }

      // VALIDATION
      if(!email.trim()){
        setErr("Email is required");
        setBusy(false);
        return;
      }

      if(!pass.trim()){
        setErr("Password is required");
        setBusy(false);
        return;
      }

      if(tab === "register" && !name.trim()){
        setErr("Name is required");
        setBusy(false);
        return;
      }

      if(pass.length < 6){
        setErr("Password must be at least 6 characters");
        setBusy(false);
        return;
      }

      // LOGIN
      if(tab === "login"){
        await authLogin(email.trim(),pass);
      }

      // REGISTER
      if(tab === "register"){
        await authRegister(name.trim(),email.trim(),pass);
      }

      reset();
      onClose();

    } catch(e){
      setErr(e.message);
    }

    setBusy(false);
  };

  if(!open) return null;

  return (

    <div
      onClick={() => !busy && onClose()}
      style={{
        position:"fixed",
        inset:0,
        zIndex:500,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"rgba(0,0,0,.82)",
        backdropFilter:"blur(28px)"
      }}
    >

      <div
        onClick={e => e.stopPropagation()}
        style={{
  width:isMobile ? "calc(100vw - 32px)" : "100%",
  maxWidth:isMobile ? 420 : 460,
  margin:"0 auto"
}}
      >

        <div style={{
          background:"#0d0e16",
          borderRadius:isMobile ? 22 : 28,
padding:isMobile ? "28px 22px" : 36,
          border:"1px solid rgba(255,255,255,.08)"
        }}>

          {/* Tabs */}
          <div style={{display:"flex",gap:6,marginBottom:24}}>
            {["login","register"].map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  padding:"8px 18px",
                  borderRadius:10,
                  border:"none",
                  cursor:"pointer",
                  background: tab===t ? "#ffc832":"transparent",
                  color: tab===t ? "#000":"rgba(255,255,255,.35)"
                }}
              >
                {t==="login" ? "Sign In":"Register"}
              </button>
            ))}
          </div>

          {/* Title */}
          <h2 style={{fontSize:36,color:"white"}}>
            {tab==="login" && "Welcome back."}
            {tab==="register" && "Join the exchange."}
            {tab==="forgot" && "Reset your password."}
            {tab==="reset" && "Enter reset token."}
          </h2>

          <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:20}}>

            {tab==="register" &&
              <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} />
            }

            {(tab === "login" || tab === "register") && (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={busy}
                />

                <Input
                  label="Password"
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  disabled={busy}
                />
              </>
            )}

            {tab==="forgot" &&
              <Input label="Email Address" type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} />
            }

            {tab==="reset" && (
              <>
                <Input label="Reset Token" value={resetToken} onChange={e=>setResetToken(e.target.value)} />
                <Input label="New Password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
              </>
            )}

            {tab==="login" &&
              <button
                onClick={()=>setTab("forgot")}
                style={{
                  background:"none",
                  border:"none",
                  color:"rgba(255,255,255,.4)",
                  fontSize:11,
                  cursor:"pointer",
                  textAlign:"right"
                }}
              >
                Forgot password?
              </button>
            }

            {err &&
              <div style={{
                background:"rgba(255,80,80,.1)",
                border:"1px solid rgba(255,80,80,.3)",
                borderRadius:10,
                padding:12,
                color:"#ff9090"
              }}>
                ⚠ {err}
              </div>
            }

            <button
              onClick={submit}
              disabled={busy}
              style={{
                marginTop:10,
                background:"#ffc832",
                color:"#000",
                borderRadius:12,
                padding:16,
                border:"none",
                cursor:"pointer"
              }}
            >
              {busy
                ? "Please wait…"
                : tab==="login"
                ? "Sign In →"
                : tab==="register"
                ? "Create Account →"
                : tab==="forgot"
                ? "Send Reset Link →"
                : "Reset Password →"
              }
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}