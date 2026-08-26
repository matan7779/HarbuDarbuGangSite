/* Hebrew Old Nights page + historical games total in the top counter. */
(function(){
  const RULE_HE={
    '2 Boards':'2 בורדים',
    '1 Board Stronger':'הבורד החזק לוקח',
    'Open / Close / Open Cards':'פתוח / סגור / קלפים פתוחים',
    'Insert 3 Cards':'מכניסים 3 קלפים',
    'Shared Card':'קלף משותף',
    '7 Boom':'7 בום',
    'Regular':'רגיל'
  };

  function setArchiveHeader(active){
    const games=document.querySelector('#mainApp .topbar .chip');
    const room=document.getElementById('roomTop');
    if(games){
      games.style.display='';
      games.setAttribute('dir','rtl');
      const gamesTop=document.getElementById('gamesTop');
      if(gamesTop){
        Array.from(games.childNodes).forEach(node=>{if(node.nodeType===3)node.textContent=' סה"כ משחקים';});
      }
    }
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
      if(copy)copy.textContent='העתק תמונה';
    });

    const muted=list.querySelector(':scope > .card .muted');
    if(muted){
      const text=muted.textContent.trim();
      if(text==='Loading...')muted.textContent='טוען...';
      if(text==='No saved nights yet.')muted.textContent='אין ערבים שמורים עדיין.';
    }

    const gamesTop=document.getElementById('gamesTop');
    if(gamesTop)gamesTop.textContent=String(totalGames);
    setArchiveHeader(true);
  }

  function replaceText(el,from,to){if(el&&el.textContent.trim()===from)el.textContent=to;}

  function translateFullStatsOverlay(){
    const overlay=document.getElementById('nightDetailsOverlay');
    if(!overlay||overlay.classList.contains('hidden'))return;
    overlay.setAttribute('dir','rtl');

    const header=overlay.querySelector('.nightOverlayHeader');
    if(header){
      const meta=header.querySelector('.muted');
      if(meta){
        const m=meta.textContent.trim().match(/^(\d+)\s+games\s*·\s*(\d+)\s+players/i);
        if(m)meta.textContent=`${m[1]} משחקים · ${m[2]} שחקנים`;
      }
      const close=document.getElementById('closeNightOverlay');
      if(close)close.textContent='סגור';
    }

    overlay.querySelectorAll('.fullStatsCard h2').forEach(h=>{
      const t=h.textContent.trim();
      if(t==='Night Stats')h.textContent='סטטיסטיקות הערב';
      else if(t==='Money Summary')h.textContent='סיכום כספי';
      else if(t==='Wins')h.textContent='ניצחונות';
      else if(t==='Game Types')h.textContent='סוגי משחקים';
      else if(/^Game History \(\d+\)$/.test(t))h.textContent=t.replace('Game History','היסטוריית משחקים');
    });

    overlay.querySelectorAll('.stat').forEach(stat=>{
      Array.from(stat.childNodes).forEach(node=>{
        if(node.nodeType!==3)return;
        const t=node.textContent.trim();
        if(t==='Games')node.textContent=' משחקים';
        if(t==='Players')node.textContent=' שחקנים';
      });
    });

    overlay.querySelectorAll('th').forEach(th=>{
      const t=th.textContent.trim();
      if(t==='Player')th.textContent='שחקן';
      if(t==='Result')th.textContent='סכום';
    });

    overlay.querySelectorAll('.muted').forEach(el=>{
      const t=el.textContent.trim();
      if(t==='No winners recorded.')el.textContent='לא נרשמו מנצחים.';
      else if(t==='No games')el.textContent='אין משחקים';
      else if(t==='No games.')el.textContent='אין משחקים.';
      else{
        let translated=t;
        Object.entries(RULE_HE).forEach(([en,he])=>{translated=translated.split(en).join(he);});
        if(translated!==t)el.textContent=translated;
      }
    });

    overlay.querySelectorAll('.archiveMetaStrong').forEach(el=>{
      if(el.textContent.trim().startsWith('Winner:'))el.textContent=el.textContent.replace(/^Winner:/,'מנצח:');
    });

    replaceText(document.getElementById('shareOldNight'),'SHARE JPG','שתף JPG');
    replaceText(document.getElementById('copyOldNight'),'COPY JPG','העתק תמונה');
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

  const list=document.getElementById('oldNightsList');
  if(list){
    list.addEventListener('click',e=>{
      if(e.target.closest('[data-details]'))setTimeout(translateFullStatsOverlay,0);
    });
  }

  const newNightBtn=document.getElementById('newNightFromArchiveBtn');
  if(newNightBtn){
    newNightBtn.addEventListener('click',()=>setTimeout(()=>setArchiveHeader(false),0));
  }
})();
