"use client";

import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudRainWind,
  Wind,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";

const WEATHER_ICONS: Record<string, LucideIcon> = {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudRainWind,
};

export default function WeatherCard() {
  const { location, weather } = useGeolocation();

  if (weather.loading || location.loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="space-y-1">
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (weather.error || location.error) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>天气信息暂时不可用</span>
      </div>
    );
  }

  if (!weather.data || !location.data) return null;

  const Icon = WEATHER_ICONS[weather.data.iconName] ?? Cloud;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <div className="text-2xl font-semibold">{weather.data.temperature}°C</div>
          <div className="text-sm text-muted-foreground">{weather.data.description}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Wind className="h-3 w-3" />
          {weather.data.windspeed} km/h
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {location.data.cityZh || location.data.city}, {location.data.countryZh || location.data.country_name}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {location.data.timezoneZh || location.data.timezone}
        </span>
      </div>
    </div>
  );
}
