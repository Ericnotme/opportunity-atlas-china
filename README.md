# China Opportunity Atlas · 中国机会地图

**Live site:** https://ericnotme.github.io/opportunity-atlas-china/

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
