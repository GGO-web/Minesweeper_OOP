"use strict";

// ==/> Class For Game Cell Start! </==
class Cell {
   constructor() {
      this.isFlag = false;
      this.isBomb = false;
      this.isVisited = false;
      this.value = 0;
   }
}
// ==/>  Class For Game Cell End!  </==

// ==/> Game Class Start! </==
class Minesweeper {
   constructor(selector, options) {
      let optionsDefault = {
         // for easy level in the game
         rows: 9,
         columns: 9,
         bombs: 10,
         fieldCell: "field-cell",
         refreshButton: ".refresh-button",
      };

      this.options = Object.assign(optionsDefault, options);
      this.game = document.querySelector(selector);
      this.refreshButton = document.querySelector(this.options.refreshButton);

      // game states, which mean if the game has (started), (ended) or (over)
      (this.isStarted = false), (this.isEnded = false), (this.isOver = false);
      this.field = [[]]; // init empty field

      this.set_default_styles = () => {
         this.game.classList.add("minesweeper-field");
         this.game.style.setProperty("--columns-count", this.options.columns);
         this.game.style.setProperty("--rows-count", this.options.rows);
      };
      // for a start generating an easy level
      this.set_default_styles();

      this.set_field_size = () => {
         // generating the field cells
         const generate_field = (() => {
            this.game.innerHTML = ""; // clear all previous elements
            this.game.style.gridTemplateRows = `repeat(${this.options.rows}, 1fr)`;
            this.game.style.gridTemplateColumns = `repeat(${this.options.columns}, 1fr)`;

            for (let i = 1; i <= this.options.rows; ++i) {
               for (let j = 1; j <= this.options.columns; ++j) {
                  const field_cell = document.createElement("button");
                  field_cell.classList.add(this.options.fieldCell);
                  field_cell.dataset.cell = `${i} ${j}`;

                  this.game.append(field_cell);
               }
            }
         })();

         // add a border to the field(just for the field, increase values rows and columns by two)
         this.field = new Array(this.options.rows + 2);

         for (let i = 0; i < this.options.rows + 2; ++i) {
            this.field[i] = new Array(this.options.columns + 2);
            for (let j = 0; j < this.options.columns + 2; ++j) {
               this.field[i][j] = new Cell();
            }
         }
      };
      // for a start generating an easy level
      this.set_field_size();

      // ==/> Event Listeners Start! </==
      // ================================

      // listener for left-click(open the field cell)
      this.game.addEventListener("click", (event) => {
         const targetCell = event.target;
         // check if clicked in the field cell
         if (
            targetCell &&
            targetCell.classList.contains(this.options.fieldCell)
         ) {
            const [row, column] = [
               ...targetCell.dataset.cell.split(" ").map((e) => parseInt(e)),
            ];
            this.click_left(row, column);
         }
      });

      // listener for right-click (set the flag)
      this.game.addEventListener("contextmenu", (event) => {
         event.preventDefault();
         const targetCell = event.target;
         // check if clicked in the field cell
         if (
            targetCell &&
            targetCell.classList.contains(this.options.fieldCell)
         ) {
            const [row, column] = [
               ...targetCell.dataset.cell.split(" ").map((e) => parseInt(e)),
            ];
            this.click_right(row, column);
         }
         return false;
      });

      // listeners for wheel-click (open the cells around clicked cell if possible)
      this.game.addEventListener("mousedown", (event) => {
         event.preventDefault();

         const targetCell = event.target;
         // check if clicked in the field cell
         if (
            targetCell &&
            targetCell.classList.contains(this.options.fieldCell)
         ) {
            const [row, column] = [
               ...targetCell.dataset.cell.split(" ").map((e) => parseInt(e)),
            ];

            const typeOfButton = event.button;
            switch (typeOfButton) {
               case 1: {
                  this.wheel_click(row, column);
                  break;
               }
               default: {
                  break;
               }
            }
         }

         return false;
      });

      // Add touch event listener for apple devices
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
         // mobile set the flag event
         let touchStartTimeStamp = 0,
            touchEndTimeStamp = 0;
         this.game.addEventListener("touchstart", (event) => {
            touchStartTimeStamp = event.timeStamp;
         });
         this.game.addEventListener("touchend", (event) => {
            touchEndTimeStamp = event.timeStamp;
            let longTouchInterval = touchEndTimeStamp - touchStartTimeStamp;



            const waitingTime = 300; // in ms
            if (longTouchInterval >= waitingTime) {
               const targetCell = event.target;
               // check if clicked in the field cell
               if (
                  targetCell &&
                  targetCell.classList.contains(this.options.fieldCell)
               ) {
                  const [row, column] = [
                     ...targetCell.dataset.cell
                        .split(" ")
                        .map((e) => parseInt(e)),
                  ];
                  this.click_right(row, column);
               }
               return false;
            }
         });
      }

