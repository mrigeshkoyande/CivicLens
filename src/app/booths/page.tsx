"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, BOOTHS_COLLECTION } from "@/lib/firebase";
import { POLLING_BOOTHS } from "@/lib/mock-data";
import type { PollingBooth } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function waitStyle(w: number) {
  if (w <= 10) return { bg: "bg-[#daf19e] text-[#445614] border border-[#b9cf80]", label: "Low Wait",    icon: "bolt",            dot: "bg-[#445614]" };
  if (w <= 25) return { bg: "bg-[#ffdcc4] text-[#924c00] border border-[#ffb780]", label: "Medium Wait", icon: "schedule",        dot: "bg-[#fc9842]" };
  return             { bg: "bg-error-container text-error border border-error/30",  label: "High Wait",   icon: "hourglass_empty", dot: "bg-error" };
}

const MAP_STYLES = [
  { featureType: "poi",     elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon",     stylers: [{ visibility: "off" }] },
  { featureType: "water",   elementType: "geometry.fill",   stylers: [{ color: "#c6dbc7" }] },
  { featureType: "road",    elementType: "geometry.stroke", stylers: [{ color: "#d4c5a3" }] },
  { featureType: "landscape",elementType:"geometry.fill",   stylers: [{ color: "#f1e9d6" }] },
];

const MAP_CENTER = { lat: 19.076, lng: 72.877 }; // Mumbai default

// ─── Map component (only renders when API key present) ───────────────────────
function BoothMap({
  booths, selected, onSelect,
}: { booths: PollingBooth[]; selected: PollingBooth | null; onSelect: (b: PollingBooth) => void }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [infoOpen, setInfoOpen] = useState<string | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Pan to selected booth
  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
      setInfoOpen(selected.id);
    }
  }, [selected]);

  if (!apiKey) {
    // Fallback: OpenStreetMap iframe
    const coord = selected ?? booths[0];
    return (
      <div className="w-full h-full relative">
        <iframe
          title="Polling Booth Map"
          className="w-full h-full border-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coord?.lng - 0.02},${coord?.lat - 0.02},${coord?.lng + 0.02},${coord?.lat + 0.02}&layer=mapnik&marker=${coord?.lat},${coord?.lng}`}
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#f1e1be] border border-[#d4c5a3] text-[#594f34] text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">info</span>
          Add <code className="bg-white px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable Google Maps
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f4f3f3]">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[40px] animate-spin text-primary">progress_activity</span>
          <span className="text-sm font-medium">Loading map…</span>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={selected ? { lat: selected.lat, lng: selected.lng } : MAP_CENTER}
      zoom={14}
      onLoad={onLoad}
      options={{ styles: MAP_STYLES, disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false, fullscreenControl: true }}
    >
      {booths.map((booth) => (
        <Marker
          key={booth.id}
          position={{ lat: booth.lat, lng: booth.lng }}
          onClick={() => { onSelect(booth); setInfoOpen(booth.id); }}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: selected?.id === booth.id ? "#445614" : "#72674b",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: selected?.id === booth.id ? 2.2 : 1.6,
            anchor: new google.maps.Point(12, 24),
          }}
        />
      ))}

      {infoOpen && booths.find((b) => b.id === infoOpen) && (() => {
        const b = booths.find((booth) => booth.id === infoOpen)!;
        const ws = waitStyle(b.waitTime);
        return (
          <InfoWindow
            position={{ lat: b.lat, lng: b.lng }}
            onCloseClick={() => setInfoOpen(null)}
          >
            <div className="p-1 max-w-[220px]">
              <h4 className="font-bold text-sm text-gray-900 mb-1">{b.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{b.address}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${ws.bg}`}>{b.waitTime} min</span>
                {b.wheelchair && <span className="text-blue-600">♿ Accessible</span>}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center bg-green-700 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-green-800"
              >
                Get Directions →
              </a>
            </div>
          </InfoWindow>
        );
      })()}
    </GoogleMap>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type Filter = "Closest" | "Fastest Queue" | "Accessible";

export default function BoothsPage() {
  const { show } = useToast();
  const [booths, setBooths]     = useState<PollingBooth[]>(POLLING_BOOTHS);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>("Closest");
  const [selected, setSelected] = useState<PollingBooth>(POLLING_BOOTHS[0]);
  const [search, setSearch]     = useState("");

  // ── Firestore live listener ─────────────────────────────────────────────────
  useEffect(() => {
    let unsub = () => {};
    try {
      if (!db) { setTimeout(() => setLoading(false), 0); return; }
      const q = query(collection(db, BOOTHS_COLLECTION), orderBy("name"));
      unsub = onSnapshot(q,
        (snap) => {
          if (!snap.empty) {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PollingBooth));
            setBooths(data);
            setSelected(data[0]);
            show("Live booth data loaded from Firebase!", "success", "cloud_done");
          }
          setLoading(false);
        },
        () => {
          // Firebase not configured — use mock data silently
          setLoading(false);
        }
      );
    } catch {
      setTimeout(() => setLoading(false), 0);
    }
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered + searched list ────────────────────────────────────────────────
  const displayed = (() => {
    let list = [...booths];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q));
    }
    if (filter === "Accessible")   list = list.filter((b) => b.wheelchair);
    if (filter === "Fastest Queue") list = list.sort((a, b) => a.waitTime - b.waitTime);
    return list;
  })();

  const getDirections = (b: PollingBooth) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.address)}`, "_blank");
  };

  const ws = waitStyle(selected.waitTime);

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-[400px] bg-white flex flex-col h-[55%] md:h-full border-b md:border-b-0 md:border-r border-[#c6c8b7] z-10 order-2 md:order-1 shrink-0 overflow-hidden shadow-[2px_0_16px_rgba(68,86,20,0.04)]">

        {/* Header */}
        <div className="p-5 border-b border-[#e2e2e2] bg-[#f9f9f9] shrink-0">
          <h2 className="text-xl font-bold text-primary mb-0.5">My Polling Booth</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            {loading ? "Loading live booth data…" : `${displayed.length} booths found · Live data`}
          </p>

          {/* Search */}
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#76786a]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c6c8b7] bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm text-on-surface placeholder:text-[#76786a] outline-none transition-all"
              placeholder="Search by name or address…"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76786a] hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(["Closest", "Fastest Queue", "Accessible"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-[#e8e8e8] text-on-surface-variant border border-[#c6c8b7] hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {f === "Closest" ? "near_me" : f === "Fastest Queue" ? "speed" : "accessible"}
                </span>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant gap-2">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              <span className="text-sm">Loading…</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant p-6 text-center">
              <span className="material-symbols-outlined text-[40px]">search_off</span>
              <p className="text-sm font-medium">No booths match your search</p>
              <button onClick={() => setSearch("")} className="text-xs text-primary font-bold hover:underline">Clear search</button>
            </div>
          ) : (
            <ul className="p-3 space-y-2">
              {displayed.map((booth, i) => {
                const bws = waitStyle(booth.waitTime);
                const isSelected = selected.id === booth.id;
                return (
                  <li key={booth.id}>
                    <button
                      onClick={() => { setSelected(booth); }}
                      className={`w-full text-left rounded-2xl border p-4 transition-all hover:shadow-sm ${
                        isSelected
                          ? "bg-[#f1e1be]/30 border-primary shadow-sm"
                          : "bg-white border-[#e2e2e2] hover:border-[#c6c8b7]"
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            {i === 0 && filter === "Closest" && (
                              <span className="bg-[#fc9842] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Recommended</span>
                            )}
                            <h4 className="text-sm font-bold text-on-surface truncate">{booth.name}</h4>
                          </div>
                          <p className="text-xs text-on-surface-variant flex items-start gap-1">
                            <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">location_on</span>
                            <span className="line-clamp-2">{booth.address}</span>
                          </p>
                        </div>
                        <div className={`text-center px-2.5 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${bws.bg}`}>
                          <div className="text-lg font-black leading-none">{booth.waitTime}</div>
                          <div className="text-[9px] leading-none mt-0.5">min</div>
                        </div>
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
                            {booth.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#76786a]">schedule</span>
                            {booth.walkTime} walk
                          </span>
                          {booth.wheelchair && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <span className="material-symbols-outlined text-[14px]">accessible</span>
                            </span>
                          )}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${bws.dot}`} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* ── Map + Detail ── */}
      <section className="flex-1 relative order-1 md:order-2 h-[45%] md:h-full flex flex-col overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <BoothMap booths={displayed} selected={selected} onSelect={setSelected} />

          {/* Overlay: selected booth quick info */}
          <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:max-w-sm z-20 animate-slide-up">
            <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl md:rounded-2xl border border-[#c6c8b7] shadow-[0_8px_24px_rgba(68,86,20,0.12)] p-4">
              {/* Drag handle on mobile */}
              <div className="md:hidden w-10 h-1 bg-[#c6c8b7] rounded-full mx-auto mb-3" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="material-symbols-outlined text-primary text-[18px] icon-fill">where_to_vote</span>
                    <h3 className="text-sm font-bold text-on-surface truncate">{selected.name}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant pl-6">{selected.address}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${ws.bg}`}>
                  {selected.waitTime} min wait
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
                  {selected.distance} away
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {selected.walkTime} walk
                </span>
                {selected.wheelchair && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <span className="material-symbols-outlined text-[14px]">accessible</span>
                    Accessible
                  </span>
                )}
              </div>

              {/* Wait bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant mb-1">
                  <span>Current Queue</span>
                  <span className={ws.label}>{ws.label}</span>
                </div>
                <div className="h-2 bg-[#e2e2e2] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selected.waitTime <= 10 ? "bg-primary" : selected.waitTime <= 25 ? "bg-[#fc9842]" : "bg-error"
                    }`}
                    style={{ width: `${Math.min(100, (selected.waitTime / 45) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => getDirections(selected)}
                className="w-full bg-primary text-on-primary py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#536522] active:scale-[0.98] transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">navigation</span>
                Get Directions via Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
