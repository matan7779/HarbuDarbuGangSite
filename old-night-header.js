/* Hide live-night indicators while browsing Old Nights. */
(function(){
  function setLiveIndicatorsVisible(visible){
    const games=document.querySelector('#mainApp .topbar .chip');
    const room=document.getElementById('roomTop');
    if(games)games.style.display=visible?'':'none';
    if(room)room.style.display=visible?'':'none';
  }

  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      setTimeout(()=>setLiveIndicatorsVisible(btn.dataset.tab!=='oldNightsTab'),0);
    });
  });

  const oldNightsBtn=document.getElementById('oldNightsBtn');
  if(oldNightsBtn){
    oldNightsBtn.addEventListener('click',()=>setTimeout(()=>setLiveIndicatorsVisible(false),0));
  }

  const newNightBtn=document.getElementById('newNightFromArchiveBtn');
  if(newNightBtn){
    newNightBtn.addEventListener('click',()=>setTimeout(()=>setLiveIndicatorsVisible(true),0));
  }
})();