      // listeners for mobile double click (open the cells around clicked cell if possible)
      this.game.addEventListener("dblclick", (event) => {
         event.preventDefault();

         const targetCell = event.target;
         // check if clicked in the field cell
         if (
            targetCell &&
            targetCell.classList.contains(this.options.fieldCell)
         ) {
            const [row, column] = [
               ...targetCell.dataset.cell.split(" ").map((e) => parseInt(e)),
            ];

            this.wheel_click(row, column);
         }
      });

      // refresh game listener
      if (this.refreshButton) {
         this.refreshButton.addEventListener("click", () => {
            this.refresh();
            this.onGameRefresh();
         });
      }

      // ================================
      // ==/>  Event Listeners End!  </==
   }
   // custom events
   onGameRefresh() {
      const event = new CustomEvent("MS_GameRefresh", {});
      window.dispatchEvent(event);
   }

   onGameStart() {
      const event = new CustomEvent("MS_GameStart", {});
      window.dispatchEvent(event);
   }

   onGameOver() {
      const event = new CustomEvent("MS_GameOver", {});
      window.dispatchEvent(event);
   }

   onGameWin() {
      const event = new CustomEvent("MS_GameWin", {});
      window.dispatchEvent(event);
   }
}
// ==/>  Game Class End!  </==

// generate random number from [0, range)
function rand(range) {
   return Math.floor(Math.random() * range);
}

// find cell in the field
function find_cell(row_index, column_index) {
   const cell_location = `${row_index} ${column_index}`;
   const cell = document.querySelector(
      `.field-cell[data-cell="${cell_location}"]`
   );
   return cell;
}

// open the field cell and show him an amount
function open_cell(row_index, column_index) {
   const cell = find_cell(row_index, column_index);
   const cellIsFlag = this.field[row_index][column_index].isFlag;
   if (cell && !cellIsFlag) {
      cell.classList.add("visited");
   }
   return;
}

// set the field cell state
function set_cell_state(row_index, column_index) {
   const cell_number = this.field[row_index][column_index].value;
   const cellIsBomb = this.field[row_index][column_index].isBomb;
   const cellIsFlag = this.field[row_index][column_index].isFlag;
   const cell = find_cell(row_index, column_index);

   if (cellIsFlag && cell) {
      cell.classList.toggle("is-flag");
   } else if (cell_number > 0 && cell) {
      cell.innerText = cell_number;
   } else if (cellIsBomb && cell) {
      cell.style.background = `url("./img/bomb.svg") center/50% no-repeat`;
   }
}

function visit_empty_cells(queue) {
   while (queue.length > 0) {
      const pick = queue.pop();
      const [row_index, column_index] = [pick.row_index, pick.column_index];

      this.field[row_index][column_index].isVisited = true;

      for (let i = -1; i <= 1; ++i) {
         for (let j = -1; j <= 1; ++j) {
            if (
               this.isUndefinedCell(row_index + i, column_index + j) ||
               this.field[row_index + i][column_index + j].isVisited
            )
               continue;

            if (
               !this.field[row_index + i][column_index + j].isVisited &&
               this.field[row_index + i][column_index + j].value == 0
            ) {
               this.field[row_index + i][column_index + j].isVisited = true;
               open_cell.call(this, row_index + i, column_index + j);
               queue.push({
                  row_index: row_index + i,
                  column_index: column_index + j,
               });
            } else if (
               this.field[row_index][column_index].value == 0 &&
               this.field[row_index + i][column_index + j].value > 0
            ) {
               this.field[row_index + i][column_index + j].isVisited = true;
               open_cell.call(this, row_index + i, column_index + j);
            }
         }
      }
   }
   return;
}

// Function for a  =|-> Game Over <-|=
Minesweeper.prototype.gameOver = function () {
   this.isOver = true;

   this.locking();
   this.show_all_bombs();

   // alert("Game is over!");
   this.onGameOver();

   return false;
};

// Function for a  =|-> Game Win <-|=
Minesweeper.prototype.gameWin = function () {
   this.isEnded = true;
   this.locking();

   // alert("Congratulations, you really are a sapper!");

   this.onGameWin();
};

// ==/> Setters Start! </==
// ========================

