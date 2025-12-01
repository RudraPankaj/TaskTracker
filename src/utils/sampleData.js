export const sampleTasks = [
  {
    id: 'task-1',
    title: 'Finish project report',
    dueDate: new Date(Date.now() + 1000*60*60*26).toISOString(),
    priority: 'High',
    done: false,
    subtasks: [
      {
        id: 'subtask-1-1',
        title: 'Write introduction',
        done: true,
        subtasks: [
          { id: 'subtask-1-1-1', title: 'Nested subtask 1.1.1', done: false, subtasks: [] }
        ]
      },
      { id: 'subtask-1-2', title: 'Gather data', done: false, subtasks: [] },
    ]
  },
  {
    id: 'task-2',
    title: 'Grocery shopping',
    dueDate: null,
    priority: 'Low',
    done: false,
    subtasks: []
  },
  {
    id: 'task-3',
    title: 'Pay electricity bill',
    dueDate: new Date(Date.now() - 1000*60*60*5).toISOString(),
    priority: 'Normal',
    done: false,
    subtasks: [
      { id: 'subtask-3-1', title: 'Login to the portal', done: true, subtasks: [] },
      { id: 'subtask-3-2', title: 'Make the payment', done: true, subtasks: [] },
    ]
  }
]
