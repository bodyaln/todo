import { fetchTodos, createTodo, updateTodo, deleteTodo } from "../api/todoApi";

export class TaskPresenter {
  private view: any;

  constructor(view: any) {
    this.view = view;
  }

  async loadTasks() {
    const tasks = await fetchTodos();
    this.view.updateTaskList(tasks);
  }

  async addTask(title: string) {
    if (title.trim()) {
      const newTask = await createTodo({ title, completed: false });
      this.view.addTaskToView(newTask);
    }
  }

  async deleteTask(id: number) {
    await deleteTodo(id);
    this.view.removeTaskFromView(id);
  }

  async toggleTaskCompletion(task: { id: number; title: string; completed: boolean }) {
    const updatedTask = await updateTodo(task.id, {
      ...task,
      completed: !task.completed,
    });
    this.view.updateTaskInView(updatedTask);
  }

  async clearAllTasks() {
    const tasks = await fetchTodos();
    for (const task of tasks) {
      await deleteTodo(task.id);
    }
    this.view.clearTaskList();
  }
}
