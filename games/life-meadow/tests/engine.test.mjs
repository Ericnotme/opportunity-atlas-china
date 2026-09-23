import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,available,budget,timeBudget,forecast,selectCards,resolveYear,chooseEvent,chooseRelic,validateSave,move,reroll,ending,eventFor,chainScore,reserveCard,setPath,level,rerollCost} from '../dist/engine.js';
import {EVENTS} from '../dist/data.js';
import {PATHS,PROJECTS} from '../dist/play-content.js';
function best(s){const hand=available(s),options=[];for(let mask=1;mask<32;mask++){const cards=hand.filter((_,i)=>mask&(1<<i));if(cards.length>3)continue;const ids=cards.map(c=>c.id),b=budget(s,ids);if(b.time>timeBudget(s)||b.cost>b.available)continue;const f=forecast(s,ids),score=Object.entries(f.deltas).reduce((sum,[k,v])=>sum+v*(100-s.stats[k])/70,0)-Math.max(0,s.load+f.load-40)*.3;options.push({ids,score});}return options.sort((a,b)=>b.score-a.score)[0].ids;}
function play(seed){let s=newGame({seed});while(s.phase!=='end'){if(s.phase==='plan')s=resolveYear(selectCards(s,best(s)));else if(s.phase==='event'){const e=eventFor(s);s=chooseEvent(s,e.choices.findIndex(c=>c.cost<=s.cash));}else s=chooseRelic(s,s.draft[0]);assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(s))));assert.ok(s.cash>=0);for(const v of Object.values(s.stats))assert.ok(v>=0&&v<=100);}return s;}
test('100 seeded games complete, stay bounded, and round-trip saves at every phase',()=>{for(let i=0;i<100;i++){const s=play('QA-'+i);assert.equal(s.age,18);assert.equal(s.history.length,18);assert.equal(s.relics.length,5);assert.ok(ending(s).name);}});
test('same seed plus same decisions produces the same complete life',()=>assert.deepEqual(play('REPEAT'),play('REPEAT')));
test('rejects unavailable, duplicate, oversized plans and out-of-order actions without mutation',()=>{const s=newGame(),snapshot=JSON.stringify(s),id=available(s)[0].id;assert.throws(()=>selectCards(s,[id,id]));assert.throws(()=>selectCards(s,['nonexistent']));assert.throws(()=>selectCards(s,available(s).map(c=>c.id)));assert.throws(()=>chooseEvent(s,0));assert.throws(()=>chooseRelic(s,'pages'));assert.throws(()=>resolveYear(s));assert.equal(JSON.stringify(s),snapshot);});
test('a depleted budget never traps a player at an event',()=>{assert.ok(EVENTS.every(e=>e.choices.some(c=>c.cost===0)));for(const e of EVENTS){const s={...newGame(),phase:'event',eventId:e.id,cash:0,last:{}};assert.doesNotThrow(()=>chooseEvent(s,e.choices.findIndex(c=>c.cost===0)));}});
test('moving and changing cards costs funds and cannot be repeated within a year',()=>{let s=move(newGame(),'library');assert.equal(s.cash,15);assert.throws(()=>move(s,'garden'));s=reroll(s);assert.equal(s.cash,14);assert.throws(()=>reroll(s));});
test('corrupt saves rejected and forecast matches pre-event execution',()=>{const s=newGame(),p=selectCards(s,best(s)),f=forecast(p),r=resolveYear(p);for(const k of Object.keys(s.stats))assert.equal(r.stats[k]-s.stats[k],f.deltas[k]);assert.throws(()=>validateSave({...s,age:18}));assert.throws(()=>validateSave({...s,cash:NaN}));assert.throws(()=>validateSave({...s,relics:['fake']}));assert.throws(()=>validateSave({...r,last:{}}));assert.throws(()=>validateSave({...r,last:{...r.last,score:'<img onerror=alert(1)>'}}));});

