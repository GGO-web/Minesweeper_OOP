#pragma once

// enumerate game states
enum Minesweeper_states {
   bomb = -1, // bomb state
   flag = -2, // flag state
   empty_state = 0, // empty cell state
};

// class for game cell
struct Cell {
   bool isFlag = false;
   bool isBomb = false;
   bool isVisited = false;
   int value = 0;
};

// ==/> Game Class Start! </==
class Minesweeper {
private:
   int bombs;
   int rows, columns;
   bool isStarted = false, isOver = false;
   vector<vector<Cell>> field;
public:
   // ==/> Constructors and Destructors </==
   Minesweeper(void);
   ~Minesweeper(void);
   Minesweeper(int rows, int columns, int bombs);
   // ==/> Getters and Setters </==
   void set_bombs_count(int count_bombs);
   void set_rows_count(int count_rows);
   void set_columns_count(int count_columns);
   void set_field_size(int count_rows, int count_columns);
   void set_states(void);
   void set_states_on_area(int row_index, int column_index);
   void set_empty_states(void);
   // ==/> Game Methods(functions) </==
   int count_bombs_on_area(int row_index, int column_index);
   int count_flags_on_area(int row_index, int column_index);
   void generate_bombs(void);
   void click_left(int row_index, int column_index);
   void print_field(void);
   void print_states(void);
   // ==/> Check game states </==
   bool isBomb(Cell cell);
   bool isFlag(Cell cell);
   bool isVisited(Cell cell);
   bool isUndefinedCell(int row_index, int column_index);
   void doubletap(int row, int col);
   // ==/> Game start function </==
   void getStarted(void);
};
// ==/>  Game Class End!  </==



// ==/> Constructors and Destructors Start! </==
// =============================================
// constructor default case
Minesweeper::Minesweeper(void) {
   // Easy level construction
   bombs = 10;
   rows = columns = 9;
   set_field_size(rows, columns);
   set_empty_states();
}
// destructor !Clear game field!
Minesweeper::~Minesweeper(void) {
   field.clear();
   cout << "The game field has been successfully deleted!\n";
}
// constructor with parameters
Minesweeper::Minesweeper(int rows, int columns, int bombs) {
   set_bombs_count(bombs);
   set_field_size(rows, columns);
   set_empty_states();
}
// =============================================
// ==/>  Constructors and Destructors End!  </==


// ==/> Getters and Setters Start! </==
// ====================================
// set bombs count
void Minesweeper::set_bombs_count(int count_bombs) {
   this->bombs = count_bombs;
}
// set field rows
void Minesweeper::set_rows_count(int count_rows) {
   this->rows = count_rows;
}
// set field columns
void Minesweeper::set_columns_count(int count_columns) {
   this->columns = count_columns;
}
// set game field size
void Minesweeper::set_field_size(int count_rows, int count_columns) {
   set_rows_count(count_rows);
   set_columns_count(count_columns);

   // add border around the field with empty cells
   count_rows += 2, count_columns += 2;

   field.resize(count_rows);
   for (int i = 0; i < count_rows; ++i)
      field[i].resize(count_columns);
}
// set states on the field(where the bombs)
void Minesweeper::set_states(void) {
   for (int i = 1; i <= rows; ++i) {
      for (int j = 1; j <= columns; ++j) {
         if (isBomb(field[i][j])) continue;

         field[i][j].value = count_bombs_on_area(i, j);
      }
   }
}
// set visited state around cell if this is the first click
void Minesweeper::set_states_on_area(int row_index, int column_index) {
   for (int i = -1; i <= 1; ++i) {
      for (int j = -1; j <= 1; ++j) {
         if (!isUndefinedCell(row_index + i, column_index + j)) {
            //cout << row_index + i << " " << column_index + j << endl;
            field[row_index + i][column_index + j].isVisited = true;
            //cout << field[row_index + i][column_index + j].isVisited << endl;
         }
      }
   }
   return;
}
// fill the field with zeros
void Minesweeper::set_empty_states(void) {
   for (int i = 0; i < rows + 2; ++i) {
      Cell cell;
      fill(field[i].begin(), field[i].end(), cell);
   }
}
// ====================================
// ==/>  Getters and Setters End!  </==


