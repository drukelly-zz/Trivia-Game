document.addEventListener("DOMContentLoaded", () => {
  let
    answers = [],
    index = 0,
    messageDiv = document.querySelector(".message"),
    qaDiv = document.querySelector(".question-and-answers"),
    queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple",
    response,
    right = 0,
    selectedAnswer = 0,
    statsDiv = document.querySelector(".stats"),
    wrong = 0;
  const callAPI = (response, index) => {
    if (window.fetch) {
      fetch(queryURL, {
        method: "GET"
      })
        .then(result => result.json())
        .then(response => {
          // console.log(`fetch => ${response}`);
          generateQuestion(response, index);
        });
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", queryURL);
      xhr.onload = event => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            // console.log(`xhr => ${response}`);
            generateQuestion(response, index);
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
  }
  // Correct answer handling
  const isCorrect = (message) => {
    ++right;
    ++index;
    console.log(right);
    qaDiv.classList.add("hide");
    statsDiv.classList.add("hide");
    messageDiv.classList.remove("hide");
    messageDiv.innerHTML = `<h1>${message}</h1>`;
    messageDiv.innerHTML += `<img src="https://media.giphy.com/media/w1XIBQlBjMTsc/giphy-downsized.gif" class="img-25" alt="Correct!">`;
    setTimeout(() => nextQuestion(response), 1500);
  }
  // Wrong answer handling
  const isWrong = (message) => {
    ++wrong;
    ++index;
    qaDiv.classList.add("hide");
    statsDiv.classList.add("hide");
    messageDiv.classList.remove("hide");
    messageDiv.innerHTML = `<img src="https://media.giphy.com/media/13JksdKh3B1LcQ/giphy-downsized.gif" class="img-25" alt="Wrong!">`;
    messageDiv.innerHTML += `<h1>${message}</h1>`;
    setTimeout(() => nextQuestion(response), 1500);
  }
  // Next question
  const nextQuestion = (response) => {
    callAPI(response, index);
    messageDiv.classList.add("hide");
    qaDiv.classList.remove("hide");
    statsDiv.classList.remove("hide");
  }
  // Generate question template
  const generateQuestion = (response, index) => {
    question = response.results[index].question,
      correctAnswer = response.results[index].correct_answer,
      incorrectAnswers = response.results[index].incorrect_answers;
    answers = [];
    answers.push(correctAnswer);
    answers.push(incorrectAnswers);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    let answerButtons = shuffle(answers.flat());
    document.querySelector(".question").firstElementChild.innerHTML = question;
    // Loop through each button
    answerButtons.forEach(answer => {
      let button = document.createElement("button");
      button.innerHTML = answer;
      button.addEventListener("click", (event) => {
        selectedAnswer = button.innerHTML;
        button.innerHTML === correctAnswer ? isCorrect("Correct!") : isWrong("Wrong!");
      });
      document.querySelector(".options").appendChild(button);
    });
    console.log(`The correct answer is ${correctAnswer}`);
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
  // Starts the game
  const startGame = () => {
    let overlay = document.querySelector(".overlay"),
      modal = document.querySelector(".modal");
    // Remove overlay and modal from the DOM
    overlay.remove();
    modal.remove();
    // Show divs by removing the "hide" class
    statsDiv.classList.remove("hide");
    qaDiv.classList.remove("hide");
    document.querySelector(".branding").classList.add("active");
    // Start the timer
    startTimer();
    // Call the API
    callAPI(response, index);
  }
  // Start the timer
  const startTimer = () => {
    const countdownNumber = document.getElementById('countdown-number');
    // Change const COUNTDOWN and let countdown to desired number
    // Note: Be sure to change (site.css, line 176) to match the animation duration
    const COUNTDOWN = 10;
    let countdown = 10;
    countdownNumber.textContent = countdown;
    setInterval(() => {
      countdown = --countdown < 0 ? COUNTDOWN : countdown;
      countdownNumber.textContent = countdown;
      if (countdown === 0 && selectedAnswer <= 0) isWrong("You didn't answer!")
    }, 1000);
  }
  // Start the game with button
  document.querySelector(".btn-start").addEventListener("click", (event) => {
    event.preventDefault();
    startGame();
  });
});