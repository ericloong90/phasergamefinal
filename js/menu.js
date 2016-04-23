var menuState = {

	// Define all of the functions in the state

	create: function () {
		// This function is called after the preload function
		// Here we set up the game, sprites, etc

		// Add a background image
		game.add.image(0, 0, 'background');

		// Add the mute button that calls the 'toggleSound' function when pressed
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		// If the mouse is over the button, it becomes a hand cursor
		this.muteButton.input.useHandCursor = true;

		// If the sound is already muted
		if (game.sound.mute) {
			// Change the frame to display the speaker without sound
			this.muteButton.frame = 1;
		}

		// Display the name of the game
		var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box', {font: '70px Geo', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5, 0.5);

		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();

		// If 'bestScore' is not defined
		// It means that this is the first time the game is played
		if (!localStorage.getItem('bestScore')) {
			// Then set the bestScore to 0
			localStorage.setItem('bestScore', 0);
		}

		// If the score is higher than the best score
		if (game.global.score > localStorage.getItem('bestScore')) {
			// Then update the bestScore
			localStorage.setItem('bestScore', game.global.score);
		}

		var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');

		// Show the score at the center of the screen
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
			{font: '25px Geo', fill: '#ffffff', align: 'center'});
		scoreLabel.anchor.setTo(0.5, 0.5);

		// Explain on how to start the game
		var startLabel = game.add.text(game.world.centerX, game.world.height - 80, 'Press the up arrow key to start',
			{font: '25px Geo', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5, 0.5);

		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();

		// Create a new Phaser keyboard variable: the up arrow key
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		// When the 'up' key is pressed, it will call the start function once
		upKey.onDown.addOnce(this.start, this);

		this.menuMusic = game.add.audio('menuMusic');
		this.menuMusic.loop = true;
		this.menuMusic.play();

	},

	// And maybe some other functions too

	start: function () {

		this.menuMusic.stop();
		// Start the actual game
		game.state.start('play');

	},

	toggleSound: function () {
		// Switch the Phaser sound variable from true to false, or false to true
		// When 'game.sound.mute = true', Phaser will mute the game
		game.sound.mute = !game.sound.mute;

		this.muteButton.frame = game.sound.mute ? 1 : 0;
	}

};