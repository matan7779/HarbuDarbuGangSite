(function(){
  const isProjectorQuick = new URLSearchParams(location.search).get('projector') === '1';

  async function connectCurrentNight(){
    try{
      const data = await rpc('hdg_get_open_night',{p_group_key:groupKey});
      if(!data || !data.room){
        alert('No active night found yet. Start a night on the phone first.');
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
          if(pc) pc.innerHTML=`<div class="projectorRules">${e.message}</div>`;
        }
      };
      await tick();
      projectorTimer=setInterval(tick,1000);
    }catch(e){ alert(e.message); }
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
