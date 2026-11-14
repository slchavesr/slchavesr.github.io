/* Version 16: predominantly curved derivative graphs, including exam-style jumps.
   f is continuous, and f' is undefined at jumps. Corners of f' are not
   automatically critical points of f. All grading metadata is computed from
   piecewise analytic polynomials, not from a visual approximation. */
(()=>{'use strict';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>String(Math.round(n*1000)/1000).replace(/^-0$/,'0');
const sign=n=>n>1e-7?1:n< -1e-7?-1:0;
const unique=a=>[...new Set(a.map(v=>Math.round(v*1e7)/1e7))].sort((a,b)=>a-b);
const domain=[-4,4];
function poly(roots,scale){return x=>roots.reduce((v,r)=>v*(x-r),scale);}
function piece(a,b,fn,zeros,turns){return {a,b,fn,zeros:zeros.filter(x=>x>a+1e-6&&x<b-1e-6),turns:turns.filter(x=>x>a+1e-6&&x<b-1e-6)};}
function create(){
 const family=pick(['two-curves','two-curves','two-curves','exam-style','cubic-curve','cornered-curve','curved-jump']);
 const flip=pick([-1,1]),scale=pick([.3,.4,.5,.6]) * flip;
 let parts=[],breaks=[],corners=[];
 if(family==='two-curves'||family==='exam-style'||family==='curved-jump'){
   const b=pick([-.5,0,.5]);breaks=[b];
   const lroots=[b-3,b-1], lturn=b-2;
   parts.push(piece(-4,b,poly(lroots,-scale),lroots,[lturn]));
   if(family==='exam-style'){
     const root=b+2, y0=pick([1.5,2.1,2.7])*flip;
     parts.push(piece(b,4,x=>y0*(root-x)/(root-b),[root],[]));
   }else{
     const rroots=[b+1,b+3];
     const rightScale=family==='curved-jump'?-scale:scale;
     parts.push(piece(b,4,poly(rroots,rightScale),rroots,[b+2]));
   }
 }else if(family==='cubic-curve'){
   const b=0;breaks=[b];
   const roots=[-3.4,-2.3,-.8];
   const S=roots.reduce((a,b)=>a+b,0), P=roots[0]*roots[1]+roots[0]*roots[2]+roots[1]*roots[2];
   const disc=Math.sqrt(4*S*S-12*P), turns=[(2*S-disc)/6,(2*S+disc)/6];
   parts.push(piece(-4,b,poly(roots,scale*.65),roots,turns));
   parts.push(piece(b,4,poly([1,3],-scale),[1,3],[2]));
 }else{
   // Continuous f' with a genuine sharp peak; f'' undefined there, not f'.
   const b=pick([-.5,0,.5]);corners=[b];
   const leftRoots=[b-2.8,b-.8],rightRoots=[b+1,b+3];
   const left=poly(leftRoots,scale),right=poly(rightRoots,-scale);
   const offset=left(b)-right(b);
   parts.push(piece(-4,b,left,leftRoots,[b-1.8]));
   const fn=x=>right(x)+offset;
   const disc=offset/scale; // roots of (x-r1)(x-r2) = disc
   const mid=b+2, half=Math.sqrt(Math.max(0,1+disc));
   const roots=disc>=-1?[mid-half,mid+half]:[];
   parts.push(piece(b,4,fn,roots,[mid]));
 }
 return question(parts,breaks,corners,family);
}
function question(parts,breaks,corners,family){
 const allCuts=unique([-4,4,...breaks,...corners,...parts.flatMap(p=>[...p.zeros,...p.turns])]);
 const intervals={inc:[],dec:[],up:[],down:[]};
 function locate(x){return parts.find(p=>x>p.a+1e-8&&x<p.b-1e-8);}
 function derivative(p,x){let h=1e-5;return (p.fn(x+h)-p.fn(x-h))/(2*h);}
 const intervalsData=[];
 for(let i=0;i<allCuts.length-1;i++){
   const a=allCuts[i],b=allCuts[i+1],x=(a+b)/2,p=locate(x);if(!p)continue;
   const val=p.fn(x),slope=derivative(p,x);
   intervalsData.push({a,b,val:sign(val),slope:sign(slope)});
 }
 // Merge intervals only through ordinary points where the same property continues.
 // A zero of f' may lie inside a concavity interval; a turning point of f'
 // may lie inside an increasing interval. Never merge through an undefined f'.
 function assemble(key){let out=[];for(const v of intervalsData){if((key==='inc'&&v.val<=0)||(key==='dec'&&v.val>=0)||(key==='up'&&v.slope<=0)||(key==='down'&&v.slope>=0))continue;
   const prev=out[out.length-1];if(prev&&Math.abs(prev[1]-v.a)<1e-6&&!breaks.some(x=>Math.abs(x-v.a)<1e-6))prev[1]=v.b;else out.push([v.a,v.b]);
 }return out.length?out.map(([a,b])=>`(${fmt(a)},${fmt(b)})`).join(' ∪ '):'none';}
 const candidates=unique([...parts.flatMap(p=>p.zeros),...breaks]);
 const points=candidates.filter(x=>x>-4&&x<4).map(x=>{
   const l=locate(x-1e-4),r=locate(x+1e-4),lv=l?sign(l.fn(x-1e-4)):0,rv=r?sign(r.fn(x+1e-4)):0;
   return {x,type:lv>0&&rv<0?'Local maximum':lv<0&&rv>0?'Local minimum':'Neither'};
 });
 const inflections=[];
 const turnCandidates=unique([...parts.flatMap(p=>p.turns),...breaks,...corners]);
 for(const x of turnCandidates){if(x<=-4||x>=4)continue;const l=locate(x-1e-4),r=locate(x+1e-4);if(l&&r&&sign(derivative(l,x-1e-4))*sign(derivative(r,x+1e-4))<0)inflections.push(x);}
 const info={increasing:assemble('inc'),decreasing:assemble('dec'),concUp:assemble('up'),concDown:assemble('down'),points,turns:unique(inflections)};
 const W=760,H=395,L=55,R=20,T=23,B=45,ymin=-7,ymax=7;
 const X=x=>L+(x+4)/8*(W-L-R),Y=y=>H-B-(y-ymin)/(ymax-ymin)*(H-T-B);
 let svg=`<svg class="advanced-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Piecewise graph of f prime. Open circles mark undefined derivative values."><rect width="${W}" height="${H}" fill="white"/>`;
 for(let x=-4;x<=4;x++)svg+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${H-B}" stroke="#e2e8f0"/><text x="${X(x)+3}" y="${Y(0)+17}" font-size="13">${x}</text>`;
 for(let y=-6;y<=6;y+=2)svg+=`<line x1="${L}" y1="${Y(y)}" x2="${W-R}" y2="${Y(y)}" stroke="#e2e8f0"/>`;
 svg+=`<line x1="${L}" y1="${Y(0)}" x2="${W-R}" y2="${Y(0)}" stroke="#64748b" stroke-width="2"/><line x1="${X(0)}" y1="${T}" x2="${X(0)}" y2="${H-B}" stroke="#64748b" stroke-width="2"/><text x="${W-110}" y="${T+18}" font-size="18" fill="#176ca5">y = f′(x)</text>`;
 for(const p of parts){let path='';for(let i=0;i<=180;i++){let x=p.a+(p.b-p.a)*i/180;path+=(i?'L':'M')+X(x).toFixed(2)+','+Y(p.fn(x)).toFixed(2)+' ';}svg+=`<path d="${path}" fill="none" stroke="#176ca5" stroke-width="3.5"/>`;}
 for(const x of breaks){for(const p of parts){if(Math.abs(p.a-x)<1e-6||Math.abs(p.b-x)<1e-6)svg+=`<circle cx="${X(x)}" cy="${Y(p.fn(x))}" r="6" fill="white" stroke="#176ca5" stroke-width="2.8"/>`;}}
 svg+='</svg>';
 const note=breaks.length?'The open circles indicate that f′ is undefined at that x-value. The function f is assumed continuous. Examine signs on both sides.':'A corner in the graph of f′ does not imply f′ itself is undefined. It may indicate that f″ does not exist.';
 const solution=`${note}<br>Increasing: ${info.increasing}; decreasing: ${info.decreasing}; concave up: ${info.concUp}; concave down: ${info.concDown}. Critical numbers: ${points.map(p=>`${fmt(p.x)} (${p.type})`).join('; ')||'none'}. Inflection x-values: ${info.turns.map(fmt).join(', ')||'none'}.`;
 return {kind:'derivativeGraph',topic:'derivativeGraph',prompt:'The graph represents <b>y=f′(x)</b> for a continuous function f on [-4,4]. Enter all intervals in interval notation, classify critical numbers, and identify inflection x-values. <b>Open circles mean f′ is undefined.</b>',svg,segments:[],...info,solution};
}
window.math1190AdvancedFactory.derivativeGraph=create;
window.math1190V16GraphTest=create;
})();
