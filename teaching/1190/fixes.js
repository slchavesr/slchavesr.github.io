/* v8: resilient navigation and inline math keyboard. */
(()=>{
 const $=id=>document.getElementById(id);
 const practiceCard=document.querySelector('#practicePanel article.problem');
 const topicSelect=$('topic');
 let selected=topicSelect.value||'graph';
 const labCard=document.querySelector('[data-topic="investigation"]');
 function showPanel(name){
   $('practicePanel').classList.toggle('hidden',name!=='practice');
   $('examPanel').classList.toggle('hidden',name!=='exam');
   $('practiceTab').classList.toggle('active',name==='practice');
   $('examTab').classList.toggle('active',name==='exam');
 }
 function highlight(type){document.querySelectorAll('#topics .topic').forEach(b=>b.classList.toggle('active',b.dataset.topic===type));}
 function selectTopic(type){
   showPanel('practice'); selected=type;highlight(type);
   if(type==='investigation'){
     practiceCard.classList.add('hidden');$('labPanel').classList.remove('hidden');
     try{newLab();}catch(err){console.error(err);$('labFeedback').textContent='Could not create this graph. Please try New graph investigation.';}
   }else{
     $('labPanel').classList.add('hidden');practiceCard.classList.remove('hidden');
     topicSelect.value=type;
     try{advancedNext();}catch(err){console.error('Topic generation:',type,err);$('feedback').textContent='This question could not load. Try New problem.';}
   }
 }
 $('topics').addEventListener('click',e=>{const b=e.target.closest('button[data-topic]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();selectTopic(b.dataset.topic);},true);
 $('newProblem').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();selectTopic(selected);},true);
 $('newLab').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();selectTopic('investigation');},true);
 $('practiceTab').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();selectTopic(selected);},true);
 $('examTab').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showPanel('exam');},true);
 $('startExam').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();try{startExam();}catch(err){console.error('Exam generation:',err);$('examResults').textContent='Could not generate the exam. Please try again.';}},true);
 // The old sketch checker supports quadratic f' only. For other derivatives,
 // show a fully usable manual sketch canvas rather than an empty region.
 const oldNewLab=newLab;
 newLab=function(){oldNewLab();if(currentLab?.noCubicSketch){
    const host=$('labSketch');host.innerHTML=`<p class="muted">Draw a possible graph of f. This freehand sketch is for self-assessment; the written parts are checked separately.</p><div class="sketch-controls"><button type="button" id="labUndo">Undo</button><button type="button" id="labClear">Clear</button></div><svg id="labCanvas" viewBox="0 0 700 360" style="width:100%;background:white;touch-action:none;border:1px solid #b9c6d4;border-radius:8px"></svg>`;
    const svg=$('labCanvas'),NS='http://www.w3.org/2000/svg';let paths=[],drawing=null;
    const mk=(tag,attrs)=>{let n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));svg.append(n);return n;};
    function draw(){svg.replaceChildren();for(let x=50;x<700;x+=50){mk('line',{x1:x,x2:x,y1:0,y2:360,stroke:'#e2e8f0'});mk('text',{x:x+2,y:192,fill:'#64748b','font-size':11}).textContent=(x-350)/50;}for(let y=30;y<360;y+=30){mk('line',{x1:0,x2:700,y1:y,y2:y,stroke:'#e2e8f0'});mk('text',{x:354,y:y-3,fill:'#64748b','font-size':11}).textContent=(180-y)/30;}mk('line',{x1:350,x2:350,y1:0,y2:360,stroke:'#475569','stroke-width':2});mk('line',{x1:0,x2:700,y1:180,y2:180,stroke:'#475569','stroke-width':2});for(const pts of [...paths,...(drawing?[drawing]:[])])if(pts.length>1)mk('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#2563eb','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});}
    const pos=e=>{let r=svg.getBoundingClientRect();return [(e.clientX-r.left)*700/r.width,(e.clientY-r.top)*360/r.height];};
    svg.onpointerdown=e=>{drawing=[pos(e)];svg.setPointerCapture(e.pointerId);draw();};svg.onpointermove=e=>{if(!drawing)return;drawing.push(pos(e));draw();};svg.onpointerup=()=>{if(drawing){paths.push(drawing);drawing=null;draw();}};svg.onpointercancel=svg.onpointerup;
    $('labUndo').onclick=()=>{paths.pop();draw();};$('labClear').onclick=()=>{paths=[];drawing=null;draw();};draw();
    $('labSketchCheck').disabled=true;$('labSketchReset').disabled=false;$('labSketchReset').onclick=()=>{$('labClear').click();};
 }};
 // On-demand editor: keyboard icon attached to every answer text field.
 const styles=document.createElement('style');styles.textContent='.math-input-wrap{display:flex;align-items:center;gap:5px;max-width:100%}.math-input-wrap>input{flex:1;min-width:0}.math-keyboard{flex:0 0 auto!important;padding:7px 10px!important;font-size:18px!important}.math-popover{margin:7px 0 12px;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#f8fafc}.math-popover math-field{width:100%;min-height:48px;background:white}.math-popover .muted{font-size:12px}';document.head.append(styles);
 let loading=null;
 async function loadEditor(){if(customElements.get('math-field'))return true;if(!loading)loading=import('https://cdn.jsdelivr.net/npm/mathlive@0.104.2/+esm').catch(()=>null);await loading;return !!customElements.get('math-field');}
 async function openKeyboard(input,wrap){let panel=wrap.nextElementSibling;if(panel?.classList.contains('math-popover')){panel.remove();return;}panel=document.createElement('div');panel.className='math-popover';panel.textContent='Loading equation keyboard…';wrap.after(panel);
  if(!await loadEditor()){panel.textContent='Equation keyboard could not load. You can type your answer normally.';return;}
  panel.innerHTML='<math-field math-virtual-keyboard-policy="manual"></math-field><div class="muted">Use the math keyboard or type directly. Your answer is copied into the field above.</div>';
  let mf=panel.querySelector('math-field');mf.value=input.value||'';mf.addEventListener('input',()=>{input.value=mf.value;input.dispatchEvent(new Event('input',{bubbles:true}));});mf.focus();try{mf.executeCommand('showVirtualKeyboard');window.mathVirtualKeyboard?.show();}catch(e){}
 }
 function enhance(root){root.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])').forEach(input=>{
  if(input.closest('.math-input-wrap')||input.id==='fallback'||input.id==='answer'||input.closest('#topics'))return;
  const wrap=document.createElement('span');wrap.className='math-input-wrap';input.before(wrap);wrap.append(input);const btn=document.createElement('button');btn.type='button';btn.className='math-keyboard secondary';btn.textContent='⌨';btn.title='Open equation keyboard';btn.setAttribute('aria-label','Open equation keyboard');wrap.append(btn);btn.addEventListener('click',()=>openKeyboard(input,wrap));
 });}
 const observer=new MutationObserver(()=>{observer.disconnect();enhance($('practicePanel'));enhance($('examPanel'));observer.observe(document.querySelector('main'),{childList:true,subtree:true});});observer.observe(document.querySelector('main'),{childList:true,subtree:true});enhance(document.querySelector('main'));
 // Replace the old separate editor button with a keyboard icon beside the answer input.
 const retry=$('editorRetry');if(retry)retry.classList.add('hidden');const fallback=$('fallback');if(fallback){const wrap=document.createElement('span');wrap.className='math-input-wrap';fallback.before(wrap);wrap.append(fallback);const btn=document.createElement('button');btn.type='button';btn.className='math-keyboard secondary';btn.textContent='⌨';btn.title='Open equation keyboard';wrap.append(btn);btn.onclick=()=>openKeyboard(fallback,wrap);}
 // Keep the text input visible even if optional MathLive loads automatically.
 $('answer').classList.add('hidden');$('fallback').classList.remove('hidden');
 const editorObserver=new MutationObserver(()=>{$('answer').classList.add('hidden');$('fallback').classList.remove('hidden');});editorObserver.observe($('answer'),{attributes:true,attributeFilter:['class']});
 selectTopic('graph');
})();
