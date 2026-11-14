/* MATH 1190 tracked exam. Original exam question bank and grading are reused. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const LIMIT=70*60*1000;
const KEY='math1190-tracked-result';
let state='ready',username='',started=0,clock=null,passStart=false,passSubmit=false;
const start=$('startExam'),submit=$('submitExam'),warning=$('trackedWarning');
function elapsed(){return started?Math.max(0,Math.floor((Date.now()-started)/1000)):0;}
function time(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function notify(msg){warning.textContent=msg;warning.classList.remove('hidden');}
function saveAndRedirect(status,score,reason=''){
 const data={username,score,status,reason,seconds:elapsed(),minutes:Number((elapsed()/60).toFixed(2)),at:new Date().toISOString()};
 sessionStorage.setItem(KEY,JSON.stringify(data));
 window.location.replace('exam-results.html');
}
function grade(){
 // Existing exam grader handles blank fields as unanswered (zero points).
 // Trigger it via the same submission event students use.
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
 let score=null;
 try{score=grade();}catch(e){reason+=` Grading issue: ${e.message}`;}
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 saveAndRedirect(status,score,reason);
}
function tick(){
 if(state!=='running')return;
 const remain=Math.max(0,Math.ceil((LIMIT-(Date.now()-started))/1000));
 $('timer').textContent=`Time remaining: ${time(remain)} · Zero violations allowed`;
 if(remain===0)end('Time expired','70-minute time limit reached');
}
async function begin(){
 if(state!=='ready')return;
 const value=$('trackedUsername').value.trim();
 if(!/^[a-zA-Z0-9._-]{2,80}$/.test(value)){notify('Enter a valid KSU username.');return;}
 if(!document.documentElement.requestFullscreen){notify('This browser does not support required fullscreen mode.');return;}
 try{await document.documentElement.requestFullscreen();}catch(e){notify('Fullscreen permission is required to start.');return;}
 username=value;started=Date.now();state='running';warning.classList.add('hidden');
 $('trackedUsername').disabled=true;
 passStart=true;
 try{start.click();}catch(e){state='ready';notify('Unable to generate the exam: '+e.message);return;}finally{passStart=false;}
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
window.addEventListener('beforeunload',e=>{
 if(state==='running'){e.preventDefault();e.returnValue='';}
});
})();
