import { useAuth } from "../context/AuthContext";
import { usePublicSkills } from "../hooks";
import { SectionLabel } from "../components/primitives";
import useResponsive from "../hooks/useResponsive";
import { ParticleField } from "../components/primitives";

export default function MySkillsPage() {
  const { isMobile, isTablet } = useResponsive();

  const { user } = useAuth();
  const { data: skills = [] } = usePublicSkills();

  const mySkills = (skills || []).filter(
    s => s.ownerId === user?.id
  );

  return (
   <div style={{
  minHeight:"100vh",
  background:"#07080f",
  position:"relative",
  overflow:"hidden",
  overflowX:"hidden",
  isolation:"isolate",
  padding:isMobile
    ? "110px 16px 40px"
    : isTablet
    ? "120px 32px 60px"
    : "140px 80px 80px",
    
}}>
  <ParticleField />

<div style={{
  position:"absolute",
  inset:0,
  background:"linear-gradient(to bottom, rgba(7,8,15,.72), rgba(7,8,15,.96))",
  zIndex:0
}}/>

      {/* HEADER */}
      <div style={{ marginBottom:isMobile ? 36 : 60,position:"relative",
zIndex:2 }}>

        <SectionLabel text="Activity Center" />

        <h1
          className="clash"
          style={{
            fontSize:isMobile
  ? "clamp(42px,12vw,62px)"
  : "clamp(70px,9vw,130px)",
            lineHeight:.9,
            margin:0,
            color:"white",
            fontWeight:700
          }}
        >
          My{" "}
          <span style={{
            color:"#ffc832",
            fontStyle:"italic"
          }}>
            Skills
          </span>
        </h1>

      </div>

      {/* EMPTY */}
      {mySkills.length === 0 ? (

        <div style={{
          color:"rgba(255,255,255,.35)",
          fontSize:20
        }}>
          No skills created yet.
        </div>

      ) : (

    <div style={{
      position:"relative",
zIndex:2,
display:isMobile ? "flex" : "grid",
gap:20,
gridTemplateColumns:isMobile
  ? "none"
  : "repeat(auto-fill,minmax(340px,1fr))",
overflowX:isMobile ? "auto" : "visible",
overflowY:"hidden",
scrollSnapType:isMobile ? "x mandatory" : "none",
WebkitOverflowScrolling:"touch",
paddingBottom:10,
scrollbarWidth:"none",
msOverflowStyle:"none",
}}>

          {mySkills.map((skill,index) => (

            <div
              key={skill.id}
              style={{
                position:"relative",
                flex:isMobile ? "0 0 88%" : "1",
minWidth:isMobile ? "88%" : "auto",
scrollSnapAlign:isMobile ? "center" : "none",
                padding:isMobile ? "22px" : "32px",
                borderRadius:"28px",
               background:"linear-gradient(145deg,rgba(13,15,26,.88),rgba(9,11,20,.92))",
backdropFilter:"blur(16px)",
WebkitBackdropFilter:"blur(16px)",
                border:"1px solid rgba(255,255,255,.06)",
                overflow:"hidden",
                minHeight:isMobile ? 320 : 370,
height:"auto",
transition:"all .35s ease",
              }}
            >

              {/* TOP GLOW LINE */}
              <div style={{
                position:"absolute",
                top:0,
                left:0,
                right:0,
                height:"1px",
                background:index % 2 === 0
                  ? "linear-gradient(90deg,transparent,#ffc832,transparent)"
                  : "linear-gradient(90deg,transparent,#7c3aed,transparent)"
              }}/>

              <div style={{
      display:"flex",

flexDirection:"column",
height:"100%"
              }}>

                {/* LEFT */}
                <div style={{ flex:1 }}>

                  {/* CATEGORY */}
                  <div style={{
                    display:"inline-flex",
                    alignItems:"center",
                    gap:8,
                    padding:"8px 14px",
                    borderRadius:"30px",
                    background:"rgba(255,200,50,.08)",
                    border:"1px solid rgba(255,200,50,.14)",
                    marginBottom:20
                  }}>
                    <div style={{
                      width:6,
                      height:6,
                      borderRadius:"50%",
                      background:"#ffc832"
                    }}/>

                    <span style={{
                      fontSize:12,
                      letterSpacing:3,
                      textTransform:"uppercase",
                      color:"#ffc832",
                      fontWeight:700
                    }}>
                      {skill.category}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2
                    className="clash"
                    style={{
                      fontSize:isMobile ? 30 : 42,
                      color:"white",
                      marginBottom:16,
                      lineHeight:1.1,
                      wordBreak:"break-word"
                    }}
                  >
                    {skill.title}
                  </h2>

                  {/* DESCRIPTION */}
       <div
  className="hide-scrollbar"
  style={{
    maxHeight:120,
    overflowY:"auto",
    paddingRight:0,
    scrollbarWidth:"none",
msOverflowStyle:"none",
    position:"relative",
    color:"rgba(255,255,255,.45)",
    lineHeight:1.8,
    fontSize:isMobile ? 14 : 16,
    WebkitOverflowScrolling:"touch",
    wordBreak:"break-word"
  }}
>
  {skill.description}
</div>

                  <div style={{
position:"absolute",
right:isMobile ? 12 : 22,
top:isMobile ? 110 : 140,
transform:isMobile ? "scale(.8)" : "scale(1)",
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  gap:10,
  pointerEvents:"none"
}}>

  {/* TOP ARROW */}
  <div style={{
    width:0,
    height:0,
    borderLeft:"5px solid transparent",
    borderRight:"5px solid transparent",
    borderBottom:"7px solid #ffc832"
  }}/>

  {/* BAR */}
  <div style={{
    width:8,
    height:76,
    borderRadius:999,
    background:"#ffc832",
    boxShadow:"0 0 14px rgba(255,200,50,.45)"
  }}/>

  {/* BOTTOM ARROW */}
  <div style={{
    width:0,
    height:0,
    borderLeft:"5px solid transparent",
    borderRight:"5px solid transparent",
    borderTop:"7px solid #ffc832"
  }}/>

</div>

                </div>

                {/* RIGHT */}
<div style={{
  marginTop:"auto",
display:"flex",
flexDirection:isMobile ? "column" : "row",
justifyContent:"space-between",
alignItems:isMobile ? "flex-start" : "center",
gap:isMobile ? 16 : 0,
  paddingTop:24
}}>

   <div>
  <div
    className="clash"
    style={{
      fontSize:isMobile ? 30 : 42,
      color:"#ffc832",
      lineHeight:1,
      fontWeight:700
    }}
  >
    {skill.creditsPerHour}
  </div>

  <div style={{
    fontSize:11,
    letterSpacing:3,
    textTransform:"uppercase",
    color:"rgba(255,255,255,.45)",
    marginTop:4
  }}>
    Credits/hr
  </div>
</div>

<div style={{
  padding:"10px 16px",
  borderRadius:"30px",
  background:"rgba(255,255,255,.04)",
  border:"1px solid rgba(255,255,255,.06)",
  fontSize:12,
  letterSpacing:3,
  textTransform:"uppercase",
  color:"rgba(255,255,255,.7)"
}}>
  {skill.level}
</div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}