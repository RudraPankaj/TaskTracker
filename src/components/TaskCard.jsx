import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format, isBefore, isWithinInterval, addDays, parseISO } from 'date-fns';
import { BsCircle, BsCheckCircleFill, BsTrashFill, BsAlarmFill, BsStopwatch } from 'react-icons/bs';

function statusFor(due, done) {
  if (!due) return null;
  const now = new Date();
  const dueDate = typeof due === 'string' ? parseISO(due) : due;
  if (done) return 'done';
  if (isBefore(dueDate, now)) return 'overdue';
  if (isWithinInterval(dueDate, { start: now, end: addDays(now, 1) })) return 'due-soon';
  return null;
}

export default function TaskCard({ task, onDelete, onToggle }) {
  const [remainingTime, setRemainingTime] = useState('');
  const s = statusFor(task.dueDate, task.done);

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
    if (task.dueDate) {
      const interval = setInterval(() => {
        setRemainingTime(formatRemainingTime(task.dueDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task.dueDate]);

  const priorityColors = {
    High: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    Normal: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    Low: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none p-3 md:p-5 border dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300
      ${s === 'overdue' ? 'border-red-500/50' : 'border-slate-200'}
      ${s === 'due-soon' ? 'border-yellow-500/50' : 'border-slate-200'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <div
            onClick={() => onToggle(task.id)}
            className="cursor-pointer text-xl md:text-2xl" 
          >
            {task.done ? (
              <BsCheckCircleFill className="text-blue-500 dark:text-blue-400" />
            ) : (
              <BsCircle className="text-slate-400 dark:text-slate-500" />
            )}
          </div>
          <Link to={`/task/${task.id}`} className="flex-grow">
            <h3 className={`text-lg md:text-xl font-bold break-words ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-50'}`}>
              {task.title}
            </h3>
          </Link>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-1.5 text-xs font-semibold rounded-full ${priorityColors[task.priority] || priorityColors.Normal}`}>
            {task.priority || 'Normal'}
          </span>
          {task.dueDate && (
            <div className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
              <BsStopwatch />
              {remainingTime}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 md:mt-4">
        <button onClick={() => onDelete(task.id)} className="btn-text-danger flex items-center gap-1">
          <BsTrashFill className="inline-block text-sm md:text-base" /> Delete
        </button>
      </div>

      {s === 'overdue' && (
        <div className="absolute right-2 bottom-2 text-blue-500" title="Overdue">
          <BsAlarmFill />
        </div>
      )}
    </div>
  );
}