"use strict";
// One representative question per selected skill, with deliberate extra coverage of finance.
// Exam 3-style blueprint: 20 contextual, mostly open-response questions.
// New versions randomize numerical values without copying the source exam.
const blueprint=[
 ["units",["Multi-step conversion","Speed conversion","Area conversion","Unit rates","Weight conversion","Fahrenheit to Celsius"]],
 ["percent",["Successive percentage increases","Reverse percentages"]],
 ["budget",["Monthly budget categories"]],
 ["interest",["Simple-interest investment","Time to reach a goal","Compound interest"]],
 ["loans",["Financing with down payment","Simple-interest installment financing","Amortized loan payment","Two rows of amortization","Credit-card repayment schedule"]],
 ["mortgage",["Deferred student loan","Interest paid during school","Mortgage and down payment"]]
];
let exam=[];let submitted=false;
const sectionNames={units:'Unit conversions and rates',percent:'Percentages and inflation',budget:'Budgeting',interest:'Interest and investments',loans:'Financing and amortization',mortgage:'Student loans and mortgages'};
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function newExam(){
 if(!submitted&&exam.length&&document.querySelector('#exam-form input')?.value.trim()&&!confirm('Generate a different exam? Current answers will be lost.'))return;
 exam=[];submitted=false;
 blueprint.forEach(([topic,titles])=>titles.forEach(title=>{
  const q=questions[topic].find(q=>q.title===title);
  if(!q||q.pie)throw new Error('Missing numeric exam question: '+title);
  exam.push({topic,title,data:q.make()});
 }));
 document.querySelector('#exam-questions').innerHTML=exam.map((q,i)=>`${i===0||exam[i-1].topic!==q.topic?`<h2 class="exam-section-heading">${sectionNames[q.topic]}</h2>`:''}<article class="card"><div class="question-points">Question ${i+1} · ${topics.find(t=>t[0]===q.topic)[1]} · ${q.data.answers.length} answer${q.data.answers.length===1?'':'s'}</div><h3>${escapeHtml(q.title)}</h3><div class="prompt">${q.data.text}</div><div class="exam-grid">${q.data.fields.map((f,j)=>`<label for="ex-${i}-${j}">${escapeHtml(f)}<input id="ex-${i}-${j}" type="number" step="any" inputmode="decimal" autocomplete="off" placeholder="Your answer" /></label>`).join('')}</div></article>`).join('');
 typesetMath(document.querySelector('#exam-questions'));document.querySelector('#exam-results').innerHTML='';document.querySelector('#submit-exam').disabled=false;document.querySelector('#submit-exam').textContent='Submit Exam';
 window.scrollTo({top:0,behavior:'smooth'});
}
function gradeExam(e){
 e.preventDefault();if(submitted)return;
 const all=exam.flatMap((q,i)=>q.data.answers.map((a,j)=>({q,i,j,a,field:document.getElementById(`ex-${i}-${j}`)})));
 const blank=all.filter(x=>x.field.value.trim()==='').length;
 if(blank&&!confirm(`${blank} answer field(s) are blank. Submit anyway?`))return;
 submitted=true;let earned=0;
 const lines=exam.map((q,i)=>{
  let parts=q.data.answers.map((a,j)=>{
   const field=document.getElementById(`ex-${i}-${j}`),v=field.value.trim();
   const dp=q.data.decimals?.[j]??(/number of/i.test(q.data.fields[j])?0:2);
   const ok=v!==''&&close(Number(v),a,dp);if(ok)earned++;
   field.disabled=true;
   return `<div class="${ok?'result-correct':'result-wrong'}">${ok?'✓ Correct':'✗ Incorrect'} — ${escapeHtml(q.data.fields[j])}: ${v===''?'No answer':escapeHtml(v)}${ok?'':`; correct answer: ${Number(a.toFixed(dp)).toLocaleString('en-US',{minimumFractionDigits:dp,maximumFractionDigits:dp})}`}</div>`;
  }).join('');
  return `<div class="result-line"><strong>${i+1}. ${escapeHtml(q.title)}</strong>${parts}</div>`;
 });
 const pct=100*earned/all.length;
 document.querySelector('#exam-results').innerHTML=`<section class="card"><h2>Exam Results</h2><div class="exam-score">${earned} / ${all.length} points · ${pct.toFixed(1)}%</div><p class="exam-note">Each answer field earns one point. Unanswered fields count as incorrect. This score is not stored or reported.</p><h3>Correct and incorrect answers</h3>${lines.join('')}<p><button type="button" id="retry">Generate Another Exam</button></p></section>`;
 typesetMath(document.querySelector('#exam-results'));document.querySelector('#submit-exam').disabled=true;document.querySelector('#submit-exam').textContent='Exam Submitted';
 document.querySelector('#retry').onclick=newExam;
 document.querySelector('#exam-results').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelector('#regenerate').onclick=newExam;
document.querySelector('#print').onclick=()=>window.print();
document.querySelector('#exam-form').addEventListener('submit',gradeExam);
newExam();
