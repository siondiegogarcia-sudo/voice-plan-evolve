import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onClose: () => void;
}

const VoiceRecorder = ({ onClose }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    // TODO: Implement actual voice recording with Web Speech API
    toast({
      title: "Grabando",
      description: "Habla ahora para agregar tus tareas...",
    });

    // Mock transcription for demonstration
    setTimeout(() => {
      setTranscription("Mañana a las 10:00 reunión con el equipo de marketing. A las 3:00 llamar al cliente importante.");
      setIsRecording(false);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Grabación detenida",
      description: "Procesando tu audio...",
    });
  };

  const handleSubmit = () => {
    // TODO: Send transcription to backend for processing with Lovable Cloud
    toast({
      title: "Tareas creadas",
      description: "Tus tareas han sido agregadas al calendario",
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Tareas por Voz</DialogTitle>
          <DialogDescription>
            Graba un mensaje describiendo tus tareas y las agregaremos automáticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recording Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "gradient"}
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-24 w-24 rounded-full ${
                isRecording ? "animate-pulse-glow" : ""
              }`}
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isRecording
                ? "Escuchando..."
                : transcription
                ? "Transcripción completa"
                : "Presiona para comenzar a grabar"}
            </p>
          </div>

          {/* Transcription Display */}
          {transcription && (
            <div className="p-4 bg-secondary rounded-lg space-y-4 animate-fade-in">
              <div>
                <h4 className="font-medium mb-2">Transcripción:</h4>
                <p className="text-sm text-muted-foreground">{transcription}</p>
              </div>

              <Button
                onClick={handleSubmit}
                variant="accent"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Agregar Tareas
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceRecorder;
