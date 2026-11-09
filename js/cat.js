/* Mo, the Let's talk helper cat (v2: original vector cat, rigged + spring-animated, no libraries).
   Lives only inside #contact: trots to the field you're in, quips, checks the email, types along, naps when
   idle, follows the cursor with his eyes and chases it on fine pointers, backflips on send.
   Decorative: aria-hidden throughout. */
(function(){
var sec=document.getElementById("contact"),form=document.getElementById("contactForm");if(!sec||!form)return;
var calm=matchMedia("(prefers-reduced-motion: reduce)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;

/* ---------- the cat (viewBox 100x104, sits on y=97) ---------- */
var SVG='<svg viewBox="0 0 100 104" overflow="visible">'+
'<ellipse class="mo-shadow" cx="50" cy="99" rx="26" ry="3.2" fill="#131a5e" opacity=".18"/>'+
'<g class="mo-all">'+
 '<path class="mo-tail" d="M66 92 C84 92 92 78 86 62" stroke="#0e1450" stroke-width="7" stroke-linecap="round" fill="none"/>'+
 '<g class="mo-body">'+
  '<path d="M29 97 C25 76 34 57 50 57 C66 57 75 76 71 97 Z" fill="#131a5e"/>'+
  '<path d="M41 97 C39 84 44 72 50 72 C56 72 61 84 59 97 Z" fill="#f3f1e8" opacity=".92"/>'+
  '<rect x="36" y="56.5" width="28" height="5" rx="2.5" fill="#ff59c4"/>'+
  '<g class="mo-tag"><circle cx="50" cy="64.5" r="3.4" fill="#d7ff3d"/><path d="M50 62.2v4.6M48 63.3l4 2.3M52 63.3l-4 2.3" stroke="#131a5e" stroke-width=".9" stroke-linecap="round"/></g>'+
 '</g>'+
 '<g class="mo-laptop" opacity="0"><rect x="27" y="73" width="46" height="24" rx="3.5" fill="#e6e0cd" stroke="#131a5e" stroke-width="1.6"/><path d="M50 80.5v9M46.1 82.7l7.8 4.6M53.9 82.7l-7.8 4.6" stroke="#131a5e" stroke-width="1.6" stroke-linecap="round"/><rect x="22" y="96" width="56" height="3.5" rx="1.75" fill="#131a5e"/></g>'+
 '<ellipse class="mo-pl" cx="41" cy="95.5" rx="7" ry="4.4" fill="#f3f1e8" stroke="#131a5e" stroke-width="1.2"/>'+
 '<ellipse class="mo-pr" cx="59" cy="95.5" rx="7" ry="4.4" fill="#f3f1e8" stroke="#131a5e" stroke-width="1.2"/>'+
 '<g class="mo-head">'+
  '<g class="mo-el"><path d="M27 33 L29 7 L47 21 Z" fill="#131a5e" stroke="#131a5e" stroke-width="3" stroke-linejoin="round"/><path d="M31 27 L32 14 L41 21.5 Z" fill="#ff59c4"/></g>'+
  '<g class="mo-er"><path d="M73 33 L71 7 L53 21 Z" fill="#131a5e" stroke="#131a5e" stroke-width="3" stroke-linejoin="round"/><path d="M69 27 L68 14 L59 21.5 Z" fill="#ff59c4"/></g>'+
  '<ellipse cx="50" cy="38" rx="27" ry="22.5" fill="#131a5e"/>'+
  '<g class="mo-eyes">'+
   '<g class="mo-open"><ellipse cx="39.5" cy="37.5" rx="6.4" ry="7.2" fill="#d7ff3d"/><ellipse cx="60.5" cy="37.5" rx="6.4" ry="7.2" fill="#d7ff3d"/>'+
    '<g class="mo-pupils"><ellipse cx="39.5" cy="37.5" rx="2.6" ry="5" fill="#070a33"/><ellipse cx="60.5" cy="37.5" rx="2.6" ry="5" fill="#070a33"/><circle cx="41.3" cy="34.6" r="1.4" fill="#fff"/><circle cx="62.3" cy="34.6" r="1.4" fill="#fff"/></g></g>'+
   '<g class="mo-shut" opacity="0" stroke="#d7ff3d" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M33.5 38.5 Q39.5 42.5 45.5 38.5"/><path d="M54.5 38.5 Q60.5 42.5 66.5 38.5"/></g>'+
   '<g class="mo-joy" opacity="0" stroke="#d7ff3d" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M33.5 40 Q39.5 32.5 45.5 40"/><path d="M54.5 40 Q60.5 32.5 66.5 40"/></g>'+
  '</g>'+
  '<g class="mo-blush" opacity="0"><ellipse cx="33" cy="46" rx="4" ry="2.2" fill="#ff59c4" opacity=".7"/><ellipse cx="67" cy="46" rx="4" ry="2.2" fill="#ff59c4" opacity=".7"/></g>'+
  '<path d="M47.4 45 L52.6 45 L50 48.2 Z" fill="#ff59c4" stroke="#ff59c4" stroke-width="1" stroke-linejoin="round"/>'+
  '<path d="M50 48.2 Q47.6 51.4 44.6 49.8 M50 48.2 Q52.4 51.4 55.4 49.8" stroke="#f3f1e8" stroke-width="1.3" stroke-linecap="round" fill="none" opacity=".8"/>'+
  '<g stroke="#f3f1e8" stroke-width=".9" stroke-linecap="round" opacity=".45"><path d="M30 45 L18 43"/><path d="M30 48 L18 49.5"/><path d="M70 45 L82 43"/><path d="M70 48 L82 49.5"/></g>'+
 '</g>'+
'</g></svg>';

/* ---------- DOM + styles ---------- */
var st=document.createElement("style");st.textContent=
".mo{position:absolute;left:0;top:0;z-index:6;width:68px;height:71px;cursor:pointer;will-change:transform;-webkit-tap-highlight-color:transparent;touch-action:manipulation}"+
".mo svg{width:100%;height:100%;display:block;overflow:visible}"+
".mo-say{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(calc(-50% + var(--dx,0px)),8px) scale(.85);transform-origin:50% 100%;max-width:min(240px,70vw);width:max-content;background:var(--ink);color:var(--paper);font:500 .74rem/1.35 var(--f-mono);letter-spacing:.02em;padding:.62em .9em;border-radius:14px;opacity:0;pointer-events:none;transition:opacity .25s,transform .45s cubic-bezier(.2,1.5,.4,1);text-align:left;white-space:normal;box-shadow:0 10px 24px -12px #131a5e99}"+
".mo-say:after{content:'';position:absolute;top:100%;left:calc(50% - var(--dx,0px));margin-left:-6px;border:6px solid transparent;border-top-color:var(--ink)}"+
".mo-say.on{opacity:1;transform:translate(calc(-50% + var(--dx,0px)),0) scale(1)}"+
".mo-z{position:absolute;right:-2px;top:-4px;font:600 .8rem var(--f-mono);color:var(--ink);opacity:0;pointer-events:none}"+
".mo.sleeping .mo-z{animation:moz 2.6s infinite}"+
"@keyframes moz{0%{opacity:0;transform:translate(0,0) scale(.8)}30%{opacity:.85}100%{opacity:0;transform:translate(16px,-26px) scale(1.15)}}"+
".mo-heart{position:absolute;left:50%;top:6px;color:var(--gold);font-size:1.05rem;pointer-events:none;animation:moh .9s ease-out forwards}"+
"@keyframes moh{to{transform:translate(-50%,-38px) scale(1.5);opacity:0}}"+
".mo-conf{position:absolute;width:7px;height:7px;pointer-events:none;z-index:7}"+
"@media (max-width:900px){.mo{width:56px;height:58px}}";
document.head.appendChild(st);
var mo=document.createElement("div");mo.className="mo";mo.setAttribute("aria-hidden","true");mo.innerHTML=SVG;
var say=document.createElement("div");say.className="mo-say";var zz=document.createElement("span");zz.className="mo-z";zz.textContent="z z";
mo.appendChild(say);mo.appendChild(zz);sec.appendChild(mo);mo.style.opacity="0";
function q(c){return mo.querySelector(".mo-"+c)}
var P={all:q("all"),tail:q("tail"),body:q("body"),head:q("head"),el:q("el"),er:q("er"),open:q("open"),pupils:q("pupils"),shut:q("shut"),joy:q("joy"),blush:q("blush"),pl:q("pl"),pr:q("pr"),laptop:q("laptop"),shadow:q("shadow"),tag:q("tag")};
function T(el,v){el.setAttribute("transform",v)}

/* ---------- state ---------- */
var x=0,y=0,vx=0,vy=0,tx=0,ty=0,mode="hidden",arrived=false,focusEl=null,lastAct=performance.now(),sayT=0,hush=0;
var blinkAt=performance.now()+2000,blinkT=0,twitchAt=performance.now()+3000,twitchT=0,twitchSide=1,happyUntil=0,flipT=0,typePulse=0,typeSide=0,hopPhase=0,wake=0;
function size(){var r=mo.getBoundingClientRect();return{w:r.width||68,h:r.height||71}}
function rel(el){var a=el.getBoundingClientRect(),b=sec.getBoundingClientRect();return{l:a.left-b.left,t:a.top-b.top,r:a.right-b.left,b:a.bottom-b.top,w:a.width,h:a.height}}
function homeSpot(){var s=size(),btn=rel(form.querySelector(".contact-submit"));
 if(innerWidth>900){var left=rel(sec.querySelector(".contact-left")),pill=rel(sec.querySelector(".contact-pill"));return{x:left.l+Math.min(left.w-s.w,pill.w+28),y:pill.t+pill.h-s.h+4}}
 return{x:btn.r-s.w-10,y:btn.t-s.h+4}}
function perch(el){var box=el.closest(".field")||el,s=size(),r=rel(box);return{x:Math.max(4,r.r-s.w-14),y:r.t-s.h+5}}
function go(p,m){tx=p.x;ty=p.y;mode=m||"sit";if(calm){x=tx;y=ty}}
function talk(t,ms){if(performance.now()<hush)return;say.textContent=t;say.style.setProperty("--dx","0px");var b=say.getBoundingClientRect(),sb=sec.getBoundingClientRect(),pad=10,dx=0;if(b.right>sb.right-pad)dx=sb.right-pad-b.right;if(b.left+dx<sb.left+pad)dx=sb.left+pad-b.left;say.style.setProperty("--dx",dx+"px");
 say.classList.remove("on");void say.offsetWidth;say.classList.add("on");clearTimeout(sayT);sayT=setTimeout(function(){say.classList.remove("on")},ms||3400)}
function pick(a){return a[Math.random()*a.length|0]}
function poke(){lastAct=performance.now();if(mode==="sleep"){mode="sit";mo.classList.remove("sleeping");wake=performance.now();talk(pick(["!! i was NOT asleep","huh? oh. hi. typing, yes.","5 more minu- ok ok i'm up"]),2200)}}

/* ---------- copy ---------- */
var Q={
 arrive:innerWidth>900?"psst… the form's right here 👉":"psst… the form's up here 👆",
 name:["ooh, nice name. very brandable.","say it with your chest 💅","a name! we love a main character."],
 email:["your email, so the humans can reply.","no spam. pinky paw promise 🐾"],
 emailBad:["that email looks sus 🤨","hmm, missing an @ or a dot somewhere?"],
 emailOk:["*paw of approval* ✔️","looks legit. the humans will find you."],
 company:["ooh, who's the lucky brand?","we've probably already stalked their feed 👀"],
 need:{"Branding":"a glow-up? say less ✨","Creative Direction":"vision board energy. love.","Social Media":"time to own the feed 📱","Video Production":"lights, camera, croffles 🎬","Creator Collabs":"we know a guy. we know many guys.","Meta Ads":"money printer go brrr 💸","YouTube Management":"like, comment and subscribe 🔔","Content Strategy":"big brain mode activated 🧠","Something else":"ooh, a mystery. my favourite."},
 needOpen:"pick one, any one 👇",
 msg:["go on, i'm typing it all down ⌨️","spill the tea ☕"],
 long:"wow, a whole script. we love a brief.",
 click:["mrrp?","i'm on the clock. kind of.","pet me after you hit send 😼","i was employee of the month. i was the only one up for it.","my KPIs are naps per hour.","i did the strategy for this form. you're welcome."],
 invalid:"missing something 👀",
 notWired:"almost! my humans haven't plugged in the mailbox yet 🔌",
 sent:"sent! the humans will reply soon ✨",
 fail:"uh oh, the internet ate it. try again?"};

/* ---------- arrival ---------- */
function arrive(){if(arrived)return;arrived=true;var h=homeSpot();x=Math.min(sec.clientWidth-40,h.x+260);y=h.y;mo.style.opacity="1";
 if(calm){x=h.x;mode="sit";talk(Q.arrive);return}go(h,"sit");setTimeout(function(){if(!focusEl)talk(Q.arrive,4200)},500)}
if("IntersectionObserver"in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)arrive()})},{threshold:.35}).observe(sec)}else arrive();

