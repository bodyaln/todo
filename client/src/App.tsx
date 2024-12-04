// src/App.tsx
import { QueryClient, QueryClientProvider } from 'react-query';
import {TaskList} from './components/TaskList/TaskList';
import "./App.scss"

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='wrapper'>
        <TaskList />
      </div>
    </QueryClientProvider>
  );
};

export default App;
