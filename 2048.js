var getCellCoordinates = function(grid, cellWidth, cellHeight, row, column) {
    // Conver the row/column number into x/y coordinates on the actual canvas
    return {
        x: (row * cellWidth) + ((row + 1) * grid.border),
        y: (column * cellHeight) + ((column + 1) * grid.border)
    };
};

var getTileStyles = (function() {
    var BACKGROUND_COLOR = {
        "2": "#eee4da",
        "4": "#ede0c8",
        "8": "#f2b179",
        "16": "#f59563",
        "32": "#f67c5f",
        "64": "#f65e3b",
        "128": "#edcf72",
        "256": "#edcc61",
        "512": "#edc850",
        "1024": "#edc53f",
        "2048": "#edc22e"
    };
    
    var FONT_COLOR = {
        "2": "#776e65",
        "4": "#776e65",
        "8": "#f9f6f2",
        "16": "#f9f6f2",
        "32": "#f9f6f2",
        "64": "#f9f6f2",
        "128": "#f9f6f2",
        "256": "#f9f6f2",
        "512": "#f9f6f2",
        "1024": "#f9f6f2",
        "2048": "#f9f6f2"
    };

    return function(tile) {
        return {
            color: FONT_COLOR[tile.value] || "#000000",
            backgroundColor: BACKGROUND_COLOR[tile.value] || "#000000"
        };
    };
})();

var roundedRectangle = function(context, x, y, width, height, radius) {
    context.beginPath();
    
    context.moveTo((x + radius), y);
    context.lineTo((x + width - radius), y);
    context.quadraticCurveTo((x + width), y, (x + width), (y + radius));
    context.lineTo((x + width), (y + height - radius));
    context.quadraticCurveTo((x + width), (y + height), (x + width - radius), (y + height));
    context.lineTo((x + radius), (y + height));
    context.quadraticCurveTo(x, (y + height), x, (y + height - radius));
    context.lineTo(x, (y + radius));
    context.quadraticCurveTo(x, y, (x + radius), y);
    
    context.fill();
    context.closePath();
};

// Draw an individual grid cell for a set of coordinates
var drawCell = function(context, coordinates, width, height) {
    context.fillStyle = "rgba(238, 228, 218, 0.35)";
    roundedRectangle(context, coordinates.x, coordinates.y, width, height, 5);
};

// Draw the grid of empty cells for the grid
var drawCells = function(context, grid, cellWidth, cellHeight) {
    for (var x = 0; x < grid.width; x++) {       
        for (var y = 0; y < grid.height; y++) {
            var coordinates = getCellCoordinates(grid, cellWidth, cellHeight, x, y);
            drawCell(context, coordinates, cellWidth, cellHeight);
        }
    }
};

var drawTile = function(context, grid, tile, coordinates, cellWidth, cellHeight) {
    var tileStyles = getTileStyles(tile);
    
    // Handle tile growth animation calculations
    var growth = (!!tile.growing && !tile.sliding) ? tile.growing.value : 0;
    var x = coordinates.x - (growth / 2);
    var y = coordinates.y - (growth / 2);
    var width = cellWidth + (growth);
    var height = cellHeight + (growth);
    
    // Handle tile sliding animation
    if (!!tile.sliding) {
        // TODO: Alter x/y coordinates where appropriate
        var direction = tile.slidingData.direction;
        var value = tile.sliding.value;
        var startCoordinates = getCellCoordinates(grid, cellWidth, cellHeight, tile.slidingData.startX, tile.slidingData.startY);
        var stopCoordinates = getCellCoordinates(grid, cellWidth, cellHeight, tile.slidingData.endX, tile.slidingData.endY);

        if (direction === "UP") {
            y = startCoordinates.y - value;
            y = (y <= stopCoordinates.y) ? stopCoordinates.y : y;
        } else if (direction === "DOWN") {
            y = startCoordinates.y + value;
            y = (y >= stopCoordinates.y) ? stopCoordinates.y : y;
        } else if (direction === "LEFT") {
            x = startCoordinates.x - value;
            x = (x <= stopCoordinates.x) ? stopCoordinates.x : x;
        } else if (direction === "RIGHT") {
            x = startCoordinates.y + value;
            x = (x >= stopCoordinates.x) ? stopCoordinates.x : x;
        }
        
        if ((direction === "UP" && y <= stopCoordinates.y) ||
            (direction === "DOWN" && y >= stopCoordinates.y) ||
           (direction === "LEFT" && x <= stopCoordinates.x) ||
           (direction === "RIGHT" && x >= stopCoordinates.x)) {
            delete tile.sliding;
            delete tile.slidingData;
            delete tile.triggerSlide;
        }
    }
    
    // Fill in the cell with the proper background color
    context.fillStyle = tileStyles.backgroundColor;
    roundedRectangle(context, x, y, width, height, 5);
    
    // Draw the tile value in the center of the cell
    var textX = x + (cellWidth / 2);
    var textY = y + (cellHeight / 2);
    // TODO: Reevaluate calculation of font size
    // TODO: Reevaluate font choice
    context.font = "40px Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = tileStyles.color;
    context.fillText(tile.value, textX, textY, cellWidth);
};

