/* Tiny Old Nights action-button sizing fix: keep the three actions on one row. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #oldNightsList .archiveActions{
      flex-wrap:nowrap;
      gap:5px;
    }
    #oldNightsList .archiveActions button{
      font-size:11px;
      padding:7px 8px;
      white-space:nowrap;
      flex:0 1 auto;
      min-width:0;
    }
  `;
  document.head.appendChild(style);
})();
