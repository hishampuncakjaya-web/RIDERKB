/* Tema: auto / cerah / gelap. Dimuat dalam <head> supaya tiada kelip. */
(function(){
  var K='rkb-theme', d=document.documentElement;
  function get(){ try{ return localStorage.getItem(K)||'auto' }catch(e){ return 'auto' } }
  function eff(m){ return m==='auto' ? (matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark') : m }
  function apply(){ var m=get(), e=eff(m); d.setAttribute('data-theme',e); var t=document.querySelector('meta[name=theme-color]'); if(t&&!t.dataset.orig) t.dataset.orig=t.content; if(t) t.content=e==='light'?'#fbf6ee':(t.dataset.orig||t.content) }
  apply();
  try{ matchMedia('(prefers-color-scheme: light)').addEventListener('change',function(){ if(get()==='auto') apply() }) }catch(e){}
  window.RKB_THEME={
    mode:get,
    label:function(){ var m=get(); return m==='light'?'☀️ Tema: Cerah':m==='dark'?'🌙 Tema: Gelap':'🌓 Tema: Auto' },
    cycle:function(){ var m=get(), n=m==='auto'?'light':m==='light'?'dark':'auto'; try{ localStorage.setItem(K,n) }catch(e){} apply(); return n }
  };
})();
