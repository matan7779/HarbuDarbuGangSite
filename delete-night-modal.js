/* Nice delete confirmation for Old Nights on the controller/main site only. */
(function(){
  let approvedButton=null;

  const style=document.createElement('style');
  style.textContent=`
    .hdgDeleteModal{position:fixed;inset:0;background:rgba(2,6,23,.78);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:260}
    .hdgDeleteModal.hidden{display:none!important}
    .hdgDeleteCard{width:min(430px,94vw);background:linear-gradient(180deg,#1b2435,#0f172a);border:1px solid rgba(248,113,113,.28);border-radius:24px;padding:26px;text-align:center;box-shadow:0 26px 80px rgba(0,0,0,.5)}
    .hdgDeleteIcon{width:64px;height:64px;border-radius:18px;margin:0 auto 13px;display:flex;align-items:center;justify-content:center;font-size:34px;background:rgba(239,68,68,.12);border:1px solid rgba(248,113,113,.25)}
    .hdgDeleteTitle{font-size:25px;font-weight:900;margin-bottom:8px}
    .hdgDeleteText{color:#cbd5e1;font-size:14px;line-height:1.55;margin-bottom:20px}
    .hdgDeleteActions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .hdgDeleteActions button{margin:0}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.id='hdgDeleteModal';
  modal.className='hdgDeleteModal hidden';
  modal.innerHTML=`<div class="hdgDeleteCard">
    <div class="hdgDeleteIcon">🗑️</div>
    <div class="hdgDeleteTitle">Delete this night?</div>
    <div class="hdgDeleteText">This will permanently remove the saved night from Old Nights. This action cannot be undone.</div>
    <div class="hdgDeleteActions">
      <button class="secondary" data-cancel>CANCEL</button>
      <button class="red" data-delete>DELETE NIGHT</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  function close(){approvedButton=null;modal.classList.add('hidden')}
  modal.querySelector('[data-cancel]').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))close()});

  modal.querySelector('[data-delete]').onclick=()=>{
    const btn=approvedButton;
    if(!btn)return close();
    modal.classList.add('hidden');
    approvedButton=null;
    btn.dataset.hdgDeleteApproved='1';
    const oldConfirm=window.confirm;
    try{
      window.confirm=()=>true;
      btn.click();
    }finally{
      window.confirm=oldConfirm;
      delete btn.dataset.hdgDeleteApproved;
    }
  };

  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');
    if(!btn)return;
    if(btn.dataset.hdgDeleteApproved==='1')return;
    const text=(btn.textContent||'').trim().toLowerCase();
    if(text!=='delete'&&text!=='delete night')return;
    const oldArea=btn.closest('#oldNightsTab, #nightDetailsOverlay, .nightOverlay, #archiveList, #oldNightsList');
    if(!oldArea)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    approvedButton=btn;
    modal.classList.remove('hidden');
  },true);
})();
