import assert from 'node:assert/strict';
import { build } from 'esbuild';
async function moduleFrom(path){const r=await build({entryPoints:[path],bundle:true,format:'esm',platform:'node',write:false});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const d=await moduleFrom('src/lib/improv/daily.ts');
const base={date:'2026-09-24',focus:'breathe',minutes:3,city:'shanghai'};
assert.equal(d.localDay(new Date(2026,0,2,0,5)),'2026-01-02');
assert.equal(d.localDay(new Date(2026,11,31,23,59)),'2026-12-31');
assert.deepEqual(d.dailyCard(base),d.dailyCard({...base}));
assert.equal(d.dailyCard({...base,reaction:'smaller'}).minutes,1);
assert.equal(d.dailyCard({...base,reaction:'smaller'}).action,d.dailyCard({...base,minutes:1}).action);
for(const focus of d.FOCI.map(f=>f.id)){
 const ids=new Set();
 for(let i=0;i<8;i++){
  const date=new Date(Date.UTC(2026,8,24+i)).toISOString().slice(0,10);
  const card=d.dailyCard({...base,date,focus});ids.add(card.id);
  assert.ok(card.action && card.enAction && card.fortune && card.enFortune);
  for(const minutes of [1,3,10]) assert.ok(d.dailyCard({...base,date,focus,minutes}).action.length>5);
 }
 assert.equal(ids.size,8,focus+' repeats inside the eight-day cycle');
}
assert.deepEqual(d.parseJournal('broken'),d.emptyJournal());
assert.equal(d.validEntry({...base,date:'2026-02-30'}),false);
assert.equal(d.validEntry({...base,minutes:'3'}),false);
assert.equal(d.validEntry({...base,city:'not-a-city'}),false);
let journal=d.saveEntry(d.emptyJournal(),base);
journal=d.saveEntry(journal,{...base,reaction:'done'});
assert.equal(journal.entries.length,1);
assert.equal(d.parseJournal(JSON.stringify(journal)).entries[0].reaction,'done');
assert.throws(()=>d.saveEntry(journal,{...base,focus:'unknown'}));
for(let i=0;i<110;i++)journal=d.saveEntry(journal,{...base,date:new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10)});
assert.equal(journal.entries.length,90);
assert.equal(journal.entries[0].date,'2026-09-24');
assert.equal(d.suggestedMinutes({entries:[{reaction:'skip'},{reaction:'smaller'}],minutes:10}),1);
assert.equal(d.suggestedMinutes({entries:[{reaction:'done'},{reaction:'done'}],minutes:10}),10);
console.log('PASS daily cards: local dates, eight-day variety, bilingual actions, smaller tasks, persistence, invalid inputs and history limits');

// Exercise audio lifecycle without real speakers, including a resume/unmount race.
const intervals=new Map(),timeouts=new Map();let timerId=0;
const originals={setInterval:globalThis.setInterval,clearInterval:globalThis.clearInterval,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
globalThis.setInterval=f=>{const id=++timerId;intervals.set(id,f);return id;};globalThis.clearInterval=id=>intervals.delete(id);
globalThis.setTimeout=f=>{const id=++timerId;timeouts.set(id,f);return id;};globalThis.clearTimeout=id=>timeouts.delete(id);
class Param{value=0;setValueAtTime(v){assert.ok(Number.isFinite(v));}exponentialRampToValueAtTime(v){assert.ok(v>0&&Number.isFinite(v));}setTargetAtTime(v){this.value=v;}}
class Node{gain=new Param();frequency=new Param();threshold=new Param();knee=new Param();ratio=new Param();stopped=false;connect(){}disconnect(){}start(t){assert.ok(Number.isFinite(t));}stop(){this.stopped=true;this.onended?.();}}
class Context{state='suspended';currentTime=0;sampleRate=8000;destination=new Node();nodes=[];resumePromise=null;static instances=[];constructor(){Context.instances.push(this);}createGain(){return new Node();}createDynamicsCompressor(){return new Node();}createBiquadFilter(){return new Node();}createOscillator(){const n=new Node();this.nodes.push(n);return n;}createBufferSource(){const n=new Node();this.nodes.push(n);return n;}createBuffer(_,length){return {getChannelData:()=>new Float32Array(length)};}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}}
globalThis.window={AudioContext:Context};
const {JazzRoom}=await moduleFrom('src/lib/improv/jazz.ts');
try{
 const room=new JazzRoom(96,42,()=>{});
 assert.equal(Context.instances.length,0,'constructing a room must not autoplay');
 assert.equal(await room.start(),true);
 const context=Context.instances.at(-1);assert.ok(context.nodes.length>0);
 const count=intervals.size;await room.start();assert.equal(intervals.size,count,'must not duplicate schedulers');
 for(let i=0;i<4;i++)room.solo(i);
 room.setVolume(5);room.stop();assert.equal(intervals.size,0);assert.equal(timeouts.size,0);
 assert.ok(context.nodes.every(n=>n.stopped));
 await room.start();room.dispose();assert.equal(context.state,'closed');assert.equal(intervals.size,0);
 await assert.rejects(()=>room.start());
 let release;Context.prototype.resume=function(){return new Promise(resolve=>{release=resolve;});};
 const race=new JazzRoom(96,42,()=>{});const pending=race.start();race.dispose();release();assert.equal(await pending,false);assert.equal(intervals.size,0);
 console.log('PASS jazz lifecycle: opt-in start, notes, single scheduler, stop, cleanup, restart and delayed-resume race');
}finally{Object.assign(globalThis,originals);delete globalThis.window;}
