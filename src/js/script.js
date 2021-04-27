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

      this.minutes = 0;
      this.seconds = 1;
   }
   start() {
      this.interval = setInterval(() => {
         if (this.seconds > 59) {
            this.minutes++;
            this.seconds %= 60;
         }
         this.minutes %= 60;

         if (this.minutes <= 9) {
            this.timerMinutes.innerHTML = "0" + this.minutes;
         } else this.timerMinutes.innerHTML = this.minutes;
         if (this.seconds <= 9) {
            this.timerSeconds.innerHTML = "0" + this.seconds;
         } else this.timerSeconds.innerHTML = this.seconds;

         this.seconds++;
      }, 1000);
   }
   clear() {
      clearInterval(this.interval);
      this.timerMinutes.innerHTML = "00";
      this.timerSeconds.innerHTML = "00";
      this.minutes = 0;
      this.seconds = 1;
   }
   stop() {
      clearInterval(this.interval);
   }
}

const timer = new Timer();
// timer.start();

window.addEventListener("MS_GameRefresh", function () {
   timer.clear();
});

window.addEventListener("MS_GameStart", function () {
   timer.start();
});

window.addEventListener("MS_GameWin", function () {
   timer.stop();
});

window.addEventListener("MS_GameOver", function () {
   timer.stop();
});
