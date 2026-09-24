export type Words = [string, string];
export type Side = 0 | 1;
export type Question = { title: Words; options: [Words, Words] };
export type Lens = { name: Words; sides: [Words, Words]; insight: [Words, Words]; moves: [Words, Words]; questions: Question[] };
const q = (zh: string, en: string, a: Words, b: Words): Question => ({ title: [zh, en], options: [a, b] });
export const LENSES: Lens[] = [
  { name: ['确定，还是可能', 'Certainty or possibility'], sides: [['先确定', 'Secure it'], ['先探索', 'Explore it']],
    insight: [
      ['这三步里，你更常先要一个确定的落点。也许你缺的不是勇气，而是一种输得起的试法。', 'In these three moves, you preferred a firm landing. A small, affordable experiment may help more than a pep talk.'],
      ['这三步里，你更常给未知留座位。可能性很迷人；它偶尔也会冒充进度。', 'In these three moves, you left room for the unknown. Possibility is lovely. Sometimes it impersonates progress.']],
    moves: [
      ['选一件一直在等「准备好」的小事。把试错成本压到一分钟，先试一次，不承诺第二次。', 'Pick something waiting until you feel ready. Make the cost one minute. Try once; promise no second attempt.'],
      ['把一个新点子变成一个看得见的东西：一句开头、一张草图或一个文件。今天先不另开新坑。', 'Turn one idea into something visible: a first sentence, a sketch, or a file. Let that be enough for today.']],
    questions: [
      q('轮到你走。一个稳稳得分，一个局面很新。', 'Your move: a safe point or a new position?', ['先把这分拿了', 'Take the point'], ['我想看看新局面', 'Explore the position']),
      q('突然空出一小时，谁先获得使用权？', 'A free hour appears. Who gets it?', ['那个确定能做完的任务', 'A task I can finish'], ['那个没用但想试的点子', 'An odd idea I want to try']),
      q('菜单上有老朋友，也有名字像密码的新菜。', 'The menu has a favorite and something cryptic.', ['胃不参加风险投资', 'My stomach wants certainty'], ['让胃见见世面', 'Let my stomach explore']),
      q('一个免费小实验，随时能退出。你先想什么？', 'A free experiment you can quit anytime. First thought?', ['先看看具体怎么做', 'Check how it works'], ['进去看看再说', 'Step in and see']),
      q('朋友推荐一条新路线，可能多走十分钟。', 'A friend suggests a route that may take ten extra minutes.', ['熟路也有熟路的尊严', 'The usual route is fine'], ['绕一下，说不定有猫', 'Take a detour. Maybe cats']),
      q('你有一个不成熟的作品。现在怎么办？', 'Your unfinished creation needs a next move.', ['再打磨一个细节', 'Polish one detail'], ['先给一个人看看', 'Show one person']),
    ] },
  { name: ['自己的棋，别人的眼光', 'Your move, their opinion'], sides: [['先照顾场面', 'Keep the peace'], ['先说自己的', 'Say my piece']],
    insight: [
      ['这三步里，你更常先照顾场面。你在替关系留余地；也可以给自己的愿望留一个座位。', 'In these three moves, you made room for others. You can leave one seat for your own wishes, too.'],
      ['这三步里，你更常先把自己的意思摆出来。清楚是优点；给对方一个入口，话会走得更远。', 'In these three moves, you made your position clear. Give the other person an opening and it may travel further.']],
    moves: [
      ['在一个无关紧要的小选择里，说一句「我更想……」。不写八百字的辩护词。', 'In one low-stakes choice, say “I’d prefer…” No eight-page defense required.'],
      ['找一个小分歧，先问「你最在意的是哪一点？」听完再走你的那一步。', 'For one small disagreement, ask “What matters most to you here?” Listen before your next move.']],
    questions: [
      q('复盘时，大家夸了一步你不太认同的棋。', 'Everyone praises a move you question in the review.', ['先听完大家的理由', 'Hear everyone out first'], ['把我的疑问摆出来', 'Put my question on the board']),
      q('朋友问去哪吃饭，你其实已经有答案。', 'A friend asks where to eat. You have a preference.', ['先问问他想吃什么', 'Ask what they want first'], ['直接提我的那家', 'Suggest my pick']),
      q('群里方案定了，你刚想到另一种办法。', 'The group has a plan. You thought of an alternative.', ['先按大家的来', 'Go with the group'], ['还是说出来让大家选', 'Offer it as an option']),
      q('今天只剩一小时，有人来约你帮个小忙。', 'One hour left today. Someone asks a small favor.', ['先看看能不能挤进去', 'See if I can fit it in'], ['先保留自己的安排', 'Keep my own plan first']),
      q('别人给你选了一个「很适合你」的头像。', 'Someone chose an avatar that is “so you.”', ['先用两天，领个情', 'Try it to appreciate the gesture'], ['我还是喜欢我选的', 'I prefer my own pick']),
      q('棋友想再来一局，你有点想收工。', 'Your opponent wants another game. You feel done.', ['再来一盘也行', 'One more is okay'], ['今天到这，明天再战', 'Call it here; play tomorrow']),
    ] },
  { name: ['已经投入，要不要继续', 'Already invested. Continue?'], sides: [['再给一次机会', 'Give it another chance'], ['给自己一个出口', 'Take an exit']],
    insight: [
      ['这三步里，你更常给旧选择一次机会。坚持有价值；但已经花掉的时间，不一定能替下一分钟投票。', 'In these three moves, you gave old choices another chance. Persistence matters; spent time need not vote on your next minute.'],
      ['这三步里，你更常给自己留出口。会停很难得；提前定一个停止条件，可以让退出更从容。', 'In these three moves, you left yourself an exit. A stopping rule set in advance can make leaving less ambiguous.']],
    moves: [
      ['挑一件低成本的小事，问：「如果今天第一次遇见它，我还会选吗？」只写答案，暂时不用做大决定。', 'Pick a small commitment. Ask: “If I found this today, would I choose it?” Write the answer. No big decision required.'],
      ['给一个小尝试定边界：「再试一次；如果仍然……就停。」让未来的自己少开一次庭。', 'Set a boundary for one small attempt: “Try once more; if it still…, stop.” Spare your future self a trial.']],
    questions: [
      q('这套开局练了很久，最近总不顺手。', 'You practiced this opening for ages. It feels awkward lately.', ['再找一盘好棋研究', 'Study one good example'], ['换一套试试手感', 'Try another opening']),
      q('一本书读了三分之一，还是不喜欢。', 'A third of the way through a book, you still dislike it.', ['也许后面就好看了', 'Maybe it gets better'], ['书签到此退休', 'Retire the bookmark']),
      q('排了十分钟的队，旁边有个不用排的选择。', 'Ten minutes in a queue. An alternative has no wait.', ['都等到这里了', 'I have come this far'], ['下一分钟还属于我', 'The next minute is still mine']),
      q('整理旧收藏，看到半年前的「必看」。', 'An old bookmark says “must read.” It is six months old.', ['再给它留个位置', 'Keep a place for it'], ['允许它自由离去', 'Set it free']),
      q('活动过半，你发现自己毫无兴趣。', 'Halfway through an event, you have no interest.', ['听完，可能有转折', 'Stay; there may be a turn'], ['安静离开去散步', 'Quietly leave for a walk']),
      q('一个小点子反复改，还是没什么起色。', 'A small idea has survived many revisions, without progress.', ['最后换一个角度', 'Try one more angle'], ['把精力留给新点子', 'Save energy for a new idea']),
    ] },
  { name: ['再想一想，还是先落一子', 'Think again or make a move'], sides: [['多看一步', 'Think one move further'], ['先走一小步', 'Take one small step']],
    insight: [
      ['这三步里，你更常先多看一步。准备可以降低失误，也可能把「开始」藏得越来越深。', 'In these three moves, you looked ahead first. Preparation can prevent mistakes; it can also hide the starting line.'],
      ['这三步里，你更常先落一子。行动会带回信息；先定一个想验证的问题，信息会更有用。', 'In these three moves, you started first. Action brings information; one clear question makes that information useful.']],
    moves: [
      ['把一件小事的「研究一下」改成「做出最粗糙的第一行」。用一分钟交一份丑作业。', 'Replace “research it” with “make the roughest first line.” Spend one minute submitting something imperfect.'],
      ['开始一件小事前，写一句「我这次只想知道……」。一分钟后，检查有没有得到这个答案。', 'Before a small task, write “This time I only want to find out…” In one minute, check whether you learned it.']],
    questions: [
      q('一个看起来不错的着法，还没算到最后。', 'A move looks promising. You have not calculated it fully.', ['再算一个变化', 'Calculate one more line'], ['友谊局，走了就知道', 'Friendly game. Play and learn']),
      q('想学一个新东西，第一步是什么？', 'You want to learn something new. First step?', ['找一份靠谱的路线图', 'Find a reliable roadmap'], ['先照着做一个小东西', 'Make one tiny thing']),
      q('要写一段短介绍，光标开始盯着你。', 'A blinking cursor wants your short introduction.', ['先把思路理顺', 'Organize my thoughts'], ['先写句烂的压压惊', 'Write a bad first sentence']),
      q('试用一个新工具，没有人考你。', 'You are trying a new tool. No exam at the end.', ['看看使用说明', 'Read the instructions'], ['点两下看看会发生什么', 'Click and see what happens']),
      q('一个可撤回的小决定，你迟迟没按确认。', 'A small reversible decision waits for confirmation.', ['再比一比两个选项', 'Compare the options once more'], ['先选一个，观察一天', 'Pick one; observe for a day']),
      q('棋友给你推荐了新玩法。', 'A chess friend suggests a new variant.', ['先弄明白规则和套路', 'Learn the rules and patterns'], ['边下一盘边学', 'Learn by playing one game']),
    ] },
];

