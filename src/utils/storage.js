const KEY = 'task-tracker.tasks.v1';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load tasks from local storage", e);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to local storage", e);
  }
}

export function addTask(newTask) {
  const tasks = loadTasks() || [];
  const updatedTasks = [newTask, ...tasks];
  saveTasks(updatedTasks);
}
