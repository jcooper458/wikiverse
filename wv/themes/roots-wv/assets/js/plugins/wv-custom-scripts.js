//----------------GENERAL STUFF----------------------------

var $packeryContainer = $('#packery');

var $wikiSearchBrick = $("#wikipedia-search");
var $youtubeSearchBrick = $("#youtube-search");
var $flickrSearchBrick = $("#flickr-search");
var $instagramSearchBrick = $("#instagram-search");
var $soundcloudSearchBrick = $("#soundcloud-search");
var $gmapsSearchBrick = $("#gmaps-search");

var close_icon = '<span class="cross"><i class="fa fa-close"></i></span>';
var youtube_icon = '<i class="fa fa-youtube-square"></i>';
var wikiverse_nav = '<div class="wikiverse-nav pull-left"><i class="fa fa-youtube-square youtube-icon icon"></i>&nbsp;<i class="fa fa-flickr flickr-icon icon"></i>&nbsp;<i class="fa fa-instagram instagram-icon icon"></i></div>';
var defaultBrick = '<div class="brick">' + close_icon + '<span class="handle"> <i class="fa fa-arrows"></i></span></div>';

$('.selectpicker').selectpicker();

getSearchBoxes();

// initialize Packery
var packery = $packeryContainer.packery({
	itemSelector: '.brick',
//	stamp: '.stamp',
	gutter: 10,
	columnWidth: 300
//	rowHeight: 60,
//	isInitLayout: false
});	

//make the enter keypress do the search
$(".search input:text").keyup(function (e) {
    if (e.keyCode == 13) {
       $(e.target).siblings('span').find('button').trigger('click');
    }
});

//----------------GENERAL STUFF----------------------------

//----------------EVENTS----------------------------

// REMOVE ITEM
$packeryContainer.on( "click", ".cross", function() {
	var $thisBrick = jQuery(this).parent(".brick");
	$packeryContainer.packery( 'remove', $thisBrick );
	$packeryContainer.packery();
});

//create youtube interconnection button and trigger search
$packeryContainer.on("click", ".youtube-icon", function(){

	$youtubeSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");

	$youtubeSearchBrick.find('input').val(topic.title);
	$youtubeSearchBrick.find('.searchbox').attr('disabled', 'true');
	$youtubeSearchBrick.find('.start').addClass('disabled');

	$youtubeSearchBrick.find('.start').trigger( "click" );

});



//create flickr interconnection button and trigger flickr search
$packeryContainer.on("click", ".flickr-icon", function(){

	$flickrSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");

	$flickrSearchBrick.find('input').val(topic.title);


	//$flickrSearchBrick.find('.searchbox').attr('disabled', 'true');
	//$flickrSearchBrick.find('.start').addClass('disabled');

	getFlickrs(topic.title, "relevance", "textQuery");

});

//create flickr interconnection button and trigger flickr search
$packeryContainer.on("click", ".instagram-icon", function(){

	$instagramSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($flickrSearchBrick).packery( 'prepended', $instagramSearchBrick);
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");

	$instagramSearchBrick.find('input').val(topic.title);

	//$flickrSearchBrick.find('.searchbox').attr('disabled', 'true');
	//$flickrSearchBrick.find('.start').addClass('disabled');

	getInstagrams(topic.title, "hashtag");

});




//show save wall button on packery change (needs work)
$packeryContainer.packery( 'on', 'layoutComplete', function( pckryInstance, laidOutItems ) {

	$("#saveWall").css('display', 'block');

	//when clear results is clicked
	$('.clear').on('click', function(){

		var $thisBrick = $(this).parents('.brick');
		//remove all UI elements
		$thisBrick.find('.results').empty();
		$thisBrick.find('.search-ui').hide();

		//empty the wiki-searchbox for new search
		$thisBrick.find('select').removeAttr('disabled');
		$thisBrick.find('input').removeAttr('disabled');
		$thisBrick.find('input[type=text]').val('');

		$thisBrick.find('.selectpicker').selectpicker('refresh');

		//scroll to top
		//window.scrollTo(0, 0);
	});

});

//create images interconnection and trigger getFlickrs()
//This time for the gmaps brick, in thise case we only want the bounds passed in to getFlickrs
$packeryContainer.on("click", ".gmaps .fa-flickr", function(){

	$flickrSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var position = $thisBrick.data("position");
	var sort = $flickrSearchBrick.find(".radio-inline input[type='radio']:checked").val();

	$flickrSearchBrick.find('select[name=flickrType]').val('geoQuery');
	$flickrSearchBrick.find('#flickrType').attr("disabled", "true");
	$('.selectpicker').selectpicker('refresh');

	$flickrSearchBrick.find('input#flickr-searchinput').val(position);
	$flickrSearchBrick.find('.searchbox').attr('disabled', 'true');
	//$flickrSearchBrick.find('.start').addClass('disabled');


	getFlickrs(position, sort, "geoQuery");

});

//create images interconnection and trigger getInstagrams()
$packeryContainer.on("click", ".gmaps .fa-instagram", function(){

	$instagramSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($instagramSearchBrick).packery( 'prepended', $instagramSearchBrick);
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var position = $thisBrick.data("position");

	$instagramSearchBrick.find('input').val(position);

    $instagramSearchBrick.find("input[name='coordinates']").prop('checked', true);
 	$instagramSearchBrick.find("input[name='coordinates']").prop('disabled',true);

	$instagramSearchBrick.find('.searchbox').attr('disabled', 'true');
	$instagramSearchBrick.find('.start').addClass('disabled');

	$('#instagram-search .results').empty();

	getInstagrams(position, "coordinates");

});

$packeryContainer.packery( 'on', 'layoutComplete', orderItems );
$packeryContainer.packery( 'on', 'dragItemPositioned', orderItems );

function getSearchBoxes(){

var lang = $("#langselect").val();

$( "#langselect" ).change(function() {
	lang = $(this).val();
});

//WIKIPEDIA AUTOCOMPLETE
$('#wiki-searchinput').typeahead({
	source: function(query, process) {
		return $.ajax({
			url: "http://"+lang+".wikipedia.org/w/api.php",
			dataType: "jsonp",
			data: {
				'action': "opensearch",
				'format': "json",
				'search': query
			},
			success: function(json) {
				process(json[1]);
			}

		});
	},
	matcher: function (item) {
		if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
			return true;
		}
	}
});

//YOUTUBE AUTOCOMPLETE
$('#youtube-searchinput').typeahead({

	source: function(query, process) {
		return $.ajax({
			url: "http://suggestqueries.google.com/complete/search",
			dataType: "jsonp",
			data: {
				'client': "youtube",
				'ds': "yt",
				'q': query
			},
			success: function(json) {

				var resultArray = [];

				$.each(json[1], function(){

					resultArray.push(this[0]);

				});

				process(resultArray);
			}

		});
	},
	matcher: function (item) {
		if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
			return true;
		}
	}
});

$("#wikipedia-icon").on("click", function(){

	$wikiSearchBrick.removeClass("invisible");
	$packeryContainer.append($wikiSearchBrick).packery( 'prepended', $wikiSearchBrick);
	$wikiSearchBrick.each( makeEachDraggable );	
	$packeryContainer.packery();
});



$("#wikipedia-search .start").on("click", function(){

	var topic = $("#wiki-searchinput").val();
	getWikis( topic, lang );

});

$("#youtube-icon").on("click", function(){

	$youtubeSearchBrick.removeClass("invisible");
	$packeryContainer.append($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);
	$youtubeSearchBrick.each( makeEachDraggable );
	$packeryContainer.packery();
});

$("#youtube-search .start").on("click", function(){

	var topic = $("#youtube-search .searchbox").val();
	getYoutubes( topic );

});


