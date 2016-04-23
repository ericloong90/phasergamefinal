var loadState = {

	// Define all of the functions in the state

	preload: function () {
		// This function will be executed in the beginning
		// That's where we load all of our game assets

		// Add a 'loading ...' label to the screen
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading ...', { font: '30px Arial', fill: '#ffffff'});
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Display the loading bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Load all our assets
		game.load.spritesheet('player', 'assets/player2.png', 20, 20);
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
		game.load.image('enemy', 'assets/enemy.png');
		game.load.image('coin', 'assets/coin.png');
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		game.load.image('pixel', 'assets/pixel.png');

		// Load a new asset that we will use in the menu state
		game.load.image('background', 'assets/background.png');

		// Sound when the player jumps
		game.load.audio('jump', ['assets/jump.mp3', 'assets/jump.ogg']);

		// Sound when the player takes a coin
		game.load.audio('coin', ['assets/coin.mp3', 'assets/coin.ogg']);

		// Sound when the player dies
		game.load.audio('dead', ['assets/dead.mp3', 'assets/dead.ogg']);

		// Load the music in 2 different formats
		game.load.audio('menuMusic', 'assets/101-title.mp3');
		game.load.audio('gameMusic', 'assets/108-theme-of-prontera.mp3');
	},

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc

		// Go to the menu state
		game.state.start('menu');

	}

	// And maybe some other functions too

};