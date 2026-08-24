/* Harbu Darbu Gang - tab availability + hover states */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    button:not(:disabled), .tab:not(:disabled){transition:background-color .16s ease,filter .16s ease,transform .08s ease,opacity .16s ease}
    button:not(:disabled):hover{filter:brightness(1.18)}
    .tab:not(:disabled):hover{background:#3b4a60;color:#fff}
    .tab.active:not(:disabled):hover{filter:brightness(1.08)}
    .tab.closer:not(:disabled):hover{background:#dc2626;color:#fff}
    button:disabled,.tab:disabled{opacity:.32!important;cursor:not-allowed!important;filter:none!important;transform:none!important}
    .tab.closer:disabled{background:#263244!important;color:#94a3b8!important}
  `;
  document.head.appendChild(style);

  function hasActiveNight(){
    try{return !!(window.state && Array.isArray(state.players) && state.players.length>=2 && state.room)}catch(e){return false}
  }

  function refreshTabAvailability(activeId){
    const active=hasActiveNight();
    document.querySelectorAll('.tab').forEach(btn=>{
      const id=btn.dataset.tab;
      const needsNight=['gameTab','moneyTab','statsTab','closeTab'].includes(id);
      btn.disabled=needsNight && !active;
      if(btn.disabled)btn.classList.remove('active');
    });
    if(activeId){
      document.querySelectorAll('.tab').forEach(btn=>btn.classList.toggle('active',!btn.disabled && btn.dataset.tab===activeId));
    }
  }

  const originalActivateTab=window.activateTab;
  if(originalActivateTab){
    window.activateTab=function(id){
      refreshTabAvailability();
      const btn=document.querySelector(`.tab[data-tab="${id}"]`);
      if(btn && btn.disabled)return;
      originalActivateTab(id);
      refreshTabAvailability(id);
    };
  }

  const originalShowScreen=window.showScreen;
  if(originalShowScreen){
    window.showScreen=function(id){
      originalShowScreen(id);
      if(id==='mainApp')setTimeout(()=>refreshTabAvailability(),0);
    };
  }

  const finish=document.getElementById('finishNightBtn');
  if(finish){
    const old=finish.onclick;
    finish.onclick=async function(e){
      if(old)await old.call(this,e);
      setTimeout(()=>refreshTabAvailability('oldNightsTab'),0);
    };
  }

  const oldBtn=document.getElementById('oldNightsBtn');
  if(oldBtn){
    const old=oldBtn.onclick;
    oldBtn.onclick=function(e){
      if(old)old.call(this,e);
      setTimeout(()=>refreshTabAvailability('oldNightsTab'),0);
    };
  }

  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>setTimeout(()=>refreshTabAvailability(btn.dataset.tab),0));
  });

  refreshTabAvailability();
})();
