import { useRef, useState } from "react";
import { AnimatedCounter, MagneticButton, ParticleField, SectionLabel,TiltCard } from "./primitives";
import SkillCard from "./SkillCard";
import { useReveal, useMouseParallax, usePublicSkills } from "../hooks";
import { STATS, HOW_STEPS, FLYWHEEL, TESTIMONIALS, FILTERS, FOOTER_COLS } from "../data/constants";
import { createBooking } from "../api/bookings";
import useResponsive from "../hooks/useResponsive";

// ══════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════
export function HeroSection({ onOpenModal, isAuth }) {
  const containerRef = useRef(null);
  const [mouse, onMouseMove] = useMouseParallax(containerRef);
 const [statsRef, statsVisible] = useReveal();
const [heroHover, setHeroHover] = useState(false);
const [showDemo, setShowDemo] = useState(false);
const { isMobile, isTablet } = useResponsive();

  return (
    <section id="Hero" ref={containerRef} onMouseMove={onMouseMove}
style={{
  position:"relative",
  minHeight:"100vh",

  display:"flex",

flexDirection:isMobile ? "column" : "row",

  width:"100%",
  overflowX:"hidden",}}>
     {!isMobile && <ParticleField/>}
      {/* Mouse glow */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,background:`radial-gradient(ellipse 85vw 65vh at ${mouse.x}% ${mouse.y}%,rgba(255,200,50,.055) 0%,transparent 65%)`,transition:"background 1.2s ease"}}/>
      {/* Grid lines */}
      <div style={{position:"absolute",inset:0,opacity:.02,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",backgroundSize:"88px 88px"}}/>
      {/* Scan line */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",opacity:.012,pointerEvents:"none",zIndex:2}}>
        <div style={{position:"absolute",left:0,right:0,height:120,background:"linear-gradient(transparent,rgba(255,255,255,.5),transparent)",animation:"scan 9s linear infinite"}}/>
      </div>
      {/* Divider */}
      {!isMobile && (<div style={{position:"absolute",top:0,bottom:0,right:"44%",width:1,background:"linear-gradient(transparent,rgba(255,200,50,.08),transparent)",zIndex:3}}/>)}

      {/* ── LEFT ── */}
<div style={{
  position:"relative",
  zIndex:10,
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  alignItems:isMobile ? "stretch" : "flex-start",

  width:"100%",
  maxWidth:isMobile ? "100%" : "56%",

  flex:isMobile ? "1 1 100%" : "0 0 56%",

  padding:
    isMobile
      ? "110px 18px 50px"
      : isTablet
      ? "120px 40px 70px"
      : "120px 72px 80px"
}}>
        <div style={{animation:"fadeUp .7s .1s ease both"}}>
          <div style={{display:"inline-flex",alignItems:(isMobile || isTablet) ? "stretch" : "center",gap:10,border:"1px solid rgba(255,200,50,.2)",background:"rgba(255,200,50,.06)",borderRadius:40,padding:"8px 18px",marginBottom:20,marginTop:isMobile ? 12 : 35, backdropFilter:"blur(8px)"}}>
            <div style={{position:"relative",width:7,height:7}}>
              <div style={{position:"absolute",width:7,height:7,borderRadius:"50%",background:"#ffc832"}}/>
              <div style={{position:"absolute",width:7,height:7,borderRadius:"50%",background:"#ffc832",animation:"pingDot 1.6s ease-out infinite"}}/>
            </div>
            <span style={{fontSize:isMobile ? 8:11,letterSpacing:5,textTransform:"uppercase",color:"#ffc832",fontWeight:600}}>The Knowledge Economy</span>
          </div>
        </div>

        <div style={{animation:"fadeUp .8s .2s ease both",width:"100%",}}>
          <div className="clash" style={{lineHeight:1,letterSpacing:5}}>
            <div style={{fontSize:
  isMobile
    ? "clamp(44px,16vw,64px)"
    : "clamp(70px,8.5vw,95px)",fontWeight:700,color:"white"}}>Trade</div>
            <div style={{fontSize:
  isMobile
    ? "clamp(52px,18vw,72px)"
    : "clamp(76px,9vw,100px)",fontWeight:700,color:"#ffc832",fontStyle:"italic",animation:"glowPulse 4s ease-in-out infinite"}}>Skills,</div>
            <div style={{fontSize:
  isMobile
    ? "clamp(44px,16vw,64px)"
    : "clamp(70px,8.5vw,95px)",fontWeight:700,WebkitTextStroke:"1.5px rgba(255,255,255,.3)",color:"transparent"}}>Not Money</div>
          </div>
        </div>

        <p style={{color:"rgba(255,255,255,.38)",fontSize:isMobile ? 15 : 18,lineHeight:1.75,maxWidth:460,marginTop:28,marginBottom:36,fontWeight:300,animation:"fadeUp .8s .35s ease both"}}>
          A peer-to-peer skill exchange where knowledge is the only currency. Teach what you know, learn what you don't.
        </p>

        <div style={{display:"flex",
              flexDirection:isMobile ? "column" : "row",
              gap:14,
              width:isMobile ? "100%" : "auto",animation:"fadeUp .8s .45s ease both"}}>
          <MagneticButton
          
            onClick={() => isAuth ? document.getElementById("Skills")?.scrollIntoView({ behavior: "smooth" }) : onOpenModal()}
            style={{width:isMobile ? "100%" : "auto",
justifyContent:"center",background:"#ffc832",color:"#000",borderRadius:18,padding:"16px 20px",fontSize:14,letterSpacing:3,textTransform:"uppercase",fontWeight:700,border:"none",boxShadow:"0 20px 60px rgba(255,200,50,.28)"}}>
            {isAuth ? "Browse Skills →" : "Start Exchanging →"}
          </MagneticButton>
          <MagneticButton
           onClick={() => setShowDemo(true)}
            
           
           style={{
              border:"1px solid rgba(255,255,255,.1)",
              width:isMobile ? "100%" : "auto",
justifyContent:"center",
              color:"rgba(255,255,255,.75)",
              borderRadius:16,
              padding:"16px 20px",
              fontSize:14,
              letterSpacing:3,
              textTransform:"uppercase",
              fontWeight:500,
              background:"rgba(255,255,255,.03)",
              backdropFilter:"blur(10px)"
            }}>
            ▶ Watch Demo
          </MagneticButton>
        </div>

        <div ref={statsRef} style={{display:"flex",gap:isMobile ? 20 : 44,
flexWrap:"wrap",marginTop:52,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.06)",animation:"fadeUp .8s .55s ease both"}}>
          {STATS.map(({n,s,l}) => (
            <div key={l}>
              <div className="clash" style={{fontSize:36,fontWeight:700,color:"white",lineHeight:1}}>
                {statsVisible ? <AnimatedCounter to={n} suffix={s}/> : "0"}
              </div>
              <div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.6)",marginTop:5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

{/* ── RIGHT */}
{!isMobile && (
<div style={{
  position:"relative",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  marginTop:"-100px",
  overflow:"hidden",
  background:"radial-gradient(circle at center, rgba(255,200,50,.08), transparent 65%)"
}}>

  {/* BIG AMBIENT GLOW */}
  <div style={{
    position:"absolute",
    width:900,
    height:900,
    borderRadius:"50%",
    background:"radial-gradient(circle, rgba(255,200,50,.12), transparent 70%)",
    filter:"blur(90px)",
    animation:"floatGlow 8s ease-in-out infinite"
  }}/>

<TiltCard
  style={{
    width:"85%",
    height:"380px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }}
>
  <div
    id="hero-demo"
    onMouseEnter={() => setHeroHover(true)}
    onMouseLeave={() => setHeroHover(false)}
    style={{
      position:"relative",
      width:"100%",
      height:"100%",
      borderRadius:34,
      overflow:"hidden",
      transition:"transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s",
      cursor:"pointer",
      boxShadow:"0 60px 160px rgba(0,0,0,.85)",
      border:"1px solid rgba(255,255,255,.08)",
      background:"rgba(255,255,255,.03)",
      backdropFilter:"blur(16px)",
    }}
  >

    {/* TOP SHINE */}
    <div style={{
      position:"absolute",
      inset:0,
      background:"linear-gradient(to bottom, rgba(255,255,255,.08), transparent 28%)",
      pointerEvents:"none",
      zIndex:2
    }}/>

    {/* LIVE LABEL */}
    <div style={{
      position:"absolute",
      top:18,
      left:18,
      zIndex:3,
      padding:"9px 15px",
      borderRadius:30,
      background:"rgba(0,0,0,.45)",
      border:"1px solid rgba(255,255,255,.08)",
      color:"#ffc832",
      fontSize:11,
      letterSpacing:3,
      textTransform:"uppercase",
      backdropFilter:"blur(10px)"
    }}>
      ● Live SkillExchange Preview
    </div>

    {/* VIDEO */}
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{
        width:"100%",
        display:"block",
        objectFit:"cover",
        height:"100%",
        opacity:.95
      }}
    >
      <source src="/demo.mp4" type="video/mp4" />
    </video>

  </div>

</TiltCard>
    </div>
)}

{showDemo && (
  <div
  
    onClick={() => setShowDemo(false)}
    style={{
      position:"fixed",
      inset:0,
      background:"rgba(0,0,0,.82)",
      backdropFilter:"blur(18px)",
      zIndex:9999,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      animation:"fadeIn .45s ease"
    }}
  >

    {/* background glow */}
    <div style={{
      position:"absolute",
      width:900,
      height:900,
      borderRadius:"50%",
      background:"radial-gradient(circle, rgba(255,200,50,.14), transparent 70%)",
      filter:"blur(90px)"
    }}/>

    {/* cinematic container */}
    <div 
  onClick={(e)=>e.stopPropagation()}
  onMouseEnter={() => setHeroHover(true)}
  onMouseLeave={() => setHeroHover(false)}
  style={{
    position:"relative",
width:isMobile ? "94%" : "78%",
maxWidth:isMobile ? "94vw" : "1300px",
    borderRadius:34,
    overflow:"hidden",
    background:"#05060d",
    boxShadow: heroHover
      ? `
          0 0 0 1px rgba(255,200,50,.08),
          0 40px 140px rgba(255,200,50,.12),
          0 30px 120px rgba(0,0,0,.9)
        `
      : "0 40px 180px rgba(0,0,0,.9)",

transition:"transform .55s cubic-bezier(.16,1,.3,1), box-shadow .55s, border .4s",    animation:"demoEnter .7s cubic-bezier(.16,1,.3,1) forwards"
  }}
>

  {/* hover glow */}
  <div style={{
    position:"absolute",
    inset:0,
    borderRadius:34,
    background: heroHover
      ? "radial-gradient(circle at top right, rgba(255,200,50,.16), transparent 45%)"
      : "transparent",
    opacity: heroHover ? 1 : 0,
    transition:"all .5s ease",
    pointerEvents:"none",
    zIndex:2
  }}/>

  <div style={{
  position:"absolute",
  top:0,
  left:0,
  right:0,
  height:2,
  background:"linear-gradient(90deg,#ffc832,#ff9f1c,#ffc832)",
  opacity: heroHover ? 1 : 0,
  transition:"opacity .4s ease",
  zIndex:3
}}/>


      {/* top label */}
      {!isMobile && (
      <div style={{
        position:"absolute",
        top:18,
        left:18,
        zIndex:4,
        padding:isMobile ?"6px 8px" :"10px 18px",
        borderRadius:40,
        background:"rgba(0,0,0,.45)",
        border:"1px solid rgba(255,255,255,.08)",
        color:"#ffc832",
        fontSize:isMobile ? 6:11,
        letterSpacing:3,
        textTransform:"uppercase",
        backdropFilter:"blur(10px)"
      }}>
        ● Live Platform Walkthrough
      </div>
      )}

      {/* close */}
      <button
        onClick={() => setShowDemo(false)}
        style={{
          position:"absolute",
          top:18,
          right:18,
          zIndex:5,
width:isMobile ? 36 : 42,
height:isMobile ? 36 : 42,
          borderRadius:"50%",
          border:"1px solid rgba(255,255,255,.08)",
          background:"rgba(0,0,0,.4)",
          color:"white",
          fontSize:18,
          cursor:"pointer"
        }}
      >
        ✕
      </button>

      <video
        autoPlay
        controls
        muted
        style={{
          width:"100%",
          display:"block",
          objectFit:"cover",
          aspectRatio:isMobile ? "16/11" : "16/9",
        }}
      >
        <source src="/demo.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
)}
    </section>
  );
}

// ══════════════════════════════════════════════
//  HOW IT WORKS
// ══════════════════════════════════════════════
export function HowItWorksSection() {
  const { isMobile, isTablet } = useResponsive();
  const [ref, visible] = useReveal();
  return (
    <section id="How-it-works" style={{padding:
  isMobile
    ? "90px 18px"
    : isTablet
    ? "100px 32px"
    : "120px 80px",background:"#080912",position:"relative",scrollMarginTop: "150px"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,200,50,.15),transparent)"}}/>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} style={{marginBottom:80,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",transition:"all .9s cubic-bezier(.16,1,.3,1)"}}>
          <SectionLabel text="The Process"/>
          <div className="clash" style={{fontSize:"clamp(52px,6vw,96px)",fontWeight:700,lineHeight:.9}}>
            <span style={{color:"white"}}>Simple as </span>
            <span style={{color:"#ffc832",fontStyle:"italic"}}>three steps</span>
          </div>
        </div>
        <div style={{display:"grid",justifyItems:isMobile ? "center" : "stretch",
textAlign:isMobile ? "center" : "left",gridTemplateColumns:
  isMobile
    ? "1fr"
    : isTablet
    ? "1fr 1fr"
    : "repeat(3,1fr)",gap:1,background:"rgba(255,255,255,.04)"}}>
          {HOW_STEPS.map((step, i) => <HowStep key={i} step={step} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

function HowStep({ step, index }) {
  const [ref, visible] = useReveal(index * 120);
  const [hov, setHov]  = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{position:"relative",background:hov?"#0d0e1a":"#080912",padding:"52px 44px",overflow:"hidden",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",transition:"background .4s,opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#ffc832,#ff6b35,#b06aff,#ffc832)",backgroundSize:"300% 300%",animation:"borderRun 3s linear infinite",opacity:hov?1:0,transition:"opacity .4s"}}/>
      <div className="clash" style={{position:"absolute",top:16,right:20,fontSize:88,fontWeight:700,color:"rgba(255,255,255,.025)",lineHeight:1}}>{step.n}</div>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{width:52,height:52,borderRadius:14,marginBottom:36,border:`1px solid ${hov?"rgba(255,200,50,.3)":"rgba(255,255,255,.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:hov?"#ffc832":"rgba(255,255,255,.3)",transition:"all .4s"}}>{step.icon}</div>
        <div className="clash" style={{fontSize:25,fontWeight:600,color:"white",marginBottom:14,fontStyle:"italic"}}>{step.t}</div>
        <p style={{fontSize:20,color:"rgba(255,255,255,.32)",lineHeight:1.8,fontWeight:300}}>{step.d}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  SKILLS GRID — live from GET /skills
// ══════════════════════════════════════════════
export function SkillsGridSection({ isAuth, onOpenModal }) {
  const { isMobile, isTablet } = useResponsive();
  const [filter, setFilter] = useState("All");

  const [headerRef, headerVis] = useReveal();
  const { data: skills, loading, error } = usePublicSkills();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [toast, setToast] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [hours, setHours] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false); 
  const [visibleCount, setVisibleCount] = useState(9);
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  const showToast = (message, type = "success") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 3000);
};


const handleBooking = async () => {

if (!dateTime) {
  showToast("Please select date & time", "error");
  return;
}

const selected = new Date(dateTime);

const minimumTime =
  new Date(Date.now() + 30 * 60 * 1000);

if (selected < minimumTime) {

  showToast(
    "Please schedule at least 30 minutes ahead",
    "error"
  );

  return;
}

  try {
    setBookingLoading(true);

  await createBooking({
    skillId: selectedSkill.id,
    hours: Number(hours),
    scheduledAt: dateTime
  });

    setSelectedSkill(null);
    setIsBookingMode(false);   
    showToast("Booking confirmed!", "success");

  } catch (err) {
  const msg = err?.message?.toLowerCase() || "";
  const status = err?.status;

  if (status === 400 && msg.includes("own skill")) {
    showToast("You cannot book your own skill", "error");
  } 
  else if (status === 401) {
    showToast("Please login first", "error");
  } 
  else {
    showToast("Booking failed. Try again.", "error");
  }
}

  setBookingLoading(false);
};


  const source   = skills || [];
  const filtered = filter === "All"
    ? source
    : source.filter(s => (s.category || "").toLowerCase().includes(filter.toLowerCase()));

    const visibleSkills = filtered.slice(0, visibleCount);

  return (
    <section id="Skills" style={{padding:
        isMobile
          ? "90px 18px"
          : isTablet
          ? "100px 32px"
          : "120px 80px",background:"#060710",scrollMarginTop: "150px"}}>
            <div style={{maxWidth:
        isMobile
          ? "100%"
          : isTablet ? 900 :
          1350,
          margin:"0 auto"}}>
        <div ref={headerRef} style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:56,flexWrap:"wrap",gap:24,opacity:headerVis?1:0,transform:headerVis?"translateY(0)":"translateY(50px)",transition:"all .9s cubic-bezier(.16,1,.3,1)"}}>
          <div>
            <SectionLabel text="The Marketplace"/>
            <div className="clash" style={{fontSize:
  isMobile
    ? "clamp(34px,11vw,54px)"
    : "clamp(44px,5vw,78px)",fontWeight:700,lineHeight:.9}}>
              <span style={{color:"white"}}>Featured </span>
              <span style={{color:"#ffc832",fontStyle:"italic"}}>Skills</span>
            </div>
          </div>
<div
  className="hide-scrollbar"
  style={{
    display:"flex",
    flexWrap:"nowrap",
    overflowX:"auto",
    gap:isMobile ? 6 : 8,
    paddingBottom:6,
    width:"100%"
  }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => {
                  setFilter(f);
                  setVisibleCount(9);
                }}
               style={{padding:isMobile ? "9px 14px" : "13px 18px",borderRadius:30,fontSize:isMobile ? 8 : 13,letterSpacing:isMobile ? 2 : 3,textTransform:"uppercase",fontWeight:700,border:"none",transition:"all .3s",background:filter===f?"#ffc832":"transparent",color:filter===f?"#000":"rgba(255,255,255,.32)",outline:filter===f?"none":"1px solid rgba(255,255,255,.09)"}}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{color:"rgba(255,255,255,.3)",fontSize:16,padding:40,textAlign:"center",letterSpacing:3}}>Loading skills from backend…</div>}
        {error   && <div style={{color:"#ff8080",fontSize:16,padding:40,textAlign:"center"}}>⚠ {error}</div>}
        {!loading && !error && (
<div
  className="hide-scrollbar"
  style={
isMobile
  ? {
      display: "flex",
      flexWrap: "nowrap",

      overflowX: "auto",
      overflowY: "hidden",

      WebkitOverflowScrolling: "touch",
      scrollSnapType: "x mandatory",

      gap: 14,

      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 10,
scrollPaddingLeft:16,

      width: "100%"
    }

      : {
          display:"grid",
          gridTemplateColumns:
            isTablet
              ? "1fr 1fr"
              : "repeat(3,380px)",

          gap:isMobile ? 24 : 80
        }
  }
>
           {visibleSkills.map((skill, i) => (
<div
  style={
isMobile
  ? {
      flex: "0 0 90%",

      minWidth: "92%",
      maxWidth: "92%",
      scrollSnapAlign: "start"
    }

      : {
          width:"100%"
        }
  }
>
              <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  index={i}
                  onSelect={(skill) => {
                  setSelectedSkill(skill);
                  setIsBookingMode(false);  
                  setBookingSuccess(false);
                  setHours(1);
}}
/>
</div>
            ))}
            {filtered.length === 0 && (
  <div style={{
    color:"rgba(152, 149, 153, 0.5)",
    fontSize:17,
    padding:40,
    textAlign:"center",
    letterSpacing:2
  }}>
    No skills found in this category.
  </div>
)}
            {source.length === 0 && (
              <div style={{color:"rgba(255,255,255,.2)",fontSize:12,letterSpacing:2,padding:40}}>
                No skills listed yet. Be the first to add one!
              </div>
            )}
          </div>
        )}

        {window.innerWidth > 768 && visibleCount < filtered.length && (
  <div style={{ textAlign: "center", marginTop: 40 }}>
          <MagneticButton
            onClick={() => setVisibleCount(prev => prev + 6)}
            style={{
              padding: "20px 35px",
              borderRadius: 30,
              fontSize:16,
              background: "#ffc832",
              color: "#000",
              fontWeight: 700,
              letterSpacing: 2,
              border: "none",
              cursor: "pointer"
            }}
          >
            Show More
          </MagneticButton>
  </div>
)}

{window.innerWidth > 768 &&
 visibleCount >= filtered.length &&
 filtered.length > 9 && (
  <div style={{ textAlign:"center", marginTop:40 }}>
    <MagneticButton
      onClick={() => setVisibleCount(9)}
      style={{
        padding:"20px 35px",
        borderRadius:30,
        fontSize:16,
        background:"rgba(255,255,255,.05)",
        color:"rgba(255,255,255,.75)",
        fontWeight:700,
        letterSpacing:2,
        border:"1px solid rgba(255,255,255,.08)",
        cursor:"pointer"
      }}
    >
      Show Less
    </MagneticButton>
  </div>
)}



{selectedSkill && (



      <div
        onClick={() => setSelectedSkill(null)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding:isMobile ? "20px 12px" : "60px 20px",
          zIndex: 999
        }}
      >
        

<div className="hide-scrollbar"
      onClick={(e) => e.stopPropagation()}
    style={{
      width:isMobile ? "94vw" : "700px",
maxWidth:isMobile ? "94vw" : "700px",
      background: "linear-gradient(160deg, rgba(20,22,40,0.95), rgba(10,12,25,0.95))",
      backdropFilter: "blur(20px)",
      padding:isMobile ? "26px 18px" : "40px",
      borderRadius:isMobile ? "22px" : "28px",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: `
        0 25px 80px rgba(0,0,0,0.6),
        0 0 40px rgba(255,200,50,0.15)
      `,
      position: "relative",
      maxHeight:"88vh",
overflowY:"auto",
msOverflowStyle:"none",
scrollbarWidth:"none",
    }}
    >

        {/* Title */}
<h2 style={{
  fontSize:isMobile ? 26 : 38,
  fontWeight: 800,
  textAlign: "center",
  marginBottom: 25,
  background: "linear-gradient(90deg,#ffc832,#ff9f1c)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: 1
}}>
  {selectedSkill.title}
</h2>

        {/* Description */}
<div
  className="premium-scroll"
  style={{
    color:"rgba(255,255,255,.75)",
    fontSize:isMobile ? 14 : 16,
    lineHeight:1.7,

    marginBottom:30,
    textAlign:"center",

    wordBreak:"break-word",

    maxHeight:isMobile ? 110 : "unset",
    overflowY:isMobile ? "auto" : "visible",

    paddingRight:isMobile ? 6 : 0
  }}
>
  {selectedSkill.description}
</div>

        {/* Info */}
        <div style={{marginBottom:isMobile ? 20 : 30}}>
          <p style={{ marginBottom: 15 }}><b>Category : </b> {selectedSkill.category}</p>
          <p style={{ marginBottom: 15 }}><b>Level : </b> {selectedSkill.level}</p>
          <p style={{ marginBottom: 15 }}><b>Credits/hr : </b> {selectedSkill.creditsPerHour}</p>
          <p style={{ marginBottom: 15 }}><b>Teacher : </b>{selectedSkill.ownerName}</p>
          <p style={{ marginBottom: 15 }}><b>Teacher Rating : </b> {selectedSkill.ownerAverageRating} ⭐</p>
        </div>

        {isBookingMode && (
  <div style={{
    marginTop: 20,
   padding:isMobile ? 16 : 20,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.02)"
  }}>
    <p style={{ marginBottom: 10 }}>Select Total Hours You Want to Book :</p>


<input
  type="number"
  value={hours}
  onChange={(e) => {
    const val = e.target.value;

    if (val === "") {
      setHours("");
      return;
    }

    if (Number(val) > 0) {
      setHours(val);
    }
  }}
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.2)",
    background: "transparent",
    color: "white"
  }}
/>

<div style={{ marginTop: 15 }}>

<div style={{ marginTop: 18 }}>

  <p style={{
    marginBottom: 12,
    color: "rgba(255,255,255,.9)",
    fontWeight: 600
  }}>
    Choose Session Date
  </p>

  <input
    type="date"
    value={dateTime.split("T")[0] || ""}
    min={
          new Date(
            now.getTime() + 30 * 60 * 1000
          ).toISOString().slice(0,16)
        }
    onChange={(e) => {
      const time = dateTime.split("T")[1] || "";
      setDateTime(`${e.target.value}T${time}`);
    }}
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.12)",
      background: "rgba(255,255,255,.03)",
      color: "white",
      fontSize: 15,
      marginBottom: 18,
      outline: "none"
    }}
  />

  <p style={{
    marginBottom: 12,
    color: "rgba(255,255,255,.9)",
    fontWeight: 600
  }}>
    Sessions must be scheduled at least 30 minutes in advance.
  </p>

  <input
    type="time"
    value={dateTime.split("T")[1] || ""}
    onChange={(e) => {
      const date = dateTime.split("T")[0] || "";
      setDateTime(`${date}T${e.target.value}`);
    }}
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.12)",
      background: "rgba(255,255,255,.03)",
      color: "white",
      fontSize: 15,
      outline: "none"
    }}
  />

  <p style={{
    marginTop: 10,
    fontSize: 13,
    color: "rgba(255,255,255,.45)"
  }}>
    Select your preferred session schedule
  </p>

</div>

    {dateTime && (
  <p style={{
    marginTop: 8,
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: 500
  }}>
     Scheduled for: {new Date(dateTime).toLocaleString()}
  </p>
)}


</div>

    <p style={{ marginTop: 10 }}>
      Total Credits: <b>{hours * selectedSkill.creditsPerHour}</b>
    </p>
  </div>
)}



        {/* Buttons */}
<div style={{display:"flex",
flexDirection:isMobile ? "column" : "row",
gap:isMobile ? 14 : 20,marginTop: 30 }}>


  {!isBookingMode ? (
    <MagneticButton
        onClick={() => {
          if (!isAuth) {
            setSelectedSkill(null);   
            onOpenModal();            
            return;
          }
          setIsBookingMode(true);
        }}
      style={{
        flex: 1,
        background: "#ffc832",
        color: "#000",
        borderRadius: 10,
        padding: "15px",
        fontSize: 16
      }}
    >
      Book Session
    </MagneticButton>
  ) : (
    <MagneticButton
      onClick={handleBooking}
      disabled={!dateTime}
      style={{
        flex: 1,
        background: (!dateTime || bookingLoading) ? "#777" : "#ffc832",
        color: "#000",
        borderRadius: 10,
        padding: "15px",
        fontSize: 16
      }}
    >
      {bookingLoading ? "Booking..." : "Confirm Booking"}
    </MagneticButton>
  )}

  <MagneticButton
    onClick={() => setSelectedSkill(null)}
    style={{
      flex: 1,
      background: "transparent",
      border: "1px solid rgba(255,255,255,.7)",
      borderRadius: 10,
      padding: "15px",
      color: "white",
      fontSize: 16
    }}
  >
    Close
  </MagneticButton>

</div>

      </div> 
    </div>   

)}

        
      </div>



{toast && (
  <div style={{
    position: "fixed",
    bottom: 30,
    right: 50,
    minWidth: 250,
    padding: "16px 20px",
    borderRadius: 12,
    fontWeight: 600,
    zIndex: 1000,
    color: toast.type === "success" ? "#000" : "#fff",
    background:
      toast.type === "success"
        ? "linear-gradient(135deg,#4ade80,#22c55e)"
        : "linear-gradient(135deg,#ef4444,#dc2626)",
    boxShadow: "0 10px 40px rgba(0,0,0,.4)"
  }}>


    {toast.message}
  </div>
)}
    </section>
  );
}



// ══════════════════════════════════════════════
//  CREDITS
// ══════════════════════════════════════════════
export function CreditsSection() {
  const { isMobile, isTablet } = useResponsive();
  const [leftRef,  leftVis]  = useReveal(0);
  const [rightRef, rightVis] = useReveal(150);
  return (
    <section id="Credits" style={{display:"grid",
gridTemplateColumns:
  isMobile
    ? "1fr"
    : "1fr 1fr",minHeight:700,scrollMarginTop: "200px"}}>
      <div ref={leftRef} style={{background:"#050611",borderRight:"1px solid rgba(255,255,255,.04)",padding:
  isMobile
    ? "70px 18px"
    : isTablet
    ? "80px 40px"
    : "96px 80px",display:"flex",flexDirection:"column",justifyContent:"center",opacity:leftVis?1:0,transform:leftVis?"translateX(0)":"translateX(-50px)",transition:"all 1s cubic-bezier(.16,1,.3,1)"}}>
        <SectionLabel text="The Currency"/>
        <div className="clash" style={{fontSize:"clamp(44px,5vw,72px)",fontWeight:700,lineHeight:.9,marginBottom:24}}>
          <span style={{color:"white"}}>Credits Are</span><br/>
          <span style={{color:"#ffc832",fontStyle:"italic"}}>Your Power</span>
        </div>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:18,lineHeight:1.8,maxWidth:420,marginBottom:44,fontWeight:300}}>
          No real money. No subscriptions. Credits are the lifeblood — earn by teaching, spend on learning.
        </p>
        <div style={{position:"relative",display:"inline-block"}}>
          <div style={{position:"absolute",inset:-1,borderRadius:isMobile ? 18 : 24,background:"linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,107,53,.1))",filter:"blur(2px)"}}/>
          <div style={{position:"relative",display:"flex",
flexDirection:isMobile ? "column" : "row",
alignItems:isMobile ? "flex-start" : "center",
gap:24,border:"1px solid rgba(255,200,50,.15)",background:"rgba(255,200,50,.06)",borderRadius:24,padding:"28px 32px"}}>
            <div className="clash" style={{fontSize:isMobile ? 56 : 72,fontWeight:700,color:"#ffc832",lineHeight:1}}>100</div>
            <div>
              <div style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:4}}>Free credits</div>
              <div style={{fontSize:18,color:"rgba(255,255,255,.65)",fontWeight:300}}>On every signup</div>
            </div>
          </div>
        </div>
      </div>

      <div ref={rightRef} style={{background:"#0a0b14",padding:
  isMobile
    ? "70px 18px"
    : isTablet
    ? "80px 40px"
    : "96px 72px",display:"flex",flexDirection:"column",justifyContent:"center",opacity:rightVis?1:0,transform:rightVis?"translateX(0)":"translateX(50px)",transition:"all 1s cubic-bezier(.16,1,.3,1)"}}>
        <SectionLabel text="How It Flows"/>
        <div className="clash" style={{fontSize:"clamp(36px,4vw,58px)",fontWeight:700,lineHeight:.9,marginBottom:48}}>
          <span style={{color:"white"}}>The </span><span style={{color:"#ffc832",fontStyle:"italic"}}>Flywheel</span>
        </div>
        {FLYWHEEL.map((item, i) => <FlywheelItem key={i} item={item} isLast={i===FLYWHEEL.length-1}/>)}
      </div>
    </section>
  );
}

function FlywheelItem({ item, isLast }) {
  const { isMobile } = useResponsive();
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{display:"flex",gap:20,paddingTop:22,paddingBottom:22,paddingLeft:hov?10:0,borderBottom:isLast?"none":"1px solid rgba(255,255,255,.05)",transition:"padding .3s ease"}}>
      <span className="clash" style={{fontSize:35,fontWeight:700,color:hov?"rgba(255,200,50,.7)":"rgba(255,200,50,.28)",minWidth:48,lineHeight:1,paddingTop:3,transition:"color .3s"}}>{item.n}</span>
      <div>
        <div className="clash" style={{fontSize:22,fontWeight:600,color:"white",fontStyle:"italic",marginBottom:6}}>{item.t}</div>
        <p style={{fontSize:16,color:"rgba(255,255,255,.55)",lineHeight:isMobile ? 1.45 : 1.7,fontWeight:300}}>{item.d}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  TESTIMONIALS
// ══════════════════════════════════════════════
export function TestimonialsSection() {
  const { isMobile, isTablet } = useResponsive();
  const [ref, visible] = useReveal();
  return (
    <section id="Community" style={{padding:
  isMobile
    ? "90px 18px"
    : isTablet
    ? "100px 32px"
    : "120px 80px",background:"#080912",position:"relative",scrollMarginTop: "140px"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,200,50,.12),transparent)"}}/>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} style={{marginBottom:64,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",transition:"all .9s cubic-bezier(.16,1,.3,1)"}}>
          <SectionLabel text="Community"/>
          <div className="clash" style={{fontSize:"clamp(52px,6vw,96px)",fontWeight:700,lineHeight:.9}}>
            <span style={{color:"white"}}>What They </span>
            <span style={{color:"#ffc832",fontStyle:"italic"}}>Say</span>
          </div>
        </div>
<div
  className="hide-scrollbar"
  style={
isMobile
  ? {
    scrollPaddingLeft:"18px",

      display:"flex",
      overflowX:"auto",
      overflowY:"hidden",

      gap:14,

      paddingLeft:18,
      paddingRight:40,
      paddingBottom:6,

      scrollSnapType:"x mandatory",
      WebkitOverflowScrolling:"touch",

      alignItems:"stretch"
    }
      : {
          display:"grid",
          gridTemplateColumns:
            isTablet
              ? "1fr 1fr"
              : "repeat(3,1fr)",
          gap:16
        }
  }
>
{TESTIMONIALS.map((t, i) => (
  <div
    key={i}
    style={
      isMobile
        ? {
minWidth:"82%",
maxWidth:"82%",
            flexShrink:0,
            scrollSnapAlign:"start"
          }
        : {}
    }
  >
    <TestiCard t={t} i={i}/>
  </div>
))}
        </div>
      </div>
    </section>
  );
}

function TestiCard({ t, i }) {
  const { isMobile } = useResponsive();
  const [ref, visible] = useReveal(i * 120);
  const [hov, setHov]  = useState(false);
  return (
    <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",transition:`all .8s ${i*.12}s cubic-bezier(.16,1,.3,1)`}}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
  position:"relative",
  border:`1px solid ${hov?t.col+"25":"rgba(255,255,255,.07)"}`,
  borderRadius:24,

  padding:isMobile ? 18 : 32,

  background:"#0a0b14",

  overflow:"hidden",

  height:"100%",

  display:"flex",
  flexDirection:"column",
  justifyContent:"space-between",

  transform:hov?"translateY(-6px)":"translateY(0)",

  transition:"all .5s cubic-bezier(.16,1,.3,1)"
}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${t.col},transparent)`,opacity:hov?1:0,transition:"opacity .4s"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="clash" style={{fontSize:isMobile ? 38 : 60,fontWeight:700,color:`${t.col}25`,lineHeight:1,marginBottom:8}}>"</div>
          <div style={{display:"flex",gap:2,marginBottom:isMobile ? 8 : 16}}>{[...Array(5)].map((_,j) => <span key={j} style={{color:"#ffc832",fontSize:isMobile ? 18 : 25}}>★</span>)}</div>
          <p style={{
  fontStyle:"italic",

  fontSize:isMobile ? 14 : 18,

  color:"rgba(255,255,255,.7)",

  lineHeight:1.7,

  marginBottom:isMobile ? 14 : 28,

  minHeight:isMobile ? 160 : 220,

  display:"flex",
  alignItems:"flex-start"
}}>{t.text}</p>
          <div style={{display:"flex",marginLeft:"auto",marginTop:"auto",alignItems:"center",gap:12,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${t.col}60,${t.col}18)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white"}}>{t.init}</div>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:"white"}}>{t.name}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.25)",letterSpacing:1}}>{t.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  CTA
// ══════════════════════════════════════════════
export function CTASection({ onOpenModal, isAuth, onAddSkill }){
  const { isMobile, isTablet } = useResponsive();
  const [ref, visible] = useReveal();
  return (
    <section id="Contact" style={{position:"relative",padding:
  isMobile
    ? "100px 20px"
    : isTablet
    ? "120px 40px"
    : "160px 80px",background:"#040510",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",pointerEvents:"none",userSelect:"none"}}>
        <span className="clash" style={{fontSize:"21vw",fontWeight:700,color:"rgba(255,255,255,.015)",whiteSpace:"nowrap",letterSpacing:-8}}>EXCHANGE</span>
      </div>
      <div ref={ref} style={{position:"relative",zIndex:10,maxWidth:800,margin:"0 auto",textAlign:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(60px)",transition:"all 1s cubic-bezier(.16,1,.3,1)"}}>
        <div className="clash" style={{fontSize:
  isMobile
    ? "clamp(42px,14vw,64px)"
    : "clamp(60px,9vw,118px)",fontWeight:700,lineHeight:.88,marginBottom:28}}>
          <span style={{color:"white"}}>Ready to</span><br/>
          <span style={{color:"#ffc832",fontStyle:"italic"}}>Exchange?</span>
        </div>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:20,maxWidth:480,margin:"0 auto 52px",lineHeight:1.7,fontWeight:300}}>
          Join thousands of learners and teachers — one skill at a time.
        </p>
<div style={{
  display:"flex",
  gap:14,
  flexWrap:"wrap",
  width:"100%",
  justifyContent:"center",
  alignItems:"center"
}}>

  {!isAuth && (
    <MagneticButton
      onClick={onOpenModal}
      style={{
        width:isMobile ? "100%" : "auto",
maxWidth:isMobile ? "100%" : "unset",
justifyContent:"center",
        background:"#ffc832",
        color:"#000",
        borderRadius:16,
        padding:"20px 48px",
        fontSize:isMobile ? 12:15,
        letterSpacing:4,
        textTransform:"uppercase",
        fontWeight:700,
        border:"none",
        boxShadow:"0 0 60px rgba(255,200,50,.35)"
      }}>
      Start for Free →
    </MagneticButton>
  )}

  {isAuth && (
    <MagneticButton
      onClick={onAddSkill}
      style={{
        width:isMobile ? "100%" : "auto",
maxWidth:isMobile ? "100%" : "unset",
justifyContent:"center",
        border:"1px solid rgba(255,200,50,.3)",
        color:"#ffc832",
        borderRadius:16,
        padding:"20px 48px",
        fontSize:16,
        letterSpacing:4,
        textTransform:"uppercase",
        fontWeight:600,
        background:"transparent"
      }}>
      + List Skill
    </MagneticButton>
  )}

  <MagneticButton
    onClick={() => document.getElementById("Skills")?.scrollIntoView({ behavior: "smooth" })}
    style={{
              width:isMobile ? "100%" : "auto",
maxWidth:isMobile ? "100%" : "unset",
justifyContent:"center",
      border:"1px solid rgba(255,255,255,.7)",
      color:"rgba(255,255,255,.75)",
      borderRadius:16,
      padding:"20px 48px",
      fontSize:isMobile ? 12:15,
      letterSpacing:4,
      textTransform:"uppercase",
      fontWeight:600,
      background:"transparent"
    }}>
    Browse Skills
  </MagneticButton>

</div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════
export function Footer() {
  const { isMobile, isTablet } = useResponsive();
  return (
    <footer style={{background:"#050611",borderTop:"1px solid rgba(255,255,255,.05)",padding:
  isMobile
    ? "60px 20px 30px"
    : isTablet
    ? "70px 40px 30px"
    : "72px 80px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
<div style={{
  display:"grid",

  gridTemplateColumns:
    isMobile
      ? "1fr"
      : isTablet
      ? "1fr 1fr"
      : "repeat(auto-fit,minmax(220px,1fr))",

  gap:48,
  marginBottom:64,

  justifyItems:isMobile ? "center" : "stretch",
  textAlign:isMobile ? "center" : "left",

  ...(isTablet && {
    width:"fit-content",
    margin:"0 auto 64px",
    columnGap:120
  })
}}>
          <div>
<div style={{
  display:"flex",
  alignItems:"center",
  justifyContent:isMobile ? "center" : "flex-start",
  gap:12,
  marginBottom:18,
  width:"100%"
}}>              <div style={{position:"relative",width:60,height:30}}>
    <img
  src="/logo.png"
  alt="logo"
  style={{
    width: 100,
    height: 100,
    objectFit: "contain",
    position:"relative",
    top: -40
  }}
/>
              </div>
              <span className="clash" style={{fontSize:30,fontWeight:700,color:"white"}}>SkillExchange</span>
            </div>
            <p style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.7,maxWidth:280,
margin:isMobile ? "0 auto" : "0",fontWeight:300}}>
              Peer-to-peer skill exchange where knowledge is the only currency that matters.
            </p>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.t}>
              <h4 style={{fontSize:15,letterSpacing:4,textTransform:"uppercase",color:"#ffc832",marginBottom:20,fontWeight:700}}>{col.t}</h4>
              <ul style={{listStyle:"none"}}>
          {col.l.map(link => (
            <li key={link.label} style={{ marginBottom: 12 }}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,.22)",
                  textDecoration: "none",
                  fontWeight: 300
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:isMobile ? "center" : "space-between",
flexWrap:"wrap",
gap:16,
textAlign:isMobile ? "center" : "left",paddingTop:24,borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <p style={{fontSize:isMobile ? 12:15,color:"rgba(255,255,255,.45)",letterSpacing:2}}>© 2026 SkillExchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
