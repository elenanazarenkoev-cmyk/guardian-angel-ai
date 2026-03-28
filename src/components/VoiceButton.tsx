import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  onResult: (text: string) => void;
  promptText?: string;
}

const VoiceButton = ({ onResult, promptText = "Нажмите и говорите" }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.start();
  }, [onResult, supported]);

  if (!supported) return null;

  return (
    <button
      onClick={startListening}
      className={`touch-zone w-full rounded-2xl p-6 flex items-center justify-center gap-4
        text-xl font-semibold transition-all duration-300 select-none
        ${isListening
          ? "bg-primary text-primary-foreground animate-listening glow-safe"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      aria-label={isListening ? "Слушаю вашу команду" : promptText}
      role="button"
    >
      {isListening ? (
        <>
          <Mic className="w-8 h-8" aria-hidden="true" />
          <span>Слушаю...</span>
        </>
      ) : (
        <>
          <MicOff className="w-8 h-8" aria-hidden="true" />
          <span>{promptText}</span>
        </>
      )}
    </button>
  );
};

export default VoiceButton;
