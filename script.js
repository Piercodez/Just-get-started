let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let todoList = [];
let draggedItemIndex = null;
let dropPositionIndicator = document.createElement('div');

// Load tasks from localStorage
window.addEventListener('load', loadTodos);

// Initialize drop position indicator
dropPositionIndicator.className = 'drop-position-indicator';

function toggleTimer() {
    playStartSound(); // Play the start sound on both start and stop

    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('start').textContent = 'Start';
    } else {
        startTimer();
        document.getElementById('start').textContent = 'Stop';
    }
}

// Load tasks from localStorage or create a default task if empty
window.addEventListener('load', loadTodos);

// Function to load todos from localStorage or create a default task
function loadTodos() {
    const savedTodos = localStorage.getItem('todoList');
    console.log('Saved Todos (raw):', savedTodos); // Debug log to inspect saved data

    if (savedTodos && JSON.parse(savedTodos).length > 0) {
        todoList = JSON.parse(savedTodos);
        console.log('Loaded from localStorage:', todoList);
    } else {
        // Create a default task for first-time users
        todoList = [{ text: 'Drag me to done :)', status: 'doing' }];
        console.log('Default task created:', todoList);
        saveTodos(); // Save the default task to localStorage
    }

    updateTodoList(); // Render the tasks
}

todoList = [{ text: 'Drag me to done :)', status: 'doing' }];
console.log('Default task created:', todoList);
saveTodos();


function startTimer() {
    timer = setInterval(updateTimer, 1000); // Start the interval timer
    updateTimer(); // Immediately update the timer display
    isRunning = true;
}

function updateTimer() {
    if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
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

    // Update the document title with the countdown timer
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;
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
    const todoInput = document.getElementById('newTodo');
    const newTodo = todoInput.value.trim();
    if (newTodo !== '') {
        todoList.push({ text: newTodo, status: 'todo' });
        updateTodoList();
        todoInput.value = ''; // Clear input
        saveTodos();
        
        // Reset the height to keep it one line
        todoInput.style.height = '32px';
    }
    console.log('Todo added:', todoList);
}

function addDoing() {
    const newDoing = document.getElementById('newDoing').value.trim();
    if (newDoing !== '') {
        todoList.push({ text: newDoing, status: 'doing' });
        updateTodoList();
        document.getElementById('newDoing').value = ''; // Clear input
        saveTodos();
    }
    console.log('Doing added:', todoList);
}

function addDone() {
    const newDone = document.getElementById('newDone').value.trim();
    if (newDone !== '') {
        todoList.push({ text: newDone, status: 'done' });
        updateTodoList();
        document.getElementById('newDone').value = ''; // Clear input
        saveTodos();
    }
    console.log('Done added:', todoList);
}

// Add event listeners for the "Enter" key on all input fields
document.getElementById('newTodo').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});
document.getElementById('newDoing').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addDoing();
    }
});
document.getElementById('newDone').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addDone();
    }
});

function moveTask(index, newStatus) {
    console.log('Move task index:', index, 'New status:', newStatus);
    if (index >= 0 && index < todoList.length) {
        todoList[index].status = newStatus;
        updateTodoList();
        saveTodos();

        if (newStatus === 'done') {
            triggerConfetti();
        }
        console.log('Task moved to', newStatus, ':', todoList[index]);
    } else {
        console.error('Invalid task index:', index);
    }
}

function updateTodoList() {
    const todoListElement = document.getElementById('todoList');
    const doingListElement = document.getElementById('doingList');
    const doneListElement = document.getElementById('doneList');

    todoListElement.innerHTML = ''; // Clear existing list
    doingListElement.innerHTML = ''; // Clear existing list
    doneListElement.innerHTML = ''; // Clear existing list

    todoList.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.draggable = true;

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-backspace"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" /><path d="M12 10l4 4m0 -4l-4 4" /></svg>`;
        deleteButton.style.color = '#52525b';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            deleteTask(index);
        });
        li.appendChild(deleteButton);

        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>`;
        editButton.style.color = '#52525b';
        editButton.style.marginRight = '8px';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            editTask(index, li);
        });
        li.insertBefore(editButton, deleteButton);

        li.addEventListener('dragstart', (e) => {
            draggedItemIndex = index;
            e.dataTransfer.effectAllowed = 'move';
            console.log('Drag start index:', index);
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            dropPositionIndicator.remove();
        });

        if (task.status === 'todo') {
            todoListElement.appendChild(li);
        } else if (task.status === 'doing') {
            doingListElement.appendChild(li);
        } else if (task.status === 'done') {
            doneListElement.appendChild(li);
        }
    });

    console.log('Todo list updated:', todoList);
    addDragAndDropHandlers(todoListElement, 'todo');
    addDragAndDropHandlers(doingListElement, 'doing');
    addDragAndDropHandlers(doneListElement, 'done');
}