/* ---------- form reactions ---------- */
function fname(el){return el.name||el.getAttribute("data-name")||""}
var emailTimer=0,saidLong=false;
form.addEventListener("focusin",function(e){var el=e.target;if(!el.matches("input,select,textarea,[data-name]"))return;poke();focusEl=el;var n=fname(el);
 go(perch(el),n==="message"?"type":"sit");
 if(n==="name")talk(pick(Q.name));else if(n==="email")talk(pick(Q.email));else if(n==="company")talk(pick(Q.company));else if(n==="message")talk(pick(Q.msg));else if(n==="need"&&!form.elements.need.value)talk(Q.needOpen)});
form.addEventListener("focusout",function(){setTimeout(function(){if(!form.contains(document.activeElement)){focusEl=null;if(arrived)go(homeSpot(),"sit")}},80)});
form.addEventListener("input",function(e){poke();var el=e.target;
 if(el.name==="message"){typePulse=1;typeSide^=1;if(!saidLong&&el.value.length>220){saidLong=true;talk(Q.long)}}
 if(el.name==="email"){clearTimeout(emailTimer);emailTimer=setTimeout(function(){var v=el.value.trim();if(!v)return;if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){talk(pick(Q.emailOk));cheer()}else talk(pick(Q.emailBad))},900)}});
