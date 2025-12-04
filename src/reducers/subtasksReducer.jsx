
// src/reducers/subtasksReducer.js

export const actionTypes = {
  SET_SUBTASKS: 'SET_SUBTASKS',
  ADD_SUBTASK: 'ADD_SUBTASK',
  DELETE_SUBTASK: 'DELETE_SUBTASK',
  UPDATE_SUBTASK: 'UPDATE_SUBTASK',
  REORDER_SUBTASKS: 'REORDER_SUBTASKS',
  ADD_FROM_PLAINTEXT: 'ADD_FROM_PLAINTEXT',
};

// Pure utility functions for recursive operations
function findSubtask(subtasks, subtaskId) {
  for (const sub of subtasks) {
    if (sub.id === subtaskId) return sub;
    if (sub.subtasks) {
      const found = findSubtask(sub.subtasks, subtaskId);
      if (found) return found;
    }
  }
  return null;
}

function mapSubtasks(subtasks, callback) {
  return subtasks.map(sub => {
    const newSub = { ...sub };
    if (newSub.subtasks) {
      newSub.subtasks = mapSubtasks(newSub.subtasks, callback);
    }
    return callback(newSub);
  });
}

function cascadeDoneStatus(subtask, newDoneStatus) {
  const newSub = { ...subtask, done: newDoneStatus };
  if (newSub.subtasks) {
    newSub.subtasks = newSub.subtasks.map(child => cascadeDoneStatus(child, newDoneStatus));
  }
  return newSub;
}

function syncParentDoneStatus(subtasks) {
  return subtasks.map(sub => {
    const newSub = { ...sub };
    if (newSub.subtasks && newSub.subtasks.length > 0) {
      newSub.subtasks = syncParentDoneStatus(newSub.subtasks);
      newSub.done = newSub.subtasks.every(child => child.done);
    }
    return newSub;
  });
}

function deleteSubtask(subtasks, subtaskId) {
    let wasDeleted = false;
    const filtered = subtasks.filter(sub => {
        if (sub.id === subtaskId) {
            wasDeleted = true;
            return false;
        }
        return true;
    });

    if (wasDeleted) return filtered;

    return subtasks.map(sub => {
        if (sub.subtasks) {
            return { ...sub, subtasks: deleteSubtask(sub.subtasks, subtaskId) };
        }
        return sub;
    });
}


function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function findAndReorder(subtasks, source, destination, draggableId) {
    const { droppableId: sourceId, index: sourceIndex } = source;
    const { droppableId: destId, index: destIndex } = destination;

    let draggedItem = null;

    // First, remove the item from its source
    const removeFromSource = (currentSubtasks, parentId = 'root') => {
        if (parentId === sourceId) {
            const newSubtasks = Array.from(currentSubtasks);
            [draggedItem] = newSubtasks.splice(sourceIndex, 1);
            return newSubtasks;
        }

        return currentSubtasks.map(sub => {
            if (sub.subtasks) {
                return { ...sub, subtasks: removeFromSource(sub.subtasks, sub.id) };
            }
            return sub;
        });
    };

    const newSubtasksAfterRemoval = removeFromSource(subtasks);

    if (!draggedItem) return subtasks; // Should not happen

    // Second, add the item to its destination
    const addToDestination = (currentSubtasks, parentId = 'root') => {
        if (parentId === destId) {
            const newSubtasks = Array.from(currentSubtasks);
            newSubtasks.splice(destIndex, 0, draggedItem);
            return newSubtasks;
        }

        return currentSubtasks.map(sub => {
            if (sub.subtasks) {
                return { ...sub, subtasks: addToDestination(sub.subtasks, sub.id) };
            }
            return sub;
        });
    };

    return addToDestination(newSubtasksAfterRemoval);
}

export function subtasksReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SUBTASKS:
      return action.payload;

    case actionTypes.ADD_SUBTASK: {
      const { parentId, newSubtask } = action.payload;
      if (!parentId) {
        return [...state, newSubtask];
      }
      const newState = mapSubtasks(state, sub => {
        if (sub.id === parentId) {
          return { ...sub, subtasks: [...(sub.subtasks || []), newSubtask] };
        }
        return sub;
      });
      return newState;
    }

    case actionTypes.DELETE_SUBTASK: {
        const { subtaskId } = action.payload;
        const newState = deleteSubtask(state, subtaskId);
        return syncParentDoneStatus(newState);
    }

    case actionTypes.UPDATE_SUBTASK: {
      const { updatedSubtask } = action.payload;
      let newState = mapSubtasks(state, sub => {
        if (sub.id === updatedSubtask.id) {
          // When a subtask is updated, cascade its `done` status to all its children
          return cascadeDoneStatus(updatedSubtask, updatedSubtask.done);
        }
        return sub;
      });
      // After any update, re-sync parent `done` status from children
      return syncParentDoneStatus(newState);
    }
    
    case actionTypes.REORDER_SUBTASKS: {
        const { source, destination, draggableId } = action.payload;
        if (!destination) return state;
        return findAndReorder(state, source, destination, draggableId);
    }

    case actionTypes.ADD_FROM_PLAINTEXT: {
      const { lines, uuidv4 } = action.payload;
      const newSubs = lines.map(line => ({
        id: uuidv4(),
        title: line.trim(),
        done: false,
        subtasks: [],
      }));
      return [...state, ...newSubs];
    }

    default:
      return state;
  }
}
