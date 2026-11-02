/* CLIENT PREVIEW ONLY: floating colour-palette switcher for the home page.
   Remove this file + css/palette-preview.css + their two tags in index.html once a palette is chosen. */
(function(){
  var P=[
    {k:"",n:"Original",d:"Deep ink · Off-white · Lime + Pink",c:["#131a5e","#f3f1e8","#d7ff3d"]},
    {k:"midnight",n:"Midnight",d:"Midnight Black · Electric Blue · Cantaloupe Orange",c:["#0b0c14","#1e9bdb","#ff8a5b"]},
    {k:"bubblegum",n:"Bubblegum",d:"Deep Blue · Pure White · Bubblegum Pink",c:["#15298f","#ffffff","#ff8fd6"]},
    {k:"onyx",n:"Onyx",d:"Onyx Black · Electric Indigo · Tropical Mint",c:["#0e0e11","#6c2bff","#86f7b6"]}
  ];
  var cur="";try{cur=localStorage.getItem("um-palette")||""}catch(e){}
  function apply(k){if(k)document.documentElement.setAttribute("data-palette",k);else document.documentElement.removeAttribute("data-palette");cur=k;try{localStorage.setItem("um-palette",k)}catch(e){}render()}
  var sw=function(c){return'<span class="pal-sw">'+c.map(function(x){return'<i style="background:'+x+'"></i>'}).join("")+'</span>'};
  var box=document.createElement("div");box.className="pal";box.setAttribute("data-no-cursor","");
  function render(){
    var a=P.filter(function(p){return p.k===cur})[0]||P[0];
    box.innerHTML='<div class="pal-menu" role="radiogroup" aria-label="Colour palette"><p>Preview a colour palette</p>'+
      P.map(function(p){return'<label class="pal-opt"><input type="radio" name="um-pal" value="'+p.k+'"'+(p.k===cur?' checked':'')+'>'+sw(p.c)+'<span>'+p.n+'<small>'+p.d+'</small></span></label>'}).join("")+'</div>'+
      '<button class="pal-btn" type="button" aria-haspopup="true">'+sw(a.c)+'Palette: '+a.n+' ▴</button>';
  }
  render();
  box.addEventListener("click",function(e){if(e.target.closest(".pal-btn")){box.classList.toggle("open");}});
  box.addEventListener("change",function(e){if(e.target.name==="um-pal"){var open=true;apply(e.target.value);box.classList.toggle("open",open)}});
  document.addEventListener("click",function(e){if(!box.contains(e.target))box.classList.remove("open")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")box.classList.remove("open")});
  if(cur)apply(cur);
  document.body.appendChild(box);
})();
