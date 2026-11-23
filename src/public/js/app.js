(function () {
  const listEl = document.getElementById('task-list');
  const formEl = document.getElementById('add-form');
  const inputEl = document.getElementById('task-input');
  const statsEl = document.getElementById('stats');
  const emptyEl = document.getElementById('empty-state');
  const filtersEl = document.getElementById('filters');

  let tasks = [];
  let filter = 'all';

  async function fetchTasks() {
    const res = await fetch('/api/tasks');
    tasks = await res.json();
    render();
  }

  async function addTask(title) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const task = await res.json();
      tasks.push(task);
      render();
    }
  }

  async function toggleTask(id, done) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    });
    if (res.ok) {
      const updated = await res.json();
      tasks = tasks.map((t) => (t.id === id ? updated : t));
      render();
    }
  }

  async function deleteTask(id) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      tasks = tasks.filter((t) => t.id !== id);
      render();
    }
  }

  function visibleTasks() {
    if (filter === 'active') return tasks.filter((t) => !t.done);
    if (filter === 'done') return tasks.filter((t) => t.done);
    return tasks;
  }

  function render() {
    const visible = visibleTasks();
    listEl.innerHTML = '';

    visible.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task';

      const checkbox = document.createElement('button');
      checkbox.className = `task__checkbox${task.done ? ' task__checkbox--done' : ''}`;
      checkbox.type = 'button';
      checkbox.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
      checkbox.textContent = task.done ? '✓' : '';
      checkbox.addEventListener('click', () => toggleTask(task.id, !task.done));

      const title = document.createElement('span');
      title.className = `task__title${task.done ? ' task__title--done' : ''}`;
      title.textContent = task.title;

      const del = document.createElement('button');
      del.className = 'task__delete';
      del.type = 'button';
      del.setAttribute('aria-label', 'Delete task');
      del.textContent = '✕';
      del.addEventListener('click', () => deleteTask(task.id));

      li.append(checkbox, title, del);
      listEl.appendChild(li);
    });

    emptyEl.hidden = visible.length > 0;

    const doneCount = tasks.filter((t) => t.done).length;
    statsEl.textContent = `${doneCount} of ${tasks.length} done`;
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = inputEl.value.trim();
    if (!title) return;
    inputEl.value = '';
    addTask(title);
  });

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    filter = btn.dataset.filter;
    [...filtersEl.children].forEach((c) => c.classList.toggle('filter--active', c === btn));
    render();
  });

  fetchTasks();
})();
