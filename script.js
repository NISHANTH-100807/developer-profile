let secretNumber;
let attempts = 0;
const maxAttempts = 10;
let maxNumber = 50;
let gameOver = false;

const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const restartButton = document.getElementById("restart-button");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const maxAttemptsDisplay = document.getElementById("max-attempts");
const maxNumberDisplay = document.getElementById("max-number");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const contactForm = document.getElementById("contact-form");

function generateRandomNumber() {
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
}

function startGame() {
    attempts = 0;
    gameOver = false;

    generateRandomNumber();

    attemptsDisplay.textContent = attempts;
    maxAttemptsDisplay.textContent = maxAttempts;
    maxNumberDisplay.textContent = maxNumber;

    guessInput.min = 1;
    guessInput.max = maxNumber;
    guessInput.value = "";

    message.textContent = "Good luck! Start guessing.";
    message.className = "game-message";

    guessInput.disabled = false;
    guessButton.disabled = false;
    restartButton.hidden = true;

    guessInput.focus();
}

function checkGuess() {
    if (gameOver) {
        return;
    }

    const userGuess = Number(guessInput.value);

    if (
        guessInput.value === "" ||
        !Number.isInteger(userGuess) ||
        userGuess < 1 ||
        userGuess > maxNumber
    ) {
        message.textContent =
            `Please enter a whole number between 1 and ${maxNumber}.`;

        message.className = "game-message error";

        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (userGuess === secretNumber) {
        message.textContent =
            `Correct! You guessed the number ${secretNumber} in ${attempts} attempt${attempts === 1 ? "" : "s"}!`;

        message.className = "game-message success";

        endGame();

        return;
    }

    if (userGuess < secretNumber) {
        message.textContent = "📉 Too low! Try a higher number.";
        message.className = "game-message warning";
    } else {
        message.textContent = "📈 Too high! Try a lower number.";
        message.className = "game-message warning";
    }

    if (attempts >= maxAttempts) {
        message.textContent =
            `Game over! The correct number was ${secretNumber}.`;

        message.className = "game-message error";

        endGame();

        return;
    }

    guessInput.value = "";
    guessInput.focus();
}

function endGame() {
    gameOver = true;

    guessInput.disabled = true;
    guessButton.disabled = true;
    restartButton.hidden = false;
}

function changeDifficulty(button) {
    maxNumber = Number(button.dataset.max);

    difficultyButtons.forEach(function (btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    startGame();
}

guessButton.addEventListener("click", checkGuess);

guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

restartButton.addEventListener("click", startGame);

difficultyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        changeDifficulty(button);
    });
});

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        alert("Thank you for your message!");

        contactForm.reset();
    });
}

startGame();