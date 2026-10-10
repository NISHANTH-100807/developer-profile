
document.getElementById("currentYear").textContent = new Date().getFullYear();

const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessMessage = document.getElementById("guessMessage");
const attemptCount = document.getElementById("attemptCount");
const restartGame = document.getElementById("restartGame");

let secretNumber;
let attempts = 0;
let gameOver = false;

function startGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    gameOver = false;

    guessInput.value = "";
    guessInput.disabled = false;
    guessForm.querySelector("button").disabled = false;

    attemptCount.textContent = "0";
    guessMessage.textContent = "Make your first guess!";
    guessMessage.className = "game-message";
}

guessForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (gameOver) {
        return;
    }

    const guess = Number(guessInput.value);

    if (
        guessInput.value.trim() === "" ||
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 100
    ) {
        guessMessage.textContent = "Enter a whole number between 1 and 100.";
        guessMessage.className = "game-message error";
        return;
    }

    attempts++;
    attemptCount.textContent = attempts;

    if (guess === secretNumber) {
        guessMessage.textContent = `Correct! You found the number in ${attempts} ${attempts === 1 ? "attempt" : "attempts"}!`;
        guessMessage.className = "game-message success";
        gameOver = true;
        guessInput.disabled = true;
        guessForm.querySelector("button").disabled = true;
    } else if (guess < secretNumber) {
        guessMessage.textContent = "Too low! Try a higher number.";
        guessMessage.className = "game-message";
    } else {
        guessMessage.textContent = "Too high! Try a lower number.";
        guessMessage.className = "game-message";
    }

    if (!gameOver) {
        guessInput.value = "";
        guessInput.focus();
    }
});

restartGame.addEventListener("click", startGame);

startGame();

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const emptyMessage = document.getElementById("emptyMessage");
const totalTasks = document.getElementById("totalTasks");
const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const remainingMessage = document.getElementById("remainingMessage");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("nishanthTasks") || "[]");

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

let currentFilter = "all";

function saveTasks() {
    try {
        localStorage.setItem("nishanthTasks", JSON.stringify(tasks));
        taskMessage.textContent = "";
    } catch {
        taskMessage.textContent = "Could not save tasks in this browser.";
    }
}

function updateTaskCounters() {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    allCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    if (pending === 0) {
        remainingMessage.textContent = tasks.length === 0
            ? "Add a task to get started!"
            : "You're all caught up!";
    } else {
        remainingMessage.textContent = `${pending} ${pending === 1 ? "task" : "tasks"} remaining`;
    }

    clearCompleted.disabled = completed === 0;
    clearCompleted.style.opacity = completed === 0 ? "0.45" : "1";
    clearCompleted.style.cursor = completed === 0 ? "not-allowed" : "pointer";
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") {
            return task.completed;
        }

        if (currentFilter === "pending") {
            return !task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = `task-item${task.completed ? " completed" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);

        checkbox.addEventListener("change", function () {
            tasks = tasks.map(item =>
                item.id === task.id
                    ? { ...item, completed: checkbox.checked }
                    : item
            );

            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    emptyMessage.hidden = filteredTasks.length > 0;

    if (filteredTasks.length === 0) {
        if (tasks.length === 0) {
            emptyMessage.textContent = "No tasks yet. Add your first task above!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        } else if (currentFilter === "pending") {
            emptyMessage.textContent = "No pending tasks. Great job!";
        } else {
            emptyMessage.textContent = "No tasks to display.";
        }
    }

    updateTaskCounters();
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        taskMessage.textContent = "Please enter a task before adding it.";
        taskInput.focus();
        return;
    }

    const newTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        completed: false
    };

    tasks.unshift(newTask);
    saveTasks();

    currentFilter = "all";

    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.filter === "all");
    });

    taskInput.value = "";
    renderTasks();
    taskInput.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderTasks();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === currentFilter)
    );
});

clearCompleted.addEventListener("click", function () {
    const completedTasks = tasks.filter(task => task.completed).length;

    if (completedTasks === 0) {
        return;
    }

    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
