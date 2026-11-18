/* Home hero: interactive reel phone (Nov 2026). The phone is formed while the cursor is near it and the hero is in
   view; move away or scroll down and it comes apart. Three renders to compare (demo pill bottom-left, ?phone=1|2|3):
     1 Dust     ~50k GPU particles; the reel is painted onto the screen as a dense dot grid (vertex texture fetch)
     2 Tiles    the reel cut into instanced 3D tiles that tumble apart and lock back into a crisp video
     3 Dissolve a solid glossy phone playing the reel burns away along a glowing edge, dust blows off it
   ES module: index.html maps "three" + "three/addons/" (three@0.160.0, jsdelivr) in an importmap. */
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";

const hero=document.getElementById("top");
if(hero){
const calm=matchMedia("(prefers-reduced-motion: reduce)").matches,small=matchMedia("(max-width:900px)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
let MODE=(()=>{const q=(location.search.match(/[?&]phone=([123])/)||[])[1];if(q)return+q;try{return+(localStorage.getItem("usm_phone_r")||1)||1}catch(e){return 1}})();

/* ---------- DOM ---------- */
const st=document.createElement("style");st.textContent=`
.hero-phone{position:absolute;z-index:1;left:55%;right:1%;top:12%;bottom:130px;pointer-events:none}
.hero-phone canvas{width:100%;height:100%;display:block}
#top #heroTitle,#top .hero-stats,#top .hero-sub{position:relative;z-index:2}
@media (max-width:1199px){.hero-phone{position:relative;left:auto;right:auto;top:auto;bottom:auto;height:min(92vw,460px);margin:-1.5rem calc(var(--gutter) * -1) .5rem}}
.pv-phone{position:fixed;left:16px;bottom:16px;z-index:70;display:flex;align-items:center;gap:4px;padding:4px 4px 4px 12px;border-radius:999px;background:#f3f1e8;color:#131a5e;font:500 .7rem 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 10px 30px -12px #0008}
.pv-phone button{font:inherit;border:0;border-radius:999px;padding:.55em .9em;background:transparent;color:inherit;cursor:pointer}
.pv-phone button[aria-pressed=true]{background:#131a5e;color:#d7ff3d}
.pv-phone small{font-size:inherit;opacity:.6;margin-right:4px}
body:has(#menu-overlay.open) .pv-phone{display:none}`;
document.head.appendChild(st);
const box=document.createElement("div");box.className="hero-phone";box.setAttribute("aria-hidden","true");
const canvas=document.createElement("canvas");box.appendChild(canvas);hero.insertBefore(box,document.getElementById("heroTitle"));
const pill=document.createElement("div");pill.className="pv-phone";pill.innerHTML='<small>Phone</small><button type="button" data-m="1">1 Dust</button><button type="button" data-m="2">2 Tiles</button><button type="button" data-m="3">3 Dissolve</button>';
document.body.appendChild(pill);
const paint=()=>pill.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.m===MODE));paint();

/* ---------- renderer ---------- */
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
const PR=Math.min(devicePixelRatio,small?1.75:2);renderer.setPixelRatio(PR);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,.1,100);camera.position.z=13;
const rig=new THREE.Group();scene.add(rig);
scene.add(new THREE.AmbientLight(0xffffff,.55));const key=new THREE.DirectionalLight(0xffffff,1.6);key.position.set(-3,4,6);scene.add(key);
const rim=new THREE.PointLight(0xff59c4,30,20);rim.position.set(4,-2,3);scene.add(rim);const rim2=new THREE.PointLight(0xd7ff3d,18,20);rim2.position.set(-4,3,2);scene.add(rim2);

