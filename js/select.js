/* Themed dropdown for the contact form's "What do you need?" (native option lists can't be styled).
   The real <select> stays in the form (hidden, still required, still submitted); this builds an accessible
   button + listbox on top, keeps them in sync and fires "change" on the select so Mo the cat still reacts. */
(function(){
document.querySelectorAll("#contactForm select").forEach(function(sel){
 var field=sel.closest(".field");if(!field)return;field.classList.add("usel");
 var opts=[].slice.call(sel.options).filter(function(o){return!o.disabled}),ph=(sel.querySelector("option[disabled]")||{}).textContent||"Select";
 var id=sel.id||"usel",btn=document.createElement("button");btn.type="button";btn.className="usel-btn";btn.setAttribute("data-name",sel.name);
 btn.setAttribute("aria-haspopup","listbox");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls",id+"-list");
 var lab=sel.labels&&sel.labels[0];if(lab){lab.id=lab.id||id+"-label";btn.setAttribute("aria-labelledby",lab.id+" "+id+"-val")}
 btn.innerHTML='<span class="usel-val" id="'+id+'-val">'+ph+'</span><svg class="usel-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
 var list=document.createElement("ul");list.className="usel-list";list.id=id+"-list";list.setAttribute("role","listbox");list.tabIndex=-1;if(lab)list.setAttribute("aria-labelledby",lab.id);
 opts.forEach(function(o,i){var li=document.createElement("li");li.setAttribute("role","option");li.id=id+"-o"+i;li.textContent=o.textContent;li.setAttribute("aria-selected","false");li.style.setProperty("--i",i);list.appendChild(li)});
 sel.classList.add("usel-native");sel.tabIndex=-1;sel.setAttribute("aria-hidden","true");
 field.appendChild(btn);field.appendChild(list);
 var items=[].slice.call(list.children),active=-1,open=false;
 function paint(){var v=sel.value;btn.querySelector(".usel-val").textContent=v||ph;field.classList.toggle("has-val",!!v);items.forEach(function(li,i){li.setAttribute("aria-selected",opts[i].value===v||opts[i].textContent===v?"true":"false")})}
 function hi(i){active=(i+items.length)%items.length;items.forEach(function(li,j){li.classList.toggle("act",j===active)});list.setAttribute("aria-activedescendant",items[active].id);items[active].scrollIntoView({block:"nearest"})}
 function show(){if(open)return;open=true;field.classList.add("open");btn.setAttribute("aria-expanded","true");var cur=opts.findIndex(function(o){return o.selected&&!o.disabled});hi(cur<0?0:cur);list.focus({preventScroll:true})}
 function hide(focusBtn){if(!open)return;open=false;field.classList.remove("open");btn.setAttribute("aria-expanded","false");if(focusBtn)btn.focus({preventScroll:true})}
 function choose(i){sel.value=opts[i].value||opts[i].textContent;paint();sel.dispatchEvent(new Event("change",{bubbles:true}));hide(true)}
 btn.addEventListener("click",function(){open?hide(true):show()});
 btn.addEventListener("keydown",function(e){if(["ArrowDown","ArrowUp","Enter"," "].indexOf(e.key)>-1){e.preventDefault();show()}});
 list.addEventListener("keydown",function(e){if(e.key==="ArrowDown"){e.preventDefault();hi(active+1)}else if(e.key==="ArrowUp"){e.preventDefault();hi(active-1)}else if(e.key==="Home"){e.preventDefault();hi(0)}else if(e.key==="End"){e.preventDefault();hi(items.length-1)}
  else if(e.key==="Enter"||e.key===" "){e.preventDefault();choose(active)}else if(e.key==="Escape"){e.preventDefault();hide(true)}else if(e.key==="Tab"){hide(false)}
  else if(e.key.length===1){var c=e.key.toLowerCase();for(var n=1;n<=items.length;n++){var j=(active+n)%items.length;if(items[j].textContent.toLowerCase()[0]===c){hi(j);break}}}});
 items.forEach(function(li,i){li.addEventListener("click",function(){choose(i)});li.addEventListener("mousemove",function(){if(active!==i)hi(i)})});
 document.addEventListener("pointerdown",function(e){if(open&&!field.contains(e.target))hide(false)});
 list.addEventListener("focusout",function(e){if(open&&!field.contains(e.relatedTarget))hide(false)});
 sel.addEventListener("invalid",function(){field.classList.add("bad");setTimeout(function(){btn.focus({preventScroll:true})},0)});
 sel.addEventListener("change",function(){field.classList.remove("bad")});
 sel.form&&sel.form.addEventListener("reset",function(){setTimeout(paint,0)});
 paint();
});
})();
