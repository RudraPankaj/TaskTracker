import React from 'react';
import NewTaskForm from '../components/NewTaskForm';
import { useOutletContext } from 'react-router-dom';

const NewTaskView = () => {
  const { addTask } = useOutletContext();
  return (
    <NewTaskForm onAdd={addTask} />
  );
};

export default NewTaskView;