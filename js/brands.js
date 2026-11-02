/* Us Moment — client logo wall (shared by index.html and work.html).
   EDIT HERE to add / remove / reorder brands.
   - logo: file in assets/clients/logos/ (transparent PNG silhouette). Leave it out and the
     brand name is set in type instead, until a logo file is supplied.
     Only use logos that contain the brand name (icon-only marks like Gurume / the ISL crest are set in type).
   - ar:   logo width ÷ height, used to size every logo to the same visual weight.
   - Every logo has an ink version (assets/clients/logos/) and a real-colour version
     (assets/clients/logos/color/, logo only, no background) that fades in on hover.
   - Each array in BRAND_ROWS is one scrolling row; order inside a row is the display order.
     Rows are arranged so neighbouring logos are different colours and the big names are spread out. */
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
  "tbf":{n:"TBF (To Be Frank)",logo:"tbf.png",ar:1.47},
  "the-croffle-guys":{n:"The Croffle Guys",logo:"the-croffle-guys.png",ar:2.14},
  "terractive":{n:"Terractive",logo:"terractive.png",ar:6.02},
  "isl":{n:"Indian Super League"},
  "bar-bank":{n:"Bar Bank"},
  "vinyl-pop":{n:"Vinyl Pop"},
  "walters":{n:"Walters",logo:"walters.png",ar:4},
  "paper-boat-zero":{n:"Paper Boat Zero"},
  "pop-upi":{n:"POP UPI"},
  "gong":{n:"Gong",logo:"gong.png",ar:.63},
  "house-of-govinda":{n:"House of Govinda",logo:"house-of-govinda.png",ar:4.15},
  "so-positive":{n:"So Positive",logo:"so-positive.png",ar:1.18},
  "edit":{n:"Edit"},
  "gush":{n:"Gush",logo:"gush.png",ar:3.09},
  "la-shield":{n:"La Shield",logo:"la-shield.png",ar:5.96},
  "comart":{n:"Comart",logo:"comart.png",ar:3.78},
  "brooklyn-bread":{n:"Brooklyn Bread",logo:"brooklyn-bread.png",ar:1.36},
  "antimattr":{n:"Antimattr",logo:"antimattr.png",ar:5.44},
  "fossae":{n:"Fossae",logo:"fossae.png",ar:3.52},
  "sarkar":{n:"Sarkar"},
  "gurume":{n:"Gurume"},
  "pho-table":{n:"Pho Table",logo:"pho-table.png",ar:2.73},
  "qreativs":{n:"Qreativs"},
  "olly-fest":{n:"Olly Fest"},
  "yara":{n:"Yara"},
  "not-rocket-science":{n:"Not Rocket Science"},
  "scalpe-pro":{n:"Scalpe Pro"},
  "paulie-gees":{n:"Paulie Gee’s"}
};
const BRAND_ROWS=[
  ["netflix","elra","siciliana","walters","uber","so-positive","bar-bank","mubi","terractive","gush","yara","fossae","la-shield"],
  ["amazon-prime","nykaa","gurume","tbf","isl","vinyl-pop","antimattr","candid","paper-boat-zero","mood-banana","brooklyn-bread","qreativs","olly-fest"],
  ["ceat-specialty","house-of-govinda","the-croffle-guys","pop-upi","bold-care","comart","edit","licious","sarkar","gong","not-rocket-science","pho-table","scalpe-pro","paulie-gees"]
];
(function(){
  var holders=document.querySelectorAll("[data-logo-wall]");
  if(!holders.length)return;
  var stars=["lm-s1","lm-s2","lm-s3"];
  function mark(slug,i){
    var b=BRANDS[slug];if(!b)return"";
    var star='<span class="lm-star '+stars[i%3]+'" aria-hidden="true">✦</span>';
    if(!b.logo)return'<span class="lm-item"><span class="lm-text">'+b.n+'</span></span>'+star;
    // sized to roughly equal visual weight; bigger than before so every name reads clearly.
    // Tall logos (name under an emblem) get extra height so the name stays legible.
    var ar=b.ar||3,h=Math.min(ar<1.2?4.4:3.8,Math.sqrt(34/ar)),w=h*ar;
    // two layers: an ink silhouette (default) and the real-colour logo (shown on hover).
    // Both are plain images, so they work even when the site is opened as a local file.
    return'<span class="lm-item"><span class="lm-logo" style="width:'+w.toFixed(2)+'em;height:'+h.toFixed(2)+'em"><img class="lm-mono" src="assets/clients/logos/'+b.logo+'" alt="'+b.n+'" decoding="async"><img class="lm-col" src="assets/clients/logos/color/'+b.logo+'" alt="" aria-hidden="true" decoding="async"></span></span>'+star;
  }
  holders.forEach(function(el){
    el.innerHTML=BRAND_ROWS.map(function(row,r){
      var once=row.map(mark).join("");
      // the row is printed twice so the -50% loop is seamless; the copy is hidden from screen readers
      return'<div class="lm-row'+(r%2?" lm-rev":"")+'" style="--dur:'+(row.length*3.4)+'s"><div class="lm-track"><div class="lm-set">'+once+'</div><div class="lm-set" aria-hidden="true">'+once+'</div></div></div>';
    }).join("");
  });
})();
