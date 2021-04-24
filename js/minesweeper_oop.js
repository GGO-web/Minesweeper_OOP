"use strict";class Cell{constructor(){this.isFlag=!1,this.isBomb=!1,this.isVisited=!1,this.value=0}}class Minesweeper{constructor(e,t){this.options=Object.assign({rows:9,columns:9,bombs:10,fieldCell:"field-cell"},t),this.game=document.querySelector(e),this.isStarted=!1,this.isOver=!1,this.field=[[]],this.set_default_styles=()=>{this.game.classList.add("minesweeper-field")},this.set_default_styles(),this.set_field_size=()=>{(()=>{this.game.innerHTML="",this.game.style.gridTemplateRows=`repeat(${this.options.rows}, 1fr)`,this.game.style.gridTemplateColumns=`repeat(${this.options.columns}, 1fr)`;for(let e=1;e<=this.options.rows;++e)for(let t=1;t<=this.options.columns;++t){const i=document.createElement("button");i.classList.add(this.options.fieldCell),i.dataset.cell=`${e} ${t}`,this.game.append(i)}})();this.field=new Array(this.options.rows+2);for(let e=0;e<this.options.rows+2;++e){this.field[e]=new Array(this.options.columns+2);for(let t=0;t<this.options.columns+2;++t)this.field[e][t]=new Cell}},this.set_field_size(),this.game.addEventListener("click",e=>{const t=e.target;if(t&&t.classList.contains(this.options.fieldCell)){const[e,i]=[...t.dataset.cell.split(" ").map(e=>parseInt(e))];this.click_left(e,i)}}),this.game.addEventListener("contextmenu",e=>{e.preventDefault();const t=e.target;if(t&&t.classList.contains(this.options.fieldCell)){const[e,i]=[...t.dataset.cell.split(" ").map(e=>parseInt(e))];this.click_right(e,i)}return!1}),this.game.addEventListener("mousedown",e=>{e.preventDefault();const t=e.target;if(t&&t.classList.contains(this.options.fieldCell)){const[i,s]=[...t.dataset.cell.split(" ").map(e=>parseInt(e))];switch(e.button){case 1:this.wheel_click(i,s)}}return!1})}}function rand(e){return Math.floor(Math.random()*e)}function find_cell(e,t){const i=`${e} ${t}`;return document.querySelector(`.field-cell[data-cell="${i}"]`)}function open_cell(e,t){const i=find_cell(e,t),s=this.field[e][t].isFlag;i&&!s&&i.classList.add("visited")}function set_cell_state(e,t){const i=this.field[e][t].value,s=this.field[e][t].isBomb,o=this.field[e][t].isFlag,l=find_cell(e,t);o&&l?l.classList.toggle("is-flag"):i>0&&l?l.innerText=i:s&&l&&(l.style.background='url("./img/bomb.svg") center/50% no-repeat')}function visit_empty_cells(e){for(;e.length>0;){const t=e.pop(),[i,s]=[t.row_index,t.column_index];this.field[i][s].isVisited=!0;for(let t=-1;t<=1;++t)for(let o=-1;o<=1;++o)this.isUndefinedCell(i+t,s+o)||this.field[i+t][s+o].isVisited||(this.field[i+t][s+o].isVisited||0!=this.field[i+t][s+o].value?0==this.field[i][s].value&&this.field[i+t][s+o].value>0&&(this.field[i+t][s+o].isVisited=!0,open_cell.call(this,i+t,s+o)):(this.field[i+t][s+o].isVisited=!0,open_cell.call(this,i+t,s+o),e.push({row_index:i+t,column_index:s+o})))}}Minesweeper.prototype.gameOver=function(){for(let e=1;e<=this.options.rows;++e)for(let t=1;t<=this.options.columns;++t){find_cell(e,t).style.pointerEvents="none";this.field[e][t].isBomb&&open_cell.call(this,e,t)}return alert("Game is over!"),!1},Minesweeper.prototype.gameWin=function(){alert("Congratulations, you really are a sapper!")},Minesweeper.prototype.set_bombs_count=function(e){this.options.bombs=e},Minesweeper.prototype.set_rows_count=function(e){this.options.rows=e},Minesweeper.prototype.set_columns_count=function(e){this.options.columns=e},Minesweeper.prototype.set_states=function(){for(let e=1;e<=this.options.rows;++e)for(let t=1;t<=this.options.columns;++t){if(this.field[e][t].isFlag||set_cell_state.call(this,e,t),this.field[e][t].isBomb)continue;this.field[e][t].value=this.count_bombs_on_area(e,t);const i=this.field[e][t].value,s=find_cell(e,t);i>0&&s&&(s.innerText=i,s.style.padding="0")}},Minesweeper.prototype.open_cells_on_area=function(e,t){for(let i=-1;i<=1;++i)for(let s=-1;s<=1;++s){const o=this.field[e+i][t+s].isFlag;this.isUndefinedCell(e+i,t+s)||o||open_cell.call(this,e+i,t+s)}},Minesweeper.prototype.set_states_on_area=function(e,t){for(let i=-1;i<=1;++i)for(let s=-1;s<=1;++s){const o=this.field[e+i][t+s].isFlag;this.isUndefinedCell(e+i,t+s)||o||(this.field[e+i][t+s].isVisited=!0)}},Minesweeper.prototype.remove_states_on_area=function(e,t){for(let i=-1;i<=1;++i)for(let s=-1;s<=1;++s){const o=this.field[e+i][t+s].isFlag;this.isUndefinedCell(e+i,t+s)||o||(this.field[e+i][t+s].isVisited=!1)}},Minesweeper.prototype.isUndefinedCell=function(e,t){return e>this.options.rows||e<1||(t>this.options.columns||t<1)},Minesweeper.prototype.isGameWin=function(){let e=0;for(let t=1;t<=this.options.rows;++t)for(let i=1;i<=this.options.columns;++i){const s=this.field[t][i].isFlag&&this.field[t][i].isBomb;(this.field[t][i].isVisited||s)&&e++}return this.options.rows*this.options.columns-e<=2},Minesweeper.prototype.resize=function(e,t,i){this.set_bombs_count(i),this.set_rows_count(e),this.set_columns_count(t),this.set_field_size()},Minesweeper.prototype.count_bombs_on_area=function(e,t){let i=0;for(let s=-1;s<=1;++s)for(let o=-1;o<=1;++o)this.field[e+s][t+o].isBomb&&i++;return i},Minesweeper.prototype.count_flags_on_area=function(e,t){let i=0;for(let s=-1;s<=1;++s)for(let o=-1;o<=1;++o)this.field[e+s][t+o].isFlag&&i++;return i},Minesweeper.prototype.generate_bombs=function(){for(let e=0;e<this.options.bombs;e++){let e=rand(this.options.rows)+1,t=rand(this.options.columns)+1;for(;this.field[e][t].isBomb||this.field[e][t].isVisited;)e=rand(this.options.rows)+1,t=rand(this.options.columns)+1;this.field[e][t].value=-1,this.field[e][t].isBomb=!0,this.field[e][t].isVisited=!1}},Minesweeper.prototype.click_left=function(e,t){if(!this.isUndefinedCell(e,t)&&!this.field[e][t].isVisited&&!this.field[e][t].isFlag){if(this.field[e][t].isBomb)return this.isOver=!0,void this.gameOver();if(this.isStarted){if(0==this.field[e][t].value){const i=new Array;i.push({row_index:e,column_index:t}),visit_empty_cells.call(this,i)}this.field[e][t].isVisited=!0,open_cell.call(this,e,t)}else{this.set_states_on_area(e,t),this.getStarted(),this.remove_states_on_area(e,t),this.open_cells_on_area(e,t);const i=new Array;for(let s=-1;s<=1;++s)for(let o=-1;o<=1;++o)this.isUndefinedCell(e+s,t+o)||this.field[e+s][t+o].isVisited||0!=this.field[e+s][t+o].value||i.push({row_index:e+s,column_index:t+o});visit_empty_cells.call(this,i),this.isStarted=!0}this.isGameWin()&&this.gameWin()}},Minesweeper.prototype.click_right=function(e,t){if(this.isUndefinedCell(e,t))return;const i=this.field[e][t].isFlag,s=this.field[e][t].isVisited;i||s?i&&!s&&(set_cell_state.call(this,e,t),this.field[e][t].isFlag=!1):(this.field[e][t].isFlag=!0,set_cell_state.call(this,e,t)),this.isGameWin()&&this.gameWin()},Minesweeper.prototype.wheel_click=function(e,t){const i=this.count_flags_on_area(e,t)>=this.field[e][t].value;if(this.field[e][t].isVisited&&i)for(let i=-1;i<=1;++i)for(let s=-1;s<=1;++s)this.click_left(e+i,t+s)},Minesweeper.prototype.getStarted=function(){return this.generate_bombs(),this.set_states(),this};