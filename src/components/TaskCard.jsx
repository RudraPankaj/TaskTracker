import { Link } from 'react-router-dom';
import { format, isBefore, isWithinInterval, addDays, parseISO } from 'date-fns';
import { BsCircle, BsCheckCircleFill, BsTrashFill } from 'react-icons/bs';

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
  const s = statusFor(task.dueDate, task.done);

  const priorityColors = {
    High: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
    Normal: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    Low: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none p-5 border dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300
      ${s === 'overdue' ? 'border-red-500/50' : 'border-slate-200'}
      ${s === 'due-soon' ? 'border-yellow-500/50' : 'border-slate-200'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 mb-2">
          <div
            onClick={() => onToggle(task.id)}
            className="cursor-pointer text-2xl" 
          >
            {task.done ? (
              <BsCheckCircleFill className="text-blue-500 dark:text-blue-400" />
            ) : (
              <BsCircle className="text-slate-400 dark:text-slate-500" />
            )}
          </div>
          <Link to={`/task/${task.id}`} className="flex-grow">
            <h3 className={`text-xl font-bold break-words ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-50'}`}>
              {task.title}
            </h3>
          </Link>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-1.5 text-xs font-semibold rounded-full ${priorityColors[task.priority] || priorityColors.Normal}`}>
            {task.priority || 'Normal'}
          </span>
          {task.dueDate && (
            <div className="text-xs text-slate-500 dark:text-gray-400">
              {format(parseISO(task.dueDate), 'MMM d, h:mm a')}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => onDelete(task.id)} className="text-xs text-red-500 dark:text-red-400 hover:underline flex items-center gap-1">
          <BsTrashFill className="inline-block text-base" /> Delete
        </button>
      </div>
    </div>
  );
}
