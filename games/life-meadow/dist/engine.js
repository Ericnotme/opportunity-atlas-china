import {STATS,AREAS,CARDS,RELICS,EVENTS,COMBOS,TRAITS,MISSIONS,CITIES} from './data.js';
export const VERSION=1;
export const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
export function hash(str){let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function random(seed,key){let x=hash(seed+'|'+key);x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;return (x>>>0)/4294967296;}
export function pick(items,seed,key,count){return [...items].sort((a,b)=>random(seed,key+a.id)-random(seed,key+b.id)).slice(0,count);}
export function newGame({seed='MEADOW',name='小满',city='成都',mode='standard'}={}){
 seed=String(seed).trim().slice(0,40)||'MEADOW';name=String(name).trim().slice(0,12)||'小满';
 return {version:VERSION,seed,name,city:CITIES.includes(city)?city:'成都',mode:mode==='gentle'?'gentle':'standard',age:0,phase:'plan',area:'garden',cash:mode==='gentle'?26:18,load:12,stats:{learning:22,health:42,bond:40,agency:22,joy:42},trait:TRAITS[Math.floor(random(seed,'trait')*TRAITS.length)].id,mission:MISSIONS[Math.floor(random(seed,'mission')*MISSIONS.length)].id,relics:[],draft:[],eventId:null,history:[],combos:[],seen:[],milestones:[],rerolls:0,moved:false,plan:[],last:null};
}
export function available(s){return pick(CARDS.filter(c=>c.min<=s.age&&c.max>=s.age),s.seed,'hand'+s.age+'r'+s.rerolls,5);}
export function timeBudget(s){return 6-AREAS.find(a=>a.id===s.area).commute+(s.relics.includes('time')?1:0);}
export function income(s){return (s.mode==='gentle'?15:12)+(s.relics.includes('fund')?2:0);}
export function budget(s,ids=s.plan){const cards=ids.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean),rent=AREAS.find(a=>a.id===s.area).rent;return {time:cards.reduce((x,c)=>x+c.time,0),cost:cards.reduce((x,c)=>x+c.cost,0),rent,income:income(s),available:s.cash+income(s)-rent};}
export function forecast(s,ids=s.plan){
 const deltas=Object.fromEntries(Object.keys(STATS).map(k=>[k,0]));let load=-4,notes=[];
 const cards=ids.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean),tags=new Set(cards.map(c=>c.tag)),area=AREAS.find(a=>a.id===s.area);
 const add=e=>{for(const [k,v]of Object.entries(e))deltas[k]+=v;};
 for(const c of cards){add(c.effect);load+=c.load;
 if(s.trait==='curious'&&c.tag==='探索')add({learning:2});
 if(s.trait==='sensitive'&&c.tag==='联结')add({joy:2});
 if(s.trait==='active'&&c.tag==='自然')add({health:2});
 if(s.trait==='social'&&c.tag==='社交')add({bond:2});
 if(s.relics.includes('pages')&&c.tag==='探索')add({learning:2});
 if(s.relics.includes('roots')&&c.tag==='联结')add({joy:2});
 if(s.relics.includes('shoes')&&c.tag==='自然'){add({health:2});load--;}
 if(s.relics.includes('blank')&&c.tag==='恢复')add({agency:2});
 if(s.relics.includes('bridge')&&c.tag==='社交')add({learning:2});
 if(s.relics.includes('spark')&&c.tag==='创造')add({agency:2});
 if(s.relics.includes('trust')&&['choice','project'].includes(c.id))add({agency:3});
 }
 const combos=COMBOS.filter(c=>c.needs.every(t=>tags.has(t)));for(const c of combos){add(c.bonus);notes.push(c.name);}
 if(s.relics.includes('mix')&&tags.size>=3){add({learning:1,health:1,bond:1,agency:1,joy:1});notes.push('万花筒');}
 const multiplier=s.relics.includes('network')?1.5:1;
 for(const [k,v]of Object.entries(area.bonus))deltas[k]+=v*multiplier;
 if(area.id==='library'&&tags.has('探索')){add({learning:2});notes.push('书院共鸣');}
 if(area.id==='garden'&&tags.has('自然')){add({health:2});notes.push('绿地共鸣');}
 if(area.id==='oldtown'&&tags.has('联结')){add({bond:2});notes.push('邻里共鸣');}
 if(area.id==='harbor'&&tags.has('社交')){add({agency:2});notes.push('开放共鸣');}
 if(s.relics.includes('rhythm'))load-=3;
 const time=budget(s,ids).time;
 if(time===timeBudget(s)){load+=s.trait==='sensitive'?4:2;notes.push('日程排满：恢复空间减少');}
 if(time<=3){load-=2;notes.push('留有余地：压力 -2');}
 let nextLoad=clamp(s.load+load);
 if(nextLoad>55){const penalty=Math.ceil((nextLoad-55)/12);add({health:-penalty,joy:-penalty});notes.push('持续高负荷：活力与幸福受影响');}
 // Diminishing returns and mild upkeep make tradeoffs survive multiple years.
 for(const k of Object.keys(deltas)){const v=deltas[k];deltas[k]=Math.round((v>0?v*(1-s.stats[k]/150):v)-1);deltas[k]=clamp(s.stats[k]+deltas[k])-s.stats[k];}
 return {deltas,load:nextLoad-s.load,combos:combos.map(c=>c.id),notes};
}
function change(s,e,load=0){for(const [k,v]of Object.entries(e))s.stats[k]=clamp(s.stats[k]+v);s.load=clamp(s.load+load);}
function clone(s){return structuredClone(s);}
export function selectCards(state,ids){const s=clone(state);if(s.phase!=='plan')throw Error('请先完成本年的事件。');if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.length>3||ids.some(id=>!available(s).some(c=>c.id===id)))throw Error('每年从手牌中选择最多三张不同的牌。');s.plan=ids;return s;}
export function move(state,id){const s=clone(state);if(s.phase!=='plan'||s.moved)throw Error('每年只能搬家一次。');if(!AREAS.some(a=>a.id===id)||id===s.area)throw Error('请选择另一个社区。');if(s.cash<3)throw Error('搬家需要3枚家庭资金。');s.cash-=3;s.area=id;s.moved=true;s.plan=[];return s;}
export function reroll(state){const s=clone(state);if(s.phase!=='plan'||s.rerolls>=1)throw Error('每年只能换牌一次。');if(s.cash<1)throw Error('换牌需要1枚家庭资金。');s.cash--;s.rerolls++;s.plan=[];return s;}
export function resolveYear(state){const s=clone(state);if(s.phase!=='plan')throw Error('请先完成本年的事件。');if(!s.plan.length)throw Error('先选择至少一张成长牌。');selectCards(s,s.plan);const b=budget(s);if(b.time>timeBudget(s))throw Error('安排超出了可用时间。');if(b.cost>b.available)throw Error('本年预算不足。');const f=forecast(s),before=clone(s.stats);change(s,f.deltas,f.load);s.cash+=b.income-b.rent-b.cost;
 s.combos=[...new Set([...s.combos,...f.combos])];
 s.last={age:s.age,area:s.area,cards:[...s.plan],before,after:clone(s.stats),deltas:f.deltas,notes:f.notes,cashChange:b.income-b.rent-b.cost,loadChange:f.load,event:null};
 let pool=EVENTS.filter(e=>e.min<=s.age&&e.max>=s.age&&!s.seen.includes(e.id));if(!pool.length)pool=EVENTS.filter(e=>e.min<=s.age&&e.max>=s.age);
 const event=pick(pool,s.seed,'event'+s.age,1)[0];s.eventId=event.id;s.seen.push(event.id);s.phase='event';return s;
}
export function chooseEvent(state,index){const s=clone(state);if(s.phase!=='event')throw Error('现在没有待处理事件。');const e=EVENTS.find(e=>e.id===s.eventId),c=e?.choices[index];if(!c)throw Error('请选择有效回应。');if(s.cash<c.cost)throw Error('家庭资金不足，可以选择另一种回应。');s.cash-=c.cost;change(s,c.effect,c.load);s.last.event={id:e.id,choice:index};s.last.after=clone(s.stats);s.last.load=s.load;s.history.push(s.last);s.age++;s.plan=[];s.moved=false;s.rerolls=0;s.eventId=null;
 if(s.age===18){s.phase='end';return s;}
 if(s.age%3===0){s.phase='draft';s.draft=pick(RELICS.filter(r=>!s.relics.includes(r.id)),s.seed,'draft'+s.age,3).map(r=>r.id);}
 else s.phase='plan';return s;
}
export function chooseRelic(state,id){const s=clone(state);if(s.phase!=='draft'||!s.draft.includes(id))throw Error('请选择当前提供的成长信物。');s.relics.push(id);s.draft=[];s.phase='plan';s.milestones.push({age:s.age,id});return s;}
export function missionWon(s){const a=s.stats;return s.mission==='balance'?Object.values(a).every(v=>v>=50):s.mission==='explore'?a.learning>=75&&a.joy>=50:s.mission==='connect'?a.bond>=70&&a.agency>=70:a.health>=70&&a.joy>=70&&s.load<=45;}
export function ending(s){const a=s.stats;let name='仍在展开的人生',text='18岁不是结算人生的时刻，只是把更多选择交还给孩子。';if(Object.values(a).every(v=>v>=68)){name='有根，也有翅膀';text='拥有连接，也保有自己的方向。这些日常，成了一片宽阔的起点。';}else if(a.agency>=75&&a.learning>=65){name='把问号变成远方';text='对世界保有好奇，也敢于亲自寻找答案。接下来的道路，还会不断生长。';}else if(a.bond>=78){name='随时可以回来的家';text='无论走向哪里，孩子知道，家里总有一个愿意倾听的人。';}else if(a.health>=75&&a.joy>=70){name='普通日子的光';text='会享受生活、照顾自己，也懂得为小小的快乐停留。';}else if(a.agency>=75){name='自己的指南针';text='不必沿着预设的轨道，也有勇气为自己的选择负责。';}else if(a.learning>=80){name='追问世界的人';text='学习成为一把钥匙。未来还要继续练习，如何平衡期待与生活。';}
 const achieved=['走过十八年'];if(missionWon(s))achieved.push('守住初心');if(s.combos.length>=4)achieved.push('组合探索家');if(s.load<=25)achieved.push('松弛有度');if(s.relics.length===5)achieved.push('回忆收藏家');if(a.bond>=80&&a.agency>=70)achieved.push('爱与边界');return {name,text,achieved,mission:missionWon(s)};}
