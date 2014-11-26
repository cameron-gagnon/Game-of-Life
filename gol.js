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
    function validPosition(row, col){

    }


    /**
     * Requires: grid is a 2d array
     * Modifies: grid
     * Effects: Fills and populates gameGrid with default cells.  populateGameGrid
     *          also sets the xPosition and yPosition data members of each Cell
     *          object to match its x and y coordinates on the HTML canvas.
     */
    function populateGameGrid(grid){

    }


    /** 
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects
     * Modifies: Nothing.
     * Effects: Counts the number of live neighbors for
     *          the cell at row,col in grid and returns the count.
     */
    function countLiveNeighbors(grid, row, col){

    }



    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid
     * Effects: Updates the liveNeighbors data member of each cell in grid
     */
    function updateLiveNeighbors(grid) {

    }


    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, the HTML canvas
     * Effects: Changes the state of all cells in grid, according to the number of
     *          liveNeighbors each cell has, and the rules of the Game of Life.
     *          Remember, that, after updating the state of the cell in grid that
     *          you also need to draw the change to the HTML canvas using getCanvas()
     */
    function updateCells(grid){

    }


    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, HTML canvas
     * Effects: Changes the grid to evolve the cells to the next generation 
     *          according to the rules of the Game of Life.  In order to correctly 
     *          move forward, all cells should count the number of live neighbors 
     *          they have before proceeding to change the state of all cells.
     */
    function evolveStep(grid){

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
        
    }


    
    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Glider"
     *              "Lwss"
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
