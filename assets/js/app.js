document.addEventListener("DOMContentLoaded", () => {
  let wrong,
    right,
    queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
  if (window.fetch) {
    fetch(queryURL, {
      method: "GET"
    })
      .then(result => result.json())
      .then(response => {
        // console.log(`fetch => ${response}`);
        generateQuestion(response, 2);
      });
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", queryURL);
    xhr.onload = event => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let response = JSON.parse(xhr.response);
          // console.log(`xhr => ${response}`);
          generateQuestion(response, 0);
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
  // 
  const isCorrect = (message) => {
    console.log(message);
  }
  // 
  const isWrong = (message) => {
    console.log(message);
  }
  // Generate question template
  const generateQuestion = (response, index) => {
    let answers = [],
      question = response.results[index].question,
      correctAnswer = response.results[index].correct_answer,
      incorrectAnswers = response.results[index].incorrect_answers;
    answers.push(correctAnswer);
    answers.push(incorrectAnswers);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    let answerButtons = shuffle(answers.flat());
    document.querySelector(".question").firstElementChild.innerHTML = question;
    answerButtons.forEach(answer => {
      let button = document.createElement("button");
      button.setAttribute("data-option", answer);
      button.innerHTML = answer;
      button.addEventListener("click", () => {
        console.log(answer);
        button.innerHTML === correctAnswer ? isCorrect("you're right!") : isWrong("you're wrong!");
      });
      document.querySelector(".options").appendChild(button);
    });
    console.log(`Answer is ${correctAnswer}`);
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
  }
  // Start timer
  const startTimer = () => {
    const countdownNumber = document.getElementById('countdown-number');
    const COUNTDOWN = 20;
    let countdown = 20;
    countdownNumber.textContent = countdown;
    setInterval(function () {
      countdown = --countdown <= 0 ? COUNTDOWN : countdown;
      countdownNumber.textContent = countdown;
      if (countdown === 1) isWrong("you didn't answer!")
    }, 1000);
  }
});