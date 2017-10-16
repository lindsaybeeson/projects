/* 1/ grab the input */

var search = document.querySelector(".js-userinput");
var container = document.querySelector(".js-container");

query(search);

function query(searchGiphy) {

	search.addEventListener('keyup',function(e) {

		var input = document.querySelector("input").value;
	
		if(e.which === 13) {	
			imageQuery(JSON.stringify(input));

		}

	});

}


/* 2/ do the data stuff with the api */

function imageQuery(searchInput) {

	var key = "suAJeNo0a0GgMVGm7nJ2WUzlN20CkacC";
	var url = "http://api.giphy.com/v1/gifs/search?q=" + searchInput + "&api_key=" + key

	// AJAX Request
	var GiphyAJAXCall = new XMLHttpRequest();
	GiphyAJAXCall.open( 'GET', url );
	GiphyAJAXCall.send();

	GiphyAJAXCall.addEventListener('load',function(e) {

		var data = e.target.response;
		pushToDOM(data);

	});
}

/* 3/ show me the gifs */

function pushToDOM(responseData) {

	var response = JSON.parse(responseData);
	var imageUrls = response.data;
	var container = document.querySelector(".js-container");

	container.innerHTML = "";

	imageUrls.forEach(function(image) {

		var src = image.images.fixed_height.url;
		container.innerHTML = "<img src=" + src + " class=\"container-image\">";

		console.log(container);

	});

}