// set bombs count
Minesweeper.prototype.set_bombs_count = function (count_bombs) {
   this.options.bombs = count_bombs;
};

// set field rows
Minesweeper.prototype.set_rows_count = function (count_rows) {
   this.options.rows = count_rows;
};

// set field columns
Minesweeper.prototype.set_columns_count = function (count_columns) {
   this.options.columns = count_columns;
};

// set states on the field(near the bombs) filled by numbers
Minesweeper.prototype.set_states = function () {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         if (!this.field[i][j].isFlag) set_cell_state.call(this, i, j);
         if (this.field[i][j].isBomb) continue;

         this.field[i][j].value = this.count_bombs_on_area(i, j);

         const cell_number = this.field[i][j].value;
         const cell = find_cell(i, j);
         if (cell_number > 0 && cell) {
            cell.innerText = cell_number;
            cell.style.padding = "0";
         }
      }
   }
};

// ==/> First click settings </==
// open cells around cell if this is the first click
Minesweeper.prototype.open_cells_on_area = function (row_index, column_index) {
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         const cellIsFlag = this.field[row_index + i][column_index + j].isFlag;
         if (
            !this.isUndefinedCell(row_index + i, column_index + j) &&
            !cellIsFlag
         ) {
            open_cell.call(this, row_index + i, column_index + j);
         }
      }
   }
};
// set visited state around cell if this is the first click
Minesweeper.prototype.set_states_on_area = function (row_index, column_index) {
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         const cellIsFlag = this.field[row_index + i][column_index + j].isFlag;
         if (
            !this.isUndefinedCell(row_index + i, column_index + j) &&
            !cellIsFlag
         ) {
            this.field[row_index + i][column_index + j].isVisited = true;
         }
      }
   }
};
// remove visited state around cell if this is the first click
Minesweeper.prototype.remove_states_on_area = function (
   row_index,
   column_index
) {
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         const cellIsFlag = this.field[row_index + i][column_index + j].isFlag;
         if (
            !this.isUndefinedCell(row_index + i, column_index + j) &&
            !cellIsFlag
         ) {
            this.field[row_index + i][column_index + j].isVisited = false;
         }
      }
   }
};

// ========================
// ==/>  Setters End!  </==

// ==/> Check game states Start! </==
// ==================================

// Check if the cell is undefined
Minesweeper.prototype.isUndefinedCell = function (row_index, column_index) {
   if (row_index > this.options.rows || row_index < 1) return true;
   if (column_index > this.options.columns || column_index < 1) return true;
   return false;
};

// Check if the cell is undefined
Minesweeper.prototype.isGameWin = function () {
   let countVisited = 0;

   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const isCorrectFlag = this.field[i][j].isFlag && this.field[i][j].isBomb;
         if (this.field[i][j].isVisited || isCorrectFlag)
            countVisited++;
      }
   }

   let keepCount = this.options.rows * this.options.columns - countVisited;
   if (!keepCount)
      return true;

   return false;
};

// ==================================
// ==/>  Check game states End!  </==

// ==/> Game Methods Start! </==
// =============================

// resize the game field
Minesweeper.prototype.resize = function (rows, columns, bombs) {
   this.set_bombs_count(bombs);
   this.set_rows_count(rows);
   this.set_columns_count(columns);

   this.set_field_size();
};

// Count the number of bombs around the cell
Minesweeper.prototype.count_bombs_on_area = function (row_index, column_index) {
   let count_bombs = 0;
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         if (this.field[row_index + i][column_index + j].isBomb) count_bombs++;
      }
   }
   return count_bombs;
};

// Count the number of flags around the cell
Minesweeper.prototype.count_flags_on_area = function (row_index, column_index) {
   let count_flags = 0;
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         if (this.field[row_index + i][column_index + j].isFlag) count_flags++;
      }
   }
   return count_flags;
};

// generate bombs
Minesweeper.prototype.generate_bombs = function () {
   for (let i = 0; i < this.options.bombs; i++) {
      // randomly generate a row and a column of a bomb
      let row = rand(this.options.rows) + 1;
      let col = rand(this.options.columns) + 1;

      // generate another row and column of the bomb if it's a bad place
      while (this.field[row][col].isBomb || this.field[row][col].isVisited) {
         row = rand(this.options.rows) + 1;
         col = rand(this.options.columns) + 1;
      }

      // set bomb at this cell(row, col)
      this.field[row][col].value = -1;
      this.field[row][col].isBomb = true;
      this.field[row][col].isVisited = false;
   }
};

