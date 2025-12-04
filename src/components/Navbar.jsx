import React from 'react';
import { BsSearch } from 'react-icons/bs';

export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="py-2 px-1 md:p-4 flex justify-center items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 rounded-full py-2 px-4 pl-8 md:pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 focus:w-64 md:w-64 md:focus:w-96 transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
          <BsSearch className="text-slate-400 dark:text-slate-500" />
        </div>
      </div>
    </nav>
  );
}