form.addEventListener("change",function(e){if(e.target.name==="need"){var t=Q.need[e.target.value];if(t){talk(t);cheer()}}});

/* ---------- send: AJAX to Formspree, cat reacts ---------- */
var invT=0;form.addEventListener("invalid",function(e){var n=performance.now();if(n-invT<500)return;invT=n;hush=0;talk(Q.invalid,2600);hush=n+2400;go(perch(e.target),"sit")},true);
form.addEventListener("submit",function(e){e.preventDefault();poke();
 if(!form.checkValidity()){form.reportValidity();return}
 if(/YOUR_FORM_ID/.test(form.action)){talk(Q.notWired,4200);return}
 var btn=form.querySelector(".contact-submit"),old=btn.textContent;btn.disabled=true;btn.textContent="Sending…";
 fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}}).then(function(r){if(!r.ok)throw 0;form.reset();btn.textContent="Sent ✓";backflip();talk(Q.sent,4600);setTimeout(function(){btn.textContent=old;btn.disabled=false},4000)})
 .catch(function(){btn.textContent=old;btn.disabled=false;talk(Q.fail,4200)})});

/* ---------- click / tap / pet ---------- */
var ac=null;function mrrp(){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();var t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type="triangle";f.type="lowpass";f.frequency.value=1400;
 o.frequency.setValueAtTime(420,t);o.frequency.linearRampToValueAtTime(640,t+.09);o.frequency.linearRampToValueAtTime(520,t+.22);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.3);
 o.connect(f);f.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.32)}catch(e){}}
