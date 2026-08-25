/* Custom Close Night confirmation modal */
(function(){
  const btn=document.getElementById('finishNightBtn');
  if(!btn)return;
  const original=btn.onclick;
  if(typeof original!=='function')return;

  const style=document.createElement('style');
  style.textContent=`
    .hdgCloseModal{position:fixed;inset:0;background:rgba(2,6,23,.82);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:220}
    .hdgCloseModal.hidden{display:none!important}
    .hdgCloseCard{width:min(460px,94vw);background:linear-gradient(180deg,#18243a 0%,#0f172a 100%);border:1px solid rgba(248,113,113,.28);border-radius:26px;padding:26px;box-shadow:0 28px 80px rgba(0,0,0,.5);text-align:center}
    .hdgCloseIconWrap{width:74px;height:74px;margin:0 auto 14px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,.12);border:1px solid rgba(248,113,113,.24)}
    .hdgCloseIcon{font-size:38px;line-height:1}
    .hdgCloseTitle{font-size:27px;font-weight:900;letter-spacing:.2px;margin-bottom:8px}
    .hdgCloseText{color:#cbd5e1;font-size:15px;line-height:1.55;margin:0 auto 18px;max-width:360px}
    .hdgCloseNote{background:rgba(15,23,42,.7);border:1px solid rgba(148,163,184,.14);border-radius:14px;padding:11px 13px;color:#94a3b8;font-size:13px;margin-bottom:20px}
    .hdgCloseActions{display:grid;grid-template-columns:1fr 1.15fr;gap:10px}
    .hdgCloseActions button{margin:0;min-height:46px;font-weight:900;border-radius:13px}
    @media(max-width:420px){.hdgCloseActions{grid-template-columns:1fr}.hdgCloseCard{padding:22px}}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.className='hdgCloseModal hidden';
  modal.innerHTML=`<div class="hdgCloseCard" role="dialog" aria-modal="true" aria-label="Close night confirmation">
    <div class="hdgCloseIconWrap"><div class="hdgCloseIcon">🏁</div></div>
    <div class="hdgCloseTitle">Finish the night?</div>
    <div class="hdgCloseText">The current night will be saved to <strong>Old Nights</strong> and the active session will be closed.</div>
    <div class="hdgCloseNote">Your game history, winners and money summary will be kept.</div>
    <div class="hdgCloseActions">
      <button class="secondary" data-cancel>KEEP PLAYING</button>
      <button class="red" data-confirm>FINISH & SAVE</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  function hide(){modal.classList.add('hidden')}
  btn.onclick=function(e){if(e)e.preventDefault();modal.classList.remove('hidden')};
  modal.querySelector('[data-cancel]').onclick=hide;
  modal.addEventListener('click',e=>{if(e.target===modal)hide()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))hide()});
  modal.querySelector('[data-confirm]').onclick=async()=>{
    hide();
    const oldConfirm=window.confirm;
    try{
      window.confirm=()=>true;
      await original.call(btn);
    }finally{
      window.confirm=oldConfirm;
    }
  };
})();
