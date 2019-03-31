document.addEventListener("DOMContentLoaded", () => {
  // Because of lexical scope, let these variables
  // be accessed globally
  let answer;
  // set up the api request in the background
  let queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
  if (window.fetch) {
    fetch(queryURL, {
      method: "GET"
    })
      .then(result => result.json())
      .then(response => {
        // console.log(`fetch => ${response}`);
        generateQuestion(response);
      });
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", queryURL);
    xhr.onload = event => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let response = JSON.parse(xhr.response);
          // console.log(`xhr => ${response}`);
          generateQuestion(response);
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
    // show divs by removing the hide class
    countdownDiv.classList.remove("hide");
    totalIndicatorDiv.classList.remove("hide");
    document.querySelector(".question").classList.remove("hide");
    document.querySelector(".options").classList.remove("hide");
    document.querySelector(".branding").classList.add("active");
    // start the timer
    startTimer();
  }
  // Assess the answer
  const assessAnswer = (answer, selectedAnswer) => {
    answer === selectedAnswer ? console.log("you're right!") : console.log("you're wrong!");
  }
  // Generate question template
  const generateQuestion = (response) => {
    let answers = [];
    let questions = response.results;
    questions.forEach(trivia => {
      let div = document.createElement("div");
      let heading = document.createElement("h1");
      console.log(div, heading);
    });
    // let question = response.results[index].question;
    // answer = response.results[index].correct_answer;
    // let incorrectAnswers = response.results[index].incorrect_answers;
    // answers.push(answer);
    // answers.push(incorrectAnswers);
    // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    // let answerButtons = shuffle(answers.flat());

    // document.querySelector(".question").firstElementChild.innerHTML = question;
    // answerButtons.forEach(answer => {
    //   let button = document.createElement("button");
    //   button.setAttribute("type", "button");
    //   button.classList.add("btn-answer");
    //   button.innerHTML = answer;
    //   document.querySelector(".options").appendChild(button);
    // });
    // return answer;
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