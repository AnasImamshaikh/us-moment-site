/* Work page: featured carousel, Instagram-style work grid, campaign archive.
   Content lives in js/work-data.js (cases) and js/brands.js (logo wall). */
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

  /* ---------- Instagram-style work grid ---------- */
  var grid=document.getElementById("wkGrid"),chips=document.getElementById("wkChips");
  var heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1z"/></svg>',
      bubble='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.5z"/></svg>',
      plane='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3.5 10 14.5M21.5 3.5l-7 18-4.5-7-7-4.5z"/></svg>';
  function card(c,i){
    var img=c.cover||c.poster;
    var m=img?'<img src="'+img+'" alt="'+esc(c.name)+' work" loading="lazy" decoding="async">':poster(c,i);
    var vid=c.video?'<video data-src="'+c.video+'" muted playsinline loop preload="none"></video><span class="ig-play" aria-hidden="true">▶</span>':'';
    var st=c.stat&&img?'<span class="ig-stat"><b>'+esc(c.stat.v)+'</b>'+esc(c.stat.l)+'</span>':'';
    return'<a class="ig-card" href="'+caseUrl(c)+'" data-f="'+c.filters.join(" ")+'">'+
      '<span class="ig-top"><span class="ig-ava">'+(c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0)))+'</span><span class="ig-who"><b>'+esc(c.name)+'</b><small>'+esc(c.category)+'</small></span><span class="ig-more" aria-hidden="true">•••</span></span>'+
      '<span class="ig-media">'+m+vid+st+'</span>'+
      '<span class="ig-foot"><span class="ig-icons">'+heart+bubble+plane+'</span><span class="ig-cta">View case ↗</span></span>'+
      '<span class="ig-cap"><b>'+esc(c.name)+'</b> '+esc(c.headline)+'</span></a>';
  }
  if(grid){
    grid.innerHTML=CASES.map(card).join("");
    var keys=["all"].concat(Object.keys(WORK_FILTERS).filter(function(k){return CASES.some(function(c){return c.filters.indexOf(k)>-1})}));
    chips.innerHTML=keys.map(function(k,i){return'<button class="wk-chip'+(i?"":" on")+'" data-k="'+k+'" aria-pressed="'+(i?"false":"true")+'">'+(k==="all"?"All":WORK_FILTERS[k])+'</button>'}).join("");
    chips.addEventListener("click",function(e){
      var b=e.target.closest(".wk-chip");if(!b)return;var k=b.dataset.k;
      [].forEach.call(chips.children,function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b)});
      [].forEach.call(grid.children,function(cd){cd.hidden=!(k==="all"||cd.dataset.f.split(" ").indexOf(k)>-1)});
      if(window.ScrollTrigger)ScrollTrigger.refresh();
    });
    // hover-to-play for cards that have a clip (mouse only)
    if(window.matchMedia("(hover:hover)").matches&&!reducedMotion){
      grid.querySelectorAll(".ig-card").forEach(function(cd){
        var v=cd.querySelector("video");if(!v)return;
        cd.addEventListener("mouseenter",function(){if(!v.src)v.src=v.dataset.src;cd.classList.add("playing");v.play().catch(function(){})});
        cd.addEventListener("mouseleave",function(){cd.classList.remove("playing");v.pause()});
      });
    }
    if(window.gsap&&window.ScrollTrigger&&!reducedMotion){
      gsap.set(grid.children,{opacity:0,y:30});
      ScrollTrigger.batch(grid.children,{start:"top 92%",onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.6,stagger:.06,ease:"power3.out",overwrite:true})}});
    }
  }

  /* ---------- campaign archive (unchanged copy; images now real files) ---------- */
  var campaigns=[
    {t:"Uber",d:"A 4-city campaign showing the real art behind Indian festivals — and the best testimonial we’ve gotten yet.",img:"assets/work/archive/uber.jpg"},
    {t:"Nykaa",d:"A Raksha Bandhan digital billboard campaign, live across the city.",img:"assets/work/archive/nykaa.jpg"},
    {t:"The Croffle Guys",d:"Festival pop-ups to 21K organic followers, multiple stores and a Shark Tank endorsement.",img:"assets/work/archive/the-croffle-guys.jpg"},
    {t:"Wamiqa Gabbi",d:"Personality-packed reels and release launches for a rising Bollywood star.",img:"assets/work/archive/wamiqa-gabbi.jpg"},
    {t:"Fresh Take by Licious",d:"An original IP built around unfiltered conversations on fitness, health and diet.",img:"assets/work/archive/fresh-take-by-licious.jpg"},
    {t:"Mood Banana",d:"A street-interview format that hit 443K organic views on its very first outing.",img:"assets/work/archive/mood-banana.jpg"},
    {t:"Walters",d:"Craveable food storytelling for a burger chain built on the power of duos.",img:"assets/work/archive/walters.jpg"},
    {t:"MUBI",d:"Launching a David Lynch original to India’s most niche cinephile creators.",img:"assets/work/archive/mubi.jpg"}
  ];
  var ct=document.getElementById("campTrack");
  if(ct)ct.innerHTML=campaigns.map(function(A,a){return'<div class="camp-card"><div class="img" style="background-image:url(\''+A.img+'\')"><div class="ring">0'+(a+1)+'</div></div><div class="body"><div class="eyebrow">Campaign</div><h3>'+A.t+'</h3><p>'+A.d+'</p></div></div>'}).join("");
})();
