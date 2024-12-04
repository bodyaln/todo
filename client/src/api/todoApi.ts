// src/api/todoApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTodo = async (newTodo: { title: string; completed: boolean }) => {
  const response = await axios.post(API_URL, newTodo);
  return response.data;
};

export const updateTodo = async (id: number, updatedTodo: { title: string; completed: boolean }) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedTodo);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
