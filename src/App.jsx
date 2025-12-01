import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { loadTasks, saveTasks } from './utils/storage';
import { sampleTasks } from './utils/sampleData';

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks() || sampleTasks);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarShrunk, setSidebarShrunk] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const t = setInterval(() => setTasks((ts) => [...ts]), 60000); // trigger re-render every minute
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    if (searchQuery && location.pathname !== '/') {
      navigate('/');
    }
  }, [searchQuery, navigate, location.pathname]);

  function toggleReminders() {
    setRemindersEnabled(prev => !prev);
  }

  function toggleDarkMode() {
    setDarkMode(prev => !prev);
  }

  function toggleSidebar() {
    setSidebarShrunk(prev => !prev);
  }

  function toggleDimming() {
    setIsDimmed(prev => !prev);
  }

  function addTask(newTask) {
    setTasks((prev) => [...prev, newTask]);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTask(updatedTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  function toggleComplete(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <div className={`h-screen flex text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 overflow-hidden transition-all duration-300 ${isDimmed ? 'filter brightness-75' : ''}`}>
      <Sidebar 
        remindersEnabled={remindersEnabled} 
        toggleReminders={toggleReminders}
        clearSearch={() => setInputValue('')}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isShrunk={sidebarShrunk}
        toggleShrink={toggleSidebar}
        isDimmed={isDimmed}
        toggleDimming={toggleDimming}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar searchQuery={inputValue} setSearchQuery={setInputValue} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet context={{ allTasks: tasks, tasks: filteredTasks, setTasks, addTask, deleteTask, updateTask, toggleComplete, searchQuery, remindersEnabled, toggleReminders, darkMode, toggleDarkMode }} />
        </main>
      </div>
    </div>
  );
}
