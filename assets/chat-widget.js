
(() => {
 const footer=document.querySelector(".site-footer");if(!footer)return;
 const button=document.createElement("button"),status=document.createElement("p");
 button.type="button";button.className="support-launcher";button.textContent="Open support chat";
 status.className="support-status";status.setAttribute("role","status");status.textContent="Chat loads only when requested. Email info@microcdlabs.com is also available.";
 footer.append(button,status);
 let loading;
 function load(){
  if(typeof window.zE==="function")return Promise.resolve();
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const script=document.createElement("script");script.id="ze-snippet";script.src="https://static.zdassets.com/ekr/snippet.js?key=f6f042c5-f6ce-4381-8555-2da23e6aebd1";
   script.onload=()=>{clearTimeout(timer);if(typeof window.zE==="function")resolve();else reject(Error("unavailable"));};
   script.onerror=()=>{clearTimeout(timer);script.remove();loading=null;reject(Error("blocked"));};
   const timer=setTimeout(()=>{script.remove();loading=null;reject(Error("timeout"));},12000);document.body.append(script);
  });return loading;
 }
 let bound=false;
 button.addEventListener("click",async()=>{
  button.disabled=true;button.setAttribute("aria-busy","true");status.textContent="Loading support chat…";
  try{await load();window.zE("messenger:set","customization",{position:{side:"left"}});
   if(!bound){window.zE("messenger:on","close",()=>{window.zE("messenger","hide");button.focus();});bound=true;}
   window.zE("messenger","show");window.zE("messenger","open");
   status.textContent="Support chat opened. Close it to return here.";
  }catch{status.textContent="Chat could not load. Email info@microcdlabs.com directly; no message was sent.";}
  finally{button.disabled=false;button.removeAttribute("aria-busy");}
 });
})();
