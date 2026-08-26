/* Hebrew RTL money display + Hebrew JPG sharing. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .archiveMoney th:last-child,.archiveMoney td:last-child,
    #closeSummary th:last-child,#closeSummary td:last-child,
    #moneySummary th:last-child,#moneySummary td:last-child{
      direction:ltr;unicode-bidi:isolate;text-align:right
    }
  `;
  document.head.appendChild(style);

  function safeArray(v){return Array.isArray(v)?v:[]}
  function safeObj(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
  function price(){try{return Number(PRICE)||25}catch(e){return 25}}
  function normalizeNight(n){
    n=n||{};
    const games=safeArray(n.games);
    let players=safeArray(n.players).filter(Boolean);
    const rebuys=safeObj(n.rebuys),cashout=safeObj(n.cashout);
    if(!players.length){
      const set=new Set();
      games.forEach(g=>safeArray(g.players).forEach(p=>set.add(p)));
      Object.keys(rebuys).forEach(p=>set.add(p));
      Object.keys(cashout).forEach(p=>set.add(p));
      players=[...set];
    }
    return {...n,games,players,rebuys,cashout};
  }
  function netFor(n,p){return Number(n.cashout[p]||0)-Number(n.rebuys[p]||0)*price()}
  function fmt(v){v=Number(v)||0;return v>0?`+${v}₪`:v<0?`-${Math.abs(v)}₪`:'0₪'}
  function dateOf(n){return String(n.night_date||n.date||'')}

  async function createHebrewNightJpg(raw){
    const n=normalizeNight(raw);
    const rows=n.players.map(p=>({name:String(p),amount:netFor(n,p)}));
    const width=1200,rowH=82,height=290+rows.length*rowH+70;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d');
    const grad=ctx.createLinearGradient(0,0,width,height);grad.addColorStop(0,'#07111f');grad.addColorStop(1,'#111827');
    ctx.fillStyle=grad;ctx.fillRect(0,0,width,height);

    ctx.direction='rtl';ctx.textAlign='right';ctx.fillStyle='#f8fafc';ctx.font='bold 54px Arial';
    ctx.fillText('קבוצת חארבו דארבו',1120,88);
    ctx.fillStyle='#cbd5e1';ctx.font='28px Arial';
    ctx.fillText(`סיכום כספי  •  ${dateOf(n)}`,1120,136);

    ctx.strokeStyle='rgba(148,163,184,.22)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(70,176);ctx.lineTo(1130,176);ctx.stroke();

    ctx.fillStyle='#fbbf24';ctx.font='bold 27px Arial';ctx.direction='rtl';ctx.textAlign='right';
    ctx.fillText('שחקן',1080,225);
    ctx.fillText('סכום',405,225);

    rows.forEach((r,i)=>{
      const y=285+i*rowH;
      ctx.fillStyle='#f8fafc';ctx.font='bold 30px Arial';ctx.direction='rtl';ctx.textAlign='right';
      ctx.fillText(r.name,1080,y);

      ctx.fillStyle=r.amount>0?'#4ade80':r.amount<0?'#f87171':'#e2e8f0';
      ctx.font='bold 31px Arial';ctx.direction='ltr';ctx.textAlign='left';
      ctx.fillText(fmt(r.amount),210,y);

      ctx.strokeStyle='rgba(148,163,184,.12)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(90,y+28);ctx.lineTo(1110,y+28);ctx.stroke();
    });
    return await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.94));
  }

  async function shareNight(raw){
    const n=normalizeNight(raw),blob=await createHebrewNightJpg(n),date=dateOf(n).replaceAll('/','-')||'ערב';
    const file=new File([blob],`חארבו-דארבו-${date}.jpg`,{type:'image/jpeg'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      try{await navigator.share({files:[file],title:'קבוצת חארבו דארבו'});return}catch(e){if(e.name==='AbortError')return}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
    alert('הדפדפן לא תומך בשיתוף תמונה ישיר, לכן קובץ ה-JPG הורד למכשיר.');
  }

  async function copyNight(raw){
    const blob=await createHebrewNightJpg(raw);
    try{
      if(!navigator.clipboard||typeof ClipboardItem==='undefined')throw new Error();
      const img=await createImageBitmap(blob),c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);
      const png=await new Promise(resolve=>c.toBlob(resolve,'image/png'));
      await navigator.clipboard.write([new ClipboardItem({'image/png':png})]);
      alert('התמונה הועתקה. אפשר להדביק אותה ישירות ב-WhatsApp Web.');
    }catch(e){alert('הדפדפן הזה לא תומך בהעתקת תמונה ישירות. השתמש בכפתור שיתוף JPG.');}
  }

  function currentNight(){try{return {...state,night_date:state.date}}catch(e){return {}}}
  window.createSettlementJpg=()=>createHebrewNightJpg(currentNight());
  window.shareWhatsApp=()=>shareNight(currentNight());
  const currentShare=document.getElementById('shareWhatsAppBtn');
  if(currentShare)currentShare.onclick=window.shareWhatsApp;

  let cachedNights=[];
  async function getNights(){
    try{
      const rows=await rpc('hdg_get_old_nights',{p_group_key:groupKey});
      cachedNights=safeArray(rows).map(normalizeNight);
    }catch(e){}
    return cachedNights;
  }

  function bindOverlay(n){
    const share=document.getElementById('shareOldNight');if(share)share.onclick=()=>shareNight(n);
    const copy=document.getElementById('copyOldNight');if(copy)copy.onclick=()=>copyNight(n);
  }

  async function bindArchive(){
    const nights=await getNights();
    document.querySelectorAll('#oldNightsList .archiveItem').forEach((item,i)=>{
      const n=nights[i];if(!n)return;
      const share=item.querySelector('[data-share]');if(share)share.onclick=()=>shareNight(n);
      const copy=item.querySelector('[data-copy]');if(copy)copy.onclick=()=>copyNight(n);
      const details=item.querySelector('[data-details]');
      if(details&&!details.dataset.heShareBound){
        details.dataset.heShareBound='1';
        const original=details.onclick;
        details.onclick=function(e){const r=original?original.call(this,e):undefined;setTimeout(()=>bindOverlay(n),0);return r};
      }
    });
  }

  const originalLoad=window.loadOldNights;
  if(typeof originalLoad==='function'){
    window.loadOldNights=async function(){
      const result=await originalLoad.apply(this,arguments);
      await bindArchive();
      return result;
    };
  }
})();