function addDragAndDropHandlers(listElement, status) {
    listElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(listElement, e.clientY);
        if (afterElement == null) {
            listElement.appendChild(dropPositionIndicator);
        } else {
            listElement.insertBefore(dropPositionIndicator, afterElement);
        }
    });

    listElement.addEventListener('dragleave', () => {
        dropPositionIndicator.remove();
    });

    listElement.addEventListener('drop', (e) => {
        e.preventDefault();
        dropPositionIndicator.remove();

        const targetIndex = e.target.closest('li') ? Array.from(listElement.children).indexOf(e.target.closest('li')) : -1;
        console.log('Dropped at index:', targetIndex);

        if (draggedItemIndex !== null && targetIndex !== -1 && draggedItemIndex !== targetIndex) {
            // Reorder within the same column
            const [movedItem] = todoList.splice(draggedItemIndex, 1);
            todoList.splice(targetIndex, 0, movedItem);
            updateTodoList();
            saveTodos();
        } else {
            // Move to new status column
            moveTask(draggedItemIndex, status);
        }

        draggedItemIndex = null;
    });

    // Extend drop area
    listElement.closest('.kanban-column').addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(listElement, e.clientY);
        if (afterElement == null) {
            listElement.appendChild(dropPositionIndicator);
        } else {
            listElement.insertBefore(dropPositionIndicator, afterElement);
        }
    });

    listElement.closest('.kanban-column').addEventListener('drop', (e) => {
        e.preventDefault();
        dropPositionIndicator.remove();
        moveTask(draggedItemIndex, status);
        draggedItemIndex = null;
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        const roundedOffset = Math.round(offset / 30) * 30; // Round to nearest 30px
        if (roundedOffset < 0 && roundedOffset > closest.offset) {
            return { offset: roundedOffset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function setCaretPosition(input, pos) {
    if (input.setSelectionRange) {
        input.setSelectionRange(pos, pos);
    } else if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

function deleteTask(index) {
    todoList.splice(index, 1);
    updateTodoList();
    saveTodos();
}

function editTask(index, li) {
    li.classList.add('editing');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todoList[index].text;
    input.className = 'edit-input';
    input.style.textAlign = 'left'; // Left-align text when editing
    li.textContent = '';
    li.appendChild(input);

    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            todoList[index].text = input.value.trim();
            updateTodoList();
            saveTodos();
        }
    });

    document.querySelectorAll('#newTodo, #newDoing, #newDone').forEach((textarea) => {
        // Placeholder handling
        textarea.addEventListener('focus', function() {
          this.setAttribute('data-placeholder', this.getAttribute('placeholder')); // Store the placeholder text
          this.setAttribute('placeholder', ''); // Remove the placeholder
        });
    
        textarea.addEventListener('blur', function() {
          this.setAttribute('placeholder', this.getAttribute('data-placeholder')); // Restore the placeholder
        });
      
        // Dynamic resizing of textarea
        textarea.addEventListener('input', function() {
          this.style.height = 'auto'; // Reset height
          this.style.height = `${this.scrollHeight}px`; // Adjust height based on content
        });
    });
    
      


    input.addEventListener('blur', () => {
        todoList[index].text = input.value.trim();
        updateTodoList();
        saveTodos();
    });

    input.focus();

    // Set the cursor position to the clicked position
    setCaretPosition(input, input.value.length);
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

// Function to play the start sound
function playStartSound() {
    const startSound = new Audio('Button sounds/start-sound.mp3');
    startSound.play();
}

// Function to play the stop sound but use the start sound
function playStopSound() {
    const startSound = new Audio('Button sounds/start-sound.mp3');
    startSound.play();
}

// Function to play the reset sound
function playResetSound() {
    const resetSound = new Audio('Button sounds/reset-sound.mp3');
    resetSound.play();
}

// Function to play the alarm sound when the timer completes
function playAlarmSound() {
    const alarmSound = new Audio('Button sounds/alarm-sound.mp3');
    alarmSound.play();
}

// Attach sound to Start/Stop button based on its state
document.getElementById('start').addEventListener('click', () => {
    if (isRunning) {
        playStopSound(); // Play the stop sound
    } else {
        playStartSound(); // Play the start sound
    }
    toggleTimer(); // Start or stop the timer based on its current state
});

// Attach sound to Reset button
document.getElementById('reset').addEventListener('click', () => {
    resetTimer();
    playResetSound(); // Play the reset sound
});


function triggerConfetti() {
    console.log('Confetti triggered');
    if (typeof confetti === 'function') {
        confetti.reset(); // Reset any previous confetti calls
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            shapes: ['circle'] // Use circles for confetti particles
        });
    } else {
        console.error('Confetti function is not available.');
    }
}

displayTime();
updateTodoList();
