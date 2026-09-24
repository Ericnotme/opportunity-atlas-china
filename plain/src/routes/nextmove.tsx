import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Chrome } from '@/components/atlas/Chrome';
import { useAtlas } from '@/lib/atlas/store';
import { localDay } from '@/lib/improv/daily';
import { advance, deck, parseJournal, saveRun, STORAGE_KEY, type Journal, type Run, type Side, type Words } from '@/lib/nextmove/game';
import '@/nextmove.css';

export const Route = createFileRoute('/nextmove')({ component: NextMove });
function NextMove() {
  const [today, setToday] = useState(localDay);
  useEffect(() => {
    const tick = () => setToday(localDay());
    const timer = window.setInterval(tick, 30000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, []);
  return <Chrome><Game key={today} today={today}/></Chrome>;
}
function Game({ today }: { today: string }) {
  const zh = useAtlas(s => s.lang) === 'zh';
  const w = (words: Words) => words[zh ? 0 : 1];
  const [journal, setJournal] = useState<Journal>(() => { try { return parseJournal(localStorage.getItem(STORAGE_KEY)); } catch { return { runs: [] }; } });
  const [storageOk, setStorageOk] = useState(true);
  const [alternate, setAlternate] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(60);
  const [copyStatus, setCopyStatus] = useState('');
  const [manualShare, setManualShare] = useState('');
  const [erased, setErased] = useState(false);
  const lock = useRef(false);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const run = journal.runs.find(r => r.date === today);
  const step = run?.answers.length ?? 0;
  const finished = step === 4;
  const { lens, questions, flips } = deck(today);
  const prediction = run?.prediction ?? 0;
  const correct = finished && run?.answers[3] === prediction;
  const moveSide = (alternate ? 1 - prediction : prediction) as Side;
  const question = questions[Math.min(step, 3)];
  const order: Side[] = flips[Math.min(step, 3)] ? [1, 0] : [0, 1];
  const complete = journal.runs.filter(r => r.answers.length === 4);
  const hits = complete.filter(r => r.prediction === r.answers[3]).length;
  useEffect(() => {
    lock.current = false;
    if (run) stageHeading.current?.focus();
  }, [step, !!run]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(journal)); setStorageOk(true); } catch { setStorageOk(false); }
  }, [journal]);
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => { const s = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); setSeconds(s); if (s === 0) setDeadline(null); };
    tick(); const timer = window.setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [deadline]);
  function update(next: Run) { setJournal(j => saveRun(j, next)); }
  function choose(side: Side) {
    if (!run || lock.current || finished) return;
    lock.current = true;
    update(advance(run, side));
  }
  function erase() {
    setJournal({ runs: [] }); setAlternate(false); setDeadline(null); setSeconds(60); setCopyStatus(''); setManualShare(''); setErased(true);
  }
  async function share() {
    const text = `${zh ? '我和一个小算法下了一盘「下一手」。' : 'I played Next Move against a small algorithm.'}\n${correct ? (zh ? '它猜中了我的第四步。看完理由，有点被抓现行。' : 'It predicted my fourth choice. Its evidence made me pause.') : (zh ? '它猜错了。人类暂时保住了神秘感。' : 'It guessed wrong. Humanity retains some mystery.')}\n${zh ? '四次选择，换一个今天能用的新走法。' : 'Four choices. One new move to try today.'}\n${window.location.origin}${import.meta.env.BASE_URL}nextmove/`;
    try { await navigator.clipboard.writeText(text); setCopyStatus(zh ? '复制好了。找个棋友来对局。' : 'Copied. Invite a friend.'); setManualShare(''); }
    catch { setManualShare(text); setCopyStatus(zh ? '选中下面的文字即可复制。' : 'Select the text below to copy.'); }
  }
  return <div className="next-scroll"><main className="next-page">
    <header className="next-heading"><div><p className="next-eyebrow">NEXT MOVE / {zh ? '每日一局 · 下一手' : 'ONE SMALL DAILY GAME'}</p><h1>{zh ? <>你还没点。<br/><em>我先猜。</em></> : <>Your next move.<br/><em>I’ll guess first.</em></>}</h1><p>{zh ? '四次直觉选择。一个封好的预判。一招带回现实。' : 'Four instinctive choices. A sealed prediction. One move for real life.'}</p></div><div className="next-date"><span>{today.replaceAll('-', ' / ')}</span><strong>{zh ? '人类 vs 自己的惯性' : 'YOU vs YOUR AUTOPILOT'}</strong><small>{zh ? '约 60 秒 · 不用会下棋' : 'About 60 seconds · No chess skills needed'}</small></div></header>
    <div className="next-layout">
      <section className="next-card" aria-label={zh ? '下一手游戏' : 'Next Move game'}>
        <div className="next-card-top"><span>{zh ? '今日题眼' : 'TODAY’S LENS'} / {w(lens.name)}</span><span>{finished ? '04 / 04' : `${String(step).padStart(2, '0')} / 04`}</span></div>
        <div className="next-progress" aria-label={zh ? `已完成 ${step} 步，共 4 步` : `${step} of 4 moves complete`}>{[0, 1, 2, 3].map(n => <i key={n} className={n < step ? 'filled' : ''}/>)}</div>
        {!run ? <div className="next-intro"><span className="next-piece" aria-hidden="true">♞</span><h2 ref={stageHeading} tabIndex={-1}>{zh ? '这次，被研究的是你。' : 'This time, you’re the puzzle.'}</h2><p>{zh ? '前三步，我观察。第四步，我先把答案封好，再等你选。猜错也照样认账。' : 'I observe three choices. Before your fourth, I seal my guess. If I’m wrong, I own it.'}</p><button className="next-primary" onClick={() => { setErased(false); update({ date: today, answers: [], prediction: null }); }}>{zh ? '来，试着看穿我 ↗' : 'Try to read me ↗'}</button><p className="next-fine">{zh ? '不问星座，不收简历。人类已经填了太多表。' : 'No star sign. No résumé. Humanity has filled enough forms.'}</p></div> : !finished ? <div className="next-question" key={step}>
          <p className="next-eyebrow">{step < 3 ? (zh ? `第 ${step + 1} 手 · 凭直觉就好` : `MOVE ${step + 1} · TRUST YOUR FIRST REACTION`) : (zh ? '第 4 手 · 我的预判已封好' : 'MOVE 4 · MY GUESS IS SEALED')}</p>
          <h2 ref={stageHeading} tabIndex={-1}>{w(question.title)}</h2>
          <p className="next-question-hint">{zh ? '此刻更像你的，是哪一个？没有标准答案。' : 'Which feels more like you right now? There is no correct answer.'}</p>
          {step === 3 && <div className="next-seal"><span aria-hidden="true">✉</span><div><strong>{zh ? '已封存，不能改口。' : 'Sealed. No changing my story.'}</strong><p>{zh ? '你选完，再拆信。' : 'Choose, then open the envelope.'}</p></div></div>}
          <div className="next-choices">{order.map((side, i) => <button key={side} onClick={() => choose(side)}><span>{i === 0 ? 'A' : 'B'}</span><strong>{w(question.options[side])}</strong><span aria-hidden="true">↗</span></button>)}</div>
          <p className="next-fine">{zh ? '只聊这些小场景，不据此给你下人格结论。' : 'Small scenarios, not a personality verdict.'}</p>
        </div> : <div className="next-result">
          <p className="next-eyebrow">{zh ? '信封打开了' : 'ENVELOPE OPENED'} / {correct ? (zh ? '猜中' : 'MATCH') : (zh ? '猜错' : 'MISS')}</p>
          <h2 ref={stageHeading} tabIndex={-1}>{correct ? (zh ? '被看穿一手。不是被定义一生。' : 'One move read. No lifetime label.') : (zh ? '你赢了。算法先别急着统治世界。' : 'You win. World domination can wait.')}</h2>
          <div className="next-reveal"><div><span>{zh ? '我提前猜的' : 'MY SEALED GUESS'}</span><strong>{w(questions[3].options[prediction])}</strong></div><div><span>{zh ? '你真正选的' : 'YOUR ACTUAL CHOICE'}</span><strong>{w(questions[3].options[run.answers[3]])}</strong></div></div>
          <p className="next-insight">{w(lens.insight[prediction])}</p>
          {!correct && <p className="next-fine">{zh ? '第四步你换了走法。这说明场景会改变选择，我的概括有边界。' : 'You changed direction on move four. Context matters; my summary has limits.'}</p>}
          <details className="next-evidence"><summary>{zh ? '别装神。你凭什么这么猜？' : 'Show your work. Why that guess?'}</summary><p>{zh ? '前三步里，你有至少两步偏向' : 'At least two of your first three choices leaned toward'}「{w(lens.sides[prediction])}」。{zh ? '我把这个方向用在第四题；不读取鼠标、输入速度或其他页面。' : 'I applied that direction to question four. No mouse tracking, typing analysis, or other-page data.'}</p><ol>{run.answers.slice(0, 3).map((s, i) => <li key={i}>{w(questions[i].title)}<strong>→ {w(questions[i].options[s])}</strong></li>)}</ol><p>{zh ? '规则公开的本地小游戏，不是 AI 读心，也不是心理测评。' : 'A local game with open rules, not AI mind reading or a psychological assessment.'}</p></details>
          <div className="next-action"><p className="next-eyebrow">{zh ? '把主动权拿回来' : 'TAKE THE NEXT MOVE BACK'}</p><h3>{zh ? '给现实下一步。' : 'A move outside the game.'}</h3><p>{w(lens.moves[moveSide])}</p><button className="next-text-button" onClick={() => setAlternate(a => !a)}>{alternate ? (zh ? '回到给我的那一招 ↶' : 'Back to my suggested move ↶') : (zh ? '看看另一种走法 ⇄' : 'Try the other approach ⇄')}</button><div className="next-action-buttons"><button className="next-primary" disabled={deadline !== null} onClick={() => { setSeconds(60); setDeadline(Date.now() + 60000); }}>{deadline !== null ? `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` : seconds === 0 ? (zh ? '再留一分钟' : 'One more minute') : (zh ? '给我一分钟' : 'Give me one minute')}</button><button className="next-outline" aria-pressed={!!run.tried} onClick={() => update({ ...run, tried: !run.tried })}>{run.tried ? (zh ? '✓ 这招，我试了' : '✓ Tried it') : (zh ? '我试过了' : 'I tried it')}</button></div><p className="next-fine" role="status">{seconds === 0 ? (zh ? '一分钟到了。做多少都算，收工也行。' : 'One minute. Whatever you did counts. Stopping is fine.') : (zh ? '去做那件小事。计时可选，人生不按秒结算。' : 'Go try the small thing. The timer is optional.')}</p></div>
          <button className="next-text-button" onClick={share}>{zh ? '把这一局发给棋友 ↗' : 'Copy this round for a friend ↗'}</button><p className="next-fine" role="status">{copyStatus}</p>{manualShare && <textarea className="next-share" aria-label={zh ? '分享文字' : 'Share text'} readOnly value={manualShare} onFocus={e => e.currentTarget.select()}/>}
        </div>}
      </section>
      <aside className="next-side">
        <div className="next-board-wrap"><div className="next-side-label"><span>{zh ? '你的选择，正在留下形状' : 'YOUR CHOICES TAKE SHAPE'}</span><span>↗</span></div><div className="next-board" aria-hidden="true">{Array.from({ length: 36 }, (_, n) => { const row = Math.floor(n / 6), col = n % 6; const piece = row === 4 && col === 1 ? '♟' : row === 1 && col === 4 ? '♞' : ''; const trail = !!run && run.answers.some((a, i) => row === 4 - i && col === (a === 0 ? 2 : 3)); return <div key={n} className={`${(row + col) % 2 ? 'dark' : 'light'} ${trail ? 'trail' : ''}`}>{trail ? <span className="next-mark"/> : piece}</div>; })}</div><p>{zh ? '棋盘上怕被看穿。生活里，有时正需要这一眼。' : 'On the board, being read is a risk. Off it, a little recognition can help.'}</p><small>{zh ? '选择轨迹示意 · 不是真实棋局' : 'An illustration of your choices, not a chess position'}</small></div>
        <div className="next-memory"><p className="next-eyebrow">{zh ? '小算法的战绩' : 'THE LITTLE ALGORITHM’S RECORD'}</p><div className="next-stat"><strong>{hits}<span> / {complete.length}</span></strong><p>{zh ? '实际猜中 / 已完成对局' : 'Actual matches / completed rounds'}</p></div><p>{complete.length === 0 ? (zh ? '还没交手，不虚报战绩。' : 'No rounds yet. No invented score.') : (zh ? '只记这台浏览器里的实战。样本很小，别颁诺贝尔奖。' : 'Only rounds in this browser. A small sample; hold the Nobel Prize.')}</p>{complete.length > 0 && <div className="next-history">{complete.slice(0, 7).map(r => <div key={r.date}><time>{r.date.slice(5)}</time><span>{w(deck(r.date).lens.name)}</span><b>{r.prediction === r.answers[3] ? (zh ? '猜中' : 'Match') : (zh ? '猜错' : 'Miss')}</b></div>)}</div>}</div>
        <div className="next-tomorrow"><h3>{zh ? '明天换个问题。' : 'A different question tomorrow.'}</h3><p>{zh ? '每天换一组场景。不连签，不催更。错过一天，地球照常公转。' : 'A new set of scenarios each day. No streaks, no nagging. Miss a day; Earth keeps turning.'}</p><Link to="/improv">{zh ? '脑子下班了？去即兴局弹两下 →' : 'Brain off duty? Play some Improv →'}</Link><Link to="/">{zh ? '也看看人生的起始棋盘：机会地图 →' : 'Explore the starting board: Opportunity Map →'}</Link></div>
      </aside>
    </div>
    <footer className="next-footer"><p>{storageOk ? (zh ? '选择只保存在当前浏览器，最多 90 天；两个站点不互通。不登录，不上传。' : 'Choices stay in this browser, up to 90 daily entries. No login, no upload; sites do not sync.') : (zh ? '此浏览器未允许保存。可以继续玩，刷新后可能丢失进度。' : 'Storage is unavailable. You can still play; refreshing may lose progress.')}</p><button onClick={erase}>{zh ? '清空我的对局' : 'Clear my rounds'}</button><span role="status">{erased ? (zh ? '已清空。重新认识一下。' : 'Cleared. Let’s meet again.') : ''}</span></footer>
  </main></div>;
}
