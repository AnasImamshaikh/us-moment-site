/* Services page: "WHAT WE do." switchboard (copy + order from the client's "UM website" doc, Home tab),
   then "How a moment gets made" and the two engagement modes.
   Desktop: hover a service, the panel crossfades to its photo + copy. Phones: tap to open an accordion. */
(function(){
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var U=function(id){return"https://images.unsplash.com/photo-"+id+"?auto=format&fit=crop&w=1000&h=640&q=80"};
  var S=[
    {t:"Social Media",d:"Day-to-day posting and community management, built around how people scroll, which is rarely how brands wish they did.",g:"We read the comments, all of them",img:"1759215524472-1b0686fdbd87"},
    {t:"Content Strategy",d:"The plan behind the posts. What to make, when to post it and why it’ll land, mapped to what your audience actually wants next.",g:"A calendar with a reason behind it",img:"1586936893354-362ad6ae47ba"},
    {t:"Video Production",d:"Our team runs the whole production, from casting and locations on shoot day to the final edit, and every frame is shot with the feed in mind.",g:"Shot and edited under one roof",img:"1612544409025-e1f6a56c1152"},
    {t:"Meta Ads",d:"Relatable enough to pass for organic content. Sharp enough to sell in the first five seconds.",g:"Creative that earns its budget",img:"1603145733146-ae562a55031e"},
    {t:"Creator Collabs",d:"The right creators, briefed properly, paid fairly and delivering on time. We find whoever your audience already trusts.",g:"Vetted creators, managed end to end",img:"1695408247109-3bf125ad0538"},
    {t:"YouTube Management",d:"Channels grown, revived and run end to end. Thumbnails, titles, upload strategy, the whole engine.",g:"Growth you can see in your analytics",img:"1526915303387-35900bc4ff33"},
    {t:"Creative Direction",d:"The throughline across every platform and pitch deck. One creative vision, applied consistently, so nothing feels like a rebrand mid-campaign.",g:"Consistent across every touchpoint",img:"1758691736836-0413b066787a"},
    {t:"Branding",d:"Positioning and identity, down to the tone of voice, so the brand has a full personality beyond the logo file. We build brands people recognise mid-scroll.",g:"Strategy to style guide, one team",img:"1763307411452-43cfd9f516ce"}
  ];
  var n=function(i){return String(i+1).padStart(2,"0")};
  var ICO={"Social Media":"<path d=\"M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z\"/><path d=\"M12 15.5s-3-1.8-3-4a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2.2-3 4-3 4z\"/>","Content Strategy":"<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><path d=\"M12 3.5V1.5M20.5 12h2\"/>","Video Production":"<rect x=\"3\" y=\"6.5\" width=\"13\" height=\"11\" rx=\"2\"/><path d=\"m16 10.5 5-3v9l-5-3\"/>","Meta Ads":"<path d=\"M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z\"/><path d=\"M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11\"/>","Creator Collabs":"<circle cx=\"8.5\" cy=\"8\" r=\"3\"/><circle cx=\"16.5\" cy=\"9.5\" r=\"2.5\"/><path d=\"M3 19a5.5 5.5 0 0 1 11 0M14.5 15.2A4.5 4.5 0 0 1 21 19\"/>","YouTube Management":"<rect x=\"2.5\" y=\"5.5\" width=\"19\" height=\"13\" rx=\"4\"/><path d=\"m10 9.2 5 2.8-5 2.8z\"/>","Creative Direction":"<path d=\"M12 2.5l1.8 5.2L19 9.5l-5.2 1.8L12 16.5l-1.8-5.2L5 9.5l5.2-1.8z\"/><path d=\"M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z\"/>","Branding":"<path d=\"M6 3.5h12l3 5-9 12-9-12z\"/><path d=\"M3 8.5h18M9.5 3.5 8 8.5l4 12 4-12-1.5-5\"/>"};
  var svg=function(t){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO[t]+'</svg>'};
  var list=document.getElementById("svList"),art=document.getElementById("svArt");
  if(list){
    list.innerHTML=S.map(function(s,i){
      return'<button class="sw-item'+(i?'':' active')+'" role="tab" aria-selected="'+(i?'false':'true')+'" aria-expanded="false" data-i="'+i+'">'+
        '<span class="sv-ico">'+svg(s.t)+'</span><span class="sw-name">'+s.t+'</span><span class="sw-toggle" aria-hidden="true"><i></i><i></i></span></button>'+
        '<div class="sw-acc"><div class="sw-acc-in"><img class="sv-acc-img" src="'+U(s.img)+'" alt="" loading="lazy"><p class="sw-acc-desc">'+s.d+'</p><p class="sw-acc-tag">'+s.g+'</p></div></div>';
    }).join("");
    art.innerHTML=S.map(function(s,i){return'<img src="'+U(s.img)+'" alt="'+s.t+'"'+(i?' loading="lazy"':' class="on"')+'>'}).join("");
    var items=[].slice.call(list.querySelectorAll(".sw-item")),imgs=art.children,cur=0;
    var panel=document.getElementById("svPanel"),num=document.getElementById("svNum"),name=document.getElementById("svName"),desc=document.getElementById("svDesc"),tag=document.getElementById("svTag");
    function fill(i){num.innerHTML=svg(S[i].t);name.textContent=S[i].t;desc.textContent=S[i].d;tag.textContent=S[i].g}
    fill(0);
    function show(i){
      if(i===cur)return;cur=i;
      items.forEach(function(b,k){b.classList.toggle("active",k===i);b.setAttribute("aria-selected",k===i)});
      [].forEach.call(imgs,function(im,k){im.classList.toggle("on",k===i)});
      panel.classList.add("swap");
      // a little wobble each time the card changes
      panel.style.setProperty("--tilt",(i%2?1.2:-1.2)+"deg");
      setTimeout(function(){fill(i);panel.classList.remove("swap")},160);
    }
    var mobile=window.matchMedia("(max-width:1000px)");
    items.forEach(function(b,i){
      b.addEventListener("mouseenter",function(){if(!mobile.matches)show(i)});
      b.addEventListener("focus",function(){if(!mobile.matches)show(i)});
      b.addEventListener("click",function(){
        if(!mobile.matches){show(i);return}
        var acc=b.nextElementSibling,open=!b.classList.contains("open");
        items.forEach(function(x){if(x!==b&&x.classList.contains("open")){x.classList.remove("open");x.setAttribute("aria-expanded","false");x.nextElementSibling.style.height="0px"}});
        b.classList.toggle("open",open);b.setAttribute("aria-expanded",open);
        acc.style.height=open?acc.firstChild.scrollHeight+"px":"0px";
      });
    });
    var cursor=document.getElementById("cursor");
    if(cursor)items.forEach(function(b){b.addEventListener("mouseenter",function(){cursor.classList.add("sw-hover")});b.addEventListener("mouseleave",function(){cursor.classList.remove("sw-hover")})});
    if(window.gsap&&window.ScrollTrigger&&!reduced)gsap.fromTo(items,{opacity:0,x:-30},{opacity:1,x:0,duration:.6,stagger:.05,ease:"power3.out",scrollTrigger:{trigger:list,start:"top 85%"}});
  }
})();
/* "How your page grows with us" (Nov 2026 v3, compact): one screen, no scroll-jacking. Left: the 5 steps as a list
   (active one opens with its line + chips and a progress bar). Right: a phone showing YOUR Instagram page changing at each
   step (call, approved plan, calendar, content, growth). Autoplays while in view, pauses on hover, click a step or a dot
   to jump. Phones: just the phone + step name + dots; swipe or tap left/right half. DRAFT COPY: founders to confirm. */
