/* Work page: pinned-work coverflow + brand cards.
   Content lives in js/work-data.js (cases, WORK_TOP order, WORK_SOON, CASE_REELS),
   js/reels-data.js (every reel) and js/brands.js (logo wall). */
(function(){
  var reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc=function(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
  var caseUrl=function(c){return"case.html?b="+encodeURIComponent(c.slug)};
  var tint=["t-ink","t-signal","t-gold","t-flash"];
  var reelBy={};if(typeof REELS!=="undefined")REELS.forEach(function(r){reelBy[r.code]=r});
  // cover reel for a brand: first of CASE_REELS, else nothing
  function coverReel(slug){var l=(typeof CASE_REELS!=="undefined"&&CASE_REELS[slug])||[];return reelBy[l[0]]||null}
  function ava(c){return c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0))}

  /* ---------- branded poster for brands without media yet ---------- */
  function poster(c,i,soon){
    var mark=c.logo?'<img class="ps-logo" src="assets/clients/logos/'+c.logo+'" alt="" loading="lazy">':'<span class="ps-name">'+esc(c.name)+'</span>';
    return'<div class="ps '+tint[i%tint.length]+'">'+mark+(soon?'<span class="ps-soon">Case study coming soon</span>':'')+'</div>';
  }

  /* ---------- pinned work: full-screen cinematic hero (SoCheers-style) ----------
     Background = 8s widescreen clip per featured case (assets/work/hero/<slug>.mp4/.jpg).
     Copy bottom-left, "More pinned work" thumbnails bottom-right, autoplay with progress. */
  var feat=(typeof WORK_FEATURED!=="undefined"?WORK_FEATURED.map(function(s){return CASES.filter(function(c){return c.slug===s})[0]}).filter(Boolean):CASES.filter(function(c){return c.featured})).slice(0,5);
  var bg=document.getElementById("wkBg"),copy=document.getElementById("wkCopy"),thumbs=document.getElementById("wkThumbs");
  if(bg&&feat.length){
    var n=feat.length,cur=-1,timer=null,DUR=7000,hov=false;
    var H=function(c,ext){return"assets/work/hero/"+c.slug+"."+ext};
    bg.innerHTML=feat.map(function(c){return'<div class="wk-slide"><video muted playsinline loop preload="none" poster="'+H(c,"jpg")+'" data-src="'+H(c,"mp4")+'"></video></div>'}).join("");
    thumbs.innerHTML=feat.map(function(c){return'<button class="wk-thumb" role="tab" aria-selected="false" aria-label="'+esc(c.name)+'"><span class="wk-thumb-img" style="background-image:url(\''+H(c,"jpg")+'\')"></span><span class="wk-thumb-name">'+esc(c.name)+'</span><i></i></button>'}).join("");
    var slides=bg.children,tb=thumbs.children;
    function go(i){
      i=(i+n)%n;if(i===cur)return;cur=i;var c=feat[i];
      [].forEach.call(slides,function(s,k){
        var v=s.querySelector("video");s.classList.toggle("on",k===i);
        if(k===i){if(!reducedMotion){if(!v.src)v.src=v.dataset.src;v.currentTime=0;var p=v.play();p&&p.catch(function(){})}}else v.pause();
      });
      [].forEach.call(tb,function(t,k){t.classList.toggle("on",k===i);t.setAttribute("aria-selected",k===i)});
      copy.innerHTML='<div class="wk-eyebrow">'+esc(c.name)+' × Us Moment <span>|</span> '+esc(c.category)+'</div>'+
        '<h1>'+esc(c.headline)+'</h1><p class="wk-sum">'+esc(c.summary)+'</p>'+
        '<a class="btn solid wk-cta" href="'+caseUrl(c)+'"><span>View case</span><span class="mag">↗</span></a>';
      if(window.gsap&&!reducedMotion)gsap.fromTo(copy.children,{opacity:0,y:22},{opacity:1,y:0,duration:.7,stagger:.07,ease:"power3.out"});
      restart();
    }
    function restart(){
      clearTimeout(timer);[].forEach.call(thumbs.querySelectorAll("i"),function(b){b.style.transition="none";b.style.transform="scaleX(0)"});
      if(reducedMotion||hov)return;
      var b=tb[cur].querySelector("i");void b.offsetWidth;b.style.transition="transform "+DUR+"ms linear";b.style.transform="scaleX(1)";
      timer=setTimeout(function(){go(cur+1)},DUR);
    }
    [].forEach.call(tb,function(t,i){t.addEventListener("click",function(){go(i)})});
    document.getElementById("wkPrev").addEventListener("click",function(){go(cur-1)});
    document.getElementById("wkNext").addEventListener("click",function(){go(cur+1)});
    var rail=thumbs.parentNode;
    rail.addEventListener("mouseenter",function(){hov=true;restart()});
    rail.addEventListener("mouseleave",function(){hov=false;restart()});
    document.getElementById("wkHero").addEventListener("keydown",function(e){if(e.key==="ArrowRight")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
    go(0);
  }

  /* ---------- brand cards: Top 18 first, then the rest of CASES ----------
     3 rows to start; "More work" adds 3 rows; "View all" opens everything. */
  var grid=document.getElementById("wkGrid"),chips=document.getElementById("wkChips"),more=document.getElementById("wkMore");
  if(grid){
    var bySlug={};CASES.forEach(function(c){bySlug[c.slug]=c});
    var top=typeof WORK_TOP!=="undefined"?WORK_TOP:[],soon=typeof WORK_SOON!=="undefined"?WORK_SOON:{};
    var list=[];
    top.forEach(function(s){if(bySlug[s])list.push(bySlug[s]);else if(soon[s])list.push(Object.assign({slug:s,soon:true},soon[s]))});
    CASES.forEach(function(c){if(top.indexOf(c.slug)<0)list.push(c)});
    var play='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    function card(c,i){
      var r=c.soon?null:coverReel(c.slug),img=r?r.poster:(c.cover||null);
      var media=img?'<img class="rc-img" src="'+img+'" alt="" loading="lazy" decoding="async">':poster(c,i,c.soon);
      var vid=r&&r.video?'<video data-src="'+r.video+'" muted playsinline loop preload="none"></video>':'';
      var tag=c.soon?"div":"a",attrs=c.soon?' aria-label="'+esc(c.name)+': case study coming soon"':' href="'+caseUrl(c)+'" aria-label="'+esc(c.name)+' case study"';
      return'<'+tag+' class="rc'+(c.soon?' rc-soon':'')+'"'+attrs+' data-f="'+(c.filters||[]).join(" ")+'">'+
        '<span class="rc-media">'+media+vid+'<span class="rc-shade"></span>'+(vid?'<span class="rc-play">'+play+'</span>':'')+'</span>'+
        '<span class="rc-top"><span class="ig-ava">'+ava(c)+'</span><span class="rc-name">'+esc(c.name)+'</span></span>'+
        '<span class="rc-foot"><span class="rc-cat">'+esc(c.category)+'</span>'+(c.soon?'':'<span class="rc-cta">View case ↗</span>')+'</span></'+tag+'>';
    }
    grid.innerHTML=list.map(card).join("");
    var cards=[].slice.call(grid.children),filter="all",limit=0,showAll=false;
    function cols(){return getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length||1}
    function step(){return cols()*3}
    function matching(){return cards.filter(function(cd){return filter==="all"||cd.dataset.f.split(" ").indexOf(filter)>-1})}
    function render(from){
      var l=matching(),n=showAll?l.length:Math.min(limit,l.length);
      cards.forEach(function(cd){cd.hidden=true});
      l.forEach(function(cd,i){cd.hidden=i>=n});
      var fresh=l.slice(from||0,n);
      if(fresh.length&&window.gsap&&!reducedMotion)gsap.fromTo(fresh,{opacity:0,y:36},{opacity:1,y:0,duration:.6,ease:"power3.out",stagger:.04,clearProps:"transform"});
      var rest=l.length-n;
      if(!rest&&l.length<=step())more.innerHTML="";
      else if(!rest)more.innerHTML='<button class="wk-btn" data-act="less"><span class="wk-ico up">↓</span>Show less</button>';
      else more.innerHTML='<button class="wk-btn solid" data-act="more"><span class="wk-ico">↓</span>More work</button><button class="wk-btn" data-act="all"><span class="wk-ico">⇣</span>View all</button>';
      if(window.ScrollTrigger)ScrollTrigger.refresh();
    }
    function reset(){limit=step();showAll=false;render(0)}
    more.addEventListener("click",function(e){
      var b=e.target.closest(".wk-btn");if(!b)return;var before=showAll?matching().length:Math.min(limit,matching().length);
      if(b.dataset.act==="more"){limit+=step();render(before)}
      else if(b.dataset.act==="all"){showAll=true;render(before)}
      else{reset();var t=document.getElementById("work");if(t)t.scrollIntoView({behavior:reducedMotion?"auto":"smooth"})}
    });
    var keys=["all"].concat(Object.keys(WORK_FILTERS).filter(function(k){return list.some(function(c){return(c.filters||[]).indexOf(k)>-1})}));
    chips.innerHTML=keys.map(function(k,i){return'<button class="wk-chip'+(i?"":" on")+'" data-k="'+k+'" aria-pressed="'+(i?"false":"true")+'">'+(k==="all"?"All":WORK_FILTERS[k])+'</button>'}).join("");
    chips.addEventListener("click",function(e){
      var b=e.target.closest(".wk-chip");if(!b)return;filter=b.dataset.k;
      [].forEach.call(chips.children,function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b)});
      limit=step();showAll=false;render(0);
    });
    var lastCols=cols();window.addEventListener("resize",function(){var c=cols();if(c!==lastCols){lastCols=c;if(!showAll)limit=Math.max(c*3,Math.round(limit/c)*c);render(limit)}});
    reset();
    if(window.matchMedia("(hover:hover)").matches&&!reducedMotion){
      cards.forEach(function(cd){
        var v=cd.querySelector("video");if(!v)return;
        cd.addEventListener("mouseenter",function(){if(!v.src)v.src=v.dataset.src;cd.classList.add("playing");var p=v.play();p&&p.catch(function(){})});
        cd.addEventListener("mouseleave",function(){cd.classList.remove("playing");v.pause()});
      });
    }
  }
})();
