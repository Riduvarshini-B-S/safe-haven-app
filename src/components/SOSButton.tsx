import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { RiskLevel } from "@/hooks/useRiskEngine";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  riskLevel: RiskLevel;
  isProtectionOn: boolean;
  onToggle: () => void;
  sosTriggered: boolean;
}

export function SOSButton({ riskLevel, isProtectionOn, onToggle, sosTriggered }: SOSButtonProps) {
  const bgClass = sosTriggered
    ? "bg-danger"
    : isProtectionOn
    ? riskLevel === "critical"
      ? "bg-danger"
      : riskLevel === "high"
      ? "bg-warning"
      : "bg-safe"
    : "bg-muted";

  const Icon = isProtectionOn ? ShieldCheck : ShieldAlert;

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when active & elevated risk */}
      {isProtectionOn && (sosTriggered || riskLevel === "critical") && (
        <>
          <div className={cn("absolute w-44 h-44 rounded-full animate-pulse-ring", "bg-danger", "opacity-30")} />
          <div
            className={cn("absolute w-44 h-44 rounded-full animate-pulse-ring", "bg-danger", "opacity-20")}
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}

      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 shadow-elevated transition-colors duration-500",
          bgClass,
          isProtectionOn ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isProtectionOn ? "on" : "off"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <Icon className="w-10 h-10" />
            <span className="text-xs font-display font-bold tracking-wide leading-tight text-center">
              {sosTriggered
                ? "SOS SENT"
                : isProtectionOn
                ? "AUTO PROTECT\nON"
                : "PROTECTION\nOFF"}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
