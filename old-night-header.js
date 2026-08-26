/* Hebrew Old Nights page + historical games total in the top counter. */
(function(){
  function setArchiveHeader(active){
    const games=document.querySelector('#mainApp .topbar .chip');
    const room=document.getElementById('roomTop');
    if(games)games.style.display='';
    if(room)room.style.display=active?'none':'';
  }

  function translateStaticArchive(){
    const tab=document.getElementById('oldNightsTab');
    if(!tab)return;
    tab.setAttribute('dir','rtl');
    const firstCard=tab.querySelector(':scope > .card');
    if(firstCard){
      const title=firstCard.querySelector('h2');
      if(title)title.textContent='ערבים קודמים';
      const sub=firstCard.querySelector('.muted');
      if(sub)sub.textContent='הערבים נשמרים וזמינים מכל מכשיר עם אותו קוד כניסה.';
    }
    const newNight=document.getElementById('newNightFromArchiveBtn');
    if(newNight)newNight.textContent='ערב חדש';
  }

  function translateArchiveListAndCount(){
    const list=document.getElementById('oldNightsList');
    if(!list)return;
    let totalGames=0;

    list.querySelectorAll('.archiveItem').forEach(item=>{
      const meta=item.querySelector('.archiveHead .muted');
      if(meta){
        const match=meta.textContent.trim().match(/^(\d+)\s+games\s*·\s*(\d+)\s+players/i);
        if(match){
          const games=Number(match[1])||0;
          const players=Number(match[2])||0;
          totalGames+=games;
          meta.textContent=`${games} משחקים · ${players} שחקנים`;
        }else{
          const heMatch=meta.textContent.trim().match(/^(\d+)\s+משחקים\s*·\s*(\d+)\s+שחקנים/);
          if(heMatch)totalGames+=Number(heMatch[1])||0;
        }
      }

      const del=item.querySelector('[data-delete]');
      if(del)del.textContent='מחק';
      const details=item.querySelector('[data-details]');
      if(details)details.textContent='פתח סטטיסטיקה מלאה';
      const share=item.querySelector('[data-share]');
      if(share)share.textContent='שתף JPG';
      const copy=item.querySelector('[data-copy]');
      if(copy)copy.textContent='העתק JPG';
    });

    const muted=list.querySelector(':scope > .card .muted');
    if(muted){
      const text=muted.textContent.trim();
      if(text==='Loading...')muted.textContent='טוען...';
      if(text==='No saved nights yet.')muted.textContent='אין ערבים שמורים עדיין.';
    }

    const gamesTop=document.getElementById('gamesTop');
    if(gamesTop)gamesTop.textContent=String(totalGames);
  }

  translateStaticArchive();

  const originalLoadOldNights=window.loadOldNights;
  if(typeof originalLoadOldNights==='function'){
    window.loadOldNights=async function(){
      setArchiveHeader(true);
      translateStaticArchive();
      const result=await originalLoadOldNights.apply(this,arguments);
      translateArchiveListAndCount();
      return result;
    };
  }

  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      setTimeout(()=>{
        const isArchive=btn.dataset.tab==='oldNightsTab';
        setArchiveHeader(isArchive);
        if(isArchive){
          translateStaticArchive();
          translateArchiveListAndCount();
        }
      },0);
    });
  });

  const oldNightsBtn=document.getElementById('oldNightsBtn');
  if(oldNightsBtn){
    oldNightsBtn.addEventListener('click',()=>setTimeout(()=>{
      setArchiveHeader(true);
      translateStaticArchive();
    },0));
  }

  const newNightBtn=document.getElementById('newNightFromArchiveBtn');
  if(newNightBtn){
    newNightBtn.addEventListener('click',()=>setTimeout(()=>setArchiveHeader(false),0));
  }
})();
