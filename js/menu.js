var menuState = {

	// Define all of the functions in the state

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc

		// Add a background image
		game.add.image(0, 0, 'background');

		// Display the name of the game
		var nameLabel = game.add.text(game.world.centerX, 80, 'Super Coin Box', {font: '50px Arial', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5, 0.5);

		// Show the score at the center of the screen
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score,
			{font: '25px Arial', fill: '#ffffff'});
		scoreLabel.anchor.setTo(0.5, 0.5);

		// Explain on how to start the game
		var startLabel = game.add.text(game.world.centerX, game.world.height - 80, 'Press the up arrow key to start',
			{font: '25px Arial', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5, 0.5);

		// Create a new Phaser keyboard variable: the up arrow key
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		// When the 'up' key is pressed, it will call the start function once
		upKey.onDown.addOnce(this.start, this);

	},

	// And maybe some other functions too

	start: function () {
		// Start the actual game
		game.state.start('play');
	}

};