/* ---------- shared: phone size, reel video ---------- */
const W=2.3,H=4.7,D=.28,R=.34,SW=W-.18,SH=H-.3;
const REELS=["DTQDNftCP7D","DUm40gWCFPH","DaiQz4ATL69","DYeDiv1Mson","Dbs0OH0NQHu","DZsDUa7CMFY"];let ri=0;
const vid=document.createElement("video");vid.muted=true;vid.playsInline=true;vid.setAttribute("playsinline","");vid.preload="auto";vid.crossOrigin="anonymous";
const load=()=>{vid.src="assets/work-reels/"+REELS[ri]+".mp4";vid.play().catch(()=>{})};vid.addEventListener("ended",()=>{ri=(ri+1)%REELS.length;load()});load();
const vtex=new THREE.VideoTexture(vid);vtex.colorSpace=THREE.SRGBColorSpace;vtex.minFilter=THREE.LinearFilter;vtex.magFilter=THREE.LinearFilter;
const U={uD:{value:0},uT:{value:0},uVid:{value:vtex},uPPU:{value:500},uMouse:{value:new THREE.Vector3(99,99,0)}};
const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*vn(p);p*=2.03;a*=.5;}return v;}
mat3 rotAxis(vec3 a,float t){a=normalize(a);float s=sin(t),c=cos(t),o=1.-c;return mat3(o*a.x*a.x+c,o*a.x*a.y+a.z*s,o*a.z*a.x-a.y*s,o*a.x*a.y-a.z*s,o*a.y*a.y+c,o*a.y*a.z+a.x*s,o*a.z*a.x+a.y*s,o*a.y*a.z-a.x*s,o*a.z*a.z+c);}`;
function rnd(a,b){return a+Math.random()*(b-a)}
function inRR(x,y,w,h,r){const ax=Math.abs(x)-(w/2-r),ay=Math.abs(y)-(h/2-r);return ax<=0||ay<=0||ax*ax+ay*ay<=r*r}
function edgeRR(w,h,r){const t=Math.random()*4;let x,y;if(t<1){x=rnd(-w/2,w/2);y=h/2}else if(t<2){x=rnd(-w/2,w/2);y=-h/2}else if(t<3){x=w/2;y=rnd(-h/2,h/2)}else{x=-w/2;y=rnd(-h/2,h/2)}
 const ax=Math.abs(x)-(w/2-r),ay=Math.abs(y)-(h/2-r);if(ax>0&&ay>0){const a=Math.atan2(ay,ax);x=Math.sign(x)*(w/2-r+Math.cos(a)*r);y=Math.sign(y)*(h/2-r+Math.sin(a)*r)}return[x,y]}
const PAPER=[.95,.94,.91],LIME=[.84,1,.24],PINK=[1,.35,.77],INK=[.11,.15,.44];

/* ===== 1. DUST ===== */
function buildDust(){
 const C=small?72:112,Rw=small?144:224,S=C*Rw,NB=small?9000:24000,N=S+NB;
 const pos=new Float32Array(N*3),uv=new Float32Array(N*2).fill(-1),col=new Float32Array(N*3),rd=new Float32Array(N*4);let i=0;
 for(let r=0;r<Rw;r++)for(let c=0;c<C;c++,i++){pos.set([((c+.5)/C-.5)*SW,((r+.5)/Rw-.5)*SH,D/2+.01],i*3);uv.set([(c+.5)/C,(r+.5)/Rw],i*2)}
 for(;i<N;i++){const f=Math.random();let x,y,z,b;
  if(f<.45){[x,y]=edgeRR(W,H,R);z=rnd(-D/2,D/2);b=rnd(.6,1)}
  else if(f<.75){do{x=rnd(-W/2,W/2);y=rnd(-H/2,H/2)}while(!inRR(x,y,W,H,R)||(Math.abs(x)<SW/2&&Math.abs(y)<SH/2));z=D/2;b=rnd(.75,1)}
  else{do{x=rnd(-W/2,W/2);y=rnd(-H/2,H/2)}while(!inRR(x,y,W,H,R));z=-D/2;b=rnd(.3,.55)}
  const s=Math.random(),cc=s<.07?LIME:s<.11?PINK:PAPER;pos.set([x,y,z],i*3);col.set([cc[0]*b,cc[1]*b,cc[2]*b],i*3)}
 for(i=0;i<N;i++)rd.set([Math.random(),Math.random(),Math.random(),Math.random()],i*4);
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("aUv",new THREE.BufferAttribute(uv,2));g.setAttribute("aCol",new THREE.BufferAttribute(col,3));g.setAttribute("aRnd",new THREE.BufferAttribute(rd,4));
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.NormalBlending,uniforms:{...U,uSp:{value:SW/C}},
  vertexShader:`uniform float uD,uT,uPPU,uSp;uniform sampler2D uVid;uniform vec3 uMouse;attribute vec2 aUv;attribute vec3 aCol;attribute vec4 aRnd;varying vec3 vC;varying float vA;varying float vS;
  void main(){bool scr=aUv.x>=0.;float d=smoothstep(aRnd.x*.55,aRnd.x*.55+.45,uD);d=d*d*(3.-2.*d);
   float shed=smoothstep(.62,1.,position.x/2.3+.5+(aRnd.z-.5)*.35)*(scr?.0:.35);float life=fract(uT*(.05+.09*aRnd.y)+aRnd.z);float m=max(d,shed*life);
   float a=aRnd.w*6.2832;vec3 dir=normalize(vec3(cos(a)*1.2+.35,sin(a)*.9+.2,(aRnd.y-.5)*1.4));
   vec3 drift=vec3(sin(uT*.55+aRnd.z*40.),cos(uT*.47+aRnd.w*31.),sin(uT*.39+aRnd.x*23.));
   vec3 p=position+dir*m*(1.3+aRnd.y*2.6)+drift*m*.45;
   vec2 dm=p.xy-uMouse.xy;float dl=length(dm);p.xy+=dm/(dl+1e-3)*max(0.,.45-dl)*.35*(1.-uD);
   vec3 c=aCol;if(scr){c=texture2D(uVid,aUv).rgb;c=c*1.12+.03;}
   vC=c;vA=scr?mix(1.,.85,m):mix(.95,.7,m);vA*=1.-shed*life*.9;vS=scr?1.:0.;
   vec4 mv=modelViewMatrix*vec4(p,1.);float ws=scr?uSp*1.08:(.012+aRnd.y*.022);gl_PointSize=max(1.,ws*uPPU/-mv.z*(scr?1.:(1.+m*.6)));gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`varying vec3 vC;varying float vA;varying float vS;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);if(vS>.5){if(max(abs(p.x),abs(p.y))>.5)discard;gl_FragColor=vec4(vC,vA);return;}if(d>.5)discard;gl_FragColor=vec4(vC,vA*smoothstep(.5,.15,d));}`});
 const pts=new THREE.Points(g,m);const grp=new THREE.Group();grp.add(pts);
 return{grp,dispose(){g.dispose();m.dispose()}};
}

