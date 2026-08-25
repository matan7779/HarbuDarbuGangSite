/* Custom Close Night confirmation modal */
(function(){
  const btn=document.getElementById('finishNightBtn');
  if(!btn)return;
  const original=btn.onclick;
  if(typeof original!=='function')return;

  const style=document.createElement('style');
  style.textContent=`
    .hdgCloseModal{position:fixed;inset:0;background:rgba(2,6,23,.78);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:200}
    .hdgCloseModal.hidden{display:none!important}
    .hdgCloseCard{width:min(430px,94vw);background:linear-gradient(180deg,#162033,#0f172a);border:1px solid rgba(148,163,184,.22);border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.45);text-align:center}
    .hdgCloseIcon{font-size:42px;margin-bottom:8px}
    .hdgCloseTitle{font-size:25px;font-weight:900;margin-bottom:8px}
    .hdgCloseText{color:#cbd5e1;font-size:14px;line-height:1.5;margin-bottom:20px}
    .hdgCloseActions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .hdgCloseActions button{margin:0}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.className='hdgCloseModal hidden';
  modal.innerHTML=`<div class="hdgCloseCard">
    <div class="hdgCloseIcon">🏁</div>
    <div class="hdgCloseTitle">Close this night?</div>
    <div class="hdgCloseText">This will save the night to Old Nights and end the current session.</div>
    <div class="hdgCloseActions">
      <button class="secondary" data-cancel>CANCEL</button>
      <button class="red" data-confirm>FINISH & SAVE</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  btn.onclick=function(e){
    if(e)e.preventDefault();
    modal.classList.remove('hidden');
  };

  modal.querySelector('[data-cancel]').onclick=()=>modal.classList.add('hidden');
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
  modal.querySelector('[data-confirm]').onclick=async()=>{
    modal.classList.add('hidden');
    const oldConfirm=window.confirm;
    try{
      window.confirm=()=>true;
      await original.call(btn);
    }finally{
      window.confirm=oldConfirm;
    }
  };
})();