$("#instagram-icon").on("click", function(){

	$instagramSearchBrick.removeClass("invisible");
	$packeryContainer.append($instagramSearchBrick).packery( 'prepended', $instagramSearchBrick);
	$instagramSearchBrick.each( makeEachDraggable );
	$packeryContainer.packery();
});

$("#instagram-search .start").on("click", function(){

	var query = $("#instagram-search .searchbox").val();
	var instagramType = $("#instagramType").val();

	getInstagrams(query, instagramType);
});

$("#flickr-icon").on("click", function(){

	$flickrSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);
	$flickrSearchBrick.each( makeEachDraggable );
	$packeryContainer.packery();
});



$("#flickr-search .start").on("click", function(){

	var flickrType = $("#flickrType").val();
	var query = $("#flickr-search .searchbox").val();
	var sort = $("#flickr-search .radio-inline input[type='radio']:checked").val();

	getFlickrs(query, sort, flickrType);

});


$("#soundcloud-icon").on("click", function(){

	$soundcloudSearchBrick.removeClass("invisible");
	$packeryContainer.append($soundcloudSearchBrick).packery( 'prepended', $soundcloudSearchBrick);
	$soundcloudSearchBrick.each( makeEachDraggable );
	$packeryContainer.packery();
});

$("#soundcloud-search .start").on("click", function(){

	var query = $("#soundcloud-search .searchbox").val();
	var params = $("#soundcloud-search .radio-inline input[type='radio']:checked").val();

	getSoundcloud(query, params);

});


$("#gmaps-icon").on("click", function(){

	$gmapsSearchBrick.removeClass("invisible");
	$packeryContainer.append($gmapsSearchBrick).packery( 'prepended', $gmapsSearchBrick);
	$gmapsSearchBrick.each( makeEachDraggable );
	getGmapsSearch();
	$packeryContainer.packery();
});


}

function orderItems(packery, items) {

	var itemElems = $packeryContainer.packery('getItemElements');
	for ( var i=0, len = itemElems.length; i < len; i++ ) {
		var elem = itemElems[i];

		$(elem).attr( "tabindex", i );
	}
}

//Toggle Size of Images on click
$packeryContainer.on( 'click', 'img', function( event ) {

	var $brick= $( event.target ).parents('.brick');
  	var tempDataObj = $brick.data('topic');

  	// toggle the size for images
  	if($( event.target ).is('img.img-result')){
  		//make it large
  		$brick.toggleClass('w2');

  		//if it is large, update the dataObj so it saves the state
  		if($brick.hasClass('w2')){
  			tempDataObj.size = 'large';
  		}else{
  			tempDataObj.size = 'small';
  		}
  		//set the dataObj to data topic
  		$brick.data('topic', tempDataObj);
  	}
  	// trigger layout
  	$packeryContainer.packery();
});

//----------------EVENTS----------------------------


function buildNextTopic($brick, lang){

	$brick.find("a").unbind('click').click(function(e) {

		e.preventDefault();

		var topic = $(this).attr("title");
		$(this).contents().unwrap();

		var brickData = {
			title: topic,
			language: lang
		}

		var y = parseInt($brick.css('top'));
		var x = parseInt($brick.css('left'));

		//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
		buildWikipedia(brickData, $brick.attr("tabindex") - 1, x, y);

	});
}

var markers = [];
function getGmapsSearch(){

	var mapOptions = {
		center: {lat: 35, lng: 0},
		zoom: 1,
		scrollwheel: false,
	};

	var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var input = document.getElementById('pac-input');

	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.bindTo('bounds', map);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});

   google.maps.event.addListener(map, 'click', function(event) {

   		markers.forEach(function(marker){
   			marker.setMap(null);
   		});

        var droppedMarker = new google.maps.Marker({
	        position: event.latLng,
	        map: map
	    });

		markers.push(droppedMarker);

		//find the location of the marker
		var positionUrlString = droppedMarker.getPosition().toUrlValue();

		//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
		$gmapsSearchBrick.data('position', positionUrlString);
		$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

        $gmapsSearchBrick.find(".fa-instagram, .fa-flickr").fadeIn("slow");
    });

	google.maps.event.addListener(autocomplete, 'place_changed', function() {

		$gmapsSearchBrick.find(".fa-instagram, .fa-flickr").fadeIn("slow");

		infowindow.close();

		var place = autocomplete.getPlace();
		if (!place.geometry) {
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

		// Set the position of the marker using the place ID and location
		marker.setPlace({
			placeId: place.place_id,
			location: place.geometry.location
		});
		marker.setVisible(true);

		//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
		$gmapsSearchBrick.data('position', marker.place.location.toUrlValue());
		$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

		infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
		//	'Place ID: ' + place.place_id + '<br>' +
		place.formatted_address);

		infowindow.open(map, marker);
	});

	google.maps.event.addListener(map, 'idle', function() {

		currentMap = {
			center: map.getCenter().toUrlValue(),
			bounds: {
				southWest : map.getBounds().getSouthWest().toUrlValue(),
				northEast : map.getBounds().getNorthEast().toUrlValue()
			},
			maptype: map.getMapTypeId()
		};

		$gmapsSearchBrick.data("topic", currentMap );

	});

	google.maps.event.addListener(map, 'maptypeid_changed', function() {

		currentMap.maptype = map.getMapTypeId();

		$gmapsSearchBrick.data( "topic", currentMap );

	});

	var thePanorama = map.getStreetView(); //get the streetview object

	//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {

		//console.log(thePanorama);

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$gmapsSearchBrick.data( "type", "streetview" );
			$gmapsSearchBrick.data( "topic", currentStreetMap );
		}

	});

		//detect if entering Streetview -> Change the type to streetview
		google.maps.event.addListener(thePanorama, 'pov_changed', function() {

			if (thePanorama.getVisible()) {
				//console.log(thePanorama);
				currentStreetMap = {
					center: thePanorama.position.toUrlValue(),
					zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$gmapsSearchBrick.data( "topic", currentStreetMap );
		}

	});
}

