import { useState, useEffect, useCallback } from "react";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const STORAGE_KEY = "safety-emergency-contacts";

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = useCallback((contact: Omit<EmergencyContact, "id">) => {
    setContacts((prev) => [
      ...prev,
      { ...contact, id: crypto.randomUUID() },
    ]);
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateContact = useCallback(
    (id: string, updates: Partial<Omit<EmergencyContact, "id">>) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

  return { contacts, addContact, removeContact, updateContact };
}
