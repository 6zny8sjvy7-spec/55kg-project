/* Original kinematic prototype. Joint ranges are design parameters, not clinical prescriptions. */
export const EXERCISES={
 curl:{name:'啞鈴二頭肌彎舉',equipment:'啞鈴',primary:['肱二頭肌'],secondary:['肱肌、前臂與軀幹穩定肌'],cycle:5,cues:['上臂留在身體兩側，手腕與前臂保持一直線。','緩慢屈肘抬起，再控制放下；不甩動身體。'],errors:'避免聳肩、甩動手肘、折手腕或鎖死肘關節。',alternative:'減輕負重；必要時坐姿、無負重先練習。',dose:'先以能控制的負荷練習；次數、休息仍須個別調整。',sources:[{name:'Mayo Clinic：啞鈴彎舉',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/biceps-curl/vid-20084675'}]},
 row:{name:'坐姿彈力繩划船',equipment:'彈力繩＋運動鞋',primary:['中背部肩胛內收肌群、背闊肌'],secondary:['肱二頭肌、後三角肌與軀幹穩定肌'],cycle:6,cues:['坐穩、膝微彎；彈力繩穩固繞過鞋底並檢查有無破損。','軀幹保持中立，手肘向後帶，控制回程。'],errors:'不拱背或前後甩動；彈力繩不可滑向臉部。',alternative:'降低阻力／縮小拉幅；固定點不可靠時不要使用。',dose:'示範只表現動作路徑，不代表每人的可用阻力或活動範圍。',sources:[{name:'Mayo Clinic：彈力繩坐姿划船',url:'https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/seated-row/vid-20084669'}]},
 bridge:{name:'徒手臀橋',equipment:'運動墊',primary:['臀大肌'],secondary:['腿後肌、腹部穩定肌'],cycle:6,cues:['仰躺、屈膝、雙腳與髖同寬，腳掌穩定貼地。','腹部輕收，抬髖到肩、髖、膝接近一直線，控制放下。'],errors:'不以腰部過度拱起換取高度，不把重量壓在頸部。',alternative:'減少抬高幅度；若有疼痛，停止並尋求個別評估。',dose:'動畫幅度為原型參數，並非適合所有人的指定幅度。',sources:[{name:'ACE：Glute Bridge',url:'https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/'}]}
};
const mix=(a,b,t)=>a+(b-a)*t;
export function poseAt(name,phase){const q=(1-Math.cos(phase*Math.PI*2))/2;
 if(name==='curl')return {hip:[0,.91,0],shoulder:[0,1.43,0],head:[0,1.63,0],headTilt:0,curl:12+113*q,arms:[[-.225,1.40,0],[.225,1.40,0]],knees:[[-.12,.48,0],[.12,.48,0]],feet:[[-.12,.075,.045],[.12,.075,.045]],q};
 if(name==='row')return {hip:[0,.18,-.43],shoulder:[0,.70,-.43],head:[0,.90,-.43],headTilt:0,arms:[[-.225,.67,-.43],[.225,.67,-.43]],wrists:[[-.225,.44,mix(.055,-.22,q)],[.225,.44,mix(.055,-.22,q)]],knees:[[-.12,.25,-.055],[.12,.25,-.055]],feet:[[-.12,.075,.335],[.12,.075,.335]],q};
 const sy=.16,sz=-.54,hy=.18+.12*q,hz=sz+Math.sqrt(.52*.52-(hy-sy)**2);
 const dy=.075-hy,dz=.62-hz,d=Math.hypot(dy,dz),a=(.42**2-.43**2+d*d)/(2*d),h=Math.sqrt(.42**2-a*a),ky=hy+a*dy/d+h*dz/d,kz=hz+a*dz/d-h*dy/d;
 return {hip:[0,hy,hz],shoulder:[0,sy,sz],head:[0,.15,-.79],headTilt:-Math.PI/2,arms:[[-.225,sy,sz],[.225,sy,sz]],elbows:[[-.285,.09,-.25],[.285,.09,-.25]],wrists:[[-.32,.085,.015],[.32,.085,.015]],knees:[[-.12,ky,kz],[.12,ky,kz]],feet:[[-.12,.075,.62],[.12,.075,.62]],q};
}