function buildGmaps(mapObj){

	var map;
	var myMaptypeID;
	var currentMap;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map_canvas"></div>');

	var $mapbrick = $(defaultBrick);

	$mapbrick.data('type', 'gmaps');
	$mapbrick.data('position', mapObj.center);
	$mapbrick.data('bounds', mapObj.bounds.southWest + "," + mapObj.bounds.northEast);

	$mapbrick.addClass('w2');
	$mapbrick.addClass('gmaps');

	$mapbrick.prepend($mapcanvas);
	$mapbrick.prepend('<span class="instagram"><i class="fa fa-instagram instagram-icon"></i></span>');
	$mapbrick.prepend('<span class="flickr-search"><i class="fa fa-flickr flickr-icon"></i></span>');

	$packeryContainer.append($mapbrick).packery( 'appended', $mapbrick);
	$mapbrick.each( makeEachDraggable );


	if (mapObj.maptype.toLowerCase() === "roadmap"){
		myMaptypeID = google.maps.MapTypeId.ROADMAP;
	}
	else if(mapObj.maptype.toLowerCase() === "satellite"){
		myMaptypeID = google.maps.MapTypeId.SATELLITE;
	}
	else if(mapObj.maptype.toLowerCase() === "hybrid"){
		myMaptypeID = google.maps.MapTypeId.HYBRID;
	}
	else if(mapObj.maptype.toLowerCase() === "terrain"){
		myMaptypeID = google.maps.MapTypeId.TERRAIN;
	}

	//It is necessairy to re-build a valid LatLng object. The one recreated from the JSON string is invalid.
	var myCenter = new google.maps.LatLng(mapObj.center.split(",")[0], mapObj.center.split(",")[1]);


	//same for the bounds, on top we need to rebuild LatLngs to re-build a bounds object
	var LatLngNe = new google.maps.LatLng(mapObj.bounds.northEast.split(",")[0], mapObj.bounds.northEast.split(",")[1]);
	var LatLngSw = new google.maps.LatLng(mapObj.bounds.southWest.split(",")[0], mapObj.bounds.southWest.split(",")[1]);

	//last but not least: the bound object with the newly created Latlngs
	var myBounds = new google.maps.LatLngBounds(LatLngSw, LatLngNe);

	var mapOptions = {
		zoom: 8,
		center: myCenter,
		scrollwheel: false,
		mapTypeId: myMaptypeID
	};

	map = new google.maps.Map($mapcanvas[0], mapOptions);

	map.fitBounds(myBounds);

	google.maps.event.addListener(map, 'idle', function() {

		currentMap = {
			center: map.getCenter().toUrlValue(),
			bounds: {
				southWest : map.getBounds().getSouthWest().toUrlValue(),
				northEast : map.getBounds().getNorthEast().toUrlValue()
			},
			maptype: map.getMapTypeId()
		};

		$mapbrick.data( "topic", currentMap );

	});

	google.maps.event.addListener(map, 'maptypeid_changed', function() {

		currentMap.maptype = map.getMapTypeId();

		$mapbrick.data( "topic", currentMap );

	});

	google.maps.event.addListener(map, 'click', function(event) {

   		markers.forEach(function(marker){
   			marker.setMap(null);
   		});

        var droppedMarker = new google.maps.Marker({
	        position: event.latLng,
	        map: map
	    });

		markers.push(droppedMarker);

		//find the location of the marker
		var positionUrlString = droppedMarker.getPosition().toUrlValue();

		//calculate the bounds - used for flickr foto search
		var southWest = map.getBounds().getSouthWest().toUrlValue();
		var northEast = map.getBounds().getNorthEast().toUrlValue();

		//store it into the data container
		$gmapsSearchBrick.data('position', positionUrlString);
		$gmapsSearchBrick.data('bounds', southWest + ',' + northEast);

        $gmapsSearchBrick.find(".fa-instagram, .fa-flickr").fadeIn("slow");
    });

	var thePanorama = map.getStreetView(); //get the streetview object

	//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$mapbrick.data( "type", "streetview" );
			$mapbrick.data( "topic", currentStreetMap );
		}

	});

		//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'pov_changed', function() {

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$mapbrick.data( "topic", currentStreetMap );
		}

	});

}

function buildStreetMap(streetObj) {

	var $mapbrick;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map_canvas"></div>');

	var $mapbrick = $(defaultBrick);

	$mapbrick.data('type', 'streetview');
	$mapbrick.addClass('w2');
	$mapbrick.prepend($mapcanvas);

	$packeryContainer.append($mapbrick).packery( 'appended', $mapbrick);
	$mapbrick.each( makeEachDraggable );


	var myCenter = new google.maps.LatLng(streetObj.center.split(",")[0], streetObj.center.split(",")[1]);

	var panoramaOptions = {
		position:myCenter,
		zoomControl: false,
		linksControl: false,
		panControl: false,
		disableDefaultUI: true,
		pov: {
			heading: parseFloat(streetObj.heading),
			pitch: parseFloat(streetObj.pitch),
			zoom: parseFloat(streetObj.zoom)
		},
		visible:true
	};

	var thePanorama = new google.maps.StreetViewPanorama($mapcanvas[0], panoramaOptions);

	google.maps.event.addListener(thePanorama, 'pov_changed', function() { //detect if entering Streetview

		currentStreetMap = {
			center: thePanorama.position.toUrlValue(),
			zoom: thePanorama.pov.zoom,
			//adress: thePanorama.links[0].description,
			pitch: thePanorama.pov.pitch,
			heading: thePanorama.pov.heading
		};

		$mapbrick.data( "topic", currentStreetMap );

	});

	//if nothing changes, re-save the data-topic (otherwise its lost upon resave without moving)
	$mapbrick.data( "topic", streetObj );
}

function buildFoto(photoObj, type){

	var $brick = $(defaultBrick);
	$brick.addClass('foto');

	if(photoObj.size === "large") $brick.addClass('w2');

	var $photo = $('<img class="img-result" owner="' + photoObj.owner + '" src="' + photoObj.mediumURL + '">');

	$brick.data('type', type);
	$brick.data('topic', photoObj);

	$brick.append($photo);

	$packeryContainer.append($brick).packery( 'appended', $brick);
	$brick.each( makeEachDraggable );

	var imgLoad = imagesLoaded( $brick );

	imgLoad.on( 'progress', function( imgLoad, image ) {
		if ( !image.isLoaded ) {
		  	return;
		}
		$packeryContainer.packery();
	});
}

