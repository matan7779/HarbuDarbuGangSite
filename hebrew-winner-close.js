/* Hebrew winner + close night + top counters. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #roomTop{display:inline-flex;align-items:center;gap:5px;direction:rtl}
    #roomTop .roomCodeText{direction:ltr;unicode-bidi:isolate}
    #closeTab{direction:rtl}
    #closeTab> .card{text-align:right}
    #closeTab #closeGamesCard{text-align:center}
    #closeGamesCard .closeGamesNumber{font-size:30px;font-weight:900;line-height:1.1}
    #closeGamesCard .closeGamesLabel{margin-top:5px;font-size:15px;color:var(--muted)}
    #closeSummary th,#closeSummary td{text-align:right}
    #closeSummary th:last-child,#closeSummary td:last-child{direction:ltr;unicode-bidi:isolate;text-align:right}
  `;
  document.head.appendChild(style);

  function roomCode(){
    try{return (typeof state!=='undefined'&&state&&state.room)?state.room:'—';}catch(e){return '—';}
  }

  function updateRoom(){
    const room=document.getElementById('roomTop');
    if(!room)return;
    room.innerHTML='<span>חדר</span><span class="roomCodeText">'+roomCode()+'</span>';
  }

  function updateTopGamesLabel(){
    const gamesTop=document.getElementById('gamesTop');
    if(!gamesTop||!gamesTop.parentElement)return;
    Array.from(gamesTop.parentElement.childNodes).forEach(node=>{
      if(node.nodeType===3)node.textContent=' סה"כ משחקים';
    });
  }

  const previousUpdateTop=window.updateTop;
  if(typeof previousUpdateTop==='function'){
    window.updateTop=function(){
      const result=previousUpdateTop.apply(this,arguments);
      updateRoom();
      updateTopGamesLabel();
      updateCloseGames();
      return result;
    };
  }
  updateRoom();
  updateTopGamesLabel();

  // Winner selection screen + full-screen celebration.
  const winnerTitle=document.querySelector('#winnerView h2');
  if(winnerTitle)winnerTitle.textContent='בחר מנצח/ים';
  const winnerHelp=document.querySelector('#winnerView .muted');
  if(winnerHelp)winnerHelp.textContent='ניתן לבחור יותר משחקן אחד לחלוקת הקופה.';
  const saveWinner=document.getElementById('saveWinnerBtn');
  if(saveWinner)saveWinner.textContent='שמור תוצאה';
  const winnerBack=document.getElementById('winnerBackBtn');
  if(winnerBack)winnerBack.textContent='חזרה';
  const celebrationLabel=document.querySelector('#celebration .cup + div');
  if(celebrationLabel)celebrationLabel.textContent='מנצח';
  const continueBtn=document.getElementById('continueBtn');
  if(continueBtn)continueBtn.textContent='המשך';

  // Close Night page.
  const closeTab=document.getElementById('closeTab');
  let closeGamesValue=null;
  if(closeTab){
    const cards=closeTab.querySelectorAll(':scope > .card');
    if(cards[0]){
      const title=cards[0].querySelector('h2');
      if(title)title.textContent='סיום הערב';
      const sub=cards[0].querySelector('.muted');
      if(sub)sub.textContent='בדוק את הסיכום, שתף במידת הצורך ושמור את הערב.';

      if(!document.getElementById('closeGamesCard')){
        const gamesCard=document.createElement('div');
        gamesCard.id='closeGamesCard';
        gamesCard.className='card';
        gamesCard.innerHTML='<div class="closeGamesNumber" id="closeGamesValue">0</div><div class="closeGamesLabel">סה"כ משחקים</div>';
        cards[0].insertAdjacentElement('afterend',gamesCard);
      }
    }
    const summaryTitle=closeTab.querySelector('#closeSummary')?.parentElement?.querySelector('h2');
    if(summaryTitle)summaryTitle.textContent='סיכום';
    const share=document.getElementById('shareWhatsAppBtn');
    if(share)share.textContent='שלח JPG לוואטסאפ';
    const finish=document.getElementById('finishNightBtn');
    if(finish)finish.textContent='סיים ערב ושמור';
    closeGamesValue=document.getElementById('closeGamesValue');
  }

  function updateCloseGames(){
    if(!closeGamesValue)closeGamesValue=document.getElementById('closeGamesValue');
    if(!closeGamesValue)return;
    try{closeGamesValue.textContent=(typeof state!=='undefined'&&state&&Array.isArray(state.games))?state.games.length:0;}catch(e){closeGamesValue.textContent='0';}
  }

  function translateCloseSummary(){
    const summary=document.getElementById('closeSummary');
    if(!summary)return;
    summary.querySelectorAll('th').forEach(th=>{
      const t=th.textContent.trim();
      if(t==='Player')th.textContent='שחקן';
      if(t==='Result'||t==='תוצאה')th.textContent='סכום';
      if(t==='Rebuys')th.textContent='ריבאיים';
    });
  }

  const previousRenderClose=window.renderClose;
  if(typeof previousRenderClose==='function'){
    window.renderClose=function(){
      const result=previousRenderClose.apply(this,arguments);
      updateCloseGames();
      translateCloseSummary();
      return result;
    };
  }
  updateCloseGames();
  translateCloseSummary();

  function setTopGamesVisibleForTab(tabId){
    const chip=document.querySelector('#mainApp .topbar .chip');
    if(chip)chip.style.display=tabId==='closeTab'?'none':'';
  }
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>setTimeout(()=>{
      setTopGamesVisibleForTab(btn.dataset.tab);
      if(btn.dataset.tab==='closeTab')updateCloseGames();
    },0));
  });

  // Translate the custom finish confirmation modal, which is created by close-night-modal.js.
  const modal=document.querySelector('.hdgCloseModal');
  if(modal){
    const card=modal.querySelector('.hdgCloseCard');
    if(card)card.setAttribute('dir','rtl');
    const title=modal.querySelector('.hdgCloseTitle');
    if(title)title.textContent='לסיים את הערב?';
    const text=modal.querySelector('.hdgCloseText');
    if(text)text.textContent='הערב הנוכחי יישמר בערבים קודמים והמשחק הפעיל ייסגר.';
    const note=modal.querySelector('.hdgCloseNote');
    if(note)note.textContent='היסטוריית המשחקים, המנצחים וסיכום הכספים יישמרו.';
    const cancel=modal.querySelector('[data-cancel]');
    if(cancel)cancel.textContent='המשך לשחק';
    const confirm=modal.querySelector('[data-confirm]');
    if(confirm)confirm.textContent='סיים ושמור';
    const dialog=modal.querySelector('[role="dialog"]');
    if(dialog)dialog.setAttribute('aria-label','אישור סיום הערב');
  }
})();
