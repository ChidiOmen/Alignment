Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
		this.bind('EnterFrame', function() {
			grid_x = this.x / Game.map_grid.tile.width;
			grid_y = this.y / Game.map_grid.tile.height;

			switch (Game.map[grid_x][grid_y]) {
				case 'henry':
					this.color('blue');
					break;
				case 'bush':
					this.color('green');
					break;
				case 'pushable':
					this.color('yellow');
					break;
				case 'empty':
					this.color('white');
					break;
				case 'undo':
					this.color('orange');
					break;
				case 'undo_to':
					this.color('red');
					break;
			}
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

Crafty.c('Endpoint', {
	init: function() {
		this.requires('Actor, Color, Solid');
		this.color('blue');
	}
});

Crafty.c('Pushable', {
	init: function() {
		this.last_move = 'down';
		this.hitting = false;
		this.requires('Actor, Color, Collision');
		this.color('rgb(220, 205, 40)');
		this.checkHits('PlayerCharacter');
		this.bind('Undo', function() {
			Crafty.log('Catch trigger!');
			var grid_x = this.x / Game.map_grid.tile.width;
			var grid_y = this.y / Game.map_grid.tile.height;

			if (Game.map[grid_x][grid_y] == 'undo') {
				if (Game.map[grid_x + 1][grid_y] == 'undo_to') {
					this.x += Game.map_grid.tile.width;
					Game.map[grid_x + 1][grid_y] = 'pushable';
					Crafty.log('Fix undo to');
				}
				if (Game.map[grid_x - 1][grid_y] == 'undo_to') {
					this.x -= Game.map_grid.tile.width;
					Game.map[grid_x - 1][grid_y] = 'pushable';
					Crafty.log('Fix undo to');
				}
				if (Game.map[grid_x][grid_y + 1] == 'undo_to') {
					this.y += Game.map_grid.tile.height;
					Game.map[grid_x][grid_y + 1] = 'pushable';
					Crafty.log('Fix undo to');
				}
				if (Game.map[grid_x][grid_y - 1] == 'undo_to') {
					this.y -= Game.map_grid.tile.height;
					Game.map[grid_x][grid_y - 1] = 'pushable';
					Crafty.log('Fix undo to');
				}
				Game.map[grid_x][grid_y] = 'empty';
			}
		});
		this.bind('HitOn', function(data) {
			var henry = data[0].obj;
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
				if (Game.map[grid_x][grid_y + 1] == 'empty') {
					this.y += Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y + 1] = 'henry';
					Game.hist_stack.push({ 'type' : 'move', 'dir' : 'down'});
				} else if (Game.map[grid_x][grid_y + 1] == 'pushable' &&
					Game.map[grid_x][grid_y + 2] == 'empty') {
					this.y += Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y + 1] = 'henry';
					Game.map[grid_x][grid_y + 2] = 'pushable';
					Game.hist_stack.push({ 'type' : 'push', 'dir' : 'down'});
				}
				this.last_move = 'down';
			}
			if (e.key == Crafty.keys.UP_ARROW || e.key == Crafty.keys.W) {
				if (Game.map[grid_x][grid_y - 1] == 'empty') {
					this.y -= Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y - 1] = 'henry';
					Game.hist_stack.push({ 'type' : 'move', 'dir' : 'up'});
				} else if (Game.map[grid_x][grid_y - 1] == 'pushable' &&
					Game.map[grid_x][grid_y - 2] == 'empty') {
					this.y -= Game.map_grid.tile.height;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x][grid_y - 1] = 'henry';
					Game.map[grid_x][grid_y - 2] = 'pushable';
					Game.hist_stack.push({ 'type' : 'push', 'dir' : 'up'});
				}
				this.last_move = 'up';
			}
			if (e.key == Crafty.keys.RIGHT_ARROW || e.key == Crafty.keys.D) {
				if (Game.map[grid_x + 1][grid_y] == 'empty') {
					this.x += Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x + 1][grid_y] = 'henry';
					Game.hist_stack.push({ 'type' : 'move', 'dir' : 'right'});					
				} else if (Game.map[grid_x + 1][grid_y] == 'pushable' &&
					Game.map[grid_x + 2][grid_y] == 'empty') {
					this.x += Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x + 1][grid_y] = 'henry';
					Game.map[grid_x + 2][grid_y] = 'pushable';
					Game.hist_stack.push({ 'type' : 'push', 'dir' : 'right'});
				}
				this.last_move = 'right';
			}
			if (e.key == Crafty.keys.LEFT_ARROW || e.key == Crafty.keys.A) {
				if (Game.map[grid_x - 1][grid_y] == 'empty') {
					this.x -= Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x - 1][grid_y] = 'henry';
					Game.hist_stack.push({ 'type' : 'move', 'dir' : 'left'});
				} else if (Game.map[grid_x - 1][grid_y] == 'pushable' &&
					Game.map[grid_x - 2][grid_y] == 'empty') {
					this.x -= Game.map_grid.tile.width;
					Game.map[grid_x][grid_y] = 'empty';
					Game.map[grid_x - 1][grid_y] = 'henry';
					Game.map[grid_x - 2][grid_y] = 'pushable';
					Game.hist_stack.push({ 'type' : 'push', 'dir' : 'left'});
				}
				this.last_move = 'left';
			}
			if (e.key == Crafty.keys.Z) {
				var undo = Game.hist_stack.pop();
				if (undo != undefined) {
					var new_pos;
					switch (undo.dir) {
						case 'up' :
							new_pos = { 'x' : 0, 'y' : 1};
							break;
						case 'down' :
							new_pos = { 'x' : 0, 'y' : -1};
							break;
						case 'left' :
							new_pos = { 'x' : 1, 'y' : 0};
							break;
						case 'right' :
							new_pos = { 'x' : -1, 'y' : 0};
							break;
					}

					if (undo.type == 'move') {
						Game.map[grid_x][grid_y] = 'empty';
						Game.map[grid_x + new_pos.x][grid_y + new_pos.y] = 'henry';
						this.x += new_pos.x * Game.map_grid.tile.width;
						this.y += new_pos.y * Game.map_grid.tile.height;

					} else if (undo.type == 'push') {
						Game.map[grid_x + new_pos.x][grid_y + new_pos.y] = 'henry';
						this.x += new_pos.x * Game.map_grid.tile.width;
						this.y += new_pos.y * Game.map_grid.tile.height;
						Game.map[grid_x][grid_y] = 'undo_to';
						Crafty.log('Set undo to');
						Game.map[grid_x - new_pos.x][grid_y - new_pos.y] = 'undo';
						Crafty.trigger('Undo');
					}
				}
			}
		});
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
		var pushed = data[0].obj;
		pushed.last_move = this.last_move;
		switch (this.last_move) {
			case 'up':
				pushed.y -= Game.map_grid.tile.height;
				if (pushed.push_back_block()) {
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
	},
});