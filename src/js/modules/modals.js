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
