/* Old Nights top counter: show number of saved nights, not total games. */
(function(){
  function updateOldNightsCount(){
    const tab=document.getElementById('oldNightsTab');
    if(!tab||tab.classList.contains('hidden'))return;

    const list=document.getElementById('oldNightsList');
    const chip=document.querySelector('#mainApp .topbar .chip');
    if(!list||!chip)return;

    const nights=list.querySelectorAll('.archiveItem').length;
    chip.setAttribute('dir','rtl');
    chip.innerHTML=`סה"כ ערבי פוקר: <span id="gamesTop" dir="ltr">${nights}</span>`;
  }

  const previous=window.loadOldNights;
  if(typeof previous==='function'){
    window.loadOldNights=async function(){
      const result=await previous.apply(this,arguments);
      updateOldNightsCount();
      return result;
    };
  }

  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.dataset.tab==='oldNightsTab')setTimeout(updateOldNightsCount,0);
    });
  });

  const oldNightsBtn=document.getElementById('oldNightsBtn');
  if(oldNightsBtn)oldNightsBtn.addEventListener('click',()=>setTimeout(updateOldNightsCount,0));
})();
