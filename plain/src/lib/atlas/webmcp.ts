import { useEffect } from "react";
import { useAtlas } from "./store";
import { CITIES } from "./cities";
import { districtsInCity } from "./districts";
import { modelDistrict } from "./model";
import type { CityId } from "./types";

type Context = { registerTool: (tool: { name: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean }; execute: (input: unknown) => unknown }, options: { signal: AbortSignal }) => void | Promise<void> };
export function AtlasTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "configure_opportunity_scenario",
        description: "Set the visible map's city and parent income percentile; return simulated district outcomes, not observed predictions.",
        inputSchema: { type: "object", properties: { city: { type: "string", enum: CITIES.map(c => c.id) }, parentPercentile: { type: "integer", minimum: 10, maximum: 99 } }, required: ["city", "parentPercentile"], additionalProperties: false },
        annotations: { readOnlyHint: false },
        execute(input) {
          if (!input || typeof input !== "object") throw new Error("Expected city and parentPercentile.");
          const {city, parentPercentile} = input as Record<string, unknown>;
          if (!CITIES.some(c => c.id === city) || typeof parentPercentile !== "number" || !Number.isInteger(parentPercentile) || parentPercentile < 10 || parentPercentile > 99 || Object.keys(input).some(k => !["city", "parentPercentile"].includes(k))) throw new Error("Invalid city or parent percentile (10–99).");
          const state = useAtlas.getState();
          state.setCity(city as CityId);
          state.setParentPct(parentPercentile);
          const updated = useAtlas.getState();
          return { city: updated.cityId, parentPercentile: updated.parentPct, simulated: true, districts: districtsInCity(updated.cityId).map(d => ({ id: d.adcode, name: d.nameZh, incomePosition: modelDistrict(d, updated.parentPct, updated.gender).childRank })) };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Optional browser capability. */ }
    return () => lifecycle.abort();
  }, []);
  return null;
}
