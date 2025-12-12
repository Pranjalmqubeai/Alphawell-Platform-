import React, { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

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

export default function ProposedWellMap({ latitude, longitude, wellId }) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

  const center = useMemo(
    () => (hasCoords ? [lat, lon] : [31.0, -103.0]),
    [hasCoords, lat, lon]
  );

  const zoom = hasCoords ? 11 : 4;
  const labelTitle = wellId ? `Proposed Well • ${wellId}` : "Proposed Well";
  const coordText = hasCoords
    ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    : "Enter latitude / longitude";

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-[0_14px_40px_rgba(16,185,129,0.25)] border border-emerald-200">
      {/* 🌿 Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold tracking-wide">
              Proposed Well Location
            </div>
            <div className="text-[12px] text-emerald-100 mt-1">
              Surface location derived from input coordinates
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-emerald-200">
              Coordinates
            </div>
            <div className="text-xs font-semibold mt-1">{coordText}</div>
          </div>
        </div>
      </div>

      {/* 🗺️ Map */}
      <div className="relative">
        <div className="h-[300px] w-full bg-emerald-50">
          <MapContainer
            center={center}
            zoom={zoom}
            minZoom={2}
            maxZoom={18}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hasCoords && (
              <Marker position={[lat, lon]} icon={DefaultIcon}>
                {/* 🟢 Elegant Green Tooltip */}
                <Tooltip
                  direction="top"
                  offset={[0, -18]}
                  permanent
                  opacity={1}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 16,
                      background:
                        "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(20,184,166,0.92))",
                      border: "1px solid rgba(167,243,208,0.65)",
                      boxShadow:
                        "0 12px 28px rgba(16,185,129,0.55)",
                      color: "#ECFDF5",
                      minWidth: 200,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                        letterSpacing: 0.2,
                      }}
                    >
                      {labelTitle}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "rgba(236,253,245,0.95)",
                      }}
                    >
                      Lat{" "}
                      <span style={{ fontWeight: 700 }}>
                        {lat.toFixed(4)}
                      </span>
                      <span style={{ margin: "0 8px", opacity: 0.6 }}>
                        |
                      </span>
                      Lon{" "}
                      <span style={{ fontWeight: 700 }}>
                        {lon.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 text-[12px] text-emerald-700 bg-emerald-50 border-t border-emerald-200">
          Scroll to zoom • drag to pan • marker label stays active
        </div>
      </div>
    </div>
  );
}
