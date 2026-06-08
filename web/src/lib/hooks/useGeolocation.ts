"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { ApiState, GeoLocationData, WeatherData } from "@/lib/api/types";

const WMO_MAP: Record<number, { description: string; iconName: string }> = {
  0: { description: "晴天", iconName: "Sun" },
  1: { description: "大部晴朗", iconName: "CloudSun" },
  2: { description: "多云", iconName: "CloudSun" },
  3: { description: "阴天", iconName: "Cloud" },
  45: { description: "雾", iconName: "CloudFog" },
  48: { description: "雾凇", iconName: "CloudFog" },
  51: { description: "小毛毛雨", iconName: "CloudDrizzle" },
  53: { description: "毛毛雨", iconName: "CloudDrizzle" },
  55: { description: "大毛毛雨", iconName: "CloudDrizzle" },
  61: { description: "小雨", iconName: "CloudRain" },
  63: { description: "中雨", iconName: "CloudRain" },
  65: { description: "大雨", iconName: "CloudRain" },
  66: { description: "冻雨", iconName: "CloudRain" },
  67: { description: "冻雨", iconName: "CloudRain" },
  71: { description: "小雪", iconName: "Snowflake" },
  73: { description: "中雪", iconName: "Snowflake" },
  75: { description: "大雪", iconName: "Snowflake" },
  77: { description: "雪粒", iconName: "Snowflake" },
  80: { description: "小阵雨", iconName: "CloudRainWind" },
  81: { description: "阵雨", iconName: "CloudRainWind" },
  82: { description: "大阵雨", iconName: "CloudRainWind" },
  85: { description: "小阵雪", iconName: "Snowflake" },
  86: { description: "大阵雪", iconName: "Snowflake" },
  95: { description: "雷暴", iconName: "CloudLightning" },
  96: { description: "雷暴伴冰雹", iconName: "CloudLightning" },
  99: { description: "雷暴伴大冰雹", iconName: "CloudLightning" },
};

function mapWeatherCode(code: number): { description: string; iconName: string } {
  return WMO_MAP[code] ?? { description: "未知", iconName: "Cloud" };
}

const GEO_CACHE_KEY = "geo-location";
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000;

const T2S: Record<string, string> = {
  "國":"国","華":"华","東":"东","區":"区","縣":"县","鄉":"乡","鎮":"镇","灣":"湾","門":"门",
  "馬":"马","來":"来","亞":"亚","賓":"宾","緬":"缅","萊":"莱","爾":"尔","韓":"韩","羅":"罗",
  "島":"岛","歐":"欧","義":"义","蘭":"兰","頓":"顿","紐":"纽","聖":"圣","喬":"乔","開":"开",
  "愛":"爱","蘇":"苏","聯":"联","廣":"广","慶":"庆","齊":"齐","濟":"济","長":"长",
  "陽":"阳","寧":"宁","貴":"贵","銀":"银","龍":"龙","鳳":"凤","鶴":"鹤","麗":"丽","興":"兴",
  "順":"顺","豐":"丰","雲":"云","紅":"红","黃":"黄","綠":"绿","藍":"蓝","飛":"飞","電":"电",
  "車":"车","機":"机","橋":"桥","園":"园","學":"学","書":"书","報":"报","務":"务","業":"业",
  "產":"产","運":"运","動":"动","經":"经","貿":"贸","農":"农","礦":"矿","軍":"军","戰":"战",
  "歷":"历","歲":"岁","號":"号","點":"点","問":"问","間":"间","關":"关","設":"设",
  "認":"认","話":"话","語":"语","讀":"读","調":"调","議":"议","記":"记","論":"论","證":"证",
  "護":"护","選":"选","達":"达","過":"过","還":"还","進":"进","遠":"远","連":"连","遲":"迟",
  "適":"适","邊":"边","錯":"错","錢":"钱","鐵":"铁","銅":"铜","鋼":"钢","錄":"录",
  "鍵":"键","鏡":"镜","鐘":"钟","閣":"阁","聞":"闻","隊":"队",
  "陰":"阴","陣":"阵","階":"阶","雜":"杂","雞":"鸡","難":"难","靈":"灵","響":"响",
  "頭":"头","願":"愿","風":"风","館":"馆",
};

