# 中国机会地图 · 人话版

> 努力很重要。出生地址也挺会抢戏。

六座城市、90 个区。选城市，拖动父母收入的位置，看看模型结果怎么变。
支持地图、同城排序、两区对比、搬家情景、中英切换和输入数据下载。

**所有成年结果都是模拟值。** 输入混合公开资料、人工评分与假设参数；没有用真实孩子的成年结果验证。地图不能预测个人收入，也不能证明搬家会带来某种收益。

- 新 GitHub Pages：<https://ericnotme.github.io/opportunity-atlas-china/plain/>
- 原版保留：<https://ericnotme.github.io/opportunity-atlas-china/>
- 模型说明：[METHODOLOGY.md](METHODOLOGY.md)
- X 宣传素材：[MARKETING.md](MARKETING.md)

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
