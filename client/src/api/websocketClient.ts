import { QueryClient } from 'react-query';

class WebSocketClient {
  private socket: WebSocket;

  constructor(url: string, queryClient: QueryClient) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log('WebSocket connection established');
    this.socket.onclose = () => console.log('WebSocket connection closed');
    this.socket.onerror = (error) => console.error('WebSocket error:', error);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'TASK_ADDED') {
        queryClient.setQueryData('todos', (oldTodos: any[] = []) => [...oldTodos, message.data]);
      } else if (message.type === 'TASK_UPDATED') {
        queryClient.setQueryData('todos', (oldTodos: any[] = []) =>
          oldTodos.map((todo) => (todo.id === message.data.id ? message.data : todo))
        );
      } else if (message.type === 'TASK_DELETED') {
        queryClient.setQueryData('todos', (oldTodos: any[] = []) =>
          oldTodos.filter((todo) => todo.id !== message.data.id)
        );
      }
    };
  }

  public getSocket(): WebSocket {
    return this.socket;
  }
}

export default WebSocketClient;
