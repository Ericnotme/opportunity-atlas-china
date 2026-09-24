# 中国机会地图 · 下一手

**棋友，欢迎。先下这一手，代码可以晚点看。**

[♞ 玩「下一手」](https://ericnotme.github.io/opportunity-atlas-china/plain/nextmove/) · [打开机会地图](https://ericnotme.github.io/opportunity-atlas-china/plain/) · [去即兴局](https://ericnotme.github.io/opportunity-atlas-china/plain/improv/) · [ChatGPT 网站](https://china-opportunity-map-plain.weijiaxian.chatgpt.site)

> 棋盘上怕被看穿。生活里，有时正需要这一眼。

这不是一个只谈下棋的网站。它想借棋友熟悉的三个问题，聊聊生活：**你从哪里开局？你习惯怎么走？下一步能不能换个走法？**

### 第一次来，从这里玩

| 你有多少空闲 | 去哪里 | 会发生什么 |
| --- | --- | --- |
| 一分钟 | [下一手](https://ericnotme.github.io/opportunity-atlas-china/plain/nextmove/) | 做三次直觉选择。小算法提前封好第四步的预判，再等你拆穿它。猜中有证据，猜错认账。最后带走一个现实里的小实验。 |
| 三分钟 | [机会地图](https://ericnotme.github.io/opportunity-atlas-china/plain/) | 看六座城市、90 个区。拖动家庭起点，比较模型里的差距。努力很重要，出生地址也挺会抢戏。 |
| 想喘口气 | [人生即兴局](https://ericnotme.github.io/opportunity-atlas-china/plain/improv/) | 抽一张有小行动的今日签，再用四个键弹一段爵士。命运没空，你来即兴。 |

### 我为什么做这个

我想做出一种让人忍不住会心一笑的体验：像在现场爵士乐里，突然踩对了那个拍子，身体比脑子先快乐起来。

爵士是这种体验的比喻，也真的成了一个保留下来的小功能。新的「下一手」想找另一种快乐：**“它居然注意到了这个；原来我还能这样选。”**

如果它能帮你理解一点起点差异、发现一个选择习惯，或者只是在糟糕的一天里松一口气，就算没白做。

造福全人类的计划很大。先让点进来的你少拧巴一分钟。

### 每天来一局，缺席不扣分

「下一手」每天换一组场景，围绕确定与探索、自己与他人、继续与退出、思考与行动。24 组每日题目顺序循环；你的选择和真实猜中次数只存在当前浏览器。无需登录，没有连续签到惩罚。

前三步多数选择决定第四步的预判，选第四步前已经锁定；不是偷偷改答案，也不是 AI 读心或心理测评。棋盘是选择轨迹的示意，不是可解的棋题。

**地图的成年结果全是模拟值。** 输入混合公开资料、人工评分与模型假设，没有真实孩子成年结果的验证，不能预测个人收入，也不能证明搬家收益。[读模型说明](plain/METHODOLOGY.md)。

**是否能让人每天自愿回来，仍是待验证的产品假设。** 如果你愿意反馈，欢迎在本仓库告诉我：哪一步有意思，哪一句像废话，哪一个按钮想让它消失。

[新版代码与运行说明](plain/README.md) · [X 宣传文案](plain/MARKETING.md) · [原版网站](https://ericnotme.github.io/opportunity-atlas-china/)

<details>
<summary>给想看代码和公式的棋友：原版技术说明</summary>

District-level interactive atlas of how childhood neighborhoods in **Shanghai, Beijing, Shenzhen, Guangzhou, Chengdu and Hong Kong** shape modeled household income at age 35.

A research-prototype counterpart to Chetty, Friedman, Hendren, Jones & Porter’s [Opportunity Atlas](https://www.opportunityatlas.org).

> China does **not** publish parent–child linked tax records at neighborhood scale. Colors are a structural mapping from public district covariates — not an official statistic. See [METHODOLOGY.md](METHODOLOGY.md).

## What you can do

- Choropleth of 90 districts, colored on a **fixed** child-rank scale (dragging parent percentile shifts the whole map)
- Filters: city, parent income percentile (Chetty’s headline is P25), gender, outcome
- Click a district for quality index, covariates, and a Chetty–Hendren childhood-exposure moving experiment
- Rank table and district-vs-district comparison
- Bilingual UI (中文 / English)
- Downloadable covariate CSV (`public/data/districts.csv`)

## Stack

Vite · React 19 · TypeScript · TanStack Router · Tailwind v4 · MapLibre GL · Zustand

Static GitHub Pages build (`base: /opportunity-atlas-china/`).

## Model (short)

```
Q = 0.28 school + 0.16 university + 0.16 inverse-poverty
  + 0.12 income-mix + 0.12 high-skill jobs
  + 0.08 hukou / school inclusion + 0.08 transit

R = 50 + ρ_city (p − 50) + θ(p) (Q − 0.5)·100 + γ_gender
θ(p) = 0.22 + 0.28 (1 − p/100)
```

ρ is calibrated to published urban-China IGE (~0.40–0.46 from CFPS/CHIP). θ(p) is larger for poorer parents.

## Using this repo in an application

Point reviewers at:

1. This README + [METHODOLOGY.md](METHODOLOGY.md)
2. [`src/lib/atlas/model.ts`](src/lib/atlas/model.ts)
3. [`public/data/districts.csv`](public/data/districts.csv)
4. The [live map](https://ericnotme.github.io/opportunity-atlas-china/)

## Develop

```bash
npm install
npm run dev
```

Production build for GitHub Pages:

```bash
npm run build
```


</details>
