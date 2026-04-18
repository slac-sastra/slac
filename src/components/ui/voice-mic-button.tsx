import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isRecording: boolean;
  isProcessing: boolean;
  onToggle: () => void;
}

export function VoiceMicButton({
  isRecording,
  isProcessing,
  onToggle,
  className,
  disabled,
  ...props
}: VoiceMicButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || isProcessing}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isRecording
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20 animate-pulse-glow-red"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        (disabled || isProcessing) && "opacity-50 cursor-not-allowed",
        className
      )}
      title={isRecording ? "Stop recording" : "Start voice input"}
      {...props}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}
