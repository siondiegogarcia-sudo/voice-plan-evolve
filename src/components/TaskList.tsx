import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface TaskListProps {
  selectedDate: Date;
}

// Mock data - TODO: Replace with real data from Lovable Cloud
const mockTasks = [
  {
    id: "1",
    title: "Reunión con equipo de diseño",
    time: "09:00",
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Revisar propuesta de proyecto",
    time: "11:30",
    completed: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Llamada con cliente",
    time: "14:00",
    completed: true,
    priority: "high",
  },
  {
    id: "4",
    title: "Actualizar documentación",
    time: "16:00",
    completed: false,
    priority: "low",
  },
];

const TaskList = ({ selectedDate }: TaskListProps) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Normal";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <p className="text-sm capitalize">{formatDate(selectedDate)}</p>
        </div>
      </Card>

      {mockTasks.length > 0 ? (
        <div className="space-y-3">
          {mockTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 transition-smooth hover:shadow-md ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-medium ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(task.priority)}
                    >
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No hay tareas para este día
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Usa el botón + o el micrófono para agregar tareas
          </p>
        </Card>
      )}
    </div>
  );
};

export default TaskList;
