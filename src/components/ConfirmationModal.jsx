import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, url }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Redirect Confirmation</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-2">You are about to be redirected to the following external URL:</p>
        <p className="text-blue-600 dark:text-blue-400 break-all mb-6">
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Visit URL
          </button>
        </div>
      </div>
    </div>
  );
}
