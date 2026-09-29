export const STATS={learning:'探索力',health:'身心活力',bond:'亲密联结',agency:'自主性',joy:'幸福感'};
export const CITIES=['成都','上海','北京','深圳','广州','香港'];
// All values are authored game parameters, not measurements of real places.
export const AREAS=[
{id:'garden',name:'花园里',type:'自然社区',icon:'♧',rent:3,commute:0,education:55,income:48,ownership:62,green:90,support:65,care:60,desc:'绿地就在楼下，运动与休息更容易。',bonus:{health:2,joy:1}},
{id:'library',name:'书院街',type:'学习社区',icon:'▤',rent:6,commute:0,education:85,income:72,ownership:53,green:45,support:55,care:70,desc:'好书和同伴很多，预算也更紧。',bonus:{learning:2}},
{id:'oldtown',name:'榕树巷',type:'熟人社区',icon:'⌂',rent:2,commute:0,education:48,income:42,ownership:76,green:50,support:90,care:50,desc:'熟悉的邻里能接住一个疲惫的家庭。',bonus:{bond:2,joy:1}},
{id:'harbor',name:'新港湾',type:'开放社区',icon:'◇',rent:4,commute:1,education:72,income:80,ownership:35,green:65,support:50,care:85,desc:'体验多、服务近，但通勤占用一个时间点。',bonus:{agency:2,learning:1}}
];
export const TRAITS=[
{id:'curious',name:'好奇的小问号',text:'探索类活动的探索力收益 +2；密集安排更容易疲惫。'},
{id:'sensitive',name:'细腻的观察者',text:'联结类活动的幸福收益 +2；高负荷时更需要恢复。'},
{id:'active',name:'停不下的探险家',text:'自然类活动的活力收益 +2；安静活动也能慢慢练习。'},
{id:'social',name:'小小连接家',text:'社交类活动的联结收益 +2；独处同样有价值。'}
];
export const CARDS=[
{id:'read',name:'一起读一本书',tag:'探索',icon:'▤',time:2,cost:1,min:0,max:17,effect:{learning:4,bond:2},load:1,text:'故事讲完了，问题才刚刚开始。'},
{id:'park',name:'公园里的下午',tag:'自然',icon:'♧',time:2,cost:0,min:0,max:17,effect:{health:4,joy:2},load:-3,text:'今天的日程表上，写着一片草地。'},
{id:'talk',name:'认真听你说',tag:'联结',icon:'♡',time:1,cost:0,min:0,max:17,effect:{bond:4,agency:2},load:-3,text:'不急着给答案，也是一种陪伴。'},
{id:'sleep',name:'守住睡眠时间',tag:'恢复',icon:'☾',time:2,cost:0,min:0,max:17,effect:{health:5,joy:1},load:-7,text:'明天的世界，睡醒了再探索。'},
{id:'play',name:'没有说明书的玩耍',tag:'创造',icon:'✧',time:2,cost:1,min:0,max:10,effect:{learning:3,agency:3,joy:2},load:-1,text:'纸盒也可能是一艘宇宙飞船。'},
{id:'friends',name:'约朋友来玩',tag:'社交',icon:'☺',time:2,cost:1,min:0,max:17,effect:{bond:3,joy:3,agency:1},load:-2,text:'分享积木，也分享一点小秘密。'},
{id:'food',name:'一起做顿饭',tag:'恢复',icon:'◒',time:2,cost:1,min:0,max:17,effect:{health:4,bond:2,agency:1},load:-2,text:'厨房不只生产晚饭，也生产回忆。'},
{id:'museum',name:'博物馆奇遇',tag:'探索',icon:'◎',time:2,cost:2,min:3,max:17,effect:{learning:6,agency:1},load:2,text:'原来很久以前，人们也仰望星空。'},
{id:'music',name:'第一段旋律',tag:'创造',icon:'♪',time:2,cost:2,min:3,max:17,effect:{learning:2,agency:3,joy:4},load:2,text:'先听见自己的节拍。'},
{id:'sport',name:'一起上运动场',tag:'自然',icon:'↟',time:2,cost:1,min:3,max:17,effect:{health:6,joy:2},load:1,text:'输了球，也赢了一个畅快的下午。'},
{id:'puzzle',name:'解开数学谜题',tag:'探索',icon:'∞',time:2,cost:1,min:6,max:17,effect:{learning:7,agency:1},load:4,text:'找到规律的那一刻，眼睛亮了。'},
{id:'tutor',name:'目标式辅导',tag:'探索',icon:'＋',time:3,cost:4,min:6,max:17,effect:{learning:10},load:8,text:'进步很快，记得给大脑留出喘息。'},
{id:'craft',name:'造一个小东西',tag:'创造',icon:'⚒',time:2,cost:2,min:3,max:17,effect:{agency:5,learning:3,joy:2},load:2,text:'从“能不能”到“我做出来了”。'},
{id:'volunteer',name:'为社区做件事',tag:'社交',icon:'✿',time:2,cost:0,min:6,max:17,effect:{bond:4,agency:4},load:1,text:'世界因为一点点行动而不同。'},
{id:'choice',name:'这次由你决定',tag:'联结',icon:'↗',time:1,cost:0,min:3,max:17,effect:{agency:5,bond:2},load:1,text:'决定去哪里，也学习承担选择。'},
{id:'hike',name:'走一条陌生小路',tag:'自然',icon:'△',time:3,cost:2,min:3,max:17,effect:{health:5,agency:4,joy:3},load:1,text:'目的地不一定比沿途重要。'},
{id:'rest',name:'允许一个空白日',tag:'恢复',icon:'—',time:1,cost:0,min:0,max:17,effect:{joy:4,health:2},load:-6,text:'今天没有作品，只有生活。'},
{id:'project',name:'自己的小课题',tag:'探索',icon:'⌘',time:3,cost:2,min:9,max:17,effect:{learning:6,agency:6},load:5,text:'研究一个没有标准答案的问题。'},
{id:'journal',name:'写给自己的日记',tag:'联结',icon:'≋',time:1,cost:0,min:9,max:17,effect:{agency:4,joy:2},load:-4,text:'情绪有了名字，就更容易被理解。'},
{id:'mentor',name:'遇见一位引路人',tag:'社交',icon:'☆',time:2,cost:2,min:9,max:17,effect:{learning:4,agency:4,bond:2},load:1,text:'有人看见了自己还没发现的可能。'},
{id:'job',name:'尝试一份小工作',tag:'社交',icon:'▣',time:3,cost:-2,min:15,max:17,effect:{agency:7,bond:1},load:4,text:'体验责任，也体验赚钱的不容易。'},
{id:'support',name:'寻找专业支持',tag:'恢复',icon:'✚',time:2,cost:3,min:0,max:17,effect:{health:5,bond:3,joy:2},load:-8,text:'需要帮助时，家庭不必独自承担。'},
{id:'garden',name:'照顾一盆植物',tag:'自然',icon:'❋',time:1,cost:1,min:0,max:17,effect:{health:2,agency:2,joy:2},load:-2,text:'有些成长，比日历慢一点。'},
{id:'stage',name:'站上小小舞台',tag:'创造',icon:'✦',time:2,cost:2,min:6,max:17,effect:{agency:6,joy:3,bond:1},load:4,text:'紧张和勇气，可以同时存在。'}
];
export const RELICS=[
{id:'pages',name:'翻不完的书页',icon:'▤',text:'每打出一张探索牌，额外探索力 +2。',tag:'探索'},
{id:'roots',name:'稳稳的根',icon:'♡',text:'每打出一张联结牌，额外幸福感 +2。',tag:'联结'},
{id:'shoes',name:'沾泥的小鞋',icon:'♧',text:'自然牌额外活力 +2，压力再减1。',tag:'自然'},
{id:'blank',name:'留白的勇气',icon:'☾',text:'恢复牌额外自主性 +2。',tag:'恢复'},
{id:'bridge',name:'朋友的桥',icon:'⌁',text:'社交牌额外探索力 +2。',tag:'社交'},
{id:'spark',name:'小小火花',icon:'✧',text:'创造牌额外自主性 +2。',tag:'创造'},
{id:'rhythm',name:'家庭的节奏',icon:'≋',text:'每年自然恢复压力额外 -3。',tag:'平衡'},
{id:'time',name:'慢一点的时钟',icon:'◷',text:'每年可用时间 +1。',tag:'时间'},
{id:'fund',name:'雨天储蓄罐',icon:'▣',text:'每年收入 +2。',tag:'经济'},
{id:'network',name:'邻里的长椅',icon:'⌂',text:'社区被动成长收益 ×1.5。',tag:'社区'},
{id:'mix',name:'万花筒',icon:'❖',text:'同年打出三种类型，所有成长额外 +1。',tag:'组合'},
{id:'trust',name:'我相信你',icon:'↗',text:'“这次由你决定”与“自己的小课题”额外自主性 +3。',tag:'自主'}
];
export const EVENTS=[
{id:'rain',min:0,max:17,title:'雨天的秘密基地',story:'原定的出游泡汤了。孩子用毯子搭了一座城堡，邀请你做第一个访客。',choices:[{label:'住进这座城堡',effect:{bond:3,joy:3},load:-2,cost:0},{label:'一起寻找雨的规律',effect:{learning:4,agency:1},load:0,cost:0}]},
{id:'neighbor',min:0,max:17,title:'隔壁传来一声问候',story:'熟悉的邻居愿意帮忙照看一会儿。人与人的信任，也是一种公共设施。',choices:[{label:'接受善意，也约好边界',effect:{bond:3,health:2},load:-3,cost:0},{label:'邀请邻居一起吃饭',effect:{bond:5,joy:2},load:0,cost:1}]},
{id:'broken',min:0,max:17,title:'坏掉的洗衣机',story:'生活有时不是一张成长牌，而是一张维修单。',choices:[{label:'花钱维修，保住日常',effect:{joy:1},load:1,cost:3},{label:'暂用公共洗衣房',effect:{agency:1},load:4,cost:0}]},
{id:'illness',min:0,max:17,title:'一段需要休息的日子',story:'孩子身体不适，原先的计划需要调整。这里是虚构事件，不代表真实发病概率。',choices:[{label:'及时评估，调整安排',effect:{health:3,bond:2},load:-2,cost:2},{label:'先休息并持续观察，必要时求助',effect:{health:1,bond:1},load:0,cost:0}]},
{id:'libraryday',min:3,max:17,title:'社区开放日',story:'新来的馆员愿意为孩子推荐一本稍微有点难的书。',choices:[{label:'和孩子一起慢慢读',effect:{learning:4,bond:2},load:1,cost:0},{label:'让孩子选自己喜欢的',effect:{agency:4,joy:2},load:0,cost:0}]},
{id:'friendmove',min:3,max:17,title:'好朋友要搬家了',story:'孩子第一次发现，有些告别并不是因为谁做错了什么。',choices:[{label:'认真地办一次告别',effect:{bond:4,joy:1},load:-1,cost:1},{label:'约定继续写信',effect:{bond:3,agency:2},load:0,cost:0}]},
{id:'competition',min:6,max:17,title:'一张比赛报名表',story:'老师递来一份邀请。孩子有点兴奋，也有一点担心。',choices:[{label:'一起准备，把经历放在名次前',effect:{learning:5,agency:2},load:4,cost:2},{label:'问问孩子是不是真的想参加',effect:{agency:4,bond:3},load:-1,cost:0}]},
{id:'comparison',min:6,max:17,title:'别人家的进度条',story:'家长群晒出很多证书。孩子问：“我是不是落后了？”',choices:[{label:'一起看自己的成长',effect:{agency:4,bond:3},load:-3,cost:0},{label:'选一项真心想练的技能',effect:{learning:4,agency:2},load:2,cost:1}]},
{id:'lost',min:6,max:17,title:'没有赢下的那一局',story:'认真准备了很久，结果却不如期待。孩子暂时不想说话。',choices:[{label:'先陪着，等愿意再复盘',effect:{bond:4,joy:2},load:-3,cost:0},{label:'一起找一个能改的小地方',effect:{learning:3,agency:3},load:0,cost:0}]},
{id:'income',min:0,max:17,title:'家庭收入出现波动',story:'一个项目暂停了。今年要重新安排家庭支出。',choices:[{label:'用储蓄保住生活节奏',effect:{bond:2},load:1,cost:4},{label:'暂时精简支出，一起商量',effect:{agency:2,bond:1},load:4,cost:0}]},
{id:'talent',min:3,max:17,title:'一个没被安排的兴趣',story:'你发现孩子把很多时间花在一件自己特别喜欢的小事上。',choices:[{label:'给这个兴趣留点空间',effect:{agency:5,joy:3},load:-1,cost:0},{label:'一起找相关的书和伙伴',effect:{learning:3,bond:2,agency:2},load:1,cost:2}]},
{id:'online',min:9,max:17,title:'屏幕里的新世界',story:'孩子想在网络社群里发布自己的作品。',choices:[{label:'一起了解隐私和边界',effect:{agency:4,learning:2,bond:1},load:1,cost:0},{label:'先和熟悉的朋友小范围分享',effect:{bond:3,joy:2},load:-1,cost:0}]},
{id:'exam',min:12,max:17,title:'重要考试之前',story:'这场考试很重要，但它不等于整个未来。',choices:[{label:'保留休息，梳理关键知识',effect:{learning:4,health:2},load:1,cost:0},{label:'加一轮集中训练',effect:{learning:7,joy:-2},load:6,cost:2}]},
{id:'boundary',min:12,max:17,title:'请先敲门',story:'孩子开始希望有自己的空间。这是关系进入下一阶段的信号。',choices:[{label:'一起约定新的家庭边界',effect:{agency:5,bond:3},load:-2,cost:0},{label:'定期聊天，其他时间尊重独处',effect:{agency:4,joy:3},load:-2,cost:0}]},
{id:'future',min:15,max:17,title:'和你想象中不同的未来',story:'孩子说出了一个与你的计划很不一样的方向。',choices:[{label:'一起研究可行路径',effect:{agency:5,learning:3,bond:2},load:1,cost:0},{label:'安排一次真实体验',effect:{agency:6,joy:3},load:2,cost:2}]},
{id:'mental',min:15,max:17,title:'当日常开始变得困难',story:'孩子说最近睡眠、情绪和注意状态明显改变。单凭这些表现不能诊断精神分裂症或任何疾病；故事关注如何获得支持。',choices:[{label:'陪伴孩子寻求专业评估',effect:{bond:4,health:3},load:-5,cost:2},{label:'联系可信赖的社区服务一起求助',effect:{bond:3,health:2},load:-3,cost:0}]}
];
export const COMBOS=[
{id:'reading',name:'世界在书页间打开',needs:['探索','联结'],bonus:{learning:3,bond:2},text:'探索 × 联结'},
{id:'restore',name:'会休息，才走得远',needs:['自然','恢复'],bonus:{health:3,joy:2},text:'自然 × 恢复'},
{id:'voice',name:'找到自己的声音',needs:['创造','社交'],bonus:{agency:3,joy:2},text:'创造 × 社交'},
{id:'secure',name:'安心的冒险家',needs:['自然','联结'],bonus:{agency:2,health:2},text:'自然 × 联结'},
{id:'maker',name:'从好奇到创造',needs:['探索','创造'],bonus:{learning:2,agency:3},text:'探索 × 创造'}
];
export const MISSIONS=[{id:'balance',name:'有根，也有翅膀',text:'18岁时五项成长都达到50。'},{id:'explore',name:'保护那一点好奇',text:'探索力达到75，幸福感达到50。'},{id:'connect',name:'被爱，也能独立',text:'亲密联结与自主性都达到70。'},{id:'vital',name:'把日子过得有光',text:'活力和幸福都达到70，压力不高于45。'}];
