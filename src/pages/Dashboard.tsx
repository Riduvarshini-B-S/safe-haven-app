import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Activity, Mic, Wifi, WifiOff } from "lucide-react";
import { SOSButton } from "@/components/SOSButton";
import { RiskMeter } from "@/components/RiskMeter";
import { StatusCard } from "@/components/StatusCard";
import { useSensors } from "@/hooks/useSensors";
import { useRiskEngine } from "@/hooks/useRiskEngine";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { location, accelerometer, isTracking, locationError, startTracking, stopTracking } = useSensors();
  const risk = useRiskEngine(location, accelerometer, isTracking);
  const { contacts } = useEmergencyContacts();
  const { toast } = useToast();
  const [protectionOn, setProtectionOn] = useState(true);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const sosCooldownRef = useRef(false);

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  const triggerSOS = useCallback(() => {
    if (sosCooldownRef.current) return;
    sosCooldownRef.current = true;
    setSosTriggered(true);
    setIsRecording(true);

    toast({
      title: "🚨 AI Auto-SOS Triggered",
      description: "Critical risk detected — alerting your trusted contacts now.",
      variant: "destructive",
    });

    contacts.forEach((contact) => {
      toast({
        title: `📨 Alert sent to ${contact.name}`,
        description: `SMS with live location sent to ${contact.phone} (simulated)`,
      });
    });

    if (contacts.length === 0) {
      toast({
        title: "⚠️ No trusted contacts",
        description: "Add contacts in the Contacts tab to enable auto-alerts.",
        variant: "destructive",
      });
    }

    toast({
      title: "🎙️ Audio evidence recording",
      description: "Recording started automatically (simulated)",
    });

    // Reset after 30s
    setTimeout(() => {
      setSosTriggered(false);
      setIsRecording(false);
      sosCooldownRef.current = false;
      toast({ title: "✅ SOS session ended", description: "AI continues monitoring." });
    }, 30000);
  }, [contacts, toast]);

  // Shake detection triggers SOS regardless of protection state
  useShakeDetection({
    threshold: 25,
    shakeCount: 3,
    onShake: triggerSOS,
  });

  // Auto-trigger SOS when AI detects critical risk
  useEffect(() => {
    if (protectionOn && risk.level === "critical" && !sosTriggered) {
      triggerSOS();
    }
  }, [protectionOn, risk.level, sosTriggered, triggerSOS]);

  // Warn at high risk
  useEffect(() => {
    if (protectionOn && risk.level === "high" && !sosTriggered) {
      toast({
        title: "⚠️ High risk detected",
        description: "AI is closely monitoring. SOS will auto-trigger if risk escalates.",
      });
    }
  }, [protectionOn, risk.level, sosTriggered, toast]);

  const toggleProtection = useCallback(() => {
    setProtectionOn((prev) => {
      const next = !prev;
      toast({
        title: next ? "🛡️ Auto Protection ON" : "Protection OFF",
        description: next
          ? "AI will analyze your situation and auto-alert contacts if needed."
          : "Automatic protection disabled.",
      });
      return next;
    });
  }, [toast]);

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
        <SOSButton
          riskLevel={risk.level}
          isProtectionOn={protectionOn}
          onToggle={toggleProtection}
          sosTriggered={sosTriggered}
        />
      </motion.div>

      {/* Status label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center text-xs text-muted-foreground mb-4"
      >
        {protectionOn
          ? "AI is analyzing your surroundings in real-time"
          : "Tap to enable auto protection"}
      </motion.p>

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
