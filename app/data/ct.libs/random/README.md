# ct.random

This module contains handy functions for generating something random.

## `ct.random(x)`
Returns a random float value between 0 and x, exclusive.

## `ct.random.dice(dice1,dice2,...diceN)`
Returns a random given argument.

## `ct.random.range(x1, x2)`
Returns a random float value between `x1` and `x2`, exclusive.

## `ct.random.deg()`
Returns a random float value between 0 and 360, exclusive.

## `ct.random.coord()`
Returns a pair of random coordinates from 0 to a corresponding room side.

## `ct.random.chance(x[, y])`
When given both `x` and `y`, randomly returns `true` approximately `x` times out of `y`. When given only a value between 0…100, returns `true` approximately `x` times out of 100. E.g. `ct.random.chance(30)` means a 30% success rate.
