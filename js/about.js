/* About page data: founders + crew (edit here) */
const team=[{n:"Fardeen",r:"Co-Founder",portrait:"assets/team/fardeen-portrait.jpg",bio:"Co-founder. Cut his teeth growing Netflix India\u2019s YouTube and shipping content for Prime Video titles like Mirzapur and Panchayat. Mr Masti, aka Dad-1, resident dad-joke expert.",photo:"assets/team/fardeen.jpg"},{n:"Melvin",r:"Co-Founder",portrait:"assets/team/melvin-portrait.jpg",bio:"Co-founder. Built the same Netflix and Prime Video track record, minus the noise, runs strategy and the studio\u2019s calm. Mr Shaant, aka Dad-2, permanently on iced coffee.",photo:"assets/team/melvin.jpg"}],crew=[{n:"Zainab",r:"Account Director",q:"",photo:"assets/team/zainab.jpg"},{n:"Jyoti Adnani",r:"Account Manager",q:"Diva #1. Sarcastic at core, kali coffee connoisseur.",photo:"assets/team/jyoti.jpg"},{n:"Mansi Pandey",r:"Creative Manager",q:"Fashionista, runs on daily coffee and sushi.",photo:"assets/team/mansi-p.jpg"},{n:"Yashashvi Chauhan",r:"Creative Manager",q:"aka Memester.",photo:"assets/team/yashashvi.jpg"},{n:"Ananya Ahuja",r:"Creative Manager",q:"",photo:"assets/team/ananya.jpg"},{n:"Purti Malhotra",r:"Account Manager",q:"",photo:"assets/team/purti.jpg"},{n:"Ruhi Shende",r:"Account Manager",q:"",photo:"assets/team/ruhi.jpg"},{n:"Suraj Iyer",r:"Senior Account Executive",q:"",photo:"assets/team/suraj.jpg"},{n:"Aesha Khan",r:"Account Executive",q:"Diva #2. Loves biryani, tracks the money.",photo:"assets/team/aesha.jpg"},{n:"Avilika Dhara",r:"Senior Creative Executive",q:"",photo:"assets/team/avilika.jpg"},{n:"Danika Mude",r:"Senior Creative Executive",q:"",photo:"assets/team/danika.jpg"},{n:"Faika",r:"Senior Creative Executive",q:"",photo:"assets/team/faika.jpg"},{n:"Deepakshi Lakhanii",r:"Senior Creative Executive",q:"",photo:"assets/team/deepakshi.jpg"},{n:"Sayantani Mujumdar",r:"Creative Executive",q:"",photo:"assets/team/sayantani.jpg"},{n:"Rushabh",r:"Creative Executive",q:"",photo:"assets/team/rushabh.jpg"},{n:"Aryan",r:"Senior Video Editor",q:"aka Sasta SRK. Psychological thrillers, biryani.",photo:"assets/team/aryan.jpg"},{n:"Edwin Sunil",r:"Graphic Designer",q:"",photo:"assets/team/edwin.jpg"},{n:"Aditi",r:"Design & Edit",q:"Likes illustrating, North Indian food.",photo:"assets/team/aditi.jpg"},{n:"Heena Malik",r:"Client Servicing Executive",q:"Likes sports, lives for seafood.",photo:"assets/team/heena.jpg"},{n:"Namra Shaikh",r:"Client Servicing Executive",q:"",photo:"assets/team/namra.jpg"},{n:"Eiram Shaikh",r:"Client Servicing Intern",q:"",photo:"assets/team/eiram.jpg"},{n:"Zaheen",r:"Founder\u2019s Office / HR",q:"",photo:"assets/team/zaheen.jpg"}];

