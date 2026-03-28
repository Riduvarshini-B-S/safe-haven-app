import { useState, useEffect, useCallback, useRef } from "react";
import type { LocationData, AccelerometerData } from "./useSensors";

export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export interface ThreatFactor {
  id: string;
  label: string;
  detail: string;
  severity: "info" | "warning" | "danger";
}

export interface RiskState {
  score: number; // 0-100
  level: RiskLevel;
  factors: string[];
  threats: ThreatFactor[];
  behaviorProfile: BehaviorProfile;
}

export interface BehaviorProfile {
  routeDeviation: boolean;
  dwellAnomaly: boolean;
  speedAnomaly: boolean;
  erraticMovement: boolean;
  lateNight: boolean;
  isolatedArea: boolean;
}

function getLevel(score: number): RiskLevel {
  if (score < 15) return "safe";
  if (score < 35) return "low";
  if (score < 55) return "medium";
  if (score < 75) return "high";
  return "critical";
}

// Simulated known safe zones (latitude, longitude, radius in meters)
const SAFE_ZONES = [
  { lat: 0, lon: 0, radius: 500, name: "Home" },
  { lat: 0.005, lon: 0.005, radius: 300, name: "Work" },
];

export function useRiskEngine(
  location: LocationData | null,
  accelerometer: AccelerometerData | null,
  isTracking: boolean
) {
  const [risk, setRisk] = useState<RiskState>({
    score: 0,
    level: "safe",
    factors: [],
    threats: [],
    behaviorProfile: {
      routeDeviation: false,
      dwellAnomaly: false,
      speedAnomaly: false,
      erraticMovement: false,
      lateNight: false,
      isolatedArea: false,
    },
  });
  const historyRef = useRef<LocationData[]>([]);
  const dwellStartRef = useRef<number | null>(null);
  const directionChangesRef = useRef<number>(0);
  const lastBearingRef = useRef<number | null>(null);

  const analyze = useCallback(() => {
    if (!isTracking) return;

    let score = 0;
    const factors: string[] = [];
    const threats: ThreatFactor[] = [];
    const profile: BehaviorProfile = {
      routeDeviation: false,
      dwellAnomaly: false,
      speedAnomaly: false,
      erraticMovement: false,
      lateNight: false,
      isolatedArea: false,
    };

    // ── 1. Time-based risk ──
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      score += 20;
      profile.lateNight = true;
      factors.push("Late night hours detected");
      threats.push({
        id: "time-late",
        label: "Late Night Risk",
        detail: "Activity detected during high-risk hours (10 PM – 5 AM)",
        severity: "warning",
      });
    } else if (hour >= 20 || hour <= 6) {
      score += 10;
      factors.push("Evening/early morning");
      threats.push({
        id: "time-evening",
        label: "Evening Hours",
        detail: "Elevated awareness during twilight hours",
        severity: "info",
      });
    }

    // ── 2. Accelerometer: sudden movement & erratic patterns ──
    if (accelerometer) {
      if (accelerometer.magnitude > 25) {
        score += 25;
        factors.push("Sudden violent movement detected");
        threats.push({
          id: "motion-violent",
          label: "Violent Motion",
          detail: `Extreme acceleration of ${accelerometer.magnitude.toFixed(1)} m/s² — possible struggle`,
          severity: "danger",
        });
      } else if (accelerometer.magnitude > 15) {
        score += 10;
        factors.push("Unusual movement intensity");
        threats.push({
          id: "motion-unusual",
          label: "Unusual Motion",
          detail: "Movement intensity above normal walking pattern",
          severity: "warning",
        });
      } else if (accelerometer.magnitude < 5 && accelerometer.magnitude > 0) {
        score += 10;
        factors.push("Unusually still movement pattern");
        threats.push({
          id: "motion-still",
          label: "Unusually Still",
          detail: "Very low movement — possible restraint scenario",
          severity: "info",
        });
      }
    }

    // ── 3. Location & behavior analysis ──
    const history = historyRef.current;

    if (location && history.length > 1) {
      const prev = history[history.length - 2];
      const dist = haversine(prev.latitude, prev.longitude, location.latitude, location.longitude);
      const timeDiff = (location.timestamp - prev.timestamp) / 1000;

      if (timeDiff > 0) {
        const speed = dist / timeDiff; // m/s

        // Speed anomaly detection
        if (speed > 30) {
          score += 15;
          profile.speedAnomaly = true;
          factors.push("Abnormally high speed detected");
          threats.push({
            id: "speed-high",
            label: "Speed Anomaly",
            detail: `Traveling at ~${(speed * 3.6).toFixed(0)} km/h — possible vehicle abduction`,
            severity: "danger",
          });
        } else if (speed > 15) {
          score += 8;
          profile.speedAnomaly = true;
          threats.push({
            id: "speed-elevated",
            label: "Elevated Speed",
            detail: "Moving faster than walking pace — monitoring",
            severity: "warning",
          });
        }

        // Dwell time anomaly (stationary for too long in unfamiliar area)
        if (speed < 0.1 && timeDiff > 30) {
          if (!dwellStartRef.current) {
            dwellStartRef.current = Date.now();
          }
          const dwellDuration = (Date.now() - dwellStartRef.current) / 1000;
          if (dwellDuration > 300) {
            score += 20;
            profile.dwellAnomaly = true;
            factors.push("Extended dwell in one location");
            threats.push({
              id: "dwell-extended",
              label: "Dwell Anomaly",
              detail: `Stationary for ${Math.round(dwellDuration / 60)} min — unusual for this time`,
              severity: "warning",
            });
          } else if (dwellDuration > 120) {
            score += 10;
            profile.dwellAnomaly = true;
            factors.push("Stationary for extended period");
          }
        } else {
          dwellStartRef.current = null;
        }

        // Route deviation / erratic movement (direction change analysis)
        if (dist > 2) {
          const bearing = getBearing(prev.latitude, prev.longitude, location.latitude, location.longitude);
          if (lastBearingRef.current !== null) {
            const angleDiff = Math.abs(bearing - lastBearingRef.current);
            const normalizedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
            if (normalizedDiff > 90) {
              directionChangesRef.current += 1;
            }
          }
          lastBearingRef.current = bearing;
        }
      }
    }

    // Erratic movement: frequent sharp direction changes
    if (directionChangesRef.current > 5) {
      score += 15;
      profile.erraticMovement = true;
      profile.routeDeviation = true;
      factors.push("Erratic movement pattern detected");
      threats.push({
        id: "route-erratic",
        label: "Erratic Route",
        detail: `${directionChangesRef.current} sharp direction changes — circling or being followed`,
        severity: "danger",
      });
    } else if (directionChangesRef.current > 3) {
      score += 8;
      profile.routeDeviation = true;
      threats.push({
        id: "route-deviation",
        label: "Route Deviation",
        detail: "Unusual path pattern — deviating from expected route",
        severity: "warning",
      });
    }

    // Decay direction change counter slowly
    if (directionChangesRef.current > 0 && Math.random() > 0.7) {
      directionChangesRef.current = Math.max(0, directionChangesRef.current - 1);
    }

    // ── 4. Geofence: distance from safe zones ──
    if (location) {
      const inSafeZone = SAFE_ZONES.some((zone) => {
        const d = haversine(location.latitude, location.longitude, zone.lat, zone.lon);
        return d < zone.radius;
      });
      if (!inSafeZone) {
        score += 10;
        profile.isolatedArea = true;
        factors.push("Outside known safe zones");
        threats.push({
          id: "geofence-outside",
          label: "Unfamiliar Area",
          detail: "Current location is outside designated safe zones",
          severity: "info",
        });
      }
    }

    // ── 5. Compound threat escalation ──
    const activeThreats = Object.values(profile).filter(Boolean).length;
    if (activeThreats >= 3) {
      score += 15;
      threats.push({
        id: "compound-threat",
        label: "Multi-Factor Alert",
        detail: `${activeThreats} simultaneous threat indicators — elevated compound risk`,
        severity: "danger",
      });
    }

    // Minor randomness for demo
    score += Math.random() * 5;
    score = Math.min(100, Math.max(0, Math.round(score)));

    setRisk({ score, level: getLevel(score), factors, threats, behaviorProfile: profile });
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

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
