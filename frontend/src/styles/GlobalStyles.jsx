const GlobalStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Allerta+Stencil&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nova+Slim&display=swap');
    *, *::before, *::after {
    max-width:100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
  scroll-behavior: smooth;
  overflow-x: hidden;
  width: 100%;
}

    body {
    width:100%;
max-width:100vw;
overflow-x:hidden;
position:relative;
      font-family: "Allerta Stencil", sans-serif;
      background: #07080f;
      color: #fff;
      overflow-x: hidden;
      /* Custom cursor on body only — not on interactive elements */
      cursor: none;
    }

    /* Only hide cursor on non-interactive elements */
    body, div, section, canvas, p, span, h1, h2, h3, h4, h5, h6, ul, li, footer, nav, main {
      cursor: none;
    }

    /* Let buttons and links keep pointer so clicks work */
    button, a, input, textarea, select, label {
      cursor: pointer;
    }

    ::selection { background: #ffc832; color: #000; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #07080f; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#ffc832, #ff6b35); border-radius: 3px; }

    .hide-scrollbar::-webkit-scrollbar{
  display:none;
}

.hide-scrollbar{
  -ms-overflow-style:none;
  scrollbar-width:none;
}


.premium-scroll{
  overflow-y: scroll !important;
  scrollbar-width: thin;
  scrollbar-color: #ffc832 transparent;
}

/* WIDTH */
.premium-scroll::-webkit-scrollbar{
  width:8px !important;
}

/* TRACK */
.premium-scroll::-webkit-scrollbar-track{
  background:transparent !important;
}

/* THUMB */
.premium-scroll::-webkit-scrollbar-thumb{
  background:#ffc832 !important;
  border-radius:999px !important;
}

/* REMOVE WHITE BUTTONS */
.premium-scroll::-webkit-scrollbar-button{
  display:none !important;
  width:0 !important;
  height:0 !important;
}

    .clash { font-family: "Nova Slim", system-ui; }

    @keyframes modalIn  { from{opacity:0;transform:scale(.93) translateY(28px);} to{opacity:1;transform:scale(1) translateY(0);} }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(38px);}           to{opacity:1;transform:translateY(0);} }
    @keyframes marqueeF { from{transform:translateX(0);}    to{transform:translateX(-50%);} }
    @keyframes marqueeR { from{transform:translateX(-50%);} to{transform:translateX(0);} }
    @keyframes spinCW   { to{transform:rotate(360deg);}  }
    @keyframes spinCCW  { to{transform:rotate(-360deg);} }
    @keyframes float0   { 0%,100%{transform:translateY(0);}    50%{transform:translateY(-18px);} }
    @keyframes float1   { 0%,100%{transform:translateY(-6px);} 50%{transform:translateY(-22px);} }
    @keyframes float2   { 0%,100%{transform:translateY(-12px);}50%{transform:translateY(2px);}  }
    @keyframes scan     { from{top:-15%;} to{top:115%;} }
    @keyframes glowPulse{ 0%,100%{text-shadow:0 0 50px rgba(255,200,50,.3);} 50%{text-shadow:0 0 90px rgba(255,200,50,.75);} }
    @keyframes grain    { 0%,100%{transform:translate(0,0);} 20%{transform:translate(-2%,-1%);} 40%{transform:translate(1%,2%);} 60%{transform:translate(-1%,-2%);} 80%{transform:translate(2%,1%);} }
@keyframes floatY {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes demoEnter {
  0% {
    opacity:0;
    transform:scale(.82) translateY(60px);
  }

  100% {
    opacity:1;
    transform:scale(1) translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity:0; }
  to { opacity:1; }
}




@keyframes floatGlow {
  0% { transform: scale(1); opacity:.55; }
  50% { transform: scale(1.08); opacity:1; }
  100% { transform: scale(1); opacity:.55; }
}

@keyframes floatMini {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
  100% { transform: translateY(0px); }
}

@keyframes floatMini2 {
  0% { transform: translateY(0px); }
  50% { transform: translateY(12px); }
  100% { transform: translateY(0px); }
}

@keyframes floatGlow {
  0% { transform: scale(1); opacity:.5; }
  50% { transform: scale(1.08); opacity:1; }
  100% { transform: scale(1); opacity:.5; }
}
    @keyframes pingDot  { 0%{transform:scale(1);opacity:.8;} 100%{transform:scale(2.4);opacity:0;} }
    @keyframes borderRun{ 0%{background-position:0 50%} 50%{background-position:100% 50%} 100%{background-position:0 50%} }

    section{
  overflow:hidden;
}
  `}</style>
);

export default GlobalStyles;
