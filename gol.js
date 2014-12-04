$(function () {
    /*********************************************************
     *            Provided Code --- DO NOT MODIFY            *
     *********************************************************/

    var CELL_SIZE = 10, // each cell will be 10 pixels x 10 pixels
        CELL_ALIVE_COLOR = "#2ecc71",
        CELL_DEAD_COLOR = "#e74c3c",
        GENERATION_INTERVAL = 0.5
        NUM_COLS = 70,
        NUM_ROWS = 40,
        gameGrid = new Array(NUM_ROWS);


    // The Cusom object used to represent a cell on the HTML canvas grid
    // Remember, datamembers of a JS Object are all public
    function Cell() {
        // (xPosition,yPosition) represents the top left pixel of this cell on the canvas 
        this.xPosition = 0;
        this.yPosition = 0;
        
        // represents the fillStyle that should be used when fillRect is called
        this.fillStyle = "white";

        // represents whether a cell is dead or alive
        this.dead = true;

        // represents the number of live neighbors this cell has
        this.liveNeighbors = 0;
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
        grid.strokeStyle = "#ddd";
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
        //avoid the check points to be count 
        if (!grid[row][col].dead) {
            count = count - 1;
        }
        
 
        return count;
    
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

                // check if cell is alive
                if ((!grid[i][j].dead) && ((num != 2) && (num != 3))) {
                    grid[i][j].dead = true;
                    grid[i][j].fillStyle = CELL_DEAD_COLOR;
                }
                // check for cell if it is dead
                else if (num === 3) {
                    grid[i][j].dead = false;
                    grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                }
                // show each cell update on HTML canvus
                new_canvas.fillStyle = grid[i][j].fillStyle;
                new_canvas.fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);


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
			patternName === "Loaf" || patternName === "Boat") {
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
    * Effects:  Checks to see if row and col are within the grid,
    *           and if they are, proceeds to fill in a single cell with 
    *           the alive color at the given row and col coordinates.
    *
    */
    function drawPoint(grid, row, col) {
        if (validPosition(row, col)) {
            grid[row][col].fillStyle = CELL_ALIVE_COLOR;
            grid[row][col].dead = false;
        }
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

        // Add any necessary functionality you need for the Reach portion below here
    }




});

