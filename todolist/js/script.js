// Seleção de elementos dos formulários
const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const todoList = document.querySelector('#todoList');
const editForm = document.querySelector('#editForm');
const editInput = document.querySelector('#editInput');
const cancelEdit = document.querySelector('#cancelEditBtn');
const toolbar = document.querySelector('#toolbar'); // Seleção do elemento toolbar

// Seleção de elementos para pesquisa e filtro
const searchForm = document.querySelector('#search form');
const searchInput = document.querySelector('#searchInput');
const filterSelect = document.querySelector('#filter select');

// Variáveis globais
let oldInputValue;
let currentTodo;

// Função para alternar os formulários
function toggleForms() {
    todoForm.classList.toggle('hide');
    editForm.classList.toggle('hide');
    todoList.classList.toggle('hide'); // Esconde a lista de tarefas quando o formulário de edição é exibido
    toolbar.classList.toggle('hide'); // Esconde a toolbar quando o formulário de edição é exibido
}

// Função para salvar uma nova tarefa
const saveTodo = (text) => {
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const todoTitle = document.createElement('h3');
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('finishTodo');
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('editTodo');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('removeTodo');
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    

    updateLocalStorage(); // Atualiza o localStorage com todas as tarefas
}

// Função para atualizar o localStorage com o estado de todas as tarefas
function updateLocalStorage() {
    const todos = [];
    document.querySelectorAll('.todo').forEach(todo => {
        const todoText = todo.querySelector('h3').innerText;
        const todoStatus = todo.classList.contains('done') ? 'done' : 'undone';
        todos.push(`${todoText}|${todoStatus}`);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Evento de submissão do formulário de adicionar tarefa
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue) {
        saveTodo(inputValue);
        todoInput.value = ''; // Limpar o campo de entrada após adicionar a tarefa
        todoInput.focus(); // Dar foco ao campo de entrada após adicionar a tarefa
    }
});

// Evento de clique em qualquer botão dentro da lista de tarefas
document.addEventListener('click', function(event) {
    const targetElement = event.target;
    const parentElement = targetElement.closest('.todo');

    if (parentElement) {
        const todoText = parentElement.querySelector('h3').innerText;

        if (targetElement.classList.contains('finishTodo')) {
            parentElement.classList.toggle('done');
            updateLocalStorage();
        }

        if (targetElement.classList.contains('removeTodo')) {
            parentElement.remove();
            updateLocalStorage();
        }

        if (targetElement.classList.contains('editTodo')) {
            toggleForms();
            editInput.value = todoText;
            oldInputValue = todoText;
            currentTodo = parentElement; // Guarda a referência para a tarefa atual
        }
    }
});

// Evento de clique no botão de cancelar edição
cancelEdit.addEventListener('click', function() {
    toggleForms();
});

// Evento de submissão do formulário de edição de tarefa
editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const editInputValue = editInput.value;
    if (editInputValue) {
        currentTodo.querySelector('h3').innerText = editInputValue; // Atualiza o texto da tarefa atual
        updateLocalStorage();
    }
    toggleForms();
});

// Verificar se há tarefas armazenadas no localStorage quando a página é carregada
window.addEventListener('DOMContentLoaded', function() {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    storedTodos.forEach(todo => {
        const [text, status] = todo.split('|');
        saveTodo(text);
        const currentTodo = todoList.lastElementChild;
        if (status === 'done') {
            currentTodo.classList.add('done');
        }
    });
});

// Função para filtrar tarefas
function filterTodos() {
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    document.querySelectorAll('.todo').forEach(todo => {
        const todoText = todo.querySelector('h3').innerText.toLowerCase();
        const isDone = todo.classList.contains('done');

        if (todoText.includes(searchText) && 
            (filterValue === 'all' || 
            (filterValue === 'done' && isDone) || 
            (filterValue === 'undone' && !isDone))) {
            todo.style.display = '';
            todo.classList.remove('hide');
        } else {
            todo.style.display = 'none';
            todo.classList.add('hide');
        }
    });
}

// Evento de entrada no campo de pesquisa
searchInput.addEventListener('input', filterTodos);

// Evento de mudança do filtro
filterSelect.addEventListener('change', filterTodos);


//evento de limpar pesquisa
document.querySelector('#search button').addEventListener('click', function() {
    searchInput.value = '';
    filterTodos(); // Filtra as tarefas após limpar a pesquisa
});
