document.addEventListener("DOMContentLoaded", () => {
  let queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
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
          generateQuestion(response, 2);
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
  // Generate question template
  const generateQuestion = (response, index) => {
    let answers = [];
    let question = response.results[index].question;
    let answer = response.results[index].correct_answer;
    let incorrectAnswers = response.results[index].incorrect_answers;
    answers.push(answer);
    answers.push(incorrectAnswers);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    let answerButtons = shuffle(answers.flat());
    document.querySelector(".question").firstElementChild.innerHTML = question;
    answerButtons.forEach(answer => {
      let button = document.createElement("button");
      button.setAttribute("data-option", answer);
      button.innerHTML = answer;
      document.querySelector(".options").appendChild(button);
    });
    console.log(`Answer is ${answer}`);
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
  // Timer
  const countdownNumber = document.getElementById('countdown-number');
  const COUNTDOWN = 20;
  let countdown = 20;
  countdownNumber.textContent = countdown;
  setInterval(function() {
    countdown = --countdown <= 0 ? COUNTDOWN : countdown;
    countdownNumber.textContent = countdown;
  }, 1000);
});