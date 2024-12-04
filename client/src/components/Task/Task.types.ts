export interface TaskProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
  onToggleCompleted: () => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
}