/* ===== 2. TILES ===== */
function buildTiles(){
 const C=small?12:16,Rw=small?24:32,n=C*Rw,tw=SW/C,th=SH/Rw;
 const geo=new THREE.BoxGeometry(tw*.94,th*.94,.07);
 const cell=new Float32Array(n*2),rd=new Float32Array(n*4);
 for(let r=0,i=0;r<Rw;r++)for(let c=0;c<C;c++,i++){cell.set([c,r],i*2);rd.set([Math.random(),Math.random(),Math.random(),Math.random()],i*4)}
 geo.setAttribute("aCell",new THREE.InstancedBufferAttribute(cell,2));geo.setAttribute("aRnd",new THREE.InstancedBufferAttribute(rd,4));
 const m=new THREE.ShaderMaterial({uniforms:{...U,uGrid:{value:new THREE.Vector4(C,Rw,tw,th)},uSz:{value:new THREE.Vector2(SW,SH)}},
  vertexShader:`${NOISE}uniform float uD,uT;uniform vec4 uGrid;uniform vec2 uSz;uniform vec3 uMouse;attribute vec2 aCell;attribute vec4 aRnd;varying vec2 vUv;varying vec3 vN;varying float vM;
  void main(){float d=smoothstep(aRnd.x*.5,aRnd.x*.5+.5,uD);d=d*d*(3.-2.*d);vec2 ctr=vec2((aCell.x+.5)*uGrid.z-uSz.x*.5,(aCell.y+.5)*uGrid.w-uSz.y*.5);
   vUv=vec2((aCell.x+.5+position.x/(uGrid.z*.94)*.94)/uGrid.x,(aCell.y+.5+position.y/(uGrid.w*.94)*.94)/uGrid.y);
   float ang=d*(2.5+aRnd.y*5.)+sin(uT*.8+aRnd.z*20.)*d*.6;mat3 R=rotAxis(vec3(aRnd.y-.5,aRnd.z-.5,aRnd.w*.6),ang);
   vec3 p=R*position;float a=aRnd.w*6.2832;vec3 dir=normalize(vec3(ctr.x*.5+cos(a),ctr.y*.35+sin(a)*.8,(aRnd.y-.5)*2.5+.6));
   vec3 drift=vec3(sin(uT*.5+aRnd.z*30.),cos(uT*.45+aRnd.x*25.),sin(uT*.35+aRnd.y*15.))*.35;
   vec2 dm=ctr-uMouse.xy;float dl=length(dm);float push=max(0.,.7-dl)*(1.-uD);
   vec3 c=vec3(ctr,.17)+dir*d*(1.6+aRnd.x*2.4)+drift*d+vec3(0,0,push*.35);
   vN=normalize(R*normal);vM=d;gl_Position=projectionMatrix*modelViewMatrix*vec4(c+p,1.);}`,
  fragmentShader:`uniform sampler2D uVid;varying vec2 vUv;varying vec3 vN;varying float vM;void main(){vec3 v=texture2D(uVid,clamp(vUv,0.,1.)).rgb;float front=step(.5,vN.z);
   vec3 side=mix(vec3(.84,1.,.24),vec3(1.,.35,.77),step(.5,fract(vUv.x*7.+vUv.y*3.)))*.85;float l=.75+.25*dot(vN,normalize(vec3(-.3,.5,.8)));
   vec3 c=mix(side*l,v*mix(1.,l,vM),front);if(vN.z<-.5)c=vec3(.08,.1,.3);gl_FragColor=vec4(c,1.);}`});
 const tiles=new THREE.InstancedMesh(geo,m,n);const dummy=new THREE.Object3D();for(let i=0;i<n;i++){tiles.setMatrixAt(i,dummy.matrix)}tiles.frustumCulled=false;
 const bodyMat=new THREE.MeshPhysicalMaterial({color:0x131a5e,roughness:.32,metalness:.35,clearcoat:1,clearcoatRoughness:.15,transparent:true});
 const body=new THREE.Mesh(new RoundedBoxGeometry(W,H,D,6,R),bodyMat);
 const glass=new THREE.Mesh(new THREE.PlaneGeometry(SW+.02,SH+.02),new THREE.MeshBasicMaterial({color:0x05071f,transparent:true}));glass.position.z=D/2+.002;
 const grp=new THREE.Group();grp.add(body,glass,tiles);
 return{grp,update(d){bodyMat.opacity=1-Math.min(1,d*1.6);glass.material.opacity=bodyMat.opacity;body.scale.setScalar(1-d*.15);body.visible=bodyMat.opacity>.01;glass.visible=body.visible},dispose(){geo.dispose();m.dispose();body.geometry.dispose();bodyMat.dispose();glass.geometry.dispose();glass.material.dispose()}};
}

