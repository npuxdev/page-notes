(() => {
  if(globalThis.__pageNotes && globalThis.__pageNotes()) return;
  document.querySelectorAll('#page-notes-extension').forEach(node=>{node.dispatchEvent(new Event('page-notes-dispose'));node.remove();});
  const events=new AbortController();
  const listen=(target,type,handler,capture=false)=>target.addEventListener(type,handler,{capture,signal:events.signal,passive:type==='wheel'?false:undefined});
  const C=globalThis.PageNotesCore, manager=location.protocol==='chrome-extension:', round=n=>Math.round(n*100)/100;
  const host=document.createElement('div'); host.id='page-notes-extension';
  host.style.cssText='all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;';
  document.documentElement.append(host); const ui=host.attachShadow({mode:'open'});
  const iconMinus='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  const iconClose='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  ui.innerHTML=`<style>
  :host{all:initial;font:13px/1.4 system-ui,sans-serif;color:#ebf3f4;color-scheme:dark}*{box-sizing:border-box}button,input,textarea{font:inherit}button{cursor:pointer;border:1px solid #3a505f;background:#233643;color:#edf4f5;border-radius:8px;padding:7px 10px;transition:transform 160ms cubic-bezier(0.23,1,0.32,1),background 120ms ease,opacity 120ms ease}button:hover{background:#354e5d}button:active{transform:scale(0.96)}button:focus-visible,input:focus,textarea:focus{outline:2px solid #8eeac5;outline-offset:2px}.button-icon{display:inline-flex;align-items:center;justify-content:center;gap:7px}.button-icon svg,.icon-btn svg{width:16px;height:16px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}button:disabled{opacity:.4;cursor:default;transform:none}.primary{background:#9ae9c6;color:#11291f;border-color:#9ae9c6;font-weight:700}.primary:hover{background:#c0f9df}.icon-btn{width:40px;height:40px;padding:0;display:inline-flex;align-items:center;justify-content:center}.row{display:flex;gap:8px;align-items:center}.row>*{min-width:0}.spread{justify-content:space-between}.spread>button{flex-shrink:0}h1{font-size:18px;margin:0}h2{font-size:15px;margin:0 0 10px}p{margin:8px 0;color:#b0c1ca}small{font-size:11px;color:#a6b9c4}
  .panel{font:13px/1.4 system-ui,sans-serif;color:#ebf3f4;color-scheme:dark;pointer-events:auto;position:fixed;right:12px;top:12px;bottom:12px;width:min(370px,calc(100vw - 24px));border:1px solid #39505d;border-radius:16px;background:#12212d;box-shadow:0 16px 70px #0006;display:flex;flex-direction:column;overflow:hidden}
  .panel.wide{width:min(760px,calc(100vw - 32px));left:50%;right:auto;transform:translateX(-50%)}
  header{padding:12px 14px;border-bottom:1px solid #2a404d}nav{padding:8px 14px;display:flex;gap:8px}nav button[aria-pressed=true]{background:#38594e;border-color:#8eeac5}
  .body{padding:0 14px 12px;overflow:auto;flex:1}.section{padding:10px 0;border-bottom:1px solid #2a404d}
  textarea,input{display:block;width:100%;background:#0c1923;border:1px solid #3b5260;color:#edf4f5;border-radius:8px;padding:8px;margin:5px 0;resize:vertical}textarea{min-height:58px}#reviewName{margin:8px 0 0;font-weight:600}label{display:block;font-size:12px;color:#c4d2d8}
  .card{padding:9px;background:#1c303e;border:1px solid #344d5c;border-radius:10px;margin:8px 0;overflow-wrap:anywhere}.card p{white-space:pre-wrap}
  .badge{color:#9ae9c6;font:12px ui-monospace,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.empty{padding:14px 10px;text-align:center;color:#a7bbc5;border:1px dashed #3b5260;border-radius:10px;margin:12px 0}
  .actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.actions button{font-size:12px}.more{position:relative}.more summary{list-style:none;padding:7px 10px;border:1px solid #3a505f;border-radius:8px;background:#233643;color:#edf4f5}.more summary::-webkit-details-marker{display:none}.more[open] summary{background:#354e5d}.more .menu{position:absolute;right:0;top:100%;margin-top:4px;background:#12212d;border:1px solid #3a505f;border-radius:8px;padding:4px;z-index:2;min-width:120px}.more .menu button{width:100%;text-align:left;background:transparent;border:0;color:#f3b4b4}
  footer{padding:10px 14px;border-top:1px solid #344956;background:#172934}footer .row button{flex:1}#status{font-size:12px;min-height:18px;margin-top:8px;color:#bdeed8}#status:empty{display:none}
  .box{position:fixed;pointer-events:none;border:2px solid #83ebbd;background:#83ebbd20;border-radius:3px}.box.hover{border-color:#ffcc78;background:#ffcc7818}.box.queued{border-style:dashed;opacity:.85}.box.region{border-style:dashed;border-color:#ffcc78;background:#ffcc7814}
  .box span{position:absolute;left:0;top:0;background:#91e9c2;color:#12271e;font:bold 11px system-ui;padding:2px 5px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.box.hover span{background:#ffcc78}.crumb{position:fixed;pointer-events:none;background:#12212d;color:#ebf3f4;border:1px solid #ffcc78;border-radius:8px;padding:4px 8px;font:11px system-ui;max-width:280px}
  .resume{position:fixed;right:12px;top:12px;display:flex;gap:4px;pointer-events:auto;background:#142834;color:#ebf3f4;font:13px system-ui;padding:4px;border-radius:10px;box-shadow:0 4px 20px #0004}
  [hidden]{display:none!important}#exportText{height:200px;font:12px/1.5 ui-monospace,monospace}.hint{font-size:12px}
  .shot{margin:8px 0}.shot img,.thumb{display:block;width:100%;max-height:140px;object-fit:contain;border-radius:8px;border:1px solid #496573}.shot figcaption,.shot-missing{font-size:11px;color:#b0c1ca;margin-top:5px}.shot-missing{color:#ffd195}
  summary{cursor:pointer;color:#b5d8c9;font-size:12px;padding:7px 0}.element-note textarea{min-height:42px}.locator{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:block}
  #pageTitle{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px}#markdownPreview{margin:8px 0}
  .glass-note{position:fixed;pointer-events:auto;background:#12212d;border:2px solid #9ae9c6;border-radius:12px;padding:10px;box-shadow:0 10px 40px #0005;color:#ebf3f4;font:13px/1.4 system-ui;z-index:2;max-height:calc(100vh - 24px);overflow:auto;opacity:1;transform:scale(1);transition:opacity 180ms cubic-bezier(0.23,1,0.32,1),transform 180ms cubic-bezier(0.23,1,0.32,1)}
  .glass-note textarea{min-height:72px}.glass-note .actions{justify-content:flex-end}
  @starting-style{.glass-note{opacity:0;transform:scale(0.97)}}
  .inline-copy{position:fixed;pointer-events:auto;background:#12212d;border:2px solid #9ae9c6;border-radius:9px;padding:8px;box-shadow:0 10px 40px #0005;color:#ebf3f4;font:13px/1.4 system-ui}.inline-copy textarea{box-sizing:border-box;margin:0 0 8px;width:100%;max-height:50vh;min-height:48px;resize:vertical;background:#fff;color:#17232b}.inline-copy small{display:block;margin:5px 0}.inline-copy .actions{justify-content:flex-end}
  .copy-ghost{position:fixed;pointer-events:none;background:#9ae9c6f2;color:#11291f;border-radius:4px;padding:16px 8px 4px;overflow:visible;outline:2px dashed #087c59;min-width:132px}.copy-ghost small{position:absolute;left:0;top:0;display:block;font-size:10px;color:#1a3d30;padding:2px 8px;white-space:nowrap}
  #regionDraft{position:fixed;pointer-events:none;border:2px dashed #ffcc78;background:#ffcc7818;border-radius:3px}
  @media (prefers-reduced-motion:reduce){button,.glass-note{transition:opacity 120ms ease,background 120ms ease;transform:none!important}button:active{transform:none}}
  </style>
  <div id="marks"></div><div id="regionDraft" hidden></div>
  <div class="resume" hidden><button id="resume">Resume notes</button><button id="stop" class="icon-btn" aria-label="Close Page Notes" title="Close Page Notes">${iconClose}</button></div>
  <section id="glass" class="glass-note" hidden aria-label="Note on the page"><div id="selected"></div><label id="groupLabel">What should change, and why?<textarea id="comment" placeholder="What should change, and why?"></textarea></label><p class="hint" id="glassHint">Click another control to group it. Alt-scroll changes the target. Drag to mark empty space.</p><div class="actions"><button id="cancel">Cancel</button><button id="add" class="primary">Add note</button></div></section>
  <section class="panel ${manager?'wide':''}" aria-label="Page Notes feedback"><header><div class="row spread"><h1>Page Notes</h1><div class="row"><button id="minimize" class="icon-btn" aria-label="Minimize panel" title="Hide the panel">${iconMinus}</button><button id="close" class="icon-btn" aria-label="Close Page Notes" title="Close; reopen from the extension toolbar">${iconClose}</button></div></div><input id="reviewName" aria-label="Review name" placeholder="Name this review"><small id="pageTitle"></small></header><nav><button id="queueTab" aria-pressed="true">Queue</button><button id="backlogTab" aria-pressed="false">Backlog</button></nav><div class="body"><div id="queueView"><div class="section" id="composer"><div class="row spread"><button id="pick" class="primary">Point</button><small id="selectionCount">0 selected</small></div><p class="hint">Click to point. Double-click to edit copy. Drag empty space. Esc to finish.</p></div><div class="section" id="queueSection"><div class="row spread"><h2 id="queueHeading">Notes</h2><button id="new">New review</button></div><div id="groups"></div></div><div id="exportView" hidden><div class="row spread"><h2>Send to agent</h2><button id="backToQueue">Back to queue</button></div><details id="markdownPreview"><summary>Preview Markdown</summary><textarea id="exportText" readonly aria-label="Exported Markdown"></textarea></details><div class="actions"><button id="copy" class="primary button-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><span>Copy for Cursor</span></button><button id="download" class="button-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg><span>Download packet</span></button></div><details><summary>More formats</summary><div class="actions"><button id="downloadMd">Markdown only</button></div><p class="hint">The packet ZIP includes screenshots and locators. Markdown only is the written instructions.</p></details></div></div><div id="backlogView" hidden><h2>Saved reviews</h2><p class="hint">Named reviews stay in this Chrome profile. Opening one continues that review.</p><div id="backlog"></div></div></div><footer><div class="row"><button id="copyAgent" class="primary">Copy for Cursor</button><button id="export">Review packet</button></div><div class="row" style="margin-top:8px"><button id="save">Save review</button></div><div id="status" role="status" aria-live="polite"></div></footer></section>`;
  const $=s=>ui.querySelector(s), panel=$('.panel');
  panel.inert=true;
  let capturing=false,copyEditor=null,lastClick=null,glassOpen=false,hoverChain=[],depthIndex=0,drag=null,drewRegion=false;
  const pageTitle=manager?'Saved feedback':document.title;
  let data={id:crypto.randomUUID(),url:manager?'':location.href,title:pageTitle,name:pageTitle,groups:[]}, selected=[], refs=new Map(), picking=false, hovered=null, editId=null, view='queue', storageChain=Promise.resolve();
  const rpc=async(type,extra={})=>{const r=await chrome.runtime.sendMessage({type,...extra});if(!r?.ok)throw new Error(r?.error||'Extension disconnected. Reload the page.');return r.data;};
  const status=s=>$('#status').textContent=s;
  const guard=fn=>async(...args)=>{try{await fn(...args);}catch(e){status(e.message);}};
  const persist=()=>{const snapshot=JSON.parse(JSON.stringify({...data,selected,editId,pendingComment:$('#comment').value})); const url=location.href;storageChain=storageChain.then(()=>rpc('draft:put',{url,data:snapshot})).catch(e=>status('Draft could not be saved: '+e.message));};
  const remember=()=>{if(manager||!data.groups.length)return;storageChain=storageChain.then(()=>rpc('backlog:save',{data})).catch(e=>status(e.message));};
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(label,fn)=>{const b=el('button',label);b.onclick=guard(fn);return b;};
  const update=()=>{persist();if(!$('#exportView').hidden)show('queue');};
  function resolve(e){try{if(e.region||!e.css)return null;let root=document;for(const selector of e.shadowHosts||[]){root=root.querySelector(selector)?.shadowRoot;if(!root)return null;} const matches=root.querySelectorAll(e.css); if(matches.length===1)return matches[0];if(e.xpath)return document.evaluate(e.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;}catch{}return null;}
  function chainFrom(node){const chain=[];let n=node;while(n&&n.nodeType===1&&n!==document.documentElement){if(n.id!=='page-notes-extension')chain.push(n);n=n.parentElement||n.getRootNode()?.host||null;}return chain;}
  function hoverLabel(node){if(!node)return '';const text=(node.getAttribute?.('aria-label')||node.innerText||node.textContent||'').replace(/\s+/g,' ').trim().slice(0,48);return text||node.localName;}
  function regionBox(e){const d=e.region?.document||e.region?.viewport;if(!d)return null;return{x:d.x-(e.region.document?scrollX:0),y:d.y-(e.region.document?scrollY:0),width:d.width,height:d.height};}
  function paintBox(r,label,kind){if(!r||r.width<=0||r.height<=0)return;const b=el('div',undefined,'box'+(kind?' '+kind:''));b.style.cssText=`left:${r.x}px;top:${r.y}px;width:${r.width}px;height:${r.height}px`;b.append(el('span',label));$('#marks').append(b);}
  function draw(){
    const marks=$('#marks');marks.replaceChildren();
    if(copyEditor||!life.state.engaged)return;
    const show= !panel.hidden || picking || glassOpen || data.groups.length;
    if(!show)return;
    data.groups.forEach((g,gi)=>g.elements.forEach((e,ei)=>{
      const label=g.elements.length===1?String(gi+1):`${gi+1}.${ei+1}`;
      if(e.region)paintBox(regionBox(e),label, 'queued region');
      else {const t=refs.get(e.id)||resolve(e);if(t?.isConnected)paintBox(t.getBoundingClientRect(),label,'queued');}
      if(g.type==='copy'&&e.copyEdit){const t=refs.get(e.id)||resolve(e);if(!t?.isConnected)return;const r=t.getBoundingClientRect(),ghost=el('div',undefined,'copy-ghost');ghost.append(el('small','Proposed copy'),document.createTextNode(e.copyEdit.replacementText));ghost.style.cssText=`left:${r.x}px;top:${r.y}px;width:${Math.max(r.width,48)}px;min-height:${r.height}px;font:${getComputedStyle(t).font}`;marks.append(ghost);}
    }));
    selected.forEach((e,i)=>{
      if(e.region)paintBox(regionBox(e),String(i+1),'region');
      else {const t=refs.get(e.id)||resolve(e);if(t?.isConnected)paintBox(t.getBoundingClientRect(),String(i+1));}
    });
    if(picking&&hovered){const already=selected.some(x=>refs.get(x.id)===hovered);if(!already)paintBox(hovered.getBoundingClientRect(),hoverLabel(hovered),'hover');
      const r=hovered.getBoundingClientRect(),crumb=el('div',`${hoverLabel(hovered)}${hoverChain.length>1?`  ·  Alt-scroll (${depthIndex+1}/${hoverChain.length})`:''}`,'crumb');
      crumb.style.cssText=`left:${Math.min(r.x,innerWidth-260)}px;top:${Math.max(8,r.y-28)}px`;marks.append(crumb);}
    if(glassOpen)placeGlass();
  }
  function placeGlass(){const glass=$('#glass');if(glass.hidden||!selected.length)return;const first=selected[0];let r=first.region?regionBox(first):null;if(!r){const t=refs.get(first.id)||resolve(first);r=t?.getBoundingClientRect()||{x:24,y:72,width:280,height:48};}const width=Math.min(340,innerWidth-24),left=Math.max(12,Math.min(r.x,innerWidth-width-12));let top=r.y+r.height+10;const h=Math.min(glass.offsetHeight||220,innerHeight-24);if(top+h>innerHeight-12)top=Math.max(12,r.y-h-10);glass.style.left=left+'px';glass.style.top=top+'px';glass.style.width=width+'px';glass.style.transformOrigin=`${Math.max(16,Math.min(width-16,(r.x+r.width/2)-left))}px 0`;}
  function openGlass(){if(manager||!selected.length)return;const glass=$('#glass');const first=!glassOpen;glass.hidden=false;glassOpen=true;placeGlass();if(first){if(!life.state.minimized)life.minimize();$('#comment').focus();}}
  function closeGlass(){$('#glass').hidden=true;glassOpen=false;}
  function renderSelected(){const root=$('#selected');root.replaceChildren();selected.forEach((e,i)=>{const card=el('div',undefined,'card');const row=el('div',undefined,'row spread');row.append(el('span',`${i+1}  ·  ${C.visibleLabel(e)}`,'badge'),button('Remove',()=>{selected=selected.filter(x=>x.id!==e.id);if(!selected.length){editId=null;$('#comment').value='';}renderSelected();update();}));const label=el('details',undefined,'element-note');label.open=!!e.comment;label.append(el('summary','Element note'));const input=el('textarea');input.value=e.comment;input.placeholder='Optional note for this element';input.oninput=()=>{e.comment=input.value;update();};label.append(input);card.append(row,label);if(e.copyEdit){const replacement=el('label','Replacement copy'),field=el('textarea');field.setAttribute('aria-label','Replacement copy');field.value=e.copyEdit.replacementText;field.oninput=()=>{e.copyEdit.replacementText=field.value;update();};replacement.append(field);card.append(replacement);}root.append(card);});$('#add').disabled=!selected.length;$('#add').textContent=editId?'Update note':'Add note';$('#selectionCount').textContent=`${selected.length} selected`;$('#groupLabel').hidden=!selected.length;$('#add').parentElement.hidden=!selected.length;if(selected.length)openGlass();else closeGlass();syncResume();draw();}
  function syncResume(){const notes=data.groups.length,sel=selected.length;$('#resume').textContent=sel?`Resume notes · ${sel} selected`:notes?`Resume notes · ${C.countLabel(notes,'note')}`:'Resume notes';}
  function kindOf(g){return g.type==='copy'?'Copy':g.elements.some(e=>e.region)?'Space':'Note';}
  function render(){ $('#pageTitle').textContent=data.title;$('#reviewName').value=data.name||data.title;$('#comment').value=$('#comment').value||'';$('#queueHeading').textContent=`Notes · ${data.groups.length}`;$('#new').hidden=!data.groups.length;const root=$('#groups');root.replaceChildren();if(!data.groups.length)root.append(el('div','Click something on the page to leave a note.','empty'));data.groups.forEach((g,i)=>{const card=el('div',undefined,'card');const shots=g.screenshots||[];card.append(el('span',`${kindOf(g)} ${String(i+1).padStart(2,'0')}  ·  ${C.countLabel(g.elements.length,'target')}`,'badge'),el('p',g.type==='copy'&&g.elements[0]?.copyEdit?C.copyInstruction(g.elements[0].copyEdit.replacementText):g.comment||g.elements.map(e=>e.comment).filter(Boolean).join(' · ')||'No instruction'),el('small',g.elements.map(C.visibleLabel).join(' · '),'locator'));if(shots[0]){const image=el('img');image.src=shots[0].imageDataUrl;image.alt='Annotated screenshot';image.className='thumb';card.append(image);}else card.append(el('p','Screenshot missing. Retry from this card.','shot-missing'));const actions=el('div',undefined,'actions');actions.append(button('Edit',()=>{if(selected.length&&!confirm('Replace the current unqueued selection?'))return;selected=structuredClone(g.elements);editId=g.id;$('#comment').value=g.comment;g.elements.forEach(e=>{const t=resolve(e);if(t)refs.set(e.id,t);});setPicking(true);renderSelected();persist();}));actions.append(button('Locate',()=>{if(data.url!==location.href){status('Open the original page to locate these elements.');return;}const first=g.elements[0];if(first?.region){const d=first.region.document;scrollTo({top:Math.max(0,d.y-120),behavior:'smooth'});hovered=null;draw();return;}const target=resolve(first);if(target){target.scrollIntoView({block:'center',behavior:'smooth'});hovered=target;setPicking(true);}else status('Element no longer matches. Re-select it on the current page.');}));actions.append(button(shots.length?'Add screenshot':'Retry screenshot',async()=>{if(data.url!==location.href||manager){status('Open the original page to capture another view.');return;}const shot=await takeScreenshot(g.elements);g.screenshots=[...(g.screenshots||[]),shot];render();update();remember();status('Annotated screenshot added.');}));const more=el('details',undefined,'more');more.append(el('summary','More'));const menu=el('div',undefined,'menu');menu.append(button('Remove',()=>{data.groups=data.groups.filter(x=>x.id!==g.id);if(editId===g.id)clear();render();update();remember();}));more.append(menu);actions.append(more);card.append(actions);
      const views=el('details');views.append(el('summary',C.countLabel(shots.length,'screenshot')));if(shots.length)card.append(views);
      shots.forEach((shot,index)=>{const figure=el('figure',undefined,'shot'),image=el('img');image.src=shot.imageDataUrl;image.alt=`Annotated view ${index+1}, numbered elements`;const caption=el('figcaption',`View ${index+1} · ${shot.annotations.filter(a=>a.visibility==='visible'||a.visibility==='partial').length} elements in view`);figure.append(image,caption,button('Remove view',()=>{g.screenshots.splice(index,1);render();update();remember();}));views.append(figure);});
      root.append(card);});$('#export').disabled=!data.groups.length;$('#copyAgent').disabled=!data.groups.length;$('#save').disabled=!data.groups.length;syncResume();renderSelected();}
  const life=globalThis.PageNotesLifecycle.create(state=>{
    picking=state.picking;if(!picking){hovered=null;hoverChain=[];depthIndex=0;}
    host.style.setProperty('display',state.engaged?'block':'none','important');
    panel.hidden=!state.engaged||state.minimized;$('.resume').hidden=!state.engaged||!state.minimized;
    $('#pick').textContent=picking?(selected.length?'Done':'Pointing'):'Point';$('#pick').classList.toggle('primary',!picking||!selected.length);$('#pick').setAttribute('aria-pressed',String(picking));draw();
  });
  function setPicking(on){life.select(on&&!manager);}
  function clear(){selected=[];editId=null;$('#comment').value='';closeGlass();renderSelected();update();}
  function close(){endCopyEditor();closeGlass();life.close();persist();}
  function dispose(){endCopyEditor();closeGlass();life.close();events.abort();host.remove();delete globalThis.__pageNotes;}
  function checkContext(){try{if(!chrome.runtime.id){dispose();return false;}}catch{dispose();return false;}return true;}
  globalThis.__pageNotes=()=>{if(!checkContext())return false;endCopyEditor();life.open();if(selected.length){setPicking(true);openGlass();}draw();return true;};
  if(manager){$('#close').hidden=true;$('#minimize').hidden=true;}
  $('#close').onclick=close;$('#stop').onclick=close;$('#minimize').onclick=()=>life.minimize();$('#resume').onclick=globalThis.__pageNotes;
  listen(host,'page-notes-dispose',dispose);
  listen(document,'visibilitychange',()=>{if(!checkContext())return;if(document.hidden&&!manager){endCopyEditor();life.leave();persist();}});
  listen(window,'focus',checkContext);
  listen(window,'pagehide',()=>{if(!manager){endCopyEditor();life.leave();}});
  $('#pick').onclick=()=>{if(data.url!==location.href){status('Start a new review on this page to point at elements.');return;}setPicking(!picking);};$('#pick').disabled=manager;
  $('#cancel').onclick=clear;
  $('#comment').oninput=()=>{update();};
  $('#reviewName').oninput=()=>{data.name=$('#reviewName').value;persist();remember();};
  $('#comment').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#add').click();}});
  async function takeScreenshot(elements){
    if(capturing)throw new Error('A screenshot is already being captured.');
    if(manager||data.url!==location.href)throw new Error('Capture screenshots on the original page.');
    capturing=true;const resumePick=picking;setPicking(false);panel.inert=true;host.style.setProperty('visibility','hidden','important');
    const beforeUrl=location.href;
    try{
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const viewport={width:innerWidth,height:innerHeight,devicePixelRatio},scroll={x:scrollX,y:scrollY};
      const annotations=elements.map((e,i)=>{
        if(e.region){const d=e.region.document;const bounds={x:round(d.x-scrollX),y:round(d.y-scrollY),width:d.width,height:d.height};const visible=bounds.width>0&&bounds.height>0&&bounds.x+bounds.width>0&&bounds.y+bounds.height>0&&bounds.x<innerWidth&&bounds.y<innerHeight;return{elementId:e.id,number:i+1,bounds,documentBounds:d,visibility:!visible?'off-screen':bounds.x<0||bounds.y<0||bounds.x+bounds.width>innerWidth||bounds.y+bounds.height>innerHeight?'partial':'visible'};}
        const target=refs.get(e.id)||resolve(e);if(!target?.isConnected)return{elementId:e.id,number:i+1,bounds:null,visibility:'missing'};const r=target.getBoundingClientRect();const bounds={x:round(r.x),y:round(r.y),width:round(r.width),height:round(r.height)};const visible=r.width>0&&r.height>0&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight;return{elementId:e.id,number:i+1,bounds,documentBounds:{...bounds,x:round(r.x+scrollX),y:round(r.y+scrollY)},visibility:!visible?'off-screen':r.left<0||r.top<0||r.right>innerWidth||r.bottom>innerHeight?'partial':'visible'};
      });
      if(!annotations.some(a=>a.visibility==='visible'||a.visibility==='partial'))throw new Error('Scroll a selected element into view, then capture again.');
      const shot=await rpc('screenshot:capture',{url:beforeUrl,viewport,scroll,annotations});
      if(location.href!==beforeUrl||scrollX!==scroll.x||scrollY!==scroll.y||innerWidth!==viewport.width||innerHeight!==viewport.height)throw new Error('The page moved during capture. Keep it still and try again.');
      return shot;
    }finally{host.style.removeProperty('visibility');panel.inert=false;capturing=false;if(resumePick&&!manager)setPicking(true);draw();}
  }
  async function commitGroup(){
    if(!selected.length)return;
    if(!$('#comment').value.trim()&&!selected.some(e=>e.comment.trim()||e.copyEdit||e.region)){status('Add a note about what should change.');return;}
    const prior=data.groups.find(g=>g.id===editId),same=prior&&prior.elements.map(e=>e.id).join()===selected.map(e=>e.id).join();
    const group={id:editId||crypto.randomUUID(),type:selected.length===1&&selected[0].copyEdit?'copy':selected.some(e=>e.region)?'region':'feedback',comment:$('#comment').value.trim(),elements:structuredClone(selected),screenshots:same?(prior.screenshots||[]):[]};
    let warning='';
    if(!same&&!manager&&data.url===location.href){status('Capturing annotated screenshot…');try{group.screenshots.push(await takeScreenshot(group.elements));}catch(e){warning=' Screenshot not captured: '+e.message;}}
    const index=data.groups.findIndex(g=>g.id===editId);if(index>=0)data.groups[index]=group;else data.groups.push(group);
    clear();setPicking(!manager);render();update();remember();status('Group saved to queue.'+warning);
  }
  $('#add').onclick=guard(commitGroup);
  $('#new').onclick=()=>{if((data.groups.length||selected.length)&&!confirm('Start a new review? Unsaved work in this queue will be replaced.'))return;data={id:crypto.randomUUID(),url:manager?'':location.href,title:manager?'Saved feedback':document.title,name:manager?'Saved feedback':document.title,groups:[]};clear();render();update();};
  function exportNow(){setPicking(false);closeGlass();$('#exportText').value=C.markdown(data);$('#composer').hidden=true;$('#queueSection').hidden=true;$('#exportView').hidden=false;$('.body').scrollTop=0;status('');}
  async function copyForCursor(){$('#exportText').value=C.markdown(data);await navigator.clipboard.writeText($('#exportText').value);const hasShots=data.groups.some(g=>g.screenshots?.length);if(hasShots)download(C.bundle(data),'zip');status(hasShots?'Copied for Cursor. Packet downloaded so you can attach screenshots.':'Copied for Cursor.');}
  $('#backToQueue').onclick=()=>show('queue');
  $('#export').onclick=()=>{show('queue');exportNow();};
  $('#copy').onclick=guard(copyForCursor);
  $('#copyAgent').onclick=guard(copyForCursor);
  function download(blob,extension){const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=`page-notes-${new Date().toISOString().slice(0,10)}.${extension}`;ui.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  $('#download').onclick=guard(()=>{download(C.bundle(data),'zip');status('Packet download started: Markdown, evidence, and screenshots.');});
  $('#downloadMd').onclick=()=>{download(new Blob([C.markdown(data)],{type:'text/markdown;charset=utf-8'}),'md');status('Markdown downloaded. Images and evidence require the packet.');};
  $('#save').onclick=guard(async()=>{await storageChain;await rpc('backlog:save',{data});status('Saved to this device.');if(view==='backlog')await loadBacklog();});
  async function loadBacklog(){const items=await rpc('backlog:list');const root=$('#backlog');root.replaceChildren();if(!items.length)root.append(el('div','Your saved reviews will appear here.','empty'));items.forEach(item=>{const card=el('div',undefined,'card');const name=item.name||item.title;card.append(el('h2',name),el('small',item.url),el('p',C.excerpt(item)||'No notes yet'),el('small',`${C.countLabel(item.groups.length,'note')} · ${new Date(item.updatedAt).toLocaleString()}`));const actions=el('div',undefined,'actions');actions.append(button('Open session',()=>{if((data.groups.length||selected.length)&&!confirm('Replace the current queue with this saved review?'))return;data=structuredClone(item);if(!data.name)data.name=data.title;clear();setPicking(false);show('queue');render();update();status('Review opened. New notes update this saved item.');}),button('Delete',async()=>{if(!confirm('Delete this saved review?'))return;await rpc('backlog:delete',{id:item.id});await loadBacklog();}));card.append(actions);root.append(card);});}
  function show(next){view=next;$('#composer').hidden=false;$('#queueSection').hidden=false;$('#exportView').hidden=true;$('#queueView').hidden=next!=='queue';$('#backlogView').hidden=next!=='backlog';$('#queueTab').setAttribute('aria-pressed',String(next==='queue'));$('#backlogTab').setAttribute('aria-pressed',String(next==='backlog'));if(next==='backlog'){setPicking(false);guard(loadBacklog)();}}
  $('#queueTab').onclick=()=>show('queue');$('#backlogTab').onclick=()=>show('backlog');
  const own=e=>e.composedPath().includes(host);
  const blockEvent=e=>{if(picking&&!own(e)){e.preventDefault();e.stopImmediatePropagation();}};
  ['pointerdown','pointerup','mousedown','mouseup','contextmenu'].forEach(type=>listen(document,type,e=>{
    if(type==='pointerdown'&&picking&&!own(e)&&!manager&&!copyEditor){drag={x:e.clientX,y:e.clientY,drawing:false};}
    if(type==='pointerup'&&drag){const draft=$('#regionDraft');if(drag.drawing){drewRegion=true;const x=Math.min(drag.x,e.clientX),y=Math.min(drag.y,e.clientY),width=Math.abs(e.clientX-drag.x),height=Math.abs(e.clientY-drag.y);if(width>=12&&height>=12&&data.url===location.href){selected.push(C.captureRegion({x,y,width,height}));renderSelected();update();status(`${selected.length} selected. Add a note about this space.`);}}draft.hidden=true;drag=null;}
    blockEvent(e);
  },true));
  listen(document,'pointermove',e=>{
    if(drag&&picking&&!own(e)){const w=e.clientX-drag.x,h=e.clientY-drag.y;if(!drag.drawing&&Math.hypot(w,h)>8)drag.drawing=true;if(drag.drawing){const draft=$('#regionDraft');draft.hidden=false;const x=Math.min(drag.x,e.clientX),y=Math.min(drag.y,e.clientY);draft.style.cssText=`left:${x}px;top:${y}px;width:${Math.abs(w)}px;height:${Math.abs(h)}px`;}}
    if(!picking||own(e)||copyEditor)return;
    if(e.altKey&&hoverChain.length)return;
    const node=e.composedPath().find(n=>n instanceof Element);
    hoverChain=chainFrom(node);depthIndex=0;hovered=hoverChain[0]||null;draw();
  },true);
  listen(document,'wheel',e=>{if(!picking||own(e)||!e.altKey||!hoverChain.length)return;e.preventDefault();depthIndex=Math.max(0,Math.min(hoverChain.length-1,depthIndex+(e.deltaY>0?1:-1)));hovered=hoverChain[depthIndex];draw();},true);
  listen(document,'click',e=>{if(!picking||own(e))return;blockEvent(e);if(drewRegion){drewRegion=false;return;}if(e.detail>1)return;if(data.url!==location.href){setPicking(false);status('The page URL changed. Start a new review to capture this page.');return;}const target=hovered&&hoverChain.includes(hovered)?hovered:e.composedPath().find(n=>n instanceof Element);if(!target)return;const existing=selected.find(x=>refs.get(x.id)===target||resolve(x)===target);lastClick={target,item:existing||null,wasSelected:!!existing};if(existing)selected=selected.filter(x=>x!==existing);else{const item=C.capture(target,e);refs.set(item.id,target);selected.push(item);lastClick.item=item;}renderSelected();update();status(`${selected.length} selected. Write the note on the page.`);},true);
  function endCopyEditor(){if(copyEditor){copyEditor.box.remove();copyEditor=null;}}
  function stayOnPage(){endCopyEditor();if(!manager){setPicking(true);life.minimize();draw();}}
  function beginCopyEditor(target,event){
    if(manager||data.url!==location.href)return;
    if(target.closest('input,textarea,select,script,style')||!target.textContent?.trim()){status('Double-click a text element, such as a heading, paragraph, or button label.');return;}
    const originalText=target.innerText??target.textContent;
    if(originalText.length>20000){status('Select a smaller text element for a copy edit.');return;}
    const item=selected.find(e=>refs.get(e.id)===target)|| (lastClick?.target===target?lastClick.item:null)||C.capture(target,event);
    refs.set(item.id,target);
    if(lastClick?.target===target){if(lastClick.wasSelected&&!selected.some(e=>e.id===item.id))selected.push(item);else if(!lastClick.wasSelected)selected=selected.filter(e=>e.id!==item.id);}
    renderSelected();persist();
    const rect=target.getBoundingClientRect(),box=el('section',undefined,'inline-copy');box.setAttribute('aria-label','Edit element copy');
    const field=el('textarea');field.setAttribute('aria-label','Replacement copy');field.value=originalText;
    const style=getComputedStyle(target);field.style.font=style.font;field.style.height=Math.min(Math.max(rect.height+18,60),innerHeight*.45)+'px';
    const width=Math.min(Math.max(rect.width+20,280),innerWidth-24),left=Math.max(12,Math.min(rect.x-10,innerWidth-width-12)),top=Math.max(12,Math.min(rect.y-8,innerHeight-200));
    box.style.cssText=`left:${left}px;top:${top}px;width:${width}px;max-height:calc(100vh - 24px);overflow:auto`;
    const hint=el('small','Copy only. Ctrl/Cmd+Enter to queue. Esc to cancel'),actions=el('div',undefined,'actions');
    const cancel=button('Cancel',()=>{stayOnPage();status('Copy edit cancelled.');});
    const save=button('Add copy edit',async()=>{
      if(!target.isConnected||location.href!==data.url){hint.textContent='The element or page changed. Cancel and select it again.';return;}
      if(field.value===originalText){hint.textContent='Change the text before adding a copy edit.';return;}
      const group=C.copyGroup(item,originalText,field.value);endCopyEditor();
      let warning='';try{group.screenshots.push(await takeScreenshot(group.elements));}catch(e){warning=' Screenshot not captured: '+e.message;}
      data.groups.push(group);selected=selected.filter(e=>e.id!==item.id);if(!selected.length)$('#comment').value='';render();update();remember();stayOnPage();status('Copy edit queued.'+warning);
    });save.className='primary';actions.append(cancel,save);box.append(field,hint,actions);ui.append(box);copyEditor={box};closeGlass();panel.hidden=true;$('.resume').hidden=true;$('#marks').replaceChildren();
    field.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();save.click();}});field.focus();field.select();
  }
  listen(document,'dblclick',e=>{if(!picking||own(e))return;e.preventDefault();e.stopImmediatePropagation();const target=hovered&&hoverChain.includes(hovered)?hovered:e.composedPath().find(n=>n instanceof Element);if(target)beginCopyEditor(target,e);},true);
  listen(document,'keydown',e=>{if(e.key==='Escape'&&life.state.engaged&&!manager){e.preventDefault();if(copyEditor){stayOnPage();status('Copy edit cancelled.');return;}if(glassOpen||selected.length){clear();setPicking(true);return;}life.escape();persist();}},true);
  let frame;const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};listen(window,'scroll',schedule,true);listen(window,'resize',schedule);
  life.open();
  if(!manager)setPicking(true);
  guard(async()=>{const saved=await rpc('draft:get',{url:location.href});if(saved){const {selected:pending=[],editId:editing=null,pendingComment='',...session}=saved;data=session;if(!data.name)data.name=data.title;selected=pending;editId=editing;$('#comment').value=pendingComment;}render();panel.inert=false;if(manager)show('backlog');if(selected.length&&!manager){setPicking(true);openGlass();}})().finally(()=>{panel.inert=false;});
})();
