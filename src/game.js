Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  24,
		height: 16,
		tile: {
			width:  32,
			height: 32
		}
	},

	number: 1,

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(249, 223, 125');

		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
					y == 0 || y == Game.map_grid.height - 1;

				if (at_edge) {
					// Place a tree entity at the current tile
					Crafty.e('Tree').at(x, y);
				} else if (Math.random() < 0.06) {
					// Place a bush entity at the current tile
					Crafty.e('Bush').at(x, y);
				}
			}
		}
		var square = Crafty.e('2D, Canvas, Color')
			.attr({x: 0, y: 0, 
				w: Game.map_grid.tile.width, h: Game.map_grid.tile.height})
			.color('red')
			.bind("EnterFrame", function(eventData) {
				// Move to the right by 10 pixels per second
				this.x = this.x + Game.number * (eventData.dt / 100);
			})
			.bind('KeyDown', function(e) {
				if (e.key == Crafty.keys.DOWN_ARROW) {
					this.y += Game.map_grid.tile.height;
				}
				if (e.key == Crafty.keys.UP_ARROW) {
					this.y -= Game.map_grid.tile.height;
				}
				if (e.key == Crafty.keys.LEFT_ARROW) {
					this.x -= Game.map_grid.tile.width;
				}
				if (e.key == Crafty.keys.RIGHT_ARROW) {
					this.x += Game.map_grid.tile.width;
				}
			})

	}
};