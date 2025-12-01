import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { BsArrowLeft, BsPencilFill, BsEyeFill, BsTrashFill, BsPlusCircleFill, BsFileText, BsSaveFill } from 'react-icons/bs'; // Import Bootstrap Icons
import SubtaskItem from '../components/SubtaskItem';
import ConfirmationModal from '../components/ConfirmationModal';

export default function TaskView() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { allTasks, updateTask, deleteTask } = useOutletContext(); // Get from context
  const task = allTasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [subtasks, setSubtasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [plaintextSubtasks, setPlaintextSubtasks] = useState(''); // New state for plaintext subtasks
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
      setPriority(task.priority);
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const priorityColors = {
    High: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    Normal: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    Low: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  };

  if (!task) {
    return (
      <div className="max-w-5xl mx-auto text-slate-800 dark:text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Task not found</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back to the task list
        </Link>
      </div>
    );
  }

  function syncParentStatus(subtasks) {
    if (!subtasks) return [];

    return subtasks.map(subtask => {
      const updatedChildren = syncParentStatus(subtask.subtasks);

      let newDoneStatus = subtask.done;
      if (updatedChildren && updatedChildren.length > 0) {
        newDoneStatus = updatedChildren.every(child => child.done);
      }
      
      return { 
        ...subtask, 
        done: newDoneStatus,
        subtasks: updatedChildren 
      };
    });
  }

  function handleSubtaskUpdate(updatedSubtask) {

    function cascadeCheck(subtask, newDoneStatus) {
      const newSub = { ...subtask, done: newDoneStatus };
      if (newSub.subtasks) {
        newSub.subtasks = newSub.subtasks.map(child => cascadeCheck(child, newDoneStatus));
      }
      return newSub;
    }

    function updateAndCascade(subtasks) {
      return subtasks.map(sub => {
        if (sub.id === updatedSubtask.id) {
          return cascadeCheck(updatedSubtask, updatedSubtask.done);
        }
        if (sub.subtasks) {
          return { ...sub, subtasks: updateAndCascade(sub.subtasks) };
        }
        return sub;
      });
    }

    const cascadedSubtasks = updateAndCascade(subtasks);
    const syncedSubtasks = syncParentStatus(cascadedSubtasks);
    setSubtasks(syncedSubtasks);
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
    if (!parentId) { // If parentId is not provided, add to root subtasks
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

  function addPlaintextSubtasks() {
    const lines = plaintextSubtasks.split('\n').filter(line => line.trim() !== '');
    const newSubs = lines.map(line => ({
      id: uuidv4(),
      title: line.trim(),
      done: false,
      subtasks: [],
    }));
    setSubtasks(prev => [...prev, ...newSubs]);
    setPlaintextSubtasks(''); // Clear the textarea after adding
  }

  function handleUpdate(e) {
    e.preventDefault();
    const areAllSubtasksDone = (subtasks) => {
      return subtasks.every(sub => sub.done && areAllSubtasksDone(sub.subtasks || []));
    };
    const updatedTask = {
      ...task,
      title,
      dueDate: dueDate || null,
      priority,
      subtasks,
      done: areAllSubtasksDone(subtasks),
    };
    updateTask(updatedTask);
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      navigate('/');
    }
  }
  
  function addRootSubtask() {
    handleSubtaskAdd(null, { id: uuidv4(), title: 'New Subtask', done: false, subtasks: [], isNew: true });
    setIsEditing(true); // Ensure edit mode remains active
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
    <div className="max-w-5xl mx-auto">
      <div className="p-8 rounded-lg shadow-md dark:shadow-none bg-white dark:bg-slate-800">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <BsArrowLeft className="inline-block" /> Back to Task List
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              {isEditing ? <><BsEyeFill className="inline-block" /> View Mode</> : <><BsPencilFill className="inline-block" /> Edit Mode</>}
            </button>
            {isEditing && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
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
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </>
            ) : (
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold break-words">{renderTextWithLinks(title)}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[priority] || priorityColors.Normal}`}>
                  {priority || 'Normal'}
                </span>
                {task.dueDate && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Due: {format(parseISO(task.dueDate), 'MMM d, h:mm a')}
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
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
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
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="e.g.,&#10;Subtask 1&#10;Subtask 2&#10;Subtask 3"
                ></textarea>
                <button
                  type="button"
                  onClick={addPlaintextSubtasks}
                  className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <BsFileText className="inline-block" /> Add from Text
                </button>
              </div>
            )}
            <div className="mt-4">
              {subtasks.map(sub => (
                <SubtaskItem
                  key={sub.id}
                  subtask={sub}
                  onUpdate={handleSubtaskUpdate}
                  onDelete={handleSubtaskDelete}
                  onAdd={handleSubtaskAdd}
                  isEditing={isEditing}
                />
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Due Date</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/3">
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
          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors flex items-center gap-2 justify-center"
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
