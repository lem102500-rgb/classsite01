"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* 현재 날씨 카드.
   - 날씨 정보는 Open-Meteo(무료, 가입·키 필요 없음)에서 10분마다 받아옵니다.
   - 도시는 site.config.ts 의 weather 에서 바꿉니다. */

type Current = { temperature: number; code: number; humidity: number; wind: number };

const REFRESH_MS = 10 * 60 * 1000;

/** 날씨 코드 → 한국어 이름과 아이콘 */
function describe(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "맑음", Icon: Sun };
  if (code <= 2) return { label: "구름 조금", Icon: CloudSun };
  if (code === 3) return { label: "흐림", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "안개", Icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "이슬비", Icon: CloudDrizzle };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: "비", Icon: CloudRain };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "눈", Icon: CloudSnow };
  if (code >= 95) return { label: "뇌우", Icon: CloudLightning };
  return { label: "흐림", Icon: Cloud };
}

export function Weather({
  city,
  latitude,
  longitude,
  className,
}: {
  city: string;
  latitude: number;
  longitude: number;
  className?: string;
}) {
  const [current, setCurrent] = useState<Current | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&wind_speed_unit=ms&timezone=auto`;

    async function load() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        setCurrent({
          temperature: data.current.temperature_2m,
          code: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m,
        });
        setFailed(false);
      } catch {
        setFailed(true);
      }
    }

    const first = setTimeout(load, 0); // 화면이 뜨자마자 한 번
    const timer = setInterval(load, REFRESH_MS); // 그 뒤로 10분마다
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [latitude, longitude]);

  const info = current ? describe(current.code) : null;
  const Icon = info?.Icon ?? Cloud;

  return (
    <div className={cn("flex items-center gap-4 rounded-xl border bg-card px-5 py-4", className)}>
      <Icon className={cn("size-9 shrink-0", current ? "text-foreground" : "text-muted-foreground")} />
      {current && info ? (
        <div className="min-w-0">
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">{Math.round(current.temperature)}°</span>
            <span className="text-sm text-muted-foreground">
              {city} · {info.label}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            습도 {current.humidity}% · 바람 {current.wind.toFixed(1)}m/s
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {failed ? "날씨 정보를 불러오지 못했어요" : `${city} 날씨 불러오는 중…`}
        </p>
      )}
    </div>
  );
}
