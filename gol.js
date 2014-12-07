$(function () {
    /*********************************************************
     *            Provided Code --- DO NOT MODIFY            *
     *********************************************************/

    var CELL_SIZE = 10, // each cell will be 10 pixels x 10 pixels
        CELL_ALIVE_COLOR = "#FFFF00",
        CELL_DEAD_COLOR = "#e74c3c",
        GENERATION_INTERVAL = .1,
        CELL_INFECTED_COLOR = "#b8008a",
        CELL_MINE_COLOR = "#9898b1",
        CELL_MINE1_COLOR = "#01df01",
        CELL_MINE2_COLOR = "#585858",
        CELL_EXPLOSION_COLOR = "#ff9900",
        CELL_EXPL_HOT_COLOR = "#f2f5a9",
        CELL_PACKMAN_COLOR = "#ffee00",
        EXPLOSION_RANGE = 20,
        EXPLOSION_DELAY = 10,
        NUM_COLS = 72,
        NUM_ROWS = 48,
        gameGrid = new Array(NUM_ROWS);


    // The Cusom object used to represent a cell on the HTML canvas grid
    // Remember, datamembers of a JS Object are all public
    function Cell() {
        // (xPosition,yPosition) represents the top left pixel of this cell on the canvas 
        this.xPosition = 0;
        this.yPosition = 0;
        
        // represents the fillStyle that should be used when fillRect is called
        this.fillStyle = "black";

        // represents whether a cell is dead or alive
        this.dead = true;

        // represents the number of live neighbors this cell has
        this.liveNeighbors = 0;

        this.infectedNeighbors = 0;

        this.variation = "normal";

        this.ticker = 0;
    }
    


    // Requires: Nothing
    // Modifies: Nothing
    // Effects: Gets and returns the canvas context from index.html. Use this
    //          function's return value to draw on the canvas using functions
    //          like fillRect() and clearRect()
    function getCanvas() {
        var c = document.getElementById("grid");
        return c.getContext("2d");
    }


    // Requires: Nothing
    // Modifies: HTML canvas element
    // Effects: Draws the grid lines for the HTML canvas
    function drawGridLines() {
        var grid = getCanvas();

        var canvasWidth = $("#grid").width(),
            canvasHeight = $("#grid").height();
        
        // place vertical grid lines
        for (var i = 0; i < canvasWidth; i += CELL_SIZE) {
            grid.moveTo(i, 0);
            grid.lineTo(i, canvasWidth);    
        }
        // place horizontal grid lines
        for (var j = 0; j < canvasHeight; j += CELL_SIZE) {
            grid.moveTo(0, j);
            grid.lineTo(canvasWidth, j);
        }
        
        // draw grid lines
        grid.strokeStyle = "#2A2A2A";
        grid.stroke();
    }


    // Requires: Nothing
    // Modifies: gameGrid
    // Effects: gameGrid is initially created as an array of size NUM_ROWS, meaning
    //          we need to initalize each row as an array of size NUM_COLS
    function initArray() {
        for(var k = 0; k < NUM_ROWS; ++k)
        {
            gameGrid[k] = new Array(NUM_COLS);
        }
    }
    

    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: The onClick listener for the different draw buttons.  When a button
    //          is clicked, it determines which pattern is to be drawn and calls
    //          drawPattern with that value to be drawn on the HTML canvas (and 
    //          updates gameGrid to reflect that same state) at a random location on 
    //          the canvas.  In the event TEST_DRAW_PATTERN is
    //          true, it draws the pattern at row index 6 and col index 6
    $("#still-life-btn, #oscillator-btn, #spaceship-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val(),
            newRow = Math.floor(Math.random() * 191829) % NUM_ROWS,
            newCol = Math.floor(Math.random() * 8103849204) % NUM_COLS;
        if (TEST_DRAW_PATTERN) {
            newRow = 6;
            newCol = 6;
        }
        drawPattern(pattern, gameGrid, newRow, newCol);
        // drawPattern overwrites grid lines, therefore need to redraw them
        drawGridLines();
    });

    var isRunning = false; // represents whether generations are still occurring
    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: Uses evolveStep to draw the next step of evolution on the HTML
    //          canvas (and updates gameGrid to reflect that same state).  Will
    //          continue to run the game at GENERATION_INTERVAL * 1000 milliseconds

    function runGoL() {
        if (!isRunning) {
            return;
        }
        evolveStep(gameGrid);
        // evolveStep overwrites grid lines, therefore need to redraw them
        drawGridLines();
        setTimeout(runGoL, GENERATION_INTERVAL * 1000);
    }
    // onClick listener for the button to start the game
    $("#start-game").click(function() {
        isRunning = true;
        runGoL();
    });
    // onClick listener to stop the game
    $("#stop-game").click(function() {
        isRunning = false;
    });

    initializeWebpage();




    /********************************************************************
     *                          YOUR CODE HERE                          *
     ********************************************************************/


    /*****************************************************************************
     *                                CORE PORTION                               *
     *    Implement the provided function stubs and any helper functions here    *
     *****************************************************************************/


    /*
     * Requires: row and col are integers
     * Modifies: Nothing.
     * Efects: Returns true if row and col are within
     *         bounds of the grid, returns false otherwise.
     */
    function validPosition(row, col) {
            //set boundary
            if (row < NUM_ROWS && col < NUM_COLS && row >= 0 && col >= 0) {
                return true;
            } else {
                return false;
            }
    }


    /**
     * Requires: grid is a 2d array
     * Modifies: grid
     * Effects: Fills and populates gameGrid with default cells.  populateGameGrid
     *          also sets the xPosition and yPosition data members of each Cell
     *          object to match its x and y coordinates on the HTML canvas.
     */


    function populateGameGrid(grid) {

        for (var i = 0; i < NUM_ROWS; i += 1) {
            for (var j = 0; j < NUM_COLS; j += 1) {
                //fills all grid with initial cells
                grid[i][j] = new Cell();
                //x position match x coordinates
                grid[i][j].xPosition = j * CELL_SIZE;
                //y position match y coordinates
                grid[i][j].yPosition = i * CELL_SIZE;
            }

        }    

    }


    /** 
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects
     * Modifies: Nothing.
     * Effects: Counts the number of live neighbors for
     *          the cell at row,col in grid and returns the count.
     */
    function countLiveNeighbors(grid, row, col) {
        var count = 0;
        var countInf = 0;
        //go through neighbors
        for (var i = row - 1; i <= row + 1; i += 1) {
            for (var j = col - 1; j <= col + 1; j += 1) {
                //check boundary
                if (validPosition(i, j)) {
                    //count
                    if (!grid[i][j].dead) {
                        count = count + 1;
                    }                  
                }
            }
        }
        //avoid the points that are being checked to be count 
        if (!grid[row][col].dead) {
            count = count - 1;
        }
        
 
        return count;
    
    }

    function countInfectedNeighbors(grid, row, col) {
        var countInf = 0;
        //go through neighbors
        for (var i = row - 1; i <= row + 1; i += 1) {
            for (var j = col - 1; j <= col + 1; j += 1) {
                //check boundary
                if (validPosition(i, j)) {
                    //count
                    if (!grid[i][j].dead) {
                        if (grid[i][j].variation === "infected") {
                            countInf = countInf + 1;
                        }
                    }                  
                }
            }
        }
        //avoid the check points to be count 
        if (!grid[row][col].dead) {
            if (grid[row][col].variation === "infected") {
                countInf = countInf - 1;
            }
        }
        
        return countInf;
    
    }



    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid
     * Effects: Updates the liveNeighbors data member of each cell in grid
     */
    function updateLiveNeighbors(grid) {
        //go through all grid points
        for (var i = 0; i < NUM_ROWS; i += 1) {
            for (var j = 0; j < NUM_COLS; j += 1) {
                grid[i][j].liveNeighbors = countLiveNeighbors(grid,i,j);
                grid[i][j].infectedNeighbors = countInfectedNeighbors(grid,i,j);
            }
        }
    }


    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, the HTML canvas
     * Effects: Changes the state of all cells in grid, according to the number of
     *          liveNeighbors each cell has, and the rules of the Game of Life.
     *          Remember, that, after updating the state of the cell in grid that
     *          you also need to draw the change to the HTML canvas using getCanvas()
     */
    function updateCells(grid) {
        updateLiveNeighbors(grid); // update neighbour
        var new_canvas = getCanvas();
        for (var i = 0; i < NUM_ROWS; i += 1) {
            for (var j = 0; j < NUM_COLS; j += 1) {

                // update dead and fillStyle for each ceil

                var num = grid[i][j].liveNeighbors;
                var inf = grid[i][j].infectedNeighbors;
                var mine = grid[i][j].variation === "mine";
                var packman = grid[i][j].variation === "packman" ||
                            grid[i][j].variation === "packmanCore";

                // check if cell is alive
                if (grid[i][j].variation === "explosion") {
                    grid[i][j].ticker -= 1;

                    if (grid[i][j].fillStyle === CELL_EXPL_HOT_COLOR &&
                                            grid[i][j].ticker === 1) {
                        grid[i][j].fillStyle = CELL_EXPLOSION_COLOR;
                        grid[i][j].fillStyle = CELL_EXPLOSION_COLOR;
                    }

                    if (grid[i][j].ticker === 0) {
                        grid[i][j].variation = "normal";
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                    }
                }

                if (!(mine) && !(packman)) {
                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                        grid[i][j].variation = "normal";
                    }
                    // check for cell if it is dead
                    if (grid[i][j].dead && num === 3) {
                        rand = Math.floor(Math.random() * 191869) % 100;
                        grid[i][j].dead = false;
                        if (inf === 0) {
                            grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                        }
                        if (inf === 1) {
                            if (rand <= 32) {
                                grid[i][j].variation = "infected";
                                grid[i][j].fillStyle = CELL_INFECTED_COLOR;
                            }
                            else {
                                grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                            }
                        }
                        if (inf === 2) {
                            if (rand <= 65) {
                                grid[i][j].variation = "infected";
                                grid[i][j].fillStyle = CELL_INFECTED_COLOR;
                            }
                            else {
                                grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                            }
                        }
                        if (inf === 3) {
                            if (rand <= 98) {
                                grid[i][j].variation = "infected";
                                grid[i][j].fillStyle = CELL_INFECTED_COLOR;
                            }
                            else {
                                grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                            }
                        }
                        
                    }
                }

                if (mine) {
                    var start = grid[i][j].ticker < EXPLOSION_DELAY;

                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                    }
                    if (grid[i][j].dead && num === 3) {
                        grid[i][j].dead = false;
                    }

                    if ((start) || (!(grid[i][j].dead))) {
                        grid[i][j].ticker -= 1;
                    }

                    if (start || !grid[i][j].dead) {
                        if (grid[i][j].ticker % 2 === 1) {
                            grid[i][j].fillStyle = CELL_MINE1_COLOR;
                        }
                        else {
                            grid[i][j].fillStyle = CELL_MINE2_COLOR;
                        }
                    }

                    if (grid[i][j].ticker === 0) {
                        for (var i2 = 0; i2 < NUM_ROWS; i2 += 1) {
                            for (var j2 = 0; j2 < NUM_COLS; j2 += 1) {
                                var distance = Math.sqrt((i2 - i) * (i2 - i) 
                                                + (j2 - j) * (j2 - j));
                                if (distance <= EXPLOSION_RANGE 
                                    && validPosition(i2, j2)) {
                                    grid[i2][j2].variation = "explosion";
                                    grid[i2][j2].dead = true;
                                    grid[i2][j2].fillStyle = CELL_EXPLOSION_COLOR;
                                    
                                    if ((i2 > i) || ((i2 === i) && (j2 > j))) {
                                        grid[i2][j2].ticker = 2;
                                    }
                                    else {
                                        grid[i2][j2].ticker = 1;
                                    }
                                    
                                    rand1 = Math.random();
                                    rand2 = Math.floor(Math.random() 
                                        * 191869) % EXPLOSION_RANGE;
                                    if (distance < rand2 && rand1 > 0.5) {
                                        grid[i2][j2].ticker += 1;
                                        grid[i2][j2].fillStyle = CELL_EXPL_HOT_COLOR;
                                    }

                                    new_canvas.fillStyle = grid[i2][j2].fillStyle;
                                    new_canvas.fillRect(grid[i2][j2].xPosition, 
                                        grid[i2][j2].yPosition, CELL_SIZE, CELL_SIZE);
                                } 
                            }
                        }
                        updateLiveNeighbors(grid);
                    }
                }

                if (grid[i][j].variation === "packmanCore") {

                    var isOpen = false;
                    if (grid[i][j].ticker % 6 <= 2) {
                        isOpen = true;
                    }
                    drawPackman(grid, i, grid[i][j].ticker, isOpen);
                    grid[i][j].ticker += 1; 
                    if (grid[i][j].ticker === NUM_COLS + 1) {
                        grid[i][j].variation = "normal";
                        grid[i][j].ticker = 0;
                    }

                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                    }
                    if (grid[i][j].dead && num === 3) {
                        grid[i][j].dead = false;
                        grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                    }
                }

                // show each cell update on HTML canvus
                new_canvas.fillStyle = grid[i][j].fillStyle;
                new_canvas.fillRect(grid[i][j].xPosition, grid[i][j].yPosition, 
                                    CELL_SIZE, CELL_SIZE);


            }
        }
    }

                

            


    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, HTML canvas
     * Effects: Changes the grid to evolve the cells to the next generation 
     *          according to the rules of the Game of Life.  In order to correctly 
     *          move forward, all cells should count the number of live neighbors 
     *          they have before proceeding to change the state of all cells.
     */
    function evolveStep(grid) {
    		updateCells(grid);    //updates the grid!
    }


    /* 
     * You ARE allowed to modify this global variable.  When TEST_DRAW_PATTERN
     * is set to true, drawPattern will always be called with row == 6 and col == 6,
     * otherwise it will be called with a random, valid value for row and col
     */
    var TEST_DRAW_PATTERN = false;


    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *          grid is a 2d array of Cell objects, patternName is one of the 
     *          following strings:
     *             "Block"
     *             "Beehive"
     *             "Loaf"
     *             "Boat"
     *             "Blinker"
     *             "Toad"
     *             "Beacon"
     *             "Pulsar"
     *             "Glider"
     *             "Lwss"
     * Modifies: grid, HTML canvas
     * Effects: This function is called when a user clicks on one of the HTML
     *          "Draw <pattern>" buttons.  patternName is a string containing the
     *          name of the pattern that is to be drawn on the canvas.  The
     *          row and col parameters represent the top left corner of the pattern
     *          that should be drawn.  You will use getCanvas() to update the canvas
     */
    function drawPattern(patternName, grid, row, col) {
        //check what is the type of the pattern an then call corresponding function
		if (patternName === "Block" || patternName === "Beehive" ||
			patternName === "Loaf" || patternName === "Boat" || 
            patternName === "InfectCore" || patternName === "Mine" ||
            patternName === "Packman") {
			drawStillLife(patternName, grid, row, col);
		}
		if (patternName === "Blinker" ||patternName === "Toad" ||
     		patternName === "Beacon" || patternName === "Pulsar") {
     		drawOscillator(patternName, grid, row, col);
     	}
     	if (patternName === "Glider" || patternName === "LWSS") {
     		drawSpaceship(patternName, grid, row, col);
     	}
    }


    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Block"
     *              "Beehive"
     *              "Loaf"
     *              "Boat"
     * Modifies: grid, HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */

    function drawStillLife(patternName, grid, row, col) {
		if (patternName === "Block") {
			drawBlock(grid, row, col);
		}

		if (patternName === "Beehive") {
            //array contains coordinates of the alive cells in the structure
			var cells = [[row, col + 1],
						[row, col + 2],
						[row + 1, col],
						[row + 1, col + 3],
						[row + 2, col + 1],
						[row + 2, col + 2]];
			var size = 6;
			for (var i = 0; i < size; i += 1) {
				drawPoint(grid, cells[i][0], cells[i][1]);
			}
		}

		if (patternName === "Loaf") {
            //array contains coordinates of the alive cells in the structure
			var cells = [[row, col + 1],
						[row, col + 2],
						[row + 1, col],
						[row + 1, col + 3],
						[row + 2, col + 1],
						[row + 2, col + 3],
						[row + 3, col + 2]];
			var size = 7;
			for (var i = 0; i < size; i += 1) {
				drawPoint(grid, cells[i][0], cells[i][1]);
			}
		}

		if (patternName === "Boat") {
            //array contains coordinates of the alive cells in the structure
			var cells = [[row, col],
						[row, col + 1],
						[row + 1, col],
						[row + 1, col + 2],
						[row + 2, col + 1]];
			var size = 5;
			for (var i = 0; i < size; i += 1) {
				drawPoint(grid, cells[i][0], cells[i][1]);
			}
		}

        if (patternName === "InfectCore") {
            drawInfectedBlock(grid, row, col);
        }

        if (patternName === "Mine") {
            drawMine(grid, row, col);
        }

        if (patternName === "Packman") {
            if (validPosition(row + 13, 0)) {
                grid[row][0].variation = "packmanCore";
                grid[row][0].ticker = 1;
            }
        }

        //draw the structure on the canvas
        staticUpdateCells(grid);
    }



    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Blinker"
     *              "Toad"
     *              "Beacon"
     *              "Pulsar"
     * Modifies: grid and the HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawOscillator(patternName, grid, row, col) {
        if (patternName === "Blinker") {
            drawHorLine(grid, row + 1, col);
        }

        if (patternName === "Toad") {
            drawHorLine(grid, row + 1, col + 1);
            drawHorLine(grid, row + 2, col);
        }

        if (patternName === "Beacon") {
            drawBlock(grid, row, col);
            drawBlock(grid, row + 2, col + 2);
        }

        if (patternName === "Pulsar") {
            /* the pattern that consists only of horizontal 
             * and vertical lines is implemented
             *
             * the array contains coordinates of the leftmost points of
             * horizontal lines relative to the start point
             * the structure is symmetrical, so the inverted coordinates
             * ( (x,y) inverted becomes (y,x) ) are the uppermost points
             * of vertical lines relative to the start point
             */
            var cells = [[0, 2],
                        [0, 8],
                        [5, 2],
                        [5, 8],
                        [7, 2],
                        [7, 8],
                        [12, 2],
                        [12, 8]];
            var size = 8;

            for (var i = 0; i < size; i += 1) {
                drawHorLine(grid, row + cells[i][0], col + cells[i][1]);
                drawVerLine(grid, row + cells[i][1], col + cells[i][0]);
            }
        }

        //draw the structure on the canvas
        staticUpdateCells(grid);
    }


    
    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Glider"
     *              "LWSS"
     * Modifies: grid and the HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawSpaceship(patternName, grid, row, col) {
        /* the structures are simply described with the use of
         * points and vertical&horizontal lines that they consist of
         */
        if (patternName === "Glider") {
            drawPoint(grid, row, col + 1);
            drawPoint(grid, row + 1, col + 2);
            drawHorLine(grid, row + 2, col);
        }
        if (patternName === "LWSS") {
            drawPoint(grid, row, col);
            drawPoint(grid, row + 2, col);
            drawPoint(grid, row, col + 3);
            drawHorLine(grid, row + 3, col + 1);
            drawVerLine(grid, row + 1, col + 4);

        }

        //draw the structure on the canvas
        staticUpdateCells(grid);
    }

    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Fills in one cell at a time with alive color on the HTML Canvas. 
    *           row is the row where the color will be filled in at with
    *           col increasing each iteration to create a horizontal line.
    *           Maximum cells this function changes is three as this
    *           function is only called when needing to write multiples
    *           of three cells.
    *           
    */
    function drawHorLine(grid, row, col) { 
        for (var j = col; j <= col + 2; j += 1) {
                drawPoint(grid, row, j);
            }

    }

    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Fills in one cell at a time with alive color on the HTML Canvas. 
    *           col is the row where the color will be filled in at with
    *           row increasing each iteration to create a vertical line.
    *           Maximum cells this function changes is three as this
    *           function is only called when needing to write multiples
    *           of three cells.
    *           
    */
    function drawVerLine(grid, row, col) { 
        for (var i = row; i <= row + 2; i += 1) {
                drawPoint(grid, i, col);
            }
    }

    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Fills in one cell at a time with alive color on the HTML Canvas. 
    *           Creates a square block pattern of size 2 x 2 with the upperleft
    *           corner being the starting spot.
    *           
    */
    function drawBlock(grid, row, col) {
        for (var i = row; i <= row + 1; i += 1) {
                for (var j = col; j <= col + 1; j += 1) {
                    drawPoint(grid, i, j);
                }   
        }
    }


    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Fills in one cell at a time with infected color on the HTML Canvas. 
    *           Creates a square block pattern of size 2 x 2 with the upperleft
    *           corner being the starting spot.      
    */
    function drawInfectedBlock(grid, row, col) {
        for (var i = row; i <= row + 1; i += 1) {
                for (var j = col; j <= col + 1; j += 1) {
                    drawInfectedPoint(grid, i, j);
                }   
        }
    }
    
    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Checks to see if row and col are within the grid,
    *           and if they are, proceeds to fill in a single cell with 
    *           the alive color at the given row and col coordinates.
    */
    function drawPoint(grid, row, col) {
        if (validPosition(row, col)) {
            grid[row][col].dead = false;
            grid[row][col].variation = "normal";
            grid[row][col].fillStyle = CELL_ALIVE_COLOR;
        }
    }

    /*
    * Requires: grid is a 2d array of cells
    * Modifies: grid and HTML Canvas
    * Effects:  Checks to see if row and col are within the grid,
    *           and if they are, proceeds to fill in a single cell with 
    *           the infected color at the given row and col coordinates.
    */
    function drawInfectedPoint(grid, row, col) {
        if (validPosition(row, col)) {
            grid[row][col].dead = false;
            grid[row][col].variation = "infected";
            grid[row][col].fillStyle = CELL_INFECTED_COLOR;
        }
    }

    function drawMine(grid, row, col) {
        if (validPosition(row, col)) {
            grid[row][col].dead = true;
            grid[row][col].variation = "mine";
            grid[row][col].fillStyle = CELL_MINE_COLOR;
            grid[row][col].ticker = EXPLOSION_DELAY;
        }
    }

    function drawPackman(grid, row, col, isOpen) {
        if (isOpen) {
            var pack = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0]];
            var size_row = 13;
            var size_col = 13;
            for (var i = 0; i < size_row; i += 1) {
                for (var j = 0; j < size_col; j += 1) {
                    if (pack[i][j] === 1) {
                        var rowp = row + i;
                        var colp = col + j;
                        if (validPosition(rowp, colp)) {
                            grid[rowp][colp].dead = true;
                            grid[rowp][colp].variation = "packman";
                            grid[rowp][colp].fillStyle = CELL_PACKMAN_COLOR;
                        }
                    }
                    if ((pack[i][j] === 0) && 
                        ((pack[i][j + 1] === 1 && j < 5) || (j >= 5)) || 
                        (pack[i][j] === 1 && j === 0)) {
                        var rowcl = row + i;
                        var colcl = col + j;
                        if (pack[i][j] === 1) {
                            colcl -= 1;
                        }
                        if (validPosition(rowcl, colcl)) {
                            if (grid[rowcl][colcl].variation === "packman") {
                                grid[rowcl][colcl].dead = true;
                                grid[rowcl][colcl].fillStyle = CELL_DEAD_COLOR;
                                grid[rowcl][colcl].variation = "normal";
                            }
                        }
                    }
                }
            }
        }
        else {
            var pack = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0]];
            var size_row = 13;
            var size_col = 13;
            for (var i = 0; i < size_row; i += 1) {
                for (var j = 0; j < size_col; j += 1) {
                    if (pack[i][j] === 1) {
                        var rowp = row + i;
                        var colp = col + j;
                        if (validPosition(rowp, colp)) {
                            grid[rowp][colp].dead = true;
                            grid[rowp][colp].variation = "packman";
                            grid[rowp][colp].fillStyle = CELL_PACKMAN_COLOR;
                        }
                    }
                    if ((pack[i][j] === 0) && 
                        ((pack[i][j + 1] === 1 && j < 5) || (j >= 5)) || 
                        (pack[i][j] === 1 && j === 0)) {
                        var rowcl = row + i;
                        var colcl = col + j;
                        if (pack[i][j] === 1) {
                            colcl -= 1;
                        }
                        if (validPosition(rowcl, colcl)) {
                            if (grid[rowcl][colcl].variation === "packman") {
                                grid[rowcl][colcl].dead = true;
                                grid[rowcl][colcl].fillStyle = CELL_DEAD_COLOR;
                                grid[rowcl][colcl].variation = "normal";
                            }
                        }
                    }
                }
            }
        }
        staticUpdateCells(grid);
    }

    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: HTML canvas
     * Effects: Simply draws all of the cells on the HTML canvas based on
     *          based on the fillStyle of each on of them
     *          this function is static, so it doesn't check for the neighbours,
     *          doesn't change the grid, and doesn't make an evolve step
     */
    function staticUpdateCells(grid) {
        var new_canvas = getCanvas();
        for (var i = 0; i < NUM_ROWS; i += 1) {
            for (var j = 0; j < NUM_COLS; j += 1) {
                new_canvas.fillStyle = grid[i][j].fillStyle;
                new_canvas.fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
            }
        }
    }



    /*****************************************************************************
     *                               REACH PORTION                               *
     *       Implement any other functions here that are part of the Reach       *
     *****************************************************************************/


    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: Initializes the webpage and data structures necessary to make
    //          the Game of Life operate
    function initializeWebpage() {
        drawGridLines();
        drawGridLines();
        initArray();
        populateGameGrid(gameGrid);
        initCanvas();
        // Add any necessary functionality you need for the Reach portion below here
        }


    // Requires: Nothing
    // Modifies: GENERATION_INTERVAL value
    // Effects: The onClick listener for the various speeds of the generation intervals.
    //          When selected it will update GENERATION_INTERVAL with the respective
    //          speed
    $("#gen-int-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val();
        if (pattern === "Slow"){
            GENERATION_INTERVAL = .5;
        } else if (pattern === "Med"){
            GENERATION_INTERVAL = .2;
        } else if (pattern === "Fast"){
            GENERATION_INTERVAL = .1;
        }
    });

    // Requires: Nothing
    // Modifies: grid, HTML canvas
    // Effects: The onClick listener to clear the canvas to all new Cells.
    $("#clear-canvas").click(function () {
        isRunning = false;
        populateGameGrid(gameGrid);
        updateCells(gameGrid);
        drawGridLines();
    });

    // Requires: Nothing
    // Modifies: grid, HTML canvas
    // Effects: Steps through the generations one at a time using
    //          an onscreen button.
    $("#next-gen").click(function () {
        isRunning = false;
        updateCells(gameGrid);
        drawGridLines();
    });

    /*
    * Requires: A mousedown on canvas element
    * Modifies: HTML canvas
    * Effects:  Applies mousedown listener function to the canvas, so 
    *           when a user clicks on the canvas it triggers the getPosition
    *           function.
    */
    function initCanvas(){
        var canvasdraw = document.getElementById("grid");
        canvasdraw.addEventListener("mousedown", getPosition, false);
        canvasdraw.addEventListener("mousemove", getMovement, false);
        canvasdraw.addEventListener("mouseup", onMouseUp, false);
    }

    /*
    * Requires: nothing
    * Modifies: nothing
    * Effects:  Gives x and y coordinates of the mousedown of the user
    *           to locate position where cell should become alive and
    *           then draws the alive color to that cell block.
    *
    */
    function userMove(event){
        var x = new Number();
        var y = new Number();

        var canvas = document.getElementById("grid");
        //sets mouse coords in relation to the html page
        x = event.pageX;
        y = event.pageY;

        //subtracts horizonal and vertical offset of canvas element
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        //rounds coordinate position down and into form usable by the
        //html canvas
        x = Math.floor(x / 10);
        y = Math.floor(y / 10);

        //if cell is already alive where user clicks
        //it makes it a new cell again
        if (gameGrid[y][x].fillStyle === CELL_ALIVE_COLOR){
            gameGrid[y][x].fillStyle = "black";
            gameGrid[y][x].dead = "false";
            staticUpdateCells(gameGrid);
            drawGridLines();

        } else {
            drawPoint(gameGrid, y, x);
            staticUpdateCells(gameGrid);
            drawGridLines();
        }
    }

    // Requires: Nothing
    // Modifies: mouseIsDown
    // Effects:  Modifies mouseIsDown so mouseMove will begin
    //           executing while mouse moves.           
    function getPosition(event) {
        mouseIsDown = true;
        userMove(event);
    }

    // Requires: Nothing
    // Modifies: Nothing
    // Effects:  When mouse is pressed, it will draw to the
    //           canvas.
    function getMovement(event){
        if (mouseIsDown){
            userMove(event);
        }
    }

    // Requires: Nothing
    // Modifies: mouseIsDown
    // Effects:  Modifies mouseIsDown so mouseMove no longer
    //           executes.
    function onMouseUp(event){
        mouseIsDown = false;
    }


});
