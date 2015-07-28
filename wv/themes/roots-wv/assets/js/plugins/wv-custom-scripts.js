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
var wikiverse_nav = '<div class="wikiverse-nav pull-left control-buttons"><i class="fa fa-youtube-square youtube-icon icon"></i>&nbsp;<i class="fa fa-flickr flickr-icon icon"></i>&nbsp;<i class="fa fa-instagram instagram-icon icon"></i></div>';
var defaultBrick = '<div class="brick">' + close_icon + '<span class="handle control-buttons"> <i class="fa fa-arrows"></i></span></div>';

var is_root = location.pathname == "/";

$('.selectpicker').selectpicker();

getSearchBricks();

// initialize Packery
var packery = $packeryContainer.packery({
	itemSelector: '.brick',
	stamp: '.search',
	gutter: 5,
	transitionDuration: 0,
//	columnWidth: 260
//	columnWidth: '.brick',
//	rowHeight: 60,
//	isInitLayout: false
});	

$packeryContainer.find('div.brick').each( makeEachDraggable );

//var container = document.querySelector('.packery');
//var pckry = Packery.data( container );

//----------------GENERAL STUFF----------------------------

//----------------EVENTS----------------------------

// REMOVE ITEM
$packeryContainer.on( "click", ".brick .cross", function() {
	var $thisBrick = jQuery(this).parent(".brick");
	$packeryContainer.packery( 'remove', $thisBrick );
	$packeryContainer.packery();
});

// REMOVE ITEM
$packeryContainer.on( "click", ".search .cross", function() {
	var $thisBrick = jQuery(this).parent(".search");
	$thisBrick.addClass('invisible');
	$packeryContainer.packery();
});

if(!is_root){

	// Stop scrolling when click anywhere
	$(document).on( "click", function(e) {
		if(!$('#play').is(":visible") ){
			stopBoard();
		}		
	});

}


//----------------keyboard shortcuts----------------------------


//make the enter keypress do the search
$(".search input:text").keyup(function (e) {
    if (e.keyCode == 13) {
       $(e.target).siblings('span').find('button').trigger('click');
    }
});


document.addEventListener("keydown", function(e) {
  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    $('#saveboard').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 107) {
    e.preventDefault();
    $('#zoom_in').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 109) {
    e.preventDefault();
    $('#zoom_out').trigger('click');
  }
}, false);


document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 87) {
    e.preventDefault();
    $('li#wikipedia').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 89) {
    e.preventDefault();
    $('li#youtube').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 71) {
    e.preventDefault();
    $('li#gmaps').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 70) {
    e.preventDefault();
    $('li#flickr').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 73) {
    e.preventDefault();
    $('li#instagram').trigger('click');
  }
}, false);

document.addEventListener("keydown", function(e) {
  if (!($("input").is(":focus")) && e.keyCode == 65) {
    e.preventDefault();
    $('li#instagram').trigger('click');
    $('li#gmaps').trigger('click');
    $('li#flickr').trigger('click');		
    $('li#soundcloud').trigger('click');
    $('li#wikipedia').trigger('click');
    $('li#youtube').trigger('click');
  }
}, false);

//----------------keyboard shortcuts----------------------------
//
//create youtube interconnection button and trigger search
$packeryContainer.on("click", ".youtube-icon", function(){

	$youtubeSearchBrick.removeClass("invisible");
	$packeryContainer.prepend($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);
	$youtubeSearchBrick.each( makeEachDraggable );
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
	$flickrSearchBrick.each( makeEachDraggable );
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
	$instagramSearchBrick.each( makeEachDraggable );
	$packeryContainer.packery();

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");

	$instagramSearchBrick.find('input').val(topic.title);

	//$flickrSearchBrick.find('.searchbox').attr('disabled', 'true');
	//$flickrSearchBrick.find('.start').addClass('disabled');

	getInstagrams(topic.title, "hashtag");

});



