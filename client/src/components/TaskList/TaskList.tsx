import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTodos, createTodo, deleteTodo, updateTodo } from '../../api/todoApi';
import { Task } from '../Task/Task';
import { TaskType } from './TaskList.types';
import WebSocketClient from '../../api/websocketClient';
import rubish from '../../assets/rubish.png';
import plus from '../../assets/plus.png';
import '../../App.scss';

export const TaskList = () => {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const wsClient = new WebSocketClient('ws://localhost:3000', queryClient);

    return () => {
      // Очистка соединения при размонтировании компонента
      wsClient.getSocket().close();
    };
  }, [queryClient]);

  const { data: todos, isLoading, error } = useQuery<TaskType[]>('todos', fetchTodos);

  const createMutation = useMutation(createTodo, {
    onSuccess: () => queryClient.invalidateQueries('todos'),
  });

  const deleteMutation = useMutation((id: number) => deleteTodo(id), {
    onSuccess: () => queryClient.invalidateQueries('todos'),
  });

  const updateMutation = useMutation(
    (updatedTask: { id: number; title: string; completed: boolean }) =>
      updateTodo(updatedTask.id, updatedTask),
    {
      onSuccess: () => queryClient.invalidateQueries('todos'),
    }
  );

  const handleCreateTask = () => {
    if (newTask.trim()) {
      createMutation.mutate({ title: newTask, completed: false });
      setNewTask('');
    }
  };

  const handleToggleCompleted = (id: number) => {
    const task = todos?.find((t) => t.id === id);
    if (task) {
      updateMutation.mutate({ ...task, completed: !task.completed });
    }
  };

  const handleUpdateTitle = (id: number, title: string) => {
    const task = todos?.find((t) => t.id === id);
    if (task) {
      updateMutation.mutate({ ...task, title });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleClearAllTasks = async () => {
    if (todos) {
      for (const task of todos) {
        await deleteMutation.mutateAsync(task.id);
      }
      queryClient.invalidateQueries('todos');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="main">
      <h1>To do list</h1>
      <div className="enter-task">
        <input
          type="text"
          className="input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Type here to add a task..."
        />
        <div className="btn" onClick={handleCreateTask}>
          <img src={plus} alt="plus" className="plus" />
          <span className="add">Add</span>
        </div>
      </div>

      <div className="tasks">
        {todos?.map((task) => (
          <Task
            key={task.id}
            task={task}
            onToggleCompleted={() => handleToggleCompleted(task.id)}
            onUpdateTitle={(title) => handleUpdateTitle(task.id, title)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>

      <div className="clear-btn" onClick={handleClearAllTasks}>
        <img src={rubish} alt="Clear all" className="rubish-btn" />
        <span>Clear all tasks</span>
      </div>
    </div>
  );
};
