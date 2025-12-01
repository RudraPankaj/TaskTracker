import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BsCircle, BsCheckCircleFill, BsPlusCircleFill, BsTrashFill } from 'react-icons/bs';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import ConfirmationModal from './ConfirmationModal';

export default function SubtaskItem({
  subtask,
  index,
  onUpdate,
  onDelete,
  onAdd,
  isEditing: parentIsEditing,
  parentId,
}) {
  const [isEditing, setIsEditing] = useState(parentIsEditing || subtask.isNew);
  const [title, setTitle] = useState(subtask.title);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');

  function handleUpdate() {
    onUpdate({ ...subtask, title });

    if (!subtask.isNew) {
      setIsEditing(false);
    }
  }

  function handleDelete() {
    onDelete(subtask.id);
  }

  function handleAddSubtask() {
    const newSubtask = {
      id: uuidv4(),
      title: 'New Subtask',
      done: false,
      subtasks: [],
      isNew: true,
    };
    onAdd(subtask.id, newSubtask);
  }

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setTargetUrl(url);
    setModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            onClick={(e) => handleLinkClick(e, part)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const canEdit = parentIsEditing;

  return (
    <Draggable draggableId={subtask.id} index={index} isDragDisabled={!canEdit}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="ml-8 mt-2 group"
        >
          <div className="flex items-center gap-3 w-full">
            <div
              onClick={() => onUpdate({ ...subtask, done: !subtask.done })}
              className="cursor-pointer text-2xl"
            >
              {subtask.done ? <BsCheckCircleFill className="text-blue-500 dark:text-blue-400" /> : <BsCircle className="text-slate-400 dark:text-slate-500" />}
            </div>
            <div className="flex-grow min-w-0">
              {isEditing && canEdit ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdate}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUpdate();
                      onAdd(parentId, { id: uuidv4(), title: '', done: false, subtasks: [], isNew: true });
                    }
                  }}
                  className="bg-slate-100 dark:bg-slate-700 outline-none px-2 py-1 rounded basis-0 flex-grow w-full"
                  autoFocus
                />
              ) : (
                <span
                  className={`text-slate-700 dark:text-slate-300 ${subtask.done ? 'line-through text-slate-400 dark:text-slate-500' : ''} whitespace-pre-wrap break-words`}
                  onDoubleClick={() => canEdit && setIsEditing(true)}
                >
                  {renderTextWithLinks(subtask.title)}
                </span>
              )}
            </div>
            {canEdit && (
              <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={handleAddSubtask} className="text-slate-500 hover:text-blue-500 p-1 rounded-md">
                  <BsPlusCircleFill className="inline-block text-base" />
                </button>
                <button onClick={handleDelete} className="text-slate-500 hover:text-red-500 p-1 rounded">
                  <BsTrashFill className="inline-block text-base" />
                </button>
              </div>
            )}
          </div>
          <Droppable droppableId={subtask.id} type="subtask">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-2 border-l-2 border-slate-200 dark:border-slate-700"
              >
                {subtask.subtasks && subtask.subtasks.map((child, index) => (
                  <SubtaskItem
                    key={child.id}
                    subtask={child}
                    index={index}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    isEditing={parentIsEditing}
                    parentId={subtask.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <ConfirmationModal
            isOpen={modalOpen}
            onClose={closeModal}
            onConfirm={handleConfirmRedirect}
            url={targetUrl}
          />
        </div>
      )}
    </Draggable>
  );
}