function strip(html)
{
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function getFlickrs(topic, sort, type) {

	$('#flickr-search .results').empty();

	if(!$flickrSearchBrick.hasClass("w2")) $flickrSearchBrick.addClass("w2");

	type  = type || "textQuery";

	//if query is coordinates (bounds)
	if(type === "geoQuery"){

		var latitude = topic.split(',')[0];
		var longitude = topic.split(',')[1];

		$.ajax({
			url: 'https://api.flickr.com/services/rest',
			data:{

				method: 'flickr.places.findByLatLon',
				api_key: '1a7d3826d58da8a6285ef7062f670d30',
				lat: latitude,
				lon: longitude,
				format: 'json',
				nojsoncallback: 1
			},
			success: function(data){

				if (typeof data.places.place !== 'undefined' && data.places.place.length > 0) {
					$.ajax({
						url: 'https://api.flickr.com/services/rest',
						data:{

							method: 'flickr.photos.search',
							api_key: '1a7d3826d58da8a6285ef7062f670d30',
							place_id: data.places.place[0].woeid,
							format: 'json',
							nojsoncallback: 1,
							per_page: 40,
							sort: sort
						},
						success: function(data){
							if (typeof data.photos.photo !== 'undefined' && data.photos.photo.length > 0) {
								data.photos.photo.forEach(function(photoObj, index){

									$.ajax({
										url: 'https://api.flickr.com/services/rest',
										data:{

											method: 'flickr.photos.getSizes',
											api_key: '1a7d3826d58da8a6285ef7062f670d30',
											photo_id: photoObj.id,
											format: 'json',
											nojsoncallback: 1
										},
										success: function(data){
											createFlickrBrick(data, photoObj);
										}
									});
								});
							}
							else{
								$flickrSearchBrick.find('.results').append('<div class="no-results">No pictures found for "' + data.places.place[0].name + '"</div>');
							}
						}
					});
				}
				else{
					$flickrSearchBrick.find('.results').append('<div class="no-results">No places found for these coordinates: "' + topic + '"</div>');
				}
			}
		});
	}
	else if(type === "textQuery"){ // is textQuery

		$.ajax({
			url: 'https://api.flickr.com/services/rest',
			data:{

				method: 'flickr.photos.search',
				api_key: '1a7d3826d58da8a6285ef7062f670d30',
				text: topic,
				format: 'json',
				nojsoncallback: 	1,
				per_page: 40,
				sort: sort
			},
			success: function(data){
				if (typeof data.photos.photo !== 'undefined' && data.photos.photo.length > 0) {
					data.photos.photo.forEach(function(photoObj, index){

						$.ajax({
							url: 'https://api.flickr.com/services/rest',
							data:{
								method: 'flickr.photos.getSizes',
								api_key: '1a7d3826d58da8a6285ef7062f670d30',
								photo_id: photoObj.id,
								format: 'json',
								nojsoncallback: 1
							},
							success: function(data){
								createFlickrBrick(data, photoObj);
							}

						});
					});
				}
				else{
					$flickrSearchBrick.find('.results').append('<div class="no-results">No pictures found for "' + topic + '"</div>');
				}
			}
		});
	}
	else if(type === "userQuery"){

		$.ajax({
			url: 'https://api.flickr.com/services/rest',
			data:{

				method: 'flickr.people.findByUsername',
				api_key: '1a7d3826d58da8a6285ef7062f670d30',
				username: topic,
				format: 'json',
				nojsoncallback: 1
			},
			success: function(data){
				
				if (data.user.id) {
					
					$.ajax({
						url: 'https://api.flickr.com/services/rest',
						data:{

							method: 'flickr.photos.search',
							api_key: '1a7d3826d58da8a6285ef7062f670d30',
							user_id: data.user.id,
							format: 'json',
							nojsoncallback: 1,
							per_page: 40,
							sort: sort
						},
						success: function(data){
							if (typeof data.photos.photo !== 'undefined' && data.photos.photo.length > 0) {
								data.photos.photo.forEach(function(photoObj, index){

									$.ajax({
										url: 'https://api.flickr.com/services/rest',
										data:{

											method: 'flickr.photos.getSizes',
											api_key: '1a7d3826d58da8a6285ef7062f670d30',
											photo_id: photoObj.id,
											format: 'json',
											nojsoncallback: 1
										},
										success: function(data){
											createFlickrBrick(data, photoObj);
										}
									});
								});
							}
							else{
								$flickrSearchBrick.find('.results').append('<div class="no-results">No pictures found for "' + data.places.place[0].name + '"</div>');
							}
						}
					});
				}
				else{
					$flickrSearchBrick.find('.results').append('<div class="no-results">No User found with username: "' + topic + '"</div>');
				}
			}
		});
	}
}

function createFlickrBrick(apiData, photoObj){

	var thumbURL = apiData.sizes.size[1].source;
	var mediumURL = apiData.sizes.size[6].source;

	$flickrSearchBrick.find('.results').append('<img width="150" owner="' + photoObj.owner + '" large="' + mediumURL + '" thumb="' + thumbURL + '" src="' + thumbURL + '">');

	imagesLoaded( '#flickr-search .results', function() {
		$packeryContainer.packery();
	});

	$flickrSearchBrick.find('img').unbind('click').click(function(e) {

		var thisPhoto = {

			thumbURL: $(this).attr('thumb'),
			mediumURL: $(this).attr('large'),
			size: 'small',
			owner: $(this).attr('owner')

		}
		buildFoto(thisPhoto, "flickr");
		$(this).remove();
	});

	$flickrSearchBrick.find('.search-ui').show();
}

function createInstagramBrick(photo){

	$instagramSearchBrick.find('.results').append('<img class="img-search" width="146" fullres="' + photo.images.standard_resolution.url + '" src="' + photo.images.low_resolution.url + '">');

	imagesLoaded('#instagram-search .results', function() {
		$packeryContainer.packery();
	});

	$instagramSearchBrick.find('img').unbind('click').click(function(e) {

		var thisPhoto = {
			mediumURL: $(this).attr('fullres'),
			smallURL: $(this).attr('src'),
			size: 'small'
		}
		buildFoto(thisPhoto, "instagram");
		$(this).remove();
	});

	$instagramSearchBrick.find('.search-ui').show();
}

function inrange(min,number,max){
    if ( !isNaN(number) && (number >= min) && (number <= max) ){
        return true;
    } else {
        return false;
    };
}

function valid_coords(number_lat,number_lng) {
    if (inrange(-90,number_lat,90) && inrange(-180,number_lng,180)) {
        $("#btnSaveResort").removeAttr("disabled");
        return true;
    }
    else {
        $("#btnSaveResort").attr("disabled","disabled");
        return false;
    }
}

function getInstagrams(query, type) {

	$instagramSearchBrick.addClass("w2");

	type = type || "hashtag";

	$('#instagram-search .results').empty();

	var client_id = "db522e56e7574ce9bb70fa5cc760d2e7";

    var access_parameters = {
        client_id: client_id
    };

    var instagramUrl;

    // if coordinate
	if(type === "coordinates"){

		var latitude = query.split(',')[0];
		var longitude = query.split(',')[1];

		if(valid_coords(latitude, longitude)){

			$.ajax({
				url: 'https://api.instagram.com/v1/media/search',
				data:{
					lat: latitude,
					lng: longitude,
					client_id: 'db522e56e7574ce9bb70fa5cc760d2e7',
					format: 'json'
				},
				dataType:'jsonp',
				success: function(data){
					//console.log(data)
					if (typeof data.data !== 'undefined' && data.data.length > 0) {
						data.data.forEach(function(photo, index){
							createInstagramBrick(photo);
						});
					}
					else{
						$instagramSearchBrick.find('.results').append('<div class="no-results">No pictures found at this location:  "' + query + '"</div>');
					}
				}
			});
		}
		else{
			$instagramSearchBrick.find('.results').append('<div class="no-results">"' + query + '" is not a coordinate .. :( </div>');
		}
	}
	else if(type === "hashtag"){

		instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';
		//var instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?client_id=db522e56e7574ce9bb70fa5cc760d2e7';

	    $.getJSON(instagramUrl, access_parameters, function(data){
	    	if (typeof data.data !== 'undefined' && data.data.length > 0) {
				data.data.forEach(function(photo, index){
					createInstagramBrick(photo);
				});
			}
			else{
				$instagramSearchBrick.find('.results').append('<div class="no-results">No pictures found for "' + query + '"</div>');
			}
	    });

	}
	else if(type === "username"){

		$.ajax({
			url: 'https://api.instagram.com/v1/users/search',
			data:{
				q: query,
				client_id: 'db522e56e7574ce9bb70fa5cc760d2e7',
				format: 'json'
			},
			dataType:'jsonp',
			success: function(data){
			
				if (typeof data.data !== 'undefined' && data.data.length > 0) {
					var userID = data.data[0].id
					var getUserUrl = 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';

				    $.getJSON(getUserUrl, access_parameters, function(data){
				    	if (data.meta.code !== 400) {
							data.data.forEach(function(photo, index){
								createInstagramBrick(photo);
							});
						}
						else{
							$instagramSearchBrick.find('.results').append('<div class="no-results">Search failed with error message: ' + data.meta.error_message + '</div>');
						}
				    });
				}
				else{
					$instagramSearchBrick.find('.results').append('<div class="no-results">No user found with this query: "' + query + '"</div>');
				}
			}
		});
	}
}

function buildSoundcloud(soundcloudObj){

	var $brick = $(defaultBrick);
	$brick.addClass('w2');

	var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

	$brick.data('type', 'soundcloud');
	$brick.data('topic', soundcloudObj);

	$brick.append($soundcloudIframe);

	$packeryContainer.append($brick).packery( 'appended', $brick);

	$brick.each( makeEachDraggable );
	//$packeryContainer.packery();
}

function getSoundcloud(query, params) {

	SC.initialize({
	  client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
	});

	SC.get('/tracks', { q: query }, function(tracks) {

		tracks.forEach(function(track, index){

			//append row to searchbox-table
			$soundcloudSearchBrick.find('.results').append('<tr data-toggle="tooltip" title="' + track.title + '" uri="' + track.uri + '" genre="' + track.genre + '"><td><el class="result">' + track.title + '</el></td></tr>');

			//create the tooltips
			$('tr').tooltip({animation: true, placement: 'bottom'});

			//bind event to every row
			$soundcloudSearchBrick.find('tr').unbind('click').click(function(e) {

				var soundcloudObj = {
					title: $(this).attr('title'),
					uri: $(this).attr('uri'),
					genre: $(this).attr('genre')
				}

				buildSoundcloud(soundcloudObj);

				$(this).tooltip('destroy');
				$(this).remove();
				return false;

			});

			$soundcloudSearchBrick.find('.search-ui').show();

			//relayout packery
			$packeryContainer.packery();

		});

	});

}

function getYoutubes(topic) {

	$('#youtube-search .results').empty();

	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/search',
		data:{
			q: topic,
			key: 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
			part: 'snippet',
			maxResults: 25
		},
		dataType:'jsonp',
		success: function(data){

			if (typeof data.items !== 'undefined' && data.items.length > 0) {

				$.each(data.items, function(){

					//console.log(this);

					var title = this.snippet.channelTitle;
					var snippet = this.snippet.description;
					var youtubeID = this.id.videoId;
					var thumbnailURL = this.snippet.thumbnails.default.url;

					//append row to searchbox-table
					$youtubeSearchBrick.find('.results').append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td class="youtubeThumb"><img src="'+thumbnailURL+'"></td><td class="result" youtubeID="'+youtubeID+'">'+title+'</td></tr>');

					imagesLoaded( '#youtube-search .results', function() {
						$packeryContainer.packery();
					});

					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});

					//bind event to every row -> so you can start the wikiverse
					$youtubeSearchBrick.find('tr').unbind('click').click(function(e) {

						var currentYoutubeID = $(this).find('.result').attr('youtubeID');

						$(this).tooltip('destroy');
						$(this).remove();

						buildYoutube(currentYoutubeID);

						return false;
					});

				});
			//nothing has been found on youtube
		}else{
				//append row to searchbox-table: NO RESULTS
				$youtubeSearchBrick.find('.results').append('<tr class="no-results"><td>No Youtube Videos found for "'+topic+'"</td></tr>');
			}

		}
	});
}

