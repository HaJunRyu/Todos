let todos = [];

const $todos = document.querySelector('.todo-items');
const $todoWriter = document.getElementById('todoWriter');
const $todoForm = document.querySelector('.todo-form');


const render = () => {
  const $fragment = document.createDocumentFragment();

  const renderTodos = todos;

  renderTodos.forEach(todo => {
    const $li = document.createElement('li');
    const $checkbox = document.createElement('input');
    const $span = document.createElement('span');
    const $label = document.createElement('label');
    const $button = document.createElement('button');

    $checkbox.type = 'checkbox';
    $checkbox.classList.add('a11y-hidden');
    if (todo.completed) $checkbox.checked= true;

    $span.textContent = todo.content;

    $label.classList.add('fas');
    $label.classList.add('fa-check');
    
    $button.classList.add('fas');
    $button.classList.add('fa-trash-alt');

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
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://localhost:3000/todos');

  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      todos = JSON.parse(xhr.response);
      render();
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchData);

// 이벤트 핸들러 정의
const addTodo = content => {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/todos');

  xhr.setRequestHeader('content-type', 'application/json');

  const sequence = todos.length ? Math.max(...todos.map(({ id }) => id)) + 1 : 1;

  xhr.send(JSON.stringify({ id: sequence, content, completed: false }));

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      console.log(JSON.parse(xhr.response));
    }
  }
}

const removeTodo = id => {
  const xhr = new XMLHttpRequest();

  xhr.open('DELETE', `http://localhost:3000/todos/${id}`)

  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log('ok');
      render();
    }
  }
}

// 이벤트 핸들러 등록
$todoWriter.addEventListener('keyup', event => {
  console.dir(event.target.parentNode);
  event.target.onsubmit = () => false;
  if (event.key !== 'Enter') return;

  const content = $todoWriter.value;
  if (content === '') return;
  addTodo(content);
  event.target.value = '';
});

$todoForm.onsubmit = e => e.preventDefault();

$todos.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('fa-check') && !target.classList.contains('fa-trash-alt')) return;

  const todoId = target.parentNode.id;

  console.log(todoId);

  if (target.classList.contains('fa-trash-alt')) removeTodo(+todoId);
})