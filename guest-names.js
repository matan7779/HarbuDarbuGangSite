/* Harbu Darbu Gang - custom guest/player names */
(function(){
  const BASE_PLAYERS=["מתן","צפריר","גיא","אליהו","מר צוקר","אביב","דורון","אורן","חגי","בני","אמיר"];

  const style=document.createElement('style');
  style.textContent=`
    .customPlayerBox{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}
    .customPlayerRow{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:8px}
    .customPlayerRow input{width:100%;padding:12px;background:#fff;color:#111827;border-radius:12px;border:none;font-size:16px}
    .customPlayerRow button{width:auto;margin:0;padding:12px 16px}
    .customPlayers{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .customPlayerChip{width:auto!important;margin:0!important;background:#22c55e;color:#052e16;padding:9px 11px}
  `;
  document.head.appendChild(style);

  window.renderPlayersSetup=function(){
    const c=document.getElementById('nightPlayers');
    if(!c)return;
    c.innerHTML='';

    BASE_PLAYERS.forEach(p=>{
      const b=document.createElement('button');
      b.className='player'+(state.players.includes(p)?' selected':'');
      b.textContent=p;
      b.onclick=()=>{
        state.players=state.players.includes(p)?state.players.filter(x=>x!==p):[...state.players,p];
        renderPlayersSetup();
      };
      c.appendChild(b);
    });

    const custom=state.players.filter(p=>!BASE_PLAYERS.includes(p) && p!=="Guest");
    // Clean up an old literal Guest selection if it exists.
    if(state.players.includes('Guest')) state.players=state.players.filter(p=>p!=='Guest');

    const box=document.createElement('div');
    box.className='customPlayerBox';
    box.style.gridColumn='1 / -1';
    box.innerHTML=`
      <div style="font-weight:800">Add another player</div>
      <div class="muted">Type the player's name instead of using Guest.</div>
      <div class="customPlayerRow">
        <input id="customPlayerName" type="text" maxlength="24" placeholder="Player name" autocomplete="off">
        <button class="green" id="addCustomPlayerBtn">ADD</button>
      </div>
      <div id="customPlayersList" class="customPlayers"></div>`;
    c.appendChild(box);

    const list=box.querySelector('#customPlayersList');
    custom.forEach(p=>{
      const b=document.createElement('button');
      b.className='customPlayerChip';
      b.textContent=p+' ×';
      b.title='Remove '+p;
      b.onclick=()=>{state.players=state.players.filter(x=>x!==p);renderPlayersSetup()};
      list.appendChild(b);
    });

    const input=box.querySelector('#customPlayerName');
    const add=()=>{
      const name=input.value.trim().replace(/\s+/g,' ');
      if(!name)return;
      if(name.toLowerCase()==='guest')return alert('Please enter the player name.');
      if(state.players.some(p=>p.toLowerCase()===name.toLowerCase()))return alert('This player is already selected.');
      state.players=[...state.players,name];
      renderPlayersSetup();
    };
    box.querySelector('#addCustomPlayerBtn').onclick=add;
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add()}});
  };
})();
