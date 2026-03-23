import { motion } from "framer-motion";
import { Shield, Bell, MapPin, Mic, Volume2, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  defaultOn?: boolean;
}

function SettingRow({ icon: Icon, label, description, defaultOn = true }: SettingRowProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-card">
      <div className="p-2 rounded-xl bg-muted">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

export default function AppSettings() {
  return (
    <div className="min-h-screen pb-24 safe-area-top">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-display font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground">Configure your safety preferences</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-5 space-y-3"
      >
        <SettingRow icon={Shield} label="Auto SOS" description="Trigger SOS when risk is critical" />
        <SettingRow icon={Bell} label="Risk Notifications" description="Alert when risk level changes" />
        <SettingRow icon={MapPin} label="GPS Tracking" description="Continuous location monitoring" />
        <SettingRow icon={Mic} label="Voice Detection" description="Monitor for distress signals" />
        <SettingRow icon={Volume2} label="Voice Commands" description='Say "Help" to trigger SOS' defaultOn={false} />
        <SettingRow icon={Smartphone} label="Shake Detection" description="Shake phone 3 times for SOS" />

        <div className="pt-4 text-center">
          <p className="text-[10px] text-muted-foreground">SafeGuard AI v1.0.0</p>
          <p className="text-[10px] text-muted-foreground">AI-Based Women Safety System using HCI</p>
        </div>
      </motion.div>
    </div>
  );
}
