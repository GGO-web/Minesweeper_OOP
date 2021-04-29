function toogleOverlay(){document.querySelector(".site-container").classList.toggle("has-overlay")}function showSettings(){document.querySelector(".settings").classList.toggle("is-showed")}const settingsButton=document.querySelector(".options__button--settings");settingsButton.addEventListener("click",()=>{settingsButton.classList.toggle("active"),showSettings(),toogleOverlay(),settingsButton.classList.contains("active")?timer.stop():!game.isStarted||game.isEnded||game.isOver||timer.start()}),window.addEventListener("click",(function(e){const t=e.target;t&&t.classList.contains("has-overlay")&&settingsButton.click()}));const GameWinModal=document.querySelector(".game-win"),GameOverModal=document.querySelector(".game-over"),toggleGameWinModal=()=>{GameWinModal.classList.toggle("is-showed")},toggleGameOverModal=()=>{GameOverModal.classList.toggle("is-showed")},GameWinButton=document.querySelector(".game-win__button");GameWinButton.addEventListener("click",(function(e){toggleGameWinModal(),timer.clear(),game.refresh()}));const GameOverButton=document.querySelector(".game-over__button");GameOverButton.addEventListener("click",(function(e){toggleGameOverModal(),timer.clear(),game.refresh()}));const game=new Minesweeper(".field",{rows:9,columns:9,bombs:10,refreshButton:".options__button--refresh"});class Timer{constructor(){this.timer=document.querySelector(".timer"),this.timerMinutes=document.querySelector(".timer__minutes"),this.timerSeconds=document.querySelector(".timer__seconds"),this.interval=null,this.minutes=0,this.seconds=1}start(){this.interval=setInterval(()=>{this.seconds>59&&(this.minutes++,this.seconds%=60),this.minutes%=60,this.minutes<=9?this.timerMinutes.innerHTML="0"+this.minutes:this.timerMinutes.innerHTML=this.minutes,this.seconds<=9?this.timerSeconds.innerHTML="0"+this.seconds:this.timerSeconds.innerHTML=this.seconds,this.seconds++},1e3)}clear(){clearInterval(this.interval),this.timerMinutes.innerHTML="00",this.timerSeconds.innerHTML="00",this.minutes=0,this.seconds=1}stop(){clearInterval(this.interval)}}const timer=new Timer,rangeSliders=document.querySelectorAll(".settings__option-slider"),rangeRowsSlider=document.querySelector(".settings__option-slider--rows"),rangeColumnsSlider=document.querySelector(".settings__option-slider--columns"),rangeBombsSlider=document.querySelector(".settings__option-slider--bombs"),bombsMaxCount=()=>(game.options.columns-1)*(game.options.rows-1);noUiSlider.create(rangeRowsSlider,{start:9,range:{min:[9],max:[30]},step:1,tooltips:!0,format:{to:function(e){return parseInt(e.toFixed(0))},from:function(e){return e}},connect:!0}),noUiSlider.create(rangeColumnsSlider,{start:9,range:{min:[9],max:[15]},step:1,tooltips:!0,format:{to:function(e){return parseInt(e.toFixed(0))},from:function(e){return e}},connect:!0}),noUiSlider.create(rangeBombsSlider,{start:10,range:{min:10,max:bombsMaxCount()},step:1,tooltips:!0,format:{to:function(e){return parseInt(e.toFixed(0))},from:function(e){return e}},connect:!0});const setGameSettings=()=>{const e=rangeRowsSlider.noUiSlider.get(),t=rangeColumnsSlider.noUiSlider.get(),n=rangeBombsSlider.noUiSlider.get();game.resize(e,t,n),game.refresh(),rangeBombsSlider.noUiSlider.updateOptions({range:{min:10,max:bombsMaxCount()}}),rangeBombsSlider.querySelector(".noUi-tooltip").style.display="none"};rangeSliders.forEach(e=>{let t=e.querySelector(".noUi-tooltip");t.style.display="none",e.noUiSlider.on("slide",(function(){t.style.display=null,e.noUiSlider.tooltips=!0}));let n=e.noUiSlider.get();e.noUiSlider.on("change",(function(){t=e.querySelector(".noUi-tooltip"),t.style.display="none";const i=e.noUiSlider.get();n!=i&&(timer.clear(),setGameSettings()),n=i}))}),window.addEventListener("MS_GameRefresh",(function(){GameWinModal.classList.contains("is-showed")&&toggleGameWinModal(),GameOverModal.classList.contains("is-showed")&&toggleGameOverModal(),timer.clear()})),window.addEventListener("MS_GameStart",(function(){timer.start()})),window.addEventListener("MS_GameWin",(function(){toggleGameWinModal(),timer.stop()})),window.addEventListener("MS_GameOver",(function(){toggleGameOverModal(),timer.stop()}));