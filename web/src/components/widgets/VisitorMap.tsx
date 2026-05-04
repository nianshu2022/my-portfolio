"use client";

import { useState, useEffect } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

function MapInner({ lat, lng, city }: { lat: number; lng: number; city: string }) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setL(leaflet);
    });
  }, []);

  if (!L) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={6}
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg"
      style={{ background: "var(--muted)" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{city}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default function VisitorMap() {
  const { location } = useGeolocation();

  if (location.loading) {
    return (
      <div className="garden-panel overflow-hidden">
        <div className="flex items-center gap-2 p-4 pb-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-64 animate-pulse bg-muted" />
      </div>
    );
  }

  if (location.error) {
    return (
      <div className="garden-panel flex items-center gap-2 p-5 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>位置信息不可用</span>
      </div>
    );
  }

  if (!location.data) return null;

  const city = location.data.cityZh || location.data.city;
  const country = location.data.countryZh || location.data.country_name;

  return (
    <div className="garden-panel overflow-hidden">
      <div className="flex items-center gap-2 p-4 pb-0">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">访客地图</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {city}, {country}
        </span>
      </div>
      <div className="h-64 p-4">
        <MapInner lat={location.data.latitude} lng={location.data.longitude} city={`${city}, ${country}`} />
      </div>
    </div>
  );
}
