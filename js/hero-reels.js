/* Home hero render 4 "Reels" (Nov 18 2026): a phone in the hero playing our top 15 reels like the Instagram Reels feed.
   Swipe / drag up or down (or the arrows beside it on desktop, or the arrow keys when it has focus). Autoplays and moves on
   to the next reel when one ends. Tap = sound on/off, double-tap = like (heart burst), press and hold = pause.
   Only 3 slides exist (previous / current / next) and they rotate, so the feed loops forever and only 3 videos load.
   Mounted by js/hero-phone.js when the demo pill is on "4 Reels": window.usmHeroReels.show(box) / .hide().
   Clips: assets/hero-reels/<id>.mp4 (576x1024, 8s, with sound, cut from _media/reels). The 5 reels with no original on
   disk fall back to assets/work-reels/<id>.mp4 (480x854, 6s, silent) until better files arrive. */
(function(){
  var IG="https://www.instagram.com/usmoment.in";
  // [reel id, brand, category, 1 = has an HD clip in assets/hero-reels]
  var REELS=[
    ["DaiQz4ATL69","CEAT Specialty","Creator collab",1],
    ["DL494kaJ1NF","The Croffle Guys","Social media",0],
    ["DZsDUa7CMFY","Walters","Social media",1],
    ["Da0ENyZKsSA","POP UPI","Social & IPs",1],
    ["DUm40gWCFPH","Bar Bank","Social & IPs",1],
    ["DaVKgn6uMlQ","Siciliana","Social media",0],
    ["Dbs0OH0NQHu","Edit","Launch & GTM",1],
    ["DbIu7BPINJp","Scalpe Pro","IP production",1],
    ["DYeDiv1Mson","Elra","Meta ads",1],
    ["DTQDNftCP7D","Bar Stock Exchange","Social & IPs",1],
    ["DZCJdNiogkB","Bar Bank","Social & IPs",0],
    ["Dc0wu0xJAsK","Comart","IP production",1],
    ["DdtiijpI_Vg","Fossae","Social media",1],
    ["DXWphGyk-aF","Launch film","Brand campaign",0],
    ["DYe0j0UNqGb","Studio session","Creator collab",0]
  ],N=REELS.length;
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,fine=window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var I={
    heart:'<svg viewBox="0 0 24 24"><path d="M12 20.6s-7.6-4.7-9.6-9.3C1.1 8.1 3 4.6 6.6 4.6c2.1 0 3.6 1.2 4.4 2.5h2c.8-1.3 2.3-2.5 4.4-2.5 3.6 0 5.5 3.5 4.2 6.7-2 4.6-9.6 9.3-9.6 9.3z"/></svg>',
    comment:'<svg viewBox="0 0 24 24"><path d="M20.7 16.6A9 9 0 1 0 17 20l3.9 1.1-.2-4.5z"/></svg>',
    send:'<svg viewBox="0 0 24 24"><path d="M21.5 3.5 10 13M21.5 3.5 14.6 21l-4.1-8.1L2.5 9z"/></svg>',
    more:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    cam:'<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
    off:'<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5"/></svg>',
    on:'<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    up:'<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
    down:'<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
  };
  var css=`
.hr{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(10px,1.2vw,18px);pointer-events:none;perspective:1400px;container-type:size}
@media (min-width:1200px){.hr{justify-content:flex-end;padding-right:clamp(1rem,3vw,3.5rem)}}
.hr[hidden]{display:none}
.hr-phone{--ph:min(100cqh,620px);position:relative;flex:none;height:var(--ph);aspect-ratio:9/19.3;border-radius:calc(var(--ph) * .075);padding:calc(var(--ph) * .016);background:#05082c;box-shadow:0 0 0 1.5px #f3f1e826,0 50px 90px -30px #000,0 0 90px -20px #3245f580;pointer-events:auto;container-type:size;transform:rotateY(var(--ty,0deg)) rotateX(var(--tx,0deg));transform-style:preserve-3d;animation:hrIn 1.1s cubic-bezier(.22,1,.36,1) both;outline:none}
.hr-phone:focus-visible{box-shadow:0 0 0 3px #d7ff3d,0 50px 90px -30px #000}
@keyframes hrIn{from{opacity:0;transform:translateY(60px) rotate(-5deg) scale(.94)}}
.hr-screen{position:relative;height:100%;border-radius:6.4cqh;overflow:hidden;background:#000;color:#fff;font:500 2.05cqh/1.35 Inter,system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;-webkit-tap-highlight-color:transparent}
.hr-screen:active{cursor:grabbing}
.hr-track{position:absolute;inset:0}
.hr-slide{position:absolute;inset:0;will-change:transform;background:#000}
.hr-slide video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.hr-slide:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#0006,transparent 16%,transparent 58%,#000a);pointer-events:none}
.hr-ui{position:absolute;inset:0;z-index:2;transition:opacity .3s}
.hr.held .hr-ui,.hr.held .hr-top,.hr.held .hr-snd{opacity:0}
.hr-side{position:absolute;right:2.2cqh;bottom:5.2cqh;display:flex;flex-direction:column;align-items:center;gap:2.6cqh}
.hr-side button{display:grid;place-items:center;width:4.4cqh;height:4.4cqh;padding:0;border:0;background:none;color:#fff;cursor:pointer;filter:drop-shadow(0 1px 3px #0008)}
.hr-side svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}
.hr-side .hr-more svg{fill:currentColor;stroke:none}
.hr-like.on svg{fill:#ff3b5c;stroke:#ff3b5c}
.hr-like.pop{animation:hrBeat .45s cubic-bezier(.34,1.56,.64,1)}
@keyframes hrBeat{40%{transform:scale(1.35)}}
.hr-disc{width:3.6cqh;height:3.6cqh;border-radius:.9cqh;border:.3cqh solid #fff;background:#131a5e;display:grid;place-items:center;color:#d7ff3d;animation:hrSpin 6s linear infinite}
.hr-disc .logo-img{height:.75cqh}
@keyframes hrSpin{to{transform:rotate(360deg)}}
.hr-meta{position:absolute;left:2.2cqh;right:9cqh;bottom:3.4cqh;text-shadow:0 1px 4px #0009}
.hr-user{display:flex;align-items:center;gap:1.2cqh;margin-bottom:1.1cqh}
.hr-av{flex:none;width:4.2cqh;height:4.2cqh;border-radius:50%;background:#131a5e;display:grid;place-items:center;color:#f3f1e8;box-shadow:0 0 0 .3cqh #d7ff3d}
.hr-av .logo-img{height:.85cqh}
.hr-user b{font-weight:600;font-size:2.1cqh}
.hr-follow{padding:.45cqh 1.4cqh;border:1px solid #ffffffcc;border-radius:1cqh;color:#fff;font-size:1.8cqh;font-weight:600;text-decoration:none;text-shadow:none;pointer-events:auto}
.hr-follow:hover{background:#fff;color:#000}
.hr-cap{margin:0 0 1cqh;font-size:1.95cqh;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hr-cap b{font-weight:600}
.hr-cap span{opacity:.85}
.hr-audio{display:flex;align-items:center;gap:.8cqh;font-size:1.75cqh;opacity:.95}
.hr-mq{overflow:hidden;white-space:nowrap;width:22cqh;-webkit-mask:linear-gradient(90deg,#000 80%,transparent);mask:linear-gradient(90deg,#000 80%,transparent)}
.hr-mq i{display:inline-block;font-style:normal;animation:hrMq 7s linear infinite}
@keyframes hrMq{to{transform:translateX(-50%)}}
.hr-top{position:absolute;z-index:3;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;padding:5cqh 2.4cqh 0;font-size:2.7cqh;font-weight:700;text-shadow:0 1px 4px #0008;pointer-events:none;transition:opacity .3s}
.hr-top svg{width:3.4cqh;height:3.4cqh;fill:none;stroke:#fff;stroke-width:1.8;stroke-linejoin:round}
.hr-island{position:absolute;z-index:4;top:1.5cqh;left:50%;width:15cqh;height:3.9cqh;margin-left:-7.5cqh;border-radius:2cqh;background:#000}
.hr-snd{position:absolute;z-index:3;top:10cqh;right:2.2cqh;display:flex;align-items:center;gap:.7cqh;padding:.7cqh 1.2cqh;border:0;border-radius:2cqh;background:#0009;color:#fff;font:600 1.7cqh Inter,system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(6px);transition:opacity .3s,padding .3s}
.hr-snd svg{width:2.4cqh;height:2.4cqh;fill:none;stroke:#fff;stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}
.hr-snd.min span{display:none}
.hr-prog{position:absolute;z-index:3;left:0;right:0;bottom:0;height:.35cqh;background:#ffffff40}
.hr-prog i{display:block;height:100%;background:#fff;transform-origin:left;transform:scaleX(0)}
.hr-flash{position:absolute;z-index:4;left:50%;top:50%;width:9cqh;height:9cqh;margin:-4.5cqh 0 0 -4.5cqh;border-radius:50%;background:#0008;display:grid;place-items:center;opacity:0;transform:scale(.6);pointer-events:none}
.hr-flash svg{width:4.6cqh;height:4.6cqh;fill:none;stroke:#fff;stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}
.hr-flash.go{animation:hrFlash .8s ease both}
@keyframes hrFlash{20%{opacity:1;transform:scale(1)}70%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.1)}}
.hr-burst{position:absolute;z-index:4;width:13cqh;height:13cqh;margin:-6.5cqh 0 0 -6.5cqh;pointer-events:none;animation:hrBurst .9s cubic-bezier(.34,1.56,.64,1) forwards}
.hr-burst svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 4px 14px #ff3b5c99)}
@keyframes hrBurst{0%{opacity:0;transform:scale(.3) rotate(var(--r,0deg))}25%{opacity:1;transform:scale(1.15) rotate(var(--r,0deg))}45%{transform:scale(.95) rotate(var(--r,0deg))}75%{opacity:1;transform:scale(1) translateY(0) rotate(var(--r,0deg))}100%{opacity:0;transform:scale(1.05) translateY(-9cqh) rotate(var(--r,0deg))}}
.hr-hint{position:absolute;z-index:4;left:50%;bottom:16cqh;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.6cqh;padding:1.2cqh 2cqh;border-radius:2.4cqh;background:#000a;backdrop-filter:blur(6px);font-size:1.8cqh;font-weight:600;opacity:0;transition:opacity .4s;pointer-events:none}
.hr-hint.on{opacity:1}
.hr-hint svg{width:3cqh;height:3cqh;fill:none;stroke:#d7ff3d;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;animation:hrBob 1.1s ease-in-out infinite}
@keyframes hrBob{50%{transform:translateY(-.9cqh)}}
.hr-nav{display:flex;flex-direction:column;gap:10px;pointer-events:auto}
.hr-nav button{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid #f3f1e833;background:#f3f1e814;color:#f3f1e8;cursor:pointer;backdrop-filter:blur(6px);transition:background .25s,color .25s,transform .35s cubic-bezier(.34,1.56,.64,1)}
.hr-nav button:hover{background:#d7ff3d;color:#131a5e;transform:scale(1.08)}
.hr-nav svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.hr-fl{position:absolute;z-index:5;font-size:2.8cqh;pointer-events:none;animation:hrFl 1.4s ease-out forwards}
@keyframes hrFl{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-22cqh) scale(1.2)}}
@media (hover:none),(max-width:1199px){.hr-nav{display:none}}
@media (prefers-reduced-motion:reduce){.hr-phone,.hr-disc,.hr-mq i,.hr-hint svg{animation:none}}`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  var root,phone,screen,slots,prog,snd,flash,hint,box,cur=0,on=false,inView=true,muted=true,liked={},hold=false,drag=null,busy=false,touched=false,lastT=0,stall=0,holdT,tapT,lastTap=0,tx=0,ty=0,mx=0,my=0;
  function src(r){return(r[3]?"assets/hero-reels/":"assets/work-reels/")+r[0]}
  function H(){return screen.clientHeight||1}
  function mkSlot(){
    var el=document.createElement("div");el.className="hr-slide";
    el.innerHTML='<video muted playsinline preload="auto"></video><div class="hr-ui"><div class="hr-side">'+
      '<button type="button" class="hr-like" aria-label="Like">'+I.heart+'</button><button type="button" class="hr-cmt" aria-label="Comments" tabindex="-1">'+I.comment+'</button>'+
      '<button type="button" class="hr-send" aria-label="Share" tabindex="-1">'+I.send+'</button><button type="button" class="hr-more" aria-label="More" tabindex="-1">'+I.more+'</button>'+
      '<span class="hr-disc" aria-hidden="true"><span class="logo-img"></span></span></div>'+
      '<div class="hr-meta"><div class="hr-user"><span class="hr-av"><span class="logo-img"></span></span><b>usmoment.in</b><a class="hr-follow" href="'+IG+'" target="_blank" rel="noopener">Follow</a></div>'+
      '<p class="hr-cap"></p><div class="hr-audio"><span aria-hidden="true">♫</span><div class="hr-mq"><i>usmoment.in · Original audio&emsp;&emsp;usmoment.in · Original audio&emsp;&emsp;</i></div></div></div></div>';
    var s={el:el,v:el.querySelector("video"),cap:el.querySelector(".hr-cap"),like:el.querySelector(".hr-like"),i:0};
    s.v.setAttribute("playsinline","");s.v.muted=true;
    s.v.addEventListener("ended",function(){if(s===slots[1]&&on&&!hold&&!drag)go(1)});
    s.like.addEventListener("click",function(e){e.stopPropagation();setLike(!liked[cur],e)});
    return s;
  }
  function fill(s,i){i=(i+N)%N;s.i=i;var r=REELS[i];s.v.poster=src(r)+".jpg";s.v.src=src(r)+".mp4";s.v.muted=true;
    s.cap.innerHTML='<b>'+r[1]+'</b> <span>· '+r[2]+'</span>';s.like.classList.toggle("on",!!liked[i])}
  function place(off,ms){var h=H();slots.forEach(function(s,k){s.el.style.transition=ms?"transform "+ms+"ms cubic-bezier(.22,1,.36,1)":"none";s.el.style.transform="translate3d(0,"+((k-1)*h+off)+"px,0)"})}
  function playCur(){
    slots.forEach(function(s,k){if(k!==1){s.v.pause();s.v.muted=true}});
    var v=slots[1].v;v.muted=muted;stall=performance.now();
    if(!(on&&inView)||hold){v.pause();return}
    var p=v.play();if(p&&p.catch)p.catch(function(){if(!muted){muted=true;v.muted=true;paintSnd();v.play().catch(function(){})}});
  }
  function go(dir){
    if(busy||!slots)return;busy=true;touched=true;hideHint();
    var inc=slots[dir>0?2:0].v;try{inc.currentTime=0}catch(e){}if(on&&inView)inc.play().catch(function(){});
    var ms=reduced?0:520;place(-dir*H(),ms);
    setTimeout(function(){
      if(dir>0){slots.push(slots.shift());cur=(cur+1)%N;fill(slots[2],cur+1)}else{slots.unshift(slots.pop());cur=(cur-1+N)%N;fill(slots[0],cur-1)}
      place(0,0);busy=false;playCur();
    },ms+20);
  }
  function setLike(v,e){liked[cur]=v;var b=slots[1].like;b.classList.toggle("on",v);if(v){b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");floaters(b)}}
  function floaters(from){if(reduced)return;var r=from.getBoundingClientRect(),q=screen.getBoundingClientRect(),E=["❤️","🔥","😍","👏","✨"];
    for(var k=0;k<5;k++)(function(k){setTimeout(function(){var f=document.createElement("span");f.className="hr-fl";f.textContent=E[(Math.random()*E.length)|0];
      f.style.left=(r.left-q.left+r.width/2-10)+"px";f.style.top=(r.top-q.top-6)+"px";f.style.setProperty("--dx",(Math.random()*-60-10)+"px");screen.appendChild(f);setTimeout(function(){f.remove()},1500)},k*110)})(k)}
  function burstAt(x,y){var q=screen.getBoundingClientRect(),b=document.createElement("span");b.className="hr-burst";b.innerHTML=I.heart;b.style.left=(x-q.left)+"px";b.style.top=(y-q.top)+"px";b.style.setProperty("--r",(Math.random()*30-15)+"deg");screen.appendChild(b);setTimeout(function(){b.remove()},950)}
  function paintSnd(){snd.innerHTML=(muted?I.off:I.on)+'<span>'+(muted?"Tap for sound":"Sound on")+'</span>';snd.setAttribute("aria-label",muted?"Turn sound on":"Turn sound off");snd.classList.toggle("min",touched)}
  function toggleSound(){muted=!muted;slots[1].v.muted=muted;if(!muted)slots[1].v.play().catch(function(){});touched=true;paintSnd();
    flash.innerHTML=muted?I.off:I.on;flash.classList.remove("go");void flash.offsetWidth;flash.classList.add("go")}
  function showHint(){if(touched||reduced)return;hint.classList.add("on");
    setTimeout(function(){if(touched||busy||drag)return;place(-H()*.13,420);setTimeout(function(){if(!drag&&!busy)place(0,520)},460)},700);
    setTimeout(hideHint,4200)}
  function hideHint(){if(hint)hint.classList.remove("on")}

  function mount(){
    root=document.createElement("div");root.className="hr";root.hidden=true;
    root.innerHTML='<div class="hr-phone" tabindex="0" role="region" aria-roledescription="reels" aria-label="Us Moment reels. Swipe or use the arrow keys."><div class="hr-screen"><div class="hr-track"></div>'+
      '<div class="hr-top"><b>Reels</b>'+I.cam+'</div><span class="hr-island"></span><button type="button" class="hr-snd"></button>'+
      '<i class="hr-prog"><i></i></i><div class="hr-flash"></div><div class="hr-hint">'+I.up+'Swipe up</div></div></div>'+
      '<div class="hr-nav"><button type="button" class="hr-up" aria-label="Previous reel">'+I.up+'</button><button type="button" class="hr-down" aria-label="Next reel">'+I.down+'</button></div>';
    box.appendChild(root);
    phone=root.querySelector(".hr-phone");screen=root.querySelector(".hr-screen");prog=root.querySelector(".hr-prog i");snd=root.querySelector(".hr-snd");flash=root.querySelector(".hr-flash");hint=root.querySelector(".hr-hint");
    var track=root.querySelector(".hr-track");slots=[mkSlot(),mkSlot(),mkSlot()];slots.forEach(function(s){track.appendChild(s.el)});
    fill(slots[0],N-1);fill(slots[1],0);fill(slots[2],1);place(0,0);paintSnd();
    root.querySelector(".hr-up").addEventListener("click",function(){go(-1)});
    root.querySelector(".hr-down").addEventListener("click",function(){go(1)});
    snd.addEventListener("click",function(e){e.stopPropagation();toggleSound()});
    phone.addEventListener("keydown",function(e){if(e.key==="ArrowDown"){e.preventDefault();go(1)}else if(e.key==="ArrowUp"){e.preventDefault();go(-1)}else if(e.key==="m"||e.key==="M")toggleSound();else if(e.key===" "){e.preventDefault();var v=slots[1].v;if(v.paused){hold=false;v.play().catch(function(){})}else{hold=true;v.pause()}}});
    /* drag / swipe, tap, double-tap, hold */
    screen.addEventListener("pointerdown",function(e){
      if(e.target.closest("a,button")||busy)return;
      drag={y:e.clientY,t:performance.now(),dy:0,moved:false,x:e.clientX};try{screen.setPointerCapture(e.pointerId)}catch(_){}
      clearTimeout(holdT);holdT=setTimeout(function(){if(drag&&!drag.moved){hold=true;slots[1].v.pause();root.classList.add("held")}},280);
    });
    screen.addEventListener("pointermove",function(e){
      if(!drag)return;drag.dy=e.clientY-drag.y;
      if(!drag.moved&&Math.abs(drag.dy)>7){drag.moved=true;clearTimeout(holdT);touched=true;hideHint()}
      if(drag.moved&&!hold)place(drag.dy,0);
    });
    function end(e){
      if(!drag)return;clearTimeout(holdT);var d=drag;drag=null;
      if(hold){hold=false;root.classList.remove("held");if(on&&inView)slots[1].v.play().catch(function(){});return}
      if(d.moved){var vel=d.dy/Math.max(1,performance.now()-d.t),h=H();
        if(d.dy<-h*.16||vel<-.45)go(1);else if(d.dy>h*.16||vel>.45)go(-1);else place(0,380);return}
      if(e.type==="pointercancel")return;
      var now=performance.now();
      if(now-lastTap<320){clearTimeout(tapT);lastTap=0;burstAt(e.clientX,e.clientY);setLike(true);touched=true;return}
      lastTap=now;var cx=e.clientX,cy=e.clientY;tapT=setTimeout(function(){toggleSound()},320);
    }
    screen.addEventListener("pointerup",end);screen.addEventListener("pointercancel",end);
    screen.addEventListener("contextmenu",function(e){e.preventDefault()});
    if("IntersectionObserver" in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(on)playCur()},{threshold:.25}).observe(box);
    addEventListener("resize",function(){if(slots&&!busy)place(0,0)});
    if(fine&&!reduced)addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
    requestAnimationFrame(loop);
  }
  function loop(now){
    requestAnimationFrame(loop);if(!on||!slots)return;
    var v=slots[1].v;if(v.duration)prog.style.transform="scaleX("+Math.min(1,v.currentTime/v.duration)+")";
    if(v.currentTime!==lastT){lastT=v.currentTime;stall=now}
    // watchdog: if a clip can't play (blocked / slow network), keep the feed moving
    if(inView&&!hold&&!drag&&!busy&&now-stall>9000){stall=now;go(1)}
    if(fine&&!reduced){tx+=(-my*6-tx)*.06;ty+=(mx*9-ty)*.06;phone.style.setProperty("--tx",tx.toFixed(2)+"deg");phone.style.setProperty("--ty",ty.toFixed(2)+"deg")}
  }
  window.usmHeroReels={
    show:function(b){box=b;if(!root)mount();root.hidden=false;on=true;place(0,0);playCur();setTimeout(showHint,1400)},
    hide:function(){on=false;if(!root)return;root.hidden=true;slots.forEach(function(s){s.v.pause()})}
  };
})();
