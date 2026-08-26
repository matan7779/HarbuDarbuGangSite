/* Small Hebrew UI polish for login, welcome and player selection screens. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #loginScreen #loginBtn{margin-top:14px}
    #welcomeScreen .heroTitle{text-align:center}
    #nightSetupScreen{text-align:center}
    #nightSetupScreen .brand{text-align:center}
    #nightSetupScreen h2{text-align:center}
    #nightSetupScreen .customPlayerBox{text-align:center}
  `;
  document.head.appendChild(style);

  const welcomeTitle=document.querySelector('#welcomeScreen .heroTitle');
  if(welcomeTitle)welcomeTitle.textContent='קבוצת חארבו דארבו';

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
      dateLine.textContent='תאריך הערב: ';
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
})();
