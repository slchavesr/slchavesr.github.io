/* MATH 1190 v15: free-entry intervals and graph-of-f' question variants.
   Derivative jumps are represented at points where f' is UNDEFINED;
   f is assumed continuous. A genuine derivative cannot have a jump
   while remaining defined throughout the interval (Darboux property). */
(()=>{
'use strict';
const num=s=>{s=String(s).trim().replace(/−/g,'-').replace(/π/g,'pi').replace(/\\pi/g,'pi');if(/^[-+]?inf(inity)?$/i.test(s))return s[0]==='-'?-Infinity:Infinity;if(!/^[-+\d.\s*/()pi]+$/.test(s))return NaN;try{return Function('"use strict";return ('+s.replace(/pi/g,'Math.PI')+')')()}catch{return NaN}};
function parseIntervals(raw){raw=String(raw||'').trim().replace(/\\left|\\right/g,'').replace(/\\cup|∪/g,' U ').replace(/\s+or\s+/gi,' U ').replace(/\\infty|∞/g,'infinity').replace(/−/g,'-');if(/^(none|empty|∅)$/i.test(raw))return [];
 const parts=raw.split(/\s+U\s+|\s*;\s*/i);if(!parts.length)return null;
 let out=[];for(let part of parts){let m=part.trim().match(/^([([])\s*(.+?)\s*,\s*(.+?)\s*([)\]])$/);if(!m)return null;let a=num(m[2]),b=num(m[3]);if(Number.isNaN(a)||Number.isNaN(b)||a>=b)return null;out.push({a,b,lc:m[1]==='[',rc:m[4]===']'});}return out.sort((x,y)=>x.a-y.a||x.b-y.b);
}
function intervalEqual(a,b){let x=parseIntervals(a),y=parseIntervals(b);return x!==null&&y!==null&&x.length===y.length&&x.every((v,i)=>Math.abs(v.a-y[i].a)<.015||v.a===y[i].a)&&x.every((v,i)=>Math.abs(v.b-y[i].b)<.015||v.b===y[i].b)&&x.every((v,i)=>v.lc===y[i].lc&&v.rc===y[i].rc);}
window.math1190IntervalEqual=intervalEqual;
window.math1190LooksLikeInterval=s=>/[()\[\]∪]|\\cup|infinity|∞/i.test(String(s))&&String(s).includes(',');
const choice=a=>a[Math.floor(Math.random()*a.length)],r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const fmt=x=>String(Math.round(x*1000)/1000).replace(/^-0$/,'0');
function make(){
 const style=choice(['continuous-corners','jump','jump','smooth','sharp-peak']);
 const shift=r(-1,1),flip=choice([-1,1]);
 // Pieces are linear portions of the graph y=f'(x), with optional jumps.
 let nodes,parts,breaks=[];
 if(style==='jump'){
  let z=choice([-1,0,1]);breaks=[z];
  parts=[{a:-4,b:z,ya:flip*(-3+shift),yb:flip*(-1+shift)},{a:z,b:4,ya:flip*(3+shift),yb:flip*(-2+shift)}];
 }else if(style==='smooth'){
  let c=choice([-1,0,1]);let k=flip;
  // A smooth parabola with zeros and a vertex, drawn as a true curve.
  const f=x=>k*(3-(x-c)**2);const roots=[c-Math.sqrt(3),c+Math.sqrt(3)];
  return smoothQuestion(f,roots,[c],[-4,4],[-8,5],`Smooth parabola (vertex at an unlabeled x-value)`);
 }else{
  nodes=style==='sharp-peak'?[-4,-2,0,2,4]:[-4,-2,0,2,4];
  const ys=style==='sharp-peak'?[-2,1,3,1,-2]:[-3,2,-2,2,-3];
  parts=nodes.slice(0,-1).map((a,i)=>({a,b:nodes[i+1],ya:flip*(ys[i]+shift),yb:flip*(ys[i+1]+shift)}));
 }
 return linearQuestion(parts,breaks,style);
}
function svgGraph(parts,breaks,fn){const W=740,H=390,L=52,R=25,T=20,B=42,xmin=-4,xmax=4,ymin=-7,ymax=7;
 const X=x=>L+(x-xmin)/(xmax-xmin)*(W-L-R),Y=y=>H-B-(y-ymin)/(ymax-ymin)*(H-T-B);
 let s=`<svg class="advanced-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Graph of y equals f prime on the interval from minus four to four. Open circles show where the derivative is undefined."><rect width="${W}" height="${H}" fill="white"/>`;
 for(let x=-4;x<=4;x++)s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${H-B}" stroke="#e2e8f0"/><text x="${X(x)+3}" y="${Y(0)+18}" font-size="13">${x}</text>`;
 for(let y=-6;y<=6;y+=2)s+=`<line x1="${L}" y1="${Y(y)}" x2="${W-R}" y2="${Y(y)}" stroke="#e2e8f0"/>`;
 s+=`<line x1="${L}" y1="${Y(0)}" x2="${W-R}" y2="${Y(0)}" stroke="#64748b" stroke-width="2"/><line x1="${X(0)}" y1="${T}" x2="${X(0)}" y2="${H-B}" stroke="#64748b" stroke-width="2"/><text x="${W-110}" y="${T+18}" font-size="17" fill="#1d6098">y = f′(x)</text>`;
 if(fn){let d='';for(let i=0;i<=500;i++){let x=-4+8*i/500,y=fn(x);d+=(i?'L':'M')+X(x).toFixed(2)+','+Y(y).toFixed(2)+' ';}s+=`<path d="${d}" fill="none" stroke="#176ca5" stroke-width="3.5"/>`;}
 else {for(let p of parts)s+=`<path d="M${X(p.a)},${Y(p.ya)} L${X(p.b)},${Y(p.yb)}" stroke="#176ca5" stroke-width="3.5" fill="none"/>`;for(let x of breaks){for(let p of parts){if(p.a===x||p.b===x){let y=p.a===x?p.ya:p.yb;s+=`<circle cx="${X(x)}" cy="${Y(y)}" r="6" stroke="#176ca5" stroke-width="2.8" fill="white"/>`;}}}}
 return s+'</svg>';
}
const sign=x=>x>1e-7?1:x< -1e-7?-1:0;
function analyze(parts,breaks,fn,turnsOverride){let cuts=new Set([-4,4,...breaks]);let zeros=[];
 for(let p of parts){cuts.add(p.a);cuts.add(p.b);if(p.ya*p.yb<0){let z=p.a-p.ya*(p.b-p.a)/(p.yb-p.ya);cuts.add(z);zeros.push(z);}else{if(p.ya===0)zeros.push(p.a);if(p.yb===0)zeros.push(p.b);}}
 const ordered=[...cuts].sort((a,b)=>a-b),pos=[],neg=[],up=[],down=[];
 const evaluate=x=>{let p=parts.find(p=>x>p.a+1e-9&&x<p.b-1e-9);return p?p.ya+(p.yb-p.ya)*(x-p.a)/(p.b-p.a):NaN};
 for(let i=0;i<ordered.length-1;i++){let a=ordered[i],b=ordered[i+1],v=evaluate((a+b)/2);if(sign(v)>0)pos.push([a,b]);if(sign(v)<0)neg.push([a,b]);let p=parts.find(p=>(a+b)/2>p.a&& (a+b)/2<p.b),s=(p.yb-p.ya)/(p.b-p.a);if(sign(s)>0)up.push([a,b]);if(sign(s)<0)down.push([a,b]);}
 // Concavity intervals should not be artificially split by zeros of f'.
 function merge(arr){let out=[];for(let [a,b] of arr){let last=out[out.length-1];if(last&&Math.abs(last[1]-a)<1e-7&&!breaks.some(x=>Math.abs(x-a)<1e-7))last[1]=b;else out.push([a,b]);}return out;}
 const asText=arr=>arr.length?arr.map(([a,b])=>`(${fmt(a)},${fmt(b)})`).join(' ∪ '):'none';
 let candidates=[...new Set([...zeros,...breaks])].filter(x=>x>-4&&x<4).sort((a,b)=>a-b);
 let points=candidates.map(x=>{let l=sign(evaluate(x-1e-4)),r=sign(evaluate(x+1e-4));return {x,type:l>0&&r<0?'Local maximum':l<0&&r>0?'Local minimum':'Neither'};});
 let turns=[];for(let i=1;i<parts.length;i++){let p=parts[i-1],q=parts[i],x=p.b;if(x!==q.a)continue;let s1=sign(p.yb-p.ya),s2=sign(q.yb-q.ya);if(s1*s2===-1)turns.push(x);}
 return {increasing:asText(merge(pos)),decreasing:asText(merge(neg)),concUp:asText(merge(up)),concDown:asText(merge(down)),points,turns:turnsOverride||turns};
}
function linearQuestion(parts,breaks,style){const info=analyze(parts,breaks),graph=svgGraph(parts,breaks);const warning=breaks.length?`At the open circles, f′ is undefined; f is assumed continuous. A jump in f′ is permitted here because the derivative does not exist at that x-value.`:`A sharp corner of the graph of f′ does not necessarily mean f′ is undefined: it means the slope of f′ may fail to exist.`;
 return {kind:'derivativeGraph',topic:'derivativeGraph',prompt:`The graph shows <b>y=f′(x)</b> for a continuous function f on [-4,4]. Enter intervals of increase, decrease, concavity, and all critical numbers and inflection x-values. <b>Do not assume f′ exists at an open circle.</b>`,svg:graph,segments:[],...info,solution:`${warning}<br>Increasing: ${info.increasing}; decreasing: ${info.decreasing}; concave up: ${info.concUp}; concave down: ${info.concDown}. Critical numbers: ${info.points.map(p=>`${fmt(p.x)} (${p.type})`).join('; ')||'none'}. Inflection x-values: ${info.turns.map(fmt).join(', ')||'none'}.`};}
function smoothQuestion(fn,roots,turns,domain,range){let xs=[-4,...roots,4].sort((a,b)=>a-b),inc=[],dec=[],up=[],down=[];for(let i=0;i<xs.length-1;i++){let a=xs[i],b=xs[i+1];(fn((a+b)/2)>0?inc:dec).push([a,b]);}if(fn(-3)<fn(0)){up.push([-4,turns[0]]);down.push([turns[0],4]);}else{down.push([-4,turns[0]]);up.push([turns[0],4]);}
 const str=a=>a.map(([x,y])=>`(${fmt(x)},${fmt(y)})`).join(' ∪ ')||'none';const points=roots.map(x=>({x,type:fn(x-.0001)>0?'Local maximum':'Local minimum'}));const info={increasing:str(inc),decreasing:str(dec),concUp:str(up),concDown:str(down),points,turns};return {kind:'derivativeGraph',topic:'derivativeGraph',prompt:`The graph is y=f′(x), with f continuous on [-4,4]. Enter intervals yourself and identify critical numbers, classifications, and inflection x-values. Round noninteger values to two decimals.`,svg:svgGraph([],[],fn),segments:[],...info,solution:`Increasing: ${info.increasing}; decreasing: ${info.decreasing}; concave up: ${info.concUp}; concave down: ${info.concDown}. Critical numbers: ${points.map(p=>`${fmt(p.x)} (${p.type})`).join(', ')}. Inflection x-values: ${turns.map(fmt).join(', ')}.`};}
window.math1190AdvancedFactory.derivativeGraph=make;
})();
