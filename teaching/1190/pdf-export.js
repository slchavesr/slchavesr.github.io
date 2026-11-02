/* Download a real PDF from the exact currently generated practice exam. */
(()=>{
const $=id=>document.getElementById(id);
async function load(url,test){if(test())return;await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=()=>reject(Error('PDF library failed to load; check internet connection'));document.head.append(script)});if(!test())throw Error('PDF library unavailable')}
async function exportPDF(key){const status=$('examResults');if(!window.math1190GetExam || !window.math1190GetExam().length){status.textContent='Generate a practice exam before downloading its PDF.';return;}
const exam=window.math1190GetExam();const btn=$(key?'downloadKeyPdf':'downloadExamPdf');btn.disabled=true;const old=btn.textContent;btn.textContent='Preparing PDF…';
try{await load('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',()=>!!window.jspdf?.jsPDF);await load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
const doc=new window.jspdf.jsPDF({unit:'mm',format:'letter'}),pageW=215.9,pageH=279.4,margin=16,usable=pageW-2*margin;let y=18;
function newPage(){doc.addPage();y=18}function textLine(t,size=10){doc.setFont('helvetica','normal');doc.setFontSize(size);for(const line of doc.splitTextToSize(t,usable)){if(y+6>pageH-14)newPage();doc.text(line,margin,y);y+=size*.52+2;}}
textLine('MATH 1190  |  Calculus I  |  Practice Exam 3',15);textLine(key?'WORKED SOLUTIONS':'Name: ______________________________    Date: ______________',10);textLine(`Questions: ${exam.length}   |   Suggested time: 70 minutes   |   Randomized version`,9);y+=3;
for(let i=0;i<exam.length;i++){
const q=exam[i];if(y>pageH-55)newPage();textLine(`${i+1}. ${q.topic==='rates'?'Related rates':q.topic==='optimization'?'Optimization':q.topic==='lhopital'?"L'Hopital's Rule":q.topic}`,11);
const container=document.createElement('div');container.style.cssText='position:absolute;left:0;top:0;z-index:-100;width:740px;background:#fff;color:#111;padding:12px;font:18px/1.5 Arial,sans-serif';container.innerHTML=`<div>${q.prompt||''}</div>${q.graph||''}${key?`<div style="margin-top:18px"><strong>Worked solution:</strong><div>${q.explanation||q.solution||''}</div></div>`:''}`;document.body.append(container);
try{if(window.MathJax?.typesetPromise)await window.MathJax.typesetPromise([container]);const canvas=await window.html2canvas(container,{backgroundColor:'#fff',scale:1.5,logging:false,scrollX:0,scrollY:0});const img=canvas.toDataURL('image/png');const h=canvas.height/canvas.width*usable;const available=pageH-y-16;if(h<=available){doc.addImage(img,'PNG',margin,y,usable,h);y+=h+8;}else{const pxPerMm=canvas.width/usable;let start=0;while(start<canvas.height){const availableMm=pageH-y-16;const sliceH=Math.min(canvas.height-start,Math.max(1,Math.floor(availableMm*pxPerMm)));const piece=document.createElement('canvas');piece.width=canvas.width;piece.height=sliceH;piece.getContext('2d').drawImage(canvas,0,start,canvas.width,sliceH,0,0,canvas.width,sliceH);doc.addImage(piece.toDataURL('image/png'),'PNG',margin,y,usable,sliceH/pxPerMm);start+=sliceH;y+=sliceH/pxPerMm+2;if(start<canvas.height)newPage();}y+=5;}}
finally{container.remove()}
if(!key){if(y+30>pageH-14)newPage();doc.setDrawColor(175);doc.rect(margin,y,usable,25);y+=32;}
}
const total=doc.getNumberOfPages();for(let n=1;n<=total;n++){doc.setPage(n);doc.setFontSize(8);doc.text(`MATH 1190 | ${key?'Solutions':'Practice Exam'} | Page ${n} of ${total}`,margin,pageH-9)}doc.save(key?'MATH1190_Exam3_Practice_Solutions.pdf':'MATH1190_Exam3_Practice_Questions.pdf');status.textContent='PDF generated from the current practice exam.';
}catch(e){console.error(e);status.textContent='PDF generation failed: '+e.message;}finally{btn.disabled=false;btn.textContent=old;}}
$('downloadExamPdf').addEventListener('click',()=>exportPDF(false));$('downloadKeyPdf').addEventListener('click',()=>exportPDF(true));
})();
