/* MYRIDERKU V73: default CERIA + LIGHT; preferences persist across app pages. */
(function(){
  var TK='rkb-theme-v73', SK='rkb-style-v73', d=document.documentElement;
  function mode(){try{return localStorage.getItem(TK)||'light'}catch(e){return 'light'}}
  function style(){try{return localStorage.getItem(SK)||'ceria'}catch(e){return 'ceria'}}
  function apply(){
    d.setAttribute('data-theme',mode()==='dark'?'dark':'light');
    d.setAttribute('data-style',style());
    var m=document.querySelector('meta[name=theme-color]');
    if(m)m.content='#15945b';
  }
  apply();
  window.RKB_THEME={
    mode:mode,
    label:function(){var m=mode();return m==='dark'?'🌙 Tema: Gelap':'☀️ Tema: Cerah'},
    cycle:function(){var n=mode()==='light'?'dark':'light';try{localStorage.setItem(TK,n)}catch(e){}apply();return n}
  };
  window.RKB_STYLE={
    mode:style,
    set:function(v){try{localStorage.setItem(SK,v)}catch(e){}apply()},
    cycle:function(){var n=style()==='ceria'?'klasik':'ceria';try{localStorage.setItem(SK,n)}catch(e){}apply();return n}
  };
  document.addEventListener('DOMContentLoaded',function(){
    var h=document.querySelector('.hd');if(!h||document.getElementById('styBtn'))return;
    var b=document.createElement('button');b.id='styBtn';b.type='button';b.textContent='🎨';
    b.setAttribute('aria-label','Tukar gaya (ceria / klasik)');
    b.onclick=function(){var n=window.RKB_STYLE.cycle();if(window.RKB&&RKB.toast)RKB.toast(n==='ceria'?'Gaya Ceria':'Gaya Klasik')};
    h.appendChild(b);
  });
})();