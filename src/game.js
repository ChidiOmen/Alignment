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

	map: null,

	history: null,

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

	printMap : function() {
		var str = '';
		for (var y = 0; y < Game.map_grid.height; y++) {
			str = '';
			for (var x = 0; x < Game.map_grid.width; x++) {
				str += '' + Game.map[x][y] + ' ';
			}
			Crafty.log(str);
		}
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('white');
		Crafty.sprite(32, 32, "assets/henry4.png", {henry:[0,0]}, 0, 0, 0);
		//Crafty.background('url(assets/dhbg.png) width:100%');
		Game.map = new Array(Game.map_grid.width);
		Game.hist_stack = new Array();

		for (var x = 0; x < Game.map_grid.width; x++) {
			Game.map[x] = new Array(Game.map_grid.height);
			for (var y = 0; y < Game.map_grid.height; y++) {
				var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
					y == 0 || y == Game.map_grid.height - 1;

				var taken = (x == 5 && y == 5) || (x == 10 && y == 10) || 
				y == 6 || y == 8 || y == 10;

				if (at_edge) {
					// Place a tree entity at the current tile
					Game.map[x][y] = 'solid';
				} else if (Math.random() < 0.3 && !taken) {
					// Place a bush entity at the current tile
					Game.map[x][y] = 'solid';
				}
				else {
					Game.map[x][y] = 'empty';
				}
			}
		}

		for (var i = 1; i < 23; i++) {
			if (i % 4 != 0) {
				Game.map[i][8] = 'pushable';
			}
		}
		for (var i = 1; i < 6; i++) {
			var x = i*4;
			var y = 6+4*Crafty.math.randomInt(0,1);
			Game.map[x][y] = 'pushable';
		}
		Game.map[5][5] = 'henry';

		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				switch (Game.map[x][y]) {
					case 'henry':
						Crafty.e('PlayerCharacter, henry').at(x, y);
						break;
					case 'pushable':
						Crafty.e('Pushable').at(x, y);
						break;
					case 'solid':
						var bush = Crafty.e('Bush');
						bush.at(x, y);
						break;
					default:
						break;
				}
			}
		}

		//Game.printMap();

	},
};