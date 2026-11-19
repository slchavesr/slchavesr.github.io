(()=>{'use strict';
const $=id=>document.getElementById(id),R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[R(0,a.length-1)],fmt=x=>Number(x.toFixed(6)).toString(),tex=s=>`\\(${s}\\)`;
let tasks=[],serial=0,examMode=false,submitted=false;
const hints={1:"Divide the interval into equal widths. Evaluate the function at the selected endpoints, multiply by the width, and add. Compare your estimate with the graph.",2:"Use the Fundamental Theorem of Calculus with variable limits: evaluate the integrand at each limit and multiply by that limit’s derivative. Subtract the lower-limit contribution.",3:"For antiderivatives, reverse the derivative rules and include +C. For definite integrals, evaluate an antiderivative at the upper and lower endpoints.",4:"The integral is signed area. The derivative of the area function is f(x), so look for zeros of f when finding interior critical numbers.",5:"Find which curve is above the other on the given interval, then integrate (top − bottom)."};
const functions=[
 {t:'e^{-x^2}',fn:x=>Math.exp(-x*x),name:'Gaussian',domain:[-2,2]},
 {t:'e^{-x^4}',fn:x=>Math.exp(-(x**4)),name:'quartic exponential',domain:[-1.8,1.8]},
 {t:'e^{\\sin x}',fn:x=>Math.exp(Math.sin(x)),name:'exponential sine',domain:[-2,4]},
 {t:'\\sqrt{1+x^4}',fn:x=>Math.sqrt(1+x**4),name:'quartic radical',domain:[-2,2]},
 {t:'\\cos(x^2)+2',fn:x=>Math.cos(x*x)+2,name:'oscillatory positive',domain:[-2,2]},
 {t:'e^{-x^2}+1',fn:x=>Math.exp(-x*x)+1,name:'shifted Gaussian',domain:[-2,2]}
];
const areaF=[
 {t:'e^{-t^2}',expr:x=>`exp(-(${x})^2)`,fn:x=>Math.exp(-x*x)},
 {t:'e^{-t^4}',expr:x=>`exp(-(${x})^4)`,fn:x=>Math.exp(-(x**4))},
 {t:'\\sqrt{1+t^4}',expr:x=>`sqrt(1+(${x})^4)`,fn:x=>Math.sqrt(1+x**4)},
 {t:'e^{\\sin t}',expr:x=>`exp(sin(${x}))`,fn:x=>Math.exp(Math.sin(x))}
];
function svgPlot(curves,a,b,{rects=null,fill=null,zero=true,minimal=false,integerGrid=false}={}){
 const W=740,H=340,L=52,T=24,B=38,Q=20, yvals=[];
 for(const c of curves)for(let i=0;i<=280;i++){let y=c.fn(a+(b-a)*i/280);if(Number.isFinite(y))yvals.push(y)}
 if(rects)rects.forEach(r=>yvals.push(r.h));yvals.push(0);
 let ymin=Math.min(...yvals),ymax=Math.max(...yvals),pad=Math.max(.3,(ymax-ymin)*.15);ymin-=pad;ymax+=pad;
 const X=x=>L+(x-a)/(b-a)*(W-L-Q),Y=y=>T+(ymax-y)/(ymax-ymin)*(H-T-B), y0=Y(0);
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Function graph with axes${rects?' and Riemann rectangles':''}"><rect width="${W}" height="${H}" fill="white"/>`;
 if(integerGrid){
  const xStart=Math.ceil(a),xEnd=Math.floor(b);
  for(let x=xStart;x<=xEnd;x++){
   s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${H-B}" stroke="#e8edf2"/><text x="${X(x)}" y="${H-13}" font-size="12" fill="#53667b" text-anchor="middle">${x}</text>`;
  }
  const yStart=Math.ceil(ymin),yEnd=Math.floor(ymax);
  for(let y=yStart;y<=yEnd;y++){
   s+=`<line x1="${L}" y1="${Y(y)}" x2="${W-Q}" y2="${Y(y)}" stroke="#e8edf2"/><text x="${L-8}" y="${Y(y)+4}" font-size="12" fill="#53667b" text-anchor="end">${y}</text>`;
  }
 }else if(!minimal){
 for(let i=0;i<=8;i++){let x=a+(b-a)*i/8;s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${H-B}" stroke="#e8edf2"/><text x="${X(x)}" y="${H-13}" font-size="11" fill="#53667b" text-anchor="middle">${fmt(x)}</text>`}
 for(let i=0;i<=5;i++){let y=ymin+(ymax-ymin)*i/5;s+=`<line x1="${L}" y1="${Y(y)}" x2="${W-Q}" y2="${Y(y)}" stroke="#e8edf2"/><text x="${L-8}" y="${Y(y)+4}" font-size="11" fill="#53667b" text-anchor="end">${fmt(y)}</text>`}
 }else{
 for(const x of [a,b])s+=`<text x="${X(x)}" y="${Math.min(H-9,Math.max(17,Y(0)+20))}" font-size="13" fill="#334155" text-anchor="middle">${fmt(x)}</text>`;
 }
 if(fill){let {f,g,lo,hi}=fill;let points=[];for(let i=0;i<=120;i++){let x=lo+(hi-lo)*i/120;points.push(`${X(x)},${Y(f(x))}`)}for(let i=120;i>=0;i--){let x=lo+(hi-lo)*i/120;points.push(`${X(x)},${Y(g(x))}`)}s+=`<polygon points="${points.join(' ')}" fill="#91d2c2" fill-opacity=".52"/>`}
 if(rects)for(let r of rects){let xx=X(r.x),ww=X(r.x+r.dx)-xx,yy=Y(r.h);s+=`<rect x="${xx}" y="${Math.min(yy,y0)}" width="${ww}" height="${Math.abs(yy-y0)}" fill="#7db6ed" fill-opacity=".35" stroke="#2776b8" stroke-width="1.2"/>`}
 s+=`<line x1="${L}" y1="${y0}" x2="${W-Q}" y2="${y0}" stroke="#43556a" stroke-width="1.6"/><line x1="${X(0)}" y1="${T}" x2="${X(0)}" y2="${H-B}" stroke="#43556a" stroke-width="1.6"/>`;
 curves.forEach((c,j)=>{let pts=[];for(let i=0;i<=420;i++){let x=a+(b-a)*i/420,y=c.fn(x);if(Number.isFinite(y))pts.push(`${X(x)},${Y(y)}`)}s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${c.color||['#17558c','#d36c35'][j%2]}" stroke-width="3" stroke-linejoin="round"/>`});return s+'</svg>';
}
function input(label,id,type='text',opts=[]){return `<div class="subpart"><label for="${id}">${label}</label>${type==='select'?`<select id="${id}"><option value="">Choose an answer</option>${opts.map(o=>`<option>${o}</option>`).join('')}</select>`:`<div class="math-entry"><input id="${id}" class="answer-fallback" type="text" autocomplete="off" spellcheck="false" placeholder="Enter your mathematical answer" aria-label="${label.replace(/<[^>]*>/g,'')}"/><button type="button" class="secondary math-toggle" data-editor="${id}" hidden>Use math keyboard</button></div>`}<div class="feedback" id="fb-${id}" aria-live="polite"></div></div>`}
function enableMathEditors(){
 if(!window.customElements?.get('math-field'))return;
 document.querySelectorAll('.math-entry').forEach(w=>{
  if(w.querySelector('math-field'))return;
  const original=w.querySelector('input'),toggle=w.querySelector('.math-toggle');
  const field=document.createElement('math-field');field.className='answer-math';
  field.setAttribute('aria-label',original.getAttribute('aria-label'));
  field.setAttribute('math-virtual-keyboard-policy','auto');
  field.value=original.value||'';
  w.insertBefore(field,original);original.hidden=true;original.style.display='none';
  toggle.hidden=false;toggle.textContent='Use plain text instead';
  toggle.onclick=()=>{
   const mathVisible=field.style.display!=='none';
   if(mathVisible){original.value=mathToText(field);field.style.display='none';original.hidden=false;original.style.display='block';original.focus();toggle.textContent='Use math editor';}
   else{field.value=original.value||'';original.hidden=true;original.style.display='none';field.style.display='block';field.focus();toggle.textContent='Use plain text instead';}
  };
 });
}
function mathToText(field){
 let latex=field.value||'';
 try{let ascii=field.getValue('ascii-math');if(ascii&&typeof ascii==='string')return ascii.replace(/\\operatorname\{([^}]+)\}/g,'$1');}catch(e){}
 return latex;
}
// The CDN module can load after the exam is first rendered.
if(window.customElements)customElements.whenDefined('math-field').then(enableMathEditors).catch(()=>{});

function card(i,title,body,solution){let hint=`<div class="hint-area"><button type="button" class="secondary" data-hint="${i}" aria-expanded="false">Show hint</button><p class="hint-text" id="hint${i}" hidden>${hints[i]}</p></div>`;return `<article class="exam-card" id="p${i}"><span class="tag">PROBLEM ${i}</span><h2>${title}</h2>${body}${examMode?hint:`<div class="actions"><button type="button" data-check="${i}">Check answers</button><button type="button" class="secondary" data-solution="${i}">Show worked solution</button></div><section class="solution" id="sol${i}" hidden><h3>Worked solution</h3>${solution}</section>`}</article>`}
function add(id,answer,mode='num',tol=.005,group=0){tasks.push({id,answer,mode,tol,group})}
function numeric(s){if(!s.trim())return NaN;try{if(window.math){let v=math.evaluate(s.replace(/π/g,'pi'));return typeof v==='number'?v:NaN}return Number(s)}catch{return NaN}}
function derivativeEquivalent(str,expected){if(!window.math)return null;try{let user=str.replace(/\+\s*C\b/gi,'').replace(/π/g,'pi').replace(/\^/g,'^');let d=math.derivative(user,'x').compile();let target=math.parse(expected).compile();return [.45,.8,1.2,1.7,2.4].every(x=>{let a=d.evaluate({x}),b=target.evaluate({x});return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<.001*Math.max(1,Math.abs(b))})}catch{return false}}
function expressionEquivalent(str,expected){if(!window.math)return null;try{let u=math.parse(str.replace(/π/g,'pi')).compile(),v=math.parse(expected).compile();return [.4,.7,1.2,1.8,2.2].every(x=>{let a=u.evaluate({x}),b=v.evaluate({x});return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<.002*Math.max(1,Math.abs(b))})}catch{return false}}
function answerText(el){
 if(el.tagName.toLowerCase()!=='input')return (el.value||'').trim();
 const field=el.parentElement?.querySelector('math-field');
 if(!field||field.style.display==='none')return el.value.trim();
 return mathToText(field).replace(/\\pi/g,'pi').replace(/\\cdot/g,'*').replace(/\\left|\\right/g,'').replace(/\\,/g,'').trim();
}

function check(group){let n=0,ok=0;for(let t of tasks.filter(t=>group===0||t.group===group)){let el=$(t.id),str=answerText(el),pass=false,unknown=false;if(!str){$('fb-'+t.id).textContent='Enter an answer first.';continue}if(t.mode==='choice')pass=str===t.answer;else if(t.mode==='num')pass=Math.abs(numeric(str)-t.answer)<=t.tol*Math.max(1,Math.abs(t.answer));else if(t.mode==='expr'){let res=expressionEquivalent(str,t.answer);unknown=res===null;pass=res===true}else if(t.mode==='anti'){let res=derivativeEquivalent(str,t.answer);unknown=res===null;pass=res===true&&/\+\s*C\b/i.test(str)}else if(t.mode==='points'){let vals=str.split(',').map(x=>numeric(x)).sort((a,b)=>a-b);pass=vals.length===t.answer.length&&vals.every((x,i)=>Math.abs(x-t.answer[i])<.01)}n++;if(pass)ok++;let fb=$('fb-'+t.id);fb.className='feedback '+(pass?'good':'bad');fb.textContent=unknown?'Symbolic checking unavailable offline; compare with worked solution.':pass?'Correct.':'Not quite. Review your calculation or reveal the solution.'}if(group===0)$('summary').textContent=`${ok} of ${n} entered answers correct`}
function make1(){let f=pick(functions),a,b;do{a=R(-2,1);b=a+R(2,4)}while(a<f.domain[0]||b>f.domain[1]);let n=R(4,8),side=pick(['Left','Right']),dx=(b-a)/n,rs=[];for(let i=0;i<n;i++){let x=a+i*dx,at=x+(side==='Right'?dx:0);rs.push({x,dx,h:f.fn(at)})}let value=dx*rs.reduce((s,r)=>s+r.h,0);let min=Infinity,max=-Infinity;for(let j=0;j<3000;j++){let y=f.fn(a+(b-a)*j/2999);min=Math.min(min,y);max=Math.max(max,y)}let exact=0;for(let j=0;j<20000;j++)exact+=f.fn(a+(j+.5)*(b-a)/20000)*(b-a)/20000;let classification=Math.abs(value-exact)<1e-7?'Cannot determine':value>exact?'Overestimate':'Underestimate';let id='p1num',cl='p1class';add(id,value,'num',.001,1);add(cl,classification,'choice',0,1);
let body=`<p>Estimate ${tex(`\\displaystyle\\int_{${a}}^{${b}} ${f.t}\\,dx`)} using the <strong>${side.toLowerCase()} Riemann sum</strong> with <strong>${n} equal rectangles</strong>. This integral cannot be evaluated using elementary antiderivatives; use a calculator for function values.</p><div class="graph-wrap">${svgPlot([f],a,b,{minimal:true})}</div><p class="note">On the graph, sketch your ${n} rectangles (not graded). The worked solution includes the correct sketch.</p>${input('Numerical approximation (round to three decimal places)',id)}${input('Is your sum an overestimate or underestimate of the true integral?',cl,'select',['Overestimate','Underestimate','Cannot determine'])}`;
let sum=rs.map((r,i)=>`${fmt(r.h)}`).join('+');let sol=`<p>${tex(`\\Delta x=\\frac{${b}-${a}}{${n}}=${fmt(dx)}`)}. The ${side.toLowerCase()} endpoints are ${rs.map(r=>fmt(r.x+(side==='Right'?dx:0))).join(', ')}.</p><p>${tex(`\\displaystyle ${side[0]}_${n}= ${fmt(dx)}\\bigl(${sum}\\bigr)\\approx ${value.toFixed(3)}`)}</p><div class="graph-wrap">${svgPlot([f],a,b,{rects:rs,minimal:true})}</div><p><strong>${classification}.</strong> Comparing with a high-accuracy numerical estimate gives ${fmt(exact)}. The graph shows why the rectangles ${classification==='Overestimate'?'have greater total area':classification==='Underestimate'?'have smaller total area':'do not give an obvious one-sided bound'}.</p>`;return card(1,'Riemann sums',body,sol)}
function make2(){let f=pick(areaF),a=pick([0,1,-1,2]),upper=pick([{t:'x^2',v:'x^2',d:'2*x',dt:'2x'},{t:'\\ln x',v:'log(x)',d:'1/x',dt:'\\frac1x'},{t:'e^x',v:'exp(x)',d:'exp(x)',dt:'e^x'},{t:'3x+1',v:'3*x+1',d:'3',dt:'3'}]),lower=pick([{t:String(a),v:String(a),d:'0',dt:'0'},{t:'x',v:'x',d:'1',dt:'1'},{t:'x^2',v:'x^2',d:'2*x',dt:'2x'}]);if(lower.v===upper.v)lower={t:String(a),v:String(a),d:'0',dt:'0'};
let ftex=x=>f.t.startsWith('e^{-t^2}')?`e^{-( ${x} )^2}`:f.t.startsWith('e^{-t^4}')?`e^{-( ${x} )^4}`:f.t.includes('sqrt')?`\\sqrt{1+(${x})^4}`:`e^{\\sin(${x})}`;let u=`(${upper.d})*(${f.expr(upper.v)})`,l=lower.d==='0'?'0':`(${lower.d})*(${f.expr(lower.v)})`,expected=`(${u})-(${l})`;let id='p2der';add(id,expected,'expr',0,2);
let body=`<p>Let ${tex(`g(x)=\\displaystyle\\int_{${lower.t}}^{${upper.t}} ${f.t}\\,dt`)}. The integral cannot be evaluated using elementary antiderivatives. <strong>Find ${tex("g'(x)")}</strong> using the Fundamental Theorem of Calculus and the chain rule. Do not try to find an antiderivative.</p>${input('Enter g′(x) using x (e.g. 2*x*exp(-x^4))',id,'expression')}`;
let sol=`<p>For ${tex('g(x)=\\int_{u(x)}^{v(x)}f(t)\\,dt')}, the Fundamental Theorem of Calculus gives ${tex("g'(x)=f(v(x))v'(x)-f(u(x))u'(x)")}.</p><p>Here ${tex(`v(x)=${upper.t},\\quad v'(x)=${upper.dt}`)} and ${tex(`u(x)=${lower.t},\\quad u'(x)=${lower.dt}`)}.</p><p>Therefore ${tex(`g'(x)=${upper.dt}\\left[${ftex(upper.t)}\\right]${lower.d==='0'?'':`-${lower.dt}\\left[${ftex(lower.t)}\\right]`}`)}.</p>`;return card(2,'Derivative of an area function',body,sol)}
function make3(){
 const A=R(1,5),B=R(1,4),C=R(1,4),m=R(2,5),p=R(2,5),k=R(1,4);
 const kind=R(0,2);
 let aa,ta,sa;
 if(kind===0){aa=`${A}*x^(1/${m})+${B}*exp(${k}*x)-${C}*x^${p}`;ta=`${A}\\sqrt[${m}]{x}+${B}e^{${k}x}-${C}x^{${p}}`;sa=`\\frac{${A*m}}{${m+1}}x^{\\frac{${m+1}}{${m}}}+\\frac{${B}}{${k}}e^{${k}x}-\\frac{${C}}{${p+1}}x^{${p+1}}+C`}
 else if(kind===1){aa=`${A}*cos(x)+${B}/x+${C}*x^${p}`;ta=`${A}\\cos x+\\frac{${B}}x+${C}x^{${p}}`;sa=`${A}\\sin x+${B}\\ln|x|+\\frac{${C}}{${p+1}}x^{${p+1}}+C`}
 else{aa=`${A}*x^(-1/${m})-${B}*sin(x)+${C}*exp(x)`;ta=`\\frac{${A}}{\\sqrt[${m}]{x}}-${B}\\sin x+${C}e^x`;sa=`\\frac{${A*m}}{${m-1}}x^{\\frac{${m-1}}{${m}}}+${B}\\cos x+${C}e^x+C`}
 const bKind=R(0,2);let bb,tb,bval,sb;
 if(bKind===0){let u=-R(3,6),v=-R(1,2),c=R(1,4),d=R(1,4);bb=`${c}/x+${d}*x`;tb=`\\int_{${u}}^{${v}}\\left(\\frac{${c}}x+${d}x\\right)\\,dx`;bval=c*Math.log(Math.abs(v/u))+d*(v*v-u*u)/2;sb=`\\left[${c}\\ln|x|+\\frac{${d}}2x^2\\right]_{${u}}^{${v}}=${fmt(bval)}`}
 else if(bKind===1){let v=pick([Math.PI/6,Math.PI/4,Math.PI/3]),c=R(1,4),d=R(1,4);bb=`${c}*cos(x)+${d}*x^2`;tb=`\\int_0^{${v===Math.PI/6?'\\pi/6':v===Math.PI/4?'\\pi/4':'\\pi/3'}}(${c}\\cos x+${d}x^2)\\,dx`;bval=c*Math.sin(v)+d*v**3/3;sb=`\\left[${c}\\sin x+\\frac{${d}}3x^3\\right]_0^{${v===Math.PI/6?'\\pi/6':v===Math.PI/4?'\\pi/4':'\\pi/3'}}\\approx ${fmt(bval)}`}
 else{let v=R(1,3),c=R(1,4),d=R(1,4);bb=`${c}*x^2-${d}*exp(x)`;tb=`\\int_0^{${v}}(${c}x^2-${d}e^x)\\,dx`;bval=c*v**3/3-d*(Math.exp(v)-1);sb=`\\left[\\frac{${c}}3x^3-${d}e^x\\right]_0^{${v}}\\approx ${fmt(bval)}`}
 const cKind=R(0,2),h=R(1,3),D=R(1,4);let cc,tc,sc;
 if(cKind===0){cc=`(${A}*x-${B})*(x+${h})/x^2`;tc=`\\frac{(${A}x-${B})(x+${h})}{x^2}`;sc=`${A}x+(${A*h-B})\\ln|x|+\\frac{${B*h}}x+C`}
 else if(cKind===1){cc=`${A}*x^2+${B}/x-${C}/x^2`;tc=`${A}x^2+\\frac{${B}}x-\\frac{${C}}{x^2}`;sc=`\\frac{${A}}3x^3+${B}\\ln|x|+\\frac{${C}}x+C`}
 else{cc=`${A}*x^(-2/3)+${B}*x^2-${C}*cos(x)`;tc=`\\frac{${A}}{\\sqrt[3]{x^2}}+${B}x^2-${C}\\cos x`;sc=`${3*A}\\sqrt[3]{x}+\\frac{${B}}3x^3-${C}\\sin x+C`}
 // Part (d) always combines inverse trigonometric and trigonometric antiderivatives.
 const dKind=R(0,2);let dd,td,sd;
 if(dKind===0){dd=`${C}/(1+x^2)-${D}*sec(x)^2`;td=`\\frac{${C}}{1+x^2}-${D}\\sec^2x`;sd=`${C}\\arctan x-${D}\\tan x+C`}
 else if(dKind===1){dd=`${C}/sqrt(1-x^2)+${D}*sin(x)`;td=`\\frac{${C}}{\\sqrt{1-x^2}}+${D}\\sin x`;sd=`${C}\\arcsin x-${D}\\cos x+C`}
 else{dd=`${C}/(1+x^2)+${D}*cos(x)`;td=`\\frac{${C}}{1+x^2}+${D}\\cos x`;sd=`${C}\\arctan x+${D}\\sin x+C`}
 add('p3a',aa,'anti',0,3);add('p3b',bval,'num',.001,3);add('p3c',cc,'anti',0,3);add('p3d',dd,'anti',0,3);
 let body=`<p>Evaluate all four integrals. For indefinite integrals, include the constant of integration ${tex('C')}.</p>${input(`(a) ${tex(`\\displaystyle\\int(${ta})\\,dx`)}`,'p3a')}${input(`(b) ${tex(`\\displaystyle ${tb}`)} — numerical value or exact expression`,'p3b')}${input(`(c) ${tex(`\\displaystyle\\int\\left(${tc}\\right)\\,dx`)}`,'p3c')}${input(`(d) ${tex(`\\displaystyle\\int\\left(${td}\\right)\\,dx`)}`,'p3d')}`;
 let sol=`<p><strong>(a)</strong> Apply the appropriate power, logarithm, exponential, and trigonometric rules:</p><p>${tex(sa)}</p><p><strong>(b)</strong> ${tex(sb)}. ${bKind===0?'Because the bounds are negative, the logarithmic antiderivative must be written as \(\ln|x|\), not \(\ln x\).':''}</p><p><strong>(c)</strong> Simplify using exponent rules or expand before integrating:</p><p>${tex(sc)}</p><p><strong>(d)</strong> Combine an inverse-trigonometric antiderivative with a trigonometric antiderivative:</p><p>${tex(sd)}</p>`;
 return card(3,'Evaluate integrals',body,sol)
}

function make4(){
 const count=R(3,4),ys=[pick([2,3,4]),0,pick([-4,-3,-2])];
 if(count===4)ys.push(pick([-4,-3,-2,0,2,3]));
 ys.push(pick([2,3,4]));
 // At most four line segments; vertices and zero crossings are at integer coordinates.
 const N=ys.length-1;
 const fn=x=>{let i=Math.max(0,Math.min(N-1,Math.floor(x)));return ys[i]+(ys[i+1]-ys[i])*(x-i)};
 let signed=0,total=0,roots=[];
 for(let i=0;i<N;i++){
  let v=ys[i],w=ys[i+1];signed+=(v+w)/2;
  if(v===0&&i>0)roots.push(i);
  if(v*w<0)roots.push(i-v/(w-v));
  if(v*w>=0)total+=(Math.abs(v)+Math.abs(w))/2;
  else total+=(v*v+w*w)/(2*(Math.abs(v)+Math.abs(w)));
 }
 let id='p4g',id2='p4crit',id3='p4total';add(id,signed,'num',.001,4);add(id2,roots.sort((a,b)=>a-b),'points',0,4);add(id3,total,'num',.001,4);
 let body=`<p>Let ${tex('g(x)=\\int_0^x f(t)\\,dt')}, where ${tex('f')} is the continuous piecewise-linear function shown. Use signed areas of triangles and trapezoids; briefly explain your reasoning.</p><div class="graph-wrap">${svgPlot([{fn}],0,N,{integerGrid:true})}</div>${input(`(a) Find g(${N})`,id)}${input(`(b) Find all critical numbers of g on (0,${N}), separated by commas`,id2)}${input(`(c) Find the total geometric area between f and the x-axis on [0,${N}]`,id3)}`;
 let sol=`<p>Each segment has width 1. Signed area is positive above the axis and negative below.</p><p>${tex(`g(${N})=${fmt(signed)}`)}.</p><p>By the Fundamental Theorem of Calculus, ${tex("g'(x)=f(x)")}. Interior critical numbers occur where ${tex('f(x)=0')}: <strong>${roots.map(fmt).join(', ')}</strong>.</p><p>The total geometric area counts both positive and negative regions positively: <strong>${fmt(total)}</strong>.</p><p class="note">Vertices: ${ys.map((y,i)=>`(${i}, ${y})`).join(', ')}. Split any segment crossing the axis into two triangles.</p>`;
 return card(4,'Accumulated signed area',body,sol)
}

function make5(){
 // Keep coefficients natural: the curves intersect at x=0 and x=1.
 // One curve uses a radical; the other is an integer power.
 let m=pick([2,3,4,5]),n=pick([2,3,4,5,6]),scale=pick([1,2,3,4]);
 let f=x=>scale*Math.pow(x,1/m),g=x=>scale*Math.pow(x,n);
 let area=scale*(m/(m+1)-1/(n+1)),id='p5area';add(id,area,'num',.001,5);
 const coefficient=scale===1?'':String(scale);
 const radical=m===2?`\\sqrt{x}`:`\\sqrt[${m}]{x}`;
 const first=`${coefficient}${radical}`,second=`${coefficient}x^{${n}}`;
 let body=`<p>The curves ${tex(`y=${first}`)} and ${tex(`y=${second}`)} intersect at ${tex('x=0')} and ${tex('x=1')}. Their graphs are shown <strong>without shading</strong>. Shade the enclosed region on your own sketch (not graded), then calculate its exact area.</p><div class="graph-wrap">${svgPlot([{fn:f,color:'#17558c'},{fn:g,color:'#d36c35'}],0,1,{minimal:true})}</div>${input('Enclosed area (exact fraction or decimal accepted)',id)}`;
 let sol=`<p>On ${tex('0<x<1')}, the radical curve lies above the polynomial curve. Integrate upper minus lower.</p><p>${tex(`A=\\int_0^1\\left(${first}-${second}\\right)\\,dx`)}</p><p>${tex(`A=${scale}\\left(\\frac{${m}}{${m+1}}-\\frac{1}{${n+1}}\\right)=${fmt(area)}`)}</p><div class="graph-wrap">${svgPlot([{fn:f,color:'#17558c'},{fn:g,color:'#d36c35'}],0,1,{fill:{f,g,lo:0,hi:1},minimal:true})}</div><p class="note">The shaded region appears only in the worked solution.</p>`;
 return card(5,'Area between power curves',body,sol)
}
function typeset(){if(window.MathJax?.typesetPromise)MathJax.typesetPromise().catch(()=>{})}
function evaluateTask(t){let el=$(t.id),str=answerText(el),pass=false,unknown=false;if(!str)return {pass:false,empty:true};if(t.mode==='choice')pass=str===t.answer;else if(t.mode==='num')pass=Math.abs(numeric(str)-t.answer)<=t.tol*Math.max(1,Math.abs(t.answer));else if(t.mode==='expr'){let res=expressionEquivalent(str,t.answer);unknown=res===null;pass=res===true}else if(t.mode==='anti'){let res=derivativeEquivalent(str,t.answer);unknown=res===null;pass=res===true&&/\+\s*C\b/i.test(str)}else if(t.mode==='points'){let vals=str.split(',').map(x=>numeric(x)).sort((a,b)=>a-b);pass=vals.length===t.answer.length&&vals.every((x,i)=>Math.abs(x-t.answer[i])<.01)}return {pass,unknown,empty:false}}
function submitExam(){if(!examMode||submitted)return;const results=tasks.map(t=>({...t,...evaluateTask(t)}));if(results.some(t=>t.unknown)){alert('Symbolic grading is unavailable. Please connect to the internet so the math library loads, then submit again.');return}submitted=true;let correct=results.filter(t=>t.pass).length,total=results.length,unanswered=results.filter(t=>t.empty).length;let groups=[1,2,3,4,5].map(i=>{let a=results.filter(t=>t.group===i);return {i,correct:a.filter(t=>t.pass).length,total:a.length}});let names=['Riemann sums','Area functions / FTC','Antiderivatives and integrals','Signed area and area functions','Area between curves'];let pct=total?Math.round(100*correct/total):0;let out=$('examResults');out.innerHTML=`<h2>Exam submitted</h2><p class="score-line">${correct} / ${total} correct (${pct}%)</p><p>${unanswered} unanswered ${unanswered===1?'answer':'answers'} counted as incorrect.</p><table class="score-table"><thead><tr><th>Section</th><th>Score</th></tr></thead><tbody>${groups.map(g=>`<tr><td>${g.i}. ${names[g.i-1]}</td><td>${g.correct} / ${g.total}</td></tr>`).join('')}</tbody></table><p class="note">Each answer box counts as one point. Hints do not affect the score. This is a self-assessment, not a secure proctored exam.</p>`;out.hidden=false;$('summary').textContent=`Submitted · ${pct}%`;$('submitExam').disabled=true;document.querySelectorAll('#exam input,#exam select,#exam math-field').forEach(el=>{el.disabled=true;if(el.tagName.toLowerCase()==='math-field')el.readOnly=true});document.querySelectorAll('.math-toggle').forEach(b=>b.disabled=true);out.scrollIntoView({behavior:'smooth',block:'nearest'})}
function generate(){tasks=[];serial++;submitted=false;$('exam').innerHTML=make1()+make2()+make3()+make4()+make5();$('summary').textContent='';$('examResults').hidden=true;$('examResults').innerHTML='';$('submitExam').disabled=false;enableMathEditors();typeset()}
function setMode(next){examMode=next;$('practiceMode').classList.toggle('mode-active',!next);$('examMode').classList.toggle('mode-active',next);$('practiceMode').classList.toggle('secondary',next);$('examMode').classList.toggle('secondary',!next);$('modeDescription').textContent=next?'Exam mode: five randomized problems (one per section). Hints are available; answers and worked solutions are hidden until you submit for a score.':'Practice mode: check individual answers and view worked solutions.';$('checkAll').hidden=next;$('showAll').hidden=next;$('submitExam').hidden=!next;$('generate').textContent=next?'Generate new exam':'Generate new practice';generate()}
document.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.hint){let h=$('hint'+b.dataset.hint);h.hidden=!h.hidden;b.textContent=h.hidden?'Show hint':'Hide hint';b.setAttribute('aria-expanded',String(!h.hidden))}if(examMode)return;if(b.dataset.check)check(Number(b.dataset.check));if(b.dataset.solution){let s=$('sol'+b.dataset.solution);s.hidden=!s.hidden;b.textContent=s.hidden?'Show worked solution':'Hide worked solution';if(!s.hidden)typeset()}});
$('generate').onclick=generate;$('practiceMode').onclick=()=>setMode(false);$('examMode').onclick=()=>setMode(true);$('submitExam').onclick=submitExam;$('checkAll').onclick=()=>check(0);$('showAll').onclick=()=>{for(let i=1;i<=5;i++)$('sol'+i).hidden=false;document.querySelectorAll('[data-solution]').forEach(b=>b.textContent='Hide worked solution');typeset()};setMode(false);
})();
