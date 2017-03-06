var appPokemon = {}

appPokemon.url = 'http://pokeapi.co/api/v2/pokemon/'

appPokemon.getInfo = function(userInput) {
	$.ajax({
		url: appPokemon.url + userInput + '/',
		method: 'GET',
		dataType: 'json'
	}).then(function(data) {
		appPokemon.displayPoke(data)
	}).fail(function() {
		$('.selectPoke').remove()
		$('.choosePoke_option').empty()
		$('.choosePoke_error').addClass('show')
		setTimeout(function() {
			$('.choosePoke_error').removeClass('show')
		}, 4000) 
	})
}

// pokemon spritesheet for all 811??!
appPokemon.spritesheets = [
	{
		name: 'pikachu',
		spritesheet: 'assets/pikachu-1.png',
		background: 'assets/modal.png'
	}
]

appPokemon.displayPoke = function(poke) {
	// empty sprite 
	$('.selectPoke').remove()

	// find image associated with pokemon (name) 
	var name = poke.name

	// var id = poke.id

	// find default front-facing sprite
	var sprite = poke.sprites.front_default

	// var stats = poke.stats

	// var pokeName = $('<h2>').text(name)

	// create img tag that shows the pokemon sprite
	var pokeSprite = $('<img>').attr('src', sprite).addClass('selectPoke')

	// display sprite image and name
	$('.choosePoke_option').text(name)
	$('.choosePoke_img').append(pokeSprite)
	
	// grab spritesheets
	var spritesheets = appPokemon.spritesheets
	var sheets = spritesheets.filter(function(sheet) {
		return sheet.name === name
	}).map(function(sheet) {
		return sheet.spritesheet
	})

	// grab background
	var fields = spritesheets.filter(function(field) {
		return field.name === name
	}).map(function(field) {
		return field.background
	})

	// when form is submitted, the spritesheet and the background is added. even if the modal does not appear
	$('.modalBox_field').css('background', `url(${fields})`)
	$('.modalBox_sprite-img').css('background', `url(${sheets})`)


}

appPokemon.events = function() {
	$('form').on('submit', function(e) {
		e.preventDefault()
		// userInput stores the value/pokemon that was entered
		var userInput = $('input#getpoke').val().toLowerCase()
		// playPoke button is enabled
		$('button#playPoke').removeAttr('disabled')
		// calls getInfo , which calls displayPoke
		appPokemon.getInfo(userInput)

		// bring them to the game page on click
		$('button#playPoke').on('click', function() { // ask about nesting and stuff
			// displays pokemon name in header
			$('h1').find('span').text(` ${userInput}`)

			// displays game modal
			$('.modalBox').css('display', 'inline-block')

			//overlay covers the section behind the modal
			$('.overlay').css({'opacity': '1', 'z-index': '1'})

			appPokemon.startModal()

			// disables the button again
			$(this).attr('disabled', true)
		})
	})
}

appPokemon.startModal = function() {
	// counters
	var happy = 10.0
	var hunger = 10.0

	$('.happy-box').text(happy)
	$('.hunger-box').text(hunger)

	function happyDown() {
	  $('.happy-box').text(happy)
	  if (happy > 0) {
	    happy--
	  }
	}

	function hungerDown() {
	  $('.hunger-box').text(hunger)
	  if (hunger > 0) {
	    hunger--
	  }
	}

	var happyCount = window.setInterval(function() {
	  happyDown()
	}, 10000)

	var hungerCount = window.setInterval(function() {
	  hungerDown()
	}, 5000)

	$('button#petPoke').on('click', function(e) {
		e.preventDefault()

		// pokemon emoticon pops up
		$('.modalBox_sprite-mood').attr('src', 'assets/happy-1.png').addClass('mood-animate').one('animationend', function() {
			$(this).removeClass('mood-animate')
		})

		// run the happy function
		if (0 < happy < 10) {
			happy += .5
			$('.happy-box').text(happy)
		}
	})

	$('button#feedPoke').on('click', function(e) {
		e.preventDefault()

		$('.modalBox_sprite-mood').attr('src', 'assets/happy-1.png').addClass('mood-animate').one('animationend', function() {
			$(this).removeClass('mood-animate')
		})

		// run the hunger function
		if (0 < hunger < 10) {
			hunger += .5
			$('.hunger-box').text(hunger)
		}
	})
}

appPokemon.init = function() {
	appPokemon.events()
}

$(function() {
	appPokemon.init();
})


