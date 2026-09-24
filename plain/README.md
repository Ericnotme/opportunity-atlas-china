# 中国机会地图 · 人话版

> 努力很重要。出生地址也挺会抢戏。

六座城市、90 个区。选城市，拖动父母收入的位置，看看模型结果怎么变。
支持地图、同城排序、两区对比、搬家情景、中英切换和输入数据下载。

**所有成年结果都是模拟值。** 输入混合公开资料、人工评分与假设参数；没有用真实孩子的成年结果验证。地图不能预测个人收入，也不能证明搬家会带来某种收益。

- 新 GitHub Pages：<https://ericnotme.github.io/opportunity-atlas-china/plain/>
- 原版保留：<https://ericnotme.github.io/opportunity-atlas-china/>
- 模型说明：[METHODOLOGY.md](METHODOLOGY.md)
- X 宣传素材：[MARKETING.md](MARKETING.md)

## 新功能：人生即兴局

[打开即兴局](https://ericnotme.github.io/opportunity-atlas-china/plain/improv/)

每天选一种状态和 1 / 3 / 10 分钟，领取一张有实际小行动的「今日签」。
32 个核心任务，每个有三档大小；同一方向在八天内不重复核心任务。四个爵士键跟随合成伴奏的和弦，可以用 A S D F 或触屏演奏。

- 签文是创意游戏，不声称预测命运；不接收出生日期或其他敏感信息。
- 每天按设备本地日期换签；同日刷新保留已选任务。
- 可以记录「我试了」「再小一点」「今天先算了」，没有连续打卡奖励或惩罚。
- 最近两次都选缩小或跳过时，下一次默认建议一分钟。
- 记录仅存在当前浏览器，最多 90 份；两个部署域名不共享记录。
- 音乐在用户点击后才启动，提供音量控制，离开页面停止；没有外部音频素材或付费模型依赖。

验证：`node scripts/test-improv.mjs` 检查每日日期、任务轮换、输入损坏恢复、历史上限、任务缩小，以及音频调度和退出清理。构建与 TypeScript 检查另行通过。
浏览器自动化受当前环境的安全检查故障限制，手机实际排版、真实扬声器听感和 WebMCP 浏览器验证仍未实测。

产品假设：用户会为了「一点被理解的感觉 + 一个做得完的下一步 + 亲手演奏的即时反馈」回来。留存与快乐程度尚未做用户研究验证。

技术参考：[Web Audio 实践](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)、[浏览器本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)。

## 本地运行

```sh
npm ci
npm run dev
```

## 构建

```sh
npx tsc --noEmit
npm run build
```

默认部署在域名根目录。GitHub Pages 子目录构建：

```sh
ATLAS_BASE=/opportunity-atlas-china/plain/ npm run build
```

构建为三个子页面生成各自的入口文件，支持直接打开和刷新。

## 这次改变

- 把术语改成人话，压缩介绍和按钮文案。
- 使用黑白底色与蓝色强调，保留地图的高低值色阶。
- 全站显示模拟值提示，详细公式折叠。
- 跨币种不计算金额差；跨城不显示搬家折算。
- 六城收入排序使用模拟收入位置，避免混排人民币和港元金额。
- 保留原版数据和计算公式；不把文案改写包装成新的研究发现。

## 来源与贡献

基于 Ericnotme/opportunity-atlas-china 的 af7938c5e65585b38f3c9a7f8286bf009241f0bf 版本。
本版使用生成式 AI 辅助开发、编辑与插图。原有代码许可证见 LICENSE。
图片是概念插画，不是数据可视化。欢迎提交可核验的数据、错误报告与修正。
