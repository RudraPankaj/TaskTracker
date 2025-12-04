import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { BsPlusCircleFill, BsFileText } from 'react-icons/bs';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import SubtaskItem from './SubtaskItem';

export default function NewTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [subtasks, setSubtasks] = useState([]);
  const [plaintextSubtasks, setPlaintextSubtasks] = useState('');
  const navigate = useNavigate();

  function handleSubtaskUpdate(updatedSubtask) {
    const newSubtasks = subtasks.map(function update(sub) {
      if (sub.id === updatedSubtask.id) {
        return updatedSubtask;
      }
      if (sub.subtasks) {
        return { ...sub, subtasks: sub.subtasks.map(update) };
      }
      return sub;
    });
    setSubtasks(newSubtasks);
  }

  function handleSubtaskDelete(subtaskId) {
    const newSubtasks = subtasks.filter(function filter(sub) {
      if (sub.id === subtaskId) {
        return false;
      }
      if (sub.subtasks) {
        sub.subtasks = sub.subtasks.filter(filter);
      }
      return true;
    });
    setSubtasks(newSubtasks);
  }

  function handleSubtaskAdd(parentId, newSubtask) {
    if (!parentId) {
      setSubtasks([...subtasks, newSubtask]);
      return;
    }
    const newSubtasks = subtasks.map(function add(sub) {
      if (sub.id === parentId) {
        return { ...sub, subtasks: [...(sub.subtasks || []), newSubtask] };
      }
      if (sub.subtasks) {
        return { ...sub, subtasks: sub.subtasks.map(add) };
      }
      return sub;
    });
    setSubtasks(newSubtasks);
  }

  function addRootSubtask() {
    handleSubtaskAdd(null, { id: uuidv4(), title: 'New Subtask', done: false, subtasks: [] });
  }

  function addPlaintextSubtasks() {
    const lines = plaintextSubtasks.split('\n').filter(line => line.trim() !== '');
    const newSubs = lines.map(line => ({
      id: uuidv4(),
      title: line.trim(),
      done: false,
      subtasks: [],
    }));
    setSubtasks(prev => [...prev, ...newSubs]);
    setPlaintextSubtasks('');
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(items);
  }

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');

    const areAllSubtasksDone = (subtasks) => {
      return subtasks.every(sub => sub.done && areAllSubtasksDone(sub.subtasks || []));
    };

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      dueDate: dueDate || null,
      priority,
      done: areAllSubtasksDone(subtasks),
      createdAt: new Date().toISOString(),
      subtasks,
    };
    onAdd(newTask);
    navigate('/');
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-lg shadow-lg w-full text-slate-800 dark:text-white overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Add New Task</h3>
      </div>
      <form onSubmit={submit} className="space-y-6 h-full flex flex-col">
        <div>
          <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 flex-1">
          <div className="flex items-center gap-4 mb-2">
            <button
              type="button"
              onClick={addRootSubtask}
              className="btn-primary px-3 py-1 text-xs flex items-center gap-1"
            >
              <BsPlusCircleFill className="inline-block" /> Add Subtask
            </button>
          </div>
          
          <div className="mt-4">
            <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Add Multiple Subtasks (one per line)</label>
            <textarea
              value={plaintextSubtasks}
              onChange={(e) => setPlaintextSubtasks(e.target.value)}
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="e.g.,&#10;Subtask 1&#10;Subtask 2"
            ></textarea>
            <button
              type="button"
              onClick={addPlaintextSubtasks}
              className="mt-2 btn-secondary px-3 py-1 text-xs flex items-center gap-1"
            >
              <BsFileText className="inline-block" /> Add from Text
            </button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="subtasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
                  {subtasks.map((sub, index) => (
                    <SubtaskItem
                      key={sub.id}
                      subtask={sub}
                      index={index}
                      onUpdate={handleSubtaskUpdate}
                      onDelete={handleSubtaskDelete}
                      onAdd={handleSubtaskAdd}
                      isEditing={true}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Due date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="w-full btn-success flex items-center gap-2 justify-center"
          >
            <BsPlusCircleFill className="inline-block text-lg" /> Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

