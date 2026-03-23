import { motion } from "framer-motion";
import type { RiskState } from "@/hooks/useRiskEngine";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  risk: RiskState;
}

const levelConfig = {
  safe: { label: "Safe", color: "text-safe", bg: "bg-safe" },
  low: { label: "Low Risk", color: "text-safe", bg: "bg-safe" },
  medium: { label: "Moderate", color: "text-warning", bg: "bg-warning" },
  high: { label: "High Risk", color: "text-danger", bg: "bg-danger" },
  critical: { label: "Critical", color: "text-danger", bg: "bg-danger" },
};

export function RiskMeter({ risk }: RiskMeterProps) {
  const config = levelConfig[risk.level];

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">Risk Assessment</h3>
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", config.bg, "text-white")}>
          {config.label}
        </span>
      </div>

      {/* Score bar */}
      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", config.bg)}
          initial={{ width: 0 }}
          animate={{ width: `${risk.score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Safe</span>
        <span className="font-semibold text-foreground">{risk.score}/100</span>
        <span>Critical</span>
      </div>

      {risk.factors.length > 0 && (
        <div className="space-y-1 pt-1">
          {risk.factors.map((f, i) => (
            <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.bg)} />
              {f}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
