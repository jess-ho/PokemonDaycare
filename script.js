// Cross-browser document ready function in vanilla JS
// https://www.competa.com/blog/cross-browser-document-ready-with-vanilla-javascript/#targetText=Cross%2Dbrowser%20Document%20Ready%20with%20Vanilla%20JavaScript&targetText=In%20jQuery%2C%20developers%20are%20used,stuff%20is%20on%20your%20page.
var domIsReady = (domIsReady => {
	const isBrowserIeOrNot = function() {
		return !document.attachEvent || typeof document.attachEvent === "undefined"
			? "not-ie"
			: "ie";
	};

	domIsReady = callback => {
		if (callback && typeof callback === "function") {
			if (isBrowserIeOrNot() !== "ie") {
				document.addEventListener("DOMContentLoaded", () => {
				return callback();
			});
			} else {
				document.attachEvent("onreadystatechange", () => {
					if (document.readyState === "complete") {
						return callback();
					}
				});
			}
		} else {
			console.error("The callback is not a function!");
		}
	};

	return domIsReady;
})(domIsReady || {});

// Create a fresh Pokedex.
const P = new Pokedex.Pokedex();

// Create new instance of a Pokemon.
const appPokemon = {};

appPokemon.getInfo = (userInput) => {
	P.getPokemonByName(userInput.toLowerCase())
		.then(response => {
			appPokemon.displayPoke(response);
		})
		.catch((err) => {
			const selectedPokemon = document.querySelector('.selectPoke');
			const inputField = document.querySelector('.choosePoke_option');
			const inputError = document.querySelector('.choosePoke_error');
			inputField.innerText = '';
			inputError.classList.add('show');
			if (selectedPokemon) {
				selectedPokemon.style.display = 'none';
			}
			setTimeout(() => {
				inputError.classList.remove('show');
			}, 4000);
		});
};

// pokemon spritesheet for all 811??!
appPokemon.spritesheets = [
	{
		name: "pikachu",
		spritesheet: "assets/pikachu-1.png",
		background: "assets/modal.png"
	}
];

appPokemon.displayPoke = (poke) => {
	// empty sprite
	const selectedPokemon = document.querySelector('.selectPoke');
	if (selectedPokemon) {
		selectedPokemon.style.display = 'none';
	}

	// find image associated with pokemon (name)
	const name = poke.name;

	// find default front-facing sprite
	const sprite = poke.sprites.front_default;

	// display sprite image and name
	const pokemonImageContainer = document.querySelector('.choosePoke_img');
	const pokemonName = document.querySelector('.choosePoke_option');
	const pokemonImage = document.createElement('img');
	pokemonImage.innerHTML = `<img src='${sprite}' class='selectPoke'>`;
	while (pokemonImage.firstChild) {
		pokemonImageContainer.append(pokemonImage.firstChild);
	}
	pokemonName.innerText = name;

	// grab spritesheets
	const spritesheets = appPokemon.spritesheets;
	const sheets = spritesheets
		.filter((sheet) => {
			return sheet.name === "pikachu";
		})
		.map((sheet) => {
			return sheet.spritesheet;
		});

	// grab background
	const fields = spritesheets
		.filter((field) => {
			return field.name === "pikachu";
		})
		.map((field) => {
			return field.background;
		});

	// when form is submitted, the spritesheet and the background is added. even if the modal does not appear
	const modalField = document.querySelector('.modalBox_field');
	const modalSprite = document.querySelector('.modalBox_sprite-img');
	modalField.style['background-image'] = `url(${fields})`;
	modalField.style['background-position'] = 'center center';
	modalSprite.style['background-image'] = `url(${sheets})`;
};

appPokemon.events = () => {
	const form = document.querySelector('form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		// userInput stores the value/pokemon that was entered
		const userInput = document.querySelector('input#getpoke').value.toLowerCase();
		// playPoke button is enabled
		const playButton = document.querySelector('button#playPoke');
		playButton.removeAttribute('disabled');
		// calls getInfo , which calls displayPoke
		appPokemon.getInfo(userInput);

		// bring them to the game page on click
		playButton.addEventListener('click', () => {
			// ask about nesting and stuff
			// displays pokemon name in header
			const header = document.querySelector('h1 span');
			header.innerText = ' Pikachu';

			const modal = document.querySelector('.modalBox');
			modal.style.display = 'inline-block';

			const overlay = document.querySelector('.overlay');
			overlay.style.opacity = '1';
			overlay.style['z-index'] = '1';

			appPokemon.startModal();

			playButton.setAttribute('disabled', '');
		});
	});
};

appPokemon.startModal = () => {
	// counters
	let happy = 50;
	let hunger = 50;

	const happyCounter = document.querySelector('.happy-box');
	const hungerCounter = document.querySelector('.hunger-box');
	happyCounter.innerText = happy;
	hungerCounter.innerText = hunger;

	const happyDown = () => {
		happyCounter.innerText = happy;
		if (happy > 0) {
			happy--;
		}
	}

	const hungerDown = () => {
		hungerCounter.innerText = hunger;
		if (hunger > 0) {
			hunger--;
		}
	}

	const happyTimer = window.setInterval(() => {
		happyDown();
	}, 10000);

	const hungerTimer = window.setInterval(() => {
		hungerDown();
	}, 10000);

	const petButton = document.querySelector('button#petPoke');
	petButton.addEventListener('click', (e) => {
		e.preventDefault();
		// pokemon emoticon pops up
		const spriteEmote = document.querySelector('.modalBox_sprite-mood');
		spriteEmote.setAttribute('src', 'assets/happy-1.png');
		spriteEmote.classList.add('mood-animate');
		spriteEmote.addEventListener('animationend', () => {
			spriteEmote.classList.remove('mood-animate');
		});

		// run the happy function
		if (happy >= 0 && happy < 50) {
			happyCounter.innerText = happy;
			happy++;
		}
	});

	const feedButton = document.querySelector('button#feedPoke');
	feedButton.addEventListener('click', (e) => {
		e.preventDefault();

		const spriteEmote = document.querySelector('.modalBox_sprite-mood');
		spriteEmote.setAttribute('src', 'assets/happy-1.png');
		spriteEmote.classList.add('mood-animate');
		spriteEmote.addEventListener('animationend', () => {
			spriteEmote.classList.remove('mood-animate');
		});

		// run the hunger function
		if (hunger >= 0 && hunger < 50) {
			hungerCounter.innerText = hunger;
			hunger++;
		}
	});
};

appPokemon.init = () => {
	appPokemon.events();
};

// DOM is ready.
((document, window, domIsReady, undefined) => {
	domIsReady(() => {
		appPokemon.init();
	});
})(document, window, domIsReady);
