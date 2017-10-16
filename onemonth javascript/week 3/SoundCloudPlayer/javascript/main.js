/* 1. Search */

var search = document.querySelector(".js-search");

var UI = {};

UI.enterPress = function () {


	search.addEventListener('keyup',function(e) {

		var input = document.querySelector("input").value;

		if(e.which === 13) {	

			soundCloudAPI.getTrack(input);

		}

	});

}

UI.enterPress(search);


UI.submitClick = function () {

	var button = document.querySelector('.js-submit')

	button.addEventListener('click',function() {

		var input = document.querySelector("input").value;

			soundCloudAPI.getTrack(input);

		});

	}


UI.submitClick(search);


/* 2. Query Soundcloud API */

var soundCloudAPI = {};

soundCloudAPI.init = function() {

	SC.initialize({
	  client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
	});

}

soundCloudAPI.init();

soundCloudAPI.getTrack = function (inputValue) {

	var results = document.querySelector('.js-search-results');
	results.innerHTML = "";

	// find all tracks with the genre 'punk' that have a tempo greater than 120 bpm.
	SC.get('/tracks', {
	  q: inputValue
	}).then(function(tracks) {

		soundCloudAPI.renderTracks(tracks);

	});

}

//soundCloudAPI.getTrack("Francis and the Lights");


/* 3. Display the cards */

soundCloudAPI.renderTracks = function (tracks) {

	tracks.forEach(function(track) {

		var card = document.createElement('div');
		card.classList.add("card");

		var searchResults = document.querySelector('.js-search-results');
		searchResults.appendChild(card);

		var image = document.createElement('div');
		image.classList.add('image');
		card.appendChild(image);

		var image_img = document.createElement('img');
		image_img.classList.add('image_img');
		image_img.src = (track.artwork_url || 'images/kiddo.jpg');

		image.appendChild(image_img);

		var content = document.createElement('div');
		content.classList.add('content');
		card.appendChild(content);

		var header = document.createElement('div');
		header.classList.add('header');
		content.appendChild(header);
		header.innerHTML = '<a href=' + track.permalink_url + ' target="_blank">' + track.title + '</a>';

		var button = document.createElement('div');
		button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');
		card.appendChild(button);

		button.addEventListener ('click', function() {
			soundCloudAPI.getEmbed(track.permalink_url);
		});

		var icon = document.createElement('i');
		icon.classList.add('add', 'icon');
		button.appendChild(icon);

		var buttonText = document.createElement('span');
		button.appendChild(buttonText);
		buttonText.innerHTML = 'Add to playlist'

	});

};



/* 4. Add to playlist and play */

soundCloudAPI.getEmbed = function (trackURL) {
	SC.oEmbed(trackURL, {
	  auto_play: true
	}).then(function(embed){

	  var sideBar = document.querySelector('.js-playlist');
	  
	  var box = document.createElement('div');
	  box.innerHTML = embed.html;

	  sideBar.insertBefore(box, sideBar.firstChild);
	  localStorage.setItem("key", sideBar.innerHTML);

	  clearPlaylist.classList.remove('clear-playlist-inactive');


	});

}

var sideBar = document.querySelector('.js-playlist');
sideBar.innerHTML = localStorage.getItem("key");


/* 5. Clear playlist button */


var clearPlaylist = document.querySelector('.clear-playlist-active');

clearPlaylist.addEventListener('click', function() {

	localStorage.removeItem('key');
	sideBar.innerHTML = null;
	clearPlaylist.classList.add('clear-playlist-inactive');


});


/* Check if local Storage, gray button if not */

if(localStorage.length < 1) {

	clearPlaylist.classList.add('clear-playlist-inactive');
	
}























