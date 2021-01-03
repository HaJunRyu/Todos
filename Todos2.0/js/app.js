// global statment
let todos = [];

const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $ckCompleteAll = document.getElementById('ck-complete-all');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $clearCompletedBtn = document.querySelector('.clear-completed > .btn');

const render = () => {
  const $fragment = document.createDocumentFragment();

  todos.forEach(todo => {
    const $li = document.createElement('li');
    const $checkbox = document.createElement('input');
    const $lable = document.createElement('label');
    const $i = document.createElement('i');

    $li.id = todo.id;
    $li.classList.add('todo-item');

    $checkbox.id = `ck-${todo.id}`;
    $checkbox.classList.add('checkbox');
    $checkbox.type = 'checkbox';
    if (todo.completed) $checkbox.checked = 'checked';

    $lable.for = `ck-${todo.id}`;
    $lable.textContent = todo.content;
    if (todo.completed) {
      $lable.style.textDecoration = 'line-through';
      $lable.style.color = '#BDBDBD';
    }

    $i.classList.add('remove-todo');
    $i.classList.add('far');
    $i.classList.add('fa-times-circle');

    $li.appendChild($checkbox);
    $li.appendChild($lable);
    $li.appendChild($i);

    $fragment.appendChild($li);
  });

  const completedLength = todos.filter(({ completed }) => completed).length;
  const inCompletedLength = todos.filter(({ completed }) => !completed).length;

  // 리플로우와 리페인트가 일어나는 시점
  $todos.innerHTML = '';
  $todos.appendChild($fragment);

  $completedTodos.textContent = completedLength;
  $activeTodos.textContent = inCompletedLength;

  if (todos.length === completedLength) $ckCompleteAll.checked = true;
  else $ckCompleteAll.checked = false;
};

const fetchData = () => {
  todos = [
    { id: 3, content: '알고리즘 연습문제 풀기', completed: false },
    { id: 2, content: 'TodoList 2.0 완성하기', completed: true },
    { id: 1, content: '떡볶이 먹기', completed: true },
  ];
  render();
};

document.addEventListener('DOMContentLoaded', fetchData);

// 이벤트 핸들러 정의
const addTodo = content => {
  const sequence = todos.length ? Math.max(...todos.map(({ id }) => id)) + 1 : 1;
  todos = [{ id: sequence, content, completed: false }, ...todos];
  render();
};

const removeTodo = removeId => {
  todos = todos.filter(({ id }) => id !== removeId);
  render();
};

const completedChange = changeId => {
  // eslint-disable-next-line max-len
  todos = todos.map(todo => (todo.id !== changeId ? todo : { ...todo, completed: !todo.completed }));
  render();
};

const completedAll = () => {
  if (todos.filter(({ completed }) => !completed).length) {
    todos = todos.map(todo => ({ ...todo, completed: true }));
  } else {
    todos = todos.map(todo => ({ ...todo, completed: false }));
  }
  render();
};

const clearCompleted = () => {
  todos = todos.filter(({ completed }) => !completed);
  render();
};

// 이벤트 핸들러 등록
$inputTodo.addEventListener('keyup', event => {
  if (event.key !== 'Enter') return;

  const content = $inputTodo.value;

  if (content === '') return;

  addTodo(content);

  $inputTodo.value = '';
});

$todos.addEventListener('click', ({ target }) => {
  const targetId = target.parentNode.id;

  if (target.classList.contains('remove-todo')) removeTodo(+targetId);

  if (target.matches('.todo-item > label')) completedChange(+targetId);
});

$ckCompleteAll.addEventListener('click', completedAll);

$clearCompletedBtn.addEventListener('click', clearCompleted);
