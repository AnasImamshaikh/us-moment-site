/* Work page: featured carousel + reel wall.
   Content lives in js/work-data.js (cases), js/reels-data.js (every reel) and js/brands.js (logo wall). */
(function(){
  var reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc=function(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
  var caseUrl=function(c){return"case.html?b="+encodeURIComponent(c.slug)};
  var tint=["t-ink","t-signal","t-gold","t-flash"];

  /* ---------- poster used when a case has no cover image yet ---------- */
  function poster(c,i){
    var mark=c.logo?'<img class="ps-logo" src="assets/clients/logos/'+c.logo+'" alt="" loading="lazy">':'<span class="ps-name">'+esc(c.name)+'</span>';
    var st=c.stat?'<span class="ps-stat"><b>'+esc(c.stat.v)+'</b>'+esc(c.stat.l)+'</span>':'';
    return'<div class="ps '+tint[i%tint.length]+'">'+mark+st+'</div>';
  }

  /* ---------- hero carousel ---------- */
  var feat=CASES.filter(function(c){return c.featured}).slice(0,5);
  var bg=document.getElementById("wkBg"),copy=document.getElementById("wkCopy"),frame=document.getElementById("wkFrame"),thumbs=document.getElementById("wkThumbs");
  var cur=-1,timer=null,DUR=7000;
  function media(c,i,autoplay){
    if(c.video)return'<video src="'+c.video+'" poster="'+(c.poster||c.cover||"")+'" muted playsinline loop preload="metadata"'+(autoplay&&!reducedMotion?" autoplay":"")+'></video>';
    if(c.cover)return'<img src="'+c.cover+'" alt="'+esc(c.name)+' work" loading="lazy">';
    return poster(c,i);
  }
  function go(i){
    if(!feat.length)return;
    i=(i+feat.length)%feat.length; if(i===cur)return; cur=i;
    var c=feat[i];
    bg.style.backgroundImage=c.cover||c.poster?'url("'+(c.cover||c.poster)+'")':"none";
    copy.innerHTML='<div class="eyebrow">'+esc(c.name)+' × Us Moment <span class="wk-dotsep">|</span> '+esc(c.category)+'</div>'+
      '<h1>'+esc(c.headline)+'</h1><p class="wk-sum">'+esc(c.summary)+'</p>'+
      (c.stat?'<div class="wk-stat"><b>'+esc(c.stat.v)+'</b><span>'+esc(c.stat.l)+'</span></div>':'')+
      '<div class="wk-ctas"><a class="btn solid" href="'+caseUrl(c)+'"><span>View case</span><span class="mag">↗</span></a><span class="wk-count">'+String(i+1).padStart(2,"0")+' / '+String(feat.length).padStart(2,"0")+'</span></div>';
    frame.innerHTML='<a class="wk-phone" href="'+caseUrl(c)+'" aria-label="'+esc(c.name)+' case study">'+media(c,i,true)+'<span class="wk-phone-bar"><span class="ig-ava">'+(c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0)))+'</span>'+esc(c.name)+'</span></a>';
    [].forEach.call(thumbs.children,function(t,k){t.classList.toggle("on",k===i);t.setAttribute("aria-selected",k===i)});
    if(window.gsap&&!reducedMotion){gsap.fromTo(copy.children,{opacity:0,y:18},{opacity:1,y:0,duration:.6,stagger:.06,ease:"power3.out"});gsap.fromTo(frame,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.6,ease:"power3.out"})}
    restart();
  }
  function restart(){
    clearTimeout(timer);
    if(reducedMotion||feat.length<2)return;
    var bar=thumbs.children[cur]&&thumbs.children[cur].querySelector("i");
    [].forEach.call(thumbs.querySelectorAll("i"),function(b){b.style.transition="none";b.style.width="0"});
    if(bar){void bar.offsetWidth;bar.style.transition="width "+DUR+"ms linear";bar.style.width="100%"}
    timer=setTimeout(function(){go(cur+1)},DUR);
  }
  if(thumbs&&feat.length){
    thumbs.innerHTML=feat.map(function(c,i){
      var img=c.cover||c.poster;
      return'<button class="wk-thumb" role="tab" aria-selected="false" aria-label="'+esc(c.name)+'">'+(img?'<span class="wk-thumb-img" style="background-image:url(\''+img+'\')"></span>':'<span class="wk-thumb-img wk-thumb-ps">'+esc(c.name)+'</span>')+'<span class="wk-thumb-name">'+esc(c.name)+'</span><i></i></button>';
    }).join("");
    [].forEach.call(thumbs.children,function(t,i){t.addEventListener("click",function(){go(i)})});
    document.getElementById("wkPrev").addEventListener("click",function(){go(cur-1)});
    document.getElementById("wkNext").addEventListener("click",function(){go(cur+1)});
    var hero=document.getElementById("wkHero");
    hero.addEventListener("mouseenter",function(){clearTimeout(timer);[].forEach.call(thumbs.querySelectorAll("i"),function(b){var w=getComputedStyle(b).width;b.style.transition="none";b.style.width=w})});
    hero.addEventListener("mouseleave",restart);
    hero.addEventListener("keydown",function(e){if(e.key==="ArrowRight")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
    go(0);
  }


  /* ---------- Selected work: reel wall (data in js/reels-data.js) ----------
     Shows 3 rows to start (5 cards per row on desktop, fewer on smaller screens).
     "More work" adds 3 rows at a time; "View all" opens everything. */
  var grid=document.getElementById("wkGrid"),chips=document.getElementById("wkChips"),more=document.getElementById("wkMore");
  if(grid&&typeof REELS!=="undefined"){
    var bySlug={};CASES.forEach(function(c,i){c._i=i;bySlug[c.slug]=c});
    // numbers we know for specific reels (case stats/results that link to a reel)
    var known={};
    CASES.forEach(function(c){
      [c.stat].concat((c.results||[]).reduce(function(a,r){return a.concat(r.s)},[])).forEach(function(s){
        if(!s||!s.link)return;var m=s.link.match(/\/(?:reel|p)\/([^/?#]+)/);if(m&&!known[m[1]])known[m[1]]={v:s.v,l:s.l};
      });
    });
    // order: one reel per brand at a time, following the CASES order, so the first rows show the biggest brands
    var pools=CASES.map(function(c){return REELS.filter(function(r){return r.brand===c.slug})});
    var ordered=[],k=0,left=true;
    while(left){left=false;pools.forEach(function(p){if(p[k]){ordered.push(p[k]);left=true}});k++}
    var play='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    function card(r,i){
      var c=bySlug[r.brand],st=known[r.code];
      var ava=c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0));
      var media=r.poster?'<img class="rc-img" src="'+r.poster+'" alt="" loading="lazy" decoding="async">':poster(c,c._i);
      var vid=r.video?'<video data-src="'+r.video+'" muted playsinline loop preload="none"></video>':'';
      var meta=st?'<span class="rc-stat"><b>'+esc(st.v)+'</b>'+esc(st.l)+'</span>':(r.likes?'<span class="rc-stat"><b>'+esc(r.likes)+'</b>likes</span>':'');
      return'<a class="rc" href="case.html?b='+encodeURIComponent(c.slug)+'" data-f="'+c.filters.join(" ")+'" aria-label="'+esc(c.name)+': '+esc(c.headline)+'">'+
        '<span class="rc-media">'+media+vid+'<span class="rc-shade"></span>'+(r.kind==="reel"?'<span class="rc-play">'+play+'</span>':'')+'</span>'+
        '<span class="rc-top"><span class="ig-ava">'+ava+'</span><span class="rc-name">'+esc(c.name)+'</span></span>'+
        '<span class="rc-foot">'+meta+'<span class="rc-cat">'+esc(c.category)+'</span><span class="rc-cta">Read the story ↗</span></span></a>';
    }
    grid.innerHTML=ordered.map(card).join("");
    var cards=[].slice.call(grid.children),filter="all",limit=0,showAll=false;
    function cols(){return getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length||1}
    function step(){return cols()*3}
    function matching(){return cards.filter(function(cd){return filter==="all"||cd.dataset.f.split(" ").indexOf(filter)>-1})}
    function render(animateFrom){
      var list=matching(),n=showAll?list.length:Math.min(limit,list.length);
      cards.forEach(function(cd){cd.hidden=true});
      list.forEach(function(cd,i){cd.hidden=i>=n});
      var fresh=list.slice(animateFrom||n,n);
      if(fresh.length&&window.gsap&&!reducedMotion){
        gsap.fromTo(fresh,{opacity:0,y:40,scale:.96},{opacity:1,y:0,scale:1,duration:.6,ease:"power3.out",stagger:{each:.035,grid:"auto",from:"start"},clearProps:"transform"});
      }
      // controls
      var rest=list.length-n;
      if(!rest&&list.length<=step()){more.innerHTML="";}
      else if(!rest){more.innerHTML='<button class="wk-btn" data-act="less"><span class="wk-ico up">↓</span>Show less</button>';}
      else{
        more.innerHTML='<button class="wk-btn solid" data-act="more"><span class="wk-ico">↓</span>More work <small>'+Math.min(rest,step())+' more</small></button>'+
          (n>step()||rest>step()?'<button class="wk-btn" data-act="all"><span class="wk-ico">⇣</span>View all <small>'+list.length+'</small></button>':'');
      }
      var cnt=document.getElementById("wkCount");if(cnt)cnt.textContent=Math.min(n,list.length)+" of "+list.length;
      if(window.ScrollTrigger)ScrollTrigger.refresh();
    }
    function reset(){limit=step();showAll=false;render(0)}
    more.addEventListener("click",function(e){
      var b=e.target.closest(".wk-btn");if(!b)return;var before=showAll?matching().length:Math.min(limit,matching().length);
      if(b.dataset.act==="more"){limit+=step();render(before)}
      else if(b.dataset.act==="all"){showAll=true;render(before)}
      else{reset();var top=document.getElementById("work");if(top)top.scrollIntoView({behavior:reducedMotion?"auto":"smooth"})}
    });
    var keys=["all"].concat(Object.keys(WORK_FILTERS).filter(function(k){return CASES.some(function(c){return c.filters.indexOf(k)>-1})}));
    chips.innerHTML=keys.map(function(k,i){return'<button class="wk-chip'+(i?"":" on")+'" data-k="'+k+'" aria-pressed="'+(i?"false":"true")+'">'+(k==="all"?"All":WORK_FILTERS[k])+'</button>'}).join("");
    chips.addEventListener("click",function(e){
      var b=e.target.closest(".wk-chip");if(!b)return;filter=b.dataset.k;
      [].forEach.call(chips.children,function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b)});
      limit=step();showAll=false;render(0);
    });
    // keep the visible amount to whole rows when the column count changes
    var lastCols=cols();window.addEventListener("resize",function(){var c=cols();if(c!==lastCols){lastCols=c;if(!showAll){limit=Math.max(c*3,Math.round(limit/c)*c)}render(limit)}});
    reset();
    // hover to play (mouse only); the clip loads only when hovered
    if(window.matchMedia("(hover:hover)").matches&&!reducedMotion){
      cards.forEach(function(cd){
        var v=cd.querySelector("video");if(!v)return;
        cd.addEventListener("mouseenter",function(){if(!v.src)v.src=v.dataset.src;cd.classList.add("playing");var p=v.play();p&&p.catch(function(){})});
        cd.addEventListener("mouseleave",function(){cd.classList.remove("playing");v.pause()});
      });
    }
  }
})();
/* "How a moment gets made" — four stages; each card cycles through a few frames of real work. */
(function(){
  var el=document.getElementById("flow");if(!el)return;
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var S=[
    {n:"01",t:"Strategy",d:"Know what to make, and why.",items:["Brand positioning & tone of voice","Content strategy","Monthly calendars","Platform & audience planning"],img:["assets/campaigns/nykaa.jpg","assets/switchboard/sw-creative-direction.jpg","assets/campaigns/edit.jpg"]},
    {n:"02",t:"Creative",d:"Ideas built for the feed.",items:["Original IPs & formats","Creative direction","Scripts & hooks","Creator collabs"],img:["assets/campaigns/mood-banana.jpg","assets/campaigns/elra.jpg","assets/switchboard/sw-creator-collabs.jpg"]},
    {n:"03",t:"Production",d:"Shot and edited under one roof.",items:["Casting & locations","Shoot days","Editing & motion","Product & food shoots"],img:["assets/switchboard/sw-video-production.jpg","assets/campaigns/terractive.jpg","assets/campaigns/croffle-guys.jpg"]},
    {n:"04",t:"Growth",d:"Posted, boosted and measured.",items:["Posting & community management","Meta ads","YouTube management","Reporting you can act on"],img:["assets/switchboard/sw-social-media.jpg","assets/switchboard/sw-youtube-mgmt.jpg","assets/campaigns/walters.jpg"]}
  ];
  el.innerHTML=S.map(function(s,i){
    return'<article class="flow-card f'+i+'" tabindex="0"><div class="flow-img">'+s.img.map(function(src,k){return'<img src="'+src+'" alt="" loading="lazy" decoding="async"'+(k?'':' class="on"')+'>'}).join("")+'</div>'+
      '<div class="flow-body"><span class="flow-n">'+s.n+'</span><h3>'+s.t+'</h3><p>'+s.d+'</p><ul>'+s.items.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div>'+
      (i<S.length-1?'<span class="flow-arrow" aria-hidden="true">→</span>':'')+'</article>';
  }).join("");
  if(reduced)return;
  // cycle the frames inside each card, offset so they don't all change at once
  [].forEach.call(el.querySelectorAll(".flow-img"),function(box,i){
    var imgs=box.querySelectorAll("img"),k=0;
    setTimeout(function(){setInterval(function(){imgs[k].classList.remove("on");k=(k+1)%imgs.length;imgs[k].classList.add("on")},3200)},i*800);
  });
  if(window.gsap&&window.ScrollTrigger)gsap.fromTo(el.children,{opacity:0,y:40},{opacity:1,y:0,duration:.7,stagger:.1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 85%"}});
})();
