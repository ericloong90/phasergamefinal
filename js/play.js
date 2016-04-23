var playState = {

	// Define all of the functions in the state

	// Preload function is removed

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc

		// Removed background color and physics system

		this.cursor = game.input.keyboard.createCursorKeys();

		// The 4 arrow keys will be directly captured by Phaser, not the browser
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

		// This includes WASD keys to be captured later
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		}

		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');

		this.coin = game.add.sprite(60, 140, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);

		this.scoreLabel = game.add.text(30, 30, 'score: 0', {font: '18px Arial', fill: '#ffffff'});

		game.global.score = 0;

		this.createWorld();

		// Contains the time of the next enemy creation
		this.nextEnemy = 0;

		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');

		this.gameMusic = game.add.audio('gameMusic');
		this.gameMusic.loop = true;
		this.gameMusic.play();

		// Create the 'right' animation by looping frames 1 and 2
		this.player.animations.add('right', [1, 2], 8, true);

		// Create the 'left' animation by looping frames 3 and 4
		this.player.animations.add('left', [3, 4], 8, true);

		// Create the emitter with 15 particles. We don't need to set the x and y
		// since we don't know where to set the explosions yet
		this.emitter = game.add.emitter(0, 0, 15);

		// Set the pixel image for the particles
		this.emitter.makeParticles('pixel');

		// Set the y-speed of the particles between -150 to 150
		// The speed will be randomly set to values between -150 to 150 for each particle
		this.emitter.setYSpeed(-150, 150);

		// Do the same for x-speed
		this.emitter.setXSpeed(-150, 150);

		// Use no gravity for the particles
		this.emitter.gravity = 0;

		// Scale the particles
		this.emitter.minParticleScale = 0.2;
		this.emitter.maxParticleScale = 0.7;

		// Rotate the particles
		this.emitter.minRotation = 10;
		this.emitter.maxRotation = 100;

	},

	update: function () {
		// This function is called 60 times per second
		// It contains the game logic

		// Add collision physics to the game
		game.physics.arcade.collide(this.player, this.walls);
		game.physics.arcade.collide(this.enemies, this.walls);

		this.movePlayer();
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		// Call the playerDie when player and enemy overlaps
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		if (!this.player.inWorld) {
			this.playerDie();
		}

		// If the 'nextEnemy' time has passed
		if (this.nextEnemy < game.time.now) {
			// We add a new enemy
			var start = 4000, end = 1000, score = 100;

			// Formula to decrease the delay between enemies over time
			// At first it's 4000ms, then slowly goes to 1000ms
			var delay = Math.max(start - (start - end) * game.global.score / score, end);

			// Create a new enemy, and update the 'nextEnemy' time
			this.addEnemy();
			this.nextEnemy = game.time.now + delay;
		}
	},

	// And maybe some other functions too

	takeCoin: function () {
		game.global.score += 5;
		this.scoreLabel.text = 'score: ' + game.global.score;

		// Coin position is updated first, which means, coin is already somewhere else before any following
		// functions are executed
		this.updateCoinPosition();
		this.coinSound.play();

		// Scale the coin to 0 to make it invisible
		this.coin.scale.setTo(0, 0);

		// Grow the coin back to original scale in 300 ms
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

		// Grow the player slightly whenever it takes a coin
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
	},

	playerDie: function () {
		// If the player is already dead, do nothing
		// This part ensures that the function is only run once when the player dies
		if (!this.player.alive) {
			return;
		};

		// This means, the rest of the function will only run once when the player dies

		this.player.kill(); // Removes player from the game

		this.deadSound.play();
		this.gameMusic.stop();

		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;

		// Start the emitter, by exploding 15 particles	that will live for 600ms
		this.emitter.start(true, 600, null, 15);

		// Start the menu state 1000ms later after the end of particle animation
		game.time.events.add(1000, this.startMenu, this);
	},

	startMenu: function () {
		game.state.start('menu');
	},

	movePlayer: function () {
		// if the left arrow key is pressed
		if (this.cursor.left.isDown || this.wasd.left.isDown) {
			// Move player to the left
			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
		}

		// if the right arrow key is pressed
		else if (this.cursor.right.isDown || this.wasd.right.isDown) {
			// Move player to the right
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
		}

		else {
			this.player.body.velocity.x = 0;
			this.player.frame = 0;
		}

		// if the up arrow key is pressed and the player is touching the ground
		if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down) {
			// Move the player upward/jump
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
	},

	updateCoinPosition: function () {
		// Store all the possible coin positions in an array
		var coinPosition = [{x: 140, y: 60}, {x: 360, y: 60},	// Top row
												{x: 60, y: 140}, {x: 440, y: 140},	// 2nd row
												{x: 130, y: 300}, {x: 370, y: 300}];	// 3rd row

		// Remove the current coin position from the array
		// Otherwise the coin could appear at the same spot twice in a row
		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1); // Go to position i, and remove one item
			}
		}

		// Randomly select a position from the array
		var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

		// Set the new position of the coin
		this.coin.reset(newPosition.x, newPosition.y);
	},

	createWorld: function() {

		// Create a new group
		this.walls = game.add.group();

		// Add arcade physics to the whole group
		this.walls.enableBody = true;

		// Create two walls in the group
		game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left wall
		game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right wall

		game.add.sprite(0, 0, 'wallH', 0, this.walls);
		game.add.sprite(300, 0, 'wallH', 0, this.walls);
		game.add.sprite(0, 320, 'wallH', 0, this.walls);
		game.add.sprite(320, 320, 'wallH', 0, this.walls);

		game.add.sprite(-100, 160, 'wallH', 0, this.walls);
		game.add.sprite(400, 160, 'wallH', 0, this.walls);

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);

		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		// Set all the walls to be immovable
		this.walls.setAll('body.immovable', true);
		
	},

	addEnemy: function () {
		// Get the first dead enemy of the group
		var enemy = this.enemies.getFirstDead();

		// If there isn't any dead enemy, do nothing
		if (!enemy) {
			return;
		}

		// Initialise the enemy
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.world.centerX, 0);
		enemy.body.gravity.y = 500;

		var myRDG = new Phaser.RandomDataGenerator([Math.random()]); // A seed is passed into the RDG, producing random outputs

		var mySign = myRDG.sign();
		enemy.body.velocity.x = 100 * mySign; // Self customization here
		// Previous line is modified to achieve the same desired effect, getting 100 or -100
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	}

};