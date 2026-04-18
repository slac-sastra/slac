"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VoiceMicButton } from "@/components/ui/voice-mic-button";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { cn } from "@/lib/utils";

interface VoiceInputProps extends React.ComponentProps<"input"> {
  inputType?: "input" | "textarea";
  onVoiceInput: (text: string) => void;
  languageCode?: string;
}

export const VoiceInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  VoiceInputProps
>(
  (
    {
      inputType = "input",
      onVoiceInput,
      languageCode = "unknown",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      isRecording,
      isProcessing,
      error,
      startRecording,
      stopRecording,
    } = useVoiceInput({
      languageCode,
      onTranscript: (text) => {
        onVoiceInput(text);
      },
    });

    const handleToggle = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    return (
      <div className="relative w-full">
        {inputType === "textarea" ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            disabled={disabled}
            className={cn("pr-12", className)}
            {...(props as any)}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            disabled={disabled}
            className={cn("pr-12", className)}
            {...(props as any)}
          />
        )}

        <VoiceMicButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onToggle={handleToggle}
          disabled={disabled}
          className={inputType === "textarea" ? "top-4 translate-y-0 right-3" : ""}
        />

        {error && (
          <p className="absolute -bottom-6 left-1 text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

VoiceInput.displayName = "VoiceInput";