var drawTiles = function(context, grid, cellWidth, cellHeight) {
    // Iterate over all tiles and render on screen
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (!!grid.tiles[x][y]) {
                var coordinates = getCellCoordinates(grid, cellWidth, cellHeight, x, y);
                drawTile(context, grid, grid.tiles[x][y], coordinates, cellWidth, cellHeight);
            }
        }
    }
};

var render = function(canvas, context, grid) {
    // Draw the background
    context.fillStyle = "#bbada0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    var cellHeight = (canvas.height - (grid.border * (grid.height + 1))) / grid.height;
    var cellWidth = (canvas.width - (grid.border * (grid.width + 1))) / grid.width;
    
    // Draw the empty cells    
    drawCells(context, grid, cellWidth, cellHeight);
    
    // Draw tiles in their proper cells
    drawTiles(context, grid, cellWidth, cellHeight);
};

var getEmptyCells = function(grid) {
    var emptyCells = {};
    
    for (var x = 0; x < grid.width; x++) {
        var row = [];
        
        for (var y = 0; y < grid.height; y++) {
            if (!grid.tiles[x][y]) {
                row.push(y);   
            }
        }

        if (row.length > 0) {
            emptyCells[x] = row;   
        }
    }
    
    return emptyCells;
}

var randomTile = function(grid) {
    var emptyCells = getEmptyCells(grid);
    var keys = [];
    for (var key in emptyCells) { keys.push(key); }
    
    // First-level index represents the actual grid-row
    var row = keys[Math.floor(Math.random() * keys.length)];
    // Values of inner-array are available columns
    var column = Math.floor(Math.random() * emptyCells[row].length);

    return {
        // Allow 2 or 4 as a starting value, to spice things up
        value: Math.ceil(Math.random() * 2) * 2,
        // Starting random coordinates within the grid
        x: row,
        y: emptyCells[row][column]
    };
};

var reset = function(grid) {
    // Create new set of tiles
    grid.tiles = [];
    
    // Fill the set of tiles as empty
    for (var x = 0; x < grid.width; x++) {
        grid.tiles[x] = [];
        
        for (var y = 0; y < grid.height; y++) {
            grid.tiles[x][y] = undefined;            
        }
    }

    // Randomly generate and place two tiles to start
    var firstTile = randomTile(grid);
    grid.tiles[firstTile.x][firstTile.y] = firstTile;
    var secondTile = randomTile(grid);
    grid.tiles[secondTile.x][secondTile.y] = secondTile;
};

