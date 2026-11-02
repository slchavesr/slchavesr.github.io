/* One-question-per-page PDF export. Never split a MathJax formula or graph across pages. */
(()=>{
const $=id=>document.getElementById(id);
const getExam=()=>window.math1190GetExam?.()||[];
const topicName=t=>({graph:'Interpret graphs',absolute:'Absolute extrema',analysis:'Curve analysis',derivativeGraph:'Derivative graphs',lhopital:"L’Hôpital’s rule",rates:'Related rates',optimization:'Optimization',theorems:'Theorems',formulaSketch:'Sketch from a formula',investigation:'Graph investigation from f′'})[t]||t;
function grid(){let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" style="display:block;width:100%;height:280px;border:1px solid #bbb">';for(let x=40;x<=600;x+=40)s+=`<line x1="${x}" x2="${x}" y1="20" y2="280" stroke="#d9e2ed"/>`;for(let y=20;y<=280;y+=40)s+=`<line x1="40" x2="600" y1="${y}" y2="${y}" stroke="#d9e2ed"/>`;s+='<line x1="320" x2="320" y1="20" y2="280" stroke="#555" stroke-width="2"/><line x1="40" x2="600" y1="140" y2="140" stroke="#555" stroke-width="2"/></svg>';return s;}
async function load(url,test){if(test())return;await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=()=>reject(new Error('PDF library unavailable; check internet access'));document.head.append(script);});if(!test())throw Error('PDF library unavailable');}
async function exportPDF(key){const status=$('examResults'),exam=getExam();if(!exam.length){status.textContent='Generate an exam before downloading a PDF.';return;}
const button=$(key?'downloadKeyPdf':'downloadExamPdf'),old=button.textContent;button.disabled=true;button.textContent='Preparing PDF…';
try{
await load('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',()=>!!window.jspdf?.jsPDF);
await load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
await load('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js',()=>!!window.katex);
if(!document.getElementById('pdf-katex-style')){const link=document.createElement('link');link.id='pdf-katex-style';link.rel='stylesheet';link.href='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';document.head.append(link);await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(Error('Math font stylesheet unavailable'));});}
const doc=new window.jspdf.jsPDF({unit:'mm',format:'letter',compress:true});const W=215.9,H=279.4,m=15,usable=W-2*m;
for(let i=0;i<exam.length;i++){
if(i)doc.addPage();const q=exam[i];
const holder=document.createElement('div');holder.className='pdf-render-holder';holder.style.cssText='position:fixed;top:0;left:-2000px;width:760px;padding:22px;box-sizing:border-box;background:white;color:#111;font:18px/1.45 Arial,sans-serif;z-index:-1;';
const parts=q.topic==='investigation'&&q.parts?'<div style="margin-top:12px">'+q.parts.map((p,j)=>`<div style="margin:9px 0">(${String.fromCharCode(97+j)}) ${p.label}<div style="border-bottom:1px solid #bbb;height:24px"></div></div>`).join('')+'</div>':'';
const sketch=(q.topic==='formulaSketch'||q.topic==='investigation');
const explanation=q.solution||q.explanation||'Review the reasoning in topic practice.';
holder.innerHTML=`<div style="font-size:14px;font-weight:bold;border-bottom:2px solid #222;padding-bottom:9px">MATH 1190 · Calculus I · ${key?'Worked Solutions':'Practice Exam 3'}</div><div style="font-size:13px;margin:9px 0 22px">${key?'Solution key':`Name: __________________________________ &nbsp; Date: ______________`}</div><h2 style="font-size:21px;margin:0 0 12px">${i+1}. ${topicName(q.topic)}</h2><div>${q.prompt||''}</div><div class="pdf-figure" style="max-width:100%;margin:12px 0">${q.graph||q.svg||''}</div>${key?`<div style="margin-top:20px"><strong>Worked explanation</strong><div>${explanation}</div></div>`:parts}${sketch?`<div style="margin-top:15px"><strong>Sketch a possible graph of f on the grid.</strong>${grid()}</div>`:(!key?'<div style="margin-top:20px;border:1px solid #aaa;height:100px"></div>':'')}`;
document.body.append(holder);
try{
// KaTeX renders the mathematical source before screenshot capture, avoiding overlapping MathJax CHTML glyphs.
const walker=document.createTreeWalker(holder,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
for(const node of nodes){const src=node.nodeValue;if(!src.includes('\\(')&&!src.includes('\\['))continue;const frag=document.createElement('span');frag.innerHTML=src.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,(match,inline,display)=>{try{return window.katex.renderToString(inline??display,{throwOnError:false,displayMode:display!==undefined,output:'html'});}catch(e){return match;}});node.replaceWith(frag);}

await document.fonts?.ready;
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const canvas=await window.html2canvas(holder,{backgroundColor:'#fff',scale:2,logging:false,scrollX:0,scrollY:0,width:760,height:holder.scrollHeight,windowWidth:900});
// Fit the WHOLE question on one page, preserving proportions. No graph or equation can be split.
const naturalHeight=canvas.height/canvas.width*usable,available=H-28;
const factor=Math.min(1,available/naturalHeight),drawW=usable*factor,drawH=naturalHeight*factor;
doc.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',m+(usable-drawW)/2,10,drawW,drawH,undefined,'FAST');
}finally{holder.remove();}
doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(`MATH 1190 | ${key?'Solutions':'Practice Exam'} | Page ${i+1} of ${exam.length}`,m,H-8);
}
doc.save(key?'MATH1190_Exam3_Practice_Solutions.pdf':'MATH1190_Exam3_Practice_Questions.pdf');status.textContent='PDF generated: one complete question per page.';
}catch(e){console.error(e);status.textContent='PDF generation failed: '+e.message;}finally{button.disabled=false;button.textContent=old;}
}
$('downloadExamPdf').addEventListener('click',()=>exportPDF(false));$('downloadKeyPdf').addEventListener('click',()=>exportPDF(true));
})();
