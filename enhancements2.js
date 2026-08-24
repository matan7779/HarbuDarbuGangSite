/* V15.1 small follow-up */
(function(){
  function esc2(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function fmt2(v){v=Number(v)||0;return v>0?`+${v}₪`:v<0?`-${Math.abs(v)}₪`:'0₪'}
  const prev=window.renderStats;
  window.renderStats=function(){
    if(prev)prev();
    const box=document.getElementById('moneySummary');
    if(!box)return;
    ensureMoney();
    box.innerHTML=`<table><tr><th>Player</th><th style="text-align:right">Result</th></tr>${state.players.map(p=>{const d=Number(state.cashout[p]||0)-Number(state.rebuys[p]||0)*PRICE;const cls=d>0?'pos':d<0?'neg':'zer';return `<tr><td>${esc2(p)}</td><td class="${cls}" style="text-align:right;font-weight:900">${fmt2(d)}</td></tr>`}).join('')}</table>`;
  };
})();
