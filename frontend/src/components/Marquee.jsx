import { TICKER } from "../data/constants";

const ITEMS = [...TICKER, ...TICKER, ...TICKER];

export default function Marquee() {
  return (
    <div style={{background:"#050611",borderTop:"1px solid rgba(255,200,50,.08)",borderBottom:"1px solid rgba(255,200,50,.08)",padding:"14px 0",overflow:"hidden"}}>
      <div style={{display:"flex",whiteSpace:"nowrap",animation:"marqueeF 38s linear infinite"}}>
        {ITEMS.map((item, i) => (
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:16,padding:"0 20px"}}>
            <span style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",fontWeight:700,color:i%3===0?"#ffc832":"rgba(255,255,255,.14)"}}>{item}</span>
            <span style={{color:"rgba(255,200,50,.2)",fontSize:10}}>◆</span>
          </span>
        ))}
      </div>
      <div style={{display:"flex",whiteSpace:"nowrap",animation:"marqueeR 42s linear infinite",marginTop:8}}>
        {ITEMS.map((item, i) => (
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:16,padding:"0 20px"}}>
            <span style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:i%4===0?"rgba(255,107,53,.55)":"rgba(255,255,255,.08)"}}>{item}</span>
            <span style={{color:"rgba(255,107,53,.15)",fontSize:9}}>◇</span>
          </span>
        ))}
      </div>
    </div>
  );
}
