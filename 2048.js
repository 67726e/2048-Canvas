/*global GameAssets: true */

(function() {
	"use strict";

	// TODO: Change animation calculations to include time for non-janky animation

	var Metrics = (function() {
		var PIXEL_RATIO = (function () {
			//noinspection JSUnresolvedVariable
			var ctx = document.createElement("canvas").getContext("2d"),
				dpr = window.devicePixelRatio || 1,
				bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;

			return dpr / bsr;
		})();
		var body = document.getElementById("body");

		var Metrics = {
			createCanvas: function(width, height) {
				// Pixel Density for Devices - http://stackoverflow.com/a/15666143/372743
				var pixelRatio = this.getPixelRatio();
				var canvas = document.createElement("canvas");
				var context = canvas.getContext("2d");

				canvas.width = width * pixelRatio;
				canvas.height = height * pixelRatio;
				canvas.style.width = (width + "px");
				canvas.style.height = (height + "px");

				// Seems to fuck up the iOS UIWebView by quartering the canvas
//				context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

				return canvas;
			},
			getPixelRatio: function() {
				return PIXEL_RATIO;
			},
			getSize: function() {
				return Math.min(this.getWidth(), this.getHeight());
			},
			getSlideSpeed: function() {
				return (this.getSize() / 25) * this.getPixelRatio();
			},
			getGrowthSpeed: function() {
				return (this.getSize() / 100) * this.getPixelRatio();
			},
			getHeaderSize: function() {
				return Math.floor(this.getSize() / 8.33) * this.getPixelRatio();
			},
			getResetSize: function() {
				return Math.floor(this.getSize() / 30) * this.getPixelRatio();
			},
			getTileSize: function(width, height) {
				return Math.floor(Math.min(width, height) / 1.94);
			},
			getBorder: function() {
				return (this.getSize() / 40) * this.getPixelRatio();
			},
			getWidth: function() {
				var e = document.documentElement,
					width = window.innerWidth || e.clientWidth || body.clientWidth;

				return width;
			},
			getHeight: function() {
				var e = document.documentElement,
					height = window.innerHeight|| e.clientHeight|| body.clientHeight;

				return height;
			},
			getCellWidth: function(canvas, grid) {
				return (canvas.width - (Metrics.getBorder() * (grid.width + 1))) / grid.width;
			},
			getCellHeight: function(canvas, grid) {
				return (canvas.height - (this.getBorder() * (grid.height + 1))) / grid.height;
			}
		};

		// public interface
		return {
			createCanvas: function(width, height) {
				return Metrics.createCanvas(width, height);
			},
			getPixelRatio: function() {
				return Metrics.getPixelRatio();
			},
			getSize: function() {
				return Metrics.getSize();
			},
			getSlideSpeed: function() {
				return Metrics.getSlideSpeed();
			},
			getGrowthSpeed: function() {
				return Metrics.getGrowthSpeed();
			},
			getHeaderSize: function() {
				return Metrics.getHeaderSize();
			},
			getResetSize: function() {
				return Metrics.getResetSize();
			},
			getTileSize: function(width, height) {
				return Metrics.getTileSize(width, height);
			},
			getBorder: function() {
				return Metrics.getBorder();
			},
			getWidth: function() {
				return Metrics.getWidth();
			},
			getHeight: function() {
				return Metrics.getHeight();
			},
			getCellWidth: function(canvas, grid) {
				return Metrics.getCellWidth(canvas, grid);
			},
			getCellHeight: function(canvas, grid) {
				return Metrics.getCellHeight(canvas, grid);
			}
		};
	})();

	var Input = (function() {
		// Log key presses
		var KEY_TO_COMMAND = {
			"37": "LEFT",
			"38": "UP",
			"39": "RIGHT",
			"40": "DOWN"};
		var direction;

		// Handle normal keypress events
		addEventListener("keydown", function(event) {
			// Only prevent the default action for valid moves
			if (!!KEY_TO_COMMAND[event.keyCode]) {
				event.preventDefault();
			}

			direction = KEY_TO_COMMAND[event.keyCode];
		});

		// Handle touch moves
		var startCoordinates = { x: 0, y: 0 };
		addEventListener("touchstart", function(event) {
			// Needed to prevent undefined behavior on Android devices
			event.preventDefault();
			
			event.changedTouches = event.changedTouches || [{ pageX: 0, pageY: 0 }];
			var touch = event.changedTouches[0];

			startCoordinates.x = touch.pageX;
			startCoordinates.y = touch.pageY;
		});
		addEventListener("touchend", function(event) {
			// Needed to prevent undefined behavior on Android devices
			event.preventDefault();

			event.changedTouches = event.changedTouches || [{ pageX: 0, pageY: 0 }];
			var touch = event.changedTouches[0];

			// Get the horizontal and vertical differences
			var horizontal = startCoordinates.x - touch.pageX;
			var vertical = startCoordinates.y - touch.pageY;

			// Clear the start/stop coordinates
			startCoordinates.x = 0;
			startCoordinates.y = 0;

			// If the horizontal change was greater than the vertical change, horizontal swipe
			if (Math.abs(horizontal) > Math.abs(vertical)) {
				if (horizontal > 0) {
					// Swiped left
					direction = "LEFT";
				} else {
					// Swiped right
					direction = "RIGHT";
				}
			} else {
				// Otherwise vertical swipe
				if (vertical > 0) {
					// Swiped down
					direction = "UP";
				} else {
					// Swiped up
					direction = "DOWN";
				}
			}
		});

		var Input = {
			getCommand: function() {
				var command = direction;
				direction = undefined;

				return command;
			},
			resetClick: function(callback) {
				var immediateCallback = function(event) {
					event.preventDefault();

					// Remove the event listeners
					removeEventListener("click", immediateCallback);
					removeEventListener("touchend", immediateCallback);

					// Execute the callback
					callback();
				};

				addEventListener("click", immediateCallback);
				addEventListener("touchend", immediateCallback);
			}
		};

		// Public interface
		return {
			getCommand: function() {
				return Input.getCommand();
			},
			resetClick: function(callback) {
				Input.resetClick(callback);
			}
		};
	})();

	var Animation = (function() {
		var Animation = {
			animate: function(canvas, context, grid) {
				// Used to determine if we need to block user input for the duration of an animation
				var blockInput = false;

				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						var tile = grid.tiles[x][y];
						var mergedTile = grid.mergedTiles[x][y];

						if (!!tile) {
							if (tile.triggerGrowth || !!tile.growing) {
								this.animateGrowth(canvas, context, tile);
							}

							if (tile.triggerSlide || !!tile.sliding) {
								this.animateSliding(canvas, context, tile);
								blockInput = true;
							}
						}

						if (!!mergedTile) {
							if (mergedTile.triggerSlide || !!mergedTile.sliding) {
								this.animateSliding(canvas, context, mergedTile);
								blockInput = true;
							}
						}
					}
				}

				return blockInput;
			},

			animateGrowth: function(canvas, context, tile) {
				var MODIFIER = { GROW: "GROW", SHRINK: "SHRINK" };
				var GROWTH_SPEED = Metrics.getGrowthSpeed();

				if (tile.growing === undefined) {
					// If we are not yet animating, setup the data
					tile.growing = {
						modifier: MODIFIER.GROW,
						value: GROWTH_SPEED,
						maxSize: 15,
						minSize: 0
					};
				} else if (tile.growing.modifier === MODIFIER.GROW) {
					// Increase the growth size
					tile.growing.value += GROWTH_SPEED;

					// If we've reached the max growth, start shrinking
					if (tile.growing.value >= tile.growing.maxSize) {
						tile.growing.modifier = MODIFIER.SHRINK;
					}
				} else if (tile.growing.modifier === MODIFIER.SHRINK) {
					tile.growing.value -= GROWTH_SPEED;

					// If we've shrunk back to normal, remove animation data
					if (tile.growing.value <= tile.growing.minSize) {
						// Remove the trigger value
						delete tile.triggerGrowth;
						delete tile.growing;
					}
				}
			},
			animateSliding: function(canvas, context, tile) {
				var SLIDE_RATE = Metrics.getSlideSpeed();

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
			}
		};

		// Public interface
		return {
			animate: function(canvas, context, grid) {
				return Animation.animate(canvas, context, grid);
			}
		};
	})();

	var Renderer = (function() {
		var assets = GameAssets.getClassicPackage();

		var Renderer = {
			render: function(canvas, context, grid) {
				// Draw the background
				context.fillStyle = assets.backgroundColor;
				context.fillRect(0, 0, canvas.width, canvas.height);

				var cellHeight = Metrics.getCellHeight(canvas, grid);
				var cellWidth = Metrics.getCellWidth(canvas, grid);

				// Draw the empty cells
				this.drawCells(context, grid, cellWidth, cellHeight);

				// Draw the merged tiles that are still animating
				this.drawMergedTiles(context, grid, cellWidth, cellHeight);
				// Draw tiles in their proper cells
				this.drawTiles(context, grid, cellWidth, cellHeight);
			},
			renderScores: function(canvas, context, currentScore, topScore) {
				var topScoreCoordinates = this.drawTopScore(canvas, context, topScore);
				this.drawCurrentScore(canvas, context, topScoreCoordinates, currentScore);
			},
			showGameOver: function(canvas, context) {
				this.showOverlay(canvas, context, assets.gameOver.backgroundColor);

				// Draw "Game Over!" text
				context.font = "bold " + Metrics.getHeaderSize() + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = assets.gameOver.textColor;
				context.fillText("Game Over!", (canvas.width / 2), (canvas.height / 2), canvas.width);

				// Draw "Try again" button
				this.showRestart(canvas, context);
			},
			showGameWon: function(canvas, context) {
				this.showOverlay(canvas, context, assets.gameWon.backgroundColor);

				// Draw "Game Won!" message
				context.font = "bold " + Metrics.getHeaderSize() + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = assets.gameWon.textColor;
				context.fillText("You win!", (canvas.width / 2), (canvas.height / 2), canvas.width);

				// Add "Try Again" button
				this.showRestart(canvas, context);
			},

			roundedRectangle: function(context, x, y, width, height, radius) {
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
			},
			showOverlay: function(canvas, context, fill) {
				// Draw semi-transparent background over the entire grid
				context.fillStyle = fill;
				context.fillRect(0, 0, canvas.width, canvas.height);
			},
			showRestart: function(canvas, context) {
				var fontSize = Metrics.getResetSize();
				var buttonWidth = Math.floor(fontSize * 6.67);
				var buttonHeight = Math.floor(buttonWidth / 2.5);
				var margin = Math.floor(buttonWidth / 10);
				var buttonX = (canvas.width / 2) - (buttonWidth / 2);
				var buttonY = (canvas.height / 2) + 50;

				// Draw the rectangle button
				context.fillStyle = assets.restart.backgroundColor;
				this.roundedRectangle(context, buttonX, buttonY, buttonWidth, buttonHeight, 4);

				// Show the message
				context.font = "bold " + fontSize + "px Helvetica Neue";
				context.textAlign = "center";
				context.textAlign = "middle";
				context.fillStyle = assets.restart.textColor;
				context.fillText("Play Again?", buttonX + (buttonWidth / 2), buttonY + (buttonHeight / 2), buttonWidth - (margin * 2));
			},
			drawCells: function(context, grid, cellWidth, cellHeight) {
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, x, y);
						this.drawCell(context, coordinates, cellWidth, cellHeight);
					}
				}
			},
			drawCell: function(context, coordinates, width, height) {
				context.fillStyle = assets.cellBackgroundColor;
				this.roundedRectangle(context, coordinates.x, coordinates.y, width, height, 5);
			},
			drawTiles: function(context, grid, cellWidth, cellHeight) {
				// Iterate over all tiles and render on screen
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y]) {
							var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, x, y);
							this.drawTile(context, grid, grid.tiles[x][y], coordinates, cellWidth, cellHeight);
						}
					}
				}
			},
			drawTile: function(context, grid, tile, coordinates, width, height) {
				var x = coordinates.x;
				var y = coordinates.y;

				// Handle tile sliding animation
				if (!!tile.sliding) {
					var direction = tile.slidingData.direction;
					var value = tile.sliding.value;
					var startCoordinates = this.getCellCoordinates(grid, width, height, tile.slidingData.startX, tile.slidingData.startY);
					var stopCoordinates = this.getCellCoordinates(grid, width, height, tile.slidingData.endX, tile.slidingData.endY);

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
						x = startCoordinates.x + value;
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

				// Handle growth animation
				if (!!tile.growing) {
					var growth = (!!tile.growing && !tile.sliding) ? tile.growing.value : 0;
					x -= (growth / 2);
					y -= (growth / 2);
					width += growth;
					height += growth;
				}

				// Fill in the cell with the proper background color
				context.fillStyle = assets.tileBackgroundColor[tile.value];
				this.roundedRectangle(context, x, y, width, height, 5);

				// Draw the tile value in the center of the cell
				var textX = x + (width / 2);
				var textY = y + (height / 2);
				context.font = "bold " + Metrics.getTileSize(width, height) + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = assets.tileTextColor[tile.value];
				// Allow for 10px of padding on the bounding box
				context.fillText(tile.value, textX, textY, width - 10);
			},
			drawMergedTiles: function(context, grid, cellWidth, cellHeight) {
				// Iterate over the merged tiles and draw them on screen
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.mergedTiles[x][y]) {
							var tile = grid.mergedTiles[x][y];
							var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, tile.slidingData.endX,
								tile.slidingData.endY);
							this.drawTile(context, grid, tile, coordinates, cellWidth, cellHeight);

							// If the tile is done sliding, remove it from the merged tile grid
							if (!tile.sliding) {
								grid.mergedTiles[x][y] = undefined;
							}
						}
					}
				}
			},
			getCellCoordinates: function(grid, cellWidth, cellHeight, row, column) {
				// For some reason, row/column are sometimes a string which fucks the calculations
				row = parseInt(row, 10);
				column = parseInt(column, 10);

				// Convert the row/column number into x/y coordinates on the actual canvas
				return {
					x: (row * cellWidth) + ((row + 1) * Metrics.getBorder()),
					y: (column * cellHeight) + ((column + 1) * Metrics.getBorder())
				};
			},

			drawCurrentScore: function(canvas, context, topScoreCoordinates, score) {
				// TODO: Use font-metrics to determine size/positioning
				var margin = 10;
				var width = 180;
				var height = canvas.height - (margin * 2);
				var x = topScoreCoordinates.x - (width + margin);
				var y = margin;

				// Draw the score box
				context.fillStyle = assets.score.backgroundColor;
				this.roundedRectangle(context, x, y, width, height, 4);

				// Draw the "Score:" label
				context.fillStyle = assets.score.titleColor;
				context.font = "bold 24px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "top";
				context.fillText("Score:", x + (width / 2), y + 5, width);

				// Draw the current score
				context.fillStyle = assets.score.valueColor;
				context.font = "bold 36px Helvetica Neue";
				context.textBaseline = "bottom";
				context.fillText(score, x + (width / 2), y + height - 5, width);

				return {
					x: 0,
					y: 0
				};
			},
			drawTopScore: function(canvas, context, score) {
				// TODO: Use font-metrics to determine size/positioning
				var margin = 10;
				var width = 180;
				var height = canvas.height - (margin * 2);
				var x = canvas.width - width;
				var y = margin;

				// Draw the top score box
				context.fillStyle = assets.score.backgroundColor;
				this.roundedRectangle(context, x, y, width, height, 4);

				// Draw the "Top Score:" text
				context.fillStyle = assets.score.titleColor;
				context.font = "bold 24px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "top";
				context.fillText("Top Score:", x + (width / 2), y + 5, width);

				// Draw the score under the heading
				context.fillStyle = assets.score.valueColor;
				context.font = "bold 36px Helvetica Neue";
				context.textBaseline = "bottom";
				context.fillText(score, x + (width / 2), y + height - 5, width);

				return {
					x: x,
					y: y
				};
			}
		};

		// Public interface
		return {
			render: function(canvas, context, grid) {
				return Renderer.render(canvas, context, grid);
			},
			renderScores: function(canvas, context, currentScore, topScore) {
				return Renderer.renderScores(canvas, context, currentScore, topScore);
			},
			showGameOver: function(canvas, context) {
				Renderer.showGameOver(canvas, context);
			},
			showGameWon: function(canvas, context) {
				Renderer.showGameWon(canvas, context);
			}
		};
	})();

	var Movement = (function() {
		var Movement = {
			move: function(direction, grid) {
				if (!!direction) {
					var action = function(grid) {};

					switch (direction) {
						case "UP":
							action = this.moveUp;
							break;
						case "DOWN":
							action = this.moveDown;
							break;
						case "LEFT":
							action = this.moveLeft;
							break;
						case "RIGHT":
							action = this.moveRight;
							break;
					}

					return action(grid);
				}

				return false;
			},
			canMove: function(direction, grid) {
				switch (direction) {
					case "UP":
						return this.canMoveUp(grid);
					case "DOWN":
						return this.canMoveDown(grid);
					case "LEFT":
						return this.canMoveLeft(grid);
					case "RIGHT":
						return this.canMoveRight(grid);
				}

				return false;
			},

			canMoveUp: function(grid) {
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

				return false;
			},
			canMoveDown: function(grid) {
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

				return false;
			},
			canMoveLeft: function(grid) {
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

				return false;
			},
			canMoveRight: function(grid) {
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

				return false;
			},

			moveUp: (function() {
				var getTopCell = function(column, currentY) {
					return column.reduceRight(function(top, cell, index) {
						return (index <= currentY && !cell) ? index : top;
					}, currentY);
				};
				var getBottomTile = function(column, currentY) {
					return column.reduce(function(bottom, cell, index) {
						// If we're not yet below the current tile, skip
						if (index <= currentY) { return undefined; }
						// If a tile has not been found and we have a tile, return index
						else if (!bottom && !!cell) { return index; }
						// Otherwise return the already found tile
						else { return bottom; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveUp(grid)) {
						var score = { score: 0 };

						for (var x = 0; x < grid.width; x++) {
							for (var y = 0; y < grid.height; y++) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var topCellIndex = getTopCell(grid.tiles[x], y);
									var bottomTileIndex = getBottomTile(grid.tiles[x], y);

									Movement.attemptMove(grid, "UP", x, y, x, topCellIndex);
									var mergeScore = Movement.attemptMerge(grid, "UP", x, currentTile.y, x, bottomTileIndex);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveDown: (function() {
				var getBottomCell = function(column, currentY) {
					return column.reduce(function(bottom, cell, index) {
						return (index >= currentY && !cell) ? index : bottom;
					}, currentY);
				};
				var getTopTile = function(column, currentY) {
					return column.reduceRight(function(top, cell, index) {
						// If we're not above the current tile, skip
						if (index >= currentY) { return undefined; }
						// If we don't have a top and we have a tile, return index
						else if (!top && !!cell) { return index; }
						// Otherwise return current tile
						else { return top; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveDown(grid)) {
						var score = { score: 0 };

						for (var x = 0; x < grid.width; x++) {
							for (var y = (grid.height - 1); y >= 0; y--) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var bottomCellIndex = getBottomCell(grid.tiles[x], y);
									var topTileIndex = getTopTile(grid.tiles[x], y);

									Movement.attemptMove(grid, "DOWN", x, y, x, bottomCellIndex);
									var mergeScore = Movement.attemptMerge(grid, "DOWN", x, currentTile.y, x, topTileIndex);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveLeft: (function() {
				var getLeftmostCell = function(grid, currentX, currentY) {
					return grid.tiles.reduceRight(function(left, row, index) {
						return (index <= currentX && !row[currentY]) ? index : left;
					}, currentX);
				};
				var getRightTile = function(grid, currentX, currentY) {
					return grid.tiles.reduce(function(right, row, index) {
						// If we're still left of the current tile, skip
						if (index <= currentX) { return undefined; }
						// If we do not have a right and have a tile, we've found it
						else if (!right && !!row[currentY]) { return index; }
						// Otherwise keep passing the current right
						else { return right; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveLeft(grid)) {
						var score = { score: 0 };

						for (var y = 0; y < grid.height; y++) {
							for (var x = 0; x < grid.width; x++) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var leftCellIndex = getLeftmostCell(grid, x, y);
									var rightTileIndex = getRightTile(grid, x, y);

									Movement.attemptMove(grid, "LEFT", x, y, leftCellIndex, y);
									var mergeScore = Movement.attemptMerge(grid, "LEFT", currentTile.x, y, rightTileIndex, y);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveRight: (function() {
				var getRightCell = function(grid, currentX, currentY) {
					return grid.tiles.reduce(function(right, row, index) {
						return (index >= currentX && !row[currentY]) ? index : right;
					}, currentX);
				};
				var getLeftTile = function(grid, currentX, currentY) {
					return grid.tiles.reduceRight(function(left, row, index) {
						// If we are right of the current tile, skip
						if (index >= currentX) { return undefined; }
						// If we do not yet have a left tile and we have found one, return it
						else if (!left && !!row[currentY]) { return index; }
						// Otherwise, keep passing the found left
						else { return left; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveRight(grid)) {
						var score = { score: 0 };

						for (var y = 0; y < grid.height; y++) {
							for (var x = (grid.width - 1); x >= 0; x--) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var rightCellIndex = getRightCell(grid, x, y);
									var leftTileIndex = getLeftTile(grid, x, y);

									Movement.attemptMove(grid, "RIGHT", x, y, rightCellIndex, y);
									var mergeScore = Movement.attemptMerge(grid, "RIGHT", currentTile.x, y, leftTileIndex, y);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),

			setupSlide: function(grid, direction, startX, startY, endX, endY) {
				var tile = grid.tiles[startX][startY];

				tile.sliding = { value: 0 };
				tile.triggerSlide = true;
				tile.slidingData = {
					direction: direction,
					startX: startX,
					startY: startY,
					endX: endX,
					endY: endY
				};
			},

			attemptMove: function(grid, direction, currentX, currentY, newX, newY) {
				if (isFinite(currentX) && isFinite(currentY) && isFinite(newX) && isFinite(newY)) {
					if (currentX !== newX || currentY !== newY) {
						var currentTile = grid.tiles[currentX][currentY];
						currentTile.x = newX;
						currentTile.y = newY;

						// Setup data needed for slide animation
						this.setupSlide(grid, direction, currentX, currentY, newX, newY);

						grid.tiles[newX][newY] = currentTile;
						grid.tiles[currentX][currentY] = undefined;

						return true;
					}
				}

				return false;
			},
			attemptMerge: function(grid, direction, currentX, currentY, neighborX, neighborY) {
				if (isFinite(currentX) && isFinite(currentY) && isFinite(neighborX) && isFinite(neighborY)) {
					if (grid.tiles[currentX][currentY].value === grid.tiles[neighborX][neighborY].value) {
						// Double the value of the current cell
						grid.tiles[currentX][currentY].value *= 2;
						// Set growth animation flag for merged tile
						grid.tiles[currentX][currentY].triggerGrowth = true;

						// Setup the merged cell for the slide animation
						this.setupSlide(grid, direction, neighborX, neighborY, currentX, currentY);
						grid.mergedTiles[neighborX][neighborY] = grid.tiles[neighborX][neighborY];
						// Erase the neighboring cell from the map
						grid.tiles[neighborX][neighborY] = undefined;

						return { score: grid.tiles[currentX][currentY].value };
					}
				}

				return false;
			}
		};

		// Public interface
		return {
			move: function(direction, grid) {
				return Movement.move(direction, grid);
			},
			canMove: function(direction, grid) {
				return Movement.canMove(direction, grid);
			}
		};
	})();

	var Game = (function() {
		var Game = {
			reset: function() {
				// tile: {value: 2, x: 0, y: 0} - Includes value and coordinates (redundant, but error correcting)
				var grid = {
					// column x row
					tiles: [],
					// Used for tiles that are merged but need to be animated
					mergedTiles: [],
					width: 4,
					height: 4,
					winningValue: 2048
				};

				// Fill the set of tiles as empty
				for (var x = 0; x < grid.width; x++) {
					grid.tiles[x] = [];
					grid.mergedTiles[x] = [];

					for (var y = 0; y < grid.height; y++) {
						grid.tiles[x][y] = undefined;
						grid.mergedTiles[x][y] = undefined;
					}
				}

				// Randomly generate and place two tiles to start
				var firstTile = randomTile(grid);
				grid.tiles[firstTile.x][firstTile.y] = firstTile;
				var secondTile = randomTile(grid);
				grid.tiles[secondTile.x][secondTile.y] = secondTile;

				return grid;
			},
			hasLost: function(grid) {
				return (!Movement.canMove("UP", grid) && !Movement.canMove("DOWN", grid) && !Movement.canMove("LEFT", grid) &&
					!Movement.canMove("RIGHT", grid));
			},
			hasWon: function(grid) {
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y] && grid.tiles[x][y].value === grid.winningValue) {
							return true;
						}
					}
				}

				return false;
			}
		};

		return {
			reset: function() {
				return Game.reset();
			},
			hasLost: function(grid) {
				return Game.hasLost(grid);
			},
			hasWon: function(grid) {
				return Game.hasWon(grid);
			}
		};
	})();




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
	};

	var randomTile = function(grid) {
		var emptyCells = getEmptyCells(grid);
		var keys = [];
		//noinspection JSHint
		for (var key in emptyCells) {
			//noinspection JSUnfilteredForInLoop
			keys.push(key);
		}

		// First-level index represents the actual grid-row
		var row = keys[Math.floor(Math.random() * keys.length)];
		// Values of inner-array are available columns
		var column = Math.floor(Math.random() * emptyCells[row].length);

		return {
			// Allow 2 or 4 as a starting value, to spice things up
			value: Math.ceil(Math.random() * 2) * 2,
			// Starting random coordinates within the grid
			x: row,
			y: emptyCells[row][column],
			triggerGrowth: true,
			growing: {
				modifier: "GROW",
				value: -25,
				maxSize: 0,
				minSize: 0
			}
		};
	};





	window.Application = (function() {
		// Canvases and the assosciated 2D contexts
		var gameCanvas, gameContext, scoreCanvas, scoreContext;
		// Setup DOM with canvases
		(function() {
			// Get the available size for a square canvas
			var scoreCanvasHeight = 100 / Metrics.getPixelRatio();
			var size = Metrics.getSize();
			size = ((Metrics.getHeight() - scoreCanvasHeight) <= Metrics.getWidth()) ? (Metrics.getHeight() - scoreCanvasHeight) : size;

			// Get the score canvas ready
			scoreCanvas = Metrics.createCanvas(size, scoreCanvasHeight);
			scoreContext = scoreCanvas.getContext("2d");

			// Get the main canvas ready
			gameCanvas = Metrics.createCanvas(size, size);
			gameContext = gameCanvas.getContext("2d");

			// Append the canvases to the DOM
			var body = document.getElementById("body");
			body.appendChild(scoreCanvas);
			body.appendChild(gameCanvas);
		})();

		// Initialize application data
		var game = {
			grid: Game.reset(),
			data: {
				// Keep track of the current score
				score: 0,
				// Keep track of the top score
				topScore: 0,
				// Determine if we need a random tile on the next input
				insertTile: false,
				// Determine if we are allowed to attach the reset game click handlers
				allowResetCallback: true
			}
		};

		// Callback to reset the game data
		var resetCallback = function() {
			game.data.score = 0;
			game.data.allowResetCallback = true;
			game.data.insertTile = false;
			game.grid = Game.reset();
		};

		// List of callbacks to be executed when the game finishes
		var gameFinishedCallbacks = [];

		// Setup the render loop
		(function mainLoop() {
			// Handle calculations for animations
			var blockInput = Animation.animate(gameCanvas, gameContext, game.grid);

			// Draw the game screen
			Renderer.render(gameCanvas, gameContext, game.grid);
			// Draw the scores
			Renderer.renderScores(scoreCanvas, scoreContext, game.data.score, game.data.topScore);

			// Check if we should continue playing
			var hasWon = Game.hasWon(game.grid);
			var hasLost = Game.hasLost(game.grid);
			if (hasWon || hasLost) {
				if (game.data.allowResetCallback) {
					// Allow user to restart
					Input.resetClick(resetCallback);

					// Execute all callbacks, passing in the top score
					for (var i = 0; i < gameFinishedCallbacks.length; i++) {
						var callback = gameFinishedCallbacks[i];
						callback.callback.call(callback.context, game.data.topScore);
					}

					game.data.allowResetCallback = false;
				}

				if (hasWon) {
					// Draw the game won screen
					Renderer.showGameWon(gameCanvas, gameContext);
				} else {
					// Draw game over screen
					Renderer.showGameOver(gameCanvas, gameContext);
				}
			} else {
				// Handle the user input
				if (!blockInput) {
					// Insert a new random tile if needed
					if (game.data.insertTile) {
						game.data.insertTile = false;
						var tile = randomTile(game.grid);
						game.grid.tiles[tile.x][tile.y] = tile;
					} else {
						// Allow the user to move tiles
						var score = Movement.move(Input.getCommand(), game.grid);
						if (!!score) {
							// Update the score
							game.data.score += score.score;
							// If we've moved successfully, set a new tile for insertion
							game.data.insertTile = true;

							// Update the top score to the appropriate final score
							if (game.data.score > game.data.topScore) {
								game.data.topScore = game.data.score;
							}
						}
					}
				}
			}

			// Continue running the main loop
			setTimeout(mainLoop, 25);
		})();

		var Application = {
			restart: function() {
				resetCallback();
			},
			save: function() {
				return JSON.stringify(game);
			},
			resume: function(state) {
				game = JSON.parse(state);
			},
			onGameFinished: function(callback, context) {
				gameFinishedCallbacks.push({ callback: callback, context: context });
			}
		};

		// Public interface
		return {
			restart: function() {
				return Application.restart();
			},
			save: function() {
				return Application.save();
			},
			resume: function(state) {
				return Application.resume(state);
			},
			onGameFinished: function(callback, context) {
				return Application.onGameFinished(callback, context);
			}
		};
	})();
})();