export function validateSave(v){
 if(!v||v.version!==VERSION||typeof v.seed!=='string'||v.seed.length>40||typeof v.name!=='string'||v.name.length>12||!CITIES.includes(v.city)||!['standard','gentle'].includes(v.mode)||!Number.isInteger(v.age)||v.age<0||v.age>18||!['plan','event','draft','end'].includes(v.phase)||!AREAS.some(a=>a.id===v.area)||!TRAITS.some(a=>a.id===v.trait)||!MISSIONS.some(a=>a.id===v.mission))throw Error('存档格式不兼容。');
 if(!Number.isFinite(v.cash)||v.cash<0||v.cash>10000||!Number.isFinite(v.load)||v.load<0||v.load>100||!v.stats||Object.keys(STATS).some(k=>!Number.isFinite(v.stats[k])||v.stats[k]<0||v.stats[k]>100))throw Error('存档数值无效。');
 for(const k of ['history','combos','seen','milestones','relics','draft','plan'])if(!Array.isArray(v[k])||v[k].length>100)throw Error('存档结构无效。');
 if(v.relics.some(id=>!RELICS.some(r=>r.id===id))||new Set(v.relics).size!==v.relics.length||v.plan.some(id=>!CARDS.some(c=>c.id===id))||v.draft.some(id=>!RELICS.some(c=>c.id===id))||!Number.isInteger(v.rerolls)||v.rerolls<0||v.rerolls>1||typeof v.moved!=='boolean')throw Error('存档卡牌无效。');
 if((v.phase==='end')!==(v.age===18)||v.history.length!==v.age||v.phase==='event'&&(!EVENTS.some(e=>e.id===v.eventId)||!v.last)||v.phase==='draft'&&(v.age%3!==0||v.age===0||v.draft.length!==3))throw Error('存档进度无效。');
 for(const h of v.history){if(!h||!Number.isInteger(h.age)||!AREAS.some(a=>a.id===h.area)||!Array.isArray(h.cards)||h.cards.some(id=>!CARDS.some(c=>c.id===id))||!Array.isArray(h.notes)||h.notes.some(n=>typeof n!=='string'||n.length>100)||!h.event||!EVENTS.some(e=>e.id===h.event.id&&e.choices[h.event.choice])||!h.after||Object.keys(STATS).some(k=>!Number.isFinite(h.after[k])))throw Error('存档年鉴无效。');}
 if(v.phase==='event'&&(!v.last.deltas||Object.keys(STATS).some(k=>!Number.isFinite(v.last.deltas[k]))))throw Error('存档结算记录无效。');
 if(v.phase==='plan')selectCards(v,v.plan);return clone(v);
}