//show save board button on packery change (needs work)
$packeryContainer.packery( 'on', 'layoutComplete', function( pckryInstance, laidOutItems ) {

	//cant use show() or fadeIn() coz it messes up the bootstrap nav
	$(".board-pilot").css('display', 'block');

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
	$flickrSearchBrick.each( makeEachDraggable );
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
	$instagramSearchBrick.each( makeEachDraggable );
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

//Toggle Size of Images on click
$packeryContainer.on( 'click', 'img', function( event ) {

	var $brick= $( event.target ).parents('.brick');
  	var tempDataObj = $brick.data('topic');
  	var widthClass; 

  	// toggle the size for images
  	if($( event.target ).is('img.img-result')){

  		//make it large
  		$brick.toggleClass("w2");

  		//if it is large, update the dataObj so it saves the state
  		if($brick.hasClass("w2")){
  			tempDataObj.size = 'large'; 			
  		}else{
  			tempDataObj.size = 'small';
  		}
  		//set the dataObj to data topic
  		$brick.data('topic', tempDataObj);
  		
  		// trigger layout
  		$packeryContainer.packery();
  	}

});

$packeryContainer.packery( 'on', 'layoutComplete', orderItems );
$packeryContainer.packery( 'on', 'dragItemPositioned', orderItems );

function getSearchBricks(){

//Global get SearchBoxes
$(".sources-menu li").on("click", function(event){

	//what are we searching for? wikipedia, soundcloud, etc
	var source = $(this).attr('id');

	//if searchbrick is not inside packery
	if(!($('#' + source + '-search','#packery').length == 1)) {

		$('#' + source + '-search').removeClass("invisible");
		$packeryContainer.prepend($('#' + source + '-search')).packery( 'prepended', $('#' + source + '-search'));
		$('#' + source + '-search').each( makeEachDraggable );	

		$packeryContainer.packery('fit', $('#' + source + '-search')[0], 0, 0);
		$packeryContainer.packery();

		//if its gmaps do the exception of running that func
		if(source === "gmaps") getGmapsSearch();

		$('#' + source + '-search').find('input[type=text]').focus();

	}
	else{
		 $('html, body').animate({
	        scrollTop: 0
	    }, 1000);
	}
});


$(".search .start").on("click", function(){
	
	var $searchBrick = $(this).parents('.search'); 

	switch ($searchBrick.attr('id')) {

	    case "wikipedia-search":
			
			var topic = $("#wiki-searchinput").val();
			getWikis( topic, lang );

	    break;

	    case "flickr-search":
			var flickrType = $("#flickrType").val();
			var query = $("#flickr-search .searchbox").val();
			var sort = $("#flickr-search .radio-inline input[type='radio']:checked").val();

			getFlickrs(query, sort, flickrType);
	    break;

	    case "instagram-search":
			var query = $("#instagram-search .searchbox").val();
			var instagramType = $("#instagramType").val();

			getInstagrams(query, instagramType);
	    break;

	    case "youtube-search":
			var topic = $("#youtube-search .searchbox").val();
			getYoutubes( topic );
	    break;

	    case "soundcloud-search":			
			var query = $("#soundcloud-search .searchbox").val();
			var params = $("#soundcloud-search .radio-inline input[type='radio']:checked").val();

			getSoundcloud(query, params);
	    break;
	 }

});

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

}

function orderItems(packery, items) {

	var itemElems = $packeryContainer.packery('getItemElements');
	for ( var i=0, len = itemElems.length; i < len; i++ ) {
		var elem = itemElems[i];

		$(elem).attr( "tabindex", i );
	}
}


function isPortrait(imgObj){

	if(imgObj.width() < imgObj.height())
	{
	   return true;
	}else
	{
	   return false;
	}
}

//----------------EVENTS----------------------------



function buildNextTopic($brick, lang){

	$brick.find("a").unbind('click').click(function(e) {

		$packeryContainer.packery( 'stamp', $brick );

		e.preventDefault();

		var topic = $(this).attr("title");
		$(this).contents().unwrap();

		var brickData = {
			title: topic,
			language: lang
		}

		var y = parseInt($brick.css('top'));
		var x = parseInt($brick.css('left'));

		var $thisBrick = buildBrick( x + 100, y);

		//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
		buildWikipedia($thisBrick, brickData, $brick.attr("tabindex") - 1, APIsContentLoaded);
		//$packeryContainer.packery( 'unstamp', $brick );
	});
}

var markers = [];
function getGmapsSearch(){

	var mapOptions = {
		center: {lat: 35, lng: 0},
		zoom: 1,
		//scrollwheel: false,
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

   google.maps.event.addListener(map, 'rightclick', function(event) {

   		marker.setVisible(false);
   		infowindow.close();

   		markers.forEach(function(marker){
   			marker.setMap(null);
   		});

        var droppedMarker = new google.maps.Marker({
	        position: event.latLng,
	        map: map
	    });

		infowindow.setContent('get photos from: <br><br>' +
			'<span class="instagram"><i class="fa fa-instagram"></i></span>' + 
			'<span class="flickr-search"><i class="fa fa-flickr"></i></span>');

        infowindow.open(map, droppedMarker);
		markers.push(droppedMarker);

		//find the location of the marker
		var positionUrlString = droppedMarker.getPosition().toUrlValue();

		//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
		$gmapsSearchBrick.data('position', positionUrlString);
		$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

        //$gmapsSearchBrick.find(".fa-instagram, .fa-flickr").fadeIn("slow");
    });

	google.maps.event.addListener(autocomplete, 'place_changed', function() {

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

		infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + 
			'<br><br>get photos from: ' +
			'<span class="instagram"><i class="fa fa-instagram"></i></span>' + 
			'<span class="flickr-search"><i class="fa fa-flickr"></i></span>');

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

function buildGmaps($mapbrick, mapObj, callback){

	var map;
	var myMaptypeID;
	var currentMap;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map_canvas"></div>');

	$mapbrick.data('type', 'gmaps');
	$mapbrick.data('position', mapObj.center);
	$mapbrick.data('bounds', mapObj.bounds.southWest + "," + mapObj.bounds.northEast);

	$mapbrick
		.addClass('w3-fix')
		.addClass('gmaps');
	
	$mapbrick.prepend($mapcanvas)

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
		//scrollwheel: false,
		mapTypeId: myMaptypeID
	};

	map = new google.maps.Map($mapcanvas[0], mapOptions);

	map.fitBounds(myBounds);

	callback($mapbrick);

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

function buildStreetMap($mapbrick, streetObj, callback) {

	var currentStreetMap;

	var $mapcanvas = $('<div id="map_canvas"></div>');

	$mapbrick.data('type', 'streetview');
	$mapbrick.addClass('w3-fix');
	$mapbrick.prepend($mapcanvas);

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
	
	callback($mapbrick);

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

function buildFoto($brick, photoObj, type, callback){

	$brick.addClass('foto');	

	var $photo = $('<img class="img-result" owner="' + photoObj.owner + '" src="' + photoObj.mediumURL + '">');

	$brick.data('type', type);
	$brick.data('topic', photoObj);

	$brick.append($photo);

	var imgLoad = imagesLoaded( $brick );

	imgLoad.on( 'progress', function( imgLoad, image ) {
		if ( !image.isLoaded ) {
		  	return;
		}
		if(photoObj.size === "large") $brick.addClass('w2');
		$packeryContainer.packery();
		callback($brick);	
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

	if(!$flickrSearchBrick.hasClass("w2")){
		$flickrSearchBrick.addClass("w2");
		$packeryContainer.packery();
	} 

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
				console.log(data)
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

	if (typeof apiData.sizes.size !== 'undefined' && apiData.sizes.size.length > 0 && typeof apiData.sizes.size[6] !== 'undefined') {										
											
		var thumbURL = apiData.sizes.size[1].source;
		var mediumURL = apiData.sizes.size[6].source;

		$flickrSearchBrick.find('.results').append('<img width="149" owner="' + photoObj.owner + '" large="' + mediumURL + '" thumb="' + thumbURL + '" src="' + thumbURL + '">');

		imagesLoaded( '#flickr-search .results', function() {
			$packeryContainer.packery();
		});

		var y = parseInt($flickrSearchBrick.css('top'));
		var x = parseInt($flickrSearchBrick.css('left'));

		$flickrSearchBrick.find('img').unbind('click').click(function(e) {

			//stamp for better clicking
			$packeryContainer.packery( 'stamp', $flickrSearchBrick );

			var thisPhoto = {

				thumbURL: $(this).attr('thumb'),
				mediumURL: $(this).attr('large'),
				size: 'small',
				owner: $(this).attr('owner')

			}
			var $thisBrick = buildBrick(parseInt($flickrSearchBrick.css('left')) + 450, parseInt($flickrSearchBrick.css('top')) + 100);

			buildFoto($thisBrick, thisPhoto, "flickr", APIsContentLoaded);
			$(this).remove();

			//unstamp the searchbrick so you can move it again around
			//$packeryContainer.packery( 'unstamp', $flickrSearchBrick );

		});

		$flickrSearchBrick.find('.search-ui').show();
	}
}

function createInstagramBrick(photo){

	$instagramSearchBrick.find('.results').append('<img class="img-search" width="149" fullres="' + photo.images.standard_resolution.url + '" src="' + photo.images.low_resolution.url + '">');

	imagesLoaded('#instagram-search .results', function() {
		$packeryContainer.packery();
	});

	var y = parseInt($instagramSearchBrick.css('top'));
	var x = parseInt($instagramSearchBrick.css('left'));

	$instagramSearchBrick.find('img').unbind('click').click(function(e) {

		//stamp for better clicking
		$packeryContainer.packery( 'stamp', $instagramSearchBrick );

		var thisPhoto = {
			mediumURL: $(this).attr('fullres'),
			smallURL: $(this).attr('src'),
			size: 'small'
		}
		var $thisBrick = buildBrick(parseInt($instagramSearchBrick.css('left')) + 450, parseInt($instagramSearchBrick.css('top')) + 10);

		buildFoto($thisBrick, thisPhoto, "instagram", APIsContentLoaded);
		$(this).remove();

		//unstamp the searchbrick so you can move it again around
		//$packeryContainer.packery( 'unstamp', $instagramSearchBrick );

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

	$('#instagram-search .results').empty();
	
	if(!$instagramSearchBrick.hasClass("w2")){
		$instagramSearchBrick.addClass("w2");
		$packeryContainer.packery();
	} 

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

function buildSoundcloud($brick, soundcloudObj, callback){

	$brick.addClass('w3-fix');

	var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

	$brick.data('type', 'soundcloud');
	$brick.data('topic', soundcloudObj);

	$brick.append($soundcloudIframe);
	callback($brick);
}

function getSoundcloud(query, params) {

	$('#soundcloud-search .results').empty();

	SC.initialize({
	  client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
	});

	SC.get('/tracks', { q: query }, function(tracks) {

		tracks.forEach(function(track, index){

			//append row to searchbox-table
			$soundcloudSearchBrick.find('.results').append('<tr data-toggle="tooltip" title="' + track.title + '" uri="' + track.uri + '" genre="' + track.genre + '"><td><el class="result">' + track.title + '</el></td></tr>');

			//create the tooltips
			$('tr').tooltip({animation: true, placement: 'right'});


			var y = parseInt($soundcloudSearchBrick.css('top'));
			var x = parseInt($soundcloudSearchBrick.css('left'));

			//bind event to every row
			$soundcloudSearchBrick.find('tr').unbind('click').click(function(e) {

				//stamp it for better clicking
				$packeryContainer.packery( 'stamp', $soundcloudSearchBrick );

				var soundcloudObj = {
					title: $(this).attr('title'),
					uri: $(this).attr('uri'),
					genre: $(this).attr('genre')
				}

				var $thisBrick = buildBrick(parseInt($soundcloudSearchBrick.css('left')) + 50, parseInt($instagramSearchBrick.css('top')) + 10);
				
				buildSoundcloud($thisBrick, soundcloudObj, APIsContentLoaded);

				$(this).tooltip('destroy');
				$(this).remove();

				//unstamp the searchbrick so you can move it again around
				//$packeryContainer.packery( 'unstamp', $soundcloudSearchBrick );

				//relayout packery
				$packeryContainer.packery();

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
			buildYoutubeSearchResults(data);
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
				var langDropDown = $('<select class="selectpicker pull-right languages show-menu-arrow" data-size="20" data-live-search="true"></select>');

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
					var $thisBrick = buildBrick(thisX, thisY);
					//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
					buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), APIsContentLoaded);
				});
				$packeryContainer.packery();
			}
		}
	});

}

function getRelatedYoutubes(videoID) {

	$('#youtube-search .results').empty();

	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/search',
		data:{
			relatedToVideoId: videoID,
			key: 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
			part: 'snippet',
			type: 'video',
			maxResults: 25
		},
		dataType:'jsonp',
		success: function(data){
			buildYoutubeSearchResults(data);			
		}
	});
}


function buildYoutubeSearchResults(apiData){

	if (typeof apiData.items !== 'undefined' && apiData.items.length > 0) {

		$.each(apiData.items, function(){			

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
			$('tr').tooltip({animation: true, placement: 'right'});

			//bind event to every row -> so you can start the wikiverse
			$youtubeSearchBrick.find('tr').unbind('click').click(function(e) {

				//stamp for better clicking
				$packeryContainer.packery( 'stamp', $youtubeSearchBrick );

				var currentYoutubeID = $(this).find('.result').attr('youtubeID');

				$(this).tooltip('destroy');
				$(this).remove();

				var $thisBrick = buildBrick(parseInt($youtubeSearchBrick.css('left')) + 50, parseInt($youtubeSearchBrick.css('top')) + 10);

				buildYoutube($thisBrick, currentYoutubeID, APIsContentLoaded);

				return false;
			});

		});
	//nothing has been found on youtube
	}else{
		//append row to searchbox-table: NO RESULTS
		$youtubeSearchBrick.find('.results').append('<tr class="no-results"><td>No Youtube Videos found .. </td></tr>');
	}
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

				var interWikiDropDown = $('<select class="pull-right points-to show-menu-arrow" data-size="20"></select>');

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
					var $thisBrick = buildBrick(thisX, thisY);
					buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), APIsContentLoaded);
				});

				$packeryContainer.packery();
			}
		}
	});

}

