import { Check, Circle, Send, MapPinned, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoResponsePanelProps {
  sosTriggered: boolean;
  contactsAlerted: boolean;
  locationShared: boolean;
  audioRecording: boolean;
}

interface ActionRow {
  icon: React.ElementType;
  label: string;
  active: boolean;
}

export function AutoResponsePanel({
  sosTriggered,
  contactsAlerted,
  locationShared,
  audioRecording,
}: AutoResponsePanelProps) {
  const rows: ActionRow[] = [
    { icon: Send, label: "Alert Sent", active: sosTriggered && contactsAlerted },
    { icon: MapPinned, label: "Location Shared", active: sosTriggered && locationShared },
    { icon: Mic, label: "Audio Recording", active: audioRecording },
  ];

  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Send className="w-4 h-4 text-accent" />
        </div>
        <h3 className="font-display font-bold text-sm text-card-foreground tracking-wide">
          AUTO RESPONSE
        </h3>
        <span
          className={cn(
            "ml-auto text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
            sosTriggered
              ? "bg-danger/15 text-danger"
              : "bg-muted text-muted-foreground"
          )}
        >
          {sosTriggered ? "Triggered" : "Standby"}
        </span>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                row.active ? "bg-safe/10" : "bg-muted"
              )}
            >
              <row.icon
                className={cn(
                  "w-4 h-4",
                  row.active ? "text-safe" : "text-muted-foreground"
                )}
              />
            </div>
            <span className="text-sm font-medium text-card-foreground flex-1">
              {row.label}
            </span>
            {row.active ? (
              <Check className="w-4 h-4 text-safe" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
