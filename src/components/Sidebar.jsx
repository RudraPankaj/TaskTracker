import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BsPlusCircleDotted, 
  BsArrowCounterclockwise, 
  BsBell, 
  BsBellSlash, 
  BsMoon, 
  BsSun, 
  BsGear,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsEye,
  BsEyeSlash
} from 'react-icons/bs'; // Import Bootstrap Icons

export default function Sidebar({ 
  remindersEnabled, 
  toggleReminders, 
  clearSearch, 
  darkMode, 
  toggleDarkMode,
  isShrunk,
  toggleShrink,
  isDimmed,
  toggleDimming,
  openSettingsModal
}) {
  return (
    <aside className={`${isShrunk ? 'w-16' : 'w-64'} py-4 ${isShrunk ? 'px-2' : 'px-4'} bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full`}>
      <div className="flex-grow overflow-y-auto">
        <Link to="/" className={`flex items-center mb-4 md:mb-6 ${isShrunk ? 'justify-center' : 'justify-start'} cursor-pointer`}>
          <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl flex-shrink-0 font-bold text-slate-600 dark:text-slate-200">
            TT
          </div>
          <div className={`ml-3 ${isShrunk ? 'hidden' : 'block'}`}>
            <div className="text-slate-800 dark:text-white font-semibold">Task Tracker</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Organize your day</div>
          </div>
        </Link>

        <nav className="mb-6 flex flex-col gap-1">
          <Link
            to="/new-task"
            className={`w-full text-left py-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2`}
          >
            <BsPlusCircleDotted className="text-lg" /> <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Add New Task</span>
          </Link>
          <button
            className={`w-full text-left py-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2`}
            onClick={clearSearch}
          >
            <BsArrowCounterclockwise className="text-lg" /> <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Clear Search</span>
          </button>
          <button
            onClick={openSettingsModal}
            className={`w-full text-left py-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2`}
          >
            <BsGear className="text-lg" /> <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Settings</span>
          </button>

          <div className="border-b dark:border-slate-700 my-2 md:my-4"></div>

          <div 
            className={`py-2 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2 text-slate-600 dark:text-slate-300 ${isShrunk && 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded'}`}
            onClick={isShrunk ? toggleReminders : undefined}
          >
            {remindersEnabled ? <BsBell className="text-lg" /> : <BsBellSlash className="text-lg" />}
            <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Reminders</span>
            {!isShrunk && (
              <button
                onClick={toggleReminders}
                className={`ml-auto w-10 h-5 rounded-full flex items-center transition-colors duration-300 ${remindersEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span
                  className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${remindersEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                ></span>
              </button>
            )}
          </div>
          <div 
            className={`py-2 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2 text-slate-600 dark:text-slate-300 ${isShrunk && 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded'}`}
            onClick={isShrunk ? toggleDarkMode : undefined}
          >
            {darkMode ? <BsMoon className="text-lg" /> : <BsSun className="text-lg" />}
            <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Theme</span>
            {!isShrunk && (
              <button
                onClick={toggleDarkMode}
                className={`ml-auto w-10 h-5 rounded-full flex items-center transition-colors duration-300 ${darkMode ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span
                  className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-1'}`}
                ></span>
              </button>
            )}
          </div>
          <div 
            className={`py-2 flex items-center ${isShrunk ? 'justify-center px-2' : 'justify-start px-3'} gap-1 md:gap-2 text-slate-600 dark:text-slate-300 ${isShrunk && 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded'}`}
            onClick={isShrunk ? toggleDimming : undefined}
          >
            {isDimmed ? <BsEye className="text-lg" /> : <BsEyeSlash className="text-lg" />}
            <span className={`${isShrunk ? 'hidden' : 'inline'}`}>Eye Care</span>
            {!isShrunk && (
              <button
                onClick={toggleDimming}
                className={`ml-auto w-10 h-5 rounded-full flex items-center transition-colors duration-300 ${isDimmed ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span
                  className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${isDimmed ? 'translate-x-5' : 'translate-x-1'}`}
                ></span>
              </button>
            )}
          </div>
        </nav>
      </div>

      <footer className="mt-auto text-xs text-slate-500 dark:text-slate-400 text-center pt-2 md:pt-4 border-t border-slate-200 dark:border-slate-700">
         <button 
          onClick={toggleShrink} 
          className="w-full text-left py-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hidden md:flex items-center justify-center gap-2"
        >
          {isShrunk ? <BsChevronDoubleRight className="text-lg" /> : <BsChevronDoubleLeft className="text-lg" />}
          <span className={isShrunk ? 'hidden' : 'inline'}>Collapse</span>
        </button>
        <div className={`mt-2 ${isShrunk ? 'hidden' : 'block'}`}>
          <a
            href="https://rudrapankaj.github.io/MyPortfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            &lt;/&gt; Meet the developer
          </a>
        </div>
      </footer>
    </aside>
  );
}
