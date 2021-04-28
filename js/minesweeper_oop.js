"use strict";class Cell{constructor(){this.isFlag=!1,this.isBomb=!1,this.isVisited=!1,this.value=0}}class Minesweeper{constructor(t,e){this.options=Object.assign({rows:9,columns:9,bombs:10,fieldCell:"field-cell",refreshButton:".refresh-button"},e),this.game=document.querySelector(t),this.refreshButton=document.querySelector(this.options.refreshButton),this.isStarted=!1,this.isEnded=!1,this.isOver=!1,this.field=[[]],this.set_default_styles=()=>{this.game.classList.add("minesweeper-field"),document.documentElement.style.setProperty("--columns-count",this.options.columns),document.documentElement.style.setProperty("--rows-count",this.options.rows)},this.set_default_styles(),this.set_field_size=()=>{(()=>{this.game.innerHTML="",this.game.style.gridTemplateRows=`repeat(${this.options.rows}, 1fr)`,this.game.style.gridTemplateColumns=`repeat(${this.options.columns}, 1fr)`;for(let t=1;t<=this.options.rows;++t)for(let e=1;e<=this.options.columns;++e){const s=document.createElement("button");s.classList.add(this.options.fieldCell),s.dataset.cell=`${t} ${e}`,this.game.append(s)}})();this.field=new Array(this.options.rows+2);for(let t=0;t<this.options.rows+2;++t){this.field[t]=new Array(this.options.columns+2);for(let e=0;e<this.options.columns+2;++e)this.field[t][e]=new Cell}},this.set_field_size(),this.game.addEventListener("click",t=>{const e=t.target;if(e&&e.classList.contains(this.options.fieldCell)){const[t,s]=[...e.dataset.cell.split(" ").map(t=>parseInt(t))];this.click_left(t,s)}}),this.game.addEventListener("contextmenu",t=>{t.preventDefault();const e=t.target;if(e&&e.classList.contains(this.options.fieldCell)){const[t,s]=[...e.dataset.cell.split(" ").map(t=>parseInt(t))];this.click_right(t,s)}return!1}),this.game.addEventListener("mousedown",t=>{t.preventDefault();const e=t.target;if(e&&e.classList.contains(this.options.fieldCell)){const[s,i]=[...e.dataset.cell.split(" ").map(t=>parseInt(t))];switch(t.button){case 1:this.wheel_click(s,i)}}return!1}),this.game.addEventListener("dblclick",t=>{t.preventDefault();const e=t.target;if(e&&e.classList.contains(this.options.fieldCell)){const[t,s]=[...e.dataset.cell.split(" ").map(t=>parseInt(t))];this.wheel_click(t,s)}}),this.refreshButton&&this.refreshButton.addEventListener("click",()=>{this.refresh(),this.onGameRefresh()})}onGameRefresh(){const t=new CustomEvent("MS_GameRefresh",{});window.dispatchEvent(t)}onGameStart(){const t=new CustomEvent("MS_GameStart",{});window.dispatchEvent(t)}onGameOver(){const t=new CustomEvent("MS_GameOver",{});window.dispatchEvent(t)}onGameWin(){const t=new CustomEvent("MS_GameWin",{});window.dispatchEvent(t)}}function rand(t){return Math.floor(Math.random()*t)}function find_cell(t,e){const s=`${t} ${e}`;return document.querySelector(`.field-cell[data-cell="${s}"]`)}function open_cell(t,e){const s=find_cell(t,e),i=this.field[t][e].isFlag;s&&!i&&s.classList.add("visited")}function set_cell_state(t,e){const s=this.field[t][e].value,i=this.field[t][e].isBomb,o=this.field[t][e].isFlag,n=find_cell(t,e);o&&n?n.classList.toggle("is-flag"):s>0&&n?n.innerText=s:i&&n&&(n.style.background='url("./img/bomb.svg") center/50% no-repeat')}function visit_empty_cells(t){for(;t.length>0;){const e=t.pop(),[s,i]=[e.row_index,e.column_index];this.field[s][i].isVisited=!0;for(let e=-1;e<=1;++e)for(let o=-1;o<=1;++o)this.isUndefinedCell(s+e,i+o)||this.field[s+e][i+o].isVisited||(this.field[s+e][i+o].isVisited||0!=this.field[s+e][i+o].value?0==this.field[s][i].value&&this.field[s+e][i+o].value>0&&(this.field[s+e][i+o].isVisited=!0,open_cell.call(this,s+e,i+o)):(this.field[s+e][i+o].isVisited=!0,open_cell.call(this,s+e,i+o),t.push({row_index:s+e,column_index:i+o})))}}Minesweeper.prototype.gameOver=function(){return this.isOver=!0,this.locking(),this.show_all_bombs(),this.onGameOver(),!1},Minesweeper.prototype.gameWin=function(){this.isEnded=!0,this.locking(),this.onGameWin()},Minesweeper.prototype.set_bombs_count=function(t){this.options.bombs=t},Minesweeper.prototype.set_rows_count=function(t){this.options.rows=t},Minesweeper.prototype.set_columns_count=function(t){this.options.columns=t},Minesweeper.prototype.set_states=function(){for(let t=1;t<=this.options.rows;++t)for(let e=1;e<=this.options.columns;++e){if(this.field[t][e].isFlag||set_cell_state.call(this,t,e),this.field[t][e].isBomb)continue;this.field[t][e].value=this.count_bombs_on_area(t,e);const s=this.field[t][e].value,i=find_cell(t,e);s>0&&i&&(i.innerText=s,i.style.padding="0")}},Minesweeper.prototype.open_cells_on_area=function(t,e){for(let s=-1;s<=1;++s)for(let i=-1;i<=1;++i){const o=this.field[t+s][e+i].isFlag;this.isUndefinedCell(t+s,e+i)||o||open_cell.call(this,t+s,e+i)}},Minesweeper.prototype.set_states_on_area=function(t,e){for(let s=-1;s<=1;++s)for(let i=-1;i<=1;++i){const o=this.field[t+s][e+i].isFlag;this.isUndefinedCell(t+s,e+i)||o||(this.field[t+s][e+i].isVisited=!0)}},Minesweeper.prototype.remove_states_on_area=function(t,e){for(let s=-1;s<=1;++s)for(let i=-1;i<=1;++i){const o=this.field[t+s][e+i].isFlag;this.isUndefinedCell(t+s,e+i)||o||(this.field[t+s][e+i].isVisited=!1)}},Minesweeper.prototype.isUndefinedCell=function(t,e){return t>this.options.rows||t<1||(e>this.options.columns||e<1)},Minesweeper.prototype.isGameWin=function(){let t=0,e=0;for(let s=1;s<=this.options.rows;++s)for(let i=1;i<=this.options.columns;++i){const o=this.field[s][i].isFlag&&this.field[s][i].isBomb;(this.field[s][i].isVisited||o)&&t++,this.field[s][i].isVisited&&!this.field[s][i].isBomb&&e++}let s=this.options.rows*this.options.columns-e;return s==this.options.bombs||(s=this.options.rows*this.options.columns-t,s<=2)},Minesweeper.prototype.resize=function(t,e,s){this.set_bombs_count(s),this.set_rows_count(t),this.set_columns_count(e),this.set_field_size()},Minesweeper.prototype.count_bombs_on_area=function(t,e){let s=0;for(let i=-1;i<=1;++i)for(let o=-1;o<=1;++o)this.field[t+i][e+o].isBomb&&s++;return s},Minesweeper.prototype.count_flags_on_area=function(t,e){let s=0;for(let i=-1;i<=1;++i)for(let o=-1;o<=1;++o)this.field[t+i][e+o].isFlag&&s++;return s},Minesweeper.prototype.generate_bombs=function(){for(let t=0;t<this.options.bombs;t++){let t=rand(this.options.rows)+1,e=rand(this.options.columns)+1;for(;this.field[t][e].isBomb||this.field[t][e].isVisited;)t=rand(this.options.rows)+1,e=rand(this.options.columns)+1;this.field[t][e].value=-1,this.field[t][e].isBomb=!0,this.field[t][e].isVisited=!1}},Minesweeper.prototype.click_left=function(t,e){if(!this.isUndefinedCell(t,e)&&!this.field[t][e].isVisited&&!this.field[t][e].isFlag)if(this.field[t][e].isBomb)this.gameOver();else{if(this.isStarted){if(0==this.field[t][e].value){const s=new Array;s.push({row_index:t,column_index:e}),visit_empty_cells.call(this,s)}this.field[t][e].isVisited=!0,open_cell.call(this,t,e)}else{this.set_states_on_area(t,e),this.getStarted(),this.remove_states_on_area(t,e),this.open_cells_on_area(t,e);const s=new Array;for(let i=-1;i<=1;++i)for(let o=-1;o<=1;++o)this.isUndefinedCell(t+i,e+o)||this.field[t+i][e+o].isVisited||0!=this.field[t+i][e+o].value||s.push({row_index:t+i,column_index:e+o});visit_empty_cells.call(this,s),this.isStarted=!0,this.onGameStart()}this.isGameWin()&&this.gameWin()}},Minesweeper.prototype.click_right=function(t,e){if(this.isUndefinedCell(t,e))return;const s=this.field[t][e].isFlag,i=this.field[t][e].isVisited;s||i?s&&!i&&(set_cell_state.call(this,t,e),this.field[t][e].isFlag=!1):(this.field[t][e].isFlag=!0,set_cell_state.call(this,t,e)),this.isGameWin()&&this.gameWin()},Minesweeper.prototype.wheel_click=function(t,e){const s=this.count_flags_on_area(t,e)>=this.field[t][e].value;if(this.field[t][e].isVisited&&s)for(let s=-1;s<=1;++s)for(let i=-1;i<=1;++i)this.click_left(t+s,e+i)},Minesweeper.prototype.getStarted=function(){return this.generate_bombs(),this.set_states(),this},Minesweeper.prototype.refresh=function(){this.isStarted=!1,this.isOver=!1,this.field=[[]],this.set_default_styles(),this.set_field_size()},Minesweeper.prototype.locking=function(){for(let t=1;t<=this.options.rows;++t)for(let e=1;e<=this.options.columns;++e){const s=find_cell(t,e);s.style.pointerEvents="none",s.tabIndex="-1"}},Minesweeper.prototype.unlocking=function(){for(let t=1;t<=this.options.rows;++t)for(let e=1;e<=this.options.columns;++e){const s=find_cell(t,e);s.style.pointerEvents=null,s.tabIndex=null;this.field[t][e].isBomb&&open_cell.call(this,t,e)}},Minesweeper.prototype.show_all_bombs=function(){for(let t=1;t<=this.options.rows;++t)for(let e=1;e<=this.options.columns;++e){this.field[t][e].isBomb&&open_cell.call(this,t,e)}};