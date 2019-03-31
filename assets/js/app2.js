document.addEventListener("DOMContentLoaded", () => {
  // Because of lexical scope,
  // let `answer` variables be accessed globally
  let correctAnswer;
  // Breaking out process into multiple JSON files
  const processQuestion = (queryURL) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", queryURL);
    xhr.onload = event => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log(`xhr => ${response}`);
          let response = JSON.parse(xhr.response),
            answers = [],
            question = response.question,
            correctAnswer = response.correct_answer,
            incorrectAnswers = response.incorrect_answers;
          answers.push(correctAnswer);
          answers.push(incorrectAnswers);
          answers = shuffle(answers.flat());
          let heading = document.createElement("h1"),
            container = document.querySelector(".question-and-answers");
          options = document.createElement("div");
          heading.innerHTML = question;
          options.classList.add("options");
          container.appendChild(heading);
          container.appendChild(options);
          answers.forEach(item => {
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.innerHTML = item;
            options.appendChild(button);
            // Bubble up from parent of buttons to handle click
            document.querySelector(".options").addEventListener("click", getSelectedAnswer);
          });
          return correctAnswer;
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
  // Assess the answer
  const assessAnswer = (correctAnswer, selectedAnswer) => {
    correctAnswer === selectedAnswer ? console.log("you're right!") : console.log("you're wrong!");
  }
  // Get selected answer
  const getSelectedAnswer = () => {
    event.preventDefault();
    // Capture buttons only
    if (event.target.type === "button") {
      let selectedAnswer = event.target.innerHTML;
      console.log(`you chose => ${selectedAnswer}`);
      console.log(`the right answer is ${correctAnswer}`);
      assessAnswer(correctAnswer, selectedAnswer);
    }
  }
  // Start the game
  const startGame = () => {
    let overlay = document.querySelector(".overlay"),
      modal = document.querySelector(".modal"),
      countdownDiv = document.getElementById("countdown"),
      totalIndicatorDiv = document.querySelector(".total-indicator");
    // Remove overlay and modal from the DOM
    overlay.remove();
    modal.remove();
    // Show divs by removing the "hide" class
    countdownDiv.classList.remove("hide");
    totalIndicatorDiv.classList.remove("hide");
    document.querySelector(".branding").classList.add("active");
    // Start the timer
    startTimer();
    // Load question
    // Step through from 0 to 9
    processQuestion("/assets/data/question-0.json");
  }
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
    setInterval(function () {
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