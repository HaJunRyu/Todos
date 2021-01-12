let todos = [];
let selectStatus = 'All';

const $todoItems = document.querySelector('.todo-items');
const $todoWriter = document.getElementById('todoWriter');
const $todoForm = document.querySelector('.todo-form');
const $selectbox = document.querySelector('.select-status');

const render = () => {
  let renderTodos = [];

  switch (selectStatus) {
    case 'Active': renderTodos = todos.filter(({ completed }) => !completed);
      break;

    case 'Completed': renderTodos = todos.filter(({ completed }) => completed);
      break;

    default: renderTodos = todos;
  }

  const $fragment = document.createDocumentFragment();

  renderTodos.forEach(todo => {
    const $li = document.createElement('li');
    const $checkbox = document.createElement('input');
    const $span = document.createElement('span');
    const $label = document.createElement('label');
    const $button = document.createElement('button');

    $li.id = todo.id;

    $checkbox.type = 'checkbox';
    $checkbox.id = 'completedCheck';
    $checkbox.classList.add('a11y-hidden');

    if (todo.completed) {
      $checkbox.checked = true;
      $li.classList.add('completed');
      $span.style.textDecoration = 'line-through'
    } else {
      $checkbox.checked = false;
      $li.classList.remove('completed');
      $span.style.textDecoration = 'normal'
    }

    $span.textContent = todo.content;

    $label.classList.add('fas');
    $label.classList.add('fa-check');
    $label.for = 'completedCheck';

    $button.classList.add('fas');
    $button.classList.add('fa-trash-alt');
    $button.type = 'button';

    $li.appendChild($checkbox);
    $li.appendChild($span);
    $li.appendChild($label);
    $li.appendChild($button);

    $fragment.appendChild($li);
  });

  $todoItems.innerHTML = '';
  $todoItems.appendChild($fragment);
};

const request = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  delete(url) {
    return fetch(url, { method: 'DELETE' });
  }
};

const fetchData = () => request.get('/todos').then(response => response.json())
  .then(data => {
    todos = data;
    render();
  }).catch(e => console.error(e));

document.addEventListener('DOMContentLoaded', fetchData);

// 이벤트 핸들러 정의
const addTodo = content => {
  const id = todos.length ? Math.max(...todos.map(({ id }) => id)) + 1 : 1;
  return request.post('/todos', {
    id,
    content,
    completed: false
  }).catch(e => console.error(e));
};

const removeTodo = id => {
  request.delete(`/todos/${id}`);
};

const completedTodo = (id, completed) => {
  request.patch(`todos/${id}`, { completed: !completed });
};

const StatusChange = status => {
  selectStatus = status;
};

// 이벤트 핸들러 등록
$todoForm.onsubmit = () => false;

$todoWriter.addEventListener('keyup', event => {
  if (event.key !== 'Enter' || event.target.value === '') return;
  addTodo(event.target.value);
  fetchData();
  event.target.value = '';
});

$todoItems.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('fas')) return;

  const { id } = target.parentNode;

  if (target.classList.contains('fa-trash-alt')) {
    removeTodo(+id);
    fetchData();
  }
  if (target.classList.contains('fa-check')) {
    completedTodo(+id, target.parentNode.firstChild.checked);
    fetchData();
  }
});

$selectbox.addEventListener('change', ({ target }) => {
  StatusChange(target.value);
  fetchData();
});
