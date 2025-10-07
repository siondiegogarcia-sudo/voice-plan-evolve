import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onClose: () => void;
}

const VoiceRecorder = ({ onClose }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Grabando",
        description: "Habla ahora para agregar tus tareas...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      toast({
        title: "Procesando",
        description: "Transcribiendo tu audio...",
      });
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Data }
        });

        if (error) throw error;

        setTranscription(data.text);
        setIsProcessing(false);
        
        toast({
          title: "Transcripción completa",
          description: "Revisa el texto antes de agregar las tareas",
        });
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : "No se pudo transcribir el audio";
      toast({
        title: "Error de transcripción",
        description: errorMessage.includes("AssemblyAI") || errorMessage.includes("Upload") || errorMessage.includes("Transcription")
          ? "Error al transcribir con AssemblyAI. Verifica tu conexión."
          : errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('extract-tasks', {
        body: { text: transcription }
      });

      if (error) throw error;

      console.log('Extracted tasks:', data.tasks);
      
      toast({
        title: "Tareas creadas",
        description: `${data.tasks.length} tarea(s) agregada(s) al calendario`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error extracting tasks:', error);
      toast({
        title: "Error",
        description: "No se pudieron crear las tareas",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
              {isProcessing
                ? "Procesando..."
                : isRecording
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
                disabled={isProcessing}
              >
                <Send className="h-4 w-4 mr-2" />
                {isProcessing ? "Procesando..." : "Agregar Tareas"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceRecorder;
