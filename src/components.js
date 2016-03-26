Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},

	at: function(x, y) {
		if (x != undefined && y != undefined) {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
		}
	}
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color, Solid');
		this.color('rgb(20, 125, 40)');
	},
});

Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Color, Solid');
		this.color('rgb(20, 185, 40)');
	},
});

Crafty.c('Pushable', {
	init: function() {
		this.requires('Actor, Color, Collision');
		this.color('red');
		this.checkHits('PlayerCharacter');
	},
});

Crafty.c('PlayerCharacter', {
	init: function() {
		this.last_move = 'up';
		this.requires('Actor, Color, Collision');
		this.color('rgb(20, 75, 40)');
		this.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.DOWN_ARROW || e.key == Crafty.keys.S) {
				this.last_move = 'down';
				this.y += Game.map_grid.tile.height;
			}
			if (e.key == Crafty.keys.UP_ARROW || e.key == Crafty.keys.W) {
				this.last_move = 'up';
				this.y -= Game.map_grid.tile.height;
			}
			if (e.key == Crafty.keys.LEFT_ARROW || e.key == Crafty.keys.A) {
				this.last_move = 'left';
				this.x -= Game.map_grid.tile.width;
			}
			if (e.key == Crafty.keys.RIGHT_ARROW || e.key == Crafty.keys.D) {
				this.last_move = 'right';
				this.x += Game.map_grid.tile.width;
			}
		});
		this.onHit('Solid', this.stopMove);
		this.onHit('Pushable', this.push);
		this.checkHits('Solid, Pushable');
		/*this.bind('HitOn', function (hitData) {
			Crafty.log(hitData[0][0]);
			if (hitData[0].id == 'Solid') {
				switch (this.last_move) {
					case 'up':
						this.y += Game.map_grid.tile.height;
						break;
					case 'down':
						this.y -= Game.map_grid.tile.height;
						break;
					case 'left':
						this.x += Game.map_grid.tile.width;
						break;
					case 'right':
						this.x -= Game.map_grid.tile.width;
						break;
				}
			} else if (hitData[0].id == 'Pushable') {
				var pushed = hitData[0];
				switch (this.last_move) {
					case 'up':
						pushed.y -= Game.map_grid.tile.height;
						if (pushed.hit('Solid, Pushable')) {
							pushed.y += Game.map_grid.tile.height;
							this.y += Game.map_grid.tile.height;
						}
						break;
					case 'down':
						pushed.y += Game.map_grid.tile.height;
						if (pushed.hit('Solid, Pushable')) {
							pushed.y -= Game.map_grid.tile.height;
							this.y -= Game.map_grid.tile.height;
						}
						break;
					case 'left':
						pushed.x -= Game.map_grid.tile.height;
						if (pushed.hit('Solid, Pushable')) {
							pushed.x += Game.map_grid.tile.height;
							this.x += Game.map_grid.tile.height;
						}
						break;
					case 'right':
						pushed.x += Game.map_grid.tile.height;
						if (pushed.hit('Solid, Pushable')) {
							pushed.x -= Game.map_grid.tile.height;
							this.x -= Game.map_grid.tile.height;
						}
						break;
				}

			}
		});*/
	},

	stopMove : function(block) {
		switch (this.last_move) {
			case 'up':
				this.y += Game.map_grid.tile.height;
				break;
			case 'down':
				this.y -= Game.map_grid.tile.height;
				break;
			case 'left':
				this.x += Game.map_grid.tile.width;
				break;
			case 'right':
				this.x -= Game.map_grid.tile.width;
				break;
		}		
	},

	push : function(data) {
		var pushed = data[0].obj;
		switch (this.last_move) {
			case 'up':
				pushed.y -= Game.map_grid.tile.height;
				break;
			case 'down':
				pushed.y += Game.map_grid.tile.height;
				break;
			case 'left':
				pushed.x -= Game.map_grid.tile.width;
				break;
			case 'right':
				pushed.x += Game.map_grid.tile.width;
				break;
		}
	}
});