function getWikiLanguages(topic, lang, $brick){

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'query',
			titles:topic,
			prop:'langlinks',
			format:'json',
			lllimit: 500
		},
		dataType:'jsonp',
		success: function(data){			

			var languageObj = data.query.pages[Object.keys(data.query.pages)[0]].langlinks;

			if (!$.isEmptyObject(languageObj)) {
				var langDropDown = $('<select class="selectpicker pull-right show-menu-arrow" data-size="20" data-live-search="true"></select>');

				$.each(languageObj, function(){

					langDropDown.append('<option value="'+this.lang+'" data-topic="'+this['*']+'">'+getLanguage(this.lang)+'</option>');

				});

				langDropDown.prepend('<option selected>Read in..</option>');

				$brick.prepend(langDropDown);
								
				//make it a beautiful dropdown with selectpicker
				langDropDown.selectpicker();

				var thisTopic = $brick.data('topic');
				var thisY = parseInt($brick.css('top'));
				var thisX = parseInt($brick.css('left'));

				langDropDown.change(function(){

					thisTopic = {
						title: $(this).children(":selected").data('topic'),
						language: $(this).children(":selected").attr('value')
					}

					//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
					buildWikipedia(thisTopic, $brick.attr("tabindex"), thisX, thisY);
				});
			}
		}
	});

}

function getInterWikiLinks(section, $brick){

	$.ajax({
		url: 'http://' + section.language + '.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: section.title,
			format:'json',
			prop:'links',
			section: section.index
		},
		dataType:'jsonp',
		success: function(data){

			if (typeof data.parse.links !== 'undefined' && data.parse.links.length > 0) {

				var interWikiArray = data.parse.links;

				var interWikiDropDown = $('<select class="pull-right show-menu-arrow" data-size="20"></select>');

				interWikiArray.forEach(function(link, index){

					interWikiDropDown.append('<option index="' + link.ns + '" topic="' + link['*'] + '">' + link['*'] + '</option>');

				});

				interWikiDropDown.prepend('<option selected>Points to..</option>');				

				$brick.prepend(interWikiDropDown);
				interWikiDropDown.selectpicker();

				var thisY = parseInt($brick.css('top'));
				var thisX = parseInt($brick.css('left'));

				interWikiDropDown.change(function(){

					var thisTopic = {

						title: $(this).children(":selected").attr('topic'),
						language: section.language
					};

					buildWikipedia(thisTopic, $brick.attr("tabindex"), thisX, thisY);
				});
			}
		}
	});

}

function getWikis(topic, lang) {

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'query',
			list:'search',
			srsearch:topic,
			format:'json'
		},
		dataType:'jsonp',
		success: function(data){

			if(data.query.search.length > 0 ){

				$.each(data.query.search, function(){

					var title = this.title;
					var snippet = this.snippet;

					//append row to searchbox-table
					$wikiSearchBrick.find('.results').append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td><el class="result">'+title+'</el></td></tr>');

					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});
					//bind event to every row -> so you can start the wikiverse
					$wikiSearchBrick.find('tr').unbind('click').click(function(e) {

						var topic = {
							title: $(this).find('.result').html(),
							language: lang
						}

						buildWikipedia(topic, -1, 200, 0);

						$(this).tooltip('destroy');
						$(this).remove();
						return false;
					});

				});

				$wikiSearchBrick.find('.search-ui').show();

				//relayout packery
				$packeryContainer.packery();

			//nothing has been found on Wikipedia
		}else{
				//append row to searchbox-table: NO RESULTS
				$wikiSearchBrick.find('.results').append('<tr class="no-results"><td>No Wikipedia articles found for "'+topic+'"</td></tr>');
			}
		},
		error: function (data){

			var $packeryContainer = $('#packery');
			var content = "Wikipedia seems to have the hickup..";
			var $box = $('<p></p>').append(content);
			$box = $('<div class="brick "></div>').append($box);

			$packeryContainer.append($box).packery( 'appended', $box );


			return false;
		}
	});
}

function buildWikipedia(topic, parent, x, y){

	var $brick = $(defaultBrick);

	$brick.addClass('borderBottom');

	$brick.data('type', 'wiki');
	$brick.data('parent', parent);
	$brick.data('topic', topic);

	$brick.prepend('<p><h2>' + topic.title + '</h2></p>');
	$brick.prepend( wikiverse_nav );

	/*var items = $packeryContainer.packery('getItemElements');
	console.log(items);*/
	
	/*$brick.insertAfter("#wikipedia-search");
	$packeryContainer.packery();*/

	$packeryContainer.append($brick).packery( 'appended', $brick);
	$brick.each( makeEachDraggable );

   	$packeryContainer.packery('fit', $brick[0], x, y);

	$.ajax({
		url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: topic.title,
			format:'json',
			prop:'sections',
			/*disableeditsection: true,
			disablepp: true,
			//preview: true,
			sectionprevue: true,
			section:0,
			disabletoc: true,
			mobileformat:true*/
		},
		dataType:'jsonp',
		success: function(data){
			//if there is sections, append them
			if (typeof data.parse.sections !== 'undefined' && data.parse.sections.length > 0) {

				$tableSectionResults = $('<table class="table table-hover wiki"></table>');
				$brick.append($tableSectionResults);

				data.parse.sections.forEach(function(section){

					//remove unwanted sections:
					if((section.line !== "References") && (section.line !== "Notes") && (section.line !== "External links") && (section.line !== "Citations") && (section.line !== "Bibliography") && (section.line !== "Notes and references")) {
					 	$tableSectionResults.append('<tr><td><div class="result" title="' + section.anchor + '" index="' + section.index + '">' + section.line + '</div></td></tr>');
					}

				});
				$packeryContainer.packery();

				//create the section object and trigger the creation of a section brick
				$tableSectionResults.find(".result").on('click', function() {

					var section = {

						title: topic.title,
						language: topic.language,
						index: $(this).attr("index")
					}

					$(this).parents('tr').remove();

					var newY = parseInt($brick.css('top'));
					var newX = parseInt($brick.css('left'));

					buildSection(section, $brick.attr("tabindex"), newX, newY);

				});
			}
			//Go get the Main Image - 2 API Calls necessairy.. :(
			$.ajax({
				url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
				data:{
					action:'parse',
					page: topic.title,
					format:'json',
					prop:'images'
				},
				dataType:'jsonp',
				success: function(data){
					//if there is images, grab the first and append it
					if (typeof data.parse.images !== 'undefined' && data.parse.images.length > 0) {

						data.parse.images.every(function(image){

							//only look for jpgs
							if(image.indexOf("jpg") > -1){
								//Go grab the URL
								$.ajax({
									url: 'http://en.wikipedia.org/w/api.php',
									data:{
										action:'query',
										titles: 'Image:' + image,
										prop:'imageinfo',
										iiprop: 'url',
										format: 'json',
										iiurlwidth: 290
									},
									dataType:'jsonp',
									success: function(data){
										console.log(data)
										//get the first key in obj
										//for (first in data.query.pages) break;
										//now done better like this:

										var imageUrl = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
										var image = $('<img width="290" src="' + imageUrl + '">');

										image.insertAfter($brick.find("h2"));

										imagesLoaded( $brick, function() {
											$packeryContainer.packery();
											
										});			
									}
								});
								//break the loop if a jpg was found
								return false;
							}else{
								return true;
							}
						});
					}
				}
			});

			//Go get the first Paragraph of the article
			$.ajax({
				url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
				data:{
					action:'parse',
					page: topic.title,
					format:'json',
					prop:'text',
					section:0,
					preview: true,
					mobileformat:true,
					redirects: true
					/*disableeditsection: true,
					disablepp: true,
					
					sectionprevue: true,						
					disabletoc: true,
					mobileformat:true*/
				},
				dataType:'jsonp',
				success: function(data){

					if (data.parse.text['*'].length > 0) {
						var infobox = $(data.parse.text['*']).find('p:first');

						//if (infobox.length){

							infobox.find('.error').remove();
							infobox.find('.reference').remove();
							infobox.find('.references').remove();
							infobox.find('.org').remove();
							//infobox.find('*').css('max-width', '290px');
							infobox.find('img').unwrap();

							if($brick.find("img").length){
								infobox.insertAfter($brick.find("img"));
							}
							else{
								infobox.insertAfter($brick.find("h2"));
							}

							$packeryContainer.packery();
						//}
						//enable to create new bricks out of links
						buildNextTopic($brick, topic.language);

						getWikiLanguages(topic.title, topic.language, $brick);
						//return $brick;
					}
				}
			});

			$packeryContainer.packery();
			
		}
	});	
}

