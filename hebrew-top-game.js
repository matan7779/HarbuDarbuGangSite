/* Hebrew top header + radio game selection. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #gameSelect{display:none!important}
    #gameRadioList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:8px}
    .gameRadioOption{display:flex;align-items:center;justify-content:flex-start;gap:9px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:rgba(30,41,59,.72);cursor:pointer;direction:rtl;text-align:right}
    .gameRadioOption input{width:18px;height:18px;margin:0;accent-color:#38bdf8;flex:0 0 auto}
    .gameRadioOption span{direction:ltr;unicode-bidi:embed;font-weight:800}
    @media(max-width:560px){#gameRadioList{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const mainBrand=document.querySelector('#mainApp > .brand');
  if(mainBrand)mainBrand.textContent='קבוצת חארבו דארבו';

  function translateTop(){
    const gamesTop=document.getElementById('gamesTop');
    if(gamesTop&&gamesTop.parentElement){
      Array.from(gamesTop.parentElement.childNodes).forEach(node=>{
        if(node.nodeType===3)node.textContent=' משחקים';
      });
    }

    const roomTop=document.getElementById('roomTop');
    if(roomTop){
      let code='—';
      try{if(typeof state!=='undefined'&&state&&state.room)code=state.room;}catch(e){}
      roomTop.textContent='חדר '+code;
    }
  }

  const originalUpdateTop=window.updateTop;
  if(typeof originalUpdateTop==='function'){
    window.updateTop=function(){
      const result=originalUpdateTop.apply(this,arguments);
      translateTop();
      return result;
    };
  }
  translateTop();

  function buildGameRadios(){
    const select=document.getElementById('gameSelect');
    if(!select||document.getElementById('gameRadioList'))return;

    const wrap=document.createElement('div');
    wrap.id='gameRadioList';

    Array.from(select.options).forEach(opt=>{
      const label=document.createElement('label');
      label.className='gameRadioOption';

      const radio=document.createElement('input');
      radio.type='radio';
      radio.name='hdgGameChoice';
      radio.value=opt.value;
      radio.checked=select.value===opt.value;

      const text=document.createElement('span');
      text.textContent=opt.textContent;

      radio.addEventListener('change',()=>{
        if(!radio.checked)return;
        select.value=radio.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
      });

      label.append(radio,text);
      wrap.appendChild(label);
    });

    select.insertAdjacentElement('afterend',wrap);

    select.addEventListener('change',()=>{
      wrap.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=r.value===select.value);
    });
  }

  buildGameRadios();
})();
