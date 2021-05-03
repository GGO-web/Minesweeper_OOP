// overlay toogle function
function toogleOverlay() {
   const siteContainer = document.querySelector(".site-container");
   siteContainer.classList.toggle("has-overlay");
}
// show settings function
function showSettings() {
   const settings = document.querySelector(".settings");
   settings.classList.toggle("is-showed");
}

const settingsButton = document.querySelector(".options__button--settings");
settingsButton.addEventListener("click", () => {
   settingsButton.classList.toggle("active");

   showSettings();
   toogleOverlay();

   if (settingsButton.classList.contains("active")) {
      timer.stop();
   } else if (game.isStarted && !game.isEnded && !game.isOver) {
      timer.start();
   }
});

// click on overlay and close setting menu event
window.addEventListener("click", function (event) {
   const targetELement = event.target;
   if (targetELement && targetELement.classList.contains("has-overlay")) {
      settingsButton.click();
   }
});

const GameWinModal = document.querySelector(".game-win");
const GameOverModal = document.querySelector(".game-over");
const toggleGameWinModal = () => {
   GameWinModal.classList.toggle("is-showed");
};
const toggleGameOverModal = () => {
   GameOverModal.classList.toggle("is-showed");
};
const closeModals = () => {
   GameWinModal.classList.remove("is-showed");
   GameOverModal.classList.remove("is-showed");
}

const GameWinButton = document.querySelector(".game-win__button");
GameWinButton.addEventListener("click", function (event) {
   toggleGameWinModal();
   timer.clear();
   game.refresh();
});
const GameOverButton = document.querySelector(".game-over__button");
GameOverButton.addEventListener("click", function (event) {
   toggleGameOverModal();
   timer.clear();
   game.refresh();
});

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

// range sliders options
const rangeSliders = document.querySelectorAll(".settings__option-slider");
const rangeRowsSlider = document.querySelector(
   ".settings__option-slider--rows"
);
const rangeColumnsSlider = document.querySelector(
   ".settings__option-slider--columns"
);
const rangeBombsSlider = document.querySelector(
   ".settings__option-slider--bombs"
);

// maximum bombs count for this field size
const bombsMaxCount = () => {
   return (game.options.columns - 1) * (game.options.rows - 1);
};

noUiSlider.create(rangeRowsSlider, {
   start: 9,
   connect: "lower",
   range: {
      min: [9],
      max: [30],
   },
   step: 1,
   tooltips: false,
   format: {
      // 'to' the formatted value. Receives a number.
      to: function (value) {
         return parseInt(value.toFixed(0));
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function (value) {
         return value;
      },
   },
});
noUiSlider.create(rangeColumnsSlider, {
   start: 9,
   connect: "lower",
   range: {
      min: [9],
      max: [15],
   },
   step: 1,
   tooltips: false,
   format: {
      // 'to' the formatted value. Receives a number.
      to: function (value) {
         return parseInt(value.toFixed(0));
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function (value) {
         return value;
      },
   },
});
noUiSlider.create(rangeBombsSlider, {
   start: 10,
   connect: "lower",
   range: {
      min: 10,
      max: bombsMaxCount(),
   },
   step: 1,
   tooltips: false,
   format: {
      // 'to' the formatted value. Receives a number.
      to: function (value) {
         return parseInt(value.toFixed(0));
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function (value) {
         return value;
      },
   },
});

const setGameSettings = () => {
   const rows = rangeRowsSlider.noUiSlider.get(),
      columns = rangeColumnsSlider.noUiSlider.get(),
      bombs = rangeBombsSlider.noUiSlider.get();

   game.resize(rows, columns, bombs);
   game.refresh();
   rangeBombsSlider.noUiSlider.updateOptions({
      range: {
         min: 10,
         max: bombsMaxCount(),
      },
   });
};

rangeSliders.forEach((rangeSlider) => {
   const sliderValue = rangeSlider.parentElement.querySelector(".settings__slider-value");

   rangeSlider.noUiSlider.on("slide", function () {
      sliderValue.innerText = rangeSlider.noUiSlider.get();
   });

   let previousValue = rangeSlider.noUiSlider.get();
   rangeSlider.noUiSlider.on("change", function () {
      sliderValue.innerHTML = rangeSlider.noUiSlider.get();

      const currentValue = rangeSlider.noUiSlider.get();
      if (previousValue != currentValue) {
         timer.clear();
         setGameSettings();

         closeModals();
      }
      previousValue = currentValue;
   });
});

// game events example
window.addEventListener("MS_GameRefresh", function () {
   closeModals();
   timer.clear();
});

window.addEventListener("MS_GameStart", function () {
   timer.start();
});

window.addEventListener("MS_GameWin", function () {
   toggleGameWinModal();
   timer.stop();
});

window.addEventListener("MS_GameOver", function () {
   toggleGameOverModal();
   timer.stop();
});

//# sourceMappingURL=script.js.map
