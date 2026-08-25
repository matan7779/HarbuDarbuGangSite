/* Nice warning when starting a night with fewer than 2 players */
(function(){
  const btn=document.getElementById('startNightBtn');
  if(!btn || typeof btn.onclick!=='function')return;
  const original=btn.onclick;

  const style=document.createElement('style');
  style.textContent=`
    .hdgPlayerWarn{position:fixed;inset:0;background:rgba(2,6,23,.78);display:flex;align-items:center;justify-content:center;padding:20px;z-index:260}
    .hdgPlayerWarnCard{width:min(420px,94vw);background:linear-gradient(180deg,#172033,#0f172a);border:1px solid rgba(148,163,184,.22);border-radius:22px;padding:24px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.45)}
    .hdgPlayerWarnIcon{font-size:44px;margin-bottom:8px}
    .hdgPlayerWarnTitle{font-size:24px;font-weight:900;margin-bottom:8px}
    .hdgPlayerWarnText{color:#cbd5e1;font-size:14px;line-height:1.5;margin-bottom:18px}
    .hdgPlayerWarnCard button{margin:0}
  `;
  document.head.appendChild(style);

  function showWarning(){
    const old=document.getElementById('hdgPlayerWarn');if(old)old.remove();
    const box=document.createElement('div');box.id='hdgPlayerWarn';box.className='hdgPlayerWarn';
    box.innerHTML=`<div class="hdgPlayerWarnCard"><div class="hdgPlayerWarnIcon">👥</div><div class="hdgPlayerWarnTitle">Select more players</div><div class="hdgPlayerWarnText">You need at least 2 players to start a night.</div><button class="primary" data-close>OK</button></div>`;
    document.body.appendChild(box);
    box.querySelector('[data-close]').onclick=()=>box.remove();
    box.addEventListener('click',e=>{if(e.target===box)box.remove()});
  }

  btn.onclick=function(e){
    if(typeof state!=='undefined' && Array.isArray(state.players) && state.players.length<2){
      if(e)e.preventDefault();
      showWarning();
      return;
    }
    return original.call(this,e);
  };
})();
