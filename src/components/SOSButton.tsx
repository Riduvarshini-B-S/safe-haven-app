import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useState, useCallback } from "react";
import type { RiskLevel } from "@/hooks/useRiskEngine";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  riskLevel: RiskLevel;
  onActivate: () => void;
  isActive: boolean;
}

export function SOSButton({ riskLevel, onActivate, isActive }: SOSButtonProps) {
  const [pressing, setPressing] = useState(false);
  const [holdTimer, setHoldTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = useCallback(() => {
    setPressing(true);
    const timer = setTimeout(() => {
      onActivate();
      setPressing(false);
    }, 1500);
    setHoldTimer(timer);
  }, [onActivate]);

  const handlePressEnd = useCallback(() => {
    setPressing(false);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  }, [holdTimer]);

  const bgClass = isActive
    ? "bg-danger"
    : riskLevel === "critical"
    ? "bg-danger"
    : riskLevel === "high"
    ? "bg-warning"
    : "bg-primary";

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings */}
      {(isActive || riskLevel === "critical") && (
        <>
          <div className={cn("absolute w-44 h-44 rounded-full animate-pulse-ring", bgClass, "opacity-30")} />
          <div
            className={cn("absolute w-44 h-44 rounded-full animate-pulse-ring", bgClass, "opacity-20")}
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}

      <motion.button
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressEnd}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 text-primary-foreground shadow-elevated transition-colors duration-300",
          bgClass,
          pressing && "ring-4 ring-primary-foreground/30"
        )}
      >
        <ShieldAlert className="w-10 h-10" />
        <span className="text-sm font-display font-bold tracking-wide">
          {isActive ? "SOS ACTIVE" : "HOLD FOR SOS"}
        </span>
      </motion.button>

      {pressing && (
        <svg className="absolute z-20 w-40 h-40" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="289"
            strokeDashoffset="289"
            strokeLinecap="round"
            className="animate-[dash_1.5s_linear_forwards]"
            style={{
              animation: "dash 1.5s linear forwards",
            }}
          />
          <style>{`
            @keyframes dash {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </svg>
      )}
    </div>
  );
}
