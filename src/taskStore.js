const crypto = require('crypto');

function createTaskStore(seed = []) {
  const tasks = seed.map((t) => ({ ...t }));

  return {
    list() {
      return tasks;
    },
    add(title) {
      const task = { id: crypto.randomUUID(), title, done: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      return task;
    },
    update(id, changes) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;
      Object.assign(task, changes);
      return task;
    },
    remove(id) {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    },
  };
}

module.exports = { createTaskStore };
