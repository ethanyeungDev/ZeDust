// import * as hcLib from "../../node_modules/honeycomb-grid/dist/honeycomb-grid.mjs";

import  { defineHex, Grid, rectangle } from "../../node_modules/honeycomb-grid/dist/honeycomb-grid.mjs";


// 1. Create a hex class:
const Tile = defineHex({ dimensions: 30 })

// 2. Create a grid by passing the class and a "traverser" for a rectangular-shaped grid:
const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }))

// 3. Iterate over the grid to log each hex:
grid.forEach(console.log)