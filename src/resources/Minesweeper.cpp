#include <stdio.h>
#include <iostream>
#include <random>
#include <time.h>
#include <vector>

using namespace std;

// include game library
#include "Minesweeper.h"

// main function
int main(void)
{
   Minesweeper Game;
   //Game.generate_bombs();
   //Game.set_states();
   
   Game.click_left(1, 2);
   //Game.doubletap(1, 3);
   Game.print_field();
   Game.print_states();

   return 0;
}