// ==/> Check game states Start! </==
// ==================================
// Check if it's a bomb
bool Minesweeper::isBomb(Cell cell) {
   return (cell.isBomb == true);
}
// Check if it's a flag
bool Minesweeper::isFlag(Cell cell) {
   return (cell.isFlag == true);
}
// Check if the cell has already been visited
bool Minesweeper::isVisited(Cell cell) {
   return (cell.isVisited == true);
}
// Check if the cell is undefined
bool Minesweeper::isUndefinedCell(int row_index, int column_index) {
   if (row_index > rows || row_index < 1)
      return true;
   if (column_index > columns || column_index < 1)
      return true;
   return false;
}
// ==================================
// ==/>  Check game states End!  </==


// ==/> Game Methods Start! </==
// =============================
// !Print field to the screen!
void Minesweeper::print_field(void) {
   for (int i = 1; i <= rows; ++i) {
      for (int j = 1; j <= columns; ++j) {
         printf("%3d", field[i][j].value);
      }
      putchar('\n');
   }
   putchar('\n');
}
// !Print field states to the screen!
void Minesweeper::print_states(void) {
   for (int i = 1; i <= rows; ++i) {
      for (int j = 1; j <= columns; ++j) {
         printf("%3d", field[i][j].isVisited);
      }
      putchar('\n');
   }
   putchar('\n');
}
// Ñount the number of bombs around the cell
int Minesweeper::count_bombs_on_area(int row_index, int column_index) {
   int count_bombs = 0;
   for (int i = -1; i <= 1; ++i) {
      for (int j = -1; j <= 1; ++j) {
         if (isBomb(field[row_index + i][column_index + j]))
            count_bombs++;
      }
   }
   return count_bombs;
}
// Ñount the number of flags around the cell
int Minesweeper::count_flags_on_area(int row_index, int column_index) {
   int count_flags = 0;
   for (int i = -1; i <= 1; ++i) {
      for (int j = -1; j <= 1; ++j) {
         if (isFlag(field[row_index + i][column_index + j]))
            count_flags++;
      }
   }
   return count_flags;
}
// generate bombs
void Minesweeper::generate_bombs(void) {
   srand(time_t(NULL));
   for (int i = 0; i < bombs; i++) {
      // randomly generate a row and a column of a bomb
      int row = abs((rand() % 10) - 1) + 1;
      int col = abs((rand() % 10) - 1) + 1;

      // generate another row and column of the bomb if it's a bad place
      while (isBomb(field[row][col]) || isVisited(field[row][col])) {
         row = abs((rand() % 10) - 1) + 1;
         col = abs((rand() % 10) - 1) + 1;
      }

      // set bomb at this cell(row, col)
      field[row][col].value = -1;
      field[row][col].isBomb = true;
      field[row][col].isVisited = false;
   }
}
// mouse left click
void Minesweeper::click_left(int row_index, int column_index) {
   // click occurred outside the field
   if (row_index > rows || column_index < 1)
      return;
   if (row_index > columns || column_index < 1)
      return;

   // if you click a cell with a bomb -> you lose the game
   // (you need to calculate points)
   if (isBomb(field[row_index][column_index])) {
      isOver = true;
      //gameOver();
      return;
   }

   // that's the first click
   if (!isStarted) {
      // set visited position around clicked cell
      set_states_on_area(row_index, column_index);

      // game start call
      getStarted();

      isStarted = true;
      return;
   }

   // otherwise you click on a good field
   // the state of this cell is visited
   if (!isVisited(field[row_index][column_index]) && !isFlag(field[row_index][column_index])) {
      field[row_index][column_index].isVisited = true;
   }

   return;
}
// mouse double click
void Minesweeper::doubletap(int row_index, int column_index) {
   bool doubletap_allowed = (count_flags_on_area(row_index, column_index) == field[row_index][column_index].value);
   if (isVisited(field[row_index][column_index]) && doubletap_allowed) {
      for (int i = -1; i <= 1; ++i) {
         for (int j = -1; j <= 1; ++j) {
            click_left(row_index + i, column_index + j);
         }
      }
   }
}
// game start function
void Minesweeper::getStarted(void) {
   generate_bombs();
   set_states();
}
// =============================
// ==/>  Game Methods End!  </==



