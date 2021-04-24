'use strict';

// ==/> Class For Game Cell Start! </==
class Cell {
   constructor() {
      this.isFlag = false;
      this.isBomb = false;
      this.isVisited = false;
      this.value = 0;
   }
};
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
      };

      this.options = Object.assign(optionsDefault, options);
      this.game = document.querySelector(selector);

      // game states, which mean if the game has (started) or (ended)
      (this.isStarted = false), (this.isOver = false);
      this.field = [[]]; // init empty field

      this.set_default_styles = () => {
         this.game.classList.add("minesweeper-field");
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

      // listeners for wheel-click
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

      // ================================
      // ==/>  Event Listeners End!  </==
   };
};
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

// Function for a  =|-> Game Over <-|=
Minesweeper.prototype.gameOver = function() {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const cell = find_cell(i, j);
         cell.style.pointerEvents = "none";
         const cellIsBomb = this.field[i][j].isBomb;
         if (cellIsBomb)
            open_cell.call(this, i, j);
      }
   }

   alert("Game is over!");

   return false;
}

// Function for a  =|-> Game Win <-|=
Minesweeper.prototype.gameWin = function () {
   alert("Congratulations, you really are a sapper!");
};

// ==/> Setters Start! </==
// ========================

// set bombs count
Minesweeper.prototype.set_bombs_count = function(count_bombs) {
   this.options.bombs = count_bombs;
}

// set field rows
Minesweeper.prototype.set_rows_count = function(count_rows) {
   this.options.rows = count_rows;
}

// set field columns
Minesweeper.prototype.set_columns_count = function(count_columns) {
   this.options.columns = count_columns;
}

// set states on the field(where the bombs)
Minesweeper.prototype.set_states = function() {
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         if (!this.field[i][j].isFlag)
            set_cell_state.call(this, i, j);
         if (this.field[i][j].isBomb)
            continue;

         this.field[i][j].value = this.count_bombs_on_area(i, j);

         const cell_number = this.field[i][j].value;
         const cell = find_cell(i, j);
         if (cell_number > 0 && cell)
            cell.innerText = cell_number;
      }
   }
};


// ==/> First click settings </==
// open cells around cell if this is the first click
Minesweeper.prototype.open_cells_on_area = function (row_index, column_index) {
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         const cellIsFlag = this.field[row_index + i][column_index + j].isFlag;
         if (!this.isUndefinedCell(row_index + i, column_index + j) && !cellIsFlag) {
            open_cell.call(this, row_index + i, column_index + j);
         }
      }
   }
};
// set visited state around cell if this is the first click
Minesweeper.prototype.set_states_on_area = function(row_index, column_index) {
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         const cellIsFlag = this.field[row_index + i][column_index + j].isFlag;
         if (!this.isUndefinedCell(row_index + i, column_index + j) && !cellIsFlag) {
            this.field[row_index + i][column_index + j].isVisited = true;
         }
      }
   }
};


// ========================
// ==/>  Setters End!  </==

// ==/> Check game states Start! </==
// ==================================

// Check if the cell is undefined
Minesweeper.prototype.isUndefinedCell = function(row_index, column_index) {
   if (row_index > this.options.rows || row_index < 1) return true;
   if (column_index > this.options.columns || column_index < 1) return true;
   return false;
};

// Check if the cell is undefined
Minesweeper.prototype.isGameWin = function() {
   let countVisited = 0;
   for (let i = 1; i <= this.options.rows; ++i) {
      for (let j = 1; j <= this.options.columns; ++j) {
         const isCorrectFlag = (this.field[i][j].isFlag) && (this.field[i][j].isBomb);
         if (this.field[i][j].isVisited || isCorrectFlag)
            countVisited++;
      }
   }

   const keepCount = this.options.rows * this.options.columns - countVisited;
   if (keepCount <= 2)
      return true;

   return false;
};

// ==================================
// ==/>  Check game states End!  </==

// ==/> Game Methods Start! </==
// =============================

// resize the game field
Minesweeper.prototype.resize = function(rows, columns, bombs) {
   this.set_bombs_count(bombs);
   this.set_rows_count(rows);
   this.set_columns_count(columns);

   this.set_field_size();
}

// Count the number of bombs around the cell
Minesweeper.prototype.count_bombs_on_area = function(row_index, column_index) {
   let count_bombs = 0;
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         if (this.field[row_index + i][column_index + j].isBomb)
            count_bombs++;
      }
   }
   return count_bombs;
};

// Count the number of flags around the cell
Minesweeper.prototype.count_flags_on_area = function(row_index, column_index) {
   let count_flags = 0;
   for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
         if (this.field[row_index + i][column_index + j].isFlag)
            count_flags++;
      }
   }
   return count_flags;
};

// generate bombs
Minesweeper.prototype.generate_bombs = function() {
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
Minesweeper.prototype.click_left = function(row_index, column_index) {
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
      this.isOver = true;
      this.gameOver();

      return;
   }

   // that's the first click
   if (!this.isStarted) {
      // set visited position around clicked cell
      this.set_states_on_area(row_index, column_index);

      // game start call
      this.getStarted();

      // open cells around clicked cell
      this.open_cells_on_area(row_index, column_index);

      this.isStarted = true;
   }
   else {
      // otherwise you click on a good field
      // the state of this cell is visited
      this.field[row_index][column_index].isVisited = true;
      open_cell.call(this, row_index, column_index);
   }

   // check if it's a game win
   if (this.isGameWin())
      this.gameWin();

   return;
};

// mouse right click
Minesweeper.prototype.click_right = function(row_index, column_index) {
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

   return;
};

// mouse roller click
Minesweeper.prototype.wheel_click = function(row_index, column_index) {
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
Minesweeper.prototype.getStarted = function() {
   this.generate_bombs();
   this.set_states();
   return this;
};
// =============================
// ==/>  Game Methods End!  </==
