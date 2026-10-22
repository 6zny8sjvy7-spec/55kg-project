'use strict';
const RIG = {"front":{"body":[[180,145],[285,145],[326,175],[304,245],[300,322],[320,351],[167,351],[171,319],[171,247],[131,177]],"legY":354,"arms":[{"s":[149,207],"e":[145,260],"w":[165,330],"endE":[124,279],"endW":[169,302],"r":[25,21]},{"s":[321,207],"e":[332,260],"w":[328,330],"endE":[355,279],"endW":[307,302],"r":[25,21]}],"anchors":[[171,450],[296,450]]},"threequarter":{"body":[[154,145],[209,145],[244,180],[248,237],[247,325],[280,352],[110,352],[109,318],[117,268],[94,180]],"legY":355,"arms":[{"s":[248,219],"e":[285,279],"w":[350,330],"endE":[265,284],"endW":[300,307],"r":[22,19]},{"s":[115,210],"e":[158,278],"w":[217,332],"endE":[100,286],"endW":[189,307],"r":[29,22]}],"anchors":[[359,437],[451,432]]},"side":{"body":[[69,149],[113,149],[130,205],[137,275],[133,354],[48,354],[44,293],[26,221],[34,179]],"legY":348,"arms":[{"s":[105,218],"e":[187,275],"w":[292,324],"endE":[81,296],"endW":[184,310],"r":[19,15]},{"s":[79,218],"e":[171,279],"w":[275,333],"endE":[44,311],"endW":[158,318],"r":[28,22]}],"anchors":[[491,413],[484,427]]},"back":{"body":[[207,140],[282,140],[326,181],[319,251],[305,302],[305,371],[323,395],[170,396],[182,370],[180,303],[166,254],[158,181]],"legY":373,"arms":[{"s":[158,221],"e":[154,276],"w":[172,313],"endE":[131,286],"endW":[183,324],"r":[25,17]},{"s":[328,221],"e":[332,276],"w":[315,313],"endE":[355,286],"endW":[304,324],"r":[25,17]}],"anchors":[[164,395],[333,395]]}};
(() => {
 const $=id=>document.getElementById(id),canvas=$('coach'),ctx=canvas.getContext('2d');
 const state={view:'side',elapsed:0,playing:false,speed:1,muscles:true,paths:true,atlas:null,loading:false,step:-1};
 const labels={front:'正面',threequarter:'45°',side:'側面',back:'背面'};
 const steps=[['起始準備','膝蓋微彎，繩子穩定繞過鞋底中段。坐高、胸口打開，肩膀遠離耳朵。','先確認繩子不會從鞋底滑脫，再開始拉。'],['手肘往後拉','朝腰側拉，讓手肘靠近肋骨、肩胛自然靠近。頭與軀幹維持穩定。','看藍色手路徑與紫色手肘路徑，避免向外甩。'],['頂峰短暫停留','雙手來到下肋附近，手腕中立、胸口打開。不要聳肩或過度後仰。','背面箭頭表示肩胛靠近，不是用力夾到疼痛。'],['控制放回','慢慢伸長手臂，肩胛受控回位。不要讓繩子彈回，也不要突然往前衝。','回程比拉動稍慢，繩子仍保持適當張力。']];
 const starts=[0,1,3,4],cache=new Map(),pending=new Map(),metrics={draws:0,longestDrawMs:0,intervals:[],assetRequests:0};
 let raf=0,last=null,requestId=0;
 function smooth(t){return t*t*(3-2*t)}
 function phase(s){if(s<1||s>=7)return 0;if(s<3)return smooth((s-1)/2);if(s<4)return 1;return 1-smooth((s-4)/3)}
 function step(s){return s<1||s>=7?0:s<3?1:s<4?2:3}
 function lerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
 function pose(arm,t){return {s:arm.s,e:lerp(arm.e,arm.endE,t),w:lerp(arm.w,arm.endW,t)}}
 function schedule(){if(!raf)raf=requestAnimationFrame(tick)}
 function status(t){$('status').textContent=t}
 function setPlaying(value){state.playing=value;last=null;$('play').textContent=value?'暫停':'播放';$('play').setAttribute('aria-label',value?'暫停':'播放');schedule()}
 function tick(ts){raf=0;if(state.playing&&last!==null){const delta=ts-last;if(delta>250){setPlaying(false);status('播放曾中斷，已暫停。確認後再按播放。')}else{state.elapsed=(state.elapsed+delta/1000*state.speed)%8;if(metrics.intervals.length<3000)metrics.intervals.push(delta)}}last=state.playing?ts:null;draw();update();if(state.playing)schedule()}
 function update(){const i=step(state.elapsed);$('elapsed').textContent=state.elapsed.toFixed(1)+' 秒';$('progress').value=state.elapsed.toFixed(2);$('progress').setAttribute('aria-valuetext',state.elapsed.toFixed(1)+'秒，'+steps[i][0]);document.body.dataset.view=state.view;document.body.dataset.playing=String(state.playing);document.body.dataset.phase=phase(state.elapsed).toFixed(4);if(state.step!==i){state.step=i;$('stage-step').textContent='0'+(i+1)+' · '+steps[i][0];$('step-count').textContent='STEP 0'+(i+1)+' / 04';$('step-title').textContent=steps[i][0];$('step-copy').textContent=steps[i][1];$('step-tip').textContent=steps[i][2];document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.step===i)))}}
 function shape(d,fill,alpha=1,stroke=null,dashed=false){ctx.save();ctx.globalAlpha=alpha;const path=new Path2D(d);if(fill){ctx.fillStyle=fill;ctx.fill(path)}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;if(dashed)ctx.setLineDash([4,3]);ctx.stroke(path)}ctx.restore()}
 function line(a,b,color,width,dashed=false,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.setLineDash(dashed?[5,5]:[]);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();ctx.restore()}
 function arrow(a,b,color,width=2.5){line(a,b,color,width);const theta=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...b);ctx.lineTo(b[0]-10*Math.cos(theta-.5),b[1]-10*Math.sin(theta-.5));ctx.lineTo(b[0]-10*Math.cos(theta+.5),b[1]-10*Math.sin(theta+.5));ctx.closePath();ctx.fill();ctx.restore()}
 function ellipse(x,y,rx,ry,color,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore()}
 function bodyMuscles(t){const red='#951f31',stable='#9baeb8',a=.20+.19*t;
  if(state.view==='back'){
   shape('M181 259 Q165 292 182 333 L209 363 L224 290 Z',red,a);shape('M310 259 Q327 292 310 333 L281 363 L267 290 Z',red,a);
   shape('M206 230 L244 245 L247 268 L210 255 Z',red,a);shape('M285 230 L251 245 L249 268 L282 255 Z',red,a);
   shape('M219 267 L249 279 L278 267 L250 345 Z',red,a);
   shape('M216 241 L238 255 L216 289 L199 266 Z',red,.10,'#951f31',true);shape('M284 241 L261 255 L284 289 L302 266 Z',red,.10,'#951f31',true);
   line([239,293],[239,361],stable,9,false,.40);line([258,293],[258,361],stable,9,false,.40);
   ellipse(160,218,15,22,'#e38a32',.36);ellipse(327,218,15,22,'#e38a32',.36);
  } else if(state.view==='front'){
   shape('M185 271 Q199 257 230 266 L276 266 L283 321 L184 321 Z',stable,.22);
   // Posterior prime movers are deliberately not painted over the pectorals.
  } else if(state.view==='side'){
   shape('M48 249 L71 270 L74 320 L51 329 Z',red,a);shape('M113 270 L131 280 L131 325 L112 324 Z',stable,.24);
  } else {
   shape('M116 253 L137 274 L144 316 L118 324 Z',red,a);shape('M178 268 L230 268 L242 324 L171 324 Z',stable,.22);
  }
 }
 function limb(atlas,index,aa,bb,ta,tb){const vx=bb[0]-aa[0],vy=bb[1]-aa[1],tx=tb[0]-ta[0],ty=tb[1]-ta[1],l=Math.hypot(vx,vy),k=Math.hypot(tx,ty),ux=vx/l,uy=vy/l,qx=tx/k,qy=ty/k,r=k/l;const a=qx*ux*r+qy*uy,b=qy*ux*r-qx*uy,c=qx*uy*r-qy*ux,d=qy*uy*r+qx*ux;ctx.save();ctx.transform(a,b,c,d,ta[0]-a*aa[0]-c*aa[1],ta[1]-b*aa[0]-d*aa[1]);ctx.drawImage(atlas,(index%3)*512,Math.floor(index/3)*512,512,512,0,0,512,512);ctx.restore()}
 function draw(){if(!ctx)return;const begin=performance.now(),scale=canvas.width/512;ctx.setTransform(scale,0,0,scale,0,0);ctx.fillStyle='white';ctx.fillRect(0,0,512,512);if(!state.atlas)return;
  const data=RIG[state.view],t=phase(state.elapsed);if(state.view==='back'){data.arms.forEach((arm,i)=>{const q=pose(arm,t);line(q.w,data.anchors[i],'#272a2b',4.5);limb(state.atlas,i*2+2,arm.e,arm.w,q.e,q.w);if(state.muscles)if(state.view!=='back')line(lerp(q.e,q.w,.26),lerp(q.e,q.w,.66),'#e38a32',11,false,.30)})}ctx.drawImage(state.atlas,0,0,512,512,0,0,512,512);if(state.muscles)bodyMuscles(t);
  data.arms.forEach((arm,i)=>{if(state.view==='side'&&i===0)return;const q=pose(arm,t),anchor=data.anchors[i];if(state.view!=='back')line(q.w,anchor,'#272a2b',4.5);limb(state.atlas,i*2+1,arm.s,arm.e,q.s,q.e);if(state.view!=='back')limb(state.atlas,i*2+2,arm.e,arm.w,q.e,q.w);
   if(state.muscles){if(state.view!=='back')line(lerp(q.s,q.e,.32),lerp(q.s,q.e,.74),'#e38a32',15,false,.35);if(state.view!=='back')line(lerp(q.e,q.w,.26),lerp(q.e,q.w,.66),'#e38a32',11,false,.30)}
  });
  if(state.paths){data.arms.forEach((arm,i)=>{if(state.view==='side'&&i===0)return;const q=pose(arm,t);if(state.view!=='back')line(arm.w,arm.endW,'#087579',2,true,.65);line(arm.e,arm.endE,'#7461a2',2,true,.65);const returning=step(state.elapsed)===3;if(state.view!=='back')arrow(returning?arm.endW:arm.w,returning?arm.w:arm.endW,'#087579');arrow(returning?arm.endE:arm.e,returning?arm.e:arm.endE,'#7461a2',2);if(state.view!=='back')ellipse(q.w[0],q.w[1],3,3,'#087579',.95);});
   if(state.view==='back'){const ret=step(state.elapsed)===3;arrow(ret?[229,252]:[198,252],ret?[198,252]:[229,252],'#087579',3);arrow(ret?[270,252]:[303,252],ret?[303,252]:[270,252],'#087579',3)}
  }
  metrics.draws++;metrics.longestDrawMs=Math.max(metrics.longestDrawMs,performance.now()-begin);
 }
 function load(view){if(cache.has(view)){const img=cache.get(view);cache.delete(view);cache.set(view,img);return Promise.resolve(img)}if(pending.has(view))return pending.get(view);metrics.assetRequests++;const promise=new Promise((resolve,reject)=>{const image=new Image();const timer=setTimeout(()=>{image.src='';reject(new Error('讀取逾時'))},8000);image.onload=()=>{clearTimeout(timer);cache.set(view,image);while(cache.size>2)cache.delete(cache.keys().next().value);resolve(image)};image.onerror=()=>{clearTimeout(timer);reject(new Error('人物素材讀取失敗'))};image.src='assets/'+view+'-rig.webp?v=row-m1-20261022'}).finally(()=>pending.delete(view));pending.set(view,promise);return promise}
 async function selectView(view){const token=++requestId,wasPlaying=state.playing;setPlaying(false);state.view=view;state.atlas=null;state.loading=true;state.step=-1;$('loading').hidden=false;$('retry').hidden=true;$('load-message').textContent='正在載入'+labels[view]+'教練…';document.querySelectorAll('button[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===view)));$('view-label').textContent=labels[view]+(view==='side'?' · 路徑最清楚':'');$('muscle-view-note').textContent=view==='front'?'正面以手臂與核心提示為主；主要背肌請切換背面查看。':view==='back'?'背面看背肌與肩胛；手與前臂在軀幹前側會被遮住。虛線為深層菱形肌區域。':'藍色為手的方向、紫色為手肘路徑。主要背肌請搭配背面查看。';$('play').disabled=true;status('正在載入'+labels[view]+'；進度保持不變。');schedule();
  try{const img=await load(view);if(token!==requestId)return;state.atlas=img;state.loading=false;$('loading').hidden=true;$('play').disabled=false;status(labels[view]+'已載入。選擇播放或點分解步驟。');if(wasPlaying)setPlaying(true);schedule()}catch(e){if(token!==requestId)return;state.loading=false;$('load-message').textContent=e.message+'。請檢查網路後重試。';$('retry').hidden=false;status('讀取失敗，沒有顯示其他角度冒充目前角度。');schedule()}}
 $('play').onclick=()=>{if(state.atlas){setPlaying(!state.playing);status(state.playing?'播放中 · 胸口打開，控制回程。':'已暫停，可調整進度查看姿勢。')}};
 $('replay').onclick=()=>{state.elapsed=0;state.step=-1;setPlaying(!!state.atlas);status('從起始姿勢重播。')};
 function goStep(i){setPlaying(false);state.elapsed=starts[(i+4)%4];state.step=-1;update();status('分解步驟：'+steps[(i+4)%4][0]);schedule()}
 $('prev').onclick=()=>goStep(step(state.elapsed)-1);$('next').onclick=()=>goStep(step(state.elapsed)+1);document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>goStep(+b.dataset.step));
 $('progress').addEventListener('input',e=>{setPlaying(false);state.elapsed=Math.max(0,Math.min(8,Number(e.target.value)));state.step=-1;status('已暫停，正在查看選定姿勢。');schedule()});
 $('speed').onclick=()=>{const speeds=[1,.5,.75];state.speed=speeds[(speeds.indexOf(state.speed)+1)%3];$('speed').textContent=state.speed+'×';$('speed').setAttribute('aria-label','播放速度，目前'+state.speed+'倍');status('速度設為'+state.speed+'倍；動作進度不變。')};
 $('muscle-toggle').onclick=()=>{state.muscles=!state.muscles;$('muscle-toggle').setAttribute('aria-pressed',String(state.muscles));schedule()};$('path-toggle').onclick=()=>{state.paths=!state.paths;$('path-toggle').setAttribute('aria-pressed',String(state.paths));schedule()};
 document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>selectView(b.dataset.view));$('retry').onclick=()=>selectView(state.view);
 window.addEventListener('message',e=>{if(e.source===parent&&e.data==='55kg-row-host-pause'){setPlaying(false);status('切到背景已暫停；回來後請再按播放。')}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){setPlaying(false);status('切到背景已暫停；回來後請再按播放。')}});
 function resize(){const size=Math.min(1024,Math.round(canvas.clientWidth*Math.min(devicePixelRatio||1,2)));canvas.width=canvas.height=Math.max(256,size);schedule()}
 window.addEventListener('resize',resize);Object.defineProperty(window,'coachDiagnostics',{value:{snapshot:()=>({view:state.view,elapsed:state.elapsed,playing:state.playing,speed:state.speed,phase:phase(state.elapsed),cachedViews:[...cache.keys()],canvasPixels:canvas.width*canvas.height,...metrics,intervals:[...metrics.intervals]})}});
 resize();selectView('side');
})();
