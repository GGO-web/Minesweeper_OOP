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

// click on overlay and close setting menu event
window.addEventListener("click", function (event) {
   const targetELement = event.target;
   if (targetELement && targetELement.classList.contains("has-overlay")) {
      settingsButton.click();
   }
});
