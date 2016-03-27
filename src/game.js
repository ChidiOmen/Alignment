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
		Crafty.background('white');
		Crafty.sprite(32, 32, "assets/henry4.png", {henry:[0,0]}, 0, 0, 0);
		//Crafty.background('url(assets/dhbg.png) width:100%');

		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
					y == 0 || y == Game.map_grid.height - 1;

				var taken = (x == 5 && y == 5) || (x == 10 && y == 10) || 
				y == 6 || y == 8 || y == 10;

				if (at_edge) {
					// Place a tree entity at the current tile
					Crafty.e('Tree').at(x, y);
				} else if (Math.random() < 0.3 && !taken) {
					// Place a bush entity at the current tile
					Crafty.e('Bush').at(x, y);
				}
			}
		}

		for (var i = 1; i < 24; i++) {
			if (i % 4 != 0) {
				Crafty.e('Pushable').at(i, 8);
			}
		}
		for (var i = 0; i < 6; i++) {
			Crafty.e('Pushable').at(i*4, 6+4*Crafty.math.randomInt(0,1));
		}
		Crafty.e('PlayerCharacter, henry').at(5,5);

	}
};