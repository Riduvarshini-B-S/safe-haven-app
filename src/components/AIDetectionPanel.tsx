import { Brain, AudioLines, Move, MapPin, Route, Clock, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel, ThreatFactor, BehaviorProfile } from "@/hooks/useRiskEngine";
import type { AccelerometerData } from "@/hooks/useSensors";

interface AIDetectionPanelProps {
  riskLevel: RiskLevel;
  accelerometer: AccelerometerData | null;
  isRecording: boolean;
  isTracking: boolean;
  threats: ThreatFactor[];
  behaviorProfile: BehaviorProfile;
}

interface DetectionRow {
  icon: React.ElementType;
  label: string;
  status: string;
  isAbnormal: boolean;
}

export function AIDetectionPanel({
  riskLevel,
  accelerometer,
  isRecording,
  isTracking,
  threats,
  behaviorProfile,
}: AIDetectionPanelProps) {
  const behaviorAbnormal = riskLevel === "high" || riskLevel === "critical";
  const movementSudden = accelerometer ? accelerometer.magnitude > 25 : false;
  const voiceStress = isRecording;

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
      status: movementSudden
        ? "Sudden"
        : behaviorProfile.erraticMovement
        ? "Erratic"
        : "Stable",
      isAbnormal: movementSudden || behaviorProfile.erraticMovement,
    },
    {
      icon: Route,
      label: "Route",
      status: behaviorProfile.routeDeviation ? "Deviated" : "On Track",
      isAbnormal: behaviorProfile.routeDeviation,
    },
    {
      icon: MapPin,
      label: "Geofence",
      status: behaviorProfile.isolatedArea ? "Outside" : "Safe Zone",
      isAbnormal: behaviorProfile.isolatedArea,
    },
    {
      icon: Clock,
      label: "Dwell",
      status: behaviorProfile.dwellAnomaly ? "Anomaly" : "Normal",
      isAbnormal: behaviorProfile.dwellAnomaly,
    },
  ];

  const severityColor = {
    info: "text-primary",
    warning: "text-warning",
    danger: "text-danger",
  };

  const severityBg = {
    info: "bg-primary/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
  };

  const activeDangerThreats = threats.filter((t) => t.severity === "danger");

  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display font-bold text-sm text-card-foreground tracking-wide">
          AI THREAT DETECTION
        </h3>
        <span
          className={cn(
            "ml-auto text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
            !isTracking
              ? "bg-muted text-muted-foreground"
              : activeDangerThreats.length > 0
              ? "bg-danger/15 text-danger"
              : behaviorAbnormal
              ? "bg-warning/15 text-warning"
              : "bg-safe/15 text-safe"
          )}
        >
          {!isTracking
            ? "Offline"
            : activeDangerThreats.length > 0
            ? "Threat"
            : behaviorAbnormal
            ? "Alert"
            : "Secure"}
        </span>
      </div>

      {/* Detection rows */}
      <div className="space-y-2">
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

      {/* Active Threats */}
      {threats.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Signals ({threats.length})
            </span>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {threats.slice(0, 5).map((threat) => (
              <div
                key={threat.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11px]",
                  severityBg[threat.severity]
                )}
              >
                <Shield className={cn("w-3 h-3 mt-0.5 shrink-0", severityColor[threat.severity])} />
                <div className="min-w-0">
                  <span className={cn("font-bold", severityColor[threat.severity])}>
                    {threat.label}
                  </span>
                  <p className="text-muted-foreground leading-tight">{threat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