/* ===== 3. DISSOLVE ===== */
function buildDissolve(){
 const dis=`${NOISE}uniform float uD;varying vec3 vP;float th(){return uD*1.25-.12;}float nz(){return fbm(vP.xy*1.35+vec2(3.1,7.7))*.85+fract(sin(dot(floor(vP.xy*40.),vec2(12.9,78.2)))*437.5)*.15;}`;
 const edgeCol=`vec3 burn(float e){return mix(vec3(1.,.35,.77),vec3(.84,1.,.24),e);}`;
 const bodyMat=new THREE.MeshPhysicalMaterial({color:0x131a5e,roughness:.3,metalness:.4,clearcoat:1,clearcoatRoughness:.12});
 bodyMat.onBeforeCompile=s=>{s.uniforms.uD=U.uD;s.vertexShader=s.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 vP;").replace("#include <begin_vertex>","#include <begin_vertex>\nvP=position;");
  s.fragmentShader=s.fragmentShader.replace("#include <common>","#include <common>\n"+dis+edgeCol).replace("#include <dithering_fragment>","#include <dithering_fragment>\nfloat n=nz(),t=th();if(n<t)discard;float e=smoothstep(t,t+.07,n);gl_FragColor.rgb=mix(burn(e)*1.6,gl_FragColor.rgb,e);")};
 const body=new THREE.Mesh(new RoundedBoxGeometry(W,H,D,6,R),bodyMat);
 const scrMat=new THREE.ShaderMaterial({uniforms:U,transparent:false,vertexShader:`varying vec3 vP;varying vec2 vUv;void main(){vP=position;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`${dis}${edgeCol}uniform sampler2D uVid;varying vec2 vUv;void main(){float n=nz(),t=th();if(n<t)discard;float e=smoothstep(t,t+.07,n);vec3 v=texture2D(uVid,vUv).rgb;vec2 q=abs(vUv-.5)*2.;float rr=.09;vec2 k=max(q-1.+rr*vec2(1.,SW_SH),0.);if(length(k/vec2(rr,rr*SW_SH))>1.)discard;gl_FragColor=vec4(mix(burn(e)*1.6,v,e),1.);}`.replace(/SW_SH/g,(SW/SH).toFixed(4))});
 const scr=new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),scrMat);scr.position.z=D/2+.004;
 /* dust: born where the edge passes, drifts away */
 const N=small?9000:22000,pos=new Float32Array(N*3),rd=new Float32Array(N*4);
 for(let i=0;i<N;i++){let x,y;do{x=rnd(-W/2,W/2);y=rnd(-H/2,H/2)}while(!inRR(x,y,W,H,R));pos.set([x,y,Math.random()<.85?D/2+.01:-D/2-.01],i*3);rd.set([Math.random(),Math.random(),Math.random(),Math.random()],i*4)}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("aRnd",new THREE.BufferAttribute(rd,4));
 const pm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:U,
  vertexShader:`${dis}uniform float uT,uPPU;uniform sampler2D uVid;attribute vec4 aRnd;varying vec3 vC;varying float vA;
  void main(){vP=position;float n=nz(),t=th();float age=clamp((t-n)/.55,0.,1.);float a=aRnd.w*6.2832;vec3 dir=normalize(vec3(cos(a)*.8+.9,sin(a)*.8+.5,aRnd.y-.3));
   vec3 drift=vec3(sin(uT*.7+aRnd.z*40.),cos(uT*.6+aRnd.x*30.),sin(uT*.5+aRnd.y*20.))*.4;vec3 p=position+dir*age*(1.1+aRnd.x*2.)+drift*age;
   vC=mix(vec3(.84,1.,.24),mix(vec3(1.,.35,.77),vec3(.95,.94,.91),aRnd.z),age);vA=age>0.?mix(1.,.38,age)*(.55+.45*aRnd.y):0.;
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=max(1.,(.018+aRnd.y*.03)*uPPU/-mv.z);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5||vA<=0.)discard;gl_FragColor=vec4(vC,vA*smoothstep(.5,.0,d));}`});
 const dust=new THREE.Points(g,pm);dust.frustumCulled=false;
 const grp=new THREE.Group();grp.add(body,scr,dust);
 return{grp,dispose(){body.geometry.dispose();bodyMat.dispose();scr.geometry.dispose();scrMat.dispose();g.dispose();pm.dispose()}};
}

/* ---------- mode switching ---------- */
const builders={1:buildDust,2:buildTiles,3:buildDissolve};let cur=null;
function setMode(m){if(cur){rig.remove(cur.grp);cur.dispose()}MODE=m;cur=builders[m]();rig.add(cur.grp);paint();try{localStorage.setItem("usm_phone_r",m)}catch(e){}}
setMode(MODE);
pill.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&+b.dataset.m!==MODE)setMode(+b.dataset.m)});

/* ---------- layout ---------- */
function resize(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 const visH=2*Math.tan(camera.fov*Math.PI/360)*camera.position.z,visW=visH*camera.aspect,s=Math.min(visH/5.9,visW/3.1);rig.scale.setScalar(s);
 U.uPPU.value=h*PR/(2*Math.tan(camera.fov*Math.PI/360))*s}
addEventListener("resize",resize);resize();new ResizeObserver(resize).observe(box);

/* ---------- input ---------- */
let mx=0,my=0,moved=false;addEventListener("pointermove",e=>{if(e.pointerType==="mouse"){mx=e.clientX;my=e.clientY;moved=true}},{passive:true});document.addEventListener("mouseleave",()=>{moved=false});
let scrollP=0;addEventListener("scroll",()=>{scrollP=Math.min(1,Math.max(0,scrollY/(hero.offsetHeight*.6)))},{passive:true});
let visible=true;new IntersectionObserver(es=>{visible=es[0].isIntersecting},{rootMargin:"120px"}).observe(box);
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0),hit=new THREE.Vector3(),loc=new THREE.Vector3();
const sm=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};

/* ---------- loop: critically damped spring on the dispersal amount = smooth in both directions ---------- */
let d=0,dv=0,rx=0,ry=0,last=performance.now();
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;if(!visible)return;
 const r=box.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,ph=r.height*.8,pw=ph*W/H;
 let target=0;if(fine&&moved&&!calm){const q=Math.hypot((mx-cx)/(pw*.5+80),(my-cy)/(ph*.5+80));target=sm(1,2.4,q)}
 target=Math.max(target,sm(.05,.85,scrollP));if(calm)target=0;
 const K=MODE===3?14:18,Cd=2*Math.sqrt(K);dv+=((target-d)*K-dv*Cd)*dt;d+=dv*dt;d=Math.max(0,Math.min(1.05,d));
 U.uD.value=d;U.uT.value=now/1000;
 ndc.set((mx-r.left)/r.width*2-1,-((my-r.top)/r.height)*2+1);ray.setFromCamera(ndc,camera);ray.ray.intersectPlane(plane,hit);rig.updateMatrixWorld();loc.copy(hit);rig.worldToLocal(loc);U.uMouse.value.copy(fine&&moved?loc:new THREE.Vector3(99,99,0));
 const tx=fine&&moved&&!calm?Math.max(-1,Math.min(1,ndc.x)):0,ty=fine&&moved&&!calm?Math.max(-1,Math.min(1,ndc.y)):0;
 ry+=((tx*.35+Math.sin(now/2000)*.07)*(1-d)-.2-ry)*.06;rx+=((-ty*.2)*(1-d)+Math.cos(now/2600)*.03-rx)*.06;rig.rotation.set(rx,ry,d*.12);
 if(cur.update)cur.update(d);renderer.render(scene,camera)}
requestAnimationFrame(tick);
}
