import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  active?: boolean;
  variant?: "default" | "safe" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-card",
  safe: "bg-safe/10",
  warning: "bg-warning/10",
  danger: "bg-danger/10",
};

const iconStyles = {
  default: "text-muted-foreground",
  safe: "text-safe",
  warning: "text-warning",
  danger: "text-danger",
};

export function StatusCard({ icon: Icon, label, value, variant = "default" }: StatusCardProps) {
  return (
    <div className={cn("rounded-2xl p-3.5 shadow-card", variantStyles[variant])}>
      <div className="flex items-center gap-2.5">
        <div className={cn("p-2 rounded-xl bg-muted/50", iconStyles[variant])}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
          <p className="text-sm font-display font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
