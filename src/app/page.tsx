"use client";
// Premium JRV Car Rental - matching jrvservices.co quality
import { useRef, useState, useCallback, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FRAME SCRUBBER - drives car video from scroll
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FRAMES = 61;
const frameSrc = (i:number)=>`/frames/frame_${String(i+1).padStart(4,"0")}.jpg`;
const EASE = [0.23,1,0.32,1];

function Scrubber({onP}:{onP:(n:number)=>void}) {
  const c=useRef<HTMLCanvasElement>(null);
  const imgs=useRef<HTMLImageElement[]>([]);
  const [ok,setOk]=useState(false);
  const cur=useRef(-1);

  useEffect(()=>{
    const a:HTMLImageElement[]=[];let n=0;
    for(let i=0;i<FRAMES;i++){const img=new Image();
      img.onload=img.onerror=()=>{n++;if(n===FRAMES){imgs.current=a;setOk(true)}};
      img.src=frameSrc(i);a.push(img)}
    return ()=>a.forEach(i=>{i.src=""})
  },[]);

  const draw=useCallback((fi:number)=>{
    const ca=c.current,im=imgs.current[fi];
    if(!ca||!im||!im.complete||!im.naturalWidth)return;
    const ctx=ca.getContext("2d",{willReadFrequently:true});if(!ctx)return;
    const w=window.innerWidth,h=window.innerHeight;
    ca.width=w;ca.height=h;ca.style.width=w+"px";ca.style.height=h+"px";
    const s=Math.max(w/im.naturalWidth,h/im.naturalHeight);
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(im,(w-im.naturalWidth*s)/2,h-im.naturalHeight*s,im.naturalWidth*s,im.naturalHeight*s);
  },[]);

  useEffect(()=>{
    if(!ok)return;let cl:(()=>void)|undefined,rt:any;
    const at=()=>{
      const l=(window as any).__lenis;
      if(!l){rt=setTimeout(at,0);return}
      const os=()=>{
        const p=Math.min(1,window.scrollY/window.innerHeight);
        const fi=Math.min(FRAMES-1,Math.floor(p*FRAMES));
        if(fi!==cur.current){cur.current=fi;draw(fi)}
        onP(p)
      };
      l.on("scroll",os);os();cl=()=>l.off("scroll",os)
    };
    at();return ()=>{clearTimeout(rt);if(cl)cl()}
  },[ok,draw,onP]);

  return <div className="absolute inset-0 bg-black">
    <canvas ref={c} className="block" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
    {!ok&&<div className="absolute inset-0 flex items-center justify-center bg-black"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}
  </div>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CARS = [
  {n:"Perodua Axia G1",p:"RM 110",s:"Hatchback · 5 seats"},
  {n:"Perodua Axia G2",p:"RM 120",s:"Hatchback · 5 seats"},
  {n:"Proton Exora",p:"RM 170",s:"MPV · 7 seats"},
  {n:"Proton X50",p:"RM 250",s:"SUV · 5 seats"},
  {n:"Toyota Vios",p:"RM 170",s:"Sedan · 5 seats"},
  {n:"Toyota Yaris",p:"RM 161",s:"Hatchback · 5 seats"},
  {n:"Honda City RS",p:"RM 170",s:"Sedan · 5 seats"},
  {n:"Mitsubishi Xpander",p:"RM 350",s:"MPV · 7 seats"},
  {n:"Toyota Alphard",p:"RM 700",s:"Luxury MPV · 7 seats"},
];
const FEATS = [
  {t:"Zero Deposit",d:"No security deposit needed."},
  {t:"Free Delivery",d:"Free within Seremban area."},
  {t:"Unlimited KM",d:"No mileage limits."},
  {t:"24/7 Service",d:"Round-the-clock support."},
  {t:"Latest Models",d:"2024-2026 fleet."},
  {t:"KLIA Pickup",d:"Both terminals."},
  {t:"Best Rates",d:"From RM 110/day."},
  {t:"Replacement",d:"If breakdown occurs."},
];
const FAQS = [
  {q:"What documents do I need?",a:"Valid license, IC/passport, utility bill."},
  {q:"How much deposit?",a:"Zero. Rare in the industry."},
  {q:"Is there a mileage limit?",a:"No. Unlimited on all rentals."},
  {q:"What if the car breaks down?",a:"24/7 assistance + replacement."},
];
const STATS = [
  {v:"50+",l:"Cars Available"},
  {v:"1K+",l:"Happy Clients"},
  {v:"4.9",l:"Google Rating"},
  {v:"24/7",l:"Service"},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Home() {
  const [sy,setSy]=useState(0);
  const [vp,setVp]=useState(0);
  useEffect(()=>{setVp(window.innerHeight)},[]);

  const ended=vp>0&&sy>=vp;
  const p=vp>0?Math.min(1,sy/vp):0;
  const hp=useCallback((n:number)=>setSy(n*(window.innerHeight||720)),[]);

  // Animated opacity/transform for intro elements
  const fadeIn = (start:number) => ({
    opacity: Math.min(1,Math.max(0,(p-start)*8)),
    transform: `translateY(${(1-Math.min(1,Math.max(0,(p-start)*8)))*25}px)`,
  });

  return <main>
    {/* ──────────────────────────────────────────────
         NAV
    ────────────────────────────────────────────── */}
    <nav className="fixed top-0 left-0 right-0 z-50" style={{opacity:Math.max(0,1-p*3)}}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
          <span className="text-white/50 text-[10px] tracking-widest uppercase hidden sm:block">Car Rental</span>
        </div>
        <a href="https://wa.me/60126565477" target="_blank" className="bg-white/10 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all">Book Now</a>
      </div>
    </nav>
    <div style={{height:56}}/>
    <div style={{height:"calc(100vh - 56px)"}}/>

    {/* ──────────────────────────────────────────────
         HERO - video scrubbing + animated intro
    ────────────────────────────────────────────── */}
    <div style={{
      position:ended?"relative":"fixed",top:0,left:0,right:0,height:"100vh",
      zIndex:ended?0:10,background:"#000",
    }}>
      <Scrubber onP={hp}/>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5" style={{zIndex:5}}>
        <p className="text-[#FF4500] text-xs font-bold tracking-[0.3em] uppercase mb-4" style={fadeIn(0.1)}>Sewa Lama Lagi Murah</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.88] mb-4" style={fadeIn(0.2)}>
          Rent The<br/><span className="text-[#FF4500]">Ride.</span><br/>Own The<br/><span className="text-[#FF4500]">Road.</span>
        </h1>
        <p className="text-white/40 text-sm max-w-sm" style={fadeIn(0.35)}>Premium cars · Honest prices · Free delivery Seremban</p>
        <div className="flex gap-8 mt-8" style={fadeIn(0.5)}>
          {STATS.filter((_,i)=>i<3).map(x=>(
            <div key={x.l} className="text-center">
              <p className="text-2xl font-black text-white">{x.v}</p>
              <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8" style={{zIndex:5,opacity:Math.max(0,1-p*4)}}>
        <a href="https://wa.me/60126565477" target="_blank" className="inline-block bg-[#FF4500] text-white font-bold px-6 py-3 rounded-lg text-sm hover:brightness-110 transition-all">Book on WhatsApp</a>
      </div>
    </div>

    {/* ──────────────────────────────────────────────
         CONTENT - always in flow for scroll height
    ────────────────────────────────────────────── */}
    <div style={{opacity:ended?1:0,transition:"opacity 0.5s "+EASE.join(",")}}>
      {/* MARQUEE */}
      <div className="py-2.5 border-b border-gray-200 overflow-hidden bg-white">
        <div className="marquee-track">
          {Array.from({length:6}).flatMap(()=>["SEWA LAMA LAGI MURAH","FREE DELIVERY","ZERO DEPOSIT","UNLIMITED MILEAGE"]).map((t,i)=>(
            <span key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mx-5">{t} <span className="text-[#FF4500]">✦</span></span>
          ))}
        </div>
      </div>

      {/* FLEET */}
      <section id="fleet" className="py-16 md:py-22 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-2">Choose Your Ride</h2>
            <p className="text-gray-400 text-sm">50+ cars · 12 models · From RM 110/day</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CARS.map((car,i)=>(
              <div key={car.n} style={{animation:ended?`fadeUp 0.5s ${EASE.join(",")} ${0.1+i*0.06}s both`:"none"}}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-b border-gray-100">
                    <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-bold text-black text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.s}</p>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                      <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px]">/day</span></span>
                      <a href="https://wa.me/60126565477" className="text-[#FF4500] text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-22 bg-[#FFF8F0]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-2">Why JRV?</h2>
            <p className="text-gray-400 text-sm">Local since 2020 · 50+ cars · Family-owned</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATS.map((f,i)=>(
              <div key={f.t} style={{animation:ended?`fadeUp 0.5s ${EASE.join(",")} ${0.3+i*0.06}s both`:"none"}}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/20 hover:shadow-sm transition-all h-full">
                  <h3 className="font-bold text-black text-sm">{f.t}</h3>
                  <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-22 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-black">Got Questions?</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f,i)=>(
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50 transition-colors">
                  <span>{f.q}</span>
                  <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                </summary>
                <div className="px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Ready To Hit<br/><span className="text-[#FF4500]">The Road?</span></h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-8">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="https://wa.me/60126565477" className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
            <a href="tel:+60126565477" className="text-white/50 font-semibold text-sm underline underline-offset-4 decoration-white/20">Call +60 12-656 5477</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white/40 py-10 text-center text-[11px] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5">
          <p>51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
          <div className="flex justify-center gap-5 my-4">
            <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">WhatsApp</a>
            <a href="tel:+60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Call</a>
            <a href="https://jrvservices.co" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Website</a>
          </div>
          <p>© 2026 JRV Rental Services. Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
        </div>
      </footer>
    </div>
  </main>;
}
