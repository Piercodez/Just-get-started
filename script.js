<<<<<<< HEAD

document.addEventListener('DOMContentLoaded', function () {
  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Get form values
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var message = document.getElementById('message').value;

    // Display a message on the page
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = `
      <p>Thank you, ${firstName} ${lastName}, for your submission!</p>
      <p>${message}</p>
    `;
  }

  // Add event listener to the form
  var formContainer = document.getElementById('myFormContainer');
  console.log(formContainer)
  formContainer.addEventListener('submit', handleSubmit);
});
=======
let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let todoList = [];

// Load to-do list from localStorage
window.onload = function() {
    loadTodos();
};

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('start').textContent = 'Start';
    } else {
        startTimer();
        document.getElementById('start').textContent = 'Stop';
    }
}

function startTimer() {
    updateTimer();
    timer = setInterval(updateTimer, 1000);
    isRunning = true;
}

function updateTimer() {
    if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
        alert('🎉 Pomodoro session completed!');
        resetTimer();
        playAlarmSound();
        document.getElementById('start').textContent = 'Start';
        isRunning = false;
        return;
    }

    if (seconds === 0) {
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }

    displayTime();
}

function resetTimer() {
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    displayTime();
    isRunning = false;
    document.getElementById('start').textContent = 'Start';
}

function displayTime() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addTodo() {
    const newTodo = document.getElementById('newTodo').value.trim();
    if (newTodo !== '') {
        todoList.push({ text: newTodo, completed: false });
        updateTodoList();
        document.getElementById('newTodo').value = ''; // Clear input
        saveTodos();
    }
}

// Add an event listener for the "Enter" key
document.getElementById('newTodo').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

function toggleTodo(index) {
    todoList[index].completed = !todoList[index].completed;
    updateTodoList();
    saveTodos();
}

function updateTodoList() {
    const todoListElement = document.getElementById('todoList');
    todoListElement.innerHTML = ''; // Clear existing list

    todoList.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo.text;

        if (todo.completed) {
            li.style.backgroundColor = '#0A84FF'; // Apply blue background
            li.style.color = 'white'; // Set text color to white for completed items
        }

        li.addEventListener('click', () => toggleTodo(index));
        todoListElement.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
        todoList = JSON.parse(savedTodos);
        updateTodoList();
    }
}

function playAlarmSound() {
    const audio = new Audio('/Alarm/Bird alarm.mp3');
    audio.play();
}

document.getElementById('start').addEventListener('click', toggleTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

displayTime();
updateTodoList();
>>>>>>> main
