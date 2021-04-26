const game = new Minesweeper(".field", {
   rows: 9,
   columns: 9,
   bombs: 10,
   refreshButton: ".options__button--refresh",
});


// timer class
class Timer {
   constructor() {
      this.timer = document.querySelector(".timer");
      this.timerMinutes = document.querySelector(".timer__minutes");
      this.timerSeconds = document.querySelector(".timer__seconds");
      this.interval = null;
   }
   start() {
      let minutes = 0, seconds = 1;
      this.interval = setInterval(() => {
         if (seconds > 59) {
            minutes++;
            seconds %= 60;
         }
         minutes %= 60;

         if (minutes <= 9) {
            this.timerMinutes.innerHTML = "0" + minutes;
         } else this.timerMinutes.innerHTML = minutes;
         if (seconds <= 9) {
            this.timerSeconds.innerHTML = "0" + seconds;
         } else this.timerSeconds.innerHTML = seconds;

         seconds++;
      }, 1000);
   }
   clear() {
      clearInterval(this.interval);
      this.timerMinutes.innerHTML = "00";
      this.timerSeconds.innerHTML = "00";
   }
   stop() {
      clearInterval(this.interval);
   }
}

const timer = new Timer();
// timer.start();

window.addEventListener("refresh", function () {
   timer.clear();
});

window.addEventListener("gameStart", function () {
   timer.start();
});

window.addEventListener("gameWin", function () {
   timer.stop();
});
window.addEventListener("gameOver", function () {
   timer.stop();
});