var canMoveUp = function(grid) {
    // Check if there is an open space above any tile
    for (var x = 0; x < grid.width; x++) {
        // Skip `y = 0` because the top row cannot move up
        for (var y = 1; y < grid.height; y++) {
            // Check if there is a tile in the current coordinates
            if (!!grid.tiles[x][y]) {
                // If the cell above is unoccupied, we can move up
                if (!grid.tiles[x][y-1]) {
                    return true;   
                } else if (grid.tiles[x][y].value === grid.tiles[x][y-1].value) {
                    // If the tile in the cell above, we can move up and combine
                    return true;
                }
            }
        }
    }
};
var canMoveDown = function(grid) {
    // Check if we can move downward
    for (var x = 0; x < grid.width; x++) {
        // Skip `y = grid.height` since the bottom cannot move down
        for (var y = 0; y < grid.height - 1; y++) {
            // Check if there is a tile in the current cell
            if (!!grid.tiles[x][y]) {
                // We can move down in the below cell is empty
                if (!grid.tiles[x][y+1]) {
                    return true;    
                } else if (grid.tiles[x][y].value === grid.tiles[x][y+1].value) {
                    // We can move down if the below tile has the same value
                    return true;    
                }
            }
        }
    }    
};
var canMoveLeft = function(grid) {
    // Check if we can move to the left
    // Skip `x = 0` because the leftmost cannot move left
    for (var x = 1; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (!!grid.tiles[x][y]) {
                // We're fine if the cell to the left is empty
                if (!grid.tiles[x-1][y]) {
                    return true;
                } else if (grid.tiles[x][y].value === grid.tiles[x-1][y].value) {
                    // We're also fine if the tile to the left is the same as this one
                    return true;   
                }
            }
        }
    }
};
var canMoveRight = function(grid) {
    // Check if we can move to the right
    // Skip `x = grid.width` since the rightmost cannot move right
    for (var x = 0; x < grid.width - 1; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (!!grid.tiles[x][y]) {
                // Fine if the cell to the right is empty
                if (!grid.tiles[x+1][y]) {
                    return true;   
                } else if (grid.tiles[x][y].value === grid.tiles[x+1][y].value) {
                    // Fine if the tile to the right is the same value as the current one
                    return true;                    
                }
            }
        }
    }
};

var attemptMerge = function(grid, currentX, currentY, neighborX, neighborY) {
    if (isFinite(currentX) && isFinite(currentY) && isFinite(neighborX) && isFinite(neighborY)) {
        if (grid.tiles[currentX][currentY].value === grid.tiles[neighborX][neighborY].value) {
            // Double the value of the current cell
            grid.tiles[currentX][currentY].value *= 2;
            // Erase the neighboring cell from the map
            grid.tiles[neighborX][neighborY] = undefined;
            // Set growth animation flag for merged tile
            grid.tiles[currentX][currentY].triggerGrowth = true;
            
            return true;
        }   
    }
    
    return false;
};

var attemptMove = function(grid, direction, currentX, currentY, newX, newY) {
    if (isFinite(currentX) && isFinite(currentY) && isFinite(newX) && isFinite(newY)) {
        if (currentX !== newX || currentY !== newY) {
            var currentTile = grid.tiles[currentX][currentY];
            currentTile.x = newX;
            currentTile.y = newY;
            
            grid.tiles[newX][newY] = currentTile;
            grid.tiles[currentX][currentY] = undefined;
            
            // Setup data needed for slide animation
            currentTile.sliding = { value: 0 };
            currentTile.triggerSlide = true;
            currentTile.slidingData = {
                direction: direction,
                startX: currentX,
                startY: currentY,
                endX: newX,
                endY: newY
            };
            
            return true;
        }
    }
    
    return false;
};

