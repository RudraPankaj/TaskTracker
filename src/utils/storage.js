const KEY = 'task-tracker.tasks.v1';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {}
}

export function addTask(newTask) {
  const tasks = loadTasks() || [];
  const updatedTasks = [newTask, ...tasks];
  saveTasks(updatedTasks);
}
