/* Small Hebrew UI polish for login, welcome, player selection and rebuys screens. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #loginScreen #loginBtn{margin-top:18px}
    #welcomeScreen .heroTitle{text-align:center}
    #nightSetupScreen{text-align:center}
    #nightSetupScreen .brand{text-align:center}
    #nightSetupScreen h2{text-align:center}
    #nightSetupScreen .customPlayerBox{text-align:center}
    #nightSetupScreen #nightDate{display:block;margin-top:6px}
    #moneyTab> .card:first-child h2{font-size:27px;text-align:center}
    #moneyTab> .card:first-child .muted{text-align:center;direction:rtl}
    #moneyTab .moneyName{text-align:right;direction:rtl;font-size:18px}
    #moneyTab .moneyRow>div:first-child{text-align:right;direction:rtl}
    #moneyTab .moneyRow>div:first-child .muted{text-align:right;direction:rtl}
  `;
  document.head.appendChild(style);

  const welcomeTitle=document.querySelector('#welcomeScreen .heroTitle');
  if(welcomeTitle)welcomeTitle.textContent='קבוצת חארבו דארבו';

  // Prevent the password field from lingering/flashing after ENTER is pressed.
  const loginBtn=document.getElementById('loginBtn');
  const accessInput=document.getElementById('accessCodeInput');
  if(loginBtn&&accessInput){
    loginBtn.addEventListener('click',()=>{
      accessInput.blur();
      setTimeout(()=>{accessInput.value='';},0);
    });
  }

  // Translate the requested main navigation buttons.
  document.querySelectorAll('.tab').forEach(btn=>{
    if(btn.dataset.tab==='moneyTab')btn.textContent='ריבאיים';
    if(btn.dataset.tab==='statsTab')btn.textContent='סטטיסטיקות';
    if(btn.dataset.tab==='oldNightsTab')btn.textContent='ערבים קודמים';
  });

  const setup=document.getElementById('nightSetupScreen');
  if(setup){
    setup.setAttribute('dir','rtl');
    const brand=setup.querySelector('.brand');
    if(brand)brand.textContent='קבוצת חארבו דארבו';
    const intro=setup.querySelector('.brand + .muted');
    if(intro)intro.textContent='בחר את השחקנים לערב. ניתן לשנות את הרשימה גם בהמשך.';
    const dateLine=setup.querySelector('.card div[style*="font-weight:900"]');
    if(dateLine){
      const date=document.getElementById('nightDate');
      dateLine.textContent='תאריך משחק';
      if(date)dateLine.appendChild(date);
    }
    const roomLabel=document.querySelector('#nightSetupScreen .roomCode')?.previousElementSibling;
    if(roomLabel)roomLabel.textContent='קוד חדר';
    const playersTitle=setup.querySelector('h2');
    if(playersTitle)playersTitle.textContent='שחקני הערב';
    const start=document.getElementById('startNightBtn');
    if(start)start.textContent='התחל משחק';
    const back=document.getElementById('backWelcomeBtn');
    if(back)back.textContent='חזרה';
  }

  function translateCustomPlayerBox(){
    const box=document.querySelector('#nightSetupScreen .customPlayerBox');
    if(!box)return;
    const texts=box.querySelectorAll(':scope > div');
    if(texts[0])texts[0].textContent='הוסף שחקן נוסף';
    if(texts[1])texts[1].textContent='הקלד את שם השחקן';
    const input=box.querySelector('#customPlayerName');
    if(input)input.placeholder='שם השחקן';
    const add=box.querySelector('#addCustomPlayerBtn');
    if(add)add.textContent='הוסף';
  }

  const originalRenderPlayersSetup=window.renderPlayersSetup;
  if(typeof originalRenderPlayersSetup==='function'){
    window.renderPlayersSetup=function(){
      const result=originalRenderPlayersSetup.apply(this,arguments);
      translateCustomPlayerBox();
      return result;
    };
  }
  translateCustomPlayerBox();

  function translateMoneyScreen(){
    const money=document.getElementById('moneyTab');
    if(!money)return;

    const head=money.querySelector(':scope > .card:first-child');
    if(head){
      const h2=head.querySelector('h2');
      if(h2)h2.textContent='ריבאיים – קנייה וסוף הערב';
      const sub=head.querySelector('.muted');
      if(sub)sub.textContent='כל ריבאיי = 25 ₪.';
    }

    money.querySelectorAll('.moneyRow').forEach(row=>{
      const cost=row.querySelector(':scope > div:first-child .muted');
      if(cost)cost.textContent=cost.textContent.replace(/^Rebuy cost:\s*/,'עלות ריבאיים: ');
      row.querySelectorAll('.centerMuted').forEach(label=>{
        if(label.textContent.trim()==='Rebuys' || label.textContent.trim()==='ריבאיים')label.textContent='ריבאיים קנייה';
        if(label.textContent.trim()==='Cash out' || label.textContent.trim()==='משיכת כסף')label.textContent='ריבאיים - סוף הערב';
      });
    });

    const totalRebuys=document.getElementById('totalRebuys');
    if(totalRebuys&&totalRebuys.parentElement){
      const label=totalRebuys.nextSibling;
      if(label)label.textContent=' ריבאיים';
    }
    const totalCost=document.getElementById('totalRebuyCost');
    if(totalCost&&totalCost.parentElement){
      const label=totalCost.nextSibling;
      if(label)label.textContent=' סה"כ בקופה';
    }

    // Put the total pot first and the rebuy count second.
    if(totalCost&&totalRebuys){
      const grid=totalCost.parentElement?.parentElement;
      const costStat=totalCost.parentElement;
      const rebuyStat=totalRebuys.parentElement;
      if(grid&&costStat&&rebuyStat&&costStat.parentElement===grid&&rebuyStat.parentElement===grid){
        grid.insertBefore(costStat,rebuyStat);
      }
    }
  }

  const originalRenderMoney=window.renderMoney;
  if(typeof originalRenderMoney==='function'){
    window.renderMoney=function(){
      const result=originalRenderMoney.apply(this,arguments);
      translateMoneyScreen();
      return result;
    };
  }
  translateMoneyScreen();

  // After starting a valid night, go directly to Rebuys instead of Game.
  const startNightBtn=document.getElementById('startNightBtn');
  if(startNightBtn&&typeof startNightBtn.onclick==='function'){
    const originalStartNight=startNightBtn.onclick;
    startNightBtn.onclick=async function(e){
      const result=await originalStartNight.call(this,e);
      try{
        if(Array.isArray(state.players)&&state.players.length>=2&&!document.getElementById('mainApp').classList.contains('hidden')){
          activateTab('moneyTab');
        }
      }catch(err){}
      return result;
    };
  }
})();
