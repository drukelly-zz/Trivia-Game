document.addEventListener("DOMContentLoaded", () => {
  let answers = [],
    index = 0,
    messageDiv = document.querySelector(".message"),
    qaDiv = document.querySelector(".question-and-answers"),
    queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple",
    response,
    right = 0,
    selectedAnswer = 0,
    statsDiv = document.querySelector(".stats"),
    timerID,
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
  // A helper function to decode HTML entities
  // https://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
  const parseHTML = (html) => {
    let parser = new DOMParser,
      dom = parser.parseFromString(
        `<!doctype html><body>${html}`, "text/html"
      );
    return dom.body.textContent;
  }
  // All done with Trivia
  const doneWithTrivia = () => {
    statsDiv.remove();
    qaDiv.remove();
    messageDiv.innerHTML = `<h1>Great job!</h1>`;
    messageDiv.innerHTML +=
      `<table class="scoreboard">
        <tr>
          <td><i class="fas fa-check"></i></td>
          <td><i class="fas fa-times"></i></td>
        </tr>
        <tr>
          <td><strong>${right}</strong></td>
          <td><strong>${wrong}</strong></td>
        </tr>
      </table>`;
    messageDiv.innerHTML += `<p><a href="#" class="btn-refresh">Play Again</a></p>`;
    // Restart the game
    document.querySelector(".btn-refresh").addEventListener("click", (event) => {
      event.preventDefault();
      location.reload(true);
    });
  }
  // Correct answer handling
  const isCorrect = (message) => {
    clearInterval(timerID);
    ++right;
    ++index;
    qaDiv.classList.add("hide");
    statsDiv.classList.add("hide");
    messageDiv.classList.remove("hide");
    messageDiv.innerHTML = `<img src="https://media.giphy.com/media/w1XIBQlBjMTsc/giphy-downsized.gif" class="img-25" alt="Correct!">`;
    messageDiv.innerHTML += `<h1>${message}</h1>`;
    selectedAnswer = 0;
    setTimeout(() => nextQuestion(response), 1500);
  }
  // Wrong answer handling
  const isWrong = (message) => {
    clearInterval(timerID);
    ++wrong;
    ++index;
    qaDiv.classList.add("hide");
    statsDiv.classList.add("hide");
    messageDiv.classList.remove("hide");
    messageDiv.innerHTML = `<img src="https://media.giphy.com/media/6JB4v4xPTAQFi/giphy.gif" class="img-25" alt="Wrong!">`;
    messageDiv.innerHTML += `<h1>${message}</h1>`;
    selectedAnswer = 0;
    setTimeout(() => nextQuestion(response), 2250);
  }
  // Next question
  const nextQuestion = (response) => {
    clearInterval(timerID);
    if (index > 9) {
      doneWithTrivia();
    } else {
      document.querySelector(".options").innerHTML = "";
      document.querySelector(".total-indicator").firstElementChild.textContent = index + 1;
      callAPI(response, index);
      messageDiv.classList.add("hide");
      qaDiv.classList.remove("hide");
      statsDiv.classList.remove("hide");
      runTimer();
    }
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
      button.innerHTML = parseHTML(answer);
      button.addEventListener("click", (event) => {
        selectedAnswer = 1;
        button.innerHTML === parseHTML(correctAnswer) ? isCorrect("Correct!") : isWrong("Wrong!");
      });
      document.querySelector(".options").appendChild(button);
    });
    // DevTools CHEAT MODE
    // console.log(`The correct answer is ${correctAnswer}`);
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
  // Start the timer
  const runTimer = () => {
    const countdownNumber = document.getElementById('countdown-number');
    // Change const COUNTDOWN and let countdown to desired number
    // Note: Be sure to change (site.css, line 195) to match the animation duration
    const COUNTDOWN = 20;
    let countdown = 20;
    countdownNumber.textContent = countdown;
    timerID = setInterval(() => {
      countdown = --countdown < 0 ? COUNTDOWN : countdown;
      countdownNumber.textContent = countdown;
      if (countdown === 0 && selectedAnswer === 0) isWrong("You didn't answer!")
    }, 1000);
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
    // Resize svg
    document.querySelector(".branding").classList.add("active");
    // Start the timer
    runTimer();
  }
  // Start the game with button
  document.querySelector(".btn-start").addEventListener("click", (event) => {
    event.preventDefault();
    startGame();
  });
  // Call the API
  callAPI(response, index);
});