let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let todoList = [];

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
        alert('Pomodoro session completed!');
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
}

function updateTodoList() {
    const todoListElement = document.getElementById('todoList');
    todoListElement.innerHTML = ''; // Clear existing list

    todoList.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo.text;

        if (todo.completed) {
            li.style.textDecoration = 'line-through'; // Apply strike-through style
            li.style.backgroundColor = '#00a67d'; // Apply green background
        }

        li.addEventListener('click', () => toggleTodo(index));
        todoListElement.appendChild(li);
    });
}

function playAlarmSound() {
    const audio = new Audio('path/to/your/alarm.mp3');
    audio.play();
}

document.getElementById('start').addEventListener('click', toggleTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('addTodo').addEventListener('click', addTodo);

displayTime();
updateTodoList();
