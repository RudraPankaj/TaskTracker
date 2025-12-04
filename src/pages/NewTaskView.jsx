import React from 'react';
import NewTaskForm from '../components/NewTaskForm';
import { useOutletContext } from 'react-router-dom';
import { taskActionTypes } from '../reducers/tasksReducer';

const NewTaskView = () => {
  const { dispatch } = useOutletContext();

  function handleAddTask(newTask) {
    dispatch({ type: taskActionTypes.ADD_TASK, payload: newTask });
  }

  return (
    <NewTaskForm onAdd={handleAddTask} />
  );
};

export default NewTaskView;