var moveUp = (function() {
    var getTopCell = function(column, currentY) {
        return column.reduceRight(function(top, cell, index) {
            return (index <= currentY && !cell) ? index : top;    
        }, currentY);
    };
    
    var getBottomTile = function(column, currentY) {
        return column.reduce(function(bottom, cell, index) {
            // If we're not yet below the current tile, skip
            if (index <= currentY) return undefined;
            // If a tile has not been found and we have a tile, return index
            else if (!bottom && !!cell) return index;
            // Otherwise return the already found tile
            else return bottom;
        }, undefined);
    };
    
    return function(grid) {
        if (canMoveUp(grid)) {
            for (var x = 0; x < grid.width; x++) {
                for (var y = 0; y < grid.height; y++) {
                    if (!!grid.tiles[x][y]) {
                        var currentTile = grid.tiles[x][y];
                        var topCellIndex = getTopCell(grid.tiles[x], y);
                        var bottomTileIndex = getBottomTile(grid.tiles[x], y);
                        
                        attemptMove(grid, "UP", x, y, x, topCellIndex);
                        attemptMerge(grid, x, currentTile.y, x, bottomTileIndex);
                    } 
                }
            }
            
            // TODO: Eventually, return object containing combination count
            return true;
        }
    };
})();
var moveDown = (function() {
    var getBottomCell = function(column, currentY) {
        return column.reduce(function(bottom, cell, index) {
            return (index >= currentY && !cell) ? index : bottom;    
        }, currentY);
    };
    
    var getTopTile = function(column, currentY) {
        return column.reduceRight(function(top, cell, index) {
            // If we're not above the current tile, skip
            if (index >= currentY) return undefined;
            // If we don't have a top and we have a tile, return index
            else if (!top && !!cell) return index;
            // Otherwise return current tile
            else return top;
        }, undefined);
    };
    
    return function(grid) {
        if (canMoveDown(grid)) {
            for (var x = 0; x < grid.width; x++) {
                for (var y = (grid.height - 1); y >= 0; y--) {
                    if (!!grid.tiles[x][y]) {
                        var currentTile = grid.tiles[x][y];
                        var bottomCellIndex = getBottomCell(grid.tiles[x], y);
                        var topTileIndex = getTopTile(grid.tiles[x], y);

                        attemptMove(grid, "DOWN", x, y, x, bottomCellIndex);
                        attemptMerge(grid, x, currentTile.y, x, topTileIndex);
                    }
                }
            }
            
                        
            // TODO: Eventually, return object containing combination count
            return true;
        }
    };
})();
var moveLeft = (function() {
    var getLeftmostCell = function(grid, currentX, currentY) {
        return grid.tiles.reduceRight(function(left, row, index) {
            return (index <= currentX && !row[currentY]) ? index : left;
        }, currentX);
    };
    
    var getRightTile = function(grid, currentX, currentY) {
        return grid.tiles.reduce(function(right, row, index) {
            // If we're still left of the current tile, skip
            if (index <= currentX) return undefined;
            // If we do not have a right and have a tile, we've found it
            else if (!right && !!row[currentY]) return index;
            // Otherwise keep passing the current right
            else return right;
        }, undefined);
    };
    
    return function(grid) {
        if (canMoveLeft(grid)) {
            for (var y = 0; y < grid.height; y++) {
                for (var x = 0; x < grid.width; x++) {
                    if (!!grid.tiles[x][y]) {
                        var currentTile = grid.tiles[x][y];
                        var leftCellIndex = getLeftmostCell(grid, x, y);
                        var rightTileIndex = getRightTile(grid, x, y);

                        attemptMove(grid, "LEFT", x, y, leftCellIndex, y);
                        attemptMerge(grid, currentTile.x, y, rightTileIndex, y);
                    }
                }
            }
                        
            // TODO: Eventually, return object containing combination count
            return true;
        }
    };
})();
var moveRight = (function() {
    var getRightCell = function(grid, currentX, currentY) {
        return grid.tiles.reduce(function(right, row, index) {
            return (index >= currentX && !row[currentY]) ? index : right;    
        }, currentX);
    };
    
    var getLeftTile = function(grid, currentX, currentY) {
        return grid.tiles.reduceRight(function(left, row, index) {
            // If we are right of the current tile, skip
            if (index >= currentX) return undefined;
            // If we do not yet have a left tile and we have found one, return it
            else if (!left && !!row[currentY]) return index;
            // Otherwise, keep passing the found left
            else return left;
        }, undefined);
    };
    
    return function(grid) {
        if (canMoveRight(grid)) {
            for (var y = 0; y < grid.height; y++) {
                for (var x = (grid.width - 1); x >= 0; x--) {
                    if (!!grid.tiles[x][y]) {
                        var currentTile = grid.tiles[x][y];
                        var rightCellIndex = getRightCell(grid, x, y);
                        var leftTileIndex = getLeftTile(grid, x, y);
                        
                        attemptMove(grid, "RIGHT", x, y, rightCellIndex, y);
                        attemptMerge(grid, currentTile.x, y, leftTileIndex, y);
                    }
                }
            }
            
            // TODO: Eventually, return object containing combination count
            return true;
        }   
    };
})();

var move = function(direction, grid) {
    if (!!direction) {
        var action = function() {};
        
        switch (direction) {
            case "UP":
                action = moveUp;
                break;
            case "DOWN":
                action = moveDown;
                break;
            case "LEFT":
                action = moveLeft;
                break;
            case "RIGHT":
                action = moveRight;
                break;
        }
        
        if (action(grid)) {
            var tile = randomTile(grid);
            grid.tiles[tile.x][tile.y] = tile;
        }
    }
};

var hasWon = function(grid) {
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (!!grid.tiles[x][y] && grid.tiles[x][y].value === grid.winningValue) {
                return true;
            }
        }
    }
};

var hasLost = function(grid) {
    return (!canMoveUp(grid) && !canMoveDown(grid) && !canMoveLeft(grid) && !canMoveRight(grid)); 
};

var showOverlay = function(canvas, context) {
    // Draw semi-transparent background over the entire grid
    context.fillStyle = "rgba(238, 228, 218, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);    
};

