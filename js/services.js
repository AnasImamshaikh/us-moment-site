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
  var list=document.getElementById("svList"),art=document.getElementById("svArt");
  if(list){
    list.innerHTML=S.map(function(s,i){
      return'<button class="sw-item'+(i?'':' active')+'" role="tab" aria-selected="'+(i?'false':'true')+'" aria-expanded="false" data-i="'+i+'">'+
        '<span class="sw-idx">'+n(i)+'</span><span class="sw-tag">['+n(i)+']</span><span class="sw-name">'+s.t+'</span><span class="sv-arrow" aria-hidden="true">→</span><span class="sw-toggle" aria-hidden="true"><i></i><i></i></span></button>'+
        '<div class="sw-acc"><div class="sw-acc-in"><img class="sv-acc-img" src="'+U(s.img)+'" alt="" loading="lazy"><p class="sw-acc-desc">'+s.d+'</p><p class="sw-acc-tag">'+s.g+'</p></div></div>';
    }).join("");
    art.innerHTML=S.map(function(s,i){return'<img src="'+U(s.img)+'" alt="'+s.t+'"'+(i?' loading="lazy"':' class="on"')+'>'}).join("");
    var items=[].slice.call(list.querySelectorAll(".sw-item")),imgs=art.children,cur=0;
    var panel=document.getElementById("svPanel"),num=document.getElementById("svNum"),name=document.getElementById("svName"),desc=document.getElementById("svDesc"),tag=document.getElementById("svTag");
    function fill(i){num.textContent="["+n(i)+"]";name.textContent=S[i].t;desc.textContent=S[i].d;tag.textContent=S[i].g}
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

