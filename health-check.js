/* MYRIDERKU MATRIX DIAGNOSTIC + MAINTENANCE V77
   Diagnostic checks use live browser/Firebase/API responses.
   Maintenance writes ONLY /system/maintenance and requires matching Firebase Rules. */
(function(){
 'use strict';
 const role=(/\/(admin|customer|rider|vendor)\.html$/i.exec(location.pathname)||[])[1]||'customer';
 const R=window.RKB||{}, $=(s,r=document)=>r.querySelector(s);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state={}, labels={ok:'BAIK',warn:'AMARAN',bad:'GAGAL',na:'N/A',run:'MENGUJI'};
 let lastRun=0, maintenance={enabled:false,message:'',updatedAt:0,updatedBy:''};
 const admin=()=>role==='admin'&&R.auth&&R.auth.currentUser&&Array.isArray(R.cfg&&R.cfg.admins)&&R.cfg.admins.map(x=>String(x).toLowerCase()).includes(String(R.auth.currentUser.email||'').toLowerCase());
 function set(id,status,detail,advice=''){
  state[id]={status,detail,advice};
  const row=$('[data-hc="'+id+'"]'); if(!row)return;
  const dot=$('.hc-dot',row),st=$('.hc-status',row),de=$('.hc-detail',row);
  dot.className='hc-dot '+status;dot.textContent=status==='ok'?'✓':status==='bad'?'✕':status==='warn'?'!':status==='na'?'—':'⋯';
  st.className='hc-status '+status;st.textContent=labels[status]||status;de.textContent=detail;
 }
 const row=(id,name,desc)=>'<div class="hc-row" data-hc="'+id+'"><span class="hc-dot run">⋯</span><div class="hc-main"><b>'+name+'</b><small class="hc-detail">'+desc+'</small></div><strong class="hc-status run">MENGUJI</strong></div>';
 function scanOverlay(){
  const el=$('#hcMatrix'); if(el){el.classList.add('show');return}
  const d=document.createElement('div');d.id='hcMatrix';d.className='hc-matrix show';
  d.innerHTML='<canvas id="hcRain"></canvas><div class="hc-matrix-content"><div class="hc-brand">MYRIDERKU <span>MISSION CONTROL</span></div><div class="hc-scan-title">MATRIX DIAGNOSTIC SCAN</div><div class="hc-scan-sub">MEMULAKAN PEMERIKSAAN SISTEM SEBENAR</div><div class="hc-scan-line"></div><div id="hcScanLog" class="hc-scan-log">INITIALIZING CORE…</div></div>';
  document.body.appendChild(d);startRain(d.querySelector('canvas'));
 }
 function startRain(canvas){
  const ctx=canvas.getContext('2d');let w,h,cols,drops,raf;
  const resize=()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;cols=Math.max(1,Math.floor(w/17));drops=Array(cols).fill(1)};
  resize();addEventListener('resize',resize,{passive:true});
  const draw=()=>{if(!document.body.contains(canvas)){cancelAnimationFrame(raf);removeEventListener('resize',resize);return}
   ctx.fillStyle='rgba(2,0,8,.13)';ctx.fillRect(0,0,w,h);ctx.font='14px monospace';
   for(let i=0;i<drops.length;i++){const ch=String.fromCharCode(0x30A0+Math.random()*96);ctx.fillStyle=Math.random()>.94?'#fff':'#bd55ff';ctx.fillText(ch,i*17,drops[i]*17);if(drops[i]*17>h&&Math.random()>.975)drops[i]=0;drops[i]++}
   raf=requestAnimationFrame(draw);
  };draw();
 }
 function closeScan(){const e=$('#hcMatrix');if(e){e.classList.add('fade');setTimeout(()=>e.remove(),500)}}
 function openPanel(){
  if($('#myriderkuHealthPanel')){$('#myriderkuHealthPanel').classList.add('show');runAll();return}
  const d=document.createElement('div');d.id='myriderkuHealthPanel';d.className='hc-overlay show';
  d.innerHTML='<section class="hc-panel" role="dialog" aria-modal="true" aria-label="MYRIDERKU Matrix Diagnostic">'+
   '<header class="hc-head"><div><small>MYRIDERKU • MISSION CONTROL • '+role.toUpperCase()+'</small><h2>◈ MATRIX DIAGNOSTIC</h2><p>Live system integrity & service diagnostics</p></div><button class="hc-close" type="button">×</button></header>'+
   '<div class="hc-summary"><div><span class="hc-big" id="hcScore">—</span><small id="hcSummary">Belum diperiksa</small></div><button id="hcRefresh" type="button">⟳ IMBAS SEMULA</button></div>'+
   '<div class="hc-section-title">CORE SYSTEMS</div><div class="hc-list">'+
   row('internet','NETWORK LINK','Ujian rangkaian dan capaian pelayan')+
   row('firebase','FIREBASE REALTIME DATABASE','Status sambungan dan bacaan diagnostik')+
   row('auth','AUTHENTICATION','Sesi login dan identiti semasa')+
   row('gps','GPS TELEMETRY','Koordinat, kebenaran dan kesegaran lokasi')+
   row('cloudinary','CLOUDINARY MEDIA','Konfigurasi cloud dan upload preset')+
   row('weather','WEATHER API','Permintaan API cuaca sebenar Open-Meteo')+
   row('notify','PUSH / NOTIFICATIONS','Kebenaran notifikasi pelayar')+
   row('storage','LOCAL STORAGE','Ujian baca/tulis storan tempatan')+
   row('clock','DEVICE CLOCK','Semakan jam peranti')+
   '</div><div class="hc-section-title">DIAGNOSTIC REPORT</div><div id="hcAdvice" class="hc-advice">Jalankan imbasan untuk melihat keputusan.</div>'+
   (role==='admin'?'<div class="hc-section-title">MISSION CONTROL • MAINTENANCE</div><div class="hc-maint"><div class="hc-maint-head"><div><b>Maintenance Mode</b><small id="hcMaintStatus">Menyemak status operasi…</small></div><span id="hcMaintLamp" class="hc-maint-lamp">●</span></div><label for="hcMaintMsg">Mesej kepada pengguna</label><textarea id="hcMaintMsg" maxlength="240" placeholder="Contoh: Sistem sedang diselenggara. Sila cuba sebentar lagi."></textarea><div class="hc-maint-actions"><button id="hcMaintOn" type="button">AKTIFKAN MAINTENANCE</button><button id="hcMaintOff" type="button">PULIHKAN OPERASI</button></div><small class="hc-security-note">Perlindungan wajib: Firebase Rules mesti mengehadkan /system/maintenance kepada Admin yang disahkan. UI sahaja bukan kawalan keselamatan.</small></div>':'')+
   '<footer class="hc-foot"><span id="hcTime">Belum diperiksa</span><button type="button" id="hcCloseBottom">TUTUP</button></footer></section>';
  document.body.appendChild(d);
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('.hc-close')||e.target.id==='hcCloseBottom')d.classList.remove('show')});
  $('#hcRefresh',d).addEventListener('click',runAll);
  if(role==='admin'){ $('#hcMaintOn',d).addEventListener('click',()=>setMaintenance(true));$('#hcMaintOff',d).addEventListener('click',()=>setMaintenance(false));loadMaintenance(); }
  runAll();
 }
 function render(){
  const vals=Object.values(state),bad=vals.filter(x=>x.status==='bad').length,warn=vals.filter(x=>x.status==='warn').length,ok=vals.filter(x=>x.status==='ok').length,na=vals.filter(x=>x.status==='na').length;
  $('#hcScore').textContent=bad?bad+' FAIL':warn?warn+' ALERT':ok+'/'+vals.length+' PASS';
  $('#hcSummary').textContent=bad?'KEGAGALAN DIKESAN':warn?'PERLU PERHATIAN':na?'SEMAKAN SELESAI • ADA SERVIS N/A':'SEMUA UJIAN LULUS';
  const advice=Object.entries(state).filter(([,x])=>x.status==='bad'||x.status==='warn'||x.status==='na');
  $('#hcAdvice').innerHTML=advice.length?advice.map(([k,x])=>'<p><b>'+esc(k.toUpperCase())+' · '+esc(labels[x.status])+'</b><br>'+esc(x.detail)+(x.advice?'<br><i>Tindakan: '+esc(x.advice)+'</i>':'')+'</p>').join(''):'<p>Semua pemeriksaan yang boleh dijalankan telah lulus. Ini bukan jaminan semua aliran transaksi aplikasi sempurna.</p>';
 }
 async function timeout(p,ms=8000){return Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT '+ms+'ms')),ms))])}
 async function checkInternet(){
  if(!navigator.onLine){set('internet','bad','Peranti melaporkan offline.','Semak Wi-Fi atau data mudah alih.');return}
  try{const r=await timeout(fetch(location.origin+'/?hc='+Date.now(),{method:'HEAD',cache:'no-store'}),6000);if(r.ok||r.type==='opaque')set('internet','ok','Rangkaian aktif; origin aplikasi memberi respons HTTP '+r.status+'.');else set('internet','warn','Rangkaian aktif tetapi origin aplikasi memberi HTTP '+r.status+'.','Semak hosting atau cache Netlify.')}
  catch(e){set('internet','warn','Peranti online tetapi ujian capaian origin gagal: '+e.message,'Semak rangkaian atau hosting.')}
 }
 async function checkFirebase(){
  if(!R.db){set('firebase','bad','Firebase SDK/database tidak dimuatkan atau konfigurasi tiada.','Semak firebase-config.js, SDK dan Console.');return}
  try{const s=await timeout(R.db.ref('.info/connected').once('value'),8000);if(s.val()===true)set('firebase','ok','Realtime Database connected=true. Ujian baca metadata berjaya.');else set('firebase','bad','Realtime Database connected=false.','Semak internet, URL database dan Firebase Rules.')}
  catch(e){set('firebase','bad','Gagal membaca .info/connected: '+(e.code||e.message),'Semak Firebase SDK, databaseURL, Rules dan rangkaian.')}
 }
 function checkAuth(){
  if(!R.auth){set('auth','bad','Firebase Authentication tidak tersedia pada halaman ini.','Semak inisialisasi Firebase Auth.');return}
  const u=R.auth.currentUser;if(u)set('auth','ok','Sesi sah: '+(u.email||u.uid.slice(0,8))+' · '+(u.isAnonymous?'Anonymous':'Authenticated')+'.');
  else set('auth','warn','Tiada pengguna sedang login. Ini normal jika halaman dibuka sebagai tetamu.','Log masuk untuk mengaktifkan fungsi mengikut peranan.');
 }
 async function checkGps(){
  if(!navigator.geolocation){set('gps','bad','Geolocation API tidak disokong.','Gunakan HTTPS dan pelayar yang menyokong lokasi.');return}
  if(role==='rider'){
   const u=R.auth&&R.auth.currentUser;if(!u){set('gps','warn','Login Rider diperlukan untuk semak rekod GPS.');return}
   try{const s=await timeout(R.db.ref('riders/'+u.uid).once('value'));const v=s.val()||{},t=Number(v.t)||0,age=t?Date.now()-t:Infinity;
    if(v.online!==true)set('gps','warn','Rider tidak Online; perkongsian lokasi mungkin dihentikan.');
    else if(!Number.isFinite(+v.lat)||!Number.isFinite(+v.lng)||!t)set('gps','bad','Rider Online tetapi koordinat atau timestamp tiada.','Aktifkan kebenaran lokasi dan semak proses GPS Rider.');
    else if(age>120000)set('gps','bad','GPS lapuk '+Math.round(age/60000)+' minit.','Semak permission, bateri, aplikasi latar dan sambungan data.');
    else if(age>45000)set('gps','warn','GPS lewat '+Math.round(age/1000)+' saat.','Semak isyarat dan battery optimization.');
    else set('gps','ok','Koordinat tersedia; kemas kini '+Math.round(age/1000)+' saat lalu.');
   }catch(e){set('gps','bad','Tidak dapat membaca riders/'+u.uid+': '+(e.code||e.message),'Semak akses Firebase Rules untuk rekod Rider sendiri.')}
  } else if(role==='admin'){
   try{const s=await timeout(R.db.ref('riders').once('value'));const all=Object.values(s.val()||{}),on=all.filter(x=>x&&x.online===true),stale=on.filter(x=>!Number(x.t)||Date.now()-Number(x.t)>120000);
    if(!on.length)set('gps','warn','Tiada Rider Online untuk dipantau.');
    else if(stale.length)set('gps','bad',stale.length+'/'+on.length+' Rider Online mempunyai GPS lapuk/melebihi 2 minit.','Semak rider yang terjejas dan lokasi terakhir.');
    else set('gps','ok',on.length+' Rider Online; semua timestamp GPS dalam 2 minit.');
   }catch(e){set('gps','bad','Admin gagal membaca senarai Rider: '+(e.code||e.message),'Semak Firebase Rules admin pada /riders.')}
  }else set('gps','na','GPS operasi disemak pada aplikasi Rider dan Admin sahaja.');
 }
 function checkCloud(){
  const c=window.MYRIDERKU_IMAGE_CONFIG||{};
  if(!c.cloudName||!c.uploadPreset||/YOUR_|ISI|PLACEHOLDER/i.test(String(c.cloudName)+' '+String(c.uploadPreset))){set('cloudinary','na','Cloud Name atau Unsigned Upload Preset belum dikonfigurasi.','Isi cloudinary-config.js. Jangan masukkan API Secret dalam frontend.')}
  else set('cloudinary','warn','Konfigurasi Cloud Name dan preset dikesan ('+c.cloudName+'). Upload sebenar tidak diuji kerana ia akan mencipta fail ujian dalam akaun.','Sahkan melalui ujian upload terkawal atau backend; status ini bukan bukti upload berjaya.');
 }
 async function checkWeather(){
  try{const url='https://api.open-meteo.com/v1/forecast?latitude=6.1254&longitude=102.2381&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKuala_Lumpur';
   const r=await timeout(fetch(url,{cache:'no-store'}),8000);if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(!j.current||typeof j.current.temperature_2m!=='number')throw new Error('Respons cuaca tidak lengkap');
   set('weather','ok','API Open-Meteo memberi data semasa Kota Bharu: '+j.current.temperature_2m+'°C; masa data '+j.current.time+'.');
  }catch(e){set('weather','bad','Permintaan cuaca sebenar gagal: '+e.message,'Semak internet, CORS atau ketersediaan Open-Meteo.')}
 }
 function checkNotify(){if(!('Notification'in window)){set('notify','na','Web Notification tidak disokong oleh pelayar.');return}const p=Notification.permission;set('notify',p==='granted'?'ok':p==='denied'?'bad':'warn','Kebenaran notifikasi: '+p+'.',p==='denied'?'Benarkan notifikasi melalui tetapan laman.':'')}
 function checkStorage(){try{const k='__myriderku_health_probe';localStorage.setItem(k,'ok');const v=localStorage.getItem(k);localStorage.removeItem(k);if(v==='ok')set('storage','ok','LocalStorage berjaya tulis dan baca.');else set('storage','bad','Nilai storan tidak sepadan.')}catch(e){set('storage','bad','LocalStorage gagal: '+e.message,'Semak mod privasi atau storage quota.')}}
 function checkClock(){const d=new Date();set('clock','ok','Jam peranti boleh dibaca: '+d.toLocaleString('ms-MY')+'. Semakan beza dengan masa rangkaian tidak dibuat.')}
 async function runAll(){
  if(!$('#myriderkuHealthPanel'))return;lastRun=Date.now();
  const ids=['internet','firebase','auth','gps','cloudinary','weather','notify','storage','clock'];ids.forEach(id=>set(id,'run','Menjalankan ujian…'));
  scanOverlay();const log=$('#hcScanLog');if(log)log.textContent='CHECKING NETWORK • FIREBASE • AUTH • GPS • CLOUD • WEATHER';
  checkAuth();checkCloud();checkNotify();checkStorage();checkClock();
  await Promise.all([checkInternet(),checkFirebase(),checkGps(),checkWeather()]);
  $('#hcTime').textContent='LAST SCAN: '+new Date().toLocaleString('ms-MY');render();
  if(log)log.textContent='SCAN COMPLETE • '+Object.values(state).filter(x=>x.status==='ok').length+' PASS • '+Object.values(state).filter(x=>x.status==='bad').length+' FAIL';
  setTimeout(closeScan,900);
 }
 async function loadMaintenance(){
  if(!R.db){$('#hcMaintStatus').textContent='Firebase tidak tersedia';return}
  try{const s=await timeout(R.db.ref('system/maintenance').once('value'));maintenance=s.val()||maintenance;
   $('#hcMaintStatus').textContent=maintenance.enabled?'AKTIF • '+(maintenance.message||'Penyelenggaraan sedang berjalan'):'Operasi normal';
   $('#hcMaintLamp').className='hc-maint-lamp '+(maintenance.enabled?'on':'off');
   $('#hcMaintMsg').value=maintenance.message||'';
  }catch(e){$('#hcMaintStatus').textContent='Tidak dapat membaca status: '+(e.code||e.message);$('#hcMaintLamp').className='hc-maint-lamp error'}
 }
 async function setMaintenance(enabled){
  if(!admin()){alert('Akses ditolak. Akaun Admin yang disahkan diperlukan.');return}
  if(!R.db){alert('Firebase tidak tersedia.');return}
  const msg=$('#hcMaintMsg').value.trim()||(enabled?'Sistem sedang diselenggara. Sila cuba sebentar lagi.':'');
  const confirmText=enabled?'Aktifkan Maintenance Mode untuk semua pengguna?':'Pulihkan operasi MYRIDERKU sekarang?';
  if(!confirm(confirmText))return;
  const payload={enabled,message:msg,updatedAt:Date.now(),updatedBy:R.auth.currentUser.email};
  try{await timeout(R.db.ref('system/maintenance').set(payload),8000);maintenance=payload;await loadMaintenance();alert(enabled?'Maintenance Mode diaktifkan.':'Operasi dipulihkan.')}
  catch(e){alert('Gagal mengubah Maintenance Mode: '+(e.code||e.message)+'. Firebase Rules mungkin belum membenarkan akses Admin. Tiada perubahan disahkan.')}
 }
 function watchMaintenance(){
  if(!R.db)return;
  try{R.db.ref('system/maintenance').on('value',snap=>{
   const m=snap.val()||{},old=$('#hcMaintenanceNotice');
   if(role==='admin'){return}
   if(m.enabled){
    let n=old;if(!n){n=document.createElement('div');n.id='hcMaintenanceNotice';n.className='hc-maint-notice';document.body.appendChild(n)}
    n.textContent='⚠️ PENYELENGGARAAN MYRIDERKU: '+(m.message||'Sistem sedang diselenggara. Sila cuba sebentar lagi.');
   }else if(old)old.remove();
  },()=>{});
  }catch(e){console.warn('Maintenance status unavailable',e)}
 }
 function addEntry(){if($('#myriderkuHealthLaunch'))return;const b=document.createElement('button');b.id='myriderkuHealthLaunch';b.type='button';b.innerHTML='◈ <span>MISSION CONTROL</span>';b.addEventListener('click',openPanel);document.body.appendChild(b);watchMaintenance()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addEntry);else addEntry();
})();
