const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task");
const editForm = document.querySelector("#edit-form");
const todoList = document.querySelector("#todo-list");
const cancelButton = document.querySelector("#edit-cancel");
const editInput = document.querySelector("#edit-task");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-btn");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

const saveTodo = (task, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const newTask = document.createElement("h3");
  newTask.innerText = task;
  todo.appendChild(newTask);

  const checkButton = document.createElement("button");
  checkButton.classList.add("check-todo");
  checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(checkButton);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-todo");
  editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editButton);

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-todo");
  removeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
  todo.appendChild(removeButton);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ task, done });
  }

  todoList.appendChild(todo);

  taskInput.value = "";

  taskInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizeSearch = search.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(normalizeSearch)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

document.addEventListener("click", (e) => {
  const targetElement = e.target;

  const parentElement = targetElement.closest("div");

  let todoTitle;

  if (parentElement && parentElement.querySelector("h3")) {
    todoTitle = parentElement.querySelector("h3").innerText;
  }

  if (targetElement.classList.contains("check-todo")) {
    parentElement.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetElement.classList.contains("remove-todo")) {
    parentElement.remove();

    removeTodoLocalStorage(todoTitle);
  }

  if (targetElement.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    //ATUALIZAR
    updateTodo(editInputValue);
  }

  toggleForms();
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = taskInput.value;

  if (!task) {
    return;
  }

  saveTodo(task);
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("click", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.task, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {

  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.task !== todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === todoOldText ? (todo.task = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
