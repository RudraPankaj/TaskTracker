import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import { TasksContext } from './context/TasksContext';
import { taskActionTypes } from './reducers/tasksReducer';

export default function App() {
  const { tasks, dispatch } = useContext(TasksContext);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    const saved = localStorage.getItem('remindersEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [sidebarShrunk, setSidebarShrunk] = useState(() => {
    if (window.innerWidth < 768) return true;
    const saved = localStorage.getItem('sidebarShrunk');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isDimmed, setIsDimmed] = useState(() => {
    const saved = localStorage.getItem('isDimmed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('remindersEnabled', JSON.stringify(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      localStorage.setItem('sidebarShrunk', JSON.stringify(sidebarShrunk));
    }
  }, [sidebarShrunk]);

  useEffect(() => {
    localStorage.setItem('isDimmed', JSON.stringify(isDimmed));
  }, [isDimmed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarShrunk(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  function openSettingsModal() {
    setIsSettingsModalOpen(true);
  }

  function closeSettingsModal() {
    setIsSettingsModalOpen(false);
  }

  function handleClearAllData() {
    localStorage.clear();
    dispatch({ type: taskActionTypes.SET_TASKS, payload: [] });
    // Reset settings to default
    setRemindersEnabled(true);
    setDarkMode(true);
    setSidebarShrunk(false);
    setIsDimmed(false);
    closeSettingsModal();
    // We could force a reload to make sure everything is reset
    // window.location.reload();
  }

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
        openSettingsModal={openSettingsModal}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar searchQuery={inputValue} setSearchQuery={setInputValue} />
        <main className="flex-1 pt-2 px-1 pb-1 md:p-6 overflow-y-auto">
          <Outlet context={{ allTasks: tasks, dispatch, searchQuery, remindersEnabled, darkMode }} />
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        remindersEnabled={remindersEnabled}
        toggleReminders={toggleReminders}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isDimmed={isDimmed}
        toggleDimming={toggleDimming}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}
