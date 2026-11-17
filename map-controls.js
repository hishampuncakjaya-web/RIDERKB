/* MYRIDERKU V88 map controls: consistent zoom, double-tap and fullscreen for Leaflet maps. */
(function(){
  if(!window.L) return;
  const attached=new WeakSet();
  function enhanceMap(map){
    if(!map||attached.has(map)) return; attached.add(map);
    try{map.doubleClickZoom.enable();map.touchZoom.enable();map.scrollWheelZoom.enable();map.boxZoom.enable();}catch(_){}
    const C=L.Control.extend({options:{position:'topright'},onAdd:function(){
      const wrap=L.DomUtil.create('div','leaflet-bar myr-map-tools');
      const b=L.DomUtil.create('button','myr-map-fullscreen',wrap); b.type='button'; b.title='Buka peta skrin penuh'; b.setAttribute('aria-label','Buka peta skrin penuh'); b.textContent='⛶';
      L.DomEvent.disableClickPropagation(wrap); L.DomEvent.disableScrollPropagation(wrap);
      let placeholder=null, oldParent=null, oldNext=null;
      function resize(){[50,180,450].forEach(t=>setTimeout(()=>{try{map.invalidateSize({pan:false})}catch(_){}},t));}
      function close(){const el=map.getContainer();el.classList.remove('myr-map-full');if(placeholder&&placeholder.parentNode){placeholder.parentNode.insertBefore(el,placeholder);placeholder.remove()}placeholder=null;document.body.classList.remove('myr-map-lock');b.textContent='⛶';b.title='Buka peta skrin penuh';resize()}
      b.addEventListener('click',function(){const el=map.getContainer();if(el.classList.contains('myr-map-full')){close();return} oldParent=el.parentNode;oldNext=el.nextSibling;placeholder=document.createElement('div');placeholder.style.height=Math.max(el.offsetHeight,280)+'px';placeholder.className='myr-map-placeholder';oldParent.insertBefore(placeholder,el);document.body.appendChild(el);el.classList.add('myr-map-full');document.body.classList.add('myr-map-lock');b.textContent='✕';b.title='Keluar skrin penuh';resize()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&map.getContainer().classList.contains('myr-map-full'))close()});
      map.on('unload',close);return wrap;
    }});
    map.addControl(new C());
    const el=map.getContainer();
    let last=0; el.addEventListener('touchend',e=>{if(e.touches&&e.touches.length) return;const now=Date.now();if(now-last<320){const t=e.changedTouches&&e.changedTouches[0];if(t){const p=map.mouseEventToContainerPoint({clientX:t.clientX,clientY:t.clientY});map.setZoomAround(p,Math.min(map.getZoom()+1,map.getMaxZoom()),{animate:true});e.preventDefault()}}last=now},{passive:false});
  }
  L.Map.addInitHook(function(){const map=this;map.whenReady(()=>enhanceMap(map));});
  function scan(){document.querySelectorAll('.leaflet-container').forEach(el=>{const id=el._leaflet_id; if(!id)return; /* Maps created before this helper are handled by their page-specific controls. */})}
  scan();
})();
