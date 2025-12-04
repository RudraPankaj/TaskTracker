import React, { useState } from 'react';
import { BsX, BsTrash } from 'react-icons/bs';

export default function SettingsModal({
  isOpen,
  onClose,
  remindersEnabled,
  toggleReminders,
  darkMode,
  toggleDarkMode,
  isDimmed,
  toggleDimming,
  onClearAllData,
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  if (!isOpen) return null;

  console.log("isDimmed:", isDimmed);

  const handleProceedWithDeletion = () => {
    onClearAllData();
    setIsConfirmingDelete(false);
    setDeleteConfirmationInput('');
  };

  const handleCancelDeletion = () => {
    setIsConfirmingDelete(false);
    setDeleteConfirmationInput('');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 md:p-6 mx-4 max-w-sm md:max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-3 md:pb-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <BsX className="text-xl md:text-2xl" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Toggles */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
            <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${darkMode ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Enable Reminders</span>
            <button onClick={toggleReminders} className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${remindersEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${remindersEnabled ? 'translate-x-6' : 'translate-x-1'}`}></span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Eye Care Mode</span>
            <button onClick={toggleDimming} className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${isDimmed ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${isDimmed ? 'translate-x-6' : 'translate-x-1'}`}></span>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <h3 className="text-base md:text-lg font-semibold text-red-500">Danger Zone</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">This will permanently delete all your tasks and saved settings.</p>
            
            {!isConfirmingDelete && (
              <button 
                onClick={() => setIsConfirmingDelete(true)} 
                className="btn-danger w-full flex items-center justify-center gap-2"
              >
                <BsTrash /> Clear All Data
              </button>
            )}

            {isConfirmingDelete && (
              <div className="mt-4 p-3 md:p-4 bg-red-100 dark:bg-red-900/20 rounded-lg space-y-2">
                <label htmlFor="delete-confirm" className="text-sm font-semibold text-red-700 dark:text-red-300">Type "DeleteAllTasks" to confirm:</label>
                <input
                    id="delete-confirm"
                    type="text"
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-700 rounded-lg border border-red-300 dark:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                      onClick={handleCancelDeletion}
                      className="btn-secondary"
                  >
                      Cancel
                  </button>
                  <button
                      onClick={handleProceedWithDeletion}
                      disabled={deleteConfirmationInput !== 'DeleteAllTasks'}
                      className="btn-danger disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                  >
                      Proceed with deletion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
