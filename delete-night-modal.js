/* Styled Hebrew delete confirmation for Old Nights. */
(function(){
  let approvedButton=null;

  const style=document.createElement('style');
  style.textContent=`
    .hdgDeleteModal{position:fixed;inset:0;background:rgba(2,6,23,.84);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:260}
    .hdgDeleteModal.hidden{display:none!important}
    .hdgDeleteCard{width:min(440px,94vw);background:linear-gradient(180deg,#1b2639 0%,#0f172a 100%);border:1px solid rgba(248,113,113,.3);border-radius:28px;padding:28px 24px 24px;text-align:center;box-shadow:0 30px 90px rgba(0,0,0,.58);direction:rtl}
    .hdgDeleteIcon{width:76px;height:76px;border-radius:22px;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;font-size:39px;background:linear-gradient(180deg,rgba(239,68,68,.17),rgba(127,29,29,.14));border:1px solid rgba(248,113,113,.28);box-shadow:0 12px 30px rgba(127,29,29,.2)}
    .hdgDeleteTitle{font-size:28px;font-weight:900;margin-bottom:8px}
    .hdgDeleteText{color:#d7e0ec;font-size:15px;line-height:1.6;margin:0 auto 14px;max-width:355px}
    .hdgDeleteNight{display:none;background:rgba(15,23,42,.72);border:1px solid rgba(148,163,184,.16);border-radius:14px;padding:10px 12px;color:#f8fafc;font-size:14px;font-weight:800;margin:0 auto 16px}
    .hdgDeleteWarning{color:#fca5a5;font-size:13px;line-height:1.45;margin-bottom:20px}
    .hdgDeleteActions{display:grid;grid-template-columns:1fr 1.08fr;gap:10px}
    .hdgDeleteActions button{margin:0;min-height:48px;border-radius:14px;font-weight:900}
    @media(max-width:420px){.hdgDeleteActions{grid-template-columns:1fr}.hdgDeleteCard{padding:24px 20px}}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.id='hdgDeleteModal';
  modal.className='hdgDeleteModal hidden';
  modal.innerHTML=`<div class="hdgDeleteCard" role="dialog" aria-modal="true" aria-label="אישור מחיקת ערב">
    <div class="hdgDeleteIcon">🗑️</div>
    <div class="hdgDeleteTitle">למחוק את הערב?</div>
    <div class="hdgDeleteText">הערב השמור יימחק לצמיתות מרשימת הערבים הקודמים.</div>
    <div class="hdgDeleteNight" data-night></div>
    <div class="hdgDeleteWarning">לא ניתן לבטל את הפעולה לאחר המחיקה.</div>
    <div class="hdgDeleteActions">
      <button class="secondary" data-cancel>ביטול</button>
      <button class="red" data-delete-confirm>מחק לילה</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  function close(){approvedButton=null;modal.classList.add('hidden')}
  modal.querySelector('[data-cancel]').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))close()});

  modal.querySelector('[data-delete-confirm]').onclick=()=>{
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

  function showFor(btn){
    approvedButton=btn;
    const night=modal.querySelector('[data-night]');
    const date=btn.closest('.archiveItem')?.querySelector('.archiveHead div[style*="font-weight:900"]')?.textContent?.trim()||'';
    if(date){night.textContent='ערב מתאריך '+date;night.style.display='block';}
    else{night.textContent='';night.style.display='none';}
    modal.classList.remove('hidden');
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');
    if(!btn||btn.dataset.hdgDeleteApproved==='1')return;
    const text=(btn.textContent||'').trim().toLowerCase();
    const isDelete=btn.matches('[data-delete]')||text==='delete'||text==='delete night'||text==='מחק'||text==='מחק לילה';
    if(!isDelete)return;
    const oldArea=btn.closest('#oldNightsTab, #nightDetailsOverlay, .nightOverlay, #archiveList, #oldNightsList');
    if(!oldArea)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showFor(btn);
  },true);
})();