function getWikis(topic, lang) {

	$('#wikipedia-search .results').empty();

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'query',
			list:'search',
			srsearch:topic,
			format:'json',
			srlimit: 40
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
					$('tr').tooltip({animation: false, placement: 'right'});
					//bind event to every row -> so you can start the wikiverse
					$wikiSearchBrick.find('tr').unbind('click').click(function(e) {

						//stamp the searchbrick for better clicking
						$packeryContainer.packery( 'stamp', $wikiSearchBrick );

						var topic = {
							title: $(this).find('.result').html(),
							language: lang
						}
						var $thisBrick = buildBrick(parseInt($wikiSearchBrick.css('left')) + 50, parseInt($wikiSearchBrick.css('top')) + 10);

						//build the wikis next to the search brick
						buildWikipedia($thisBrick, topic, -1, APIsContentLoaded);

						$(this).tooltip('destroy');
						$(this).remove();

						//unstamp the searchbrick so you can move it again around
						//$packeryContainer.packery( 'unstamp', $wikiSearchBrick );

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

function buildBrick(x, y){

	var $brick = $(defaultBrick);

	$packeryContainer.append($brick).packery( 'appended', $brick);
	$brick.each( makeEachDraggable );

   	$packeryContainer.packery('fit', $brick[0], x, y);
  


	return $brick;
}

function APIsContentLoaded($brick){

	$brick.fadeTo( "slow", 1); 
}

function buildWikipedia($brick, topic, parent, callback){

	$brick.data('type', 'wiki');
	$brick.data('parent', parent);
	$brick.data('topic', topic);
	
	$brick.addClass('wiki');

	$brick.prepend('<h2>' + topic.title + '</h2>');

	if(!is_root) $brick.prepend( wikiverse_nav );

   	if(!is_root){
		$.ajax({
			url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
			data:{
				action:'parse',
				page: topic.title,
				format:'json',
				prop:'sections',
				mobileformat:true
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

						$packeryContainer.packery( 'stamp', $brick );

						var section = {

							title: topic.title,
							language: topic.language,
							index: $(this).attr("index")
						}

						$(this).parents('tr').remove();

						var newY = parseInt($brick.css('top'));
						var newX = parseInt($brick.css('left'));

						var $thisBrick = buildBrick(newX, newY);
						buildSection($thisBrick, section, $brick.attr("tabindex"), APIsContentLoaded);
						
						//$packeryContainer.packery( 'unstamp', $brick );
					});
				}		

				$packeryContainer.packery();
				
			}
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
								iiurlwidth: 300
							},
							dataType:'jsonp',
							success: function(data){
			
								//get the first key in obj
								//for (first in data.query.pages) break;
								//now done better like this:

								var imageUrl = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
								var image = $('<img src="' + imageUrl + '">');

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

				if(!is_root) getWikiLanguages(topic.title, topic.language, $brick);
				callback($brick);	
			}
		}
	});
}


