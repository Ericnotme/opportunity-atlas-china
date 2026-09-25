import {STATS,AREAS,CARDS as BASE_CARDS,RELICS,EVENTS,COMBOS,TRAITS,MISSIONS,CITIES} from './data.js';
import {PATHS,LINKS,CHAPTERS,PROJECTS,SPECIAL_CARDS,STORY_STARTS} from './play-content.js';
export const CARDS=[...BASE_CARDS,...SPECIAL_CARDS];
export const VERSION=2;
export const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
export function hash(str){let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function random(seed,key){let x=hash(seed+'|'+key);x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;return (x>>>0)/4294967296;}
export function pick(items,seed,key,count){return [...items].sort((a,b)=>random(seed,key+a.id)-random(seed,key+b.id)).slice(0,count);}
export function newGame({seed='MEADOW',name='小满',city='成都',mode='standard',path='maker'}={}){
 seed=String(seed).trim().slice(0,40)||'MEADOW';name=String(name).trim().slice(0,12)||'小满';
 return {version:VERSION,path:PATHS.some(p=>p.id===path)?path:'maker',mastery:{},chapterScore:0,chapterResults:[],totalScore:0,project:null,projectResults:[],unlocked:[],carry:null,reserve:null,bestChain:1,seed,name,city:CITIES.includes(city)?city:'成都',mode:mode==='gentle'?'gentle':'standard',age:0,phase:'plan',area:'garden',cash:mode==='gentle'?26:18,load:12,stats:{learning:22,health:42,bond:40,agency:22,joy:42},trait:TRAITS[Math.floor(random(seed,'trait')*TRAITS.length)].id,mission:MISSIONS[Math.floor(random(seed,'mission')*MISSIONS.length)].id,relics:[],draft:[],eventId:null,history:[],combos:[],seen:[],milestones:[],rerolls:0,moved:false,plan:[],last:null};
}
export function chapter(s){return CHAPTERS[Math.min(5,Math.floor(s.age/3))];}
export function chapterTarget(s){return Math.round(chapter(s).target*(s.mode==='gentle'?.8:1));}
export function level(s,id){return Math.min(3,1+Math.floor((s.mastery[id]||0)/3));}
export function available(s){
 const pool=CARDS.filter(c=>c.min<=s.age&&c.max>=s.age&&(BASE_CARDS.includes(c)||s.unlocked.includes(c.id)));
 const order=pick(pool,s.seed,'hand'+s.age+'r'+s.rerolls,pool.length), hand=[];
 const add=c=>{if(c&&!hand.some(x=>x.id===c.id))hand.push(c);};
 add(pool.find(c=>c.id===s.carry));
 const path=PATHS.find(p=>p.id===s.path);
 // Each draw contains a build opportunity and a free exit from a poor budget.
 add(order.find(c=>c.tag===path.from));add(order.find(c=>c.tag===path.to));
 add(order.find(c=>c.cost===0&&c.time<=2));
 for(const c of order){if(hand.length===5)break;add(c);}return hand;
}
export function timeBudget(s){return 6-AREAS.find(a=>a.id===s.area).commute+(s.relics.includes('time')?1:0)-(s.age===8?1:0);}
export function rerollCost(s){return s.age>=9&&s.age<12?0:1;}
export function setPath(state,id){const s=clone(state);if(s.age!==0||s.phase!=='plan'||!PATHS.some(p=>p.id===id))throw Error('开局选择一种家庭节奏。');s.path=id;s.plan=[];s.reserve=null;return s;}
export function reserveCard(state,id){const s=clone(state);if(s.phase!=='plan'||s.age===17)throw Error('这一年无法为明年留牌。');if(id!==null&&!available(s).some(c=>c.id===id&&c.max>s.age))throw Error('这张牌无法留到明年。');s.reserve=id;return s;}
export function chainScore(s,ids=s.plan){
 const cards=ids.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean),index=Math.min(5,Math.floor(s.age/3)),focus=chapter(s).focus,path=PATHS.find(p=>p.id===s.path),links=[];
 let base=cards.reduce((n,c)=>n+4+c.time*2+(level(s,c.id)-1)*3+(index<4&&c.tag===focus?6:0),0),mult=1;
 for(let i=1;i<cards.length;i++){
  const from=cards[i-1].tag,to=cards[i].tag,link=LINKS.find(l=>l.from===from&&l.to===to);
  if(link){const bonus=link.mult+(path.from===from&&path.to===to?.5:0);mult+=bonus;links.push({name:link.name,from,to,bonus,index:i});}
 }
 // Relics now also shape the score engine, so draft choices change future routes.
 const relicTags={pages:'探索',roots:'联结',shoes:'自然',blank:'恢复',bridge:'社交',spark:'创造'};
 for(const [id,tag]of Object.entries(relicTags))if(s.relics.includes(id))base+=cards.filter(c=>c.tag===tag).length*3;
 if(cards.length&&s.relics.includes('mix')&&new Set(cards.map(c=>c.tag)).size===3){mult+=.5;links.push({name:'万花筒',bonus:.5});}
 const nextLoad=s.load+forecast(s,ids).load;
 let extra=cards.length&&index===4?(nextLoad<=35?12:nextLoad>55?-12:0):0;
 if(index===5&&new Set(cards.map(c=>c.tag)).size===3)extra+=12;
 mult=Math.round(mult*10)/10;
 return {base,mult,extra,score:cards.length?Math.max(0,Math.round(base*mult)+extra):0,links};
}
export function income(s){return (s.mode==='gentle'?15:12)+(s.relics.includes('fund')?2:0);}
export function budget(s,ids=s.plan){const cards=ids.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean),rent=AREAS.find(a=>a.id===s.area).rent;return {time:cards.reduce((x,c)=>x+c.time,0),cost:cards.reduce((x,c)=>x+c.cost,0)+(s.reserve?2:0),reserve:s.reserve?2:0,rent,income:income(s),available:s.cash+income(s)-rent};}
export function forecast(s,ids=s.plan){
 const deltas=Object.fromEntries(Object.keys(STATS).map(k=>[k,0]));let load=-4,notes=[];
 const cards=ids.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean),tags=new Set(cards.map(c=>c.tag)),area=AREAS.find(a=>a.id===s.area);
 const add=e=>{for(const [k,v]of Object.entries(e))deltas[k]+=v;};
 for(const c of cards){add(c.effect);for(const k of Object.keys(c.effect))if(c.effect[k]>0)deltas[k]+=level(s,c.id)-1;load+=c.load;
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
export function reroll(state){const s=clone(state);if(s.phase!=='plan'||s.rerolls>=1)throw Error('每年只能换牌一次。');if(s.cash<rerollCost(s))throw Error('换牌需要1枚家庭资金。');s.cash-=rerollCost(s);s.rerolls++;s.plan=[];s.reserve=null;return s;}
export function resolveYear(state){const s=clone(state);if(s.phase!=='plan')throw Error('请先完成本年的事件。');if(!s.plan.length)throw Error('先选择至少一张成长牌。');selectCards(s,s.plan);const b=budget(s);if(b.time>timeBudget(s))throw Error('安排超出了可用时间。');if(b.cost>b.available)throw Error('本年预算不足。');const f=forecast(s),chain=chainScore(s),before=clone(s.stats);change(s,f.deltas,f.load);s.cash+=b.income-b.rent-b.cost;
 s.combos=[...new Set([...s.combos,...f.combos])];
 s.chapterScore+=chain.score;s.totalScore+=chain.score;s.bestChain=Math.max(s.bestChain,chain.mult);
 for(const id of s.plan){s.mastery[id]=(s.mastery[id]||0)+1;if(s.mastery[id]===3||s.mastery[id]===6)f.notes.push(CARDS.find(c=>c.id===id).name+' 升至 Lv.'+level(s,id));}
 if(s.project){const p=PROJECTS.find(p=>p.id===s.project.id);s.project.progress=Math.min(p.need,s.project.progress+s.plan.filter(id=>p.tags.includes(CARDS.find(c=>c.id===id).tag)).length);}
 s.carry=s.reserve;s.reserve=null;
 s.last={score:chain.score,mult:chain.mult,age:s.age,area:s.area,cards:[...s.plan],before,after:clone(s.stats),deltas:f.deltas,notes:f.notes,cashChange:b.income-b.rent-b.cost,loadChange:f.load,event:null};
 let pool=EVENTS.filter(e=>e.min<=s.age&&e.max>=s.age&&!s.seen.includes(e.id));if(!pool.length)pool=EVENTS.filter(e=>e.min<=s.age&&e.max>=s.age);
 const start=STORY_STARTS.find(e=>e.age===s.age);const event=pick(pool,s.seed,'event'+s.age,1)[0];s.eventId=s.project&&PROJECTS.find(p=>p.id===s.project.id).due===s.age?'result-'+s.project.id:start?start.id:event.id;s.seen.push(s.eventId);s.phase='event';return s;
}
export function eventFor(s){
 const start=STORY_STARTS.find(e=>e.id===s.eventId);
 if(start)return {...start,choices:start.projects.map(id=>{const p=PROJECTS.find(p=>p.id===id);return {label:p.name,detail:p.text,cost:0,effect:{bond:2},load:0,project:id};})};
 if(s.eventId?.startsWith('result-')){
  const p=PROJECTS.find(p=>'result-'+p.id===s.eventId),success=s.project?.progress>=p.need;
  return {id:s.eventId,title:(success?'约定兑现 · ':'还没完成，也能继续 · ')+p.name,story:success?p.success:p.miss,choices:success?[
   {label:'把它变成新的日常',detail:'解锁专属牌「'+CARDS.find(c=>c.id===p.unlock).name+'」，明年必定入手。',cost:0,effect:{agency:3,bond:3},load:-2,unlock:p.unlock},
   {label:'留作纪念，支持下个计划',detail:'获得6家庭资金。放弃本次专属牌，换取更宽裕的未来。',cost:0,effect:{joy:4},load:-3,cash:6}
  ]:[
   {label:'先听听孩子的感受',detail:'记录这一段经历，今后还有新的约定。',cost:0,effect:{bond:3},load:-3},
   {label:'一起做一个更小的版本',detail:'接受调整计划，不扣除已经获得的星光。',cost:0,effect:{agency:3,joy:1},load:-1}
  ]};
 }
 return EVENTS.find(e=>e.id===s.eventId);
}
function finishChapter(s){
 const target=CHAPTERS[Math.floor((s.age-1)/3)].target*(s.mode==='gentle'?.8:1),ratio=s.chapterScore/Math.round(target),stars=ratio>=1.65?3:ratio>=1.3?2:ratio>=1?1:0,reward=stars*2;
 s.chapterResults.push({index:Math.floor((s.age-1)/3),score:s.chapterScore,target:Math.round(target),stars,reward});s.cash+=reward;s.chapterScore=0;
}
export function chooseEvent(state,index){const s=clone(state);if(s.phase!=='event')throw Error('现在没有待处理事件。');const e=eventFor(s),c=e?.choices[index];if(!c)throw Error('请选择有效回应。');if(s.cash<c.cost)throw Error('家庭资金不足，可以选择另一种回应。');s.cash+=-c.cost+(c.cash||0);change(s,c.effect,c.load);
 if(c.project)s.project={id:c.project,progress:0};
 if(e.id.startsWith('result-')){const p=PROJECTS.find(p=>p.id===s.project.id);s.projectResults.push({id:p.id,success:s.project.progress>=p.need,unlocked:!!c.unlock});s.project=null;}
 if(c.unlock){s.unlocked.push(c.unlock);if(!s.carry)s.carry=c.unlock;else{s.cash+=2;s.carry=c.unlock;s.last.notes.push('专属牌优先留到明年；返还2枚留牌资金');}}
 s.last.event={id:e.id,choice:index,title:e.title,label:c.label};s.last.after=clone(s.stats);s.last.load=s.load;s.history.push(s.last);s.age++;s.plan=[];s.moved=false;s.rerolls=0;s.eventId=null;
 if(s.age%3===0)finishChapter(s);
 if(s.age===18){s.phase='end';s.carry=null;return s;}
 if(s.age%3===0){s.phase='draft';s.draft=pick(RELICS.filter(r=>!s.relics.includes(r.id)),s.seed,'draft'+s.age,3).map(r=>r.id);}
 else s.phase='plan';return s;
}
export function chooseRelic(state,id){const s=clone(state);if(s.phase!=='draft'||!s.draft.includes(id))throw Error('请选择当前提供的成长信物。');s.relics.push(id);s.draft=[];s.phase='plan';s.milestones.push({age:s.age,id});return s;}
export function missionWon(s){const a=s.stats;return s.mission==='balance'?Object.values(a).every(v=>v>=50):s.mission==='explore'?a.learning>=75&&a.joy>=50:s.mission==='connect'?a.bond>=70&&a.agency>=70:a.health>=70&&a.joy>=70&&s.load<=45;}
export function ending(s){const a=s.stats;let name='仍在展开的人生',text='18岁不是结算人生的时刻，只是把更多选择交还给孩子。';if(Object.values(a).every(v=>v>=68)){name='有根，也有翅膀';text='拥有连接，也保有自己的方向。这些日常，成了一片宽阔的起点。';}else if(a.agency>=75&&a.learning>=65){name='把问号变成远方';text='对世界保有好奇，也敢于亲自寻找答案。接下来的道路，还会不断生长。';}else if(a.bond>=78){name='随时可以回来的家';text='无论走向哪里，孩子知道，家里总有一个愿意倾听的人。';}else if(a.health>=75&&a.joy>=70){name='普通日子的光';text='会享受生活、照顾自己，也懂得为小小的快乐停留。';}else if(a.agency>=75){name='自己的指南针';text='不必沿着预设的轨道，也有勇气为自己的选择负责。';}else if(a.learning>=80){name='追问世界的人';text='学习成为一把钥匙。未来还要继续练习，如何平衡期待与生活。';}
 const achieved=['走过十八年'];if(s.chapterResults.length===6&&s.chapterResults.every(c=>c.stars>0))achieved.push('六章点灯人');if(s.projectResults.filter(p=>p.success).length===3)achieved.push('说到做到');if(s.bestChain>=2.3)achieved.push('连锁设计师');if(missionWon(s))achieved.push('守住初心');if(s.combos.length>=4)achieved.push('组合探索家');if(s.load<=25)achieved.push('松弛有度');if(s.relics.length===5)achieved.push('回忆收藏家');if(a.bond>=80&&a.agency>=70)achieved.push('爱与边界');return {name,text,achieved,mission:missionWon(s)};}
const validScoreRecord=r=>['score','mult'].every(k=>r[k]===undefined||Number.isFinite(r[k])&&r[k]>=0&&r[k]<=10000);
const isEventId=id=>EVENTS.some(e=>e.id===id)||STORY_STARTS.some(e=>e.id===id)||PROJECTS.some(p=>'result-'+p.id===id);
export function validateSave(raw){
 const v=clone(raw);
 if(v?.version===1){
  Object.assign(v,{version:2,path:'maker',mastery:{},chapterScore:Math.round(CHAPTERS[Math.min(5,Math.floor(v.age/3))].target*(v.mode==='gentle'?.8:1)*(v.age%3)/3),chapterResults:[],totalScore:0,project:null,projectResults:[],unlocked:[],carry:null,reserve:null,bestChain:1,migrated:true});
  for(const h of v.history||[])for(const id of h.cards||[])v.mastery[id]=Math.min(18,(v.mastery[id]||0)+1);
  // Keep the old current hand valid until the next annual draw.
  if(v.phase==='plan')v.plan=[];
 }
 if(!v||v.version!==VERSION||typeof v.seed!=='string'||v.seed.length>40||typeof v.name!=='string'||v.name.length>12||!CITIES.includes(v.city)||!['standard','gentle'].includes(v.mode)||!Number.isInteger(v.age)||v.age<0||v.age>18||!['plan','event','draft','end'].includes(v.phase)||!AREAS.some(a=>a.id===v.area)||!TRAITS.some(a=>a.id===v.trait)||!MISSIONS.some(a=>a.id===v.mission))throw Error('存档格式不兼容。');
 if(!Number.isFinite(v.cash)||v.cash<0||v.cash>10000||!Number.isFinite(v.load)||v.load<0||v.load>100||!v.stats||Object.keys(STATS).some(k=>!Number.isFinite(v.stats[k])||v.stats[k]<0||v.stats[k]>100))throw Error('存档数值无效。');
 for(const k of ['history','combos','seen','milestones','relics','draft','plan','chapterResults','projectResults','unlocked'])if(!Array.isArray(v[k])||v[k].length>100)throw Error('存档结构无效。');
 if(!PATHS.some(p=>p.id===v.path)||!v.mastery||typeof v.mastery!=='object'||Object.entries(v.mastery).some(([id,n])=>!CARDS.some(c=>c.id===id)||!Number.isInteger(n)||n<0||n>18)||[v.chapterScore,v.totalScore,v.bestChain].some(n=>!Number.isFinite(n)||n<0||n>100000))throw Error('存档连锁记录无效。');
 if(v.project&&(!PROJECTS.some(p=>p.id===v.project.id&&v.age>p.start&&v.age<=p.due)||!Number.isInteger(v.project.progress)||v.project.progress<0||v.project.progress>4))throw Error('存档约定无效。');
 if(v.unlocked.some(id=>!SPECIAL_CARDS.some(c=>c.id===id))||new Set(v.unlocked).size!==v.unlocked.length||[v.carry,v.reserve].some(id=>id!==null&&!CARDS.some(c=>c.id===id&&(BASE_CARDS.includes(c)||v.unlocked.includes(id)))))throw Error('存档留牌无效。');
 if(v.chapterResults.some(c=>!Number.isInteger(c.index)||c.index<0||c.index>5||!Number.isInteger(c.stars)||c.stars<0||c.stars>3||!Number.isFinite(c.score)||!Number.isFinite(c.target)||!Number.isFinite(c.reward)||c.reward<0||c.reward>6)||v.projectResults.some(p=>!PROJECTS.some(c=>c.id===p.id)||typeof p.success!=='boolean'))throw Error('存档篇章无效。');
 if(v.relics.some(id=>!RELICS.some(r=>r.id===id))||new Set(v.relics).size!==v.relics.length||v.plan.some(id=>!CARDS.some(c=>c.id===id))||v.draft.some(id=>!RELICS.some(c=>c.id===id))||!Number.isInteger(v.rerolls)||v.rerolls<0||v.rerolls>1||typeof v.moved!=='boolean')throw Error('存档卡牌无效。');
 if((v.phase==='end')!==(v.age===18)||v.history.length!==v.age||v.phase==='event'&&(!isEventId(v.eventId)||!v.last)||v.phase==='draft'&&(v.age%3!==0||v.age===0||v.draft.length!==3)||v.phase==='event'&&v.eventId.startsWith('result-')&&v.eventId!=='result-'+v.project?.id)throw Error('存档进度无效。');
 for(const h of v.history){if(!h||!validScoreRecord(h)||!Number.isInteger(h.age)||!AREAS.some(a=>a.id===h.area)||!Array.isArray(h.cards)||h.cards.some(id=>!CARDS.some(c=>c.id===id))||!Array.isArray(h.notes)||h.notes.some(n=>typeof n!=='string'||n.length>100)||!h.event||!isEventId(h.event.id)||![0,1].includes(h.event.choice)||!h.after||Object.keys(STATS).some(k=>!Number.isFinite(h.after[k])))throw Error('存档年鉴无效。');}
 if(v.phase==='event'&&(!validScoreRecord(v.last)||!v.last.deltas||Object.keys(STATS).some(k=>!Number.isFinite(v.last.deltas[k]))))throw Error('存档结算记录无效。');
 if(v.phase==='plan'){selectCards(v,v.plan);if(v.reserve!==null)reserveCard(v,v.reserve);}return v;
}
