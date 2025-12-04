
export const taskActionTypes = {
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  REORDER_TASKS: 'REORDER_TASKS',
  SET_TASKS: 'SET_TASKS',
};

export function tasksReducer(state, action) {
  switch (action.type) {
    case taskActionTypes.SET_TASKS:
      return action.payload;
    case taskActionTypes.ADD_TASK:
      return [...state, action.payload];
    case taskActionTypes.UPDATE_TASK:
      return state.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
    case taskActionTypes.DELETE_TASK:
      return state.filter(task => task.id !== action.payload);
    case taskActionTypes.REORDER_TASKS: {
      const { source, destination } = action.payload;
      const newState = [...state];
      const [removed] = newState.splice(source.index, 1);
      newState.splice(destination.index, 0, removed);
      return newState;
    }
    default:
      return state;
  }
}
