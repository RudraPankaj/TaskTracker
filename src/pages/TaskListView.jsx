import React, { useState, useEffect, useMemo } from 'react';
import TaskList from '../components/TaskList';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { taskActionTypes } from '../reducers/tasksReducer';

export default function TaskListView() {
  const { allTasks, dispatch, searchQuery } = useOutletContext();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [allTasks]);

  function handleOpenNewTask() {
    navigate('/new-task');
  }
  
  const filteredTasks = useMemo(() => {
    const tasks = allTasks || [];
    if (!searchQuery) return tasks;
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTasks, searchQuery]);

  function handleDelete(id) {
    dispatch({ type: taskActionTypes.DELETE_TASK, payload: id });
  }

  function handleToggle(id) {
    console.log('Toggling task with id:', id);
    const task = allTasks.find(t => t.id === id);
    if(task) {
      console.log('Found task:', task);
      dispatch({ type: taskActionTypes.UPDATE_TASK, payload: { ...task, done: !task.done } });
    }
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    dispatch({
      type: taskActionTypes.REORDER_TASKS,
      payload: {
        source: result.source,
        destination: result.destination,
      },
    });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">Your Tasks</h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Here's what's on your plate for today.
        </p>
      </header>
      <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <TaskList
          tasks={filteredTasks}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onOpenNew={handleOpenNewTask}
          searchQuery={searchQuery}
          onDragEnd={onDragEnd}
        />
      </div>
    </div>
  );
}

