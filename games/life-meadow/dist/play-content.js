// Version 0.2: authored game challenges and story branches. All values are fictional.
export const PATHS = [
  {id:'maker',name:'好奇工坊',icon:'✧',from:'探索',to:'创造',text:'探索 → 创造：额外 +0.5 连锁倍率。把问题做成作品。'},
  {id:'outdoor',name:'野外俱乐部',icon:'♧',from:'自然',to:'恢复',text:'自然 → 恢复：额外 +0.5 连锁倍率。留白也能拿下挑战。'},
  {id:'together',name:'温暖小队',icon:'♡',from:'社交',to:'联结',text:'社交 → 联结：额外 +0.5 连锁倍率。让人与人的关系成为力量。'}
];
export const LINKS = [
  {from:'探索',to:'创造',name:'灵感变作品',mult:.4},
  {from:'创造',to:'社交',name:'作品被看见',mult:.4},
  {from:'自然',to:'恢复',name:'动静有节奏',mult:.4},
  {from:'恢复',to:'探索',name:'蓄满好奇心',mult:.4},
  {from:'联结',to:'探索',name:'安心去探索',mult:.4},
  {from:'社交',to:'联结',name:'遇见后懂得',mult:.4}
];
export const CHAPTERS = [
  {name:'搭好家庭的小舞台',focus:'恢复',target:90,rule:'恢复牌每张额外 +6 基础星光。',quote:'我们能不能慢一点，把这些日子记下来？'},
  {name:'第一次作品展',focus:'创造',target:110,rule:'创造牌每张额外 +6 基础星光。',quote:'我想做一个只有我才会想到的东西。'},
  {name:'找到自己的小队',focus:'社交',target:125,rule:'社交牌每张额外 +6 基础星光；本章最后一年少1点时间。',quote:'一个人可以走，但和朋友一起好像更有趣。'},
  {name:'给世界一个问号',focus:'探索',target:140,rule:'探索牌每张额外 +6 基础星光；本章换牌免费。',quote:'如果答案还没有人知道呢？'},
  {name:'把节奏还给自己',focus:'恢复',target:155,rule:'年末负荷 ≤35：额外 +12 星光；>55：扣12。',quote:'我想把有些时间留给自己。'},
  {name:'我的启程作品集',focus:'创造',target:170,rule:'一年使用3种类型：额外 +12 星光。',quote:'我准备好了，但可能会走一条不一样的路。'}
];
export const PROJECTS = [
  {id:'scrapbook',start:0,name:'一本发现手册',tags:['探索','创造'],need:3,due:2,unlock:'wonder',text:'接下来两年累计打出3张探索/创造牌，做出一本属于家庭的发现手册。',success:'翻开那本被你们填满的手册，纸页里都是一起发现的世界。',miss:'手册里还有许多空白。这份礼物可以更小一点，也可以继续慢慢写。'},
  {id:'footprints',start:0,name:'一盒户外纪念',tags:['自然','社交'],need:3,due:2,unlock:'trail',text:'接下来两年累计打出3张自然/社交牌，把一起出门的日子装进纪念盒。',success:'叶子、小石头、车票。三岁生日那天，一整片世界被放在桌上。',miss:'盒子还没有装满，但第一片叶子已经有了自己的故事。'},
  {id:'observatory',start:6,name:'屋顶观星计划',tags:['探索','创造'],need:4,due:8,unlock:'telescope',text:'接下来两年累计打出4张探索/创造牌，完成小队的观星计划。',success:'调好最后一个旋钮，模糊的月亮终于清晰起来。“原来我们真的可以！”',miss:'望远镜还没有装好，孩子有点失落。你们一起商量，怎样面对没赶上的截止日期。'},
  {id:'band',start:6,name:'周末小乐队',tags:['创造','社交'],need:3,due:8,unlock:'encore',text:'接下来两年累计打出3张创造/社交牌，在社区演出一首自己的歌。',success:'开始时弹错了一个音，朋友们却跟着笑了。最后，全场一起打起节拍。',miss:'成员一直没凑齐。也许可以先把第一段旋律录下来，留给下一次重聚。'},
  {id:'repair',start:12,name:'把友谊修回来',tags:['联结','社交'],need:3,due:14,unlock:'letter',text:'接下来两年累计打出3张联结/社交牌，练习理解、边界和重新沟通。',success:'“我们可以意见不一样，但我还是想听你说。”那封信终于寄出去了。',miss:'有些关系需要更长时间。孩子学到的第一件事，是不用强迫彼此立刻和好。'},
  {id:'solo',start:12,name:'第一次独立出发',tags:['自然','探索'],need:4,due:14,unlock:'journey',text:'接下来两年累计打出4张自然/探索牌，为一次独立的小旅行做准备。',success:'路线、预算、求助方式都写好了。孩子出发前回头看了一眼，你挥了挥手。',miss:'准备还不充分。推迟出发也是自己的决定，计划没有因此失去意义。'}
];
export const SPECIAL_CARDS = [
  {id:'wonder',name:'装满问号的手册',tag:'探索',icon:'✧',time:1,cost:0,min:0,max:17,effect:{learning:6,agency:2},load:1,text:'兑现“发现手册”约定后解锁。轻巧的探索连锁起手。'},
  {id:'trail',name:'口袋里的远方',tag:'自然',icon:'♧',time:1,cost:0,min:0,max:17,effect:{health:5,joy:3},load:-2,text:'兑现“户外纪念”约定后解锁。把一整片自然装进口袋。'},
  {id:'telescope',name:'我们造的望远镜',tag:'创造',icon:'◎',time:2,cost:1,min:0,max:17,effect:{learning:7,agency:5},load:2,text:'兑现观星计划后解锁。探索之后打出，延续那次发现。'},
  {id:'encore',name:'再来一首',tag:'社交',icon:'♪',time:1,cost:1,min:0,max:17,effect:{bond:5,joy:5},load:1,text:'兑现乐队约定后解锁。一次演出开启新的朋友圈。'},
  {id:'letter',name:'终于寄出的信',tag:'联结',icon:'♡',time:1,cost:0,min:0,max:17,effect:{bond:6,agency:5},load:-4,text:'兑现友谊约定后解锁。帮助社交连锁落到理解。'},
  {id:'journey',name:'自己的第一张车票',tag:'探索',icon:'↗',time:1,cost:1,min:0,max:17,effect:{agency:7,learning:4},load:2,text:'兑现独立出发约定后解锁。下一程，自己来安排。'}
];
export const STORY_STARTS = [
 {id:'promise-0',age:0,title:'留给三岁的一份礼物',story:'你们决定给孩子留下一件由日常慢慢做成的礼物。选择会变成一个两年的约定；之后的行动，决定能否兑现。',projects:['scrapbook','footprints']},
 {id:'promise-6',age:6,title:'“我们也想做一件大事”',story:'孩子带回两个点子。时间只够认真做一个。你想支持哪一条路？',projects:['observatory','band']},
 {id:'promise-12',age:12,title:'青春期的一份请求',story:'孩子有一件想自己处理、又需要你支持的事。这一次，别急着替孩子给出答案。',projects:['repair','solo']}
];