/* About page v3: kinetic hero, pinned story timeline, flip/tilt founders, moving crew wall, easter eggs */
(function(){
  "use strict";
  var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
  var G=window.gsap,ST=window.ScrollTrigger,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
  var esc=function(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};

  /* ---------- secrets (4) ---------- */
  var found={},TOTAL=4,toastEl=$("#abToast"),tt;
  try{found=JSON.parse(sessionStorage.getItem("um-secrets")||"{}")}catch(e){}
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove("show")},2600)}
  function secret(id,label){if(found[id]){return}found[id]=1;try{sessionStorage.setItem("um-secrets",JSON.stringify(found))}catch(e){}
    var n=Object.keys(found).length;toast("Secret "+n+"/"+TOTAL+" | "+label+(n===TOTAL?" | You found them all ✱":""))}
  function bubble(host,html,cls,ms){var old=host.querySelector(".ab-bubble");if(old)old.remove();var b=document.createElement("div");b.className="ab-bubble"+(cls?" "+cls:"");b.innerHTML=html;host.appendChild(b);
    clearTimeout(host._bt);host._bt=setTimeout(function(){b.classList.add("bye");setTimeout(function(){b.remove()},300)},ms||4200);return b}

  /* ---------- hero: faces in the headline + kinetic lines ---------- */
  // every word in the headline lights up on hover in its own colour (like "feed." going pink)
  (function(){var C={"Twenty-something":"lime","people":"pink","with":"line","strong":"pink","opinions":"pink","about":"line","your":"lime","feed.":"pink"};
    $$(".ab-title .ab-w").forEach(function(w){w.innerHTML=w.textContent.trim().split(/\s+/).map(function(t){return'<span class="ab-wd" data-c="'+(C[t]||"lime")+'">'+esc(t)+'</span>'}).join(" ")})})();
  function heroIntro(){
    if(!G||reduced){$$(".ab-w").forEach(function(w){w.style.transform="none"});var t0=$(".ab-title");if(t0)t0.classList.add("ab-in");return}
    G.to(".ab-w",{y:"0%",duration:1.15,ease:"power4.out",stagger:.09,delay:.1,onComplete:function(){var t=$(".ab-title");if(t)t.classList.add("ab-in")}});
    G.fromTo([".ab-hero-top",".ab-hero-foot"],{opacity:0,y:20},{opacity:1,y:0,duration:1,ease:"power3.out",stagger:.1,delay:.5});
  }
  // start after the site preloader is gone (first visit) or straight away
  (function wait(n){var p=document.getElementById("preloader");if(!p||getComputedStyle(p).display==="none"||n>80)heroIntro();else setTimeout(function(){wait(n+1)},100)})(0);
  if(G&&ST&&!reduced){
    $$(".ab-l").forEach(function(l){G.to(l,{xPercent:+l.dataset.dir*9,ease:"none",scrollTrigger:{trigger:"#abHero",start:"top top",end:"bottom top",scrub:.6}})});
    G.to(".ab-glow",{yPercent:30,ease:"none",scrollTrigger:{trigger:"#abHero",start:"top top",end:"bottom top",scrub:true}});
  }

  /* ---------- founders: tilt + flip, and "dad mode" (5 quick clicks) ---------- */
  var DAD={
    // each double click: question first, answer ~2.5s later
    Fardeen:{stamp:"Mr Masti mode",qa:[
      ["Why did the reel go to therapy?","Too many unresolved hooks."],
      ["Why don\u2019t influencers ever get lost?","They always follow the trend."],
      ["What\u2019s a brand\u2019s favourite workout?","Brand stretching."],
      ["Why was the content calendar so stressed?","Too many dates."],
      ["Why did the video editor break up with the timeline?","It kept cutting him off."],
      ["Why did the algorithm join a band?","It already had all the right hooks."]]},
    // double click 1: joke Q then A; double click 2: fun facts; then repeats.
    // UPDATE the answer when United's form changes (written Nov 2026: 17th, no win in 5 league games)
    Melvin:{stamp:"Red Devils mode",qa:[["Why is Melvin always so shaant?","He supports Man United. 17th in the league, no win in five, and he still says \u201cwe go again next week.\u201d Your deadline doesn\u2019t scare him."]],
      facts:["Fun fact: United started life in 1878 as Newton Heath, a team of railway workers.","Fun fact: Sir Bobby Charlton nicknamed Old Trafford \u201cthe Theatre of Dreams.\u201d","Fun fact: In 1999 United won the Premier League, FA Cup and Champions League in one season. The treble.","Fun fact: Sir Alex Ferguson managed the club for 26 years and won 13 Premier League titles.","Fun fact: United have won 20 English league titles. Melvin can recite every one."]}
  };
  var fg=$("#abFounderGrid");
  if(fg){
    fg.innerHTML=team.map(function(c){var alias=(c.bio.match(/(Mr \w+, aka Dad-\d)/)||[])[1]||"",bio=c.bio.replace(/^Co-founder\.\s*/,""),dad=(alias.match(/Dad-\d/)||[""])[0];
      return'<button class="fx3d" type="button" data-n="'+esc(c.n)+'" aria-label="'+esc(c.n)+'. Flip for bio"><span class="fx-in">'+
        '<span class="fx-face fx-front" style="background-image:url(\''+(c.portrait||c.photo)+'\')"><span class="fx-glare"></span><span class="fx-flipicon" aria-hidden="true">↻</span><span class="fx-name"><b>'+esc(c.n)+'</b></span></span>'+
        '<span class="fx-face fx-back"><span><span class="fx-alias">'+esc(alias)+'</span><h3>'+esc(c.n)+'</h3></span><p>'+esc(bio)+'</p><span class="fx-sig">'+esc(c.n)+' ✱</span><span class="fx-dad" aria-hidden="true">'+esc(dad)+'</span></span>'+
        '</span><span class="fx-stamp">'+esc((DAD[c.n]||{}).stamp||"")+'</span></button>'}).join("");
    $$(".fx3d",fg).forEach(function(card){
      var clicks=[],li=0,d=DAD[card.dataset.n];
      function dadMode(){card.classList.remove("flip");card.classList.remove("dad");void card.offsetWidth;card.classList.add("dad");
        (card._ft||[]).forEach(clearTimeout);card._ft=[];
        var step=card._step||0,seq,icon=d.facts?"\u26bd ":"\ud83e\udd41 ",QA=2600;
        if(d.facts&&step%2===1){seq=d.facts.map(function(t){return{t:"\u26bd "+t,at:0}});seq.forEach(function(x,k){x.at=k*3600})}
        else{var q=d.qa[li++%d.qa.length];seq=[{t:"\u2753 "+q[0],at:0,q:1},{t:icon+q[1],at:QA}]}
        card._step=step+1;
        var lastT=seq[seq.length-1].t.length,total=seq[seq.length-1].at+(d.facts&&step%2===1?3400:Math.max(4000,lastT*55));
        var bb=bubble(card,esc(seq[0].t)+(seq[0].q?' <span class="dots"><i></i><i></i><i></i></span>':""),"",total);bb.style.left="1rem";bb.style.right="1rem";bb.style.top="1rem";bb.style.zIndex="6";bb.style.maxWidth="22rem";
        seq.slice(1).forEach(function(x){card._ft.push(setTimeout(function(){if(!bb.isConnected)return;bb.style.animation="none";void bb.offsetWidth;bb.style.animation="";bb.innerHTML=esc(x.t)},x.at))});
        clearTimeout(card._dt);card._dt=setTimeout(function(){card.classList.remove("dad")},total);secret("dad","Dad-joke mode")}
      // double click/tap = dad mode (single click still flips, after a short wait)
      var dbl=!!d,pend=null;
      card.addEventListener("click",function(){
        if(dbl&&d){
          if(pend){clearTimeout(pend);pend=null;dadMode();return}
          pend=setTimeout(function(){pend=null;card.classList.toggle("flip")},280);return;
        }
        card.classList.toggle("flip");
        var now=Date.now();clicks=clicks.filter(function(t){return now-t<1800});clicks.push(now);
        if(d&&clicks.length>=5){clicks=[];dadMode()}
      });
      if(fine&&!reduced){
        card.addEventListener("pointermove",function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty("--ry",((x-.5)*12).toFixed(2)+"deg");card.style.setProperty("--rx",((.5-y)*10).toFixed(2)+"deg");card.style.setProperty("--gx",(x*100).toFixed(1)+"%");card.style.setProperty("--gy",(y*100).toFixed(1)+"%")});
        card.addEventListener("pointerleave",function(){card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg")});
      }
    });
    if(G&&ST&&!reduced)G.fromTo($$(".fx3d",fg),{opacity:0,y:60,rotate:function(i){return i?4:-4}},{opacity:1,y:0,rotate:0,duration:1.1,ease:"power3.out",stagger:.15,scrollTrigger:{trigger:fg,start:"top 82%"}});
  }

  /* ---------- crew: two moving rows + big name, or a grid ---------- */
  var EGG={
    "Jyoti Adnani":{type:"coffee",lines:["Oh, you clicked me. Bold.","Kali coffee. No sugar. Like my feedback.","Sarcasm? Never heard of it.","Diva #1, obviously."]},
    "Zaheen":{type:"think",lines:["Hmm. Is this a leave request?","Thinking about your appraisal…","Noted. Filed. Still thinking.","Let me get back to you on that."]}
  };
  function card(c,dup){return'<button class="mc" type="button" data-n="'+esc(c.n)+'" data-r="'+esc(c.r)+'"'+(dup?' tabindex="-1" aria-hidden="true"':'')+'><span class="mc-img" style="background-image:url(\''+c.photo+'\')"></span><span class="mc-t"><b>'+esc(c.n)+'</b><span>'+esc(c.r)+'</span></span></button>'}
  var rows=$("#abRows"),stage=$(".ab-stage"),bigN=$("#abBigName"),bigR=$("#abBigRole");
  var half=Math.ceil(crew.length/2),A=crew.slice(0,half),B=crew.slice(half);
  rows.innerHTML=[A,B].map(function(set,i){return'<div class="ab-row'+(i?' rev':'')+'" style="--dur:'+(set.length*5.2)+'s"><div class="ab-row-in">'+set.map(function(c){return card(c)}).join("")+set.map(function(c){return card(c,1)}).join("")+'</div></div>'}).join("");
  function showName(n,r){bigN.textContent=n;bigR.textContent=r;stage.classList.add("has")}
  function clearName(){stage.classList.remove("has");bigN.textContent="Us Moment";bigR.textContent="The crew"}
  $$(".mc",rows).forEach(function(m){
    m.addEventListener("mouseenter",function(){showName(m.dataset.n,m.dataset.r)});
    m.addEventListener("focus",function(){showName(m.dataset.n,m.dataset.r)});
    m.addEventListener("mouseleave",clearName);m.addEventListener("blur",clearName);
  });
  function eggs(scope){$$(".mc",scope).forEach(function(m){m.addEventListener("click",function(){
    if(!fine){$$(".mc.sel").forEach(function(x){x.classList.remove("sel")});m.classList.add("sel");showName(m.dataset.n,m.dataset.r);var row=m.closest(".ab-row");$$(".ab-row").forEach(function(r){r.classList.toggle("hold",r===row)})}
    var e=EGG[m.dataset.n];if(!e)return;
    m._i=(m._i||0);var line=e.lines[m._i++%e.lines.length];
    if(e.type==="coffee"){
      if(!m.querySelector(".steam")){var s=document.createElement("span");s.className="steam";s.innerHTML="<i></i><i></i><i></i>";m.appendChild(s);var cr=document.createElement("span");cr.className="crown";cr.textContent="👑";m.appendChild(cr);setTimeout(function(){s.remove();cr.remove()},4600)}
      var b=bubble(m,"☕ "+esc(line),"",4200);b.style.left="8px";b.style.right="8px";b.style.top="8px";secret("jyoti","Diva #1");
    }else{
      var b2=bubble(m,'<span class="dots"><i></i><i></i><i></i></span>',"think",4600);b2.style.left="8px";b2.style.right="8px";b2.style.top="8px";
      setTimeout(function(){if(b2.isConnected)b2.textContent="💭 "+line},900);secret("zaheen","The thinker");
    }
    var row2=m.closest(".ab-row");if(row2){row2.classList.add("hold");clearTimeout(row2._h);row2._h=setTimeout(function(){row2.classList.remove("hold")},4600)}
  })})}
  eggs(rows);
  // phones: tapping away clears the selection
  document.addEventListener("click",function(e){if(!e.target.closest(".mc")){$$(".mc.sel").forEach(function(x){x.classList.remove("sel")});$$(".ab-row.hold").forEach(function(r){r.classList.remove("hold")});clearName()}});
  if(G&&ST&&!reduced)G.fromTo(".ab-row",{opacity:0,x:function(i){return i?-80:80}},{opacity:1,x:0,duration:1.2,ease:"power3.out",stagger:.12,scrollTrigger:{trigger:rows,start:"top 85%"}});
  $$(".ab-f-head,.ab-c-head").forEach(function(h){if(G&&ST&&!reduced)G.fromTo(h.children,{opacity:0,y:30},{opacity:1,y:0,duration:.9,ease:"power3.out",stagger:.08,scrollTrigger:{trigger:h,start:"top 85%"}})});

  /* ---------- Konami code (or tap the spinning badge 7 times) → party ---------- */
  var party=$("#abParty"),cv=$("#abConfetti"),cx=cv.getContext("2d"),bits=[],raf=0;
  function launch(){party.hidden=false;secret("konami","Konami party");var w=cv.width=innerWidth*Math.min(devicePixelRatio||1,2),h=cv.height=innerHeight*Math.min(devicePixelRatio||1,2),k=w/innerWidth;
    var C=["#d7ff3d","#ff59c4","#3245f5","#f3f1e8"];bits=[];for(var i=0;i<(reduced?40:180);i++)bits.push({x:w/2,y:h*.55,vx:(Math.random()-.5)*26*k,vy:(-Math.random()*22-6)*k,r:Math.random()*6.28,vr:(Math.random()-.5)*.3,s:(8+Math.random()*12)*k,c:C[i%4],star:Math.random()<.35});
    cancelAnimationFrame(raf);(function tick(){cx.clearRect(0,0,w,h);var live=0;bits.forEach(function(b){b.vy+=.55*k;b.vx*=.99;b.x+=b.vx;b.y+=b.vy;b.r+=b.vr;if(b.y<h+40)live++;cx.save();cx.translate(b.x,b.y);cx.rotate(b.r);cx.fillStyle=b.c;
      if(b.star){cx.font="bold "+(b.s*1.8)+"px serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText("✱",0,0)}else cx.fillRect(-b.s/2,-b.s/4,b.s,b.s/2);cx.restore()});if(live)raf=requestAnimationFrame(tick)})()}
  $("#abPartyClose").addEventListener("click",function(){party.hidden=true});
  party.addEventListener("click",function(e){if(e.target===party)party.hidden=true});
  addEventListener("keydown",function(e){if(e.key==="Escape")party.hidden=true});
  var KON=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],kp=0;
  addEventListener("keydown",function(e){var k=e.key.length===1?e.key.toLowerCase():e.key;kp=(k===KON[kp])?kp+1:(k===KON[0]?1:0);if(kp===KON.length){kp=0;launch()}});
  var badge=$("#abBadge"),taps=[];
  badge.addEventListener("click",function(){var now=Date.now();taps=taps.filter(function(t){return now-t<2500});taps.push(now);badge.classList.add("hit");setTimeout(function(){badge.classList.remove("hit")},250);if(taps.length>=7){taps=[];launch()}});

  if(ST)addEventListener("load",function(){ST.refresh()});
})();