function buildSection($brick, section, parent, callback){

	$brick.data('type', 'wikiSection');
	$brick.data('parent', parent);
	$brick.data('topic', section);

	$brick.addClass('wiki');

	$brick.prepend('<p><h2>' + section.title + '</h2></p>');
	if(!is_root) $brick.prepend( wikiverse_nav );

	$brick.addClass('borderBottom');

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
			
			if(!is_root){
				var sectionHTML = $(data.parse.text['*']);
			}else{
				var sectionHTML = $(data.parse.text['*']).find('p:first');
			}
			//var completeSection = $(data.parse.text['*']).find('p:first');

			sectionHTML.find('.error').remove();
			sectionHTML.find('.reference').remove();
			sectionHTML.find('.references').remove();
			sectionHTML.find('.notice').remove();
			sectionHTML.find('.ambox').remove();
			sectionHTML.find('.org').remove();
			sectionHTML.find('table').remove();
			//sectionHTML.find('*').css('max-width', '290px');
			sectionHTML.find('img').unwrap();

			//if image is bigger than 290, shrink it
			if(sectionHTML.find('img').width() > 250 || sectionHTML.find('img').attr("width") > 250){

				sectionHTML.find('img').attr('width', 250);
				sectionHTML.find('img').removeAttr('height');
			}
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
			if(!is_root) getInterWikiLinks(section, $brick);
			callback($brick);	
			$packeryContainer.packery();
		}
	});
}


