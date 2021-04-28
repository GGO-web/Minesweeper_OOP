const toggleGameWinModal = () => {
   const GameWinModal = document.querySelector(".game-win");
   GameWinModal.classList.toggle("is-showed");
};
const toggleGameOverModal = () => {
   const GameOverModal = document.querySelector(".game-over");
   GameOverModal.classList.toggle("is-showed");
};

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
