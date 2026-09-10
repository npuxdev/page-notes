let writes = Promise.resolve();
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (sender.id !== chrome.runtime.id) return;
  const execute = async () => {
    if (msg.type === 'screenshot:capture') return captureScreenshot(msg, sender);
    const key = `draft:${sender.tab?.id ?? 'manager'}:${msg.url || ''}`;
    if (msg.type === 'draft:get') return (await chrome.storage.local.get(key))[key] || null;
    if (msg.type === 'draft:put') { await chrome.storage.local.set({[key]:msg.data}); return true; }
    if (msg.type === 'backlog:list') { const all = await chrome.storage.local.get(null); return Object.entries(all).filter(([k]) => k.startsWith('backlog:')).map(([,v])=>v).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)); }
    if (msg.type === 'backlog:save') { const item={...msg.data,updatedAt:new Date().toISOString()}; await chrome.storage.local.set({['backlog:'+item.id]:item}); return item; }
    if (msg.type === 'backlog:delete') { await chrome.storage.local.remove('backlog:'+msg.id); return true; }
    throw new Error('Unknown operation');
  };
  writes = writes.then(execute, execute);
  writes.then(data=>reply({ok:true,data}), e=>reply({ok:false,error:e.message}));
  return true;
});
chrome.tabs.onRemoved.addListener(tabId => {
  writes = writes.then(async()=>{const all=await chrome.storage.local.get(null); await chrome.storage.local.remove(Object.keys(all).filter(k=>k.startsWith(`draft:${tabId}:`)));}).catch(console.error);
});

let lastCapture=0;
async function captureScreenshot(msg,sender){
  if(!sender.tab?.id)throw new Error('Capture screenshots from the original webpage.');
  const tab=await chrome.tabs.get(sender.tab.id);
  if(!tab.active)throw new Error('Keep the inspected tab active while capturing.');
  if(Date.now()-lastCapture<600)throw new Error('Wait a moment before capturing another view.');
  lastCapture=Date.now();
  const raw=await chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'});
  const active=await chrome.tabs.query({active:true,windowId:tab.windowId});
  if(active[0]?.id!==tab.id)throw new Error('The active tab changed. Please capture again.');
  const bitmap=await createImageBitmap(await (await fetch(raw)).blob());
  const scale=Math.min(1,1800/bitmap.width),width=Math.round(bitmap.width*scale),height=Math.round(bitmap.height*scale);
  const canvas=new OffscreenCanvas(width,height),ctx=canvas.getContext('2d');
  ctx.drawImage(bitmap,0,0,width,height);bitmap.close();
  const sx=width/msg.viewport.width,sy=height/msg.viewport.height;
  ctx.lineWidth=Math.max(2,2*sx);ctx.font=`bold ${Math.max(14,14*sx)}px sans-serif`;ctx.textBaseline='middle';
  for(const a of msg.annotations){
    if(!a.bounds||a.visibility==='off-screen'||a.visibility==='missing')continue;
    const r=a.bounds,x=r.x*sx,y=r.y*sy,w=r.width*sx,h=r.height*sy;
    ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(5,5*sx);ctx.strokeRect(x,y,w,h);
    ctx.strokeStyle='#087c59';ctx.lineWidth=Math.max(2,2*sx);ctx.strokeRect(x,y,w,h);
    const label=String(a.number),pad=7*sx,bw=ctx.measureText(label).width+pad*2,bh=Math.max(24,24*sx);
    const bx=Math.max(0,Math.min(width-bw,x)),by=Math.max(0,Math.min(height-bh,y));
    ctx.fillStyle='#087c59';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#ffffff';ctx.fillText(label,bx+pad,by+bh/2);
  }
  const blob=await canvas.convertToBlob({type:'image/jpeg',quality:.88});
  const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return {id:crypto.randomUUID(),capturedAt:new Date().toISOString(),pageUrl:msg.url,viewport:msg.viewport,scroll:msg.scroll,annotations:msg.annotations,image:{width,height,scaleX:sx,scaleY:sy},imageDataUrl:'data:image/jpeg;base64,'+btoa(binary)};
}
