let todos = [];
let status = 'All';

const $todos = document.querySelector('.todo-items');
const $todoWriter = document.getElementById('todoWriter');
const $todoForm = document.querySelector('.todo-form');
const $selectStatus = document.querySelector('.select-status');

const render = () => {
  const $fragment = document.createDocumentFragment();

  let renderTodos = todos;
  if (status === 'Active') renderTodos = todos.filter(({ completed }) => !completed);
  else if (status === 'Completed') renderTodos = todos.filter(({ completed }) => completed);

  renderTodos.forEach(todo => {
    const $li = document.createElement('li');
    const $checkbox = document.createElement('input');
    const $span = document.createElement('span');
    const $label = document.createElement('label');
    const $button = document.createElement('button');

    $span.textContent = todo.content;

    $checkbox.type = 'checkbox';
    $checkbox.classList.add('a11y-hidden');
    if (todo.completed) {
      $checkbox.checked = true;
      $li.classList.add('completed');
      $span.style.textDecoration = 'line-through';
    } else {
      $checkbox.checked = false;
      $li.classList.remove('completed');
    }

    $label.classList.add('fas');
    $label.classList.add('fa-check');
    
    $button.classList.add('fas');
    $button.classList.add('fa-trash-alt');
    $button.type = 'button';

    $li.id = todo.id;
    $li.appendChild($checkbox);
    $li.appendChild($span);
    $li.appendChild($label);
    $li.appendChild($button);

    $fragment.appendChild($li);
  });
  $todos.innerHTML = '';
  $todos.appendChild($fragment);
}

const fetchData = () => {
  axios.get('/todos').then(resolve => resolve.data)
    .then(data => todos = data)
    .then(render)
    .catch(e => console.error(e));
};

document.addEventListener('DOMContentLoaded', fetchData);

// 이벤트 핸들러 정의
const addTodo = content => {
  const id = todos.length ? Math.max(...todos.map(({ id }) => id)) + 1 : 1;
  return axios.post('/todos', { id, content, completed: false })
    .then(response => response.data)
    .then(data => todos = [...todos, data])
    .then(render)
    .catch(e => console.error(e));
};

const removeTodo = id => {
  axios.delete(`/todos/${id}`)
    .then(response => response.data)
    .then(() => todos = todos.filter(({ id: todoId }) => todoId !== id))
    .then(render)
    .catch(e => console.error(e));
};

const completedTodo = (id, completed) => {
  axios.patch(`/todos/${id}`, { completed: !completed })
    .then(response => response.data)
    .then(data => todos = todos.map(todo => todo.id === id ? data : todo))
    .then(render)
    .catch(e => console.error(e));
};

// 이벤트 핸들러 등록
$todoWriter.addEventListener('keyup', event => {
  event.preventDefault();
  event.target.parentNode.parentNode.onsubmit = () => false;
  if (event.key !== 'Enter') return;

  const content = $todoWriter.value;
  if (content === '') return;
  addTodo(content);
  event.target.value = '';
});

$todos.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('fa-check') && !target.classList.contains('fa-trash-alt')) return;

  const todoId = target.parentNode.id;

  if (target.classList.contains('fa-trash-alt')) removeTodo(+todoId);
  
  if (target.classList.contains('fa-check')) {
    completedTodo(+todoId, target.parentNode.firstChild.checked);
  }
});

$selectStatus.addEventListener('change', event => {
  status = event.target.value;
  render();
});