var ci=0;mo.addEventListener("click",function(){poke();mrrp();var hh=document.createElement("span");hh.className="mo-heart";hh.textContent="♥";mo.appendChild(hh);setTimeout(function(){hh.remove()},900);talk(Q.click[ci++%Q.click.length]);cheer()});
var petting=0;mo.addEventListener("mouseenter",function(){petting=1;poke()});mo.addEventListener("mouseleave",function(){petting=0});

/* ---------- little celebrations ---------- */
function cheer(){happyUntil=performance.now()+1100;if(!calm)vy-=160}
function backflip(){happyUntil=performance.now()+1500;if(calm)return;flipT=performance.now();confetti()}
function confetti(){var s=size(),cols=["#131a5e","#ff59c4","#3245f5","#f3f1e8"];for(var i=0;i<26;i++){var d=document.createElement("i");d.className="mo-conf";d.style.background=cols[i%4];d.style.left=(x+s.w/2)+"px";d.style.top=(y+s.h/3)+"px";
 d.style.borderRadius=i%3?"2px":"50%";sec.appendChild(d);var a=Math.random()*Math.PI*2,v=60+Math.random()*120;d.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:"translate("+Math.cos(a)*v+"px,"+(Math.sin(a)*v-60)+"px) rotate("+(Math.random()*540)+"deg)",opacity:0}],{duration:1100+Math.random()*500,easing:"cubic-bezier(.2,.7,.3,1)",fill:"forwards"});(function(el){setTimeout(function(){el.remove()},1700)})(d)}}