(function(){
  var el=document.getElementById("flow");if(!el)return;
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,mob=window.matchMedia("(max-width:900px)");
  var S=[
    {t:"Discovery call",d:"We get to know you, your page and what you want from it.",items:["A call with the founders","Your goals, audience and budget","What has and hasn't worked","A quick audit of your page"]},
    {t:"Proposal",d:"A clear plan you can say yes to.",items:["Strategy and content pillars","Scope, timelines, deliverables","Project or retainer","One clear quote"]},
    {t:"Kickoff",d:"Your brand, our team, one calendar.",items:["Brand and tone deep-dive","Access to pages and assets","Month-one content calendar","Your team meets ours"]},
    {t:"Create",d:"Ideas, scripts and shoots, made in-house.",items:["Concepts and scripts for sign-off","Shoot days and creators","Editing and motion","Review rounds with you"]},
    {t:"Launch & grow",d:"Posted, boosted, measured, then again.",items:["Posting and community","Meta ads and YouTube","A monthly report you can act on","Next month planned off the numbers"]}
  ];
  var R=["DTQDNftCP7D","DUm40gWCFPH","DaiQz4ATL69","DYeDiv1Mson","Dbs0OH0NQHu","DZsDUa7CMFY","DL494kaJ1NF","DXWphGyk-aF","DYe0j0UNqGb"];
  var cal="";for(var c=0;c<28;c++)cal+='<i style="--i:'+c+'"'+([1,3,5,8,10,12,15,17,19,22,24,26].indexOf(c)>-1?' class="on c'+(c%3)+'"':'')+'></i>';
  el.innerHTML=
   '<div class="gj-stage"><div class="gj-sticky"><div class="gj-phone" data-s="0" aria-hidden="true"><div class="gj-screen">'+
     '<div class="gj-sb"><b>9:41</b><span><i></i><i></i><i></i><em></em></span></div>'+
     '<div class="gj-top"><b>yourbrand</b><span class="gj-tick">✱</span></div>'+
     '<div class="gj-prof"><span class="gj-av"><span class="gj-avi">YB</span></span>'+
       '<ul class="gj-st"><li><b class="gj-posts">3</b>posts</li><li><b class="gj-fol">1,482</b>followers</li><li><b>210</b>following</li></ul></div>'+
     '<div class="gj-bio"><b>Your Brand</b><i></i><i class="s"></i></div>'+
     '<div class="gj-hl"><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i></div>'+
     '<div class="gj-grid">'+R.map(function(id,i){return'<span class="gj-t'+(i<3?' old':'')+'" style="--i:'+i+'"><img src="assets/work-reels/'+id+'.jpg" alt="" loading="lazy" decoding="async"></span>'}).join("")+'</div>'+
     '<div class="gj-ov gj-call"><span class="gj-cav"><span class="logo-img"></span></span><b>Us Moment</b><small>Discovery call…</small><div class="gj-cb"><i class="no">✕</i><i class="yes">✆</i></div></div>'+
     '<div class="gj-ov gj-plan"><small>Your plan</small><b>Content pillars</b><div class="gj-chips"><i>Behind the scenes</i><i>Founder stories</i><i>Trends, our way</i></div><div class="gj-row"><span>Retainer</span><em>✓</em></div><span class="gj-stamp">Approved</span></div>'+
     '<div class="gj-ov gj-cal"><small>Month one</small><b>Content calendar</b><div class="gj-days">'+cal+'</div></div>'+
     '<span class="gj-rec">REC</span><span class="gj-toast t3">Shoot day 🎬</span>'+
     '<div class="gj-ntf"><span style="--i:0">🔥 Your reel is trending</span><span style="--i:1">❤️ New followers keep coming</span><span style="--i:2">📈 Monthly report is in</span></div>'+
     '<div class="gj-ov gj-graph"><small>Followers</small><b>Up and to the right</b><svg viewBox="0 0 200 70" preserveAspectRatio="none"><path class="a" d="M0 66 C30 64 50 62 70 56 S110 44 130 30 S170 10 200 4 L200 70 L0 70Z"/><path class="l" pathLength="1" d="M0 66 C30 64 50 62 70 56 S110 44 130 30 S170 10 200 4"/></svg><em>Real campaign: 21K+ organic followers</em></div>'+
   '</div></div><b class="gj-cap" aria-live="polite"></b><div class="gj-dots" role="tablist" aria-label="Steps">'+S.map(function(s,i){return'<button type="button" role="tab" aria-label="'+s.t+'"></button>'}).join("")+'</div></div></div>'+
   '<ol class="gj-steps">'+S.map(function(s,i){return'<li class="gj-step"><button type="button" class="gj-sh"><span class="gj-k">Step '+(i+1)+'</span><h3>'+s.t+'</h3></button><div class="gj-more"><div><p>'+s.d+'</p><ul>'+s.items.map(function(x,k){return'<li style="--d:'+(k*50+120)+'ms">'+x+'</li>'}).join("")+'</ul></div></div><i class="gj-bar"></i></li>'}).join("")+'</ol>';
  var phone=el.querySelector(".gj-phone"),steps=[].slice.call(el.querySelectorAll(".gj-step")),dots=[].slice.call(el.querySelectorAll(".gj-dots button")),
      fol=el.querySelector(".gj-fol"),posts=el.querySelector(".gj-posts"),cur=-1,val={f:1482,p:3},raf=0;
  function fmt(n){return Math.round(n).toLocaleString("en-US")}
  function count(tf,tp){
    cancelAnimationFrame(raf);var f0=val.f,p0=val.p,t0=performance.now(),D=reduced?1:1600;
    (function step(t){var k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);val.f=f0+(tf-f0)*e;val.p=p0+(tp-p0)*e;fol.textContent=fmt(val.f);posts.textContent=fmt(val.p);if(k<1)raf=requestAnimationFrame(step)})(t0);
  }
  function set(i){
    if(i===cur)return;cur=i;phone.setAttribute("data-s",i);
    steps.forEach(function(s,k){s.classList.toggle("on",k===i);s.classList.toggle("done",k<i)});
    dots.forEach(function(d,k){d.classList.toggle("on",k===i);d.classList.toggle("done",k<i);d.setAttribute("aria-selected",k===i)});
    count(i>=4?22482:1482,i>=3?12:3);
  }
  var cap=el.querySelector(".gj-cap"),DUR=[4200,4200,4200,4600,6500],t=0,last=0,live=false,hold=false;
  var _set=set;set=function(i){_set(i);cap.textContent=S[i].t;t=0;paint()};
  function paint(){if(steps[cur])steps[cur].style.setProperty("--prog",Math.min(1,t/DUR[cur]))}
  function go(i){set((i+S.length)%S.length)}
  function loop(now){var dt=last?now-last:0;last=now;if(live&&!hold&&!reduced){t+=dt;if(t>=DUR[cur])go(cur+1);else paint()}requestAnimationFrame(loop)}
  steps.forEach(function(s,i){s.querySelector(".gj-sh").addEventListener("click",function(){go(i)})});
  dots.forEach(function(d,i){d.addEventListener("click",function(){go(i)})});
  el.addEventListener("mouseenter",function(){if(!mob.matches)hold=true});el.addEventListener("mouseleave",function(){hold=false});
  el.addEventListener("focusin",function(){hold=true});el.addEventListener("focusout",function(){hold=false});
  /* phones: tap left/right half of the phone, or swipe */
  var sx=0,sy=0,sw=false;
  phone.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;sw=false},{passive:true});
  phone.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){sw=true;go(cur+(dx<0?1:-1))}});
  phone.addEventListener("click",function(e){if(sw)return;var r=phone.getBoundingClientRect();go(cur+(e.clientX-r.left<r.width*.35?-1:1))});
  set(0);requestAnimationFrame(loop);
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){es.forEach(function(e){live=e.isIntersecting})},{threshold:.45}).observe(el);else live=true;
  if(window.gsap&&window.ScrollTrigger&&!reduced)gsap.fromTo(phone,{y:50,opacity:0,rotate:-3},{y:0,opacity:1,rotate:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 80%"}});
})();
