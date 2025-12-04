
import React, { createContext, useReducer, useEffect } from 'react';
import { tasksReducer } from '../reducers/tasksReducer';
import { loadTasks, saveTasks } from '../utils/storage';

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, [], () => {
    return loadTasks();
  });

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}
