/* Harbu Darbu Gang V16 enhancements */
(function(){
  const css=document.createElement('style');
  css.textContent=`
  .roomTop{background:#0f3b57;border:1px solid rgba(56,189,248,.35);border-radius:12px;padding:9px 10px;font-size:13px;font-weight:800;white-space:nowrap}
  .archiveActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.archiveActions button{width:auto;margin:0}
  .nightOverlay{position:fixed;inset:0;background:rgba(3,7,18,.97);z-index:120;overflow:auto;padding:18px}
  .nightOverlayInner{max-width:760px;margin:0 auto}.nightOverlayHeader{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;position:sticky;top:0;background:rgba(3,7,18,.96);padding:8px 0;z-index:2}
  .nightOverlayHeader button{width:auto;margin:0}
  .gameScroll{max-height:52vh;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:8px}
  .typePills{display:flex;gap:9px;flex-wrap:wrap}.typePill{background:#334155;border-radius:999px;padding:9px 12px;font-size:14px}
  .archiveMoney td:last-child,.archiveMoney th:last-child{text-align:right}.moneyBig{font-size:21px;font-weight:900}.archiveMetaStrong{font-size:15px;color:#e2e8f0}
  .fullStatsCard h2{font-size:22px}.fullStatsCard table th,.fullStatsCard table td{font-size:16px;padding:11px 6px}
  .winsTable td{font-size:17px!important}.winsTable td:first-child{font-weight:800}
  .archiveMoney td:first-child{font-weight:800;font-size:17px!important}.archiveMoney th{font-size:15px!important}
  .hdgNotice{position:fixed;inset:0;background:rgba(2,6,23,.78);display:flex;align-items:center;justify-content:center;padding:20px;z-index:250}
  .hdgNoticeCard{width:min(420px,94vw);background:linear-gradient(180deg,#172033,#0f172a);border:1px solid rgba(148,163,184,.22);border-radius:22px;padding:24px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.45)}
  .hdgNoticeIcon{font-size:44px;margin-bottom:8px}.hdgNoticeTitle{font-size:24px;font-weight:900;margin-bottom:8px}.hdgNoticeText{color:#cbd5e1;font-size:14px;line-height:1.5;margin-bottom:18px}.hdgNoticeCard button{margin:0}
  `;
  document.head.appendChild(css);

  function safeArray(v){return Array.isArray(v)?v:[]}
  function safeObj(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
  function normalizeNight(n){
    const games=safeArray(n.games);
    let players=safeArray(n.players).filter(Boolean);
    if(!players.length){
      const set=new Set();
      games.forEach(g=>safeArray(g.players).forEach(p=>set.add(p)));
      Object.keys(safeObj(n.rebuys)).forEach(p=>set.add(p));
      Object.keys(safeObj(n.cashout)).forEach(p=>set.add(p));
      players=[...set];
    }
    return {...n,games,players,rebuys:safeObj(n.rebuys),cashout:safeObj(n.cashout)};
  }
  function fmtNet(v){v=Number(v)||0;return v>0?`+${v}₪`:v<0?`-${Math.abs(v)}₪`:'0₪'}
  function netFor(n,p){const rb=Number(n.rebuys[p]||0),cash=Number(n.cashout[p]||0);return cash-rb*PRICE}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function typeCounts(n){const m={};n.games.forEach(g=>m[g.name]=(m[g.name]||0)+1);return Object.entries(m).sort((a,b)=>b[1]-a[1])}
  function winnerCounts(n){const m={};n.games.forEach(g=>safeArray(g.winners).forEach(w=>m[w]=(m[w]||0)+1));return Object.entries(m).sort((a,b)=>b[1]-a[1])}
  function showNotice(title,text,ok=true){
    const old=document.getElementById('hdgNotice');if(old)old.remove();
    const box=document.createElement('div');box.id='hdgNotice';box.className='hdgNotice';
    box.innerHTML=`<div class="hdgNoticeCard"><div class="hdgNoticeIcon">${ok?'✓':'!'}</div><div class="hdgNoticeTitle">${esc(title)}</div><div class="hdgNoticeText">${esc(text)}</div><button class="${ok?'green':'secondary'}" data-close>OK</button></div>`;
    document.body.appendChild(box);
    box.querySelector('[data-close]').onclick=()=>box.remove();
    box.addEventListener('click',e=>{if(e.target===box)box.remove()});
  }

  // Room code stays visible after play starts.
  const top=document.querySelector('#mainApp .topbar');
  if(top && !document.getElementById('roomTop')){
    const right=document.createElement('div');right.style.display='flex';right.style.gap='8px';right.style.alignItems='center';right.style.flexWrap='wrap';
    const gameChip=top.querySelector('.chip');
    if(gameChip){top.replaceChild(right,gameChip);right.appendChild(gameChip)}
    const r=document.createElement('div');r.id='roomTop';r.className='roomTop';r.textContent='Room —';right.appendChild(r);
  }
  const originalUpdateTop=window.updateTop;
  window.updateTop=function(){if(originalUpdateTop)originalUpdateTop();const r=document.getElementById('roomTop');if(r)r.textContent='Room '+(state.room||'—')};

  // Cash-out is displayed as number of 25₪ units, like rebuys.
  window.renderMoney=function(){
    ensureMoney();
    let total=0;const c=document.getElementById('moneyRows');c.innerHTML='';
    state.players.forEach(p=>{
      const rb=Number(state.rebuys[p]||0),co=Number(state.cashout[p]||0),coUnits=Math.round(co/PRICE);total+=rb;
      const row=document.createElement('div');row.className='moneyRow';
      row.innerHTML=`
        <div><div class="moneyName">${esc(p)}</div><div class="muted">Rebuy cost: ${rb*PRICE}₪</div></div>
        <div><div class="centerMuted">Rebuys</div><div class="counter"><button data-rm>−</button><span>${rb}</span><button data-rp>+</button></div></div>
        <div><div class="centerMuted">Cash out</div><div class="counter"><button data-cm>−</button><span>${coUnits}</span><button data-cp>+</button></div></div>`;
      row.querySelector('[data-rm]').onclick=async()=>{state.rebuys[p]=Math.max(0,rb-1);renderMoney();renderStats();await saveLive()};
      row.querySelector('[data-rp]').onclick=async()=>{state.rebuys[p]=rb+1;renderMoney();renderStats();await saveLive()};
      row.querySelector('[data-cm]').onclick=async()=>{state.cashout[p]=Math.max(0,co-PRICE);renderMoney();renderStats();await saveLive()};
      row.querySelector('[data-cp]').onclick=async()=>{state.cashout[p]=co+PRICE;renderMoney();renderStats();await saveLive()};
      c.appendChild(row);
    });
    document.getElementById('totalRebuys').textContent=total;
    document.getElementById('totalRebuyCost').textContent=(total*PRICE)+'₪';
  };

  // Money display uses +25₪ / -25₪ / 0₪ format.
  const originalRenderStats=window.renderStats;
  window.renderStats=function(){
    if(originalRenderStats)originalRenderStats();
    if(!window.state)return;
    const box=document.getElementById('moneySummary');
    if(box){
      ensureMoney();
      box.innerHTML=`<table><tr><th>Player</th><th style="text-align:right">Result</th></tr>${state.players.map(p=>{const d=Number(state.cashout[p]||0)-Number(state.rebuys[p]||0)*PRICE;const cls=d>0?'pos':d<0?'neg':'zer';return `<tr><td>${esc(p)}</td><td class="${cls}" style="text-align:right">${fmtNet(d)}</td></tr>`}).join('')}</table>`;
    }
  };
  window.renderClose=function(){
    ensureMoney();
    document.getElementById('closeSummary').innerHTML=`<table><tr><th>Player</th><th style="text-align:right">Result</th></tr>${state.players.map(p=>{const d=Number(state.cashout[p]||0)-Number(state.rebuys[p]||0)*PRICE;const cls=d>0?'pos':d<0?'neg':'zer';return `<tr><td>${esc(p)}</td><td class="${cls}" style="text-align:right">${fmtNet(d)}</td></tr>`}).join('')}</table>`;
  };

  async function createNightJpg(raw){
    const n=normalizeNight(raw),rows=n.players.map(p=>({name:p,result:netFor(n,p)}));
    const canvas=document.createElement('canvas'),width=1200,rowH=76,height=255+rows.length*rowH+70;canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
    const grad=ctx.createLinearGradient(0,0,width,height);grad.addColorStop(0,'#07111f');grad.addColorStop(1,'#111827');ctx.fillStyle=grad;ctx.fillRect(0,0,width,height);
    ctx.fillStyle='#f8fafc';ctx.font='bold 54px Arial';ctx.fillText('Harbu Darbu Gang',70,90);
    ctx.fillStyle='#cbd5e1';ctx.font='28px Arial';ctx.fillText(`Summary  •  ${n.night_date||n.date||''}`,70,135);
    ctx.fillStyle='#fbbf24';ctx.font='bold 27px Arial';ctx.fillText('Player',95,215);ctx.fillText('Result',880,215);
    rows.forEach((r,i)=>{const y=270+i*rowH;ctx.fillStyle='#f8fafc';ctx.font='bold 29px Arial';ctx.fillText(r.name,95,y);ctx.fillStyle=r.result>0?'#4ade80':r.result<0?'#f87171':'#e2e8f0';ctx.font='bold 31px Arial';ctx.fillText(fmtNet(r.result),880,y)});
    return await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.94));
  }
  window.createSettlementJpg=()=>createNightJpg({...state,night_date:state.date});

  async function shareNight(raw){
    const n=normalizeNight(raw),blob=await createNightJpg(n),date=(n.night_date||n.date||'night').replaceAll('/','-');
    const file=new File([blob],`Harbu-Darbu-Gang-${date}.jpg`,{type:'image/jpeg'});
    if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
      try{await navigator.share({files:[file],title:'Harbu Darbu Gang'});return}catch(e){if(e.name==='AbortError')return}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
    alert('Direct image sharing is not supported in this browser, so the JPG was downloaded. Attach it in WhatsApp.');
  }
  async function copyNight(raw){
    const blob=await createNightJpg(raw);
    try{
      if(!navigator.clipboard || typeof ClipboardItem==='undefined')throw new Error('Image clipboard is not supported here');
      await navigator.clipboard.write([new ClipboardItem({'image/png':blob.type==='image/png'?blob:await (async()=>{const b=await createImageBitmap(blob),c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);return await new Promise(r=>c.toBlob(r,'image/png'))})()})]);
      showNotice('JPG copied','The image is ready. You can paste it directly into WhatsApp Web.');
    }catch(e){
      showNotice('Copy not supported','This browser cannot copy the image directly. Use SHARE JPG instead.',false);
    }
  }
  window.shareWhatsApp=()=>shareNight({...state,night_date:state.date});
  const shareBtn=document.getElementById('shareWhatsAppBtn');if(shareBtn)shareBtn.onclick=window.shareWhatsApp;

  function openNightDetails(raw){
    const n=normalizeNight(raw),counts=typeCounts(n),wins=winnerCounts(n);
    let overlay=document.getElementById('nightDetailsOverlay');
    if(!overlay){overlay=document.createElement('div');overlay.id='nightDetailsOverlay';overlay.className='nightOverlay hidden';document.body.appendChild(overlay)}
    overlay.innerHTML=`<div class="nightOverlayInner">
      <div class="nightOverlayHeader"><div><div class="brand">${esc(n.night_date)}</div><div class="muted">${n.games.length} games · ${n.players.length} players</div></div><button class="secondary smallBtn" id="closeNightOverlay">CLOSE</button></div>
      <div class="card fullStatsCard"><h2>Night Stats</h2><div class="summaryGrid"><div class="stat"><b>${n.games.length}</b>Games</div><div class="stat"><b>${n.players.length}</b>Players</div></div></div>
      <div class="card fullStatsCard"><h2>Money Summary</h2><table class="archiveMoney"><tr><th>Player</th><th>Result</th></tr>${n.players.map(p=>{const d=netFor(n,p),cls=d>0?'pos':d<0?'neg':'zer';return `<tr><td>${esc(p)}</td><td class="${cls} moneyBig">${fmtNet(d)}</td></tr>`}).join('')}</table></div>
      <div class="card fullStatsCard"><h2>Wins</h2>${wins.length?`<table class="winsTable">${wins.map(([p,c],i)=>`<tr><td>${i+1}. ${esc(p)}</td><td style="text-align:right;font-weight:900">${c}</td></tr>`).join('')}</table>`:'<div class="muted" style="font-size:16px">No winners recorded.</div>'}</div>
      <div class="card fullStatsCard"><h2>Game Types</h2><div class="typePills">${counts.length?counts.map(([name,c])=>`<span class="typePill">${esc(name)} × ${c}</span>`).join(''):'<span class="muted">No games</span>'}</div></div>
      <div class="card fullStatsCard"><h2>Game History (${n.games.length})</h2><div class="gameScroll">${n.games.map((g,i)=>`<div style="padding:12px 2px;border-bottom:1px solid var(--line)"><strong style="font-size:16px">${i+1}. ${esc(g.name)}</strong><div class="muted" style="font-size:14px">${safeArray(g.rules).length?safeArray(g.rules).map(esc).join(', '):'Regular'}</div><div class="archiveMetaStrong">Winner: ${safeArray(g.winners).length?safeArray(g.winners).map(esc).join(' + '):'—'}</div></div>`).join('')||'<div class="muted">No games.</div>'}</div></div>
      <div class="card"><div class="archiveActions"><button class="whatsapp smallBtn" id="shareOldNight">SHARE JPG</button><button class="secondary smallBtn" id="copyOldNight">COPY JPG</button></div></div>
    </div>`;
    overlay.classList.remove('hidden');
    document.getElementById('closeNightOverlay').onclick=()=>overlay.classList.add('hidden');
    document.getElementById('shareOldNight').onclick=()=>shareNight(n);
    document.getElementById('copyOldNight').onclick=()=>copyNight(n);
  }

  window.renderArchiveDetails=function(raw){const n=normalizeNight(raw);return `<div class="muted">${n.games.length} games · ${n.players.length} players</div>`};
  window.loadOldNights=async function(){
    const c=document.getElementById('oldNightsList');c.innerHTML='<div class="card"><div class="muted">Loading...</div></div>';
    try{
      const rows=await rpc('hdg_get_old_nights',{p_group_key:groupKey}),nights=safeArray(rows).map(normalizeNight);
      c.innerHTML='';
      if(!nights.length){c.innerHTML='<div class="card"><div class="muted">No saved nights yet.</div></div>';return}
      nights.forEach(n=>{
        const item=document.createElement('div');item.className='archiveItem';
        item.innerHTML=`<div class="archiveHead"><div><div style="font-weight:900">${esc(n.night_date)}</div><div class="muted">${n.games.length} games · ${n.players.length} players</div></div><button class="red smallBtn" data-delete>Delete</button></div><div class="archiveActions"><button class="secondary smallBtn" data-details>OPEN FULL STATS</button><button class="whatsapp smallBtn" data-share>SHARE JPG</button><button class="secondary smallBtn" data-copy>COPY JPG</button></div>`;
        item.querySelector('[data-details]').onclick=()=>openNightDetails(n);
        item.querySelector('[data-share]').onclick=()=>shareNight(n);
        item.querySelector('[data-copy]').onclick=()=>copyNight(n);
        item.querySelector('[data-delete]').onclick=async()=>{if(confirm('Delete this saved night?')){await rpc('hdg_delete_night',{p_group_key:groupKey,p_night_id:n.id});await loadOldNights()}};
        c.appendChild(item);
      });
    }catch(e){c.innerHTML=`<div class="card"><div class="loginError">${esc(e.message)}</div></div>`}
  };

  document.querySelectorAll('.tab').forEach(b=>{if(b.dataset.tab==='oldNightsTab')b.onclick=()=>{activateTab('oldNightsTab');loadOldNights()}});
  try{updateTop()}catch(e){}
})();