import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function TaskListView() {
  const { tasks, setTasks, deleteTask, toggleComplete, searchQuery } = useOutletContext();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [tasks]);

  function handleOpenNewTask() {
    navigate('/new-task');
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your Tasks</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Here's what's on your plate for today.
        </p>
      </header>
      <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <TaskList
          tasks={tasks}
          setTasks={setTasks} // Pass the original setTasks for reordering
          onDelete={deleteTask}
          onToggle={toggleComplete}
          onOpenNew={handleOpenNewTask} // Pass the new handler
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
