var playState = {

	// Define all of the functions in the state

	// Preload function is removed

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc

		// Removed background color and physics system

		this.cursor = game.input.keyboard.createCursorKeys();

		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		this.enemies.game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');

		this.coin = game.add.sprite(60, 140, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);

		this.scoreLabel = game.add.text(30, 30, 'score: 0', {font: '18px Arial', fill: '#ffffff'});

		game.global.score = 0;

		this.createWorld();

		game.time.events.loop(2200, this.addEnemy, this);

	},

	// And maybe some other functions too

	takeCoin: function () {
		game.global.score += 5;
		this.scoreLabel.text = 'score: ' + game.global.score;

		this.updateCoinPosition();
	},

	playerDie: function () {
		game.state.start('menu');
	}

};