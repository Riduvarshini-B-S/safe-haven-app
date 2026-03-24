import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    phone: "",
    address: "",
    bloodGroup: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      toast({ title: "Required fields missing", description: "Please enter your name and phone number.", variant: "destructive" });
      return;
    }
    localStorage.setItem("safeguard_user", JSON.stringify(form));
    localStorage.setItem("safeguard_onboarded", "true");
    toast({ title: "Profile saved!", description: "Welcome to SafeGuard AI." });
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-8 safe-area-top">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/get-started")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold">Personal Details</h1>
          <p className="text-xs text-muted-foreground">Help us keep you safe</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-5">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <User className="w-4 h-4" /> Personal Information
          </div>
          <div className="space-y-3 bg-card border border-border rounded-2xl p-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name *</Label>
              <Input placeholder="Enter your full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Age</Label>
                <Input type="number" placeholder="Age" value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Blood Group</Label>
                <Input placeholder="e.g. O+" value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Phone className="w-4 h-4" /> Contact Details
          </div>
          <div className="space-y-3 bg-card border border-border rounded-2xl p-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Phone Number *</Label>
              <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Home Address</Label>
              <Input placeholder="Your home address" value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Heart className="w-4 h-4" /> Emergency Contact
          </div>
          <div className="space-y-3 bg-card border border-border rounded-2xl p-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Contact Name</Label>
              <Input placeholder="Emergency contact name" value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input type="tel" placeholder="Phone" value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Relation</Label>
                <Input placeholder="e.g. Mother" value={form.emergencyRelation} onChange={(e) => update("emergencyRelation", e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button type="submit" className="w-full h-12 text-base rounded-2xl">
            Save & Continue
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