var showGameWon = function(canvas, context) {
    showOverlay(canvas, context);

    // Draw "Game Won!" message
    // TODO: Reevaluate font size/style
    context.font = "40px Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#776e65";
    context.fillText("Game Won!", (canvas.width / 2), (canvas.height / 2), canvas.width);    
};

var showGameOver = function(canvas, context) {
    showOverlay(canvas, context);
    
    // Draw "Game Over!" text
    // TODO: Reevaluate font size/style
    context.font = "40px Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#776e65";
    context.fillText("Game Over!", (canvas.width / 2), (canvas.height / 2), canvas.width);    
};

var animateGrowth = function(canvas, context, tile) {
    var MODIFIER = { GROW: "GROW", SHRINK: "SHRINK" };
    var GROWTH_RATE = 5;
    var MAX_SIZE = 15;
    var MIN_SIZE = 0;
    
    if (tile.growing === undefined) {
        // If we are not yet animating, setup the data
        tile.growing = { modifier: MODIFIER.GROW, value: GROWTH_RATE };   
    } else if (tile.growing.modifier === MODIFIER.GROW) {
        // Increase the growth size by 1
        tile.growing.value += GROWTH_RATE;
        
        // If we've reached the max growth, start shrinking
        if (tile.growing.value >= MAX_SIZE) {
            tile.growing.modifier = MODIFIER.SHRINK;    
        }
    } else if (tile.growing.modifier === MODIFIER.SHRINK) {
        tile.growing.value -= GROWTH_RATE;
        
        // If we've shrunk back to normal, remove animation data
        if (tile.growing.value <= MIN_SIZE) {
            // Remove the trigger value
            delete tile.triggerGrowth;
            delete tile.growing;   
        }
    }
};

var animateSliding = function(canvas, context, tile) {
    var SLIDE_RATE = 10;

    if (tile.sliding === undefined) {
        tile.sliding = { value: 0 };    
    } else {
        var slidingData = tile.slidingData;
        
        // Slide rate should be multiplied by number of cells moved across
        switch (slidingData.direction) {
            case "UP":
            case "DOWN":
                SLIDE_RATE += (Math.abs(slidingData.startY - slidingData.endY) * SLIDE_RATE);
                break;
            case "LEFT":
            case "RIGHT":
                SLIDE_RATE += (Math.abs(slidingData.startX - slidingData.endX) * SLIDE_RATE);
                break;
        }

        tile.sliding.value += SLIDE_RATE;
    }
};

var animate = function(canvas, context, grid) {
    // Used to determine if we need to block user input for the duration of an animation
    var blockInput = false;
    
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            var tile = grid.tiles[x][y];
            
            if (!!tile) {
                if (tile.triggerGrowth || !!tile.growing) {
                    animateGrowth(canvas, context, tile);
                }
                
                if (tile.triggerSlide || !!tile.sliding) {
                    animateSliding(canvas, context, tile);
                    blockInput = true;
                }   
            }            
        }
    }
    
    return blockInput;
};

// Initialize game and controls
(function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    
    // tile: {value: 2, x: 0, y: 0} - Includes value and coordinates (redundant, but error correcting)    
    var grid = {
        // column x row
        tiles: [],
        width: 4,
        height: 4,
        border: 15,
        winningValue: 2048
    };
    
    // Log key presses
    var KEY_TO_COMMAND = {
        "37": "LEFT", 
        "38": "UP", 
        "39": "RIGHT", 
        "40": "DOWN"};
    var direction = undefined;
    addEventListener("keydown", function(event) {
        event.preventDefault();
        direction = KEY_TO_COMMAND[event.keyCode];
    });

    // Initialize game data
    reset(grid);
    
    // Setup the render loop
    (function mainLoop() {
        // Handle calculations for animations
        var blockInput = animate(canvas, context, grid);
        
        // Handle the user input
        if (!blockInput) {
            move(direction, grid);
            direction = undefined;            
        }
                
        // Draw the game screen
        render(canvas, context, grid);
        
        // Check if we need to continue playing
        if (hasWon(grid)) {
            // Draw the game won screen
            showGameWon(canvas, context);
        } else if (hasLost(grid)) {
            // Draw game over screen
            showGameOver(canvas, context);
        } else {
            // Continue running the main loop
            setTimeout(mainLoop, 25);    
        }        
    })();
})();
