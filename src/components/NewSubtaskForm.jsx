import React, { useState } from 'react';
import { BsXCircleFill, BsPlusCircleFill } from 'react-icons/bs'; // Import Bootstrap Icons

export default function NewSubtaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;
    onAdd(title);
    setTitle('');
    onClose();
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Subtask title"
          className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 rounded flex items-center gap-1">
            <BsXCircleFill className="inline-block text-base" /> Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded flex items-center gap-1">
            <BsPlusCircleFill className="inline-block text-base" /> Add Subtask
          </button>
        </div>
      </form>
    </div>
  );
}
