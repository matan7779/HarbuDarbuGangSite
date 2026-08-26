/* Hebrew RTL statistics page. Loaded after enhancements2.js. */
(function(){
  const RULE_HE={
    '2 Boards':'2 בורדים',
    '1 Board Stronger':'הבורד החזק לוקח',
    'Open / Close / Open Cards':'פתוח / סגור / קלפים פתוחים',
    'Insert 3 Cards':'מכניסים 3 קלפים',
    'Shared Card':'קלף משותף',
    '7 Boom':'7 בום',
    'Regular':'רגיל'
  };

  const style=document.createElement('style');
  style.textContent=`
    #statsTab{direction:rtl;text-align:right}
    #statsTab>.card,#statsTab h2{text-align:right}
    #statsTab table{direction:rtl}
    #statsTab th,#statsTab td{text-align:right}
    #statsTab .summaryGrid .stat{text-align:right}
    #statsTab #moneySummary th:last-child,#statsTab #moneySummary td:last-child{direction:ltr;unicode-bidi:isolate;text-align:right}
    #statsTab #leaderboard table.heWins{width:auto;min-width:250px;margin-left:auto;margin-right:0}
    #statsTab #leaderboard table.heWins th,#statsTab #leaderboard table.heWins td{padding:10px 8px;text-align:right;white-space:nowrap}
    #statsTab #leaderboard table.heWins th:last-child,#statsTab #leaderboard table.heWins td:last-child{padding-right:22px;font-weight:900}
    #statsTab #history>div{text-align:right;direction:rtl}
  `;
  document.head.appendChild(style);

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function trRule(r){return RULE_HE[r]||r}

  function translateSummaryLabels(){
    const tab=document.getElementById('statsTab');
    if(!tab)return;
    tab.setAttribute('dir','rtl');

    tab.querySelectorAll(':scope > .card > h2').forEach(h=>{
      const t=h.textContent.trim();
      if(t==='Night Summary'||t==='סיכום הערב')h.textContent='סיכום הערב';
      else if(t==='Leaderboard'||t==='ניצחונות')h.textContent='ניצחונות';
      else if(t==='Money Summary'||t==='סיכום כספי')h.textContent='סיכום כספי';
      else if(t==='Game History'||t==='היסטוריית משחקים')h.textContent='היסטוריית משחקים';
    });

    const gameCount=document.getElementById('gameCount');
    if(gameCount&&gameCount.parentElement){
      Array.from(gameCount.parentElement.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent=' משחקים';});
    }
    const playerCount=document.getElementById('playerCount');
    if(playerCount&&playerCount.parentElement){
      Array.from(playerCount.parentElement.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent=' שחקנים';});
    }
  }

  function renderHebrewWins(){
    const box=document.getElementById('leaderboard');
    if(!box)return;
    let games=[];
    try{games=Array.isArray(state.games)?state.games:[]}catch(e){}
    const wins={};
    games.forEach(g=>(Array.isArray(g.winners)?g.winners:[]).forEach(w=>wins[w]=(wins[w]||0)+1));
    const rank=Object.entries(wins).sort((a,b)=>b[1]-a[1]);
    box.innerHTML=rank.length
      ?`<table class="heWins"><tr><th>שחקן</th><th>ניצחונות</th></tr>${rank.map(([name,count])=>`<tr><td>${esc(name)}</td><td>${count}</td></tr>`).join('')}</table>`
      :'<div class="muted">עדיין אין משחקים.</div>';
  }

  function translateMoney(){
    const box=document.getElementById('moneySummary');
    if(!box)return;
    box.querySelectorAll('th').forEach(th=>{
      const t=th.textContent.trim();
      if(t==='Player')th.textContent='שחקן';
      if(t==='Result'||t==='תוצאה')th.textContent='סכום';
    });
  }

  function renderHebrewHistory(){
    const box=document.getElementById('history');
    if(!box)return;
    let games=[];
    try{games=Array.isArray(state.games)?state.games:[]}catch(e){}
    box.innerHTML=games.length?games.map((g,i)=>{
      const rules=Array.isArray(g.rules)&&g.rules.length?g.rules.map(trRule).join(', '):'רגיל';
      const winners=Array.isArray(g.winners)&&g.winners.length?g.winners.map(esc).join(' + '):'—';
      return `<div style="padding:9px 0;border-bottom:1px solid var(--line)"><strong>${i+1}. ${esc(g.name)}</strong><br><span class="muted">${esc(rules)}</span><br>מנצח: ${winners}</div>`;
    }).join(''):'<div class="muted">עדיין אין משחקים.</div>';
  }

  function applyHebrewStats(){
    translateSummaryLabels();
    renderHebrewWins();
    translateMoney();
    renderHebrewHistory();
  }

  const previous=window.renderStats;
  if(typeof previous==='function'){
    window.renderStats=function(){
      const result=previous.apply(this,arguments);
      applyHebrewStats();
      return result;
    };
  }

  applyHebrewStats();
})();
