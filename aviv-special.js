/* Special Aviv single-winner celebration on controller and built-in projector. */
(function(){
  function media(){return window.HDG_AVIV_SPECIAL_VIDEO||'';}

  const style=document.createElement('style');
  style.textContent=`
    .avivSpecialVideo{display:block;width:min(78vw,560px);max-height:58vh;object-fit:contain;margin:0 auto 8px;border-radius:24px;background:#07111f;box-shadow:0 18px 55px rgba(0,0,0,.42)}
    #projectorContent .avivSpecialVideo{width:min(74vw,680px);max-height:66vh;border-radius:28px}
    .avivSoundFallback{width:auto!important;margin:10px auto 0!important;padding:11px 18px!important;background:#f59e0b!important;color:#111827!important}
  `;
  document.head.appendChild(style);

  function isAviv(name){
    const t=String(name??'').trim();
    return t==='אביב'||t.toLowerCase()==='aviv';
  }
  function isSingleAviv(winners){return Array.isArray(winners)&&winners.length===1&&isAviv(winners[0]);}

  function makeVideo(id){
    const v=document.createElement('video');
    v.id=id;
    v.className='avivSpecialVideo';
    v.src=media();
    v.autoplay=true;
    v.playsInline=true;
    v.preload='auto';
    v.controls=false;
    v.loop=true;
    v.volume=1;
    return v;
  }

  function addSoundButton(holder,v){
    if(!holder||holder.querySelector('.avivSoundFallback'))return;
    const b=document.createElement('button');
    b.className='avivSoundFallback';
    b.textContent='▶ הפעל קול';
    b.onclick=()=>{
      try{v.muted=false;v.currentTime=0;}catch(e){}
      const p=v.play();
      if(p&&typeof p.then==='function')p.then(()=>b.remove()).catch(()=>{});
    };
    holder.appendChild(b);
  }

  function startVideo(v,holder,preferSound){
    if(!v)return;
    try{v.currentTime=0;}catch(e){}
    v.muted=!preferSound;
    const p=v.play();
    if(!p||typeof p.catch!=='function')return;
    p.catch(()=>{
      // Browsers often block winner audio after an async DB save. Keep the animation
      // visible by retrying muted, then offer one clear tap for the sound.
      v.muted=true;
      const silent=v.play();
      if(silent&&typeof silent.catch==='function')silent.catch(()=>{});
      addSoundButton(holder,v);
    });
  }

  function restoreMainCup(){
    const cup=document.querySelector('#celebration .cup');
    if(!cup)return;
    const old=cup.querySelector('video');
    if(old){try{old.pause()}catch(e){}}
    cup.textContent='🏆';
  }

  function showMainSpecial(){
    if(!media())return;
    const overlay=document.getElementById('celebration');
    const cup=overlay?.querySelector('.cup');
    if(!overlay||!cup)return;
    cup.innerHTML='';
    const v=makeVideo('avivMainSpecial');
    cup.appendChild(v);
    const name=document.getElementById('celebrationName');
    if(name)name.textContent='אביב';
    overlay.classList.remove('hidden');
    // This is called directly from the Save Result tap, so sound is allowed on most phones.
    startVideo(v,cup,true);
  }

  function installSaveHook(){
    const saveBtn=document.getElementById('saveWinnerBtn');
    if(!saveBtn||typeof saveBtn.onclick!=='function'||saveBtn.onclick.__avivWrapped)return false;
    const originalSave=saveBtn.onclick;
    const wrapped=async function(e){
      let winners=[];
      try{winners=(typeof selectedWinners!=='undefined')?[...selectedWinners]:[];}catch(err){}
      const special=isSingleAviv(winners);
      restoreMainCup();

      const oldRandomSound=window.randomSound;
      if(special){
        // Start the special media BEFORE the original async save loses the user gesture.
        showMainSpecial();
        window.randomSound=()=>{};
      }
      try{
        const result=originalSave.call(this,e);
        return await result;
      }finally{
        if(special)window.randomSound=oldRandomSound;
      }
    };
    wrapped.__avivWrapped=true;
    saveBtn.onclick=wrapped;
    return true;
  }

  function installContinueHook(){
    const continueBtn=document.getElementById('continueBtn');
    if(!continueBtn||typeof continueBtn.onclick!=='function'||continueBtn.onclick.__avivWrapped)return false;
    const originalContinue=continueBtn.onclick;
    const wrapped=async function(e){
      restoreMainCup();
      return await originalContinue.call(this,e);
    };
    wrapped.__avivWrapped=true;
    continueBtn.onclick=wrapped;
    return true;
  }

  function installProjectorHook(){
    const originalProjector=window.renderProjectorState;
    if(typeof originalProjector!=='function'||originalProjector.__avivWrapped)return false;
    const wrapped=function(s){
      const winners=s&&Array.isArray(s.liveWinner)?s.liveWinner:[];
      if(s&&s.liveStatus==='winner'&&isSingleAviv(winners)&&media()){
        const content=document.getElementById('projectorContent');
        if(content){
          if(content.querySelector('#avivProjectorVideo'))return;
          content.innerHTML='<div id="avivProjectorSpecial"></div><div class="projectorWinner">אביב</div><div class="projectorRules">מנצח</div>';
          const holder=document.getElementById('avivProjectorSpecial');
          const v=makeVideo('avivProjectorVideo');
          holder.appendChild(v);
          // Try sound; if blocked, animation still runs muted and a sound button appears.
          startVideo(v,holder,true);
          return;
        }
      }
      return originalProjector.apply(this,arguments);
    };
    wrapped.__avivWrapped=true;
    window.renderProjectorState=wrapped;
    return true;
  }

  function installAll(){
    if(!media())return false;
    const a=installSaveHook();
    const b=installContinueHook();
    const c=installProjectorHook();
    return a||b||c;
  }

  installAll();
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    installAll();
    const save=document.getElementById('saveWinnerBtn');
    const ready=media()&&save&&save.onclick&&save.onclick.__avivWrapped&&window.renderProjectorState&&window.renderProjectorState.__avivWrapped;
    if(ready||tries>200)clearInterval(timer);
  },25);
})();
