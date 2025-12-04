import React, { useState, useEffect, useReducer } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isBefore } from 'date-fns';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { BsArrowLeft, BsPencilFill, BsEyeFill, BsTrashFill, BsPlusCircleFill, BsFileText, BsSaveFill, BsStopwatch } from 'react-icons/bs';
import { subtasksReducer, actionTypes as subtaskActionTypes } from '../reducers/subtasksReducer';
import { taskActionTypes } from '../reducers/tasksReducer';
import SubtaskItem from '../components/SubtaskItem';
import ConfirmationModal from '../components/ConfirmationModal';

const TaskView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [plaintextSubtasks, setPlaintextSubtasks] = useState('');
    const [remainingTime, setRemainingTime] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [targetUrl, setTargetUrl] = useState('');
    const { allTasks: tasks, dispatch: tasksDispatch } = useOutletContext();
    const { taskId } = useParams();
    const task = tasks ? tasks.find(t => t.id === taskId) : null;
    const navigate = useNavigate();
    const [subtasks, subtasksDispatch] = useReducer(subtasksReducer, []);

  const formatRemainingTime = (dueDate) => {
    const now = new Date();
    const due = parseISO(dueDate);

    if (isBefore(due, now)) {
      return 'Overdue';
    }

    let delta = Math.abs(due - now) / 1000;

    const hours = Math.floor(delta / 3600);
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = Math.floor(delta % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (task && task.dueDate) {
      const interval = setInterval(() => {
        setRemainingTime(formatRemainingTime(task.dueDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
      setPriority(task.priority);
      subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: task.subtasks || [] });
    }
  }, [task]);

  const priorityColors = {
    High: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    Normal: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    Low: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  };

  if (!task) {
    return (
      <div className="max-w-5xl mx-auto text-slate-800 dark:text-white p-8 bg-white dark:bg-slate-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Task not found</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back to the task list
        </Link>
      </div>
    );
  }

  function updateGlobalTask(newSubtasks) {
    if (task) {
        const areAllSubtasksDone = (subtasks) => {
            return subtasks.every(sub => sub.done && areAllSubtasksDone(sub.subtasks || []));
        };
        const updatedTask = {
            ...task,
            subtasks: newSubtasks,
            done: areAllSubtasksDone(newSubtasks),
        };
        tasksDispatch({ type: taskActionTypes.UPDATE_TASK, payload: updatedTask });
    }
  }

  function handleSubtaskUpdate(updatedSubtask) {
    const newSubtasks = subtasksReducer(subtasks, {
        type: subtaskActionTypes.UPDATE_SUBTASK,
        payload: { updatedSubtask },
    });
    subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: newSubtasks });
    if (!isEditing) {
      updateGlobalTask(newSubtasks);
    }
  }

  function handleSubtaskDelete(subtaskId) {
    const newSubtasks = subtasksReducer(subtasks, {
        type: subtaskActionTypes.DELETE_SUBTASK,
        payload: { subtaskId },
    });
    subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: newSubtasks });
    if (!isEditing) {
      updateGlobalTask(newSubtasks);
    }
  }

  function handleSubtaskAdd(parentId, newSubtask) {
    const newSubtasks = subtasksReducer(subtasks, {
        type: subtaskActionTypes.ADD_SUBTASK,
        payload: { parentId, newSubtask },
    });
    subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: newSubtasks });
    if (!isEditing) {
      updateGlobalTask(newSubtasks);
    }
  }

  function addPlaintextSubtasks() {
    const lines = plaintextSubtasks.split('\n').filter(line => line.trim() !== '');
    const newSubtasks = subtasksReducer(subtasks, {
        type: subtaskActionTypes.ADD_FROM_PLAINTEXT,
        payload: { lines, uuidv4 },
    });
    subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: newSubtasks });
    if (!isEditing) {
      updateGlobalTask(newSubtasks);
    }
    setPlaintextSubtasks('');
  }

  function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    const newSubtasks = subtasksReducer(subtasks, {
        type: subtaskActionTypes.REORDER_SUBTASKS,
        payload: { source, destination, draggableId },
    });
    subtasksDispatch({ type: subtaskActionTypes.SET_SUBTASKS, payload: newSubtasks });
    if (!isEditing) {
      updateGlobalTask(newSubtasks);
    }
  }

  function handleUpdate(e) {
    e.preventDefault();
    const areAllSubtasksDone = (subtasks) => {
        return subtasks.every(sub => sub.done && areAllSubtasksDone(sub.subtasks || []));
    };

    const updatedTask = {
        ...task,
        title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        subtasks,
        done: areAllSubtasksDone(subtasks),
    };
    tasksDispatch({ type: taskActionTypes.UPDATE_TASK, payload: updatedTask });
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this task?')) {
      tasksDispatch({ type: taskActionTypes.DELETE_TASK, payload: taskId });
      navigate('/');
    }
  }

  function addRootSubtask() {
    handleSubtaskAdd(null, { id: uuidv4(), title: 'New Subtask', done: false, subtasks: [], isNew: true });
    setIsEditing(true);
  }

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setTargetUrl(url);
    setModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            onClick={(e) => handleLinkClick(e, part)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-0 sm:mx-auto">
      <div className="py-4 px-3 md:p-8 rounded-lg shadow-md dark:shadow-none bg-white dark:bg-slate-800">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <BsArrowLeft className="inline-block" /> Back to Task List
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary px-3 py-1 text-xs flex items-center gap-1 md:gap-2"
            >
              {isEditing ? <><BsEyeFill className="inline-block" /> View Mode</> : <><BsPencilFill className="inline-block" /> Edit Mode</>}</button>
            {isEditing && (
              <button
                onClick={handleDelete}
                className="btn-danger px-3 py-1 text-xs flex items-center gap-1 md:gap-2"
              >
                <BsTrashFill className="inline-block" /> Delete Task
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-6">
            {isEditing ? (
              <>
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 md:p-3 text-sm md:text-base bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </>
            ) : (
              <div className="flex items-center flex-wrap gap-2 md:gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-bold break-words">{renderTextWithLinks(title)}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[priority] || priorityColors.Normal}`}>
                  {priority || 'Normal'}
                </span>
                {task.dueDate && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <BsStopwatch />
                    {remainingTime}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            {isEditing && (
              <div className="flex items-center gap-4 mb-2">
                <button
                  type="button"
                  onClick={addRootSubtask}
                  className="btn-primary px-3 py-1 text-xs flex items-center gap-1"
                >
                  <BsPlusCircleFill className="inline-block" /> Add Subtask
                </button>
              </div>
            )}
            {isEditing && (
              <div className="mt-4">
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Add Multiple Subtasks (one per line)</label>
                <textarea
                  value={plaintextSubtasks}
                  onChange={(e) => setPlaintextSubtasks(e.target.value)}
                  className="w-full p-2 md:p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="e.g.,\nSubtask 1\nSubtask 2\nSubtask 3"
                ></textarea>
                <button
                  type="button"
                  onClick={addPlaintextSubtasks}
                  className="mt-2 btn-secondary px-3 py-1 text-xs flex items-center gap-1"
                >
                  <BsFileText className="inline-block" /> Add from Text
                </button>
              </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="mt-4">
                <Droppable droppableId="root">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {subtasks.map((sub, index) => (
                        <SubtaskItem
                          key={sub.id}
                          subtask={sub}
                          index={index}
                          onUpdate={handleSubtaskUpdate}
                          onDelete={handleSubtaskDelete}
                          onAdd={handleSubtaskAdd}
                          isEditing={isEditing}
                          parentId={null}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          </div>

          {isEditing && (
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="flex-1 w-full">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Due Date</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          )}
          {isEditing && task.dueDate && (
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
              <BsStopwatch />
              {remainingTime}
            </div>
          )}
          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <BsSaveFill className="inline-block text-lg" /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmRedirect}
        url={targetUrl}
      />
    </div>
  );

}

export default TaskView;