// mouse left click
Minesweeper.prototype.click_left = function (row_index, column_index) {
   // click occurred outside the field
   if (this.isUndefinedCell(row_index, column_index)) {
      return;
   }
   if (this.field[row_index][column_index].isVisited) {
      return;
   }
   if (this.field[row_index][column_index].isFlag) {
      return;
   }

   // if you click a cell with a bomb -> you lose the game
   // (you need to calculate pos)
   if (this.field[row_index][column_index].isBomb) {
      this.gameOver();

      return;
   }

   // that's the first click
   if (!this.isStarted) {
      // set visited position around clicked cell
      this.set_states_on_area(row_index, column_index);

      // game start call
      this.getStarted();

      // remove the visited position around the clicked cell after the field is generated
      this.remove_states_on_area(row_index, column_index);
      // open cells around clicked cell
      this.open_cells_on_area(row_index, column_index);

      // add empty cells to the queue located around the clicked cell
      const queue = new Array();
      for (let i = -1; i <= 1; ++i) {
         for (let j = -1; j <= 1; ++j) {
            if (this.isUndefinedCell(row_index + i, column_index + j)) continue;
            if (
               !this.field[row_index + i][column_index + j].isVisited &&
               this.field[row_index + i][column_index + j].value == 0
            ) {
               queue.push({
                  row_index: row_index + i,
                  column_index: column_index + j,
               });
            }
         }
      }

      visit_empty_cells.call(this, queue);

      this.isStarted = true;
      this.onGameStart(); // init game start event
   } else {
      // otherwise you click on a good field
      // the state of this cell is visited
      // console.log(this.field[row_index][column_index]);
      if (this.field[row_index][column_index].value == 0) {
         const queue = new Array();
         queue.push({ row_index, column_index });
         visit_empty_cells.call(this, queue);
      }

      this.field[row_index][column_index].isVisited = true;
      open_cell.call(this, row_index, column_index);
   }

   // check if it's a game win
   if (this.isGameWin()) this.gameWin();

   return;
};

// mouse right click
Minesweeper.prototype.click_right = function (row_index, column_index) {
   // click occurred outside the field
   if (this.isUndefinedCell(row_index, column_index)) return;

   const cellIsFlag = this.field[row_index][column_index].isFlag;
   const cellIsVisited = this.field[row_index][column_index].isVisited;

   // set flag if it needs or removed if it set
   if (!cellIsFlag && !cellIsVisited) {
      this.field[row_index][column_index].isFlag = true;
      set_cell_state.call(this, row_index, column_index);
   } else if (cellIsFlag && !cellIsVisited) {
      set_cell_state.call(this, row_index, column_index);
      this.field[row_index][column_index].isFlag = false;
   }

   // check if it's a game win
   if (this.isGameWin()) this.gameWin();

   return;
};

// mouse roller click
Minesweeper.prototype.wheel_click = function (row_index, column_index) {
   const isAllowed =
      this.count_flags_on_area(row_index, column_index) >=
      this.field[row_index][column_index].value;

   if (this.field[row_index][column_index].isVisited && isAllowed) {
      for (let i = -1; i <= 1; ++i) {
         for (let j = -1; j <= 1; ++j) {
            this.click_left(row_index + i, column_index + j);
         }
      }
   }
};

// game start function
Minesweeper.prototype.getStarted = function () {
   this.generate_bombs();
   this.set_states();
   return this;
};

// game refresh function
Minesweeper.prototype.refresh = function () {
   // game states, which mean if the game has (started) or (ended)
   (this.isStarted = false), (this.isEnded = false), (this.isOver = false);
   this.field = [[]]; // init empty field

   this.set_default_styles();
   this.set_field_size();
};

// locking clicks at cells
Minesweeper.prototype.locking = function () {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const cell = find_cell(i, j);
         cell.style.pointerEvents = "none";
         cell.tabIndex = "-1";
      }
   }
};

// unlocking clicks at cells
Minesweeper.prototype.unlocking = function () {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const cell = find_cell(i, j);
         cell.style.pointerEvents = null;
         cell.tabIndex = null;
         const cellIsBomb = this.field[i][j].isBomb;
         if (cellIsBomb) open_cell.call(this, i, j);
      }
   }
};

// show all bombs on the game field
Minesweeper.prototype.show_all_bombs = function () {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const cellIsBomb = this.field[i][j].isBomb;
         if (cellIsBomb) open_cell.call(this, i, j);
      }
   }
};

// =============================
// ==/>  Game Methods End!  </==
