const settingsButton = document.querySelector(".options__button--settings");
settingsButton.addEventListener("click", () => {
   settingsButton.classList.toggle("active");
   const settings = document.querySelector(".settings");
   settings.classList.toggle("is-showed");
   const siteContainer = document.querySelector(".site-container");
   siteContainer.classList.toggle("has-overlay");
   if (settingsButton.classList.contains("active")) {
      timer.stop();
   }
   else if (game.isStarted && !game.isEnded && !game.isOver)
      timer.start();
});
