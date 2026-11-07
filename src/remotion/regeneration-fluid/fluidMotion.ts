// Independent 2D puppet. No canonical-rig solver, earthActing or A/B pose tracks.
export type Point={x:number;y:number};
type Key=readonly[number,number];
export const limit=(x:number)=>Math.max(0,Math.min(1,x));
export const ease=(x:number)=>{const p=limit(x);return p*p*(3-2*p);};
/** Shape-preserving cubic interpolation with shared velocities at adjacent keys. */
export function flow(t:number,keys:readonly Key[]){
 let i=keys.findIndex(k=>k[0]>t)-1;
 if(t<=keys[0][0])return keys[0][1];if(i<0)return keys.at(-1)![1];
 const slope=(j:number)=>(keys[j+1][1]-keys[j][1])/(keys[j+1][0]-keys[j][0]);
 const tangent=(j:number)=>{
  if(j===0||j===keys.length-1)return 0;
  const a=slope(j-1),b=slope(j);return a*b<=0?0:2*a*b/(a+b);
 };
 const [a,x]=keys[i],[b,y]=keys[i+1],d=b-a,p=(t-a)/d;
 return (2*p*p*p-3*p*p+1)*x+(p*p*p-2*p*p+p)*d*tangent(i)+(-2*p*p*p+3*p*p)*y+(p*p*p-p*p)*d*tangent(i+1);
}
export function joint(a:Point,b:Point,l1:number,l2:number,bend:number){
 const dx=b.x-a.x,dy=b.y-a.y,d0=Math.max(.01,Math.hypot(dx,dy)),d=Math.max(Math.abs(l1-l2)+.01,Math.min(l1+l2-.01,d0));
 const end={x:a.x+dx/d0*d,y:a.y+dy/d0*d},u=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-u*u));
 return {elbow:{x:a.x+dx/d0*u-dy/d0*h*bend,y:a.y+dy/d0*u+dx/d0*h*bend},end};
}
/** Keep arms away from folded/straight singularities; choreography still owns hand paths. */
export function armChain(shoulder:Point,target:Point,bend:number){
 const dx=target.x-shoulder.x,dy=target.y-shoulder.y,d=Math.hypot(dx,dy);
 const reach=Math.max(90,Math.min(217,d));
 const direction=d>.001?{x:dx/d,y:dy/d}:{x:0,y:1};
 return joint(shoulder,{x:shoulder.x+direction.x*reach,y:shoulder.y+direction.y*reach},112,110,bend);
}
const step=(t:number,a:number,b:number,x0:number,x1:number,y:number)=>{
 const p=limit((t-a)/(b-a)),s=p-Math.sin(2*Math.PI*p)/(2*Math.PI);
 return {x:x0+(x1-x0)*s,y:y-34*Math.pow(Math.sin(Math.PI*p),2)};
};
export function fluidPose(t:number){
 const returning=t>=6.9;
 const x=returning?flow(t,[[6.9,535],[9.7,535],[10.4,548],[11.5,620],[12,636]]):flow(t,[[0,330],[.8,367],[1.65,415],[2.5,460],[3.05,493],[3.5,550],[4.23,600],[4.4,605],[4.65,600],[6.9,600]]);
 const drop=returning?0:flow(t,[[0,0],[2.7,0],[3.1,-12],[3.4,12],[3.8,60],[4.23,120],[4.36,112],[4.58,120],[6.9,120]]);
 const lean=returning?flow(t,[[6.9,-8],[7.7,-4],[8.4,4],[9.1,0],[9.7,-4],[10.2,0],[12,0]]):flow(t,[[0,0],[2.7,4],[3.1,-10],[3.6,35],[4.23,70],[4.4,60],[4.65,66],[6.9,66]]);
 const bob=t<2.8?-4*Math.sin(t*7)**2:returning&&t>10?-4*Math.sin((t-10)*6)**2:0;
 const hip={x,y:1120+drop+bob},chest={x:x+lean,y:950+drop*1.34+bob};
 const neck={x:chest.x+flow(t,[[0,0],[3.1,-3],[3.8,10],[4.3,18],[4.6,8],[6.9,0],[8,5],[9,-3],[12,0]]),y:chest.y-8};
 const head={x:neck.x+flow(t,[[0,0],[3,-2],[3.7,8],[4.23,16],[4.45,-4],[4.7,4],[6.9,0],[7.5,-6],[8.2,2],[9.1,0],[12,0]]),y:neck.y-115};
 let left:Point,right:Point;
 if(t<.9)left=step(t,.12,.84,282,342,1308);else if(t<2.55)left=step(t,1.7,2.45,342,412,1308);else left={x:flow(t,[[2.55,412],[3.2,430],[4.23,470],[6.9,470]]),y:1308};
 if(t<1.7)right=step(t,.9,1.65,378,442,1320);else if(t<3.2)right=step(t,2.5,3.18,442,518,1320);else right={x:flow(t,[[3.2,518],[4.23,558],[6.9,558]]),y:1320};
 if(returning){left={x:x-47,y:1308};right={x:x+45,y:1320};if(t>10){left=step(t,10.1,10.8,488,563,1308);right=step(t,10.8,11.5,580,672,1320);}}
 const hips={left:{x:hip.x-30,y:hip.y},right:{x:hip.x+30,y:hip.y}};
 const legs={} as Record<'left'|'right',{elbow:Point;end:Point}>;
 for(const side of ['left','right'] as const){
  const target=side==='left'?left:right,a=hips[side];let leg=joint(a,target,102,102,side==='left'?1:-1);
  if(leg.elbow.y>1300)leg=joint(a,target,102,102,side==='left'?-1:1);
  legs[side]=leg;
 }
 const shoulders={left:{x:chest.x-51,y:chest.y+10},right:{x:chest.x+51,y:chest.y+10}};
 let lh:Point={x:chest.x-73,y:chest.y+198},rh:Point={x:chest.x+78,y:chest.y+198};
 if(t<3.05){const walking=1-ease((t-2.7)/.35);lh.x+=Math.sin(t*7)*22*walking;rh.x-=Math.sin(t*7)*22*walking;lh.y-=Math.sin(t*7)*10*walking;rh.y+=Math.sin(t*7)*10*walking;}
 else if(!returning){
  const p=ease((t-3.05)/1.18);lh={x:lh.x+(730-lh.x)*p,y:lh.y+(1293-lh.y)*p};rh={x:rh.x+(790-rh.x)*p,y:rh.y+(1293-rh.y)*p};
 }
 if(returning){
  // Lower the inspected arm outside the shoulder, not through the shoulder joint.
  lh={x:flow(t,[[6.9,410],[7.5,406],[8,417],[8.5,414],[8.8,410],[9.1,388],[9.4,385],[9.8,425],[10.2,480],[12,560]]),y:flow(t,[[6.9,886],[7.5,880],[8.1,895],[8.5,887],[8.8,916],[9.1,970],[9.4,1040],[9.8,1100],[10.2,1125],[12,1130]])};
  // The right hand travels under the shoulder on its outward gesture.
  rh={x:flow(t,[[6.9,420],[7.5,417],[8,426],[8.3,422],[8.6,440],[9,505],[9.4,665],[9.7,725],[10,720],[10.4,665],[11,690],[12,710]]),y:flow(t,[[6.9,930],[7.5,914],[8,926],[8.3,918],[8.6,965],[9,1085],[9.4,1100],[9.7,1030],[10,1000],[10.4,1110],[12,1120]])};
 }
 const arms={left:armChain(shoulders.left,lh,returning?-1:1),right:armChain(shoulders.right,rh,-1)};
 return {hip,chest,neck,head,hips,shoulders,legs,arms,drop,lean,headAngle:flow(t,[[0,-2],[2.5,1],[3.2,-9],[4.1,12],[4.38,-4],[4.7,5],[6.9,-7],[7.6,-10],[8.1,-4],[8.7,2],[9.3,-3],[10,0],[12,1]]),worry:flow(t,[[0,0],[3.05,0],[3.6,1],[6.9,.4],[8.2,.1],[9,0],[12,0]]),lookX:returning?-5:flow(t,[[0,3],[3,4],[4.2,8],[6.9,-5]]),lookY:returning?4:flow(t,[[0,0],[3,0],[4.2,6],[6.9,4]])};
}