var boardsArray = $('#wikiverse').html();

/*JSON.parse(boardsArray).forEach(function(board, index){
	console.log(board);
});
*/

function buildboard(index){

	var boardArray = $("#wikiverse").html();

	var wikiverse =	JSON.parse(boardArray);
	var board = JSON.parse(wikiverse[index]);
	
	console.log(board);

	$packeryContainer.css('zoom', board.zoom);

	$.each(board.bricks, function(index, brick) {

		/*if(is_root && index % 3 === 0){

			var heights = ["hi1", "hi2"],
				widths = ["wi1", "wi2"],
				transparencies = ["1", "2", "3"];

			var $dummyBrick = $('<div class="brick ' + heights[Math.floor(Math.random()*heights.length)] + ' ' + widths[Math.floor(Math.random()*widths.length)] + ' transparent-' + transparencies[Math.floor(Math.random()*transparencies.length)] + '"><span class="handle"> <i class="fa fa-arrows"></i></span></div>');
			
			$packeryContainer.append($dummyBrick).packery( 'appended', $dummyBrick);
			$dummyBrick.each(makeEachDraggable);
		}*/

		var $thisBrick = buildBrick();

		switch (brick.Type) {
		    case "wiki":
				buildWikipedia($thisBrick, brick.Topic, brick.Parent, APIsContentLoaded);
		    break;

		    case "wikiSection":
				buildSection($thisBrick, brick.Topic, brick.Parent, APIsContentLoaded);
		    break;

		    case "flickr":
				buildFoto($thisBrick, brick.Topic, "flickr", APIsContentLoaded);
		    break;

		    case "instagram":
				buildFoto($thisBrick, brick.Topic, "instagram", APIsContentLoaded);
		    break;

		    case "youtube":
				buildYoutube($thisBrick, brick.Topic, APIsContentLoaded);
		    break;

		    case "gmaps":
				buildGmaps($thisBrick, brick.Topic, APIsContentLoaded);
		    break;

		    case "streetview":
				buildStreetMap($thisBrick, brick.Topic, APIsContentLoaded);
		    break;

		    case "soundcloud":
				buildSoundcloud($thisBrick, brick.Topic, APIsContentLoaded);
		    break;
		 }
		
	});
}


