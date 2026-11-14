/* Tracked-exam overlay for v16. Original index.html and scripts are not modified. */
(()=>{
'use strict';
const FORM='https://forms.cloud.microsoft/r/XLQBFVSk82';
const $=id=>document.getElementById(id);
const LIMIT=70*60*1000;
let started=0, username='', violations=0, state='ready', clock=null, allowFinish=false, allowStart=false, pending=false;
const banner=$('trackedWarning'), results=$('trackedSubmission'), startBtn=$('startExam'), finishBtn=$('submitExam');
function elapsed(){return Math.max(0,Math.floor((Date.now()-started)/1000));}
function fmt(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function showWarning(message){banner.textContent=message;banner.classList.remove('hidden');banner.style.border='2px solid #c2410c';}
function stopClock(){clearInterval(clock);clock=null;}
function disableExam(){
  document.querySelectorAll('#examQuestions input,#examQuestions button,#examQuestions textarea,#examQuestions math-field').forEach(el=>{el.disabled=true;el.setAttribute('aria-disabled','true');});
  document.querySelectorAll('#examQuestions svg').forEach(el=>el.style.pointerEvents='none');
  finishBtn.classList.add('hidden');
}
function displaySubmission(score, status){
  results.classList.remove('hidden');
  results.innerHTML='';
  const title=document.createElement('h2');title.textContent=status==='Completed'?'Submit your results':'Attempt ended';
  const p=document.createElement('p');
  p.textContent=`Username: ${username} · Automatically checked score: ${score===null?'Not graded':score+'% (excludes written/sketch questions)'} · Time used: ${(elapsed()/60).toFixed(2)} minutes.`;
  results.append(title,p);
  const note=document.createElement('p');
  note.textContent=status==='Completed'?'To record your results, open the KSU Microsoft Form and enter the displayed values. The form requires a separate submission; it is not automatic.':'This local attempt was terminated. No result has been automatically sent to the instructor.';
  results.append(note);
  if(status==='Completed'){
    const a=document.createElement('a');a.href=FORM;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open Microsoft Forms to submit results';
    a.style.cssText='display:inline-block;padding:12px 16px;background:#174b77;color:white;border-radius:8px;font-weight:bold;';
    results.append(a);
  }
  try{sessionStorage.setItem('math1190-tracked-result',JSON.stringify({username,score,timeUsedMinutes:Number((elapsed()/60).toFixed(2)),status,at:new Date().toISOString()}));}catch(e){}
}
function terminate(reason){
  if(state!=='running')return;
  state='terminated';stopClock();disableExam();
  $('timer').textContent=`Attempt terminated · elapsed ${fmt(elapsed())}`;
  showWarning(reason+' This attempt has been terminated.');
  displaySubmission(null,'Terminated');
}
function violation(reason){
  if(state!=='running'||pending)return;
  pending=true;setTimeout(()=>pending=false,750);
  violations++;
  if(violations>=2){terminate(reason);return;}
  showWarning(`Security warning 1 of 1: ${reason}. A second violation terminates the attempt. Return to fullscreen to continue.`);
}
function tick(){
  if(state!=='running')return;
  const remain=Math.max(0,LIMIT-(Date.now()-started));
  $('timer').textContent=`Time remaining: ${fmt(Math.ceil(remain/1000))} · Security warnings: ${violations}/1`;
  if(!remain){showWarning('Time expired. Your exam has been submitted locally.');finish();}
}
async function begin(){
  if(state!=='ready')return;
  const value=$('trackedUsername').value.trim();
  if(!/^[A-Za-z0-9._-]{2,80}$/.test(value)){showWarning('Enter your KSU username before starting (letters, numbers, dots, underscores or hyphens).');return;}
  try{await document.documentElement.requestFullscreen();}catch(e){showWarning('Fullscreen permission is required. Allow fullscreen and try again.');return;}
  username=value;violations=0;state='running';started=Date.now();banner.classList.add('hidden');
  $('trackedUsername').disabled=true;
  allowStart=true;startBtn.click();allowStart=false;
  startBtn.disabled=true;startBtn.classList.add('hidden');
  tick();clock=setInterval(tick,250);
}
function finish(){
  if(state!=='running')return;
  state='completed';stopClock();
  allowFinish=true;finishBtn.click();allowFinish=false;
  // The v16 grader prints "(NN%)" in its results heading.
  const content=$('examResults').textContent;
  const match=content.match(/(\d+)\s+of\s+(\d+)\s+automatically/i);
  const score=match&&Number(match[2])>0?Math.round(100*Number(match[1])/Number(match[2])*100)/100:null;
  disableExam();
  $('timer').textContent=`Finished · elapsed ${fmt(elapsed())}`;
  displaySubmission(score,'Completed');
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}
window.addEventListener('click',e=>{
  const b=e.target.closest?.('button');
  if(!b)return;
  if(b.id==='startExam'&&!allowStart){e.preventDefault();e.stopImmediatePropagation();begin();}
  if(b.id==='submitExam'&&!allowFinish){e.preventDefault();e.stopImmediatePropagation();finish();}
},true);
document.addEventListener('fullscreenchange',()=>{if(state==='running'&&!document.fullscreenElement)violation('Fullscreen was exited');});
document.addEventListener('visibilitychange',()=>{if(state==='running'&&document.hidden)violation('The exam tab was hidden');});
window.addEventListener('blur',()=>{ /* Blur is noisy (OS dialogs, keyboard); tab visibility is used instead. */ });
window.addEventListener('beforeunload',e=>{if(state==='running'){e.preventDefault();e.returnValue='';}});
window.addEventListener('pageshow',()=>{if(state==='running')tick();});
})();
