import { useEffect, useRef, useCallback } from "react";

interface UseShakeDetectionOptions {
  threshold?: number; // acceleration magnitude threshold
  timeout?: number; // ms between shakes to count as consecutive
  shakeCount?: number; // number of shakes needed to trigger
  onShake: () => void;
}

export function useShakeDetection({
  threshold = 25,
  timeout = 1000,
  shakeCount = 3,
  onShake,
}: UseShakeDetectionOptions) {
  const countRef = useRef(0);
  const lastShakeRef = useRef(0);
  const cooldownRef = useRef(false);

  const handleMotion = useCallback(
    (e: DeviceMotionEvent) => {
      if (cooldownRef.current) return;

      const acc = e.accelerationIncludingGravity;
      if (acc?.x == null || acc?.y == null || acc?.z == null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const now = Date.now();

      if (magnitude > threshold) {
        if (now - lastShakeRef.current > timeout) {
          countRef.current = 0;
        }
        countRef.current += 1;
        lastShakeRef.current = now;

        if (countRef.current >= shakeCount) {
          countRef.current = 0;
          cooldownRef.current = true;
          onShake();
          // 5s cooldown to prevent repeated triggers
          setTimeout(() => {
            cooldownRef.current = false;
          }, 5000);
        }
      }
    },
    [threshold, timeout, shakeCount, onShake]
  );

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [handleMotion]);
}
