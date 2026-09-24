import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Chrome } from '@/components/atlas/Chrome';
import { CITIES, CITY_BY_ID } from '@/lib/atlas/cities';
import { useAtlas } from '@/lib/atlas/store';
import { JazzRoom } from '@/lib/improv/jazz';
import { dailyCard, emptyJournal, FOCI, localDay, parseJournal, saveEntry, STORAGE_KEY, suggestedMinutes, type Entry, type Focus, type Journal, type Minutes, type Reaction } from '@/lib/improv/daily';
import type { CityId } from '@/lib/atlas/types';
import '@/improv.css';

export const Route = createFileRoute('/improv')({component: ImprovPage});
function ImprovPage(){
  const {lang,cityId,setCity}=useAtlas();const zh=lang==='zh';
  const [journal,setJournal]=useState<Journal>(()=>{try{return parseJournal(localStorage.getItem(STORAGE_KEY));}catch{return emptyJournal();}});
  const [today,setToday]=useState(()=>localDay());
  const [focus,setFocus]=useState<Focus>(journal.focus);
  const [minutes,setMinutes]=useState<Minutes>(()=>suggestedMinutes(journal));
  const [storageOk,setStorageOk]=useState(true);
  const [copyStatus,setCopyStatus]=useState('');
  const [manualShare,setManualShare]=useState('');
  const entry=journal.entries.find(e=>e.date===today);
  const card=entry?dailyCard(entry):null;
  const [playing,setPlaying]=useState(false),[starting,setStarting]=useState(false),[beat,setBeat]=useState(-1),[volume,setVolume]=useState(24),[audioError,setAudioError]=useState(false);
  const [activePad,setActivePad]=useState<number|null>(null);
  const engine=useRef<JazzRoom|null>(null),mounted=useRef(true),padTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const tempo=card?.tempo??(minutes===1?82:minutes===3?96:108);
  function stop(){engine.current?.dispose();engine.current=null;setPlaying(false);setStarting(false);setBeat(-1);}
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;engine.current?.dispose();if(padTimer.current)clearTimeout(padTimer.current);};},[]);
  useEffect(()=>{const tick=()=>setToday(localDay());const timer=setInterval(tick,30000);const visibility=()=>{tick();if(document.hidden){engine.current?.dispose();engine.current=null;setPlaying(false);setStarting(false);setBeat(-1);}};document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',visibility);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',visibility);};},[]);
  useEffect(()=>{stop();setCopyStatus('');setManualShare('');},[today,entry?.date,entry?.minutes]);
  useEffect(()=>{setFocus(journal.focus);setMinutes(suggestedMinutes(journal));},[today]);
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(journal));setStorageOk(true);}catch{setStorageOk(false);}},[journal]);
  function draw(){stop();const e:Entry={date:today,focus,minutes,city:cityId};setJournal(j=>saveEntry(j,e));}
  function react(reaction:Reaction){if(entry)setJournal(j=>saveEntry(j,{...entry,reaction}));}
  async function toggleAudio(){
    if(playing){stop();return;}if(starting)return;
    setStarting(true);setAudioError(false);
    const room=new JazzRoom(tempo,card?.seed??Date.now(),setBeat);engine.current=room;room.setVolume(volume/100);
    try{const started=await room.start();if(mounted.current&&engine.current===room){setPlaying(started);setStarting(false);}}
    catch{room.dispose();if(mounted.current&&engine.current===room){engine.current=null;setAudioError(true);setStarting(false);}}
  }
  function tap(i:number){if(!playing)return;engine.current?.solo(i);setActivePad(i);if(padTimer.current)clearTimeout(padTimer.current);padTimer.current=setTimeout(()=>setActivePad(null),220);}
  useEffect(()=>{const handler=(event:KeyboardEvent)=>{if(event.repeat||event.metaKey||event.ctrlKey||event.altKey||event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||event.target instanceof HTMLSelectElement)return;const i='asdf'.indexOf(event.key.toLowerCase());if(i>=0&&playing){event.preventDefault();tap(i);}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[playing]);
  const shareText=entry&&card?`${zh?'今日人生即兴谱':'Today’s life improv'} · ${today}\n${zh?card.fortune:card.enFortune}\n${zh?card.action:card.enAction}\n${zh?'创意游戏提示，不是命运预测。':'A creative prompt, not a prediction.'}\n${window.location.origin}${import.meta.env.BASE_URL}improv/`:'';
  async function copy(){try{await navigator.clipboard.writeText(shareText);setCopyStatus(zh?'复制好了，送给一个也需要开小差的人。':'Copied. Send it to someone who could use a detour.');setManualShare('');}catch{setManualShare(shareText);setCopyStatus(zh?'可以从下面选中复制。':'Select and copy the text below.');}}
  const currentCity=CITY_BY_ID[(entry?.city??cityId) as CityId];
  const pads=zh?['松一点','歪一点','大胆点','就这样']:['Loosen up','Take a turn','Go for it','That’s it'];
  const history=journal.entries.filter(e=>e.date!==today).slice(0,7);
  return <Chrome><div className="improv-scroll"><main className="improv-page">
    <header className="improv-heading"><div><p className="improv-kicker">SIDE B · {zh?'人生即兴局':'LIFE, IMPROVISED'}</p><h1>{zh?<>世界照旧离谱。<br/><span>你可以即兴。</span></>:<>Same strange world.<br/><span>Your turn to improvise.</span></>}</h1><p>{zh?'一张今日签，一件小事，一段你亲手弹的爵士。':'A daily prompt, one tiny action, and jazz you can play.'}</p></div><div className="improv-date"><span>{today.replaceAll('-',' / ')}</span><strong>{zh?'今日小型叛逃':'YOUR DAILY DETOUR'}</strong><span>{zh?'约 1–10 分钟 · 不用成为更好的谁':'1–10 minutes · No self-upgrade required'}</span></div></header>
    <div className="improv-grid">
      <section className="improv-main" aria-label={zh?'今日即兴谱':'Your daily score'}>
        {!entry?<div className="improv-form"><p className="improv-kicker">01 / {zh?'先调一下今天的你':'TUNE IN'}</p><h2>{zh?'你今天是哪种卡带？':'What kind of day is playing?'}</h2><div className="improv-focus" role="group" aria-label={zh?'今天的状态':'Today’s mood'}>{FOCI.map(f=><button key={f.id} aria-pressed={focus===f.id} onClick={()=>setFocus(f.id)}>{zh?f.label:f.en}</button>)}</div><div className="improv-setting"><span>{zh?'愿意借给自己':'Time for yourself'}</span><div className="improv-minutes" role="group" aria-label={zh?'可用时间':'Available time'}>{([1,3,10] as Minutes[]).map(n=><button key={n} aria-pressed={minutes===n} onClick={()=>{stop();setMinutes(n);}}>{n} {zh?'分钟':'min'}</button>)}</div></div><label className="improv-setting">{zh?'故事发生在':'Set the scene in'}<select value={cityId} onChange={e=>setCity(e.target.value as CityId)}>{CITIES.map(c=><option key={c.id} value={c.id}>{zh?c.nameZh:c.nameEn}</option>)}</select></label><button className="improv-primary" onClick={draw}>{zh?'给今天开个小差':'Give today a plot twist'}<span aria-hidden="true">↗</span></button><p className="improv-fine">{zh?'今日签是创意游戏提示。宇宙没参与，责任它也不背。':'A creative game prompt. The universe was not consulted.'}</p></div>:card&&<div className="improv-score" key={entry.date}>
          <div className="improv-ticket-top"><span>{zh?currentCity.nameZh:currentCity.nameEn} / {FOCI.find(f=>f.id===entry.focus)?.[zh?'label':'en']}</span><span>{card.minutes} {zh?'分钟':'MIN'}</span></div>
          <p className="improv-kicker">{zh?'今日签 · 创意游戏':'DAILY PROMPT · CREATIVE PLAY'}</p><h2 className="improv-fortune">{zh?card.fortune:card.enFortune}</h2>
          <div className="improv-mission"><span className="improv-kicker">{zh?'你能拨动的那个变量':'ONE THING YOU CAN CHANGE'}</span><h3>{zh?card.title:card.en}</h3><p>{zh?card.action:card.enAction}</p></div>
          <div className="improv-reactions" role="group" aria-label={zh?'记录今天的尝试':'Record your attempt'}><button aria-pressed={entry.reaction==='done'} onClick={()=>react('done')}>{entry.reaction==='done'?'✓ ':''}{zh?'我试了':'I tried it'}</button><button aria-pressed={entry.reaction==='smaller'} onClick={()=>react('smaller')}>{zh?'再小一点':'Make it smaller'}</button><button aria-pressed={entry.reaction==='skip'} onClick={()=>react('skip')}>{zh?'今天先算了':'Not today'}</button></div>
          <p className="improv-feedback" role="status">{entry.reaction==='done'?(zh?'世界不一定变好了。但你刚刚拨动了一个变量。':'The whole world may not change. You just changed one variable.'):entry.reaction==='skip'?(zh?'收到。休息也是选择。明天不用补作业。':'Rest is a choice. No make-up homework tomorrow.'):entry.reaction==='smaller'?(zh?'已缩到一分钟。人生已经够难，任务不用凑热闹。':'Down to one minute. The task does not need to make life harder.'):(zh?'先去试。做完再回来，留个小记号。':'Try it, then come back and leave a small mark.')}</p>
          <div className="improv-card-footer"><button onClick={copy}>{zh?'复制这张今日签':'Copy this prompt'}</button><span>{zh?'明天换一张，不欠连胜。':'A new prompt tomorrow. No streak to protect.'}</span></div><p className="improv-fine" role="status">{copyStatus}</p>{manualShare&&<textarea className="improv-share-text" aria-label={zh?'可复制的今日签':'Prompt to copy'} readOnly value={manualShare} onFocus={e=>e.currentTarget.select()}/>}
        </div>}
      </section>
      <aside className="improv-room" aria-label={zh?'互动爵士伴奏':'Interactive jazz room'}><div className="improv-room-top"><p className="improv-kicker">02 / {zh?'轮到你主奏':'TAKE THE SOLO'}</p><span>{tempo} BPM · SWING</span></div><h2>{zh?'这回，世界给你伴奏。':'This time, the world backs you.'}</h2><p className="improv-room-copy">{zh?'先开乐队，再随便敲。这里没有错音，只有还没被理解的即兴。':'Start the band, then tap. There are no wrong notes here. Just misunderstood improvisation.'}</p><div className="improv-sequence" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i} className={beat===i?'is-beat':''}/>)}</div><button className="improv-play" aria-pressed={playing} disabled={starting} onClick={toggleAudio}>{starting?(zh?'乐队正在就位…':'Seating the band…'):playing?(zh?'Ⅱ  让乐队歇会儿':'Ⅱ  Give the band a break'):(zh?'▶  开一小段爵士':'▶  Start a little jazz')}</button><div className="improv-pads">{pads.map((p,i)=><button key={p} disabled={!playing} className={activePad===i?'is-struck':''} onClick={()=>tap(i)} aria-label={`${p} / ${'ASDF'[i]}`}><span>{p}</span><kbd>{'ASDF'[i]}</kbd></button>)}</div><label className="improv-volume"><span>{zh?'音量':'Volume'}</span><input aria-label={zh?'伴奏音量':'Backing volume'} type="range" min="0" max="50" value={volume} onChange={e=>{const n=Number(e.target.value);setVolume(n);engine.current?.setVolume(n/100);}}/><span>{volume}%</span></label><p className="improv-fine">{audioError?(zh?'这个浏览器暂时没让乐队进门。今日签照样能用。':'The browser could not start audio. Your daily prompt still works.'):(zh?'点击后才出声。点按钮或按 A S D F；离开页面自动停。':'Sound starts only when you choose. Tap or use A S D F. Leaving the page stops it.')}</p><div className="improv-room-note">{zh?'“不必把人生弹对，先弹出自己的声音。”':'“You do not have to play life correctly. Start by making your own sound.”'}</div></aside>
    </div>
    <section className="improv-journal"><div><p className="improv-kicker">03 / {zh?'你留下的小证据':'SMALL PROOF YOU WERE HERE'}</p><h2>{zh?'不是打卡，是留个脚印。':'A footprint, not attendance.'}</h2><p>{zh?'缺席不扣分。人生已经有考勤了。':'No points lost for absence. Life already has attendance sheets.'}</p></div><div className="improv-history">{history.length?history.map(e=><div key={e.date}><time>{e.date.slice(5).replace('-',' / ')}</time><span>{zh?dailyCard(e).title:dailyCard(e).en}</span><strong>{e.reaction==='done'?(zh?'试过':'Tried'):e.reaction==='skip'?(zh?'留白':'Rested'):e.reaction==='smaller'?(zh?'小步':'Smaller'):(zh?'收下':'Saved')}</strong></div>):<p>{zh?'这里还很安静。今天的谱会留到明天。':'Quiet for now. Today’s score will be here tomorrow.'}</p>}</div></section>
    <footer className="improv-footer"><p>{storageOk?(zh?'记录只存在当前浏览器，最多保留 90 份；两个站点不互通。':'History stays in this browser, up to 90 daily entries. The two sites do not sync.'):(zh?'浏览器未允许保存。今天照样玩，刷新后记录可能消失。':'Storage is unavailable. You can still play, but refreshing may lose today’s record.')}</p><Link to="/">{zh?'回地图，看看现实的底牌':'Back to the map'}</Link></footer>
  </main></div></Chrome>;
}
