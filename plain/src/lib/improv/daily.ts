export type Focus = 'breathe' | 'unstuck' | 'connect' | 'explore';
export type Minutes = 1 | 3 | 10;
export type Reaction = 'done' | 'smaller' | 'skip';
export type Entry = { date: string; focus: Focus; minutes: Minutes; city: string; reaction?: Reaction };
export type Journal = { version: 1; entries: Entry[]; focus: Focus; minutes: Minutes };
export const FOCI: { id: Focus; label: string; en: string }[] = [
  { id: 'breathe', label: '脑子太吵', en: 'Too much noise' },
  { id: 'unstuck', label: '有点卡住', en: 'Feeling stuck' },
  { id: 'connect', label: '想靠近人', en: 'Want connection' },
  { id: 'explore', label: '想偏个航', en: 'Need a detour' },
];
export const STORAGE_KEY = 'opportunity-improv-v1';
export const emptyJournal = (): Journal => ({version: 1, entries: [], focus: 'breathe', minutes: 3});
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function dayNumber(day: string): number {
  const [y,m,d] = day.split('-').map(Number);
  return Math.floor(Date.UTC(y,m-1,d)/86400000);
}
export function hash(value: string): number {
  let h = 2166136261;
  for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
const dateValid = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(dayNumber(v)) && new Date(dayNumber(v)*86400000).toISOString().slice(0,10) === v;
export function validEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const e = value as Entry;
  return dateValid(e.date) && FOCI.some(f => f.id === e.focus) && [1,3,10].includes(e.minutes) && ['shanghai','beijing','shenzhen','guangzhou','chengdu','hongkong'].includes(e.city) && (e.reaction === undefined || ['done','smaller','skip'].includes(e.reaction));
}
export function parseJournal(raw: string | null): Journal {
  try {
    const data = JSON.parse(raw ?? 'null');
    if (data?.version !== 1 || !Array.isArray(data.entries)) return emptyJournal();
    const byDay = new Map<string, Entry>();
    for (const e of data.entries) if(validEntry(e)) byDay.set(e.date, {date:e.date,focus:e.focus,minutes:e.minutes,city:e.city,...(e.reaction?{reaction:e.reaction}:{})});
    return { version: 1, entries: [...byDay.values()].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,90), focus: FOCI.some(f=>f.id===data.focus)? data.focus:'breathe', minutes: [1,3,10].includes(data.minutes)?data.minutes:3 };
  } catch { return emptyJournal(); }
}
export function saveEntry(journal: Journal, entry: Entry): Journal {
  if (!validEntry(entry)) throw new Error('Invalid daily entry');
  return {version:1, entries:[entry,...journal.entries.filter(e=>e.date!==entry.date)].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,90), focus:entry.focus, minutes:entry.minutes};
}
export function suggestedMinutes(journal: Journal): Minutes {
  return journal.entries.slice(0,2).length === 2 && journal.entries.slice(0,2).every(e=>e.reaction==='skip'||e.reaction==='smaller') ? 1 : journal.minutes;
}
type Mission = { title:string; en:string; steps:[string,string,string]; enSteps:[string,string,string] };
const mission = (title:string,en:string,steps:[string,string,string],enSteps:[string,string,string]): Mission => ({title,en,steps,enSteps});
export const MISSIONS: Record<Focus, Mission[]> = {
  breathe: [
    mission('给脑内董事会散个会','Dismiss your inner boardroom',['把最吵的一件事写成一句话。今天先不解决它。','写下三件占用脑子的事，只圈出今天真需要处理的一件。','用三分钟写下烦心事，余下时间只处理一件能结束的小事。'],['Write down one noisy thought. You do not have to solve it now.','List three concerns. Circle just one that needs attention today.','Spend three minutes listing concerns, then finish one small, manageable task.']),
    mission('暂停扮演一个很有用的人','Be briefly, gloriously unproductive',['看看窗外，找出三种颜色。','放下屏幕，观察身边五件平时不看的东西。','在安全舒服的地方坐一会儿，记录一个刚发现的小细节。'],['Look out and find three colors.','Put the screen down. Notice five usually invisible things.','Sit somewhere comfortable and safe. Write down one small detail you notice.']),
    mission('把今天从满分改成及格','Give today a passing grade',['写下：今天做到哪一件小事，就算可以了。','从待办里挑一项，把它缩成两分钟能开始的第一步。','完成那个最小版本，然后允许自己停下来。'],['Name one small thing that would make today good enough.','Choose a task and shrink its first step to two minutes.','Finish the smallest useful version, then let yourself stop.']),
    mission('让通知暂时失业','Give notifications a short break',['把手机翻过来，完整听完身边的一种声音。','三分钟只做一件事，慢慢喝水也算。','留十分钟给一件不需要向任何人展示的事。'],['Turn your phone over. Listen to one sound around you.','Do one thing for three minutes. Drinking water slowly counts.','Spend ten minutes on something you do not need to show anyone.']),
    mission('今天不申请优秀员工','Skip the employee-of-the-day contest',['松开咬紧的牙，换一个舒服的姿势。','整理触手可及的一小块地方，别升级成大扫除。','给自己腾出一块干净空间，坐下来做点喜欢的小事。'],['Unclench your jaw and find a comfortable position.','Clear one small surface. Do not turn it into a cleaning project.','Make one comfortable space, then spend a few minutes enjoying it.']),
    mission('把自责改成说明书','Trade the verdict for instructions',['把一句「我怎么又」改写成「下一步可以」。','写一条不带人身攻击的给自己的建议。','选一个小失误，只写事实、能改的事和下一步。'],['Turn one “Why am I like this?” into “My next step could be…”.','Write yourself one practical instruction without an insult.','Take a small mistake. Write only the facts, what can change, and the next step.']),
    mission('给生活留一段空拍','Leave a little silence in the track',['听这段伴奏，什么也不用点。','选一个喜欢的节奏，跟着轻轻点脚或手指。','听一会儿，然后记下今天你想少做的一件事。'],['Listen to the backing track. No tapping required.','Pick a rhythm and gently tap a finger or a foot.','Listen for a while, then name one thing you want to do less of today.']),
    mission('关掉一个并不存在的评委','Dismiss an imaginary judge',['问自己：这件小事，真的有人在打分吗？','做一件没人看见也值得做的小事。','给一个私人爱好十分钟，不拍照、不交作业也可以。'],['Ask: is anyone actually scoring this tiny task?','Do one small thing worth doing even without an audience.','Give a private hobby ten minutes. No post or proof needed.']),
  ],
  unstuck: [
    mission('先做一个合法的烂版本','Make a respectably bad first draft',['给卡住的事写一个很粗糙的标题。','写出最丑的前三句，禁止删改。','做一份只让你自己看懂的草稿，留一个明天能接上的句子。'],['Give your stuck project a rough title.','Write three ugly opening sentences. No deleting.','Make a draft only you need to understand. Leave a sentence to continue tomorrow.']),
    mission('把大象拆成一口饼干','Turn the mountain into a crumb',['写下这件事真正的第一个动作。','只打开需要的材料，把下一步放到眼前。','只做第一步。十分钟到了，可以停。'],['Name the very first physical action.','Open the material you need and put the next step in sight.','Do just the first step. Stop after ten minutes if you want.']),
    mission('给拖延起个艺名','Give procrastination a stage name',['给卡住的任务取个好笑的代号。','用这个代号写一个两分钟版本的任务。','做完这个小版本，再把任务名字改成过去式。'],['Give the stuck task a ridiculous codename.','Write a two-minute version of the task using its codename.','Finish that version and rename it in the past tense.']),
    mission('把完美踢出群聊','Remove perfection from the group chat',['写下「这次可以先不做」的一件事。','删掉一个不影响核心结果的要求。','用省下的时间完成一个能工作的最小版本。'],['Name one thing this version can do without.','Remove one requirement that does not affect the core result.','Use the saved time to finish a small working version.']),
    mission('给问题换个工位','Move the problem to another desk',['用小学生能听懂的话，重新写一遍问题。','假装朋友遇到这件事，给他写两句建议。','照其中一条建议试一次，记下发生了什么。'],['Rewrite the problem so a child could understand it.','Pretend a friend has this problem. Write two lines of advice.','Try one piece of that advice and note what happens.']),
    mission('向未来的自己交接一下','Leave tomorrow a decent handover',['留一句「下次从这里开始」。','把要用的文件或工具放到下次一眼能找到的位置。','做一个简短交接：做到哪、卡在哪、下一步是什么。'],['Leave one sentence: “Next time, start here.”','Put the needed file or tool where you will see it next time.','Write a short handover: done, stuck, and next step.']),
    mission('先证明能动，不证明伟大','Prove motion, not greatness',['完成一件小到不好意思写进简历的事。','选一项不用等别人回复的小事，开始它。','做完一个你能独立结束的小环节。'],['Finish something too small to put on a résumé.','Start one small task that does not depend on a reply.','Complete one small part you can finish on your own.']),
    mission('把「没时间」切成薄片','Slice “no time” a little thinner',['找一个能用一分钟结束的步骤。','给当前任务列三个小步骤，只做第一个。','用十分钟试一下，不必承诺做完整个项目。'],['Find one step that can end in a minute.','List three small steps and do only the first.','Try for ten minutes without committing to the whole project.']),
  ],
  connect: [
    mission('发一条不带 KPI 的问候','Send a greeting without a KPI',['在心里想一个最近想起的人。','给熟悉的人写一句具体的问候。要不要发，你决定。','如果对方愿意，听他讲一件小事，先不急着给建议。'],['Think of someone who has been on your mind.','Draft a specific greeting to someone you know. Sending is your choice.','If they are willing, listen to one small story before offering advice.']),
    mission('把「谢谢」升级成具体版本','Make “thanks” specific',['想起一个别人做过的小帮助。','写下「你上次做的那件事，帮了我什么」。','找个合适的机会表达感谢，不必写成获奖感言。'],['Recall a small thing someone did for you.','Write: “That thing you did helped me by…”.','Find a suitable moment to say thanks. No acceptance speech required.']),
    mission('暂时不当聊天客服','Stop being a conversational help desk',['给一句想回复的话，留出认真看完的时间。','问一个你真想知道答案的问题。','如果对方有空，让他把答案讲完，再轮到你。'],['Read a message carefully before planning your reply.','Ask one question you actually want answered.','If they have time, let them finish their answer before your turn.']),
    mission('把共同回忆从仓库拿出来','Take a shared memory off the shelf',['想起一件你们都觉得好笑的小事。','给熟悉的人写一句「突然想起那次……」。','找一段共同喜欢的内容，约一个双方方便的时间再聊。'],['Remember a small thing you both found funny.','Draft “I just remembered that time…” to someone you know.','Pick something you both like and suggest a mutually convenient time to talk.']),
    mission('夸人时别使用默认设置','Compliment with the defaults off',['找出一个你欣赏的具体细节。','把「你真厉害」换成「我喜欢你刚才如何……」。','在合适的情境下表达它，不要求对方回夸。'],['Notice one specific detail you appreciate.','Replace “You are great” with “I liked how you…”.','Express it when appropriate, without requiring a compliment in return.']),
    mission('向一个边界说你好','Say hello to a boundary',['写下一件你今天不想勉强答应的事。','给它写一句温和清楚的回复草稿。','如果有需要，选择合适的时机表达自己的安排。'],['Name one thing you do not want to reluctantly agree to today.','Draft a kind, clear response.','If needed, choose a suitable moment to explain your availability.']),
    mission('当一次无需预约的好队友','Be a low-drama teammate',['想想身边谁可能需要一个小帮助。','问一句「有件小事我能搭把手吗？」也可以先写在草稿里。','只在对方愿意时帮一个具体小忙，不包办他的人生。'],['Think of someone who might appreciate a small hand.','Ask—or draft—“Is there one small thing I can help with?”.','If they agree, help with that one thing. No life takeover.']),
    mission('给「有空再聚」一个小出口','Give “sometime” a small doorway',['想起一个你愿意见到的人。','写一个低压力的邀请，明确可以拒绝。','提出一个简单可行的安排，让对方有选择空间。'],['Think of someone you would enjoy seeing.','Draft a low-pressure invitation that is easy to decline.','Suggest one simple option and leave room for their preference.']),
  ],
  explore: [
    mission('在熟悉的地方当三分钟游客','Be a tourist in a familiar place',['找出眼前一个你从未注意的细节。','给这个细节起一个只有你知道的名字。','在安全熟悉的地方慢慢看一圈，记下三个新发现。'],['Find one nearby detail you have never noticed.','Give that detail a name only you know.','Look around somewhere safe and familiar. Note three new details.']),
    mission('给算法放个年假','Give the algorithm a day off',['想一个平时不会主动搜索的小问题。','查一条与你工作无关的小知识，优先看原始来源。','沿着这个问题多看一层，写下一个更好的问题。'],['Think of a tiny question you would not usually search for.','Look up a small fact unrelated to work, preferably at its original source.','Follow it one level deeper and write a better question.']),
    mission('去隔壁宇宙借一个习惯','Borrow a habit from next door',['想一个你欣赏的人的小习惯。','把这个习惯缩成今天能试的一步。','试一次，记录适不适合自己，不必加入什么人生流派。'],['Name a small habit of someone you admire.','Shrink it to one step you can try today.','Try it once and note whether it suits you. No new identity required.']),
    mission('把通勤从背景板叫醒','Wake up the background scenery',['回想常走的路上一个没留意的招牌。','下次安全停下来时，留意一处平时忽略的细节。','在熟悉、安全的路线附近慢走一小段；不方便出门就观察窗外。'],['Recall one overlooked sign on a familiar route.','When safely stopped, notice one detail you usually miss.','Take a short walk somewhere safe and familiar, or explore the view from a window.']),
    mission('开一家一分钟博物馆','Open a one-minute museum',['选一件身边的普通物品。','给它写一句一本正经的荒诞展品说明。','把三件小物品组成一个私人展览，给它取个名字。'],['Choose an ordinary object nearby.','Write one absurdly serious museum label for it.','Curate three small objects into a private exhibition and name it.']),
    mission('向无聊提出一个反问','Ask boredom a follow-up question',['找一件无聊的小事，问「如果反过来呢？」','给它想三个不必实用的替代玩法。','试一个安全、低成本的小变化，看看实际感觉。'],['Take a boring little routine and ask, “What if reversed?”.','Invent three alternatives that do not have to be useful.','Try one safe, inexpensive variation and notice how it feels.']),
    mission('用耳朵重新认识这座城','Meet your city through your ears',['闭嘴听一会儿，辨认三种声音。','给其中一种声音配一个想象中的乐器。','录在纸上：远处、近处、持续、突然。组成自己的城市曲谱。'],['Listen quietly and identify three sounds.','Assign an imaginary instrument to one of them.','Write down distant, close, steady and sudden sounds as a city score.']),
    mission('给今天藏一个彩蛋','Hide a small Easter egg in today',['写一句明天看到会笑的话。','把它放在自己明天容易看到的位置。','为明天的自己准备一个小惊喜，简单到不用花钱。'],['Write a line that might make tomorrow-you smile.','Put it where you will naturally see it tomorrow.','Prepare one small surprise for yourself that costs nothing.']),
  ],
};
const LINES = [
  ['宇宙今天不发通知。你可以自己开局。','The universe sent no memo. Start anyway.'],
  ['今日宜：小幅偏航。忌：把今天过成答辩。','A small detour is allowed. No thesis defense required.'],
  ['命运正在开会。趁它没空，做点自己的事。','Fate is in a meeting. Do something of your own.'],
  ['你的隐藏技能：在离谱里，留一点余地。','Your hidden skill: leaving a little room inside the absurd.'],
  ['今天的主线任务：别把自己活成待办列表。','Today’s main quest: be more than a to-do list.'],
  ['先别逆天改命。把接下来的三分钟改一下。','Before rewriting fate, edit the next three minutes.'],
  ['系统未分配奇迹。手动制造一个小的。','No miracle was assigned. Make a tiny one manually.'],
  ['运气没有客服。好在下一步还归你。','Luck has no help desk. Your next step is still yours.'],
  ['人生无法撤回。小实验可以重来。','Life has no unsend. Small experiments have retries.'],
  ['你不必状态拉满，才能开始一小段。','You do not need a full battery to play a little.'],
  ['今天允许跑调。先有自己的声音。','Off-key is allowed. Have a voice first.'],
  ['好消息：你不是报表。今天可以不同比增长。','Good news: you are not a spreadsheet. Growth is optional today.'],
];
export function dailyCard(entry: Entry) {
  const list=MISSIONS[entry.focus];
  const index=((dayNumber(entry.date)+hash(entry.focus))%list.length+list.length)%list.length;
  const task=list[index];
  const line=LINES[hash(`${entry.date}|${entry.city}|${entry.focus}`)%LINES.length];
  const step=entry.reaction==='smaller'||entry.minutes===1?0:entry.minutes===3?1:2;
  return {id:`${entry.focus}-${index}`, title:task.title, en:task.en, action:task.steps[step], enAction:task.enSteps[step], fortune:line[0], enFortune:line[1], tempo:entry.minutes===1?82:entry.minutes===3?96:108, seed:hash(entry.date+entry.city), minutes:step===0?1:entry.minutes};
}
