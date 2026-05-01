export function mkSpeedMath(){
  const p=[];
  for(let i=0;i<30;i++){
    const a=5+Math.floor(Math.random()*20),b=2+Math.floor(Math.random()*15);
    const op=Math.random()>.5?"+":"-";
    const ans=op==="+"?a+b:a-b;
    const wrongs=[ans+(Math.random()>.5?1:-1)*(1+Math.floor(Math.random()*3)),ans+(Math.random()>.5?2:-2)*(1+Math.floor(Math.random()*2)),ans+(Math.random()>.5?3:-3)];
    const opts=[ans,...wrongs].sort(()=>Math.random()-.5);
    p.push({q:`${a} ${op} ${b}`,o:opts.map(String),c:opts.indexOf(ans)});
  }
  return p;
}
