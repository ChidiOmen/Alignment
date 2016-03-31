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
		this.last_move = 'down';
		this.hitting = false;
		this.requires('Actor, Color, Collision');
		this.color('rgb(220, 205, 40)');
		this.checkHits('PlayerCharacter');
		this.bind('HitOn', function(data) {
			var henry = data[0].obj;
			Crafty.log(henry.last_move);
			switch (henry.last_move) {
				case 'up':
					this.y -= Game.map_grid.tile.height;
					break;
				case 'down':
					this.y += Game.map_grid.tile.height;
					break;
				case 'left':
					this.x -= Game.map_grid.tile.width;
					break;
				case 'right':
					this.x += Game.map_grid.tile.width;
					break;
			}
		});
		//this.onHit('PlayerCharacter', this.push_back_block);
	},

	stopMove : function(block) {
		this.hitting = true;
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

	push_back_block : function(henry) {
		Crafty.log(henry.last_move);
		switch(henry.last_move) {
			case 'up':
				this.y-= Game.map_grid.tile.height;
				break;
			case 'down':
				this.y+= Game.map_grid.tile.height;
				break;
			case 'left':
				this.x-= Game.map_grid.tile.width;
				break;
			case 'right':
				this.x+= Game.map_grid.tile.width;
				break;
		}
	},
});

Crafty.c('PlayerCharacter', {
	init: function() {
		this.last_move = 'up';
		this.requires('Actor, Color, Collision');
		this.color('white');
		this.bind('KeyDown', function(e) {
			var grid_x = this.x / Game.map_grid.tile.width;
			var grid_y = this.y / Game.map_grid.tile.height;

			if (e.key == Crafty.keys.DOWN_ARROW || e.key == Crafty.keys.S) {
				Crafty.log(Game.map[grid_x]);
				if (Game.map[grid_x][grid_y + 1] == 'empty') {
					this.y += Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y + 1] = 'henry';
				} else if (Game.map[grid_x][grid_y + 1] == 'pushable' &&
					Game.map[grid_x][grid_y + 2] == 'empty') {
					this.y += Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y + 1] = 'henry';
					Game.map[grid_x][grid_y + 2] = 'pushable';
				}
				this.last_move = 'down';
			}
			if (e.key == Crafty.keys.UP_ARROW || e.key == Crafty.keys.W) {
				if (Game.map[grid_x][grid_y - 1] == 'empty') {
					this.y -= Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y - 1] = 'henry';					
				} else if (Game.map[grid_x][grid_y - 1] == 'pushable' &&
					Game.map[grid_x][grid_y - 2] == 'empty') {
					this.y -= Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y - 1] = 'henry';
					Game.map[grid_x][grid_y - 2] = 'pushable';
				}
				this.last_move = 'up';
			}
			if (e.key == Crafty.keys.RIGHT_ARROW || e.key == Crafty.keys.D) {
				if (Game.map[grid_x + 1][grid_y] == 'empty') {
					this.x += Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x + 1][grid_y] = 'henry';						
				} else if (Game.map[grid_x + 1][grid_y] == 'pushable' &&
					Game.map[grid_x + 2][grid_y] == 'empty') {
					this.x += Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x + 1][grid_y] = 'henry';
					Game.map[grid_x + 2][grid_y] = 'pushable';
				}
				this.last_move = 'right';
			}
			if (e.key == Crafty.keys.LEFT_ARROW || e.key == Crafty.keys.A) {
				if (Game.map[grid_x - 1][grid_y] == 'empty') {
					this.x -= Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x - 1][grid_y] = 'henry';	
				} else if (Game.map[grid_x - 1][grid_y] == 'pushable' &&
					Game.map[grid_x - 2][grid_y] == 'empty') {
					this.x -= Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x - 1][grid_y] = 'henry';
					Game.map[grid_x - 2][grid_y] = 'pushable';
				}
				this.last_move = 'left';
			}
		});
		//this.onHit('Solid', this.stopMove);
		//this.onHit('Pushable', this.push_back);

		//this.checkHits('Solid, Pushable');
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

	push_back : function(data) {
		Crafty.log('Yeah, I just collided with a pushable.');
		Crafty.log('Did I hit a pushable? : ' + this.hit('Pushable'));
		var pushed = data[0].obj;
		pushed.last_move = this.last_move;
		switch (this.last_move) {
			case 'up':
				Crafty.log(pushed.y);
				pushed.y -= Game.map_grid.tile.height;
				Crafty.log(pushed.y);
				Crafty.log(pushed.push_back_block());
				if (pushed.push_back_block()) {
					Crafty.log('I\'m in');
					pushed.y += Game.map_grid.tile.height;
					this.y += Game.map_grid.tile.height;
				}
				break;
			case 'down':
				pushed.y += Game.map_grid.tile.height;
				if (pushed.hit('Solid, Pushable')) {
					Crafty.log('I\'m in');					
					pushed.y -= Game.map_grid.tile.height;
					this.y -= Game.map_grid.tile.height;
				}
				break;
			case 'left':
				pushed.x -= Game.map_grid.tile.height;
				if (pushed.hit('Solid, Pushable')) {
					Crafty.log('I\'m in');					
					pushed.x += Game.map_grid.tile.height;
					this.x += Game.map_grid.tile.height;
				}
				break;
			case 'right':
				pushed.x += Game.map_grid.tile.height;
				if (pushed.hit('Solid, Pushable')) {
					Crafty.log('I\'m in');					
					pushed.x -= Game.map_grid.tile.height;
					this.x -= Game.map_grid.tile.height;
				}
				break;
		}
	},
});