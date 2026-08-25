/* Old Nights UI polish */
(function(){
  function setOldNightHeader(isOld){
    const chip=document.querySelector('#mainApp .topbar .chip');
    const room=document.getElementById('roomTop');
    if(chip)chip.style.display=isOld?'none':'';
    if(room)room.style.display=isOld?'none':'';
  }

  const originalActivateTab=window.activateTab;
  if(typeof originalActivateTab==='function'){
    window.activateTab=function(id){
      originalActivateTab(id);
      setOldNightHeader(id==='oldNightsTab');
    };
  }

  const oldBtn=document.getElementById('oldNightsBtn');
  if(oldBtn)oldBtn.addEventListener('click',()=>setTimeout(()=>setOldNightHeader(true),0));

  function reorderFullStats(){
    const overlay=document.getElementById('nightDetailsOverlay');
    if(!overlay || overlay.classList.contains('hidden'))return;
    const inner=overlay.querySelector('.nightOverlayInner');
    if(!inner)return;
    const cards=[...inner.querySelectorAll(':scope > .card.fullStatsCard')];
    const money=cards.find(c=>c.querySelector('h2')?.textContent.trim()==='Money Summary');
    const wins=cards.find(c=>c.querySelector('h2')?.textContent.trim()==='Wins');
    if(money && wins){
      const firstCard=cards[0];
      if(firstCard)inner.insertBefore(money,firstCard);
      inner.insertBefore(wins,money.nextSibling);
    }
  }

  const observer=new MutationObserver(()=>reorderFullStats());
  observer.observe(document.body,{childList:true,subtree:true});
})();
