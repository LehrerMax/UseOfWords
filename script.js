let gameData = []; // Stores game questions and choices
let currentQuestion = {};
let totalAttempts = 0;
let correctAnswers = 0;
let gameType = '';
let gameMode = '';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('gameArea').style.display = 'none';
});

function loadGameType() {
    gameType = document.getElementById('gameTypeSelect').value;
    if (!gameType) {
        alert('Please select a game type from the dropdown.');
        return;
    }
    let fileName = '';
    switch (gameType) {
        case 'opposites':
            fileName = 'words1.csv';
            break;
        case 'synonyms':
            fileName = 'words2.csv';
            break;
        case 'verbsOrAdverbs':
            fileName = 'words3.csv';
            break;
    }
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            processCSV(data);
            document.getElementById('gameControls').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading the CSV:', error);
            alert('Failed to load the CSV file. Check the console for details.');
        });
}

function processCSV(data) {
    gameData = [];
    const lines = data.split('\n').slice(1); // Skip header
    lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 5) { // Ensure there are enough columns for question and choices
            gameData.push({
                sentence: parts[0].trim(),
                correctAnswer: parts[1].trim(),
                choices: parts.slice(1, 5).map(choice => choice.trim()) // Assumes first four columns after sentence are choices
            });
        }
    });
    shuffleArray(gameData); // Shuffle questions for randomness
}

function chooseGameMode(mode) {
    gameMode = mode;
    document.body.className = gameType; // Set body class to current game type for CSS styling
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('typingGame').className = mode === 'typing' ? 'active' : 'inactive';
    document.getElementById('multipleChoiceGame').className = mode === 'multipleChoice' ? 'active' : 'inactive';
    pickNextQuestion();
}

function pickNextQuestion() {
    if (gameData.length === 0) {
        document.getElementById('result').textContent = "All questions completed! Well done!";
        return;
    }
    currentQuestion = gameData.shift(); // Get the next question
    document.getElementById('randomWord').textContent = currentQuestion.sentence;
    if (gameMode === 'multipleChoice') {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`choice${i}`).textContent = currentQuestion.choices[i - 1];
            document.getElementById(`choice${i}`).onclick = () => checkChoice(currentQuestion.choices[i - 1]);
        }
    }
    document.getElementById('result').textContent = '';
}

function checkChoice(selectedAnswer) {
    totalAttempts++;
    if (selectedAnswer === currentQuestion.correctAnswer) {
        correctAnswers++;
        document.getElementById('result').textContent = "Correct! Well done!";
        document.getElementById('result').className = 'correct';
        setTimeout(pickNextQuestion, 1000);
    } else {
        document.getElementById('result').textContent = "Incorrect! Try again.";
        document.getElementById('result').className = '';
    }
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = `Attempted: ${totalAttempts}, Correct: ${correctAnswers}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function skipWord() {
    pickNextQuestion();
}
