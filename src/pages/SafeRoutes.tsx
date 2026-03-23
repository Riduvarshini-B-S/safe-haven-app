import { motion } from "framer-motion";
import { MapPin, AlertTriangle, CheckCircle2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteInfo {
  id: string;
  name: string;
  safety: "safe" | "moderate" | "dangerous";
  distance: string;
  time: string;
  dangerZones: number;
}

const mockRoutes: RouteInfo[] = [
  { id: "1", name: "Main Road via Market St", safety: "safe", distance: "2.4 km", time: "8 min", dangerZones: 0 },
  { id: "2", name: "Through City Park", safety: "moderate", distance: "1.9 km", time: "6 min", dangerZones: 1 },
  { id: "3", name: "Industrial Area Shortcut", safety: "dangerous", distance: "1.2 km", time: "4 min", dangerZones: 3 },
];

const dangerZones = [
  { name: "Abandoned Warehouse District", level: "High Risk", reports: 12 },
  { name: "Dimly Lit Underpass - Sector 5", level: "Medium Risk", reports: 7 },
  { name: "Isolated Parking Lot - Mall Rd", level: "High Risk", reports: 9 },
];

const safetyConfig = {
  safe: { label: "Safe Route", color: "text-safe", bg: "bg-safe/10", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  dangerous: { label: "Dangerous", color: "text-danger", bg: "bg-danger/10", icon: AlertTriangle },
};

export default function SafeRoutes() {
  return (
    <div className="min-h-screen pb-24 safe-area-top">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-display font-bold">Safe Routes</h1>
        <p className="text-xs text-muted-foreground">AI-suggested safe paths</p>
      </div>

      {/* Route suggestions */}
      <div className="px-5 space-y-3 mb-6">
        <h2 className="text-sm font-display font-semibold">Suggested Routes</h2>
        {mockRoutes.map((route, i) => {
          const config = safetyConfig[route.safety];
          const Icon = config.icon;
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn("rounded-2xl p-4 shadow-card", config.bg)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Navigation className={cn("w-4 h-4", config.color)} />
                  <h3 className="text-sm font-semibold">{route.name}</h3>
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-card", config.color)}>
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{route.distance}</span>
                <span>{route.time}</span>
                {route.dangerZones > 0 && (
                  <span className="text-danger flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {route.dangerZones} danger zone{route.dangerZones > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Danger zones */}
      <div className="px-5 space-y-3">
        <h2 className="text-sm font-display font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          Nearby Danger Zones
        </h2>
        {dangerZones.map((zone, i) => (
          <motion.div
            key={zone.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-card rounded-2xl p-3.5 shadow-card flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-danger/10">
              <MapPin className="w-4 h-4 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{zone.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {zone.level} · {zone.reports} reports
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
