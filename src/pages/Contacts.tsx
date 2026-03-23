import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Phone, UserCircle } from "lucide-react";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const { contacts, addContact, removeContact } = useEmergencyContacts();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Please fill name and phone", variant: "destructive" });
      return;
    }
    addContact({ name: name.trim(), phone: phone.trim(), relationship: relationship.trim() || "Other" });
    setName("");
    setPhone("");
    setRelationship("");
    setShowForm(false);
    toast({ title: `${name} added as emergency contact` });
  };

  return (
    <div className="min-h-screen pb-24 safe-area-top">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold">Emergency Contacts</h1>
          <p className="text-xs text-muted-foreground">{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 overflow-hidden"
          >
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-3 mb-4">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              <Input placeholder="Relationship (e.g. Mother, Friend)" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1 bg-primary text-primary-foreground">Save</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 space-y-3">
        {contacts.length === 0 && !showForm && (
          <div className="text-center py-12">
            <UserCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No emergency contacts yet</p>
            <p className="text-xs text-muted-foreground">Add contacts to receive SOS alerts</p>
          </div>
        )}

        <AnimatePresence>
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.phone} · {contact.relationship}</p>
              </div>
              <button
                onClick={() => {
                  removeContact(contact.id);
                  toast({ title: `${contact.name} removed` });
                }}
                className="p-2 rounded-xl hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
