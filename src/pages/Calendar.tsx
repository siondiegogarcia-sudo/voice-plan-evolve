import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Mic, Plus, LogOut } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import TaskList from "@/components/TaskList";
import VoiceRecorder from "@/components/VoiceRecorder";
import AddTaskDialog from "@/components/AddTaskDialog";
import logo from "@/assets/logo.png";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout with Lovable Cloud
    console.log("Logout");
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TaskFlow" className="w-10 h-10" />
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Calendario
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="accent"
                  size="icon"
                  onClick={() => setShowVoiceRecorder(true)}
                  className="rounded-full"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  variant="gradient"
                  size="icon"
                  onClick={() => setShowAddTask(true)}
                  className="rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Tasks Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <h2 className="text-2xl font-bold">
              Tareas del día
            </h2>
            <TaskList selectedDate={selectedDate} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showVoiceRecorder && (
        <VoiceRecorder onClose={() => setShowVoiceRecorder(false)} />
      )}
      {showAddTask && (
        <AddTaskDialog
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Calendar;