function buildSection(section, parent, x, y){

	var $brick = $(defaultBrick);

	$brick.data('type', 'wikiSection');
	$brick.data('parent', parent);
	$brick.data('topic', section);

	$brick.prepend('<p><h2>' + section.title + '</h2></p>');
	$brick.prepend( wikiverse_nav );

	$brick.addClass('borderBottom');

	$packeryContainer.append($brick).packery( 'appended', $brick);
	$brick.each( makeEachDraggable );

	$packeryContainer.packery('fit', $brick[0], x, y);

	$.ajax({
		url: 'http://' + section.language + '.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: section.title,
			format:'json',
			prop:'text',
			disableeditsection: true,
			disablepp: true,
			//preview: true,
			//sectionprevue: true,
			section: section.index,
			disabletoc: true,
			mobileformat:true
		},
		dataType:'jsonp',
		success: function(data){

			var sectionHTML = $(data.parse.text['*']);

			sectionHTML.find('.error').remove();
			sectionHTML.find('.reference').remove();
			sectionHTML.find('.references').remove();
			sectionHTML.find('.notice').remove();
			sectionHTML.find('.ambox').remove();
			sectionHTML.find('.org').remove();
			//sectionHTML.find('*').css('max-width', '290px');
			sectionHTML.find('img').unwrap();

			sectionHTML.find('a[class*=exter]').remove();

			$brick.append(sectionHTML);

			//check if there is Geolocations

			if($brick.find('.geo-dms').length){

				var geoPosition = $brick.find('.geo-nondefault .geo').html();

				$brick.find('.wikiverse-nav').prepend('<i class="fa fa-map-marker gmaps-icon icon"></i>&nbsp;');

				//if click on gmaps interconnection
				$brick.find(".wikiverse-nav .gmaps-icon").on("click", function(){

					getGmapsSearch();


					/*$('#pac-input').val(topic);
					e = jQuery.Event("keypress");
					e.which = 13; //choose the one you want
				    d = jQuery.Event("keydown");
					d.keyCode = 50;
					$("#pac-input").trigger('click');
					$("#pac-input").trigger(d);
					$("#pac-input").trigger(e);*/
				});
			}// end if geo

			//enable to create new bricks out of links
			buildNextTopic($brick, section.language);
			getInterWikiLinks(section, $brick);

			$packeryContainer.packery();
		}
	});
}


function buildWall(){

	var str = $("#wikiverse").html();

	var wikiverse =	JSON.parse(str);

	$.each(wikiverse, function(index, brick) {

		switch (brick.Type) {
		    case "wiki":
				buildWikipedia(brick.Topic, brick.Parent);
		    break;

		    case "wikiSection":
				buildSection(brick.Topic, brick.Parent);
		    break;

		    case "flickr":
				buildFoto(brick.Topic, "flickr");
		    break;

		    case "instagram":
				buildFoto(brick.Topic, "instagram");
		    break;

		    case "youtube":
				buildYoutube(brick.Topic);
		    break;

		    case "gmaps":
				buildGmaps(brick.Topic);
		    break;

		    case "streetview":
				buildStreetMap(brick.Topic);
		    break;

		    case "soundcloud":
				buildSoundcloud(brick.Topic);
		    break;
		 }
	});
}


function buildYoutube(youtubeID){

	var $iframe = '<iframe class="embed-responsive-item" id="ytplayer" type="text/html" width="290" height="190" src="http://www.youtube.com/embed/'+youtubeID+'" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0"/>';

	var $youtubeBrick = $(defaultBrick);

	$youtubeBrick.addClass('embed-responsive');
	$youtubeBrick.addClass('embed-responsive-16by9');

	$youtubeBrick.data('type', 'youtube');
	$youtubeBrick.data('topic', youtubeID);

    $youtubeBrick.append($iframe);

	$packeryContainer.append($youtubeBrick).packery( 'appended', $youtubeBrick);

	$youtubeBrick.each( makeEachDraggable );

	$packeryContainer.packery();
}


function makeEachDraggable( i, itemElem ) {
    // make element draggable with Draggabilly
    var draggie = new Draggabilly( itemElem, {
    	handle: '.handle'
    } );
    // bind Draggabilly events to Packery
    $packeryContainer.packery( 'bindDraggabillyEvents', draggie );
}


function createWall(wpnonce) {

	var wikiverse = {};

	//remove search bricks:
	var searchBricks = jQuery(".search");
	$packeryContainer.packery( 'remove', searchBricks );

	//$packeryContainer.packery();

	var itemElems = $packeryContainer.packery('getItemElements');

	var tabindex = 0;

	$.each(itemElems, function(){

		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var parent = $(this).data('parent');

		wikiverse[tabindex] = {

			Type: type,
			Topic: topic,
			Parent: parent
		};
		tabindex++;
	});

	var JSONwikiverse = JSON.stringify(wikiverse);

	$("#saveWallModal").modal('show');

	$('#wallTitle').keyup(function () {

		$("#wallSubmitButton").prop('disabled', false);
	});

	$("#wallSubmitButton").on("click", function(){


		var value=$.trim($("#wallTitle").val());

		if(value.length>0)
		{

			var title = $('#wallTitle').val();

			$.ajax({
				type: 'POST',
				url: "/wp-admin/admin-ajax.php",
				data: {
					action: 'apf_addpost',
					walltitle: title,
					wallmeta: JSONwikiverse,
					nonce: wpnonce
				},
				success: function(data, textStatus, XMLHttpRequest) {
					var id = '#apf-response';
					$(id).html('');
					$(id).append(data);
					history.pushState('', 'wikiverse', data);
				},
				error: function(MLHttpRequest, textStatus, errorThrown) {
					alert("cdascsacsa");
				}
			});

			$("#saveWallModal").modal('hide');


		}
		else{

			$('#wallTitle').parent(".form-group").addClass("has-error");

		}

	});

}

