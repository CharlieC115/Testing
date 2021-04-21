/*let content = document.getElementById('content');

function getData() {
    var xhr = new XMLHttpRequest();
    var data;
    xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            parseData(data);
        }
    };
}

function parseData(data) {
    console.log("DATA IS: ", data);
}

getData();

let getData = data => {
    let theQuestion = `
    <h1>${data.results[0].question}</h1>
    `

    content.innerHTML = theQuestion;
}*/

/*let content = document.getElementById('content');

const showData = data => {
    let theQuestion = `
        <h1>${data.results[0].question}</h1>
        <button>${data.results[0].correct_answer}</button>
        <button>${data.results[0].incorrect_answers[0]}</button>
        <button>${data.results[0].incorrect_answers[1]}</button>
        <button>${data.results[0].incorrect_answers[2]}</button>
    `

    content.innerHTML = theQuestion;
}

fetch("https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple")
    .then(response =>{
        return response.json();
    })
    .then(json_data => {
        console.log(json_data);
        showData(json_data);
    });*/

const question = document.getElementById('question');
const options = Array.from(document.getElementsByClassName('option-text'));

let currentQuestion = {};
let acceptingAnswers = false;

let availableQuesions = [];

let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=13&category=27&difficulty=easy&type=multiple'
)
    .then((response) => {
        return response.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;

    availableQuesions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //localStorage.setItem('mostRecentScore', score);

        return window.location.assign('index.html');
    }
    questionCounter++;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    options.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

options.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});