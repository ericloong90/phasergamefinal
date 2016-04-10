var bootState = {

	// Define all of the functions in the state

	preload: function () {
		// This function will be executed in the beginning
		// That's where we load all of our game assets

		// Load the image
		game.add.image('progressBar', 'assets/progressBar.png');

	},

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Start the load state
		game.state.start('load');

	}

	// And maybe some other functions too

};