export const STORAGE_KEY = 'opportunity-nextmove-v1';
export type Run = { date: string; answers: Side[]; prediction: Side | null; tried?: boolean };
export type Journal = { runs: Run[] };
export function validDate(date: unknown): date is string {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
}
export function deck(date: string) {
  if (!validDate(date)) throw new Error('Invalid date');
  const day = Math.floor(Date.parse(date) / 86400000);
  const lensIndex = ((day % LENSES.length) + LENSES.length) % LENSES.length;
  const cycle = Math.floor(day / LENSES.length);
  const lens = LENSES[lensIndex];
  const offset = ((cycle % 6) + 6) % 6;
  return { lens, lensIndex, questions: [0, 2, 4, 1].map((n) => lens.questions[(offset + n) % 6]), flips: [0, 1, 2, 3].map((n) => (day + n) % 2 === 0) };
}
export function predict(answers: Side[]): Side {
  if (answers.length < 3) throw new Error('Three moves required');
  return answers.slice(0, 3).reduce<number>((sum, n) => sum + n, 0) >= 2 ? 1 : 0;
}
export function advance(run: Run, answer: Side): Run {
  if (!validRun(run) || run.answers.length >= 4 || (answer !== 0 && answer !== 1)) throw new Error('Invalid move');
  const answers = [...run.answers, answer];
  // Commit after move three, before the fourth answer exists. Never revise on reveal.
  return { ...run, answers, prediction: answers.length === 3 ? predict(answers) : run.prediction };
}
export function validRun(value: unknown): value is Run {
  if (!value || typeof value !== 'object') return false;
  const r = value as Run;
  if (!validDate(r.date) || !Array.isArray(r.answers) || r.answers.length > 4 || !r.answers.every(a => a === 0 || a === 1)) return false;
  if (r.tried !== undefined && (typeof r.tried !== 'boolean' || r.answers.length !== 4)) return false;
  return r.answers.length < 3 ? r.prediction === null : r.prediction === predict(r.answers);
}
export function parseJournal(raw: string | null): Journal {
  try {
    const parsed = JSON.parse(raw || '{}');
    if (!Array.isArray(parsed?.runs)) return { runs: [] };
    const dates = new Set<string>();
    return { runs: parsed.runs.filter(validRun).filter((r: Run) => { if (dates.has(r.date)) return false; dates.add(r.date); return true; }).sort((a: Run, b: Run) => b.date.localeCompare(a.date)).slice(0, 90) };
  } catch { return { runs: [] }; }
}
export function saveRun(journal: Journal, run: Run): Journal {
  if (!validRun(run)) throw new Error('Invalid run');
  return parseJournal(JSON.stringify({ runs: [run, ...journal.runs.filter(r => r.date !== run.date)] }));
}
