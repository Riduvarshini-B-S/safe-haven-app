import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Activity, Mic, Wifi, WifiOff } from "lucide-react";
import { SOSButton } from "@/components/SOSButton";
import { RiskMeter } from "@/components/RiskMeter";
import { StatusCard } from "@/components/StatusCard";
import { useSensors } from "@/hooks/useSensors";
import { useRiskEngine } from "@/hooks/useRiskEngine";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { location, accelerometer, isTracking, locationError, startTracking, stopTracking } = useSensors();
  const risk = useRiskEngine(location, accelerometer, isTracking);
  const { contacts } = useEmergencyContacts();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  // Auto-trigger SOS at critical risk
  useEffect(() => {
    if (risk.level === "critical" && !sosActive) {
      toast({
        title: "⚠️ Critical Risk Detected",
        description: "Risk level is critical. Hold the SOS button to send alerts.",
        variant: "destructive",
      });
    }
  }, [risk.level, sosActive, toast]);

  const handleSOS = useCallback(() => {
    setSosActive(true);
    setIsRecording(true);

    // Simulate sending alerts
    contacts.forEach((contact) => {
      toast({
        title: `📨 Alert sent to ${contact.name}`,
        description: `SMS with live location sent to ${contact.phone} (simulated)`,
      });
    });

    if (contacts.length === 0) {
      toast({
        title: "⚠️ No emergency contacts",
        description: "Add contacts in the Contacts tab to send real alerts.",
        variant: "destructive",
      });
    }

    toast({
      title: "🎙️ Audio recording started",
      description: "Recording audio evidence (simulated)",
    });

    // Auto-deactivate after 30s for demo
    setTimeout(() => {
      setSosActive(false);
      setIsRecording(false);
      toast({ title: "SOS deactivated", description: "Alert session ended." });
    }, 30000);
  }, [contacts, toast]);

  return (
    <div className="min-h-screen pb-24 safe-area-top">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-display font-bold">SafeGuard AI</h1>
            <p className="text-xs text-muted-foreground">Women Safety System</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isTracking ? (
              <Wifi className="w-3.5 h-3.5 text-safe" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-danger" />
            )}
            {isTracking ? "Active" : "Inactive"}
          </div>
        </motion.div>
      </div>

      {/* SOS Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex justify-center py-6"
      >
        <SOSButton riskLevel={risk.level} onActivate={handleSOS} isActive={sosActive} />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 grid grid-cols-2 gap-3 mb-4"
      >
        <StatusCard
          icon={MapPin}
          label="GPS"
          value={location ? `${location.latitude.toFixed(4)}°` : locationError || "Waiting..."}
          variant={location ? "safe" : "warning"}
        />
        <StatusCard
          icon={Activity}
          label="Motion"
          value={accelerometer ? `${accelerometer.magnitude.toFixed(1)} m/s²` : "No data"}
          variant={accelerometer && accelerometer.magnitude > 25 ? "danger" : "default"}
        />
        <StatusCard
          icon={Mic}
          label="Audio"
          value={isRecording ? "Recording..." : "Standby"}
          variant={isRecording ? "danger" : "default"}
        />
        <StatusCard
          icon={isTracking ? Wifi : WifiOff}
          label="Status"
          value={isTracking ? "Monitoring" : "Offline"}
          variant={isTracking ? "safe" : "warning"}
        />
      </motion.div>

      {/* Risk Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5"
      >
        <RiskMeter risk={risk} />
      </motion.div>
    </div>
  );
}
