/* Special Aviv single-winner celebration on controller and built-in projector. */
(function(){
  const media=window.HDG_AVIV_SPECIAL_VIDEO;
  if(!media)return;

  const style=document.createElement('style');
  style.textContent=`
    .avivSpecialVideo{display:block;width:min(78vw,560px);max-height:58vh;object-fit:contain;margin:0 auto 8px;border-radius:24px;background:#07111f;box-shadow:0 18px 55px rgba(0,0,0,.42)}
    #projectorContent .avivSpecialVideo{width:min(74vw,680px);max-height:66vh;border-radius:28px}
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
    v.src=media;
    v.autoplay=true;
    v.playsInline=true;
    v.preload='auto';
    v.controls=false;
    v.volume=1;
    return v;
  }
  function playVideo(v){
    if(!v)return;
    try{v.currentTime=0;}catch(e){}
    const p=v.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  }

  function restoreMainCup(){
    const cup=document.querySelector('#celebration .cup');
    if(!cup)return;
    const old=cup.querySelector('video');
    if(old){try{old.pause()}catch(e){}}
    cup.textContent='🏆';
  }

  function showMainSpecial(){
    const overlay=document.getElementById('celebration');
    const cup=overlay?.querySelector('.cup');
    if(!overlay||!cup)return;
    cup.innerHTML='';
    const v=makeVideo('avivMainSpecial');
    cup.appendChild(v);
    const name=document.getElementById('celebrationName');
    if(name)name.textContent='אביב';
    overlay.classList.remove('hidden');
    playVideo(v);
  }

  const saveBtn=document.getElementById('saveWinnerBtn');
  if(saveBtn&&typeof saveBtn.onclick==='function'){
    const originalSave=saveBtn.onclick;
    saveBtn.onclick=async function(e){
      let winners=[];
      try{winners=(typeof selectedWinners!=='undefined')?[...selectedWinners]:[];}catch(err){}
      const special=isSingleAviv(winners);
      restoreMainCup();
      const oldRandomSound=window.randomSound;
      if(special)window.randomSound=()=>{};
      try{
        const result=originalSave.call(this,e);
        if(special)showMainSpecial();
        return await result;
      }finally{
        if(special)window.randomSound=oldRandomSound;
      }
    };
  }

  const continueBtn=document.getElementById('continueBtn');
  if(continueBtn&&typeof continueBtn.onclick==='function'){
    const originalContinue=continueBtn.onclick;
    continueBtn.onclick=async function(e){
      restoreMainCup();
      return await originalContinue.call(this,e);
    };
  }

  const originalProjector=window.renderProjectorState;
  if(typeof originalProjector==='function'){
    window.renderProjectorState=function(s){
      const winners=s&&Array.isArray(s.liveWinner)?s.liveWinner:[];
      if(s&&s.liveStatus==='winner'&&isSingleAviv(winners)){
        const content=document.getElementById('projectorContent');
        if(content){
          if(content.querySelector('#avivProjectorSpecial'))return;
          content.innerHTML='<div id="avivProjectorSpecial"></div><div class="projectorWinner">אביב</div><div class="projectorRules">מנצח</div>';
          const holder=document.getElementById('avivProjectorSpecial');
          const v=makeVideo('avivProjectorVideo');
          holder.appendChild(v);
          playVideo(v);
          return;
        }
      }
      return originalProjector.apply(this,arguments);
    };
  }
})();
