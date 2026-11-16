/* Tema: auto / cerah / gelap. Dimuat dalam <head> supaya tiada kelip. */
(function(){
  var K='rkb-theme', d=document.documentElement;
  function get(){ try{ return localStorage.getItem(K)||'auto' }catch(e){ return 'auto' } }
  function eff(m){ return m==='auto' ? (matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark') : m }
  function apply(){ var m=get(), e=eff(m); d.setAttribute('data-theme',e); var t=document.querySelector('meta[name=theme-color]'); if(t&&!t.dataset.orig) t.dataset.orig=t.content; if(t) t.content=e==='light'?'#f4faf5':(t.dataset.orig||t.content) }
  apply();
  try{ matchMedia('(prefers-color-scheme: light)').addEventListener('change',function(){ if(get()==='auto') apply() }) }catch(e){}
  window.RKB_THEME={
    mode:get,
    label:function(){ var m=get(); return m==='light'?'☀️ Tema: Cerah':m==='dark'?'🌙 Tema: Gelap':'🌓 Tema: Auto' },
    cycle:function(){ var m=get(), n=m==='auto'?'light':m==='light'?'dark':'auto'; try{ localStorage.setItem(K,n) }catch(e){} apply(); return n }
  };
})();

/* Gaya: ceria (lalai) / klasik. Butang 🎨 dalam header. */
(function(){
  var K='rkb-style', d=document.documentElement;
  function get(){ try{ return localStorage.getItem(K)||'ceria' }catch(e){ return 'ceria' } }
  function set(v){ d.setAttribute('data-style',v); try{ localStorage.setItem(K,v) }catch(e){} }
  d.setAttribute('data-style',get());
  window.RKB_STYLE={mode:get,set:set};
  document.addEventListener('DOMContentLoaded',function(){
    var h=document.querySelector('.hd'); if(!h||document.getElementById('styBtn')) return;
    var b=document.createElement('button'); b.id='styBtn'; b.type='button'; b.textContent='🎨'; b.setAttribute('aria-label','Tukar gaya (ceria / klasik)');
    b.onclick=function(){ var n=get()==='ceria'?'klasik':'ceria'; set(n); if(window.RKB&&RKB.toast) RKB.toast(n==='ceria'?'Gaya Ceria 🎉':'Gaya Klasik'); };
    h.appendChild(b);
  });
})();
