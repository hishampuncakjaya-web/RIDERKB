/* Kod kongsi: customer (index/track), rider, admin */
(function(){
  const cfg=window.RKB_CFG||{}, fbc=cfg.firebase||{};
  let db=null, auth=null;
  const configured=!!(window.firebase&&fbc.apiKey&&!/^ISI/i.test(fbc.apiKey));
  if(configured){
    try{ firebase.initializeApp(fbc); if(cfg.appCheckKey&&firebase.appCheck){ try{ firebase.appCheck().activate(cfg.appCheckKey,true) }catch(e){ console.warn('AppCheck',e) } } db=firebase.database(); auth=firebase.auth?firebase.auth():null; }
    catch(e){ console.error('Firebase',e); db=null; }
  }
  // status order: baru > diterima > diambil > selesai  (batal = dibatalkan)
  const ST=[['baru','🆕','Mencari rider'],['diterima','✅','Rider sedia'],['diambil','📦','Dalam perjalanan'],['selesai','🎉','Sampai']];
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rm=n=>'RM '+(+n||0).toFixed(2);
  const ago=t=>{const s=Math.max(0,Math.round((Date.now()-t)/1000));return s<60?s+' saat lalu':s<3600?Math.round(s/60)+' min lalu':s<86400?Math.round(s/3600)+' jam lalu':Math.round(s/86400)+' hari lalu'};
  const hm=t=>new Date(t).toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit'});
  const tel=p=>{p=String(p||'').replace(/\D/g,'');if(p.startsWith('0'))p='6'+p;return p};
  const f6=ll=>(+ll[0]).toFixed(6)+','+(+ll[1]).toFixed(6);
  const gmNav=ll=>`https://www.google.com/maps/dir/?api=1&destination=${f6(ll)}&travelmode=two-wheeler`;
  const gmFull=(pick,drop,vehicle)=>`https://www.google.com/maps/dir/?api=1&destination=${f6(drop)}&waypoints=${f6(pick)}&travelmode=${vehicle==='Kereta'?'driving':'two-wheeler'}`;
  function newId(){const a=new Uint8Array(10);crypto.getRandomValues(a);return [...a].map(x=>(x%36).toString(36)).join('')}
  async function getRoute(a,b){ // a,b = [lat,lng]; pulang null jika gagal
    const q=`${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;
    const hosts=['https://router.project-osrm.org/route/v1/driving/','https://routing.openstreetmap.de/routed-car/route/v1/driving/'];
    for(const h of hosts){
      try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),8000);const r=await fetch(h+q,{signal:ctl.signal});clearTimeout(t);const j=await r.json();if(j.routes&&j.routes[0])return j.routes[0]}catch(e){}
    }
    return null;
  }
  const mkIcon=c=>L.divIcon({className:'',html:`<div class="mk" style="background:${c}"></div>`,iconSize:[26,26],iconAnchor:[13,26]});
  const riderIcon=label=>L.divIcon({className:'',html:'<div class="rdr"><span>🛵</span></div>'+(label?`<div class="rlbl">${esc(label)}</div>`:''),iconSize:[38,38],iconAnchor:[19,19]});
  function baseMap(el){
    const m=L.map(el,{zoomControl:true}).setView([6.1254,102.2381],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(m);
    const FS=L.Control.extend({options:{position:'topright'},onAdd(){
      const b=L.DomUtil.create('button','fsb'); b.type='button'; b.textContent='⛶ Skrin penuh';
      L.DomEvent.disableClickPropagation(b);
      b.onclick=()=>{ const c=m.getContainer(), on=c.classList.toggle('fs'); document.body.style.overflow=on?'hidden':''; b.textContent=on?'✕ Keluar':'⛶ Skrin penuh'; setTimeout(()=>m.invalidateSize(),80) };
      return b }});
    m.addControl(new FS());
    return m;
  }
  const flowLine=(geo)=>L.geoJSON(geo,{style:{color:'#2563eb',weight:6,opacity:1,lineCap:'round',lineJoin:'round',className:'flow'}});
  function glide(m,to,ms){
    ms=ms||1200; cancelAnimationFrame(m._raf); const f=m.getLatLng(),t0=performance.now();
    const step=n=>{const k=Math.min(1,(n-t0)/ms);m.setLatLng([f.lat+(to[0]-f.lat)*k,f.lng+(to[1]-f.lng)*k]);if(k<1)m._raf=requestAnimationFrame(step)};
    m._raf=requestAnimationFrame(step);
  }
  // Bunyi: satu AudioContext dikongsi, dibuka (unlock) pada sentuhan pertama supaya telefon tak senyapkan
  let _ac=null;
  function _ctx(){ try{ const A=window.AudioContext||window.webkitAudioContext; if(!A) return null; if(!_ac) _ac=new A(); if(_ac.state==='suspended') _ac.resume(); return _ac }catch(e){ return null } }
  ['touchstart','click','keydown'].forEach(ev=>addEventListener(ev,()=>{ const c=_ctx(); if(c&&c.state==='running'){ try{ const o=c.createOscillator(),g=c.createGain(); g.gain.value=0.0001; o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+.01) }catch(e){} } },{passive:true}));
  function beep(){
    const c=_ctx();
    if(c){ try{ [0,.22,.44,.66].forEach((d,i)=>{ const o=c.createOscillator(),g=c.createGain(); o.type='square'; o.frequency.value=i%2?1100:800; o.connect(g); g.connect(c.destination); const t=c.currentTime+d; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.6,t+.02); g.gain.exponentialRampToValueAtTime(.001,t+.2); o.start(t); o.stop(t+.22) }) }catch(e){} }
    try{navigator.vibrate&&navigator.vibrate([300,120,300,120,300])}catch(e){}
  }

  const hav=(a,b)=>{const R=6371,r=x=>x*Math.PI/180,dl=r(b[0]-a[0]),dn=r(b[1]-a[1]);const h=Math.sin(dl/2)**2+Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
  /* Garis navigasi ikut fasa order:
     baru      : garis ambil->hantar (sederhana)
     diterima  : rider->ambil TERANG, ambil->hantar KABUR
     diambil   : rider->hantar TERANG (garis lain hilang)
     lain      : semua garis dibuang */
  function makeNav(map){
    let bright=null,dim=null,dimKey='',brKey='',brT=0,brLL=null,seq=0,dseq=0,brFb=false;
    const rmv=l=>{if(l)map.removeLayer(l);return null};
    const dimStyle=op=>({color:'#2563eb',weight:5,opacity:op,dashArray:'3 11',lineCap:'round',lineJoin:'round'});
    async function update(o,loc){
      const st=o&&o.status;
      if(!o||!['baru','diterima','diambil'].includes(st)){seq++;dseq++;bright=rmv(bright);dim=rmv(dim);dimKey='';brKey='';return}
      const P=[o.pick.lat,o.pick.lng],D=[o.drop.lat,o.drop.lng];
      if(st==='diambil'){dim=rmv(dim);dimKey=''}
      else{
        const k=o.ref+st;
        if(dimKey!==k){
          dimKey=k;const my=++dseq;const r=await getRoute(P,D);
          if(my===dseq&&dimKey===k){
            dim=rmv(dim);
            dim=(r?L.geoJSON(r.geometry,{style:dimStyle(st==='baru'?.6:.3)}):L.polyline([P,D],dimStyle(st==='baru'?.6:.3))).addTo(map);
            if(bright&&bright.bringToFront)bright.bringToFront();
          }
        }
      }
      if(st==='baru'){bright=rmv(bright);brKey='';return}
      // Tiada lokasi rider: guna titik ambil sebagai permulaan supaya garisan tetap terang ke lokasi hantar
      const from=loc||(st==='diambil'?P:null);
      if(!from){bright=rmv(bright);brKey='';return}
      const target=st==='diterima'?P:D,k=o.ref+st,now=Date.now(),moved=brLL?hav(brLL,from):9;
      if(k!==brKey)bright=rmv(bright);
      if(k!==brKey||(now-brT>15000&&moved>0.08)||(brFb&&now-brT>6000)){
        brKey=k;brT=now;brLL=from;const my=++seq;
        const r=await getRoute(from,target);
        if(my===seq&&brKey===k){
          bright=rmv(bright);brFb=!r;
          bright=(r?flowLine(r.geometry):L.polyline([from,target],{color:'#2563eb',weight:6,opacity:1,dashArray:'12 11',className:'flow'})).addTo(map);
        }
      }
    }
    return{update,clear:()=>update(null)};
  }
  async function osmCams(lat,lng,r){
    const q=`[out:json][timeout:12];(node(around:${r},${lat},${lng})[highway=speed_camera];node(around:${r},${lat},${lng})[enforcement=maxspeed];);out;`;
    try{
      const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(q)});
      const j=await res.json();
      return (j.elements||[]).map(e=>({id:'osm'+e.id,lat:e.lat,lng:e.lon,type:'aes',label:'Kamera kelajuan (OSM)',limit:parseInt(e.tags&&e.tags.maxspeed)||null,src:'osm'}));
    }catch(err){return[]}
  }
  const hazIcon=t=>L.divIcon({className:'',html:`<div class="haz">${t==='speedtrap'?'🚔':'📷'}</div>`,iconSize:[30,30],iconAnchor:[15,15]});
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const msgRider=()=>pick([
    {t:'🎉 Alhamdulillah, tugasan selesai!',m:'Terima kasih atas usaha dan amanah anda. Semoga rezeki hari ni murah dan berkat. 🤲'},
    {t:'💪 Mantap, rider hebat!',m:'Satu lagi order selamat dihantar. Jaga keselamatan di jalan raya, hati-hati ya.'},
    {t:'🤲 Semoga Allah murahkan rezeki',m:'Ya Allah, permudahkanlah urusan kami dan murahkanlah rezeki kami semua. Aamiin.'},
    {t:'🌟 Kerja yang cemerlang!',m:'Penat anda ada nilainya. Rehat sekejap, minum air dan teruskan dengan semangat. 🛵'},
    {t:'😊 Tahniah!',m:'Senyuman pelanggan hari ni datang daripada usaha anda. Semoga sentiasa dilindungi dalam perjalanan.'}
  ]);
  const msgCust=()=>pick([
    {t:'🎉 Order anda selamat sampai!',m:'Terima kasih sudi guna Rider KB Express. Semoga hari anda indah dan penuh rezeki. 💖'},
    {t:'🤲 Alhamdulillah, selesai!',m:'Semoga rezeki anda dimurahkan dan urusan harian dipermudahkan. Aamiin.'},
    {t:'😊 Terima kasih!',m:'Sokongan anda sangat bermakna untuk rider kita. Jumpa lagi pada tempahan seterusnya!'},
    {t:'🌸 Selamat menikmati!',m:'Semoga barang anda memuaskan dan hari anda dipenuhi kegembiraan. Jaga diri ya!'},
    {t:'💛 Syukran, sahabat!',m:'Semoga Allah membalas kebaikan anda dengan yang lebih baik. Sentiasa sihat dan ceria.'}
  ]);

  /* Kategori kedai (kongsi: customer + admin). f = penapis Overpass; r = radius (m) */
  const CATS=[
    {id:'makan',e:'🍴',n:'Makan',f:['[amenity~"^(restaurant|fast_food|food_court)$"]']},
    {id:'kafe',e:'☕',n:'Kafe',f:['[amenity=cafe]']},
    {id:'boba',e:'🧋',n:'Air Viral / Boba',f:['[cuisine=bubble_tea]','[amenity~"^(cafe|fast_food|restaurant|ice_cream)$"][name~"boba|bubble|tealive|chatime|gong cha|coolblog|alley|xing fu|dakasi|jus|juice|cendol|air viral",i]']},
    {id:'kek',e:'🎂',n:'Kek / Bakery / Roti',f:['[shop~"^(bakery|pastry|confectionery)$"]','[shop][name~"kek|cake|bakery|roti|donut|pastri|brownies",i]']},
    {id:'runcit',e:'🛒',n:'Runcit / Pasar',f:['[shop~"^(supermarket|convenience|greengrocer|general|variety_store)$"]']},
    {id:'basah',e:'🐟',n:'Pasar Basah / Ayam / Ikan / Daging',f:['[shop~"^(butcher|seafood|farm)$"]','[amenity=marketplace]','[shop][name~"pasar basah|ayam|ikan|daging|sotong|udang|sayur",i]']},
    {id:'malam',e:'🌙',n:'Pasar Malam / Bazar',r:8000,f:['[name~"pasar malam|pasar tani|bazar|bazaar|night market",i][!highway]']},
    {id:'hardware',e:'🔧',n:'Hardware',f:['[shop~"^(hardware|doityourself|trade|paint|tools|building_materials)$"]']},
    {id:'farmasi',e:'💊',n:'Farmasi',f:['[amenity=pharmacy]','[shop=chemist]','[healthcare=pharmacy]']},
    {id:'pos',e:'📮',n:'Pos / Kurier',f:['[amenity=post_office]','[office=courier]','[name~"j&t|poslaju|pos laju|dhl|gdex|ninja ?van|flash express|courier|kurier",i][!highway]']},
    {id:'baby',e:'🍼',n:'Baby / Susu / Pampers',f:['[shop~"^(baby_goods|toys|children)$"]','[shop][name~"baby|bayi|mothercare|susu|pampers|kids",i]']},
    {id:'pet',e:'🐶',n:'Pet / Makanan Kucing',f:['[shop~"^(pet|pet_grooming)$"]','[amenity=veterinary]','[shop][name~"pet|kucing|cat food|veterinar",i]']},
    {id:'dobi',e:'👕',n:'Dobi / Laundry',f:['[shop~"^(laundry|dry_cleaning)$"]','[amenity=laundry]','[name~"dobi|laundry",i][!highway]']},
    {id:'buku',e:'📚',n:'Buku / Alat Tulis / Print',f:['[shop~"^(books|stationery|copyshop|printing)$"]','[office=printing]','[shop][name~"print|photostat|buku|stationery|alat tulis|popular|mph",i]']},
    {id:'topup',e:'📱',n:'Topup / Bil / E-Wallet',f:['[shop~"^(mobile_phone|telecommunication)$"]','[amenity=post_office]','[shop][name~"7-eleven|7 eleven|kk mart|99 speedmart|topup|top up|maxis|celcom|digi|umobile|unifi|tm point|bill",i]']},
    {id:'bunga',e:'💐',n:'Bunga / Gift / Surprise',f:['[shop~"^(florist|gift|party|garden_centre)$"]','[shop][name~"bunga|florist|gift|hadiah|balloon|belon|surprise",i]']},
    {id:'elektrik',e:'🔌',n:'Elektrik / Kedai RM2 / DIY',f:['[shop~"^(electronics|electrical|variety_store|houseware|discount)$"]','[shop][name~"rm ?2|mr ?diy|mr dollar|ecoshop|eco shop|elektrik",i]']},
    {id:'masjid',e:'🕌',n:'Barangan Masjid / Frozen / Kuih Raya',f:['[shop~"^(frozen_food|religion|confectionery)$"]','[shop][name~"frozen|kuih|sejuk beku|tikar|sejadah|kopiah|telekung|islamic|muslim|kurma",i]']}
  ];
  const phoneKey=p=>String(p||'').replace(/\D/g,'').slice(-10);
  const report=o=>db?db.ref('reports').push(Object.assign({t:Date.now()},o)):Promise.reject(new Error('nodb'));
  function compressImg(file,max,q){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onerror=rej; fr.onload=()=>{ const im=new Image(); im.onerror=rej; im.onload=()=>{ const k=Math.min(1,max/Math.max(im.width,im.height)), cv=document.createElement('canvas'); cv.width=Math.round(im.width*k); cv.height=Math.round(im.height*k); cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height); res(cv.toDataURL('image/jpeg',q)) }; im.src=fr.result }; fr.readAsDataURL(file) }) }
  const kb=()=>{ try{ return localStorage.getItem('rkb-loghat')!=='0' }catch(e){ return true } };
  const say=(bm,k)=>kb()?k:bm;
  const toggleLoghat=()=>{ try{ localStorage.setItem('rkb-loghat',kb()?'0':'1') }catch(e){} return kb() };
  const confetti=()=>{ if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return; const E=['🎉','✨','🌙','💛','🛵']; for(let i=0;i<26;i++){ const s=document.createElement('span'); s.className='cf'; s.textContent=E[i%E.length]; s.style.left=(Math.random()*96)+'vw'; s.style.animationDelay=(Math.random()*0.8)+'s'; s.style.fontSize=(16+Math.random()*16)+'px'; document.body.appendChild(s); setTimeout(()=>s.remove(),4200) } };
  window.RKB={kb,say,toggleLoghat,confetti,phoneKey,report,compressImg,cfg,ok:!!db,db,auth,ST,esc,rm,ago,hm,tel,f6,gmNav,gmFull,newId,getRoute,mkIcon,riderIcon,baseMap,flowLine,glide,beep,hav,makeNav,osmCams,hazIcon,msgRider,msgCust,CATS};
})();