/* ---------- cursor: eyes follow it; chase inside #contact on fine pointers ---------- */
var mx=-1,my=-1,inSec=false;
addEventListener("pointermove",function(e){var b=sec.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;inSec=mx>=0&&my>=0&&mx<=b.width&&my<=b.height;if(inSec)poke()},{passive:true});

/* ---------- loop ---------- */
var last=performance.now(),k={tail:0,head:0,lean:0,sq:1,lap:0,shut:0,joy:0,headY:0,ears:0,px:0,py:0};
function ease(c,t,r,dt){return c+(t-c)*(1-Math.pow(1-r,dt*60))}
function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;var t=now/1000;
 if(arrived){var s=size();
  if(fine&&!calm&&inSec&&!focusEl&&mode!=="sleep"){var cxp=x+s.w/2,cyp=y+s.h/2,d=Math.hypot(mx-cxp,my-cyp);if(d>110){tx=Math.max(0,Math.min(sec.clientWidth-s.w,mx-s.w/2-(mx>cxp?46:-46)));ty=Math.max(0,Math.min(sec.clientHeight-s.h,my-s.h/2))}}
  /* critically damped spring toward the target: smooth starts and stops, no snapping */
  if(!calm){var K=focusEl?70:55,C=2*Math.sqrt(K);vx+=((tx-x)*K-vx*C)*dt;vy+=((ty-y)*K-vy*C)*dt;x+=vx*dt;y+=vy*dt}else{x=tx;y=ty}
  var speed=Math.hypot(vx,vy),moving=speed>25;
  if(moving)hopPhase+=dt*Math.min(16,4+speed/40);else hopPhase=0;
  if(mode==="sit"&&!focusEl&&!petting&&now-lastAct>12000&&!calm){mode="sleep";mo.classList.add("sleeping");say.classList.remove("on")}
  var sleeping=mode==="sleep",typing=(mode==="type"||(focusEl&&fname(focusEl)==="message"))&&!moving,happy=now<happyUntil;
  if(now>blinkAt){blinkT=now;blinkAt=now+2400+Math.random()*3200}var blink=now-blinkT<150?Math.sin((now-blinkT)/150*Math.PI):0;
  if(now>twitchAt){twitchT=now;twitchSide=Math.random()<.5?1:-1;twitchAt=now+2500+Math.random()*4000}var tw=now-twitchT<260?Math.sin((now-twitchT)/260*Math.PI):0;
  var lx=0,ly=0;if(typing){ly=1}else if(mx>=0&&!sleeping){var ddx=mx-(x+s.w/2),ddy=my-(y+s.h*.35),dl=Math.hypot(ddx,ddy)||1;lx=ddx/dl*Math.min(1,dl/120);ly=ddy/dl*Math.min(1,dl/120)}
  var breathe=Math.sin(t*(sleeping?1.4:2.4))*(sleeping?1.2:.7),
   hop=moving?Math.abs(Math.sin(hopPhase))*7:0,
   tailT=sleeping?38:(happy||petting?Math.sin(t*14)*16:Math.sin(t*1.7)*11)+(moving?-vx*.04:0),
   headT=sleeping?-4:(typing?Math.sin(t*3)*2:lx*9)+(petting?Math.sin(t*6)*4:0),
   leanT=moving?Math.max(-12,Math.min(12,vx*.03)):0,
   sqT=moving?1+Math.sin(hopPhase*2)*.06:(now-wake<300?1.12:1);
  k.tail=ease(k.tail,tailT,.12,dt);k.head=ease(k.head,headT,.14,dt);k.lean=ease(k.lean,leanT,.15,dt);k.sq=ease(k.sq,sqT,.25,dt);
  k.lap=ease(k.lap,typing?1:0,.15,dt);k.shut=ease(k.shut,sleeping?1:0,.12,dt);k.joy=ease(k.joy,happy||petting?1:0,.2,dt);
  k.headY=ease(k.headY,sleeping?5:(typing?2:0),.1,dt);k.ears=ease(k.ears,sleeping?18:(petting?10:0),.12,dt);
  k.px=ease(k.px,lx*2.4,.2,dt);k.py=ease(k.py,ly*2.2,.2,dt);
  if(typePulse>0)typePulse=Math.max(0,typePulse-dt*8);
  var pawUp=typing?(typePulse*7+(Math.sin(t*9)>0?1.2:0)):0;
  var spin=0,fl=0;if(flipT&&now-flipT<800){var p=(now-flipT)/800;spin=-360*(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2);fl=Math.sin(p*Math.PI)*34}else flipT=0;
  T(P.all,"translate(50 97) rotate("+(k.lean+spin)+") scale("+(2-k.sq)+" "+k.sq+") translate(-50 -97) translate(0 "+(-hop-fl)+")");
  P.shadow.setAttribute("rx",Math.max(10,26-hop*1.2-fl*.3));
  T(P.tail,"rotate("+k.tail+" 66 92)");
  T(P.body,"translate(0 "+(-breathe*.5)+")");
  T(P.head,"translate(0 "+(k.headY-breathe*.8)+") rotate("+k.head+" 50 56)");
  T(P.el,"rotate("+(-k.ears-tw*(twitchSide>0?14:0))+" 38 26)");T(P.er,"rotate("+(k.ears+tw*(twitchSide<0?14:0))+" 62 26)");
  var open=Math.max(0,1-k.shut-k.joy)*(1-blink*.92);
  T(P.open,"translate(0 "+(37.5*(1-Math.max(.06,open)))+") scale(1 "+Math.max(.06,open)+")");P.open.setAttribute("opacity",open<.07?0:1);
  T(P.pupils,"translate("+k.px+" "+k.py+")");P.shut.setAttribute("opacity",k.shut);P.joy.setAttribute("opacity",k.joy*(1-k.shut));P.blush.setAttribute("opacity",k.joy);
  P.laptop.setAttribute("opacity",k.lap);T(P.laptop,"translate(0 "+(1-k.lap)*8+")");
  var lift=k.lap*20;T(P.pl,"translate(0 "+(-lift-(typeSide?pawUp:0))+")");T(P.pr,"translate(0 "+(-lift-(typeSide?0:pawUp))+")");
  T(P.tag,"rotate("+(Math.sin(t*3)*6+k.lean*.8)+" 50 61)");
  mo.style.transform="translate3d("+x+"px,"+y+"px,0)"}
 requestAnimationFrame(tick)}
requestAnimationFrame(tick);
addEventListener("resize",function(){if(!arrived)return;var p=focusEl?perch(focusEl):homeSpot();x=tx=p.x;y=ty=p.y;vx=vy=0});
})();
