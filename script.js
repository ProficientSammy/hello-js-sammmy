document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'XXN4nQ1G5TRfsbK5zKyTsBZH8UpR2bjV3QupqlcA';
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const resultElement = document.getElementById('result');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const resetScoreButton = document.getElementById('reset-score');
    const answerForm = document.getElementById('answer-form');

    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0;

    let selectedAnswer = null; 

    correctCountElement.textContent = correctCount;
    incorrectCountElement.textContent = incorrectCount;

    document.getElementById('difficulty-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const difficulty = document.getElementById('difficulty').value;
        await fetchQuestion(difficulty);
    });

    answerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (selectedAnswer) {
            checkAnswer(selectedAnswer);
        } else {
            resultElement.textContent = 'Please select an answer before submitting.';
            resultElement.classList.remove('hidden');
        }
    });

    resetScoreButton.addEventListener('click', resetScore);

    async function fetchQuestion(difficulty) {
        const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=1&difficulty=${difficulty}`);
        const data = await response.json();
        displayQuestion(data[0]);
    }

    function displayQuestion(questionData) {
        questionElement.textContent = questionData.question;
        answersContainer.innerHTML = '';

        const answers = questionData.answers;
        const correctAnswers = questionData.correct_answers;

        selectedAnswer = null; 

        for (let [key, answer] of Object.entries(answers)) {
            if (answer) {
                const answerButton = document.createElement('button');
                answerButton.textContent = answer;
                answerButton.setAttribute('type', 'button'); 
                answerButton.setAttribute('data-correct', correctAnswers[`${key}_correct`]);
                answerButton.classList.add('btn', 'btn-outline-primary', 'w-100', 'mb-2');
                answersContainer.appendChild(answerButton);

                answerButton.addEventListener('click', () => {
                    selectAnswer(answerButton);
                });
            }
        }

        questionContainer.classList.remove('hidden');
        resultElement.classList.add('hidden');
    }

    function selectAnswer(answerButton) {
        
        const buttons = answersContainer.querySelectorAll('button');
        buttons.forEach(button => button.classList.remove('selected', 'btn-primary'));
        buttons.forEach(button => button.classList.add('btn-outline-primary'));

        
        answerButton.classList.add('selected', 'btn-primary');
        answerButton.classList.remove('btn-outline-primary');

        selectedAnswer = answerButton; 
    }

    function checkAnswer(selectedButton) {
        const isCorrect = selectedButton.getAttribute('data-correct') === 'true';

        if (isCorrect) {
            resultElement.textContent = 'Correct!';
            correctCount++;
            correctCountElement.textContent = correctCount; 
            resultElement.classList.add('text-success');
        } else {
            resultElement.textContent = 'Incorrect!';
            incorrectCount++;
            incorrectCountElement.textContent = incorrectCount; 
            resultElement.classList.add('text-danger');
        }

        
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);

        resultElement.classList.remove('hidden');
    }

    function resetScore() {
        correctCount = 0;
        incorrectCount = 0;

        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);

        correctCountElement.textContent = correctCount;
        incorrectCountElement.textContent = incorrectCount;
    }
});


