from pathlib import Path
p=Path('/mnt/data/calc_v5')
h=(p/'index.html').read_text()
h=h.replace('<button id="labTab" type="button">Graph investigation</button>','<button id="labTab" type="button" class="hidden" aria-hidden="true">Graph investigation</button>')
h=h.replace('<math-field id="answer" class="hidden" virtual-keyboard-mode="manual"></math-field><input id="fallback" placeholder="Type an expression, e.g. 3*x^2" />','<math-field id="answer" class="hidden" math-virtual-keyboard-policy="auto"></math-field><input id="fallback" placeholder="Type an expression, e.g. 3*x^2" /><button type="button" id="editorRetry" class="secondary">Use equation editor</button>')
h=h.replace('<button type="button" id="constructGraph">Construct graph from my points</button>','<button type="button" id="constructGraph">Construct graph from my points</button>')
(p/'index.html').write_text(h)
a=(p/'app.js').read_text().replace("import('https://esm.sh/mathlive@0.104.2')","import('https://cdn.jsdelivr.net/npm/mathlive@0.104.2/+esm')")
a=a.replace("const editor=$('answer'),fallback=$('fallback');","const editor=$('answer'),fallback=$('fallback');")
a=a.replace("      editor.classList.remove('hidden');\n      fallback.classList.add('hidden');","      editor.classList.remove('hidden');\n      fallback.classList.add('hidden');\n      $('editorRetry').classList.add('hidden');")
a += '''\n// Allow the student to explicitly request the equation editor if the CDN was slow.\ndocument.getElementById('editorRetry')?.addEventListener('click',async()=>{\n try{await import('https://esm.sh/mathlive@0.104.2');await customElements.whenDefined('math-field');document.getElementById('answer').classList.remove('hidden');document.getElementById('fallback').classList.add('hidden');document.getElementById('editorRetry').classList.add('hidden');}catch(e){document.getElementById('formatHelp').textContent='The visual editor could not load. You can still type expressions in the text field.';}\n});\n'''
(p/'app.js').write_text(a)
b=(p/'advanced.js').read_text()
b=b.replace("const advancedTopics=new Set(['graph','absolute','analysis','derivativeGraph','formulaSketch']);","const advancedTopics=new Set(['graph','absolute','analysis','derivativeGraph','formulaSketch']);")
b=b.replace("<button type=\"button\" id=\"constructGraph\">Construct graph from my points</button>","<button type=\"button\" id=\"constructGraph\">Open freehand sketchpad</button>")
# override old construct() call with new sketchpad function
b=b.replace("$('constructGraph').onclick=construct;","$('constructGraph').onclick=freehandSketch;")
# insert freehand implementation before advancedNext
idx=b.index('function advancedNext()')
new=r'''// Draw with mouse, touch, or stylus. Smooth recorded strokes using Catmull-Rom interpolation.
function freehandSketch(){
 const host=$('constructedGraph'), W=700,H=350,p=38,[xmin,xmax]=q.domain,[ymin,ymax]=q.range;
 host.innerHTML=`<div class="actions"><button type="button" id="clearFreehand" class="secondary">Clear sketch</button><button type="button" id="undoFreehand" class="secondary">Undo stroke</button><button type="button" id="compareFreehand" class="secondary">Show reference graph</button></div><svg class="advanced-graph" id="freehandBoard" viewBox="0 0 ${W} ${H}" style="touch-action:none;cursor:crosshair;background:white" aria-label="Freehand graph drawing canvas"></svg><p class="muted small">Draw directly on the axes with your mouse, finger, or stylus. The line is smoothed automatically when you release. Sketches are not automatically graded; use the feature-point table for checking.</p>`;
 const svg=$('freehandBoard'),NS='http://www.w3.org/2000/svg',X=x=>p+(x-xmin)/(xmax-xmin)*(W-2*p),Y=y=>H-p-(y-ymin)/(ymax-ymin)*(H-2*p);
 const line=(x1,y1,x2,y2,color='#e3e8ee',w=1)=>{let e=document.createElementNS(NS,'line');Object.entries({x1,y1,x2,y2,stroke:color,'stroke-width':w}).forEach(([k,v])=>e.setAttribute(k,v));svg.append(e)};
 for(let x=Math.ceil(xmin);x<=xmax;x++)line(X(x),p,X(x),H-p);
 for(let y=Math.ceil(ymin);y<=ymax;y+=2)line(p,Y(y),W-p,Y(y));
 line(p,Y(0),W-p,Y(0),'#64748b',1.7);line(X(0),p,X(0),H-p,'#64748b',1.7);
 const strokes=[];let current=null,active=false;
 const xy=e=>{let r=svg.getBoundingClientRect();return {x:Math.max(p,Math.min(W-p,(e.clientX-r.left)*W/r.width)),y:Math.max(p,Math.min(H-p,(e.clientY-r.top)*H/r.height))}};
 function path(points){if(!points.length)return '';if(points.length===1)return `M${points[0].x} ${points[0].y} l.01 .01`;
 let d=`M${points[0].x} ${points[0].y}`;
 for(let i=0;i<points.length-1;i++){let a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],e=points[Math.min(points.length-1,i+2)];d+=` C${b.x+(c.x-a.x)/6} ${b.y+(c.y-a.y)/6} ${c.x-(e.x-b.x)/6} ${c.y-(e.y-b.y)/6} ${c.x} ${c.y}`;}return d;}
 function draw(){svg.querySelectorAll('.student-stroke').forEach(e=>e.remove());for(let s of strokes){let e=document.createElementNS(NS,'path');e.setAttribute('class','student-stroke');e.setAttribute('d',path(s));e.setAttribute('fill','none');e.setAttribute('stroke','#1462a5');e.setAttribute('stroke-width','3.5');e.setAttribute('stroke-linecap','round');svg.append(e);}if(current?.length){let e=document.createElementNS(NS,'path');e.setAttribute('class','student-stroke');e.setAttribute('d',path(current));e.setAttribute('fill','none');e.setAttribute('stroke','#1462a5');e.setAttribute('stroke-width','3.5');svg.append(e);}}
 svg.addEventListener('pointerdown',e=>{active=true;current=[xy(e)];svg.setPointerCapture(e.pointerId);draw();});
 svg.addEventListener('pointermove',e=>{if(!active)return;let pt=xy(e),last=current[current.length-1];if(Math.hypot(pt.x-last.x,pt.y-last.y)>3){current.push(pt);draw();}});
 const end=()=>{if(active){active=false;if(current?.length)strokes.push(current);current=null;draw();}};
 svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
 $('clearFreehand').onclick=()=>{strokes.length=0;current=null;svg.querySelectorAll('.reference-stroke').forEach(e=>e.remove());draw();};
 $('undoFreehand').onclick=()=>{strokes.pop();draw();};
 $('compareFreehand').onclick=()=>{svg.querySelectorAll('.reference-stroke').forEach(e=>e.remove());let d='';for(let i=0;i<=500;i++){let x=xmin+(xmax-xmin)*i/500,y=q.fn(x);if(Number.isFinite(y))d+=(d?'L':'M')+X(x).toFixed(2)+' '+Y(y).toFixed(2)+' ';}let e=document.createElementNS(NS,'path');e.setAttribute('class','reference-stroke');e.setAttribute('d',d);e.setAttribute('fill','none');e.setAttribute('stroke','#dc6b21');e.setAttribute('stroke-width','2.5');e.setAttribute('stroke-dasharray','8 5');svg.append(e);};
 $('constructionMessage').textContent='Draw the curve freely. Smoothing happens automatically. Orange dashed line shows the reference when requested.';
}
'''
b=b[:idx]+new+b[idx:]
# Add lab as topic card, embedded inside practice panel
needle='// Existing topic buttons call the reassigned next(), so they continue to work.'
insert='''// Place the derivative-graph investigation in the topic list rather than a top-level tab.
$('labPanel').classList.add('hidden');
$('practicePanel').appendChild($('labPanel'));
let investigationCard=document.createElement('button');investigationCard.type='button';investigationCard.className='topic';investigationCard.dataset.topic='investigation';investigationCard.innerHTML='<strong>Graph investigation: sketch from f′</strong><span>Multi-part derivative interpretation and curve sketching</span>';
investigationCard.onclick=()=>{setTab('practice');document.querySelector('#practicePanel article.problem').classList.add('hidden');$('labPanel').classList.remove('hidden');document.querySelectorAll('#topics .topic').forEach(b=>b.classList.toggle('active',b===investigationCard));newLab();$('labPanel').scrollIntoView({behavior:'smooth',block:'start'});};
$('topics').append(investigationCard);
const originalAdvancedNext=advancedNext;
advancedNext=()=>{document.querySelector('#practicePanel article.problem').classList.remove('hidden');$('labPanel').classList.add('hidden');originalAdvancedNext();};
'''
b=b.replace(needle,insert+needle)
(p/'advanced.js').write_text(b)
