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

  /* ---------- pinned work: coverflow (5 featured cases) ---------- */
  var feat=CASES.filter(function(c){return c.featured}).slice(0,5);
  var cf=document.getElementById("wkCf"),track=document.getElementById("wkCfTrack");
  if(cf&&feat.length>1){
    var n=feat.length,cur=0,timer=null,userPaused=reducedMotion,hovering=false,DELAY=5000;
    track.innerHTML=feat.map(function(c,i){
      var r=coverReel(c.slug),img=r?r.poster:(c.cover||c.poster);
      var vid=r&&r.video?'<video data-src="'+r.video+'" muted playsinline loop preload="none"></video>':'';
      return'<div class="cf-slide" data-i="'+i+'" role="group" aria-roledescription="slide" aria-label="'+(i+1)+' of '+n+': '+esc(c.name)+'">'+
        (img?'<img src="'+img+'" alt="" decoding="async"'+(i>1?' loading="lazy"':'')+'>':poster(c,i))+vid+
        '<span class="cf-top"><span class="ig-ava">'+ava(c)+'</span>'+esc(c.name)+'</span>'+
        '<span class="cf-cap"><small>'+esc(c.category)+'</small><b>'+esc(c.headline)+'</b><span class="cf-go">View case ↗</span></span></div>';
    }).join("");
    var slides=[].slice.call(track.children),dots=document.getElementById("wkDots"),pause=document.getElementById("wkPause"),info=document.getElementById("wkInfo");
    dots.innerHTML=feat.map(function(c,i){return'<button data-go="'+i+'" aria-label="Show '+esc(c.name)+'"></button>'}).join("");
    var X=[0,42,66,84],S=[1,.82,.66,.5],B=[1,.6,.45,.4];
    function layout(){
      slides.forEach(function(el,i){
        var o=i-cur;if(o>n/2)o-=n;if(o<-n/2)o+=n;
        var a=Math.min(Math.abs(o),3),dir=o<0?-1:1;
        el.style.transform="translateX("+(dir*X[a])+"%) scale("+S[a]+")";
        el.style.zIndex=String(10-a);el.style.opacity=a>2?"0":"1";
        el.style.filter=a?"brightness("+B[a]+") saturate(.8)":"none";
        el.style.pointerEvents=a>2?"none":"";
        el.classList.toggle("on",a===0);el.setAttribute("aria-hidden",a===0?"false":"true");
        var v=el.querySelector("video");
        if(v){if(a===0&&!reducedMotion){if(!v.src)v.src=v.dataset.src;var p=v.play();p&&p.catch(function(){});el.classList.add("playing")}else{v.pause();el.classList.remove("playing")}}
      });
      [].forEach.call(dots.children,function(d,i){d.setAttribute("aria-current",String(i===cur))});
      var c=feat[cur];
      info.innerHTML='<span class="wk-cf-n">'+String(cur+1).padStart(2,"0")+' / '+String(n).padStart(2,"0")+'</span><a class="btn solid" href="'+caseUrl(c)+'"><span>View '+esc(c.name)+'</span><span class="mag">↗</span></a>';
    }
    function go(i){cur=(i+n)%n;layout();restart()}
    function stop(){clearInterval(timer);timer=null}
    function restart(){stop();if(userPaused||hovering||document.hidden)return;timer=setInterval(function(){cur=(cur+1)%n;layout()},DELAY)}
    document.getElementById("wkPrev").addEventListener("click",function(){go(cur-1)});
    document.getElementById("wkNext").addEventListener("click",function(){go(cur+1)});
    dots.addEventListener("click",function(e){var b=e.target.closest("[data-go]");if(b)go(+b.dataset.go)});
    pause.addEventListener("click",function(){userPaused=!userPaused;pause.setAttribute("aria-pressed",String(userPaused));pause.setAttribute("aria-label",userPaused?"Play slideshow":"Pause slideshow");restart()});
    cf.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){e.preventDefault();go(cur-1)}if(e.key==="ArrowRight"){e.preventDefault();go(cur+1)}if(e.key==="Enter"&&e.target===cf)location.href=caseUrl(feat[cur])});
    cf.addEventListener("mouseenter",function(){hovering=true;stop()});
    cf.addEventListener("mouseleave",function(){hovering=false;restart()});
    document.addEventListener("visibilitychange",restart);
    // swipe; tapping a side card brings it forward, tapping the front card opens the case
    var x0=null,moved=false;
    cf.addEventListener("pointerdown",function(e){if(e.target.closest("button"))return;x0=e.clientX;moved=false});
    cf.addEventListener("pointermove",function(e){if(x0!==null&&Math.abs(e.clientX-x0)>8)moved=true});
    cf.addEventListener("dragstart",function(e){e.preventDefault()});
    cf.addEventListener("pointercancel",function(){x0=null});
    cf.addEventListener("pointerup",function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1))});
    track.addEventListener("click",function(e){if(moved)return;var sl=e.target.closest(".cf-slide");if(!sl)return;var i=+sl.dataset.i;if(i!==cur)go(i);else location.href=caseUrl(feat[cur])});
    if(reducedMotion){pause.setAttribute("aria-pressed","true");pause.setAttribute("aria-label","Play slideshow")}
    layout();restart();
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