function editWall(wpnonce) {

	var postid = $('#postID').html();

	var wikiverse = {};

	//remove search bricks:
	var searchBricks = jQuery(".search");
	$packeryContainer.packery( 'remove', searchBricks );

	//$packeryContainer.packery();

	var itemElems = $packeryContainer.packery('getItemElements');

	//var tabindex = 0;

	$.each(itemElems, function(){

		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var parent = $(this).data('parent');
		var tabindex = $(this).attr('tabindex');

		wikiverse[tabindex] = {

			Type: type,
			Topic: topic,
			Parent: parent

		};

	});

	var JSONwikiverse = JSON.stringify(wikiverse);

	$.ajax({
		type: 'POST',
		url: "/wp-admin/admin-ajax.php",
		data: {
			action: 'apf_editpost',
			wallID: postid,
			wallmeta: JSONwikiverse,
			nonce: wpnonce
		},
		success: function(data, textStatus, XMLHttpRequest) {
			var id = '#apf-response';
			$(id).html('');
			$(id).append(data);

			new PNotify({
			    text: 'wall saved',
			    type: 'success',
			    icon: 'fa fa-floppy-o',
			    styling: 'fontawesome',
			    shadow: false
			});
			$packeryContainer.packery();
		},
		error: function(MLHttpRequest, textStatus, errorThrown) {
			alert("cdascsacsa");
		}
	});
}


