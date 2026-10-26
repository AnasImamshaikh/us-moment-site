/* Us Moment — client logo wall (shared by index.html and work.html).
   EDIT HERE to add / remove / reorder brands.
   - logo: file in assets/clients/logos/ (transparent PNG silhouette). Leave it out and the
     brand name is set in type instead, until a logo file is supplied.
   - ar:   logo width ÷ height, used to size every logo to the same visual weight.
   - Every logo has an ink version (assets/clients/logos/) and a real-colour version
     (assets/clients/logos/color/) that fades in on hover. tile = the colour version has its own
     background tile (light or boxed logos), sized relative to the logo.
   - Each array in BRAND_ROWS is one scrolling row; order inside a row is the display order. */
const BRANDS={
  "netflix":{n:"Netflix",logo:"netflix.png",ar:3.73},
  "amazon-prime":{n:"Amazon Prime Video",logo:"amazon-prime.png",ar:5.19},
  "uber":{n:"Uber",logo:"uber.png",ar:2.88},
  "nykaa":{n:"Nykaa",logo:"nykaa.png",ar:3.06},
  "mubi":{n:"MUBI",logo:"mubi.png",ar:3.29},
  "ceat-specialty":{n:"CEAT Specialty",logo:"ceat-specialty.png",ar:1.66},
  "licious":{n:"Licious",logo:"licious.png",ar:2.42},
  "candid":{n:"Candid",logo:"candid.png",ar:3.29},
  "elra":{n:"Elra",logo:"elra.png",ar:2.94},
  "mood-banana":{n:"Mood Banana",logo:"mood-banana.png",ar:2.61},
  "bold-care":{n:"Bold Care",logo:"bold-care.png",ar:3.59},
  "siciliana":{n:"Siciliana",logo:"siciliana.png",ar:3.05},
  "wamiqa-gabbi":{n:"Wamiqa Gabbi"},
  "tbf":{n:"TBF (To Be Frank)",logo:"tbf.png",ar:1.47},
  "bhuvan-bam":{n:"Bhuvan Bam"},
  "the-croffle-guys":{n:"The Croffle Guys",logo:"the-croffle-guys.png",ar:2.14,tile:[0.141,0.141,0,0]},
  "terractive":{n:"Terractive",logo:"terractive.png",ar:6.02},
  "isl":{n:"ISL",logo:"isl.png",ar:.76},
  "bar-bank":{n:"Bar Bank"},
  "vinyl-pop":{n:"Vinyl Pop"},
  "walters":{n:"Walters",logo:"walters.png",ar:4,tile:[0.088,0.137,0.088,0.137]},
  "paper-boat-zero":{n:"Paper Boat Zero"},
  "pop-upi":{n:"POP UPI"},
  "gong":{n:"Gong",logo:"gong.png",ar:.63},
  "house-of-govinda":{n:"House of Govinda",logo:"house-of-govinda.png",ar:4.15},
  "so-positive":{n:"So Positive",logo:"so-positive.png",ar:1.18,tile:[0.141,0.14,0.141,0.14]},
  "edit":{n:"Edit"},
  "gush":{n:"Gush",logo:"gush.png",ar:3.09},
  "la-shield":{n:"La Shield",logo:"la-shield.png",ar:5.96},
  "comart":{n:"Comart",logo:"comart.png",ar:3.78},
  "brooklyn-bread":{n:"Brooklyn Bread",logo:"brooklyn-bread.png",ar:1.36},
  "antimattr":{n:"Antimattr",logo:"antimattr.png",ar:5.44,tile:[0.14,0.14,0.14,0.14]},
  "fossae":{n:"Fossae",logo:"fossae.png",ar:3.52},
  "sarkar":{n:"Sarkar"},
  "gurume":{n:"Gurume",logo:"gurume.png",ar:1},
  "pho-table":{n:"Pho Table",logo:"pho-table.png",ar:2.73,tile:[0.068,0.14,0.066,0.14]},
  "qreativs":{n:"Qreativs"},
  "olly-fest":{n:"Olly Fest"},
  "yara":{n:"Yara"},
  "not-rocket-science":{n:"Not Rocket Science"},
  "scalpe-pro":{n:"Scalpe Pro"},
  "paulie-gees":{n:"Paulie Gee’s"}
};
const BRAND_ROWS=[
  ["netflix","nykaa","uber","elra","siciliana","bhuvan-bam","isl","walters","gong","edit","comart","fossae","pho-table","yara"],
  ["amazon-prime","ceat-specialty","licious","mood-banana","wamiqa-gabbi","the-croffle-guys","bar-bank","paper-boat-zero","house-of-govinda","gush","brooklyn-bread","sarkar","qreativs","not-rocket-science"],
  ["mubi","candid","bold-care","tbf","terractive","vinyl-pop","pop-upi","so-positive","la-shield","antimattr","gurume","olly-fest","scalpe-pro","paulie-gees"]
];
(function(){
  var holders=document.querySelectorAll("[data-logo-wall]");
  if(!holders.length)return;
  var stars=["lm-s1","lm-s2","lm-s3"];
  function mark(slug,i){
    var b=BRANDS[slug];if(!b)return"";
    var star='<span class="lm-star '+stars[i%3]+'" aria-hidden="true">✦</span>';
    if(!b.logo)return'<span class="lm-item"><span class="lm-text">'+b.n+'</span></span>'+star;
    var ar=b.ar||3,h=Math.min(3,Math.sqrt(20/ar)),w=h*ar;
    // two layers: an ink silhouette (default) and the real-colour logo (shown on hover).
    // Both are plain images, so they work even when the site is opened as a local file.
    var t=b.tile,pos=t?' style="left:-'+t[0]*100+'%;top:-'+t[1]*100+'%;right:-'+t[2]*100+'%;bottom:-'+t[3]*100+'%"':'';
    return'<span class="lm-item"><span class="lm-logo" style="width:'+w.toFixed(2)+'em;height:'+h.toFixed(2)+'em"><img class="lm-mono" src="assets/clients/logos/'+b.logo+'" alt="'+b.n+'" decoding="async"><img class="lm-col'+(t?" lm-tile":"")+'" src="assets/clients/logos/color/'+b.logo+'" alt="" aria-hidden="true" decoding="async"'+pos+'></span></span>'+star;
  }
  holders.forEach(function(el){
    el.innerHTML=BRAND_ROWS.map(function(row,r){
      var once=row.map(mark).join("");
      // the row is printed twice so the -50% loop is seamless; the copy is hidden from screen readers
      return'<div class="lm-row'+(r%2?" lm-rev":"")+'" style="--dur:'+(row.length*3.4)+'s"><div class="lm-track"><div class="lm-set">'+once+'</div><div class="lm-set" aria-hidden="true">'+once+'</div></div></div>';
    }).join("");
  });
})();
