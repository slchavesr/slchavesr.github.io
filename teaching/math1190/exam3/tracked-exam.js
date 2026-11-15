/* MATH 1190 tracked exam. Original question bank and grading are reused. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const LIMIT=70*60*1000;
const KEY='math1190-tracked-result';
const params=new URLSearchParams(window.location.search);
let state='ready',username='',started=0,clock=null,passStart=false,passSubmit=false,examSnapshot='';
const start=$('startExam'),submit=$('submitExam'),warning=$('trackedWarning');
const usernameField=$('trackedUsername');
const validUsername=name=>/^[a-zA-Z0-9._-]{2,80}$/.test(name);
if(validUsername(params.get('username')||'')) usernameField.value=params.get('username');
function elapsed(){return started?Math.max(0,Math.floor((Date.now()-started)/1000)):0;}
function time(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function notify(msg){warning.textContent=msg;warning.classList.remove('hidden');}
function saveAndRedirect(status,score,reason=''){
 const data={username,score,status,reason,seconds:elapsed(),minutes:Number((elapsed()/60).toFixed(2)),at:new Date().toISOString(),examHtml:examSnapshot};
 try{sessionStorage.setItem(KEY,JSON.stringify(data));}catch(e){notify('Could not save exam results in this browser. Please enable session storage.');return;}
 window.location.replace('exam-results.html');
}
function captureExam(){
 const source=$('examQuestions');const clone=source.cloneNode(true);
 const originals=source.querySelectorAll('input,select,textarea');
 const copies=clone.querySelectorAll('input,select,textarea');
 originals.forEach((el,i)=>{
   const cp=copies[i];if(!cp)return;
   const answer=document.createElement('span');answer.className='student-answer';
   answer.textContent=el.value.trim()||'(blank)';cp.replaceWith(answer);
 });
 const originalCanvases=source.querySelectorAll('canvas');
 const clonedCanvases=clone.querySelectorAll('canvas');
 originalCanvases.forEach((canvas,i)=>{
   try{const img=document.createElement('img');img.src=canvas.toDataURL('image/png');
     img.alt='Student graph';img.style.maxWidth='100%';clonedCanvases[i]?.replaceWith(img);}catch(e){}
 });
 clone.querySelectorAll('button,.exam-result,script').forEach(el=>el.remove());
 clone.querySelectorAll('[data-answer]').forEach(el=>el.removeAttribute('data-answer'));
 clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 return clone.innerHTML;
}
function grade(){
 passSubmit=true;
 try{submit.click();}finally{passSubmit=false;}
 const text=$('examResults').textContent;
 const match=text.match(/\(\s*(\d+(?:\.\d+)?)\s*%\s*\)/);
 if(!match)throw new Error('Unable to read the grading result. Please contact the instructor.');
 return Number(match[1]);
}
function end(status,reason=''){
 if(state!=='running')return;
 state='ending';clearInterval(clock);
 try{examSnapshot=captureExam();}catch(e){examSnapshot='';}
 let score=null;
 try{score=grade();}catch(e){reason+=` Grading issue: ${e.message}`;}
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 saveAndRedirect(status,score,reason);
}
function tick(){
 if(state!=='running')return;
 const remain=Math.max(0,Math.ceil((LIMIT-(Date.now()-started))/1000));
 $('timer').textContent=`Time remaining: ${time(remain)} · Do not exit fullscreen or change tabs or windows; otherwise, the exam will close immediately.`;
 if(remain===0)end('Time expired','70-minute time limit reached');
}
async function begin(){
 if(state!=='ready')return;
 const name=usernameField.value.trim();
 if(!validUsername(name)){notify('Enter your KSU username before starting the exam.');usernameField.focus();return;}
 if(!document.documentElement.requestFullscreen){notify('This browser does not support required fullscreen mode.');return;}
 state='starting';
 try{await document.documentElement.requestFullscreen();}
 catch(e){state='ready';notify('Fullscreen permission is required to start. Click the button again and allow fullscreen.');return;}
 username=name;
 warning.classList.add('hidden');
 passStart=true;
 try{start.click();}
 catch(e){state='ready';if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});notify('Unable to generate the exam: '+e.message);return;}
 finally{passStart=false;}
 started=Date.now();state='running';
 usernameField.readOnly=true;
 start.disabled=true;start.classList.add('hidden');
 tick();clock=setInterval(tick,250);
}
window.addEventListener('click',e=>{
 const b=e.target.closest?.('button');if(!b)return;
 if(b.id==='startExam'&&!passStart){e.preventDefault();e.stopImmediatePropagation();begin();}
 if(b.id==='submitExam'&&!passSubmit){e.preventDefault();e.stopImmediatePropagation();end('Completed');}
},true);
document.addEventListener('fullscreenchange',()=>{
 if(state==='running'&&!document.fullscreenElement)end('Terminated','Exited fullscreen');
});
document.addEventListener('visibilitychange',()=>{
 if(state==='running'&&document.hidden)end('Terminated','Switched away from the exam tab');
});
window.addEventListener('blur',()=>{
 if(state==='running')end('Terminated','Exam window lost focus (possible Alt+Tab or window switch)');
});
window.addEventListener('beforeunload',e=>{
 if(state==='running'){e.preventDefault();e.returnValue='';}
});
})();
