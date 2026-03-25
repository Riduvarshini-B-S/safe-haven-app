import { Brain, AudioLines, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/hooks/useRiskEngine";
import type { AccelerometerData } from "@/hooks/useSensors";

interface AIDetectionPanelProps {
  riskLevel: RiskLevel;
  accelerometer: AccelerometerData | null;
  isRecording: boolean;
  isTracking: boolean;
}

interface DetectionRow {
  icon: React.ElementType;
  label: string;
  status: string;
  isAbnormal: boolean;
}

export function AIDetectionPanel({ riskLevel, accelerometer, isRecording, isTracking }: AIDetectionPanelProps) {
  const behaviorAbnormal = riskLevel === "high" || riskLevel === "critical";
  const movementSudden = accelerometer ? accelerometer.magnitude > 25 : false;
  const voiceStress = isRecording; // simulated: stress when recording is active

  const rows: DetectionRow[] = [
    {
      icon: Brain,
      label: "Behavior",
      status: behaviorAbnormal ? "Abnormal" : "Normal",
      isAbnormal: behaviorAbnormal,
    },
    {
      icon: AudioLines,
      label: "Voice",
      status: voiceStress ? "Stress" : "Calm",
      isAbnormal: voiceStress,
    },
    {
      icon: Move,
      label: "Movement",
      status: movementSudden ? "Sudden" : "Stable",
      isAbnormal: movementSudden,
    },
  ];

  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display font-bold text-sm text-card-foreground tracking-wide">
          AI STATUS
        </h3>
        <span
          className={cn(
            "ml-auto text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
            isTracking
              ? behaviorAbnormal
                ? "bg-danger/15 text-danger"
                : "bg-safe/15 text-safe"
              : "bg-muted text-muted-foreground"
          )}
        >
          {!isTracking ? "Offline" : behaviorAbnormal ? "Alert" : "Active"}
        </span>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                row.isAbnormal ? "bg-danger/10" : "bg-safe/10"
              )}
            >
              <row.icon
                className={cn(
                  "w-4 h-4",
                  row.isAbnormal ? "text-danger" : "text-safe"
                )}
              />
            </div>
            <span className="text-sm font-medium text-card-foreground flex-1">
              {row.label}
            </span>
            <span
              className={cn(
                "text-xs font-bold tracking-wide",
                row.isAbnormal ? "text-danger" : "text-safe"
              )}
            >
              {row.status}
            </span>
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                row.isAbnormal ? "bg-danger animate-pulse" : "bg-safe"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
