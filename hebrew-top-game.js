/* Hebrew top header + compact game selection + Hebrew rule display. */
(function(){
  const RULE_HE={
    twoBoards:'2 לוחות',
    strongBoard:'לוח אחד חזק יותר',
    chiketOpenCloseOpen:'פתוח / סגור / קלפים פתוחים',
    insert3:'הוסף 3 קלפים',
    sharedCard:'קלף משותף',
    sevenBoom:'7 בום'
  };
  const DISPLAY_HE={
    '2 Boards':'2 לוחות',
    '1 Board Stronger':'לוח אחד חזק יותר',
    'Open / Close / Open Cards':'פתוח / סגור / קלפים פתוחים',
    'Insert 3 Cards':'הוסף 3 קלפים',
    'Shared Card':'קלף משותף',
    '7 Boom':'7 בום',
    'Regular':'רגיל'
  };

  const style=document.createElement('style');
  style.textContent=`
    #gameSelect{display:none!important}
    #gameRadioList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}
    .gameRadioOption{display:flex;align-items:center;justify-content:flex-start;gap:8px;padding:9px 10px;border:1px solid var(--line);border-radius:11px;background:rgba(30,41,59,.72);cursor:pointer;direction:rtl;text-align:right;min-height:42px}
    .gameRadioOption.gameWide{grid-column:1 / -1}
    .gameRadioOption input{width:17px;height:17px;margin:0;accent-color:#38bdf8;flex:0 0 auto}
    .gameRadioOption span{direction:ltr;unicode-bidi:embed;font-weight:800;font-size:14px}
    #rulesList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    #rulesList .rule{margin-bottom:0;min-height:44px;padding:9px 10px;font-size:14px}
    #rulesList .rule.ruleWide{grid-column:1 / -1}
    #currentGameBackBtn{margin-top:8px}
  `;
  document.head.appendChild(style);

  const mainBrand=document.querySelector('#mainApp > .brand');
  if(mainBrand)mainBrand.textContent='קבוצת חארבו דארבו';

  function translateTop(){
    const gamesTop=document.getElementById('gamesTop');
    if(gamesTop&&gamesTop.parentElement){
      Array.from(gamesTop.parentElement.childNodes).forEach(node=>{
        if(node.nodeType===3)node.textContent=' משחקים';
      });
    }
    const roomTop=document.getElementById('roomTop');
    if(roomTop){
      let code='—';
      try{if(typeof state!=='undefined'&&state&&state.room)code=state.room;}catch(e){}
      roomTop.textContent='חדר '+code;
    }
  }

  const originalUpdateTop=window.updateTop;
  if(typeof originalUpdateTop==='function'){
    window.updateTop=function(){
      const result=originalUpdateTop.apply(this,arguments);
      translateTop();
      return result;
    };
  }
  translateTop();

  function syncGameRadios(){
    const select=document.getElementById('gameSelect');
    const wrap=document.getElementById('gameRadioList');
    if(!select||!wrap)return;
    wrap.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=r.value===select.value);
  }

  function buildGameRadios(){
    const select=document.getElementById('gameSelect');
    if(!select||document.getElementById('gameRadioList'))return;
    const wrap=document.createElement('div');
    wrap.id='gameRadioList';

    Array.from(select.options).forEach(opt=>{
      const label=document.createElement('label');
      const isShort=opt.textContent.trim().length<=10;
      label.className='gameRadioOption'+(isShort?'':' gameWide');

      const radio=document.createElement('input');
      radio.type='radio';
      radio.name='hdgGameChoice';
      radio.value=opt.value;
      radio.checked=select.value===opt.value;

      const text=document.createElement('span');
      text.textContent=opt.textContent;

      radio.addEventListener('change',()=>{
        if(!radio.checked)return;
        select.value=radio.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
        translateRules();
      });

      label.append(radio,text);
      wrap.appendChild(label);
    });

    select.insertAdjacentElement('afterend',wrap);
    select.addEventListener('change',syncGameRadios);
  }

  function translateRules(){
    const rows=document.querySelectorAll('#rulesList .rule');
    rows.forEach((row,i)=>{
      const rule=(typeof RULES!=='undefined'&&RULES[i])?RULES[i]:null;
      if(!rule)return;
      const txt=RULE_HE[rule.id]||rule.label;
      const textNode=Array.from(row.childNodes).find(n=>n.nodeType===3);
      if(textNode)textNode.textContent=txt;
      row.classList.toggle('ruleWide',txt.length>14);
      row.setAttribute('dir','rtl');
    });
  }

  const originalRenderRules=window.renderRules;
  if(typeof originalRenderRules==='function'){
    window.renderRules=function(){
      const result=originalRenderRules.apply(this,arguments);
      translateRules();
      return result;
    };
  }

  buildGameRadios();
  const gameSelect=document.getElementById('gameSelect');
  if(gameSelect&&typeof window.renderRules==='function')gameSelect.onchange=window.renderRules;
  translateRules();

  const newGameBtn=document.getElementById('newGameBtn');
  if(newGameBtn&&typeof newGameBtn.onclick==='function'){
    const originalNewGame=newGameBtn.onclick;
    newGameBtn.onclick=function(e){
      const result=originalNewGame.call(this,e);
      buildGameRadios();
      syncGameRadios();
      translateRules();
      return result;
    };
  }

  function translateCurrentGameDisplay(){
    const info=document.getElementById('currentGameInfo');
    if(!info)return;
    info.querySelectorAll('.badge').forEach(b=>{
      const t=b.textContent.trim();
      if(DISPLAY_HE[t])b.textContent=DISPLAY_HE[t];
    });
  }

  const startGameBtn=document.getElementById('startGameBtn');
  if(startGameBtn&&typeof startGameBtn.onclick==='function'){
    const originalStartGame=startGameBtn.onclick;
    startGameBtn.onclick=async function(e){
      const result=await originalStartGame.call(this,e);
      translateCurrentGameDisplay();
      return result;
    };
  }

  const endGameBtn=document.getElementById('endGameBtn');
  if(endGameBtn&&!document.getElementById('currentGameBackBtn')){
    const back=document.createElement('button');
    back.id='currentGameBackBtn';
    back.className='secondary';
    back.textContent='חזרה';
    endGameBtn.insertAdjacentElement('afterend',back);
    back.onclick=async()=>{
      try{
        if(typeof state!=='undefined'){
          state.liveStatus='waiting';
          state.liveGame=null;
          state.liveWinner=null;
          if(typeof saveLive==='function')await saveLive();
        }
      }catch(e){}
      try{currentGame=null;}catch(e){}
      syncGameRadios();
      if(typeof renderRules==='function')renderRules();
      showGameView('gameSetupView');
    };
  }
})();
