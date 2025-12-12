import React, { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, X } from "lucide-react";

// ✅ fix default marker icon (common issue in React builds)
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = new L.Icon({
  iconUrl: marker1x,
  iconRetinaUrl: marker2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

function ClickToSetMarker({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function clampLatLng(lat, lng) {
  const clampedLat = Math.max(-90, Math.min(90, lat));
  const clampedLng = Math.max(-180, Math.min(180, lng));
  return [clampedLat, clampedLng];
}

export default function WellLocationPicker({
  open,
  onClose,
  latitude,
  longitude,
  wellId,
  onChangeLatLng, // (lat, lng) => void
}) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

  // --- modal state ---
  const [pickEnabled, setPickEnabled] = useState(true);

  // --- search state ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const lastSearchRef = useRef("");

  const center = useMemo(() => {
    if (hasCoords) return [lat, lon];
    return [31.0, -103.0]; // fallback (Permian-ish)
  }, [hasCoords, lat, lon]);

  const labelTitle = wellId ? `Proposed Well • ${wellId}` : "Proposed Well";

  const doSearch = async (q) => {
    const trimmed = (q || "").trim();
    if (trimmed.length < 3) {
      setResults([]);
      return;
    }

    // Avoid repeating the exact same search
    if (lastSearchRef.current === trimmed.toLowerCase()) return;
    lastSearchRef.current = trimmed.toLowerCase();

    setSearching(true);
    try {
      // ✅ Nominatim (OSM) - no key needed
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(
        trimmed
      )}`;
      const res = await fetch(url, {
        headers: {
          // Some environments behave better with a UA
          "Accept-Language": "en",
        },
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      doSearch(query);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const [clat, clon] = clampLatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        onChangeLatLng(clat, clon);
      },
      () => {
        // optionally show toast
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePick = (newLat, newLon) => {
    const [clat, clon] = clampLatLng(newLat, newLon);
    onChangeLatLng(clat, clon);
  };

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-emerald-200/60 bg-white shadow-[0_25px_70px_rgba(16,185,129,0.30)]">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/25">
                    <MapPin className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <div className="text-base font-extrabold tracking-wide">
                      Select Well Location
                    </div>
                    <div className="text-[12px] text-emerald-100 mt-0.5">
                      Search, click map, or drag marker to set Lat/Lon
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-emerald-50/90">
                  {hasCoords ? (
                    <span>
                      Current:{" "}
                      <span className="font-semibold">{lat.toFixed(5)}</span>,{" "}
                      <span className="font-semibold">{lon.toFixed(5)}</span>
                    </span>
                  ) : (
                    <span>Current: —</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPickEnabled((v) => !v)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition-all shadow-sm
                    ${
                      pickEnabled
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-white/10 border-white/20 text-emerald-50/90 hover:bg-white/15"
                    }`}
                >
                  {pickEnabled ? "✅ Pick on map: ON" : "Pick on map: OFF"}
                </button>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="px-3 py-2 rounded-xl text-xs font-extrabold bg-white/10 border border-white/20 hover:bg-white/15 transition-all shadow-sm"
                >
                  Use my location
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 border border-white/30 px-4 py-2.5">
                <Search className="w-4 h-4 text-emerald-100" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search "Midland, TX" or "Permian Basin" ...'
                  className="w-full bg-transparent text-sm text-white placeholder:text-emerald-100/70 focus:outline-none"
                />
                {searching && (
                  <span className="text-[11px] text-emerald-100/80">
                    searching…
                  </span>
                )}
              </div>

              {/* Results dropdown */}
              {results.length > 0 && (
                <div className="absolute z-[10000] mt-2 w-full rounded-2xl overflow-hidden bg-white shadow-xl border border-emerald-100">
                  {results.map((r) => (
                    <button
                      key={r.place_id}
                      type="button"
                      onClick={() => {
                        const newLat = parseFloat(r.lat);
                        const newLon = parseFloat(r.lon);
                        handlePick(newLat, newLon);
                        setQuery(r.display_name);
                        setResults([]);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900">
                        {r.display_name}
                      </div>
                      <div className="text-[12px] text-slate-500 mt-0.5">
                        {Number(r.lat).toFixed(5)}, {Number(r.lon).toFixed(5)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div
            className="h-[520px] w-full bg-emerald-50"
            style={{ cursor: pickEnabled ? "crosshair" : "grab" }}
          >
            <MapContainer
              center={center}
              zoom={hasCoords ? 9 : 4}   // ✅ more zoom-out default
              minZoom={2}
              maxZoom={18}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution=""
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Keep map centered when lat/lon changes */}
              <FlyTo center={center} zoom={hasCoords ? 10 : 4} />

              {/* Click to pick */}
              <ClickToSetMarker enabled={pickEnabled} onPick={handlePick} />

              {/* Marker */}
              {hasCoords && (
                <Marker
                  position={[lat, lon]}
                  icon={DefaultIcon}
                  draggable
                  eventHandlers={{
                    dragend: (e) => {
                      const p = e.target.getLatLng();
                      handlePick(p.lat, p.lng);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -18]} permanent opacity={1}>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(20,184,166,0.92))",
                        border: "1px solid rgba(167,243,208,0.65)",
                        boxShadow: "0 12px 28px rgba(16,185,129,0.45)",
                        color: "#ECFDF5",
                        minWidth: 210,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <div style={{ fontWeight: 900, fontSize: 13 }}>
                        {labelTitle}
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12 }}>
                        Lat <b>{lat.toFixed(5)}</b>{" "}
                        <span style={{ opacity: 0.7 }}>•</span> Lon{" "}
                        <b>{lon.toFixed(5)}</b>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 11, opacity: 0.9 }}>
                        Drag marker for precision.
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white border-t border-emerald-100 flex items-center justify-between">
            <div className="text-[12px] text-slate-600">
              Tip: Enable <b>Pick on map</b> → click map to set coordinates. Or
              search a place and refine by dragging the marker.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-extrabold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow hover:opacity-95 transition-all"
              >
                Use this location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
