/* Case study page: case.html?b=<slug> — renders one entry from CASES (js/work-data.js). */
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

  var img=c.cover||c.poster;
  var media=c.video?'<video src="'+c.video+'" poster="'+(c.poster||c.cover||"")+'" muted playsinline loop preload="metadata"'+(reducedMotion?' controls':' autoplay')+'></video>'
    :img?'<img src="'+img+'" alt="'+esc(c.name)+' work">':'';
  // no reel/cover yet: show the brand mark in place of the phone frame
  var mark=c.logo?'<img class="cs-mark-logo" src="assets/clients/logos/'+c.logo+'" alt="'+esc(c.name)+'">':'<span class="cs-mark-name">'+esc(c.name)+'</span>';
  var ava=c.logo?'<img src="assets/clients/logos/'+c.logo+'" alt="">':esc(c.name.charAt(0));

  function statBox(s){
    var inner='<span class="cs-box-l">'+esc(s.l)+'</span><b class="cs-box-v">'+esc(s.v)+'</b>';
    return s.link?'<a class="cs-box is-link" href="'+s.link+'"'+ext+'>'+inner+'<span class="cs-box-go">Watch on Instagram ↗</span></a>':'<div class="cs-box">'+inner+'</div>';
  }
  var results="";
  if(c.results.length||c.links.length){
    results='<section class="cs-sec cs-results"><div class="cs-col"><div class="eyebrow">The outcome</div><h2>Results by platform</h2>'+
      c.results.map(function(r){var n=r.s.length,cols=Math.min(n,3),rem=n%cols;return'<h3 class="cs-plat">'+esc(r.p)+'</h3><div class="cs-boxes n'+cols+(rem?" r"+rem:"")+'">'+r.s.map(statBox).join("")+'</div>'}).join("")+
      (c.links.length?'<h3 class="cs-plat">See it on the feed</h3><div class="cs-links">'+c.links.map(function(u,i){return'<a class="cs-link" href="'+u+'"'+ext+'><span class="cs-link-n">'+String(i+1).padStart(2,"0")+'</span>'+(u.indexOf("/p/")>-1?"Post":"Reel")+' ↗</a>'}).join("")+'</div>':'')+
      '</div></section>';
  }

  root.innerHTML=
    '<header class="cs-head"><div class="cs-head-in">'+
      '<div class="cs-crumbs"><a href="work.html#work">← All work</a></div>'+
      '<div class="eyebrow">'+esc(c.category)+' <span class="cs-dot">·</span> Case study <span class="cs-dot">·</span> '+esc(c.timeline)+'</div>'+
      '<h1>'+esc(c.headline)+'</h1><p class="cs-intro">'+esc(c.summary)+'</p>'+
    '</div></header>'+
    '<div class="cs-band"><div class="cs-band-bg"'+(img?' style="background-image:url(\''+img+'\')"':'')+'></div>'+
      '<div class="cs-band-in">'+(media?'<div class="cs-phone"><span class="wk-phone-bar"><span class="ig-ava">'+ava+'</span>'+esc(c.name)+'</span>'+media+'</div>':'<div class="cs-mark">'+mark+'</div>')+
      (c.stat?'<div class="cs-band-stat"><b>'+esc(c.stat.v)+'</b><span>'+esc(c.stat.l)+'</span>'+(c.stat.link?'<a href="'+c.stat.link+'"'+ext+' class="btn">Watch the reel ↗</a>':'')+'</div>':'')+
    '</div></div>'+
    '<div class="cs-body">'+
      '<section class="cs-sec cs-meta"><dl class="cs-facts"><div><dt>Client</dt><dd>'+esc(c.name)+'</dd></div>'+(c.timeline!==c.status?'<div><dt>Timeline</dt><dd>'+esc(c.timeline)+'</dd></div>':'')+'<div><dt>Service</dt><dd>'+esc(c.service)+'</dd></div><div><dt>Status</dt><dd>'+esc(c.status)+'</dd></div></dl></section>'+
      '<section class="cs-sec"><div class="cs-col"><h2>The challenge</h2><p>'+esc(c.ask)+'</p></div></section>'+
      '<section class="cs-sec"><div class="cs-col"><h2>The solution</h2><p>'+esc(c.made)+'</p></div></section>'+
      '<section class="cs-sec"><div class="cs-col"><h2>What happened</h2><p>'+esc(c.happened)+'</p></div></section>'+
      results+
      '<a class="cs-next" href="case.html?b='+encodeURIComponent(next.slug)+'"><span class="cs-next-l">Next case</span><span class="cs-next-n">'+esc(next.name)+' <span aria-hidden="true">→</span></span><span class="cs-next-h">'+esc(next.headline)+'</span></a>'+
    '</div>';

  if(window.gsap&&!reducedMotion){
    gsap.fromTo(".cs-head-in>*",{opacity:0,y:24},{opacity:1,y:0,duration:.8,stagger:.08,ease:"power3.out",delay:.1});
    gsap.fromTo(".cs-phone",{opacity:0,y:40},{opacity:1,y:0,duration:.9,ease:"power3.out",delay:.3});
    if(window.ScrollTrigger)gsap.utils.toArray(".cs-sec,.cs-box,.cs-next").forEach(function(el){
      gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 92%"}});
    });
  }
})();
