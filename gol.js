$(function () {
    /*********************************************************
     *            Provided Code --- DO NOT MODIFY            *
     *********************************************************/

    var CELL_SIZE = 10, // each cell will be 10 pixels x 10 pixels
        CELL_ALIVE_COLOR = "#FFFF00",
        CELL_DEAD_COLOR = "#e74c3c",
        GENERATION_INTERVAL = .2,
        CELL_INFECTED_COLOR = "#b8008a",
        CELL_MINE_COLOR = "#9898b1",
        CELL_MINE1_COLOR = "#01df01",
        CELL_MINE2_COLOR = "#585858",
        CELL_EXPLOSION_COLOR = "#ff9900",
        CELL_EXPL_HOT_COLOR = "#f2f5a9",
        CELL_PACMAN_COLOR = "#ffee00",
        CELL_SNAKE_COLOR = "#ffffcc",
        CELL_SNAKE_CONTROL = "#8181f7",
        EXPLOSION_RANGE = 15,
        EXPLOSION_DELAY = 10,
        VIRULENCE = 0,
        NUM_COLS = 72,
        NUM_ROWS = 48,
        MOUSE_IS_DOWN = false,
        LAST_X = 0;
        LAST_Y = 0;
        LET_IT_SNOW = "white",
        XMAS_GREEN = "#66FF33",
        XMAS_RED = "#FF0000",
        XMAS_MINE = "#00ffff",
        CELL_NORMAL_COLOR = "black",
        GRID_LINES = "#2A2A2A",
        audio = new Audio('Audio/let_it_snow.mp3'),
        audio.loop = true,
        explosion_soundEft;
        Wh_c = new Audio('Audio/White_Christmas.mp3'),
        TCS = new Audio('Audio/The_Christmas_Song.mp3'),
        WW = new Audio('Audio/Winter_Wonderland.mp3'),
        statue = 0,
        time = 0,
        generation = 0,
        SPACE = true,
        startedTimer = false,
        keyW = false,
        keyA = false,
        keyS = false,
        keyD = false,
        newRow = 0,
        newCol = 0,
        snakeControlSelect = 3,
        drawWithin = false,
        gameGrid = new Array(NUM_ROWS);

    var SNAKE_ID = 1; //to distinguish between different snakes
    var ID_IN_CONTROL = 0;


    // The Custom object used to represent a cell on the HTML canvas grid
    // Remember, datamembers of a JS Object are all public
    function Cell() {
        // (xPosition,yPosition) represents the top left pixel of this cell on the canvas 
        this.xPosition = 0;
        this.yPosition = 0;
        
        // represents the fillStyle that should be used when fillRect is called
        this.fillStyle = CELL_NORMAL_COLOR;

        // represents whether a cell is dead or alive
        this.dead = true;

        // represents the number of live neighbors this cell has
        this.liveNeighbors = 0;

        this.infectedNeighbors = 0;

        this.variation = "normal";

        //multi-purpose ticker
        this.ticker = 0;

        this.userClick = false;

        //direction in which snake is crawling
        this.direction = 0;

        //for snake cells is assigned according to SNAKE_ID
        this.uniqID = 0;
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
        grid.strokeStyle = GRID_LINES;
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
    $("#still-life-btn, #oscillator-btn, #spaceship-btn, #gen-int-btn").click(function () {
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
        if (TEST_DRAW_PATTERN) {
            newRow = 6;
            newCol = 6;
        }

        selector = selector.replace("select", "num");
        selector = $(selector).val();
        for (var i = 0; i < selector; i++){
            drawPattern(pattern, gameGrid);
        }
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
        //counts number of generations.
        generation++;
        evolveStep(gameGrid);
        // evolveStep overwrites grid lines, therefore need to redraw them
        drawGridLines();
        setTimeout(runGoL, GENERATION_INTERVAL * 1000);
        //updates generation count on webpage
        setTimeout(document.getElementById("gen-num").innerHTML = generation, GENERATION_INTERVAL * 1000);
    }
    // onClick listener for the button to start the game
    //MOVED CODE TO BOTTOM OF PAGE SO ANOTHER EVENT CAN BE TIED TO
    //ONCLICK
    /*$("#start-game").click(function() {
        if(!isRunning){
            isRunning = true;
            runGoL();
        }
    });*/
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

                // determine which cells should be drawn on canvas according
                // to what is drawn on it at the moment when the function is called

                var num = grid[i][j].liveNeighbors;
                var inf = grid[i][j].infectedNeighbors;
                var mine = grid[i][j].variation === "mine";
                var pacman = grid[i][j].variation === "pacman" ||
                            grid[i][j].variation === "pacmanCore";
                var snake = grid[i][j].variation === "snakeHead" ||
                            grid[i][j].variation === "snakeTail";

                //treat a cell that was created by clicking as a regular one 
                if (grid[i][j].userClick) {
                    grid[i][j].userClick = false;
                } 

                //turn hot explosion particles into regular ones
                //and regular ones to dead cells
                if (grid[i][j].variation === "explosion") {
                    explosion_soundEft = document.getElementById("explosion_soundEft");
                    explosion_soundEft.play();
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

                // if cell is not of a special kind
                // check if cell is alive or dead and determine
                // whether it is infected or not
                if (!(mine) && !(pacman) && !snake) {
                    //kill cell if it is over/underpopulated
                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                        grid[i][j].variation = "normal";
                    }

                    //make cell alive if there are exactly 3 neighbors
                    //if it has infected neighbors then it might be infected 
                    //as well with a certain probability
                    if (grid[i][j].dead && num === 3) {
                        rand = Math.floor(Math.random() * 191869) % 100;
                        grid[i][j].dead = false;
                        if (inf === 0) {
                            grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                        }
                        if (inf === 1) {
                            if (rand <= 32 + VIRULENCE) {
                                grid[i][j].variation = "infected";
                                grid[i][j].fillStyle = CELL_INFECTED_COLOR;
                            }
                            else {
                                grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                            }
                        }
                        if (inf === 2) {
                            if (rand <= 65 + 2*VIRULENCE) {
                                grid[i][j].variation = "infected";
                                grid[i][j].fillStyle = CELL_INFECTED_COLOR;
                            }
                            else {
                                grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                            }
                        }
                        if (inf === 3) {
                            if (rand <= Math.min(98, 98 + VIRULENCE)) {
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
                    //mine is started if its ticker is smaller than the original value
                    var start = grid[i][j].ticker < EXPLOSION_DELAY;

                    //mine obeys the same laws as regular cell
                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                    }
                    if (grid[i][j].dead && num === 3) {
                        grid[i][j].dead = false;
                    }

                    //start the mine if there is a cell grown on it
                    //decrement the ticker every generation after
                    if ((start) || (!(grid[i][j].dead))) {
                        grid[i][j].ticker -= 1;
                    }

                    //change mine's color to create blinking effect
                    if (start || !grid[i][j].dead) {
                        if (grid[i][j].ticker % 2 === 1) {
                            grid[i][j].fillStyle = CELL_MINE1_COLOR;
                        }
                        else {
                            grid[i][j].fillStyle = CELL_MINE2_COLOR;
                        }
                    }

                    //explode the mine as ticker reaches 0
                    if (grid[i][j].ticker === 0) {
                        for (var i2 = 0; i2 < NUM_ROWS; i2 += 1) {
                            for (var j2 = 0; j2 < NUM_COLS; j2 += 1) {
                                var distance = Math.sqrt((i2 - i) * (i2 - i) 
                                                + (j2 - j) * (j2 - j));
                                //mine itself and every cell within the explosion range
                                //but not the other mines is turned into explosion
                                if (distance <= EXPLOSION_RANGE 
                                    && validPosition(i2, j2) 
                                    && !(grid[i2][j2].variation === "mine" &&
                                        !(i === i2 && j === j2))) {
                                    grid[i2][j2].variation = "explosion";
                                    grid[i2][j2].dead = true;
                                    grid[i2][j2].fillStyle = CELL_EXPLOSION_COLOR;
                                    if (grid[i2][j2].uniqID === ID_IN_CONTROL) {
                                        ID_IN_CONTROL = 0;
                                    }
                                    
                                    //program operates by going row by row
                                    //so adjust to the cells that were 
                                    //processed previously
                                    if ((i2 > i) || ((i2 === i) && (j2 > j))) {
                                        grid[i2][j2].ticker = 2;
                                    }
                                    else {
                                        grid[i2][j2].ticker = 1;
                                    }
                                    
                                    //create hot particles of explosion
                                    //more hot particles near to the center
                                    rand1 = Math.random();
                                    rand2 = Math.floor(Math.random() 
                                        * 191869) % EXPLOSION_RANGE;
                                    if (distance < rand2 && rand1 > 0.5) {
                                        grid[i2][j2].ticker += 1;
                                        grid[i2][j2].fillStyle = CELL_EXPL_HOT_COLOR;
                                    }

                                    //update canvas
                                    new_canvas.fillStyle = grid[i2][j2].fillStyle;
                                    new_canvas.fillRect(grid[i2][j2].xPosition, 
                                        grid[i2][j2].yPosition, CELL_SIZE, CELL_SIZE);
                                } 

                                //explosion chain reaction
                                //activate mines within explosion range
                                if (distance <= EXPLOSION_RANGE && 
                                    grid[i2][j2].variation === "mine" &&
                                    grid[i2][j2].ticker === EXPLOSION_DELAY) {
                                    grid[i2][j2].ticker = 2;
                                    //adjust to row-by-row movement of program
                                    if ((i2 > i) || ((i2 === i) && (j2 > j))) {
                                        grid[i2][j2].ticker = 3;
                                    }
                                    grid[i2][j2].fillStyle = CELL_MINE2_COLOR;
                                    staticUpdateCells(grid);
                                }
                            }
                        }
                        //some cells could die, so update neighbors
                        updateLiveNeighbors(grid);
                    }
                }

                if (grid[i][j].variation === "pacmanCore") {
                    //pacman switches between open and notopen
                    //every generations
                    var isOpen = false;
                    if (grid[i][j].ticker % 6 <= 2) {
                        isOpen = true;
                    }

                    //draw pacman, its column depends
                    //on ticker which is incremented every generation
                    drawPacman(grid, i, grid[i][j].ticker, isOpen);
                    grid[i][j].ticker += 1; 
                    //kill pacman when the end is reached
                    if (grid[i][j].ticker === NUM_COLS + 1) {
                        grid[i][j].variation = "normal";
                        grid[i][j].ticker = 0;
                    }

                    //pacman core behaves as if it a regular cell
                    if (!(grid[i][j].dead) && ((num != 2) && (num != 3))) {
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                    }
                    if (grid[i][j].dead && num === 3) {
                        grid[i][j].dead = false;
                        grid[i][j].fillStyle = CELL_ALIVE_COLOR;
                    }
                }

                //decrement snake tail's ticker every generation
                //it ticker reached 0 fill the cell
                if (grid[i][j].variation === "snakeTail") {
                    if (grid[i][j].ticker > 0) {
                        grid[i][j].ticker -= 1;
                    }
                    else {
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                        grid[i][j].variation = "normal";
                        grid[i][j].uniqID = 0;                       
                    }
                }

                if (grid[i][j].variation === "snakeHead" &&
                    grid[i][j].direction < 4) {
                    var dir = grid[i][j].direction;
                    //with a certain chance snake might randomly turn
                    var turnChance = 0.05;
                    //if snake is close to the edge of canvas the turn
                    //chance is increase proportionally to its size
                    if ((dir === 0 && j > 9.0*NUM_COLS/10) ||
                        (dir === 1 && i < 1.5*NUM_ROWS/10) ||
                        (dir === 2 && j < 1.0*NUM_COLS/10) ||
                        (dir === 3 && i > 8.5*NUM_ROWS/10)) {
                        turnChance = Math.min(0.3, 0.13 + 
                            1.0 * (grid[i][j].ticker) / 100);
                    }
                    if (snakeControlSelect === "2"){
                        if (keyW && (dir === 0 || dir === 2)) {
                            dir = 1;
                            grid[i][j].direction = dir;
                        }
                        else if (keyA && (dir === 1 || dir === 3)) {
                            dir = 2;
                            grid[i][j].direction = dir;
                        }
                        else if (keyS && (dir === 2 || dir === 0)) {
                            dir = 3;
                            grid[i][j].direction = dir;
                        }
                        else if (keyD && (dir === 3 || dir === 1)) {
                            dir = 0;
                            grid[i][j].direction = dir;
                        }
                    } else if (grid[i][j].uniqID === ID_IN_CONTROL && (snakeControlSelect != "3")){
						if (keyW && (dir === 0 || dir === 2)) {
							dir = 1;
							grid[i][j].direction = dir;
						}
						else if (keyA && (dir === 1 || dir === 3)) {
							dir = 2;
							grid[i][j].direction = dir;
						}
						else if (keyS && (dir === 2 || dir === 0)) {
							dir = 3;
							grid[i][j].direction = dir;
						}
						else if (keyD && (dir === 3 || dir === 1)) {
							dir = 0;
							grid[i][j].direction = dir;
						}
                    } else if (Math.random() < turnChance) {
                        var changeDir = Math.floor(Math.random() * 19185) % 2;
                        changeDir = changeDir * 2 - 1;
                        dir += changeDir;
                        if (dir === 4) {
                            dir = 0;
                        }
                        if (dir === -1) {
                            dir = 3;
                        }
                        grid[i][j].direction = dir;
                    }
                    //turn this cell into a snake tail
                    grid[i][j].direction = 0;
                    grid[i][j].variation = "snakeTail";

                    //copy all info from this cell into the cell that
                    //is ahead of it according to its direction
                    //and turn that cell into a head
                    if (validPosition(rowDir(i,dir),colDir(j,dir)) && 
                        !(grid[rowDir(i,dir)][colDir(j,dir)].variation 
                                                        === "snakeHead" || 
                          grid[rowDir(i,dir)][colDir(j,dir)].variation 
                                                        === "snakeTail" || 
                          grid[rowDir(i,dir)][colDir(j,dir)].variation 
                                                        === "mine")) {
                        grid[rowDir(i,dir)][colDir(j,dir)].uniqID = 
                                grid[i][j].uniqID;
                        grid[rowDir(i,dir)][colDir(j,dir)].direction = dir;
                        grid[rowDir(i,dir)][colDir(j,dir)].variation = 
                                "snakeHead";
                        grid[rowDir(i,dir)][colDir(j,dir)].ticker = 
                                grid[i][j].ticker;
                        grid[rowDir(i,dir)][colDir(j,dir)].fillStyle = 
                                grid[i][j].fillStyle;
                        //determine if anything was eaten
                        if (!grid[rowDir(i,dir)][colDir(j,dir)].dead) {
                            grid[rowDir(i,dir)][colDir(j,dir)].ticker += 1;
                        }
                        //adjust to row-by-row operation of the program
                        grid[rowDir(i,dir)][colDir(j,dir)].dead = true;
                        if (dir === 0 || dir === 3) {
                            grid[rowDir(i,dir)][colDir(j,dir)].direction += 23;
                        }
                        else {
                            staticUpdateCells(grid);
                        }
                    }
                    //kill the snake if it reaches the border, 
                    //a mine, or another snake
                    else {
                           
                        for (var i2 = 0; i2 < NUM_ROWS; i2 += 1) {
                            for (var j2 = 0; j2 < NUM_COLS; j2 += 1) {
                                //determine which snake to kill
                                //using the SNAKE_ID
                                if (grid[i2][j2].variation === "snakeTail" &&
                                    grid[i2][j2].uniqID === grid[i][j].uniqID) {
                                    grid[i2][j2].variation = "snakeDeath";
                                    grid[i2][j2].ticker = 6;
                                    //adjust to row-by-row operation of the program
                                    if ((i2 > i) || ((i2 === i) && (j2 >= j))) {
                                        grid[i2][j2].ticker += 1;
                                    }
                                }
                            }
                        }
                    }
                    //blow up the mine if snake hits it
                    if (validPosition(rowDir(i,dir),colDir(j,dir)) && 
                        grid[rowDir(i,dir)][colDir(j,dir)].variation === "mine") {
                        if ((i2 > i) || ((i2 === i) && (j2 > j))) {
                            grid[rowDir(i,dir)][colDir(j,dir)].ticker = 2;
                        }
                        else {
                            grid[rowDir(i,dir)][colDir(j,dir)].ticker = 1;
                        }
                    }

                }
                //adjust to row-by-row operation of the program
                if (grid[i][j].variation === "snakeHead" &&
                    grid[i][j].direction > 4) {
                    grid[i][j].direction -= 23;
                }

                //dead snake blinks for 3 generations
                //and then turns into dead cells 
                if (grid[i][j].variation === "snakeDeath") {
                    grid[i][j].ticker -= 1;
                    if ((grid[i][j].ticker % 2) === 0) {
                        if (grid[i][j].uniqID === ID_IN_CONTROL) {
                            grid[i][j].fillStyle = CELL_SNAKE_CONTROL;
                        }
                        else {
                            grid[i][j].fillStyle = CELL_SNAKE_COLOR;
                        }
                    }
                    else {
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                    }
                    if (grid[i][j].ticker === 0) {
                        if (grid[i][j].uniqID === ID_IN_CONTROL) {
                            ID_IN_CONTROL = 0;
                        }
                        grid[i][j].dead = true;
                        grid[i][j].fillStyle = CELL_DEAD_COLOR;
                        grid[i][j].variation = "normal";
                        grid[i][j].uniqID = 0;
                    }
                }

                // show each cell's update on HTML canvus
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
            keyW = false;
            keyA = false;
            keyS = false;
            keyD = false;
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
    function drawPattern(patternName, grid) {
        //check what is the type of the pattern an then call corresponding function
        newRow = Math.floor(Math.random() * 191829) % NUM_ROWS,
        newCol = Math.floor(Math.random() * 8103849204) % NUM_COLS;
		if (patternName === "Block" || patternName === "Beehive" ||
			patternName === "Loaf" || patternName === "Boat") {
			drawStillLife(patternName, grid, newRow, newCol);
		}
		if (patternName === "Blinker" ||patternName === "Toad" ||
     		patternName === "Beacon" || patternName === "Pulsar") {
     		drawOscillator(patternName, grid, newRow, newCol);
     	}
     	if (patternName === "Glider" || patternName === "LWSS") {
     		drawSpaceship(patternName, grid, newRow, newCol);
     	}
        if (patternName === "Infected" || patternName === "Mine" ||
            patternName === "Pacman" || patternName === "Snake"){
            drawExtra(patternName, grid, newRow, newCol);
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
            if (drawWithin) {
                col = randX(2);
                row = randY(2);
            }
			drawBlock(grid, row, col);
		}

		if (patternName === "Beehive") {
            if (drawWithin) {
                col = randX(4);
                row = randY(3);
            }
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
            if (drawWithin) {
                col = randX(4);
                row = randY(4);
            }
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
            if (drawWithin) {
                col = randX(3);
                row = randY(3);
            }
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
     *              "InfectCore"
     *              "Mine"
     *              "Pacman"
     * Modifies: grid, HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawExtra(patternName, grid, row, col){
        if (patternName === "Infected") {
            if (drawWithin) {
                col = randX(2);
                row = randY(2);
            }
            drawInfectedBlock(grid, row, col);
        }

        if (patternName === "Mine") {
            drawMine(grid, row, col);
        }

        if (patternName === "Pacman") {
            var randRow = Math.floor(Math.random() * 191879) % (NUM_ROWS - 12)
            //check position just to be sure
            //and change nothing but its ticker and variation
            if (validPosition(randRow, 0)) {
                grid[randRow][0].variation = "pacmanCore";
                grid[randRow][0].ticker = 1;
            }
        }
        if (patternName === "Snake") {
            drawSnake(grid, row, col);
        }
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
            if (drawWithin) {
                col = randX(3);
                row = randY(3);
            }
            drawHorLine(grid, row + 1, col);
        }

        if (patternName === "Toad") {
            if (drawWithin) {
                col = randX(4);
                row = randY(4);
            }
            drawHorLine(grid, row + 1, col + 1);
            drawHorLine(grid, row + 2, col);
        }

        if (patternName === "Beacon") {
            if (drawWithin) {
                col = randX(4);
                row = randY(4);
            }
            drawBlock(grid, row, col);
            drawBlock(grid, row + 2, col + 2);
        }

        if (patternName === "Pulsar") {
            if (drawWithin) {
                col = randX(15);
                row = randY(15);
                col += 1;
                row += 1;
            }
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
            if (drawWithin) {
                col = randX(3);
                row = randY(3);
            }
            drawPoint(grid, row, col + 1);
            drawPoint(grid, row + 1, col + 2);
            drawHorLine(grid, row + 2, col);
        }
        if (patternName === "LWSS") {
            if (drawWithin) {
                col = randX(5);
                row = randY(5);
            }
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

    function drawPacman(grid, row, col, isOpen) {
        //go through one of the hardcoded matrix 
        //and change cells according to it
        if (isOpen) {
            var pacm = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
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
                    if (pacm[i][j] === 1) {
                        var rowp = row + i;
                        var colp = col + j;
                        if (validPosition(rowp, colp)) {
                            if (grid[rowp][colp].uniqID === ID_IN_CONTROL) {
                                ID_IN_CONTROL = 0;
                            }
                            grid[rowp][colp].dead = true;
                            grid[rowp][colp].variation = "pacman";
                            grid[rowp][colp].fillStyle = CELL_PACMAN_COLOR;
                        }
                    }
                    if ((pacm[i][j] === 0) && 
                        ((pacm[i][j + 1] === 1 && j < 5) || (j >= 5)) || 
                        (pacm[i][j] === 1 && j === 0)) {
                        var rowcl = row + i;
                        var colcl = col + j;
                        if (pacm[i][j] === 1) {
                            colcl -= 1;
                        }
                        if (validPosition(rowcl, colcl)) {
                            if (grid[rowcl][colcl].variation === "pacman") {
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
            var pacm = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
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
                    if (pacm[i][j] === 1) {
                        var rowp = row + i;
                        var colp = col + j;
                        if (validPosition(rowp, colp)) {
                            if (grid[rowp][colp].uniqID === ID_IN_CONTROL) {
                                ID_IN_CONTROL = 0;
                            }
                            grid[rowp][colp].dead = true;
                            grid[rowp][colp].variation = "pacman";
                            grid[rowp][colp].fillStyle = CELL_PACMAN_COLOR;
                        }
                    }
                    if ((pacm[i][j] === 0) && 
                        ((pacm[i][j + 1] === 1 && j < 5) || (j >= 5)) || 
                        (pacm[i][j] === 1 && j === 0)) {
                        var rowcl = row + i;
                        var colcl = col + j;
                        if (pacm[i][j] === 1) {
                            colcl -= 1;
                        }
                        if (validPosition(rowcl, colcl)) {
                            if (grid[rowcl][colcl].variation === "pacman") {
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

    function drawSnake(grid, row, col) {
        if (validPosition(row, col)) {
        	
            grid[row][col].dead = true;
            grid[row][col].variation = "snakeHead";
            grid[row][col].ticker = 2;
            grid[row][col].uniqID = SNAKE_ID;
            if (snakeControlSelect === "1" && (ID_IN_CONTROL === 0)){
        		grid[row][col].fillStyle = CELL_SNAKE_CONTROL;
				grid[row][col].direction = 1;
				ID_IN_CONTROL = SNAKE_ID;
        	} else {
				grid[row][col].fillStyle = CELL_SNAKE_COLOR;
				var randDir = Math.floor(Math.random() * 191829) % 4;
				grid[row][col].direction = randDir;
        	}
            SNAKE_ID += 1;
        }
    }

    function rowDir(row, dir) {
        if (dir === 0) {
            return row;
        } 
        else if (dir === 1) {
            return row - 1;
        }
        else if (dir === 2) {
            return row;
        }
        else {
            return row + 1;
        }
    }

    function colDir(col, dir) {
        if (dir === 0) {
            return col + 1;
        } 
        else if (dir === 1) {
            return col;
        }
        else if (dir === 2) {
            return col - 1;
        }
        else {
            return col;
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

    function randX(xSize) {
        var x = Math.floor(Math.random() * 191829) % 
                    (NUM_COLS - xSize + 1);
        return x;
    } 

    function randY(ySize) {
        var y = Math.floor(Math.random() * 191829) % 
                    (NUM_ROWS - ySize + 1);
        return y;
    } 


    //generate random number within the range of the grid according
    //to the xSize passed in.
    //xSize is the width of the pattern needed to be subtracted
    //ySize is the height of the pattern needed to be subtracted
    function randX(xSize) {
        var x = Math.floor(Math.random() * 191829) % 
                    (NUM_COLS - xSize + 1);
        return x;
    } 

    function randY(ySize) {
        var y = Math.floor(Math.random() * 191829) % 
                    (NUM_ROWS - ySize + 1);
        return y;
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


    // Requires: Nothing
    // Modifies: grid, HTML canvas
    // Effects: The onClick listener to clear the canvas to all new Cells.
    function clear_canvas() {
        isRunning = false;
        populateGameGrid(gameGrid);
        updateCells(gameGrid);
        drawGridLines();
        generation = 0;
        document.getElementById("gen-num").innerHTML = generation;
    }
    $("#clear-canvas").click(clear_canvas);

    //the below jquery listeners are for the buttons
    //to control what happened, the id's are self
    //explanatory
    function next_gen() {
        isRunning = false;
        updateCells(gameGrid);
        drawGridLines();
        generation++;
        document.getElementById("gen-num").innerHTML = generation;
    }
    $("#next-gen").click(next_gen);

    $("#draw-infected-btn").click(function(){

        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "num");
        var pattern = $(selector).val();
        for(var i = 0; i < pattern; i++){
            drawPattern("Infected", gameGrid);
        }
        drawGridLines(gameGrid);
    });

    $("#draw-mine-btn").click(function(){
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "num");
        var pattern = $(selector).val();
        for(var i = 0; i < pattern; i++){
            drawPattern("Mine", gameGrid);

        }
        drawGridLines(gameGrid);
    });

    $("#draw-pacman-btn").click(function(){
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "num");
        var pattern = $(selector).val();
        for(var i = 0; i < pattern; i++){
            drawPattern("Pacman", gameGrid);
        }
        drawGridLines(gameGrid);
    });

    $("#draw-snake-btn").click(function(){
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "num");
        var pattern = $(selector).val();
        for (var i = 0; i < pattern; i++){
            drawPattern("Snake", gameGrid);
        }
        drawGridLines(gameGrid);
    });

    /*
    * Requires: A mousedown on canvas element
    * Modifies: HTML canvas
    * Effects:  Applies mousedown, mousemove, mouseup listener function to the canvas, so 
    *           when a user clicks on the canvas it triggers the respective
    *           function.
    */
    $("#grid").mousedown(canvasMouseDown).mousemove(canvasMouseMove).mouseup(canvasMouseUp);


    /*
    * Generates a random x and y coordinate to be passed to 
    *
    *
    */
    function mousePos(event){
        //sets mouse coords in relation to the html page
        var x, y;

        if (event.pageX || event.pageY){
            x = event.pageX;
            y = event.pageY;
        } else if (event.clientX || event.clientY)  { //supports firefox browser
          x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var offset = $("#grid").offset();

        x = Math.floor((x - offset.left) / 10);
        y = Math.floor((y - offset.top) / 10);

        return [x, y];
    }
    

    /*
    * Requires: nothing
    * Modifies: nothing
    * Effects:  Gives x and y coordinates of the mousedown of the user
    *           to locate position where cell should become alive and
    *           then draws the alive color to that cell block.
    *
    */
    function userMove(event, x, y){
        if (validPosition(y, x)){
            //sets alive cells that have not been clicked to die
            //essentially kills cells that were created by the game and not the user
            if ((!gameGrid[y][x].userClick) && (gameGrid[y][x].fillStyle === CELL_ALIVE_COLOR) ){
                gameGrid[y][x].fillStyle = CELL_DEAD_COLOR;
                gameGrid[y][x].dead = true;
                staticUpdateCells(gameGrid);
                drawGridLines();
            //if cell is already alive where user clicks
            //it makes it a normal, starting cell again
            } else if (gameGrid[y][x].fillStyle === CELL_ALIVE_COLOR){
                gameGrid[y][x].fillStyle = CELL_NORMAL_COLOR;
                gameGrid[y][x].dead = true;
                gameGrid[y][x].userclick = true;
                staticUpdateCells(gameGrid);
                drawGridLines(gameGrid);
            //if the cell is dead and has not been clicked
            //the cell is 
            } else if (!gameGrid[y][x].userClick && gameGrid[y][x].fillStyle === CELL_DEAD_COLOR) {
                drawPoint(gameGrid, y, x);
                gameGrid[y][x].dead = false;
                staticUpdateCells(gameGrid);
                drawGridLines();
            } else {
                drawPoint(gameGrid, y, x);    
                gameGrid[y][x].dead = false;            
                gameGrid[y][x].userClick = true;
                staticUpdateCells(gameGrid);
                drawGridLines();
            }
        }
    }

    // Requires: Nothing
    // Modifies: mouseIsDown
    // Effects:  Modifies mouseIsDown so mouseMove will begin
    //           executing while mouse moves.           
    function canvasMouseDown(event) {
        MOUSE_IS_DOWN = true;
        var pos = mousePos(event);
        LAST_X = pos[0];
        LAST_y = pos[1];
        userMove(event, pos[0], pos[1]);
    }

    // Requires: Nothing
    // Modifies: Nothing
    // Effects:  When mouse is pressed and moving, it will draw to the
    //           canvas.
    function canvasMouseMove(event){
        var pos = mousePos(event);
        if (MOUSE_IS_DOWN && ((LAST_X !== pos[0]) || (LAST_Y !== pos[1]))){
            userMove(event, pos[0], pos[1]);
            LAST_X = pos[0];
            LAST_Y = pos[1];
        }
    }

    // Requires: Nothing
    // Modifies: mouseIsDown
    // Effects:  Modifies mouseIsDown so canvasMouseMove no longer
    //           executes.
    function canvasMouseUp(event){
        MOUSE_IS_DOWN = false;
    }


    // Requires: onclick event from moveStyle button
    // Modifies: pretty much everything
    // Effects: lettin' it snow yo
    $("#moveStyle").click(function(){

        //AUDIO COURTESY OF THIS YOUTUBE VIDEO AND ITS RESPECTIVE OWNERS
        //https://www.youtube.com/watch?v=mN7LW0Y00kE

        audio.play();
        isRunning = false;
        $(this).prop('disabled', true);
        $(".fa-pause").css("display", "inline-block");

        $("button, h2, canvas, #gen-counter, #explo-range, #drawCheckText, #virusThrottle, \
        	#snakeHeader, .slider").addClass('letItSnow');
        $("#drawCheck, #drawCheckMark").css("color", "#66FF33");
        $("body").css({
            "background-color": "black",
            //BACKGROUND IMAGE COURTESY OF GOOGLE... THANKS GOOGLE! :D
            "background-image": "url(Images/google_background.png)",
            "background-size" : "100% 850px"

        });
        $("h2").css({
            "font-size": "38px", 
            "text-height": "1.2",
            "padding-top": "5px",
            "padding-bottom": "-1px"
        });
        $("#img").css("display", "none");
        $("form, select, option, #start-game, #stop-game").css({
            "color": XMAS_RED,
            "background-color": XMAS_GREEN
        });
        $("#explo-range").addClass('letItSnow');
        $(".reset").show();

        CELL_SNAKE_COLOR = "black";
        CELL_ALIVE_COLOR = XMAS_GREEN;
        CELL_DEAD_COLOR = XMAS_RED;
        CELL_MINE1_COLOR = XMAS_MINE;
        CELL_NORMAL_COLOR = LET_IT_SNOW;
        GRID_LINES = "#CCFFCC";
        populateGameGrid(gameGrid);
        updateCells(gameGrid);
        drawGridLines(gameGrid);

        generation = 0;
        document.getElementById("gen-num").innerHTML = generation;
    });


    //toggles the play pause buttons when buttons are clicked
    function togglePlay(audioObj){
        if(!audio.paused){
            audioObj.pause();
            $(".fa-play, .fa-pause").toggle("swing").css("display", "inline-block");
        } else {
            audio.play();
            $(".fa-play, .fa-pause").toggle("swing").css("display", "inline-block");
        }
    }
    
    // toggles play pause function for background music
    // when in "let it snow!" mode
    $(".fa-play, .fa-pause").click(function(){
        togglePlay(audio);
    });


    $("#change-song-btn").click(function(){

        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val();
        if(pattern === "audio" && statue === 0){
            audio.play();
            statue = 1;
        }
        else if(pattern === "White_Christmas" && statue === 0){
            Wh_c.play();
            statue = 1;
        }
        else if(pattern === "The_Christmas_Song" && statue === 0){
            TCS.play();
            statue = 1;
        }
        else if(pattern === "Winter_Wonderland" && statue === 0){
            WW.play();
            statue = 1;
        }
    });

    //creates the set output to be used by startTimer to display the correct
    //amount of time a user has been running the game
    function formatTime(){
        var response = "",
            hours = 0,
            mins = 0,
            secs = time;

        while (secs >= 60){
            secs -= 60;
            mins += 1;
        }

        while (mins >= 60){
            mins -= 60;
            hours += 1;
        }

        if (secs == 0) {
            secs = "";
        } else if (secs == 1) {
            secs += " second";
        } else if (secs > 1) {
            secs += " seconds";
        }

        if (mins == 0) {
            mins = "";
        } else if (mins == 1) {
            mins += " minute";
        } else if (mins > 1) {
            mins += " minutes";
        }

        if (hours == 0) {
            hours = "";
        } else if (hours == 1) {
            hours += " hour";
        } else if (hours > 1) {
            hours += " hours";
        }

        if (hours != ""){
            response += hours + " ";
        }

        if (mins != ""){
            response += mins + " ";
        }

        if (secs != ""){
            response += secs;
        }

        return response;
    }

    //takes return of formatTime and then adds it to the specified element
    //also starts and stops the counter based on button clicks on page
    function startTimer(){
        startedTimer = true;
        time++;
        var out = formatTime();
        document.getElementById("counter").innerHTML = out;
        
        var interval = setTimeout(startTimer, 1000);
        
    }

    // onClick listener for the button to start the game
    //was moved down here so it 'knew' about starTimer() function
    $("#start-game").click(function() {
        if(!isRunning){
            isRunning = true;
            runGoL(); //runs game
            if(!startedTimer){ 
                startTimer();
            } //keeps track of time
        }
    });

    //creates numbers 1-10 in dropdown list for number of patterns
    //to be drawn
    function loadDropDown(){
        var dropDown = document.getElementsByClassName("dropDowns");
        for(var j = 0; j < dropDown.length; j++){
            for(var i = 0; i < 10; i++){
                var option = document.createElement("option");
                option.text = i + 1;
                option.value = i + 1;
                dropDown.item(j).add(option);
            }
        }
    }
    //creates the option menus for the dropdown numbers
    $(".dropDowns").ready(loadDropDown());

    //sets the explosion range for mines to be what the user inputs
    $("#explo-range").change(function(){
        EXPLOSION_RANGE = $(this).val();
        if(EXPLOSION_RANGE > 30){
            alert("Careful now. Are you sure you want to destroy the world? \
                    Set the range to a more reasonable value and save humanity.");
            isRunning = false;
        }
    });

    //keyboard binding function to control game by keyboard input
    $(document).keydown(function(e) {
        switch(e.which) {
            case 32: //spacebar 
                if(!SPACE){
                    //if the space is false, that means it is currently being pressed and no further action
                    //should result
                } else if(!isRunning){
                    isRunning = true;
                    runGoL();
                    if (!startedTimer){
                        startTimer();
                    }
                    SPACE = false; //sets to false because key has been pressed and not released
                } else {
                    isRunning = false; 
                    SPACE = false; //sets to false because key has been pressed and not released
                }
                break;

            case 37: // left arrowkey
                isRunning = false;
                break;

            case 38: // up arrowkey
                GENERATION_INTERVAL -= .05;
                break;

            case 39: // right arrowkey
                next_gen();
                break;

            case 40: // down arrowkey
                GENERATION_INTERVAL += .05;
                break;

            case 67: // key: C
                clear_canvas();
                break;

            case 87: // key: W
                keyW = true;
                break;

            case 65: // key: A
                keyA = true;
                break;

            case 83: // key: S
                keyS = true;
                break;

            case 68: // key: D
                keyD = true;
                break;
       
            default: return; // exit this handler for other keys
        }

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    //regulates keys pressed so that holding spacebar
    //does not result in running the counter at a more than normal time
    $(document).keyup(function(e) {
        if (e.keyCode === 32) {
            SPACE = true; //when the key is released it sets the value to true so that when it is

                                  //pressed again, it will return to false until released
        }
    });

    //toggles icon of checkmark or not for drawing within gridlines

    //sets drawWithin to true if the box is checked and sets it to false if 
    //not checked.
    $("#drawCheck, #drawCheckMark").click(function(){
        $("#drawCheck, #drawCheckMark").toggle();
        if (!drawWithin){
            drawWithin = true;
        } else {
            drawWithin = false;
        }
    });

    $(document).ready(function() {
        $("#splashScreen").fadeIn(1000);
        $('#helpBackground').fadeIn(900);

        $('#splashScreen, #helpBackground').click(function() {
            $("#splashScreen").fadeOut(500);
            $('#helpBackground').fadeOut(500);
        });
    });
    
	$("#snakeSelect").change(function(){
    	snakeControlSelect = $(this).val();
    });

	$("#virusThrottle").change(function(){
        VIRULENCE = $(this).val();
	});

});
 
