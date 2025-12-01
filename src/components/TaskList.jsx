import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';;
import TaskCard from './TaskCard';

export default function TaskList({ tasks, setTasks, onDelete, onToggle, onOpenNew, searchQuery }) {
  const isSearchActive = searchQuery && searchQuery.length > 0;

  function onDragEnd(result) {
    if (!result.destination || isSearchActive) return;
    const copy = Array.from(tasks);
    const [moved] = copy.splice(result.source.index, 1);
    copy.splice(result.destination.index, 0, moved);
    setTasks(copy);
  }

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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tasks.length === 0 ? (
                <div className="p-6 bg-gray-800 rounded-lg text-center text-slate-300 col-span-full">
                  <p>{isSearchActive ? 'No tasks match your search.' : 'No tasks yet.'}</p>
                  {!isSearchActive && (
                    <button
                      className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
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
