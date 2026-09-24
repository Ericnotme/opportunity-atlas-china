import * as Slider from "@radix-ui/react-slider";
import { CITIES } from "@/lib/atlas/cities";
import { COPY } from "@/lib/atlas/i18n";
import { useAtlas } from "@/lib/atlas/store";
import type { Gender, OutcomeId } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

const OUTCOMES: OutcomeId[] = ["hhIncome", "college", "topQuintile", "homeown"];
const GENDERS: Gender[] = ["all", "female", "male"];

export function Controls({ compact = false }: { compact?: boolean }) {
  const { cityId, setCity, outcome, setOutcome, parentPct, setParentPct, gender, setGender, lang } =
    useAtlas();
  const t = COPY[lang];

  return (
    <div className={cn("flex flex-col gap-4", compact && "gap-3")}>
      <div>
        <div className="mb-2 text-sm tracking-wide text-muted uppercase">
          {lang === "zh" ? "城市" : "City"}
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCity(c.id)}
              className={cn(
                "shrink-0 rounded-sm px-2.5 py-1.5 text-sm",
                cityId === c.id
                  ? "bg-paper text-ink"
                  : "bg-paper/6 text-paper-2 hover:bg-paper/10",
              )}
            >
              {lang === "zh" ? c.nameZh : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm tracking-wide text-muted uppercase">{t.parent}</span>
          <span className="font-display text-lg tabular-nums text-paper">{parentPct}%</span>
        </div>
        <Slider.Root
          value={[parentPct]}
          min={10}
          max={99}
          step={1}
          onValueChange={(v) => setParentPct(v[0] ?? 25)}
          className="relative flex h-6 w-full touch-none items-center"
        >
          <Slider.Track className="relative h-1 w-full rounded-full bg-paper/15">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb aria-label={t.parent} aria-valuetext={`${parentPct}%`} className="block size-4 rounded-full bg-paper shadow outline-none focus-visible:ring-2 focus-visible:ring-accent" />
        </Slider.Root>
        <p className="mt-2 text-sm leading-snug text-faint">{t.parentHint}</p>
      </div>

      <div>
        <div className="mb-2 text-sm tracking-wide text-muted uppercase">{t.outcome}</div>
        <div className="grid grid-cols-2 gap-1">
          {OUTCOMES.map((o) => (
            <button
              key={o}
              onClick={() => setOutcome(o)}
              className={cn(
                "rounded-sm px-2 py-2 text-left text-sm leading-snug",
                outcome === o
                  ? "bg-paper text-ink"
                  : "bg-paper/6 text-paper-2 hover:bg-paper/10",
              )}
            >
              {t.outcomes[o]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm tracking-wide text-muted uppercase">{t.gender}</div>
        <div className="flex gap-1">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={cn(
                "flex-1 rounded-sm py-1.5 text-sm",
                gender === g ? "bg-paper text-ink" : "bg-paper/6 text-paper-2 hover:bg-paper/10",
              )}
            >
              {g === "all" ? t.genderAll : g === "female" ? t.genderF : t.genderM}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Legend() {
  const { lang } = useAtlas();
  const t = COPY[lang];
  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span>{t.low}</span>
      <div
        className="h-2 flex-1 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #a8382a 0%, #c47656 25%, #e8e0d4 50%, #7a94a6 75%, #2d5a7a 100%)",
        }}
      />
      <span>{t.high}</span>
    </div>
  );
}

export function MobileControls() {
  const { cityId, setCity, outcome, setOutcome, parentPct, setParentPct, lang } = useAtlas();
  const t = COPY[lang];
  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {CITIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCity(c.id)}
            className={cn(
              "h-9 shrink-0 rounded-sm px-2.5 text-sm",
              cityId === c.id ? "bg-paper text-ink" : "bg-paper/8 text-paper-2",
            )}
          >
            {lang === "zh" ? c.nameZh : c.nameEn}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-sm tabular-nums text-muted">{t.parent} {parentPct}%</span>
        <Slider.Root
          value={[parentPct]}
          min={10}
          max={99}
          step={1}
          onValueChange={(v) => setParentPct(v[0] ?? 25)}
          className="relative flex h-9 w-full touch-none items-center"
        >
          <Slider.Track className="relative h-1 w-full rounded-full bg-paper/15">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb aria-label={t.parent} aria-valuetext={`${parentPct}%`} className="block size-4 rounded-full bg-paper" />
        </Slider.Root>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {OUTCOMES.map((o) => (
          <button
            key={o}
            onClick={() => setOutcome(o)}
            className={cn(
              "h-9 shrink-0 rounded-sm px-2.5 text-sm",
              outcome === o ? "bg-paper text-ink" : "bg-paper/8 text-paper-2",
            )}
          >
            {t.outcomes[o]}
          </button>
        ))}
      </div>
    </div>
  );
}
