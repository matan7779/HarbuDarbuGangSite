window.HDG_SUPABASE_URL = "https://avxsmtmjwnvfhvymoobd.supabase.co";
window.HDG_SUPABASE_KEY = "sb_publishable_A3fpigmRqjAS-cjCVvsSWg_uzZJ03bx";

// Standalone projector loads the Aviv-only winner media and hook.
if(/(?:^|\/)p\.html$/.test(location.pathname)){
  const media=document.createElement('script');
  media.src='aviv-special-media.js?v=1';
  media.onload=()=>{
    const hook=document.createElement('script');
    hook.src='p-aviv-special.js?v=2';
    document.head.appendChild(hook);
  };
  document.head.appendChild(media);
}
