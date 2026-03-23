import { useState, useEffect, useCallback, useRef } from "react";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export interface SensorState {
  location: LocationData | null;
  accelerometer: AccelerometerData | null;
  isTracking: boolean;
  locationError: string | null;
}

export function useSensors() {
  const [state, setState] = useState<SensorState>({
    location: null,
    accelerometer: null,
    isTracking: false,
    locationError: null,
  });
  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, locationError: "Geolocation not supported" }));
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setState((s) => ({
          ...s,
          isTracking: true,
          locationError: null,
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          },
        }));
      },
      (err) => {
        setState((s) => ({
          ...s,
          locationError: err.message,
          isTracking: false,
        }));
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    // Simulated accelerometer (DeviceMotion may not work in all browsers)
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc?.x != null && acc?.y != null && acc?.z != null) {
        const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        setState((s) => ({
          ...s,
          accelerometer: { x: acc.x!, y: acc.y!, z: acc.z!, magnitude },
        }));
      }
    };
    window.addEventListener("devicemotion", handleMotion);

    setState((s) => ({ ...s, isTracking: true }));

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((s) => ({ ...s, isTracking: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { ...state, startTracking, stopTracking };
}
