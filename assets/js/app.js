document.addEventListener("DOMContentLoaded", () => {
  // timer
  const countdownNumberEl = document.getElementById('countdown-number');
  let countdown = 20;

  countdownNumberEl.textContent = countdown;

  setInterval(function() {
    countdown = --countdown <= 0 ? 20 : countdown;

    countdownNumberEl.textContent = countdown;
  }, 1000);
});