function playUntil(s,age,choose=()=>0){while(s.age<age||s.phase==='draft'){if(s.phase==='plan')s=resolveYear(selectCards(s,best(s)));else if(s.phase==='event')s=chooseEvent(s,choose(s));else s=chooseRelic(s,s.draft[0]);}return s;}
test('ordered links produce a real score difference, without changing unordered growth',()=>{
 const s=newGame({path:'maker'}),forward=['read','play','friends'],reverse=[...forward].reverse();
 assert.equal(chainScore(s,forward).mult,2.3);assert.equal(chainScore(s,reverse).mult,1);
 assert.ok(chainScore(s,forward).score>chainScore(s,reverse).score);
 assert.deepEqual(forecast(s,forward),forecast(s,reverse));
});
test('all paths offer a build pair and a free affordable move, even after a reroll',()=>{
 for(const path of PATHS)for(let i=0;i<20;i++){
  let s=newGame({seed:'PATH'+i,path:path.id});
  for(let age=0;age<18;age++){const hand=available(s);assert.equal(hand.length,5);assert.equal(new Set(hand.map(c=>c.id)).size,5);assert.ok(hand.some(c=>c.tag===path.from));assert.ok(hand.some(c=>c.tag===path.to));assert.ok(hand.some(c=>c.cost===0&&c.time<=2));s=playUntil(s,age+1);}
 }
});
test('retaining a card is priced once, survives the next draw, and can be cancelled',()=>{
 let s=newGame(),id=available(s)[0].id;const base=budget(s).cost;
 s=reserveCard(s,id);assert.equal(budget(s).cost,base+2);assert.equal(budget(reserveCard(s,id)).cost,base+2);
 assert.equal(budget(reserveCard(s,null)).cost,base);
 s=chooseEvent(resolveYear(selectCards(s,[id])),0);
 assert.equal(s.carry,id);assert.equal(s.reserve,null);assert.ok(available(s).some(c=>c.id===id));
 assert.ok(available(reroll(s)).some(c=>c.id===id));
});
test('project choices persist for two years and unlock distinct functional cards',()=>{
 for(const p of PROJECTS){
  let s=playUntil(newGame({seed:'PROMISE',path:'maker'}),p.start);
  s=resolveYear(selectCards(s,best(s)));const e=eventFor(s),choice=e.choices.findIndex(c=>c.project===p.id);assert.ok(choice>=0);s=chooseEvent(s,choice);
  while(s.age<=p.due){const hand=available(s),match=hand.filter(c=>p.tags.includes(c.tag)),ids=[];
   for(const c of match){const b=budget(s,[...ids,c.id]);if(ids.length<3&&b.time<=timeBudget(s)&&b.cost<=b.available)ids.push(c.id);}
   s=resolveYear(selectCards(s,ids.length?ids:best(s)));
   if(s.age===p.due){assert.equal(eventFor(s).id,'result-'+p.id);const success=s.project.progress>=p.need;
    s=chooseEvent(s,0);assert.equal(s.projectResults.at(-1).success,success);
    if(success){assert.ok(s.unlocked.includes(p.unlock));assert.ok(available(s).some(c=>c.id===p.unlock));}
   }else s=chooseEvent(s,0);
  }
  assert.equal(s.project,null);assert.doesNotThrow(()=>validateSave(s));
 }
});
test('successful promises allow money instead of a card; missed ones offer free closure',()=>{
 for(const progress of [0,3]){let s=playUntil(newGame(),2);s.project={id:'scrapbook',progress};s=resolveYear(selectCards(s,[available(s).find(c=>!['探索','创造'].includes(c.tag))?.id||available(s)[0].id]));
  s.project.progress=progress;const e=eventFor(s);assert.equal(e.id,'result-scrapbook');assert.ok(e.choices.every(c=>c.cost===0));const cash=s.cash;s=chooseEvent(s,1);assert.equal(s.projectResults.at(-1).success,progress===3);assert.equal(s.unlocked.length,0);if(progress===3)assert.ok(s.cash>=cash+6);
 }
});
test('mastery, chapters, and end-of-chapter time rules have observable effects',()=>{
 const s=newGame(),a=chainScore(s,['read']);s.mastery.read=3;assert.equal(level(s,'read'),2);assert.equal(chainScore(s,['read']).base,a.base+3);s.mastery.read=6;assert.equal(level(s,'read'),3);
 const age8=playUntil(newGame(),8);assert.equal(timeBudget(age8),6-(age8.relics.includes('time')?0:1));const age9=playUntil(age8,9);assert.equal(rerollCost(age9),0);assert.equal(reroll(age9).cash,age9.cash);
 const end=play('CHAPTERS');assert.equal(end.chapterResults.length,6);assert.equal(end.totalScore,end.history.reduce((n,h)=>n+h.score,0));assert.ok(end.chapterResults.every(c=>c.stars>=0&&c.stars<=3));
});
test('legacy saves keep age, history and attributes, and corrupt extension fields are rejected',()=>{
 const original=playUntil(newGame(),7),legacy={...structuredClone(original),version:1};
 // Emulate a v1 save with only legacy events and base cards.
 for(const h of legacy.history){h.cards=['read'];h.event={id:EVENTS[0].id,choice:0};}
 for(const key of ['path','mastery','chapterScore','chapterResults','totalScore','project','projectResults','unlocked','carry','reserve','bestChain'])delete legacy[key];
 const upgraded=validateSave(legacy);assert.equal(upgraded.version,2);assert.equal(upgraded.age,7);assert.deepEqual(upgraded.stats,legacy.stats);assert.deepEqual(upgraded.history,legacy.history);assert.ok(upgraded.migrated);assert.doesNotThrow(()=>playUntil(upgraded,18));
 assert.throws(()=>validateSave({...newGame(),mastery:{read:NaN}}));assert.throws(()=>validateSave({...newGame(),unlocked:['missing']}));assert.throws(()=>validateSave({...newGame(),chapterScore:Infinity}));
});
