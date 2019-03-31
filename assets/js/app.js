document.addEventListener("DOMContentLoaded", () => {
  // Because of lexical scope,
  // let `answer` variables be accessed globally
  let answer,
      index = 1;
  // set up the api request in the background
  let queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
  if (window.fetch) {
    fetch(queryURL, {
      method: "GET"
    })
      .then(result => result.json())
      .then(response => {
        // console.log(`fetch => ${response}`);
        renderQuestions(response);
      });
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", queryURL);
    xhr.onload = event => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let response = JSON.parse(xhr.response);
          // console.log(`xhr => ${response}`);
          renderQuestions(response);
        } else {
          console.error(xhr.responseText);
        }
      }
    };
    xhr.onerror = event => {
      console.error(xhr.responseText);
    };
    xhr.send();
  }
  // Start the game
  const startGame = () => {
    let overlay = document.querySelector(".overlay");
    let modal = document.querySelector(".modal");
    let countdownDiv = document.getElementById("countdown");
    let totalIndicatorDiv = document.querySelector(".total-indicator");
    // Remove overlay and modal from the dom
    overlay.remove();
    modal.remove();
    // Show divs by removing the hide class
    countdownDiv.classList.remove("hide");
    totalIndicatorDiv.classList.remove("hide");
    document.querySelector(".branding").classList.add("active");
    // Start the timer
    startTimer();
  }
  // Assess the answer
  const assessAnswer = (answer, selectedAnswer) => {
    answer === selectedAnswer ? console.log("you're right!") : console.log("you're wrong!");
  }
  // Generate question template
  const renderQuestions = (response) => {
    let answers = [];
    let questions = response.results;
    questions.forEach(trivia => {
      // Containing div for each question
      let div = document.createElement("div");
      div.classList.add("question");
      // H1 for the question
      let heading = document.createElement("h1");
      heading.innerHTML = trivia.question;
      // Group answers in .answers
      let buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("answers");
      let correctAnswer = trivia.correct_answer;
      let incorrectAnswers = trivia.incorrect_answers;
      answers.push(correctAnswer);
      answers.push(incorrectAnswers);
      // Append H1 and .answers into .question
      div.appendChild(heading);
      div.appendChild(buttonsDiv);
      document.querySelector(".question-and-answers").appendChild(div);
      // trivia
      // console.log(trivia);
    });
    let question = response.results[index].question;
    answer = response.results[index].correct_answer;
    let incorrectAnswers = response.results[index].incorrect_answers;
    answers.push(answer);
    answers.push(incorrectAnswers);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    let answerButtons = shuffle(answers.flat());

    document.querySelector(".question").firstElementChild.innerHTML = question;
    answerButtons.forEach(answer => {
      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.classList.add("btn-answer");
      button.innerHTML = answer;
      document.querySelector(".options").appendChild(button);
    });
    return answer;
  }
  // Get selected answer
  const getSelectedAnswer = () => {
    event.preventDefault();
    // Capture buttons only
    if (event.target.type === "button") {
      let selectedAnswer = event.target.innerHTML;
      assessAnswer(answer, selectedAnswer);
      console.log(`you chose => ${selectedAnswer}`);
      console.log(`the right answer is ${answer}`);
    }
  }
  // Bubble up from parent of buttons to handle click
  document.querySelector(".options").addEventListener("click", getSelectedAnswer);
  // Shuffle Array
  // Based on the Fisher-Yates shuffle algorithm
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    // Need to convert output into an actual array
    Array.from(array);
    return array;
  }
  // Circular timer
  const startTimer = () => {
    const countdownNumber = document.getElementById('countdown-number');
    const COUNTDOWN = 20;
    let countdown = 20;
    countdownNumber.textContent = countdown;
    setInterval(function() {
      countdown = --countdown <= 0 ? COUNTDOWN : countdown;
      countdownNumber.textContent = countdown;
    }, 1000);
  }
  // Start the game with button
  document.querySelector(".btn-start").addEventListener("click", (event) => {
    event.preventDefault();
    startGame();
  });
});