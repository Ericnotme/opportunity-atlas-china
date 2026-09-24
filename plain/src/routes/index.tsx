import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/atlas/Chrome";
import { Controls, Legend, MobileControls } from "@/components/atlas/Controls";
import { DistrictPanel, MobileDistrictSheet } from "@/components/atlas/DistrictPanel";
import { MapView } from "@/components/atlas/MapView";
import { COPY } from "@/lib/atlas/i18n";
import { useAtlas } from "@/lib/atlas/store";
import "@/improv.css";
import "@/nextmove.css";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const lang = useAtlas((s) => s.lang);
  const t = COPY[lang];

  return (
    <Chrome>
      <div className="flex h-full min-h-0">
        <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-line bg-ink-2 p-4 md:flex">
          <p className="font-display text-xl font-semibold leading-relaxed text-paper">{t.tagline}</p>
          <Link to="/nextmove" className="improv-entry next-entry"><strong>{lang === "zh" ? "你还没点。我先猜。" : "Your next move. I’ll guess first."}</strong><span>{lang === "zh" ? "四次选择，让算法猜你的下一手。猜错也认账。" : "Four choices. One sealed prediction. A small daily game."}</span></Link>
          <Link to="/improv" className="improv-entry"><strong>{lang === "zh" ? "命运没空？你来即兴。" : "Fate is busy. Your solo."}</strong><span>{lang === "zh" ? "抽一张今日签，弹一段爵士。每天给生活开个小差。" : "A daily prompt and jazz you can play. Take a small detour."}</span></Link>
          <Controls />
          <div className="mt-auto space-y-3">
            <Legend />
            <p className="text-sm leading-relaxed text-faint">{t.modeled}</p>
          </div>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1">
          <MapView />
          <div className="absolute inset-x-0 top-0 z-10 border-b border-line bg-ink/92 p-2 backdrop-blur-sm md:hidden">
            <p className="mb-2 px-1 text-sm text-paper">{t.tagline}</p>
            <MobileControls />
            <div className="mt-2 px-1">
              <Legend />
            </div>
          </div>
          <Link to="/nextmove" className="improv-mobile-entry next-entry"><span>{lang === "zh" ? "你还没点。我先猜。" : "Your next move. I’ll guess first."}</span><span>{lang === "zh" ? "下一手 ↗" : "Next Move ↗"}</span></Link>
          <MobileDistrictSheet />
        </div>

        <aside className="atlas-desktop-panel">
          <DistrictPanel />
        </aside>
      </div>
    </Chrome>
  );
}
