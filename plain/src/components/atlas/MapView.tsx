import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";
import { CITY_BY_ID } from "@/lib/atlas/cities";
import { outcomeColor, OUTCOME_DOMAIN, fixedScale } from "@/lib/atlas/colors";
import { DISTRICTS, districtsInCity } from "@/lib/atlas/districts";
import { formatOutcome } from "@/lib/atlas/format";
import { COPY } from "@/lib/atlas/i18n";
import { choroplethValue, modelDistrict, outcomeValue } from "@/lib/atlas/model";
import { useAtlas } from "@/lib/atlas/store";
import type { District } from "@/lib/atlas/types";

type DistrictGeo = import("geojson").FeatureCollection<import("geojson").Polygon | import("geojson").MultiPolygon, { adcode: string; name: string }>;

function extendBounds(bounds: { extend: (c: [number, number]) => void }, coords: unknown): void {
  if (!Array.isArray(coords) || coords.length === 0) return;
  if (typeof coords[0] === "number") {
    bounds.extend(coords as [number, number]);
    return;
  }
  for (const c of coords) extendBounds(bounds, c);
}

let workerConfigured = false;

async function loadMapLibre() {
  const maplibregl = await import("maplibre-gl");
  await import("maplibre-gl/dist/maplibre-gl.css");
  if (!workerConfigured) {
    const { default: workerUrl } = await import(
      "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"
    );
    maplibregl.setWorkerUrl(workerUrl);
    workerConfigured = true;
  }
  return maplibregl;
}

export function MapView() {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const {
    cityId,
    outcome,
    parentPct,
    gender,
    selected,
    hover,
    lang,
    setHover,
    setSelected,
  } = useAtlas();
  const t = COPY[lang];

  const modeled = useMemo(() => {
    const map = new Map<string, ReturnType<typeof modelDistrict>>();
    for (const d of DISTRICTS) map.set(d.adcode, modelDistrict(d, parentPct, gender));
    return map;
  }, [parentPct, gender]);

  const colorBy = useMemo(() => {
    const [lo, hi] = OUTCOME_DOMAIN[outcome];
    const scale = fixedScale(lo, hi);
    const out: Record<string, string> = {};
    for (const d of DISTRICTS) {
      out[d.adcode] = outcomeColor(scale(choroplethValue(modeled.get(d.adcode)!, outcome)));
    }
    return out;
  }, [modeled, outcome]);

  const colorByRef = useRef(colorBy);
  colorByRef.current = colorBy;
  const setHoverRef = useRef(setHover);
  setHoverRef.current = setHover;
  const setSelectedRef = useRef(setSelected);
  setSelectedRef.current = setSelected;

  useEffect(() => {
    if (!host.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const maplibregl = await loadMapLibre();
      if (cancelled || !host.current) return;
      const map = new maplibregl.Map({
        container: host.current,
        style: {
          version: 8,
          sources: {},
          layers: [
            {
              id: "bg",
              type: "background",
              paint: { "background-color": "#101114" },
            },
          ],
        },
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        fadeDuration: 0,
      });
      map.touchZoomRotate.disableRotation();
      mapRef.current = map;

      const pick = (e: MapLayerMouseEvent) => {
        const feats = map.queryRenderedFeatures(e.point, { layers: ["district-fill"] });
        return feats[0]?.properties?.adcode as string | undefined;
      };
      map.on("mousemove", "district-fill", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const ad = pick(e);
        if (ad) setHoverRef.current(ad);
      });
      map.on("mouseleave", "district-fill", () => {
        map.getCanvas().style.cursor = "";
        setHoverRef.current(null);
      });
      map.on("click", "district-fill", (e) => {
        const ad = pick(e);
        if (ad) setSelectedRef.current(ad);
      });
      map.on("load", () => {
        map.resize();
        setMapReady(true);
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    let cancelled = false;

    const loadCity = async () => {
      const maplibregl = await loadMapLibre();
      const res = await fetch(CITY_BY_ID[cityId].geo);
      const geo = (await res.json()) as DistrictGeo;
      if (cancelled || !mapRef.current) return;
      if (map.getLayer("district-hi")) map.removeLayer("district-hi");
      if (map.getLayer("district-line")) map.removeLayer("district-line");
      if (map.getLayer("district-fill")) map.removeLayer("district-fill");
      if (map.getSource("districts")) map.removeSource("districts");

      map.addSource("districts", {
        type: "geojson",
        data: geo,
        promoteId: "adcode",
      });
      const match: unknown[] = ["match", ["get", "adcode"]];
      for (const [ad, col] of Object.entries(colorByRef.current)) match.push(ad, col);
      match.push("#5a5048");
      map.addLayer({
        id: "district-fill",
        type: "fill",
        source: "districts",
        paint: {
          "fill-color": match as never,
          "fill-opacity": 0.94,
          "fill-color-transition": { duration: 180, delay: 0 },
        },
      });
      map.addLayer({
        id: "district-line",
        type: "line",
        source: "districts",
        paint: { "line-color": "#101114", "line-width": 1.05 },
      });
      map.addLayer({
        id: "district-hi",
        type: "line",
        source: "districts",
        paint: {
          "line-color": "#eeeae2",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "active"], false],
            2.6,
            ["boolean", ["feature-state", "hover"], false],
            1.7,
            0,
          ],
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      for (const f of geo.features) extendBounds(bounds, f.geometry.coordinates);
      const fit = () => {
        if (cancelled) return;
        map.resize();
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: { top: window.innerWidth < 768 ? 230 : 28, bottom: 28, left: 28, right: 28 },
            duration: 0,
            maxZoom: 12.8,
            linear: true,
          });
        }
      };
      fit();
      map.once("idle", fit);
    };

    void loadCity();
    return () => {
      cancelled = true;
    };
  }, [cityId, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("district-fill")) return;
    const match: unknown[] = ["match", ["get", "adcode"]];
    for (const [ad, col] of Object.entries(colorBy)) match.push(ad, col);
    match.push("#5a5048");
    map.setPaintProperty("district-fill", "fill-color", match as never);
  }, [colorBy]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getSource("districts")) return;
    for (const d of districtsInCity(cityId)) {
      try {
        map.setFeatureState(
          { source: "districts", id: d.adcode },
          { hover: hover === d.adcode, active: selected === d.adcode },
        );
      } catch {
        /* source may have swapped */
      }
    }
  }, [hover, selected, cityId]);

  const tipDistrict: District | undefined = hover
    ? DISTRICTS.find((d) => d.adcode === hover)
    : undefined;
  const tipModel = tipDistrict ? modeled.get(tipDistrict.adcode) : undefined;

  return (
    <div className="relative h-full min-h-0 w-full">
      <div ref={host} className="h-full w-full" />
      {tipDistrict && tipModel && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-line bg-ink-2/92 px-3 py-2 text-sm shadow-lg backdrop-blur-sm md:left-auto md:right-3">
          <div className="font-display text-sm text-paper">
            {lang === "zh" ? tipDistrict.nameZh : tipDistrict.nameEn}
          </div>
          <div className="mt-0.5 tabular-nums text-paper-2">
            {formatOutcome(outcomeValue(tipModel, outcome), outcome, cityId)}
          </div>
          <div className="text-sm text-muted">{t.outcomes[outcome]}</div>
        </div>
      )}
    </div>
  );
}
