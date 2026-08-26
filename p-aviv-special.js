/* Aviv-only special winner animation for standalone projector page. */
(function(){
  function media(){return window.HDG_AVIV_SPECIAL_VIDEO||'';}

  const style=document.createElement('style');
  style.textContent=`
    .avivProjectorVideo{display:block;width:min(74vw,680px);max-height:66vh;object-fit:contain;margin:0 auto 10px;border-radius:28px;background:#07111f;box-shadow:0 22px 70px rgba(0,0,0,.48)}
    .avivSoundFallback{margin-top:12px;background:#f59e0b;color:#111827}
  `;
  document.head.appendChild(style);

  function isAviv(name){
    const t=String(name??'').trim();
    return t==='אביב'||t.toLowerCase()==='aviv';
  }
  function special(s){return s&&s.liveStatus==='winner'&&Array.isArray(s.liveWinner)&&s.liveWinner.length===1&&isAviv(s.liveWinner[0]);}

  function addSoundButton(content,v){
    if(!content||document.getElementById('avivSoundFallback'))return;
    const b=document.createElement('button');
    b.id='avivSoundFallback';
    b.className='avivSoundFallback';
    b.textContent='▶ הפעל קול';
    b.onclick=()=>{
      try{v.muted=false;v.currentTime=0}catch(e){}
      const p=v.play();
      if(p&&typeof p.then==='function')p.then(()=>b.remove()).catch(()=>{});
    };
    content.appendChild(b);
  }

  function startVideo(v,content){
    try{v.currentTime=0}catch(e){}
    v.muted=false;
    const p=v.play();
    if(!p||typeof p.catch!=='function')return;
    p.catch(()=>{
      // Always keep the animation visible even if the projector browser blocks sound.
      v.muted=true;
      const silent=v.play();
      if(silent&&typeof silent.catch==='function')silent.catch(()=>{});
      addSoundButton(content,v);
    });
  }

  function install(){
    if(!media()||typeof window.render!=='function'||window.render.__avivWrapped)return false;
    const previous=window.render;
    const wrapped=function(s){
      if(special(s)){
        const content=document.getElementById('content');
        if(!content)return previous.apply(this,arguments);
        if(content.querySelector('#avivStandaloneProjectorVideo'))return;
        content.innerHTML=`<video id="avivStandaloneProjectorVideo" class="avivProjectorVideo" src="${media()}" autoplay playsinline preload="auto" loop></video><div class="winner" style="font-size:clamp(42px,7vw,92px)">אביב</div><div class="rules">מנצח</div>`;
        const v=document.getElementById('avivStandaloneProjectorVideo');
        if(v){v.volume=1;startVideo(v,content);}
        return;
      }
      return previous.apply(this,arguments);
    };
    wrapped.__avivWrapped=true;
    window.render=wrapped;
    return true;
  }

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>300)clearInterval(timer);
    },20);
  }
})();
