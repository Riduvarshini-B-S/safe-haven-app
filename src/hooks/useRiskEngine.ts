import { useState, useEffect, useCallback, useRef } from "react";
import type { LocationData, AccelerometerData } from "./useSensors";

export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export interface RiskState {
  score: number; // 0-100
  level: RiskLevel;
  factors: string[];
}

function getLevel(score: number): RiskLevel {
  if (score < 15) return "safe";
  if (score < 35) return "low";
  if (score < 55) return "medium";
  if (score < 75) return "high";
  return "critical";
}

export function useRiskEngine(
  location: LocationData | null,
  accelerometer: AccelerometerData | null,
  isTracking: boolean
) {
  const [risk, setRisk] = useState<RiskState>({
    score: 0,
    level: "safe",
    factors: [],
  });
  const historyRef = useRef<LocationData[]>([]);
  const lastUpdateRef = useRef<number>(0);

  const analyze = useCallback(() => {
    if (!isTracking) return;

    let score = 0;
    const factors: string[] = [];

    // Time-based risk: late night hours
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      score += 20;
      factors.push("Late night hours detected");
    } else if (hour >= 20 || hour <= 6) {
      score += 10;
      factors.push("Evening/early morning");
    }

    // Movement analysis from accelerometer
    if (accelerometer) {
      if (accelerometer.magnitude > 25) {
        score += 25;
        factors.push("Sudden violent movement detected");
      } else if (accelerometer.magnitude < 5 && accelerometer.magnitude > 0) {
        // Very still - could indicate being held
        score += 10;
        factors.push("Unusually still movement pattern");
      }
    }

    // Location-based analysis
    if (location && historyRef.current.length > 1) {
      const prev = historyRef.current[historyRef.current.length - 2];
      const dist = haversine(
        prev.latitude,
        prev.longitude,
        location.latitude,
        location.longitude
      );
      const timeDiff = (location.timestamp - prev.timestamp) / 1000;
      
      if (timeDiff > 0) {
        const speed = dist / timeDiff; // m/s
        if (speed > 30) {
          score += 15;
          factors.push("Abnormally high speed detected");
        }
        if (speed < 0.1 && timeDiff > 120) {
          score += 15;
          factors.push("Stationary for extended period");
        }
      }
    }

    // Add some randomness for demo (simulating AI uncertainty)
    score += Math.random() * 8;

    score = Math.min(100, Math.max(0, Math.round(score)));

    setRisk({ score, level: getLevel(score), factors });
  }, [location, accelerometer, isTracking]);

  useEffect(() => {
    if (location) {
      historyRef.current.push(location);
      if (historyRef.current.length > 50) historyRef.current.shift();
    }
  }, [location]);

  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(analyze, 3000);
    return () => clearInterval(interval);
  }, [isTracking, analyze]);

  return risk;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