function buildYoutube($brick, youtubeID, callback){

	var relatedButton = '<button class="btn btn-default" onclick="getRelatedYoutubes(\'' + youtubeID + '\');" type="button">Related Videos</button>';
	var iframe = '<iframe class="" id="ytplayer" type="text/html" width="250" height="160" src="http://www.youtube.com/embed/'+youtubeID+'" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0"/>';

	$brick.data('type', 'youtube');
	$brick.data('topic', youtubeID);

    if(!is_root) $brick.append(relatedButton);
    $brick.append(iframe);

	$packeryContainer.packery();
	callback($brick);
}

function playBoard(){
	$('#play').fadeOut();

	//stop scrolling
	$('html, body').stop(true);
	
	//fadeout elems
	$('.brick .fa').fadeOut();
	$('nav').fadeTo('slow', 0.3);
	$('.wikiverse-nav').fadeOut();
	$('.selectpicker').css('visibility', 'hidden');
	$('html, body').animate({scrollTop:$(document).height()}, 50000);
	return false;
}

function stopBoard(){
	$('#play').fadeIn();
	$('html, body').stop(true);
	$('.brick .fa').fadeIn();
	$('nav').fadeTo('slow', 1);
	$('.wikiverse-nav').fadeIn();	
	$('.selectpicker').css('visibility', 'visible');
	//$('.selectpicker').selectpicker('refresh');
	$('html, body').animate({scrollTop:0}, 'fast');
	return false;
}

