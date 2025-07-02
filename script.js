// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
});

// Start with Light Mode
document.body.classList.add('light-mode');

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const usernameInput = document.getElementById('username-input');
const startQuizBtn = document.getElementById('start-quiz-btn');

const questionNumberDisplay = document.getElementById('question-number');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const feedbackDisplay = document.getElementById('feedback');
const nextQuestionBtn = document.getElementById('next-question-btn');

const finalScoreDisplay = document.getElementById('final-score');
const leaderboardList = document.getElementById('leaderboard-list');
const playAgainBtn = document.getElementById('play-again-btn');

// Game Variables
let userName = "";
let score = 0;
let currentQuestionIndex = 0;
let selectedOption = null;

// Quiz Data
const database = {
    data: [
        {
            question: `let a = {}, b = {}\nconsole.log(a == b)\nconsole.log(a === b)`,
            options: {
                a: "false false",
                b: "false true",
                c: "true false",
                d: "true true",
            },
            correctAnswer: "a",
        },
        {
            question: "Object.assign(target, source) creates which type of copy?",
            options: {
                a: "Deep Copy",
                b: "Shallow Copy",
                c: "Nested Copy",
                d: "Creates a new reference",
            },
            correctAnswer: "b",
        },
        {
            question: "Is method chaining possible with forEach?",
            options: {
                a: "Yes",
                b: "No",
            },
            correctAnswer: "b",
        },
    ],
};

// Leaderboard (localStorage)
const getLeaderboard = () => {
    const stored = localStorage.getItem('quizLeaderboard');
    return stored ? JSON.parse(stored) : [];
};

const saveLeaderboard = (data) => {
    localStorage.setItem('quizLeaderboard', JSON.stringify(data));
};

let leaderBoardData = getLeaderboard();
if (leaderBoardData.length === 0) {
    leaderBoardData = [
        { name: "Ashish", score: 1 },
        { name: "Riya", score: 3 },
        { name: "Jay", score: 2 },
    ];
    saveLeaderboard(leaderBoardData);
}

// Start Quiz
function startQuiz() {
    userName = usernameInput.value.trim();
    if (userName === "") {
        alert("Please enter your name!");
        return;
    }
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;
    showQuestion();
}

function showQuestion() {
    const currentQuestion = database.data[currentQuestionIndex];
    questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${database.data.length}`;
    questionDisplay.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    feedbackDisplay.textContent = '';
    feedbackDisplay.className = 'feedback';
    nextQuestionBtn.classList.add('hidden');
    selectedOption = null;

    for (const key in currentQuestion.options) {
        const optionBtn = document.createElement('button');
        optionBtn.classList.add('option-button');
        optionBtn.textContent = `${key.toUpperCase()} - ${currentQuestion.options[key]}`;
        optionBtn.dataset.option = key;
        optionBtn.addEventListener('click', handleOptionClick);
        optionsContainer.appendChild(optionBtn);
    }
}

function handleOptionClick(event) {
    if (selectedOption !== null) return;
    selectedOption = event.target.dataset.option;

    const allButtons = optionsContainer.querySelectorAll('.option-button');
    allButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.removeEventListener('click', handleOptionClick);
    });
    event.target.classList.add('selected');
    checkAnswer(selectedOption, database.data[currentQuestionIndex].correctAnswer);
}

function checkAnswer(userAnswer, correctAnswer) {
    const allButtons = optionsContainer.querySelectorAll('.option-button');
    if (userAnswer === correctAnswer) {
        feedbackDisplay.textContent = "Correct Answer!";
        feedbackDisplay.classList.add('correct-feedback');
        score++;
        allButtons.forEach(btn => {
            if (btn.dataset.option === correctAnswer) btn.classList.add('correct');
        });
    } else {
        feedbackDisplay.textContent = "Incorrect Answer.";
        feedbackDisplay.classList.add('incorrect-feedback');
        allButtons.forEach(btn => {
            if (btn.dataset.option === userAnswer) btn.classList.add('incorrect');
            if (btn.dataset.option === correctAnswer) btn.classList.add('correct');
        });
    }
    nextQuestionBtn.classList.remove('hidden');
}

function showNextQuestion() {
    const quizCard = document.getElementById('quiz-card');
    quizCard.classList.add('flip');
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < database.data.length) {
            showQuestion();
        } else {
            showResultScreen();
        }
        quizCard.classList.remove('flip');
    }, 600);
}

function showResultScreen() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `Your score is - ${score} out of ${database.data.length}`;
    updateLeaderboard();
}

function updateLeaderboard() {
    leaderBoardData.push({ name: userName, score: score });
    leaderBoardData.sort((a, b) => b.score - a.score);
    saveLeaderboard(leaderBoardData);

    leaderboardList.innerHTML = '';
    leaderBoardData.forEach(leader => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${leader.name}</span><span>Score: ${leader.score}</span>`;
        leaderboardList.appendChild(li);
    });
}

function resetGame() {
    startScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    usernameInput.value = '';
    score = 0;
    currentQuestionIndex = 0;
    selectedOption = null;
    feedbackDisplay.textContent = '';
    feedbackDisplay.className = 'feedback';
    nextQuestionBtn.classList.add('hidden');
}

startQuizBtn.addEventListener('click', startQuiz);
nextQuestionBtn.addEventListener('click', showNextQuestion);
playAgainBtn.addEventListener('click', resetGame);
