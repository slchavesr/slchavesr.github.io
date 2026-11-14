/* Version 14: broader, mathematically checked extrema and curve-analysis generators. */
(()=>{
'use strict';
const F=window.math1190AdvancedFactory;if(!F)return;
const pick=a=>a[Math.floor(Math.random()*a.length)], r=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), near=(a,b)=>Math.abs(a-b)<1e-7;
const n=x=>Number(x.toFixed(3)), fmt=x=>String(n(x)).replace(/^-0$/,'0');
const latex=x=>`\\(${x}\\)`;
function extrema(){
 const k=pick([1,2]),c=r(-2,2),family=pick(['quartic','cubic','rational','logproduct','expProduct','trigmix','quadraticProduct']);
 let f,crit,lo,hi,formula,derivative;
 if(family==='quartic'){let a=pick([1,2]);f=x=>k*(x*x-a*a)**2+c;crit=[-a,0,a];lo=-3;hi=3;formula=`${k===1?'':k}(x^2-${a*a})^2${c<0?c:'+'+c}`;derivative=`4${k===1?'':k}x(x^2-${a*a})`;}
 else if(family==='cubic'){let a=pick([-2,-1]),b=pick([1,2]);f=x=>k*(x*x*x/3-(a+b)*x*x/2+a*b*x)+c;crit=[a,b];lo=-3;hi=3;formula=`${k}\\left(\\frac{x^3}{3}-\\frac{${a+b}x^2}{2}+${a*b}x\\right)${c<0?c:'+'+c}`;derivative=`${k}(x-${a})(x-${b})`;}
 else if(family==='rational'){f=x=>k*x/(x*x+1)+c;crit=[-1,1];lo=-3;hi=3;formula=`\\frac{${k}x}{x^2+1}${c<0?c:'+'+c}`;derivative=`\\frac{${k}(1-x^2)}{(x^2+1)^2}`;}
 else if(family==='logproduct'){f=x=>k*x*x*Math.log(x)+c;crit=[Math.exp(-.5)];lo=.5;hi=3;formula=`${k}x^2\\ln x${c<0?c:'+'+c}`;derivative=`${k}x(2\\ln x+1)`;}
 else if(family==='expProduct'){f=x=>k*x*Math.exp(-x)+c;crit=[1];lo=0;hi=4;formula=`${k}xe^{-x}${c<0?c:'+'+c}`;derivative=`${k}e^{-x}(1-x)`;}
 else if(family==='trigmix'){f=x=>x+2*Math.sin(x)+c;crit=[-2*Math.PI/3,2*Math.PI/3];lo=-Math.PI;hi=Math.PI;formula=`x+2\\sin x${c<0?c:'+'+c}`;derivative=`1+2\\cos x`;}
 else {f=x=>k*x*x*(x-2)*(x-2)+c;crit=[0,1,2];lo=-1;hi=3;formula=`${k===1?'':k}x^2(x-2)^2${c<0?c:'+'+c}`;derivative=`4${k===1?'':k}x(x-1)(x-2)`;}
 const candidates=[lo,hi,...crit.filter(x=>x>=lo&&x<=hi)].map(x=>({x,y:f(x)}));
 const min=Math.min(...candidates.map(p=>p.y)),max=Math.max(...candidates.map(p=>p.y));
 const rows=candidates.filter(p=>near(p.y,min)||near(p.y,max)).map(p=>({...p,type:near(p.y,max)?'Maximum':'Minimum'}));
 return {kind:'absolute',topic:'absolute',prompt:`Find <b>all points</b> where the absolute maximum or minimum of ${latex(`f(x)=${formula}`)} occurs on ${latex(`[${fmt(lo)},${fmt(hi)}]`)}. Enter coordinates for all tied extrema. Round decimal coordinates to three places.`,rows,solution:`Use the closed-interval method. ${latex(`f'(x)=${derivative}`)}. Check the endpoints and all critical numbers in the interval. Candidate values: ${candidates.map(p=>`(${fmt(p.x)}, ${fmt(p.y)})`).join('; ')}. The absolute minimum value is ${fmt(min)} and the absolute maximum value is ${fmt(max)}. Report every point attaining either value.`};
}
const interval=(a,b)=>`(${a},${b})`, inf='∞';
function analysis(){
 const family=pick(['quartic','quartic','quintic','rational','exponential','logarithmic','trigonometric']);
 const shift=r(-2,2), k=pick([1,2]);let f,formula,deriv,second,domain,crit=[],infl=[],breaks=[],positive,concpos;
 if(family==='quartic'){let a=pick([1,2]);f=x=>k*(x*x-a*a)**2+shift;formula=`${k===1?'':k}(x^2-${a*a})^2${shift<0?shift:'+'+shift}`;deriv=`4${k===1?'':k}x(x^2-${a*a})`;second=`4${k===1?'':k}(3x^2-${a*a})`;crit=[-a,0,a];infl=[-a/Math.sqrt(3),a/Math.sqrt(3)];domain=[-Infinity,Infinity];}
 else if(family==='quintic'){f=x=>k*(x**5/5-5*x**3/3+4*x)+shift;formula=`${k}\\left(\\frac{x^5}{5}-\\frac{5x^3}{3}+4x\\right)${shift<0?shift:'+'+shift}`;deriv=`${k}(x^2-1)(x^2-4)`;second=`${k}(4x^3-10x)`;crit=[-2,-1,1,2];infl=[-Math.sqrt(2.5),0,Math.sqrt(2.5)];domain=[-Infinity,Infinity];}
 else if(family==='rational'){f=x=>k*x/(1+x*x)+shift;formula=`\\frac{${k}x}{1+x^2}${shift<0?shift:'+'+shift}`;deriv=`\\frac{${k}(1-x^2)}{(1+x^2)^2}`;second=`\\frac{2${k===1?'':k}x(x^2-3)}{(1+x^2)^3}`;crit=[-1,1];infl=[-Math.sqrt(3),0,Math.sqrt(3)];domain=[-Infinity,Infinity];}
 else if(family==='exponential'){f=x=>k*x*x*Math.exp(-x)+shift;formula=`${k}x^2e^{-x}${shift<0?shift:'+'+shift}`;deriv=`${k}e^{-x}x(2-x)`;second=`${k}e^{-x}(x^2-4x+2)`;crit=[0,2];infl=[2-Math.sqrt(2),2+Math.sqrt(2)];domain=[-Infinity,Infinity];}
 else if(family==='logarithmic'){f=x=>k*x*x*Math.log(x)+shift;formula=`${k}x^2\\ln x${shift<0?shift:'+'+shift}`;deriv=`${k}x(2\\ln x+1)`;second=`${k}(2\\ln x+3)`;crit=[Math.exp(-.5)];infl=[Math.exp(-1.5)];domain=[0,Infinity];}
 else {f=x=>x+2*Math.sin(x)+shift;formula=`x+2\\sin x${shift<0?shift:'+'+shift}`;deriv=`1+2\\cos x`;second=`-2\\sin x`;crit=[-2*Math.PI/3,2*Math.PI/3];infl=[0];domain=[-Math.PI,Math.PI];}
 const ends=[domain[0],...crit,domain[1]], concEnds=[domain[0],...infl,domain[1]];
 const signInterval=(ends,fun,sign)=>ends.slice(0,-1).filter((v,i)=>{const b=ends[i+1],sample=!Number.isFinite(v)?b-1:!Number.isFinite(b)?v+1:(v+b)/2;return sign?fun(sample)>1e-8:fun(sample)<-1e-8}).map(v=>{const i=ends.indexOf(v);return interval(Number.isFinite(v)?fmt(v):'-∞',Number.isFinite(ends[i+1])?fmt(ends[i+1]):'∞');}).join(' ∪ ')||'none';
 const d1=x=>family==='quartic'?4*k*x*(x*x-(crit[2]**2)):family==='quintic'?k*(x*x-1)*(x*x-4):family==='rational'?k*(1-x*x)/(1+x*x)**2:family==='exponential'?k*Math.exp(-x)*x*(2-x):family==='logarithmic'?k*x*(2*Math.log(x)+1):1+2*Math.cos(x);
 const d2=x=>family==='quartic'?4*k*(3*x*x-crit[2]**2):family==='quintic'?k*(4*x**3-10*x):family==='rational'?2*k*x*(x*x-3)/(1+x*x)**3:family==='exponential'?k*Math.exp(-x)*(x*x-4*x+2):family==='logarithmic'?k*(2*Math.log(x)+3):-2*Math.sin(x);
 const increasing=signInterval(ends,d1,true),decreasing=signInterval(ends,d1,false),up=signInterval(concEnds,d2,true),down=signInterval(concEnds,d2,false);
 const local=crit.map(x=>({x,y:f(x),type:d1(x-.0001)>0&&d1(x+.0001)<0?'Local maximum':'Local minimum'}));
 const rows=[{label:'Increasing intervals',answer:increasing},{label:'Decreasing intervals',answer:decreasing},{label:'Concave upward intervals',answer:up},{label:'Concave downward intervals',answer:down},{label:'Inflection point x-coordinate(s)',answer:infl.map(fmt).join(', ')}];
 return {kind:'analysis',topic:'analysis',prompt:`Analyze ${latex(`f(x)=${formula}`)}. Find increasing/decreasing intervals, concavity, inflection x-values, and classify all critical points. Use interval notation and round noninteger endpoints to three decimals.`,rows,crit:local,solution:`The domain is ${domain[0]===0?'x>0':Number.isFinite(domain[0])?`[${fmt(domain[0])},${fmt(domain[1])}]`:'all real numbers'}. ${latex(`f'(x)=${deriv}`)} and ${latex(`f''(x)=${second}`)}. Increasing: ${increasing}; decreasing: ${decreasing}; concave up: ${up}; concave down: ${down}. Inflection x-values: ${infl.map(fmt).join(', ')}. Critical points: ${local.map(p=>`(${fmt(p.x)}, ${fmt(p.y)}) ${p.type.toLowerCase()}`).join('; ')}.`};
}
F.absolute=extrema;F.analysis=analysis;
})();
