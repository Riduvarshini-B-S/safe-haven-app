import { motion } from "framer-motion";
import { Shield, MapPin, Mic, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, title: "AI Risk Detection", desc: "Smart behavior analysis keeps you safe" },
  { icon: MapPin, title: "Live Tracking", desc: "Real-time GPS location monitoring" },
  { icon: Mic, title: "Voice Detection", desc: "Stress detection via microphone" },
  { icon: Bell, title: "Instant SOS", desc: "One-tap emergency alert system" },
];

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 safe-area-top safe-area-bottom">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">SafeGuard AI</h1>
        <p className="text-muted-foreground text-sm">AI-Based Women Safety System</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full grid grid-cols-2 gap-3 my-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">{f.title}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{f.desc}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full space-y-3"
      >
        <Button className="w-full h-12 text-base rounded-2xl" onClick={() => navigate("/personal-details")}>
          Get Started
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          Your safety is our priority. All data stays on your device.
        </p>
      </motion.div>
    </div>
  );
}
