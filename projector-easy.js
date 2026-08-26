(function(){
  const isProjectorQuick = new URLSearchParams(location.search).get('projector') === '1';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.textContent=`
    .hdgProjectorNotice{position:fixed;inset:0;background:rgba(2,6,23,.80);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:280}
    .hdgProjectorNotice.hidden{display:none!important}
    .hdgProjectorNoticeCard{width:min(440px,94vw);background:linear-gradient(180deg,#172033,#0f172a);border:1px solid rgba(56,189,248,.28);border-radius:26px;padding:28px;text-align:center;box-shadow:0 28px 85px rgba(0,0,0,.52);direction:rtl}
    .hdgProjectorNoticeIcon{width:72px;height:72px;margin:0 auto 14px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:38px;background:rgba(56,189,248,.11);border:1px solid rgba(56,189,248,.24)}
    .hdgProjectorNoticeTitle{font-size:27px;font-weight:900;margin-bottom:9px}
    .hdgProjectorNoticeText{color:#cbd5e1;font-size:15px;line-height:1.65;margin-bottom:20px}
    .hdgProjectorNotice button{margin:0;min-height:46px}
    .projectorWaitingBox{max-width:700px;margin:0 auto;background:rgba(15,23,42,.72);border:1px solid rgba(56,189,248,.22);border-radius:24px;padding:34px 28px;box-shadow:0 22px 60px rgba(0,0,0,.30);direction:rtl}
    .projectorWaitingIcon{font-size:64px;line-height:1;margin-bottom:16px}
    .projectorWaitingTitle{font-size:clamp(30px,4vw,54px);font-weight:900;margin-bottom:12px}
    .projectorWaitingText{font-size:clamp(20px,2.4vw,32px);color:#cbd5e1;line-height:1.5}
  `;
  document.head.appendChild(style);

  const notice=document.createElement('div');
  notice.className='hdgProjectorNotice hidden';
  notice.innerHTML=`<div class="hdgProjectorNoticeCard" role="dialog" aria-modal="true" aria-label="אין משחק פעיל">
    <div class="hdgProjectorNoticeIcon">📺</div>
    <div class="hdgProjectorNoticeTitle">אין משחק פעיל כרגע</div>
    <div class="hdgProjectorNoticeText">התחל ערב ומשחק מהטלפון, ולאחר מכן פתח שוב את תצוגת המקרן.</div>
    <button class="primary" data-close>הבנתי</button>
  </div>`;
  document.body.appendChild(notice);
  const closeNotice=()=>notice.classList.add('hidden');
  notice.querySelector('[data-close]').onclick=closeNotice;
  notice.addEventListener('click',e=>{if(e.target===notice)closeNotice()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!notice.classList.contains('hidden'))closeNotice()});

  const originalRenderProjectorState=window.renderProjectorState;
  if(typeof originalRenderProjectorState==='function'){
    window.renderProjectorState=function(s){
      const hasWinner=s&&s.liveStatus==='winner'&&Array.isArray(s.liveWinner)&&s.liveWinner.length;
      if(s&&!s.liveGame&&!hasWinner){
        const content=document.getElementById('projectorContent');
        if(content){
          const players=Array.isArray(s.players)?s.players:[];
          content.innerHTML=`<div class="projectorWaitingBox"><div class="projectorWaitingIcon">🃏</div><div class="projectorWaitingTitle">אין משחק פעיל כרגע</div><div class="projectorWaitingText">ממתינים להתחלת המשחק הבא...</div>${players.length?`<div class="projectorPlayers" style="margin-top:20px">${players.map(esc).join(' · ')}</div>`:''}</div>`;
          return;
        }
      }
      return originalRenderProjectorState.apply(this,arguments);
    };
  }

  async function connectCurrentNight(){
    try{
      const data = await rpc('hdg_get_open_night',{p_group_key:groupKey});
      if(!data || !data.room){
        notice.classList.remove('hidden');
        return;
      }
      showScreen('projectorScreen');
      if(projectorTimer) clearInterval(projectorTimer);
      const room = String(data.room).trim().toUpperCase();
      const tick = async()=>{
        try{
          const s = await rpc('hdg_get_live',{p_group_key:groupKey,p_room_code:room});
          renderProjectorState(s || {room,players:[],liveGame:null,liveWinner:null,liveStatus:'waiting'});
        }catch(e){
          const pc=document.getElementById('projectorContent');
          if(pc) pc.innerHTML=`<div class="projectorWaitingBox"><div class="projectorWaitingIcon">⚠️</div><div class="projectorWaitingTitle">לא ניתן לטעון את המשחק</div><div class="projectorWaitingText">נסה שוב בעוד רגע.</div></div>`;
        }
      };
      await tick();
      projectorTimer=setInterval(tick,1000);
    }catch(e){
      notice.querySelector('.hdgProjectorNoticeTitle').textContent='לא ניתן לפתוח את המקרן';
      notice.querySelector('.hdgProjectorNoticeText').textContent='נסה שוב בעוד רגע.';
      notice.classList.remove('hidden');
    }
  }

  const projectorBtn=document.getElementById('projectorBtn');
  if(projectorBtn){
    projectorBtn.textContent='תצוגת מקרן';
    projectorBtn.onclick=connectCurrentNight;
  }

  const loginBtn=document.getElementById('loginBtn');
  if(loginBtn){
    const old=loginBtn.onclick;
    loginBtn.onclick=async()=>{
      await old();
      if(groupKey){
        localStorage.setItem('hdg_group_key_persist',groupKey);
        if(isProjectorQuick) setTimeout(connectCurrentNight,100);
      }
    };
  }

  if(isProjectorQuick){
    const saved=localStorage.getItem('hdg_group_key_persist');
    if(saved){
      groupKey=saved;
      sessionStorage.setItem('hdg_group_key',saved);
      showScreen('welcomeScreen');
      setTimeout(connectCurrentNight,150);
    }
  }

  window.hdgConnectCurrentNight = connectCurrentNight;
})();
