/* Case study page: case.html?b=<slug> — renders one entry from CASES (js/work-data.js).
   Layout: details on the left, the work (max 3 reels from CASE_REELS) on the right. */
(function(){
  var root=document.getElementById("cs");
  var slug=new URLSearchParams(location.search).get("b");
  var idx=-1;CASES.forEach(function(c,i){if(c.slug===slug)idx=i});
  if(idx<0){location.replace("work.html#work");return}
  var c=CASES[idx],next=CASES[(idx+1)%CASES.length];
  var reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc=function(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
  var ext=' target="_blank" rel="noopener"';

  document.title=c.name+" case study — Us Moment";
  var md=document.getElementById("metaDesc");if(md)md.setAttribute("content",c.headline+" "+c.summary);

  var ava=c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0));

  /* the work: up to 3 reels */
  var reelBy={};if(typeof REELS!=="undefined")REELS.forEach(function(r){reelBy[r.code]=r});
  var reels=((typeof CASE_REELS!=="undefined"&&CASE_REELS[c.slug])||[]).map(function(k){return reelBy[k]}).filter(Boolean).slice(0,3);
  var play='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  var work;
  if(reels.length){
    var mid=Math.floor((reels.length-1)/2);
    work='<div class="cs-reels n'+reels.length+'">'+reels.map(function(r,i){
      return'<figure class="cs-reel s'+i+(i===mid?' big':'')+'"><div class="cs-reel-media"><img src="'+r.poster+'" alt="'+esc(c.name)+' '+(r.kind==="reel"?"reel":"post")+'" loading="lazy" decoding="async">'+
        (r.video?'<video data-src="'+r.video+'" muted playsinline loop preload="none"></video><span class="cs-reel-play">'+play+'</span>':'')+
        '<span class="cs-reel-top"><span class="ig-ava">'+ava+'</span>'+esc(c.name)+'</span>'+
        '<a class="cs-reel-ig" href="'+r.url+'"'+ext+'>Watch on Instagram ↗</a></div></figure>';
    }).join("")+'</div>';
  }else{
    var img=c.cover||c.poster;
    work=img?'<div class="cs-reels n1"><figure class="cs-reel"><div class="cs-reel-media"><img src="'+img+'" alt="'+esc(c.name)+' work"><span class="cs-reel-top"><span class="ig-ava">'+ava+'</span>'+esc(c.name)+'</span></div></figure></div>'
      :'<div class="cs-mark">'+(c.logo?'<img class="cs-mark-logo" src="assets/clients/logos/'+c.logo+'" alt="'+esc(c.name)+'">':'<span class="cs-mark-name">'+esc(c.name)+'</span>')+'</div>';
  }
  var moreLinks=(c.links||[]).filter(function(u){return!reels.some(function(r){return u.indexOf(r.code)>-1})});

  /* results: every number lives here (no separate headline-number box) */
  function box(s){
    var inner='<span class="cs-box-v">'+esc(s.v)+'</span><span class="cs-box-l">'+esc(s.l)+'</span>';
    return s.link?'<a class="cs-box is-link" href="'+s.link+'"'+ext+'>'+inner+'<span class="cs-box-go">Watch ↗</span></a>':'<div class="cs-box">'+inner+'</div>';
  }
  var results=(c.results||[]).filter(function(r){return r.s&&r.s.length});
  // a headline number that isn't already in the results is added to them, so nothing is lost
  var num=function(v){var m=String(v).replace(/,/g,"").match(/([\d.]+)\s*([KkMm]?)/);return m?parseFloat(m[1])*({k:1e3,m:1e6}[m[2].toLowerCase()]||1):NaN};
  var same=function(a,b){var x=num(a),y=num(b);return String(a)===String(b)||(x&&y&&Math.abs(x-y)/Math.max(x,y)<.02)};
  if(c.stat&&!results.some(function(r){return r.s.some(function(x){return same(x.v,c.stat.v)})})){if(results.length)results[0]={p:results[0].p,s:[c.stat].concat(results[0].s)};else results=[{p:"Highlights",s:[c.stat]}]}
  var resHTML=results.length?'<section class="cs-sec cs-results"><h2>Results by platform</h2>'+results.map(function(r){return'<h3 class="cs-plat">'+esc(r.p)+'</h3><div class="cs-boxes">'+r.s.map(box).join("")+'</div>'}).join("")+'</section>':'';
  var linksHTML=moreLinks.length?'<section class="cs-sec"><h3 class="cs-plat">More on the feed</h3><div class="cs-links">'+moreLinks.map(function(u,i){return'<a class="cs-link" href="'+u+'"'+ext+'><span class="cs-link-n">'+String(i+1).padStart(2,"0")+'</span>'+(u.indexOf("/p/")>-1?"Post":"Reel")+' ↗</a>'}).join("")+'</div></section>':'';

  root.innerHTML=
    '<header class="cs-head"><div class="cs-head-in">'+
      '<div class="cs-crumbs"><a href="work.html#work">← All work</a></div>'+
      '<div class="cs-brand"><span class="ig-ava">'+ava+'</span><div><b>'+esc(c.name)+'</b><span>'+esc(c.category)+'</span></div></div>'+
      '<h1>'+esc(c.headline)+'</h1>'+
    '</div></header>'+
    '<div class="cs-body"><div class="cs-grid">'+
      '<div class="cs-main">'+
        '<p class="cs-intro">'+esc(c.summary)+'</p>'+
        '<dl class="cs-facts"><div><dt>Service</dt><dd>'+esc(c.service)+'</dd></div>'+(c.timeline!==c.status?'<div><dt>Timeline</dt><dd>'+esc(c.timeline)+'</dd></div>':'')+'<div><dt>Status</dt><dd>'+esc(c.status)+'</dd></div></dl>'+
        '<section class="cs-sec"><h2>The challenge</h2><p>'+esc(c.ask)+'</p></section>'+
        '<section class="cs-sec"><h2>The solution</h2><p>'+esc(c.made)+'</p></section>'+
        '<section class="cs-sec"><h2>What happened</h2><p>'+esc(c.happened)+'</p></section>'+
        resHTML+linksHTML+
      '</div>'+
      '<aside class="cs-work" aria-label="The work"><div class="cs-work-in"><div class="eyebrow">The work</div>'+work+'</div></aside>'+
    '</div>'+
    '<a class="cs-next" href="case.html?b='+encodeURIComponent(next.slug)+'"><span class="cs-next-l">Next case</span><span class="cs-next-n">'+esc(next.name)+' <span aria-hidden="true">→</span></span><span class="cs-next-h">'+esc(next.headline)+'</span></a>'+
    '</div>';

  /* desktop: lift the work column into the header, keeping it clear of the menu bar */
  var head=root.querySelector(".cs-head"),workCol=root.querySelector(".cs-work");
  function lift(){
    if(!head||!workCol)return;
    if(window.innerWidth<=900){workCol.style.removeProperty("--cs-lift");return}
    var hh=head.offsetHeight,room=hh-150;
    workCol.style.setProperty("--cs-lift",(-Math.max(0,Math.min(room,300)))+"px");
  }
  lift();window.addEventListener("resize",lift);if(document.fonts)document.fonts.ready.then(lift);

  /* reels: play on hover (mouse) or tap (touch); only one plays at a time */
  var figs=[].slice.call(root.querySelectorAll(".cs-reel"));
  function stopAll(except){figs.forEach(function(f){if(f!==except){var v=f.querySelector("video");if(v){v.pause();f.classList.remove("playing")}}})}
  function start(f){var v=f.querySelector("video");if(!v)return;stopAll(f);if(!v.src)v.src=v.dataset.src;f.classList.add("playing");var p=v.play();p&&p.catch(function(){})}
  var hover=window.matchMedia("(hover:hover)").matches;
  var stage=root.querySelector(".cs-reels"),midFig=root.querySelector(".cs-reel.big");
  function grow(f){figs.forEach(function(x){x.classList.toggle("big",x===f)})}
  if(stage&&midFig&&hover)stage.addEventListener("mouseleave",function(){grow(midFig);stopAll()});
  figs.forEach(function(f){
    var m=f.querySelector(".cs-reel-media");
    if(hover){m.addEventListener("mouseenter",function(){grow(f);if(!reducedMotion)start(f)})}
    m.addEventListener("click",function(e){if(e.target.closest(".cs-reel-ig"))return;if(!f.classList.contains("big")){grow(f);start(f);return}if(f.classList.contains("playing"))stopAll();else start(f)});
  });

  if(window.gsap&&!reducedMotion){
    gsap.fromTo(".cs-head-in>*",{opacity:0,y:24},{opacity:1,y:0,duration:.8,stagger:.08,ease:"power3.out",delay:.1});
    gsap.fromTo(".cs-reels,.cs-mark",{opacity:0,y:30},{opacity:1,y:0,duration:.8,stagger:.08,ease:"power3.out",delay:.25});
    if(window.ScrollTrigger)gsap.utils.toArray(".cs-sec,.cs-next").forEach(function(el){
      gsap.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 92%"}});
    });
  }
})();