function toSimplified(text: string): string {
  return text.replace(/[一-鿿]/g, (ch) => T2S[ch] ?? ch);
}

function formatTimezone(tz: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value ?? tz;
  } catch {
    return tz;
  }
}

async function fetchIpLocation(): Promise<GeoLocationData> {
  return fetchApi<GeoLocationData>("https://ipapi.co/json/", {
    cacheKey: GEO_CACHE_KEY,
    cacheTTL: GEO_CACHE_TTL,
  });
}

function fetchBrowserGeolocation(): Promise<GeoLocationData> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({
          ip: "",
          city: "",
          region: "",
          country_name: "",
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
      (err) => reject(err),
      { timeout: 5000, maximumAge: GEO_CACHE_TTL },
    );
  });
}

export function useGeolocation() {
  const [locationState, setLocationState] = useState<ApiState<GeoLocationData>>({
    data: null,
    loading: true,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = GEO_CACHE_KEY;

    const fetchLocation = () => {
      setLocationState((prev) => ({ ...prev, loading: true, error: null }));
      fetchBrowserGeolocation()
        .then((data) => {
          if (!cancelled) {
            localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
            setLocationState({ data, loading: false, error: null });
          }
        })
        .catch(() => {
          fetchIpLocation()
            .then((data) => {
              if (!cancelled) {
                localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
                setLocationState({ data, loading: false, error: null });
              }
            })
            .catch((err: Error) => {
              if (!cancelled) setLocationState({ data: null, loading: false, error: err.message });
            });
        });
    };

    // Try cache first (skip on retry)
    if (retryCount === 0) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < GEO_CACHE_TTL && data.latitude && data.longitude) {
            if (!cancelled) setLocationState({ data, loading: false, error: null });
            return;
          }
        }
      } catch {}
    }

    // Try browser geolocation first, fall back to IP
    fetchLocation();

    return () => { cancelled = true; };
  }, [retryCount]);

  const retry = useCallback(() => {
    localStorage.removeItem(GEO_CACHE_KEY);
    setRetryCount((c) => c + 1);
  }, []);

  const [zhNames, setZhNames] = useState<{ cityZh?: string; countryZh?: string; timezoneZh?: string }>({});

  useEffect(() => {
    if (!locationState.data) return;
    const { latitude, longitude, timezone } = locationState.data;
    const cacheKey = `geo-zh2-${latitude.toFixed(2)}-${longitude.toFixed(2)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setZhNames(JSON.parse(cached));
        return;
      } catch {}
    }
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`)
      .then((r) => r.json())
      .then((data) => {
        const names = {
          cityZh: toSimplified(data.city || data.locality),
          countryZh: toSimplified(data.countryName),
          timezoneZh: formatTimezone(timezone),
        };
        setZhNames(names);
        localStorage.setItem(cacheKey, JSON.stringify(names));
      })
      .catch(() => {});
  }, [locationState.data]);

  const lat = locationState.data?.latitude;
  const lon = locationState.data?.longitude;

  const weather = useApi<WeatherData>(
    () =>
      fetchApi<WeatherData>(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        {
          cacheKey: `weather-${lat}-${lon}`,
          cacheTTL: 30 * 60 * 1000,
          transform: (data) => {
            const raw = (data as { current_weather: { temperature: number; windspeed: number; weathercode: number } }).current_weather;
            const mapped = mapWeatherCode(raw.weathercode);
            return { ...raw, ...mapped };
          },
        },
      ),
    [lat, lon],
    { enabled: lat != null && lon != null },
  );

  const location = locationState.data
    ? { ...locationState, data: { ...locationState.data, ...zhNames }, retry }
    : { ...locationState, retry };

  return { location, weather };
}
