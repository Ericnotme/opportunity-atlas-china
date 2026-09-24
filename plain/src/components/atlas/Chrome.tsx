import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/atlas/i18n";
import { useAtlas } from "@/lib/atlas/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "map" as const },
  { to: "/nextmove", key: "nextmove" as const },
  { to: "/improv", key: "improv" as const },
  { to: "/rankings", key: "ranks" as const },
  { to: "/compare", key: "compare" as const },
  { to: "/methodology", key: "about" as const },
];

export function Chrome({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useAtlas();
  const t = COPY[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <header className="flex shrink-0 items-center gap-3 border-b border-line flex-wrap px-3 py-3 md:px-5">
        <Link to="/" className="min-w-0">
          <div className="font-display text-[15px] leading-tight tracking-tight md:text-lg">
            {t.app}
          </div>
          <div className="truncate text-sm tracking-wide text-muted md:text-sm">
            {t.appEn}
          </div>
        </Link>
        <nav className="ml-auto flex max-w-full flex-wrap items-center gap-0.5 md:gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "rounded-sm px-2 py-2 text-sm md:px-3 md:text-sm",
                pathname === n.to
                  ? "bg-paper/10 text-paper"
                  : (n.key === "improv" || n.key === "nextmove") ? "text-accent hover:bg-paper/10" : "text-muted hover:text-paper",
              )}
            >
              {t[n.key]}
            </Link>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="ml-1 min-w-11"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            aria-label="Language"
          >
            {lang === "zh" ? "EN" : "中"}
          </Button>
        </nav>
      </header>
      <div className="shrink-0 border-b border-line px-3 py-2 text-sm text-muted md:px-5">{pathname.includes("/nextmove") ? (lang === "zh" ? "下一手 · 猜的是选择，不定义你是谁。" : "Next Move · A guess about a choice, not a label for you.") : pathname.includes("/improv") ? (lang === "zh" ? "今日即兴 · 缺席不扣分，人生已经有考勤了。" : "Daily improv · No streaks. Life already has attendance sheets.") : t.modeled}</div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