function zoomIn(){

	var zoomLevel = Math.round(parseFloat($packeryContainer.css("zoom")) * 10) / 10;
	//var controlsSize = parseInt($('.control-buttons .fa').css("font-size"));

	if(zoomLevel < 1.6){
		$("#zoom_in").prop('disabled', false);
		zoomLevel += 0.1;
		//controlsSize -= 5;
	}
	else{
		$("#zoom_in").prop('disabled', true);
		zoomLevel -= 0.1;
		//controlsSize += 5;
	}
	$packeryContainer.css("zoom", zoomLevel);
	/*console.log(controlsSize)
	$('.control-buttons .fa').css("font-size", controlsSize);*/
	$packeryContainer.packery();
}

function zoomOut(){

	var zoomLevel = Math.round(parseFloat($packeryContainer.css("zoom")) * 10) / 10;
	//var controlsSize = parseInt($('.control-buttons .fa').css("font-size"));

	if(zoomLevel >= 0.7){
		$("#zoom_out").prop('disabled', false);
		zoomLevel -= 0.1;
		//controlsSize += 5;
	}
	else{
		$("#zoom_out").prop('disabled', true);
		zoomLevel += 0.1;
		//controlsSize -= 5;
	}
	$packeryContainer.css("zoom", zoomLevel);
	/*console.log(controlsSize)
	$('.control-buttons .fa').css("font-size", controlsSize);*/
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

function createboard(wpnonce) {
	var wikiverse = {};

	var board = {
		"zoom": Math.round(parseFloat($packeryContainer.css('zoom')) * 10) / 10,
		"bricks": wikiverse
	};

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

	var JSONwikiverse = JSON.stringify(board);

	$("#saveboardModal").modal('show');
	$("#boardTitle").focus();	
	
	$packeryContainer.packery();
	
	$('#boardTitle').keyup(function (e) {
		e.preventDefault();
		//enable the save board button
		$("#boardSubmitButton").prop('disabled', false);

		//make enter save the board
		if (e.keyCode == 13) {
	       $("#boardSubmitButton").trigger('click');
	    }
	});

	$("#boardSubmitButton").on("click", function(){

		var value=$.trim($("#boardTitle").val());

		if(value.length>0)
		{

			var title = $('#boardTitle').val();

			$.ajax({
				type: 'POST',
				url: "/wp-admin/admin-ajax.php",
				data: {
					action: 'apf_addpost',
					boardtitle: title,
					boardmeta: JSONwikiverse,
					nonce: wpnonce
				},
				success: function(data, textStatus, XMLHttpRequest) {
					var id = '#apf-response';
					$(id).html('');
					$(id).append(data);

					var url = data.split('-')[0];
					var ID = data.split('-')[1];

					//update the browser history and the new url
					history.pushState('', 'wikiverse', url);
					$('#postID').html(ID);
				},
				error: function(MLHttpRequest, textStatus, errorThrown) {
					alert("cdascsacsa");
				}
			});

			$("#saveboardModal").modal('hide');

			var nonce = $('#nonce').html()

			$('#saveboard').attr('onclick', 'saveboard("' + nonce + '")');
			$('#saveboard').attr('id', $('#saveboard').attr('id'));
			$('#saveboard').html('Save Changes');

		}
		else{

			$('#boardTitle').parent(".form-group").addClass("has-error");

		}

	});

}

function clearboard(wpnonce){
	if (confirm('Are you sure you want to clear this board?')) {
	   	$packeryContainer.empty();
		$packeryContainer.packery();
	} 
}



function saveboard(wpnonce) {

	var postid = $('#postID').html();

	var wikiverse = {};

	var board = {
		"zoom": Math.round(parseFloat($packeryContainer.css('zoom')) * 10) / 10,
		"bricks": wikiverse
	};

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

	var JSONwikiverse = JSON.stringify(board);

	$.ajax({
		type: 'POST',
		url: "/wp-admin/admin-ajax.php",
		data: {
			action: 'apf_editpost',
			boardID: postid,
			boardmeta: JSONwikiverse,
			nonce: wpnonce
		},
		success: function(data, textStatus, XMLHttpRequest) {
			var id = '#apf-response';
			$(id).html('');
			$(id).append(data);

			new PNotify({
			    text: 'board saved',
			    type: 'success',
			    icon: 'fa fa-floppy-o',
			    styling: 'fontawesome',
			    shadow: false,
			    animation: 'fade',
			    nonblock: {
			        nonblock: true,
			        nonblock_opacity: .2
			    }
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