function getLanguage(langCode){

	var langarray = {

		'en'	:	'English'	,
		'de'	:	'Deutsch'	,
		'fr'	:	'Français'	,
		'nl'	:	'Nederlands'	,
		'it'	:	'Italiano'	,
		'es'	:	'Español'	,
		'pl'	:	'Polski'	,
		'ru'	:	'Русский'	,
		'ja'	:	'日本語'	,
		'pt'	:	'Português'	,
		'zh'	:	'中文'	,
		'sv'	:	'Svenska'	,
		'vi'	:	'Tiếng Việt'	,
		'uk'	:	'Українська'	,
		'ca'	:	'Català'	,
		'no'	:	'Norsk (Bokmål)'	,
		'fi'	:	'Suomi'	,
		'cs'	:	'Čeština'	,
		'fa'	:	'فارسی'	,
		'hu'	:	'Magyar'	,
		'ko'	:	'한국어'	,
		'ro'	:	'Română'	,
		'id'	:	'Bahasa Indonesia'	,
		'ar'	:	'العربية'	,
		'tr'	:	'Türkçe'	,
		'sk'	:	'Slovenčina'	,
		'kk'	:	'Қазақша'	,
		'eo'	:	'Esperanto'	,
		'da'	:	'Dansk'	,
		'sr'	:	'Српски / Srpski'	,
		'lt'	:	'Lietuvių'	,
		'eu'	:	'Euskara'	,
		'ms'	:	'Bahasa Melayu'	,
		'he'	:	'עברית'	,
		'bg'	:	'Български'	,
		'sl'	:	'Slovenščina'	,
		'vo'	:	'Volapük'	,
		'hr'	:	'Hrvatski'	,
		'war'	:	'Winaray'	,
		'hi'	:	'हिन्दी'	,
		'et'	:	'Eesti'	,
		'gl'	:	'Galego'	,
		'nn'	:	'Nynorsk'	,
		'az'	:	'Azərbaycanca'	,
		'simple'	:	'Simple English'	,
		'la'	:	'Latina'	,
		'el'	:	'Ελληνικά'	,
		'th'	:	'ไทย'	,
		'sh'	:	'Srpskohrvatski / Српскохрватски'	,
		'oc'	:	'Occitan'	,
		'new'	:	'नेपाल भाषा'	,
		'mk'	:	'Македонски'	,
		'ka'	:	'ქართული'	,
		'roa-rup'	:	'Armãneashce'	,
		'tl'	:	'Tagalog'	,
		'pms'	:	'Piemontèis'	,
		'be'	:	'Беларуская'	,
		'ht'	:	'Krèyol ayisyen'	,
		'te'	:	'తెలుగు'	,
		'uz'	:	'O‘zbek'	,
		'ta'	:	'தமிழ்'	,
		'be-x-old'	:	'Беларуская (тарашкевіца)'	,
		'lv'	:	'Latviešu'	,
		'br'	:	'Brezhoneg'	,
		'sq'	:	'Shqip'	,
		'ceb'	:	'Sinugboanong Binisaya'	,
		'jv'	:	'Basa Jawa'	,
		'mg'	:	'Malagasy'	,
		'cy'	:	'Cymraeg'	,
		'mr'	:	'मराठी'	,
		'lb'	:	'Lëtzebuergesch'	,
		'is'	:	'Íslenska'	,
		'bs'	:	'Bosanski'	,
		'hy'	:	'Հայերեն'	,
		'my'	:	'မြန်မာဘာသာ'	,
		'yo'	:	'Yorùbá'	,
		'an'	:	'Aragonés'	,
		'lmo'	:	'Lumbaart'	,
		'ml'	:	'മലയാളം'	,
		'fy'	:	'Frysk'	,
		'pnb'	:	'شاہ مکھی پنجابی (Shāhmukhī Pañjābī)'	,
		'af'	:	'Afrikaans'	,
		'bpy'	:	'ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী'	,
		'bn'	:	'বাংলা'	,
		'sw'	:	'Kiswahili'	,
		'io'	:	'Ido'	,
		'scn'	:	'Sicilianu'	,
		'ne'	:	'नेपाली'	,
		'gu'	:	'ગુજરાતી'	,
		'zh-yue'	:	'粵語'	,
		'ur'	:	'اردو'	,
		'ba'	:	'Башҡорт'	,
		'nds'	:	'Plattdüütsch'	,
		'ku'	:	'Kurdî / كوردی'	,
		'ast'	:	'Asturianu'	,
		'ky'	:	'Кыргызча'	,
		'qu'	:	'Runa Simi'	,
		'su'	:	'Basa Sunda'	,
		'diq'	:	'Zazaki'	,
		'tt'	:	'Tatarça / Татарча'	,
		'ga'	:	'Gaeilge'	,
		'cv'	:	'Чăваш'	,
		'ia'	:	'Interlingua'	,
		'nap'	:	'Nnapulitano'	,
		'bat-smg'	:	'Žemaitėška'	,
		'map-bms'	:	'Basa Banyumasan'	,
		'als'	:	'Alemannisch'	,
		'wa'	:	'Walon'	,
		'kn'	:	'ಕನ್ನಡ'	,
		'am'	:	'አማርኛ'	,
		'sco'	:	'Scots'	,
		'ckb'	:	'Soranî / کوردی'	,
		'gd'	:	'Gàidhlig'	,
		'bug'	:	'Basa Ugi'	,
		'tg'	:	'Тоҷикӣ'	,
		'mzn'	:	'مَزِروني'	,
		'hif'	:	'Fiji Hindi'	,
		'zh-min-nan'	:	'Bân-lâm-gú'	,
		'yi'	:	'ייִדיש'	,
		'vec'	:	'Vèneto'	,
		'arz'	:	'مصرى (Maṣrī)'	,
		'roa-tara'	:	'Tarandíne'	,
		'nah'	:	'Nāhuatl'	,
		'os'	:	'Иронау'	,
		'sah'	:	'Саха тыла (Saxa Tyla)'	,
		'mn'	:	'Монгол'	,
		'sa'	:	'संस्कृतम्'	,
		'pam'	:	'Kapampangan'	,
		'hsb'	:	'Hornjoserbsce'	,
		'li'	:	'Limburgs'	,
		'mi'	:	'Māori'	,
		'si'	:	'සිංහල'	,
		'se'	:	'Sámegiella'	,
		'co'	:	'Corsu'	,
		'gan'	:	'贛語'	,
		'glk'	:	'گیلکی'	,
		'bar'	:	'Boarisch'	,
		'bo'	:	'བོད་སྐད'	,
		'fo'	:	'Føroyskt'	,
		'ilo'	:	'Ilokano'	,
		'bcl'	:	'Bikol'	,
		'mrj'	:	'Кырык Мары (Kyryk Mary) '	,
		'fiu-vro'	:	'Võro'	,
		'nds-nl'	:	'Nedersaksisch'	,
		'ps'	:	'پښتو'	,
		'tk'	:	'تركمن / Туркмен'	,
		'vls'	:	'West-Vlams'	,
		'gv'	:	'Gaelg'	,
		'rue'	:	'русиньскый язык'	,
		'pa'	:	'ਪੰਜਾਬੀ'	,
		'xmf'	:	'მარგალური (Margaluri)'	,
		'pag'	:	'Pangasinan'	,
		'dv'	:	'Divehi'	,
		'nrm'	:	'Nouormand/Normaund'	,
		'zea'	:	'Zeêuws'	,
		'kv'	:	'Коми'	,
		'koi'	:	'Перем Коми (Perem Komi)'	,
		'km'	:	'ភាសាខ្មែរ'	,
		'rm'	:	'Rumantsch'	,
		'csb'	:	'Kaszëbsczi'	,
		'lad'	:	'Dzhudezmo'	,
		'udm'	:	'Удмурт кыл'	,
		'or'	:	'ଓଡ଼ିଆ'	,
		'mt'	:	'Malti'	,
		'mhr'	:	'Олык Марий (Olyk Marij)'	,
		'fur'	:	'Furlan'	,
		'lij'	:	'Líguru'	,
		'wuu'	:	'吴语'	,
		'ug'	:	'ئۇيغۇر تىلى'	,
		'frr'	:	'Nordfriisk'	,
		'pi'	:	'पाऴि'	,
		'sc'	:	'Sardu'	,
		'zh-classical'	:	'古文 / 文言文'	,
		'bh'	:	'भोजपुरी'	,
		'ksh'	:	'Ripoarisch'	,
		'nov'	:	'Novial'	,
		'ang'	:	'Englisc'	,
		'so'	:	'Soomaaliga'	,
		'stq'	:	'Seeltersk'	,
		'kw'	:	'Kernewek/Karnuack'	,
		'nv'	:	'Diné bizaad'	,
		'vep'	:	'Vepsän'	,
		'hak'	:	'Hak-kâ-fa / 客家話'	,
		'ay'	:	'Aymar'	,
		'frp'	:	'Arpitan'	,
		'pcd'	:	'Picard'	,
		'ext'	:	'Estremeñu'	,
		'szl'	:	'Ślůnski'	,
		'gag'	:	'Gagauz'	,
		'gn'	:	'Avañe'	,
		'ln'	:	'Lingala'	,
		'ie'	:	'Interlingue'	,
		'eml'	:	'Emiliàn e rumagnòl'	,
		'haw'	:	'Hawai`i'	,
		'xal'	:	'Хальмг'	,
		'pfl'	:	'Pfälzisch'	,
		'pdc'	:	'Deitsch'	,
		'rw'	:	'Ikinyarwanda'	,
		'krc'	:	'Къарачай-Малкъар (Qarachay-Malqar)'	,
		'crh'	:	'Qırımtatarca'	,
		'ace'	:	'Bahsa Acèh'	,
		'to'	:	'faka Tonga'	,
		'as'	:	'অসমীয়া'	,
		'ce'	:	'Нохчийн'	,
		'kl'	:	'Kalaallisut'	,
		'arc'	:	'Aramaic'	,
		'dsb'	:	'Dolnoserbski'	,
		'myv'	:	'Эрзянь (Erzjanj Kelj)'	,
		'pap'	:	'Papiamentu'	,
		'bjn'	:	'Bahasa Banjar'	,
		'sn'	:	'chiShona'	,
		'tpi'	:	'Tok Pisin'	,
		'lbe'	:	'Лакку'	,
		'lez'	:	'Лезги чІал (Lezgi č’al)'	,
		'kab'	:	'Taqbaylit'	,
		'mdf'	:	'Мокшень (Mokshanj Kälj)'	,
		'wo'	:	'Wolof'	,
		'jbo'	:	'Lojban'	,
		'av'	:	'Авар'	,
		'srn'	:	'Sranantongo'	,
		'cbk-zam'	:	'Chavacano de Zamboanga'	,
		'bxr'	:	'Буряад'	,
		'ty'	:	'Reo Mā`ohi'	,
		'lo'	:	'ລາວ'	,
		'kbd'	:	'Адыгэбзэ (Adighabze)'	,
		'ab'	:	'Аҧсуа'	,
		'tet'	:	'Tetun'	,
		'mwl'	:	'Mirandés'	,
		'ltg'	:	'Latgaļu'	,
		'na'	:	'dorerin Naoero'	,
		'kg'	:	'KiKongo'	,
		'ig'	:	'Igbo'	,
		'nso'	:	'Sesotho sa Leboa'	,
		'za'	:	'Cuengh'	,
		'kaa'	:	'Qaraqalpaqsha'	,
		'zu'	:	'isiZulu'	,
		'chy'	:	'Tsetsêhestâhese'	,
		'rmy'	:	'romani - रोमानी'	,
		'cu'	:	'Словѣньскъ'	,
		'tn'	:	'Setswana'	,
		'chr'	:	'ᏣᎳᎩ'	,
		'got'	:	'Gothic'	,
		'cdo'	:	'Mìng-dĕ̤ng-ngṳ̄'	,
		'sm'	:	'Gagana Samoa'	,
		'bi'	:	'Bislama'	,
		'mo'	:	'Молдовеняскэ'	,
		'bm'	:	'Bamanankan'	,
		'iu'	:	'ᐃᓄᒃᑎᑐᑦ'	,
		'pih'	:	'Norfuk'	,
		'ss'	:	'SiSwati'	,
		'sd'	:	'سنڌي، سندھی ، सिन्ध'	,
		'pnt'	:	'Ποντιακά'	,
		'ee'	:	'Eʋegbe'	,
		'ki'	:	'Gĩkũyũ'	,
		'om'	:	'Oromoo'	,
		'ha'	:	'هَوُسَ'	,
		'ti'	:	'ትግርኛ'	,
		'ts'	:	'Xitsonga'	,
		'ks'	:	'कश्मीरी / كشميري'	,
		'fj'	:	'Na Vosa Vakaviti'	,
		'sg'	:	'Sängö'	,
		've'	:	'Tshivenda'	,
		'rn'	:	'Kirundi'	,
		'cr'	:	'Nehiyaw'	,
		'ak'	:	'Akana'	,
		'tum'	:	'chiTumbuka'	,
		'lg'	:	'Luganda'	,
		'dz'	:	'ཇོང་ཁ'	,
		'ny'	:	'Chi-Chewa'	,
		'ik'	:	'Iñupiak'	,
		'ch'	:	'Chamoru'	,
		'ff'	:	'Fulfulde'	,
		'st'	:	'Sesotho'	,
		'tw'	:	'Twi'	,
		'xh'	:	'isiXhosa'	,
		'ng'	:	'Oshiwambo'	,
		'ii'	:	'ꆇꉙ'	,
		'cho'	:	'Choctaw'	,
		'mh'	:	'Ebon'	,
		'aa'	:	'Afar'	,
		'kj'	:	'Kuanyama'	,
		'ho'	:	'Hiri Motu'	,
		'mus'	:	'Muskogee'	,
		'kr'	:	'Kanuri'	,
		'hz'	:	'Otsiherero'
	};

	var language = langarray[langCode];

	return language;

}
