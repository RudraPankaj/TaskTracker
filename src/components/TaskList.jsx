import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, onDelete, onToggle, onOpenNew, searchQuery, onDragEnd }) {
  const isSearchActive = searchQuery && searchQuery.length > 0;

  const taskCards = tasks.map((task, idx) => (
    <Draggable key={task.id} draggableId={task.id} index={idx} isDragDisabled={isSearchActive}>
      {(prov) => (
        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
          <TaskCard task={task} onDelete={onDelete} onToggle={onToggle} />
        </div>
      )}
    </Draggable>
  ));

  return (
    <>
      {isSearchActive && tasks.length > 0 && (
        <div className="mb-4 text-white">
          Showing search results for: <strong>"{searchQuery}"</strong>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {tasks.length === 0 ? (
                <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg text-center text-slate-500 dark:text-slate-300 col-span-full">
                  <p>{isSearchActive ? 'No tasks match your search.' : 'No tasks yet.'}</p>
                  {!isSearchActive && (
                    <button
                      className="mt-4 btn-primary"
                      onClick={onOpenNew}
                    >
                      Add New Task
                    </button>
                  )}
                </div>
              ) : (
                taskCards
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

