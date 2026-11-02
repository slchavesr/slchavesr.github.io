/* Version 9: single navigation controller, no hidden cross-script function calls. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
let activeTopic='graph';
const card=document.querySelector('#practicePanel > article.problem');
const topicSelect=$('topic');
const lab=$('labPanel');
function report(where,err){console.error('MATH1190:',err);$(where).textContent='Problem could not load: '+(err?.message||String(err));}
function panels(exam){$('practicePanel').classList.toggle('hidden',exam);$('examPanel').classList.toggle('hidden',!exam);$('practiceTab').classList.toggle('active',!exam);$('examTab').classList.toggle('active',exam);}
function highlight(){document.querySelectorAll('#topics button[data-topic]').forEach(b=>b.classList.toggle('active',b.dataset.topic===activeTopic));}
function showTopic(topic){
 activeTopic=topic;panels(false);highlight();
 const investigation=topic==='investigation';
 card.classList.toggle('hidden',investigation);lab.classList.toggle('hidden',!investigation);
 $('newProblem').textContent='New problem';
 if(investigation){
  try{newLab();installLabSketch();}catch(e){report('labFeedback',e);}
 }else{
  topicSelect.value=topic;
  try{
   if(typeof window.math1190AdvancedNext==='function')window.math1190AdvancedNext();
   else next();
  }catch(e){report('feedback',e);}
 }
}
// Intercept legacy listeners in capture phase. One handler owns navigation.
$('topics').addEventListener('click',e=>{const b=e.target.closest('button[data-topic]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();showTopic(b.dataset.topic);},true);
$('newProblem').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showTopic(activeTopic);},true);
$('practiceTab').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showTopic(activeTopic);},true);
$('examTab').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();panels(true);},true);

// Always display the same freehand sketchpad, irrespective of derivative family.
function installLabSketch(){
 const host=$('labSketch');if(!host)return;
 host.innerHTML='<p class="muted">Sketch a possible f based on the derivative graph. Use the coordinate grid below.</p><div class="actions"><button type="button" id="labUndo">Undo</button><button type="button" id="labClear">Clear sketch</button></div><svg id="labCanvas" viewBox="0 0 700 380" style="display:block;width:100%;max-width:850px;touch-action:none;cursor:crosshair;border:1px solid #b9c6d4;border-radius:8px;background:white" aria-label="Student freehand graph"></svg>';
 $('labSketchCheck').classList.add('hidden');$('labSketchReset').classList.add('hidden');
 const svg=$('labCanvas'),NS='http://www.w3.org/2000/svg';let strokes=[],current=null;
 const node=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);svg.append(n);return n;};
 function draw(){svg.replaceChildren();for(let x=50;x<=650;x+=50){node('line',{x1:x,x2:x,y1:25,y2:350,stroke:'#e2e8f0'});node('text',{x:x+2,y:368,'font-size':12,fill:'#475569'}).textContent=(x-350)/50;}
 for(let y=50;y<=350;y+=50){node('line',{x1:35,x2:665,y1:y,y2:y,stroke:'#e2e8f0'});node('text',{x:5,y:y-3,'font-size':12,fill:'#475569'}).textContent=(200-y)/50;}
 node('line',{x1:350,x2:350,y1:25,y2:350,stroke:'#64748b','stroke-width':2});node('line',{x1:35,x2:665,y1:200,y2:200,stroke:'#64748b','stroke-width':2});
 for(const points of [...strokes,...(current?[current]:[])])if(points.length>1){let d=`M ${points[0][0]} ${points[0][1]}`;for(let i=1;i<points.length;i++){const prev=points[i-1],p=points[i],mx=(prev[0]+p[0])/2,my=(prev[1]+p[1])/2;d+=` Q ${prev[0]} ${prev[1]} ${mx} ${my}`;}const p=points.at(-1);d+=` L ${p[0]} ${p[1]}`;node('path',{d,fill:'none',stroke:'#2563eb','stroke-width':3,'stroke-linecap':'round'});}}
 const point=e=>{const r=svg.getBoundingClientRect();return [(e.clientX-r.left)*700/r.width,(e.clientY-r.top)*380/r.height];};
 svg.onpointerdown=e=>{current=[point(e)];svg.setPointerCapture(e.pointerId);draw();};svg.onpointermove=e=>{if(current){current.push(point(e));draw();}};svg.onpointerup=()=>{if(current){strokes.push(current);current=null;draw();}};svg.onpointercancel=svg.onpointerup;
 $('labUndo').onclick=()=>{strokes.pop();draw();};$('labClear').onclick=()=>{strokes=[];current=null;draw();};draw();
}
// Exam generator: use existing question bank, but avoid fragile cubic-only sketch grader.
function makeExam(){
 clearInterval(examTimer);examSubmitted=false;
 const n=Number($('examCount').value),pool=['graph','absolute','analysis','derivativeGraph','lhopital','rates','optimization','theorems'];
 const order=Array.from({length:n},(_,i)=>pool[i%pool.length]);order.sort(()=>Math.random()-.5);
 exam=order.map(type=>{
  if(type==='graph'||type==='absolute'||type==='analysis'||type==='derivativeGraph'){
   // Core generators remain compatible with the original exam checker.
   return generate(type);
  }
  return generate(type);
 });
 window.math1190GetExam=()=>exam.slice();
 examStarted=Date.now();$('examResults').innerHTML='';
 $('examQuestions').innerHTML=exam.map((q,i)=>`<article class="problem"><div class="eyebrow">Question ${i+1} · ${T[q.topic]||q.topic}</div><div>${q.prompt}</div>${q.graph||''}<label class="answer-label" for="exam-${i}">Answer</label><input id="exam-${i}" class="exam-input" autocomplete="off" placeholder="Enter your answer"><div id="result-${i}"></div></article>`).join('');
 $('submitExam').classList.remove('hidden');$('timer').textContent='Suggested time limit: 70 minutes';renderMath($('examQuestions'));
}
$('startExam').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();try{makeExam();}catch(err){report('examResults',err);}},true);
// Submit using the original single-answer checker, without a cubic sketch dependency.
$('submitExam').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(examSubmitted)return;examSubmitted=true;let correct=0,review=0;exam.forEach((q,i)=>{let value=$('exam-'+i).value,r;try{r=mathCheck(value,q);}catch(e){r={status:'review'};}if(r.status==='correct')correct++;if(r.status==='review')review++;$('result-'+i).innerHTML=`<div class="info"><b>${r.status==='correct'?'Correct':r.status==='incorrect'?'Not quite':'Review your work'}</b><p>${q.explanation||''}</p></div>`;$('exam-'+i).disabled=true;});$('examResults').innerHTML=`<div class="info"><h2>Practice exam results</h2><p>${correct} of ${exam.length} confirmed correct; ${review} need review. Read each explanation above.</p></div>`;$('submitExam').classList.add('hidden');renderMath($('examPanel'));},true);
// Math keyboard icons: optional enhancement, not a requirement to use the site.
let loading=null;
async function keyboard(input,wrap){let panel=wrap.nextElementSibling;if(panel?.classList.contains('math-popover')){panel.remove();return;}panel=document.createElement('div');panel.className='math-popover';panel.textContent='Loading math keyboard…';wrap.after(panel);try{if(!customElements.get('math-field')){loading??=import('https://cdn.jsdelivr.net/npm/mathlive@0.104.2/+esm');await loading;}if(!customElements.get('math-field'))throw Error('MathLive unavailable');panel.innerHTML='<math-field math-virtual-keyboard-policy="manual"></math-field>';const mf=panel.querySelector('math-field');mf.value=input.value;mf.oninput=()=>{input.value=mf.value;input.dispatchEvent(new Event('input',{bubbles:true}));};mf.focus();mf.executeCommand('showVirtualKeyboard');}catch(err){panel.textContent='Math keyboard unavailable. Type your answer normally.';}}
const css=document.createElement('style');css.textContent='.math-input-wrap{display:flex;gap:6px;align-items:center}.math-input-wrap input{flex:1;min-width:0}.math-popover{padding:10px;border:1px solid #cbd5e1;border-radius:8px;margin:6px 0;background:#f8fafc}.math-popover math-field{display:block;width:100%}';document.head.append(css);
function decorate(){document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])').forEach(input=>{if(input.closest('.math-input-wrap')||input.id==='answer'||input.closest('#topics'))return;const wrap=document.createElement('span');wrap.className='math-input-wrap';input.before(wrap);wrap.append(input);const btn=document.createElement('button');btn.type='button';btn.className='secondary';btn.textContent='⌨';btn.title='Open equation keyboard';btn.onclick=()=>keyboard(input,wrap);wrap.append(btn);});}
let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;decorate();});}).observe(document.querySelector('main'),{childList:true,subtree:true});decorate();
$('editorRetry').classList.add('hidden');$('answer').classList.add('hidden');$('fallback').classList.remove('hidden');
showTopic('graph');
})();
