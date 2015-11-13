var WIKIVERSE = (function($) {
	
	'use strict';

	var wikiverse = {};

	var close_icon = '<span class="cross control-buttons"><i class="fa fa-close"></i></span>';
	var youtube_icon = '<i class="fa fa-youtube-square"></i>';
	var wikiverse_nav = '<select class="selectpicker connections show-menu-arrow" data-style="btn btn-default btn-xs" data-width="100%" data-size="20"><option selected="">try another source..</option><option><i class="fa fa-youtube-square youtube-icon icon"></i>Youtube</option><option><i class="fa fa-twitter twitter-icon icon"></i>Twitter</option><option><i class="fa fa-flickr flickr-icon icon"></i>Flickr</option><option><i class="fa fa-instagram instagram-icon icon"></i></div>Instagram</option><option><i class="fa fa-soundcloud soundcloud-icon icon"></i>Soundcloud</option></select>';
	var handle = '<div class="row handle"><p class="text-center"><i class="fa fa-hand-rock-o"></i>&nbsp;&nbsp;grab me here</p></div>';
	var defaultBrick = '<div class="brick well well-sm">' + close_icon + '</div>';
	var defaultMapBrick = '<div class="brick gmaps well well-sm">' + handle + close_icon + '</div>';
	var resultsTable = '<table class="table table-hover"></table>';
	var getInstagramsButton = '<button id="getInstagrams" class="btn btn-default btn-xs getFotos" type="button">get instragram fotos of this location</button>';
	var getFlickrsButton = '<button id="getFlickrs" class="btn btn-default btn-xs getFotos" type="button">get flickr fotos of this location</button>';
	var loadingIcon = '<span id="loading" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">';
	var note = '<textarea id="note" class="form-control" placeholder="add your own infos.." rows="3"></textarea>';

	//used for pNotify
	var myStack = {"dir1":"down", "dir2":"left", "push":"top"};

	var fruchtermanReingoldSettings = {
	   autoArea: true,
	   area: 1,
	   gravity: 10,
	   speed: 0.1,
	   iterations: 1000
	 };

	 var nodeSettings = {
	 	Wikipedia: 	["\uF266", "#000"],
	 	wikiSection:["\uF266", "#000"],
	 	Twitter: 	["\uF099", "#2CB8E3"],
	 	Youtube: 	["\uF167", "#CC181E"],
	 	Instagram: 	["\uF16d", "#2E5F80"],
	 	Flickr: 	["\uF16e", "#FF0085"],
	 	Soundcloud: ["\uF1be", "#FF6700"],
	 	searchQuery: ["\uF002", "#000"],
	 }

	//var is_root = location.pathname === "/";

	var wpnonce = $('#nonce').html();

	//topbrick is the toppest brick in regards to the scroll position
	//this is used to insert bricks at the same height of the scroll position
	var $topBrick = $(defaultBrick);	
	var $packeryContainer = $('.packery');

	var $results = $('.results');
	var $searchKeyword = $('#search-keyword');
	var $sidebar = $('#sidebar');

	//	$('#packery').imagesLoaded( function() {
	// initialize Packery
	var packery = $packeryContainer.packery({
		itemSelector: '.brick',
		//stamp: '.search',
		gutter: 10,
		transitionDuration: 0,
		columnWidth: 225,
		//  columnWidth: '.brick',
		//  rowHeight: 60,
		//  isInitLayout: false
	});
	//	});

	// --------FUNCTION DEFINITIONS
	// These are defined here for JSHint function order checking
	var buildFlickrSearchResults,
		buildInstagramSearchResults,
		buildFoto,
		buildYoutubeSearchResults,
		makeEachDraggable,
		playYoutube,
		destroyBoard,
		getLanguage;

		//initiate the wikiverse search functionality
		wikiverse.init = function() {

			wikiverse.searchHistory = {}; 
			wikiverse.thisBoardsIDs = [];

			sigma.classes.graph.addMethod('neighbors', function(nodeId) {
			   var k,
			       neighbors = {},
			       index = this.allNeighborsIndex[nodeId] || {};

			   for (k in index)
			     neighbors[k] = this.nodesIndex[k];

			   return neighbors;
			 });
			
			sigma.classes.graph.addMethod('getNodesById', function() {
			  return this.nodesIndex;
			});

			wikiverse.mindmap = new sigma({
			  renderer: {
			    container: document.getElementById('mindmap'),
			    type: 'canvas'
			  },
			  settings: {
			    doubleClickEnabled: false,
			    minEdgeSize: 1,
			    maxEdgeSize: 3,
			    minNodeSize: 5,
			    maxNodeSize: 15,
			    enableEdgeHovering: true,
			    edgeHoverColor: 'edge',
			    defaultEdgeHoverColor: '#000',
			    labelThreshold: 15,
			    edgeHoverSizeRatio: 1,
			    edgeHoverExtremities: true
			  }
			});

			graphEventHandlers();


			new SVGMenu( document.getElementById( 'sidebar' ) );


			//but also open the search if clicked
			$('.searchButton').on('click', function(event) {
				event.preventDefault();
				wikiverse.toggleSearch();

				//Close the sidebar, if open:
				/*if ($('body').hasClass('cbp-spmenu-push-toright')) {
					toggleSidebar();
				}*/
			});

			//close the search
			$('.search, .search button.close').on('click', function(event) {
				if (event.target.className === 'close') {
					$(this).removeClass('open');
				}
			});

			//adding escape functionality for closing search
			$(document).keyup(function(e) {
				if ($('.search').hasClass('open') && e.keyCode === 27) { // escape key maps to keycode `27`
					$('.search').removeClass('open');
				}
			});

			//detect top element
			$(document).scroll(function() {
				var scrollTop = $(window).scrollTop();
				var windowHeight = $(window).height();		
				var first = false;
				$(".brick").each( function() {
					var offset = $(this).offset();
					if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight) && first == false) {
						$(this).addClass("top");

						$topBrick = $(this);

						first=true;
					} else {
						$(this).removeClass("top");
						first=false;
					}
				});
			});

			$("#wv_search").on("click", function() {

				//get the query from the search div
				var query = $("#searchInput input").val();	
				
				getWikis(query, "en", searchResultsLoaded);
				getSoundclouds(query, searchResultsLoaded);
				getTweets(query, searchResultsLoaded);
				getYoutubes(query, searchResultsLoaded);
				getFlickrs(query, "relevance", "textQuery", searchResultsLoaded);
				getInstagrams(query, "hashtag", searchResultsLoaded);

				//reset the searchkeyword parent so that there is no parent, and thus a new searhquery node is created
				$searchKeyword.removeData('parent');

			});

			var lang = "en";

			/*$('#langselect').live('change', function() {
				lang = $(this).val();
			});*/

			$(".source").on("click", function() {
				
				var query = $("#searchInput input").val();
				
				//close the search
				$('.search').removeClass('open');

				//if not already open, open the sidebar:
				if (!$('body').hasClass('cbp-spmenu-push-toright')) {
					toggleSidebar();
				}
				
				prepareSearchNavbar(query);

				var thisResultsArray = $(this).data("results");
				var functionToBuildSearchResults = $(this).attr("fn");

				wikiverse[functionToBuildSearchResults](thisResultsArray, searchResultsListBuilt);

			});

			$("#addMap").on("click", function() {
				
				var $mapDefaultBrick = $(defaultMapBrick);
				var $thisBrick = buildGmapsBrick(parseInt($mapDefaultBrick.css('left')), parseInt($mapDefaultBrick.css('top')));

				getGmapsSearch($thisBrick);

			});

			/*$("#addNoteButton").on("click", function() {
				//close the search
				$('#search').removeClass('open');

				var $noteBrick = buildBrick();

				createNote($noteBrick, brickDataLoaded);
			});*/

		}

	//toggles the image size on click (works also for youtube)
	function toggleImageSize( event ) {
		
		var $brick = $(event.target).parents('.brick');
		var tempDataObj = $brick.data('topic');

	     // toggle the size for images
	     if($( event.target ).is('img.img-result, .youtube img')){

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

	       $packeryContainer.packery();
	   }
	 }

	//get the username for any given flickr picture 
	function getFlickrUsername(user_id, callback) {

		$.ajax({
			url: 'https://api.flickr.com/services/rest',
			data: {

				method: 'flickr.people.getInfo',
				api_key: '1a7d3826d58da8a6285ef7062f670d30',
				user_id: user_id,
				format: 'json',
				nojsoncallback: 1,
				per_page: 40
			},
			success: function(data) {
				if (data.stat === "ok") {
					callback(data.person.username._content);
				}
			}
		});
	}

	//clean up the sidebar navbar for the new search
	function prepareSearchNavbar(query, parent){

		//empty the search results
		$results.empty();
		$sidebar.find("#loading").remove();
		
		//empty the searchkeyword and re-fill it with new search query
		$searchKeyword.empty();
		$searchKeyword.append(query.toLowerCase());

		//store the parent in case it is passed, in case we are getting a connection from the board
		if(parent){
			$searchKeyword.data('parent', parent);
		}

		//create a loading icon
		$sidebar.append(loadingIcon);

	}


	//callback for when API search results are loaded
	function searchResultsLoaded(results, source, triggerSearchResultsFunction){

		//	
		if (results.length > 0) {

			$('#' + source).show();
			$('#searchResults h3').show();

			//create the incrementing number animation
			var number = 0;
			var interval = setInterval(function() {

		       $('#' + source).text(source + " " + number);

		        if (number >= results.length) clearInterval(interval);
		        number++;
		    }, 30);	

			//store the results inside the source-button
		    $('#' + source).data("results", results);

		    //this is used in order to fire the searchresults in the sidebar
		    if(triggerSearchResultsFunction){
		    	wikiverse[triggerSearchResultsFunction](results, searchResultsListBuilt);
		    }
		}
		else{
			$results.append("Nothing found for " + $searchKeyword.html() + " on " + source);
			$results.append(". \n\nTry another source or look for something else: ");

			//remove the loading icon when done
			$sidebar.find("#loading").remove();	
		}	
	}

	function isPortrait(imgElement) {

		if (imgElement.width() < imgElement.height()) {
			return true;
		} else {
			return false;
		}
	}

	//callback foor content loaded into brick
	function brickDataLoaded($brick) {

		$brick.fadeTo('slow', 1);
		$packeryContainer.packery();
	}

	function buildYoutubeResultArray(data, topic, dataLoaded, triggerFunction){

		var resultsArray = data.items.map(function(item, index){

			return {
				Topic: {							
					title: item.snippet.title,
					snippet: item.snippet.description,
					youtubeID: item.id.videoId,
					query: topic,
					thumbnailURL: item.snippet.thumbnails.high.url		
				},
				Type: "Youtube"
			};			
		});

		dataLoaded(resultsArray, "Youtube", triggerFunction);
	}

	//search youtube videos
	function getYoutubes(topic, dataLoaded, triggerFunction) {

		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				q: topic,
				key: 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
				part: 'snippet',
				maxResults: 50
			},
			dataType: 'jsonp',
			success: function(data) {
				buildYoutubeResultArray(data, topic, dataLoaded, triggerFunction);
			}
		});
	}

	//search for related youtube videos
	function getRelatedYoutubes(videoID, origQuery, dataLoaded, triggerFunction, parent) {

		prepareSearchNavbar(origQuery, parent);

		//Open the sidebar:
		if (!$('body').hasClass('cbp-spmenu-push-toright')) {
			toggleSidebar();
		}

		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				relatedToVideoId: videoID,
				key: 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
				part: 'snippet',
				type: 'video',
				maxResults: 25
			},
			dataType: 'jsonp',
			success: function(data) {
				buildYoutubeResultArray(data, origQuery, dataLoaded, triggerFunction);
			}
		});
	}

	//function used within validate coordinates
	function inrange(min, number, max) {
		if (!isNaN(number) && (number >= min) && (number <= max)) {
			return true;
		} else {
			return false;
		}
	}

	//validate if it is a coordinate
	function valid_coords(number_lat, number_lng) {
		if (inrange(-90, number_lat, 90) && inrange(-180, number_lng, 180)) {
			$("#btnSaveResort").removeAttr("disabled");
			return true;
		} else {
			$("#btnSaveResort").attr("disabled", "disabled");
			return false;
		}
	}

	//build an empty brick
	function buildGmapsBrick(x, y) {

		var $brick = $(defaultMapBrick);

		$packeryContainer.append($brick).packery('appended', $brick);
		$brick.each(makeEachDraggable);

		$packeryContainer.packery('fit', $brick[0], x, y);
		$packeryContainer.packery();

		return $brick;
	}

	//for Wikipedia, trigger the next brick on click of links
	function buildNextTopic($brick, lang) {

		$brick.find(".article a, .section a").unbind('click').click(function(e) {

			e.preventDefault();

			//stamp this brick so it doesnt move around
			$packeryContainer.packery('stamp', $brick);

			//get the new wikipedia topic from the a element
			var topic = $(this).attr("title");

			//unwrap the a element
			$(this).contents().unwrap();

			var wikiData = {
				title: topic,
				language: lang
			};

			var $nextBrick = buildBrick([parseInt($brick.css('left') + 500), parseInt($brick.css('top') + 500)], undefined, $brick.data('id'));

			wikiverse.buildWikipedia($nextBrick, wikiData, brickDataLoaded);

			var brickData = {
				Topic: wikiData,
				Type: "Wikipedia",
				Id: $nextBrick.data('id')
			}

			//unstamp it after everything is done
			$packeryContainer.packery('unstamp', $brick);

			buildNode(brickData, $nextBrick.data('id'), $brick.data('id'));
		});
	}
	//toggle the sidebar
	function toggleSidebar() {

		classie.toggle(document.body, 'cbp-spmenu-push-toright');
		classie.toggle($('#sidebar')[0], 'cbp-spmenu-open');
		classie.toggle($('#sidebar')[0], 'autoOverflow');
		classie.toggle($('#searchMeta')[0], 'fixed');

	}

	//toggle the sidebar
	function toggleRightSidebar() {

		classie.toggle(document.body, 'cbp-spmenu-push-toleft');
		classie.toggle($('#rightSidebar')[0], 'cbp-spmenu-open');
		classie.toggle($('#rightSidebar')[0], 'autoOverflow');

		//close and plus button logic 
		//if sidebar open, hide the plus
		if($('#rightSidebar').hasClass('cbp-spmenu-open')){
			$('#openRightSidebar').addClass('invisible');
			sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
			wikiverse.mindmap.refresh();
		}else{
			$('#openRightSidebar').removeClass('invisible');
		}

	}

	//get the pictures for given location of a map (instagram and flickr)
	function getGmapsFotos($mapsBrick){

		$mapsBrick.find('.getFotos').on('click', function() {

			var position = $(this).parents(".brick").data("position");

			prepareSearchNavbar(position);

			//Open the sidebar:
			if (!$('body').hasClass('cbp-spmenu-push-toright')) {
				toggleSidebar();
			}
			if($(this).attr('id') === "getInstagrams"){
				getInstagrams(position, "coordinates", searchResultsLoaded, "buildFotoSearchResults");
			}
			else {
				getFlickrs(position, "relevance", "geoQuery", searchResultsLoaded, "buildFotoSearchResults");
			}
		});
	}

	var markers = [];

	//create the gmaps brick (first time creation)
	function getGmapsSearch($gmapsSearchBrick) {

		$gmapsSearchBrick.addClass('w2-fix visible');
		
		//build a search input
		var $input = $('<input class="controls" type="text" placeholder="Enter a location">');

		//append some markup to the gmaps brick
		$gmapsSearchBrick.append('<div id="map_canvas"></div>');
		$gmapsSearchBrick.append($input);		

		$gmapsSearchBrick.append(getInstagramsButton);
		$gmapsSearchBrick.append(getFlickrsButton);
		
		//getGmapsFOtos includes click event to fetch fotos
		getGmapsFotos($gmapsSearchBrick);

		var mapOptions = {
			center: {
				lat: 35,
				lng: 0
			},
			zoom: 1,
			//scrollwheel: false,
		};

		var map = new google.maps.Map($gmapsSearchBrick.find('#map_canvas')[0], mapOptions);

		//get the vanilla input, gmaps needs it like that
		var input = $input[0];

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

			infowindow.setContent('<div><strong>' + place.name + '</strong>');

			infowindow.open(map, marker);
		});

		 // do something only the first time the map is loaded
		google.maps.event.addListenerOnce(map, 'idle', function(){
			$packeryContainer.packery();
		});

		google.maps.event.addListener(map, 'idle', function() {

			var currentMap = {
				center: map.getCenter().toUrlValue(),
				bounds: {
					southWest: map.getBounds().getSouthWest().toUrlValue(),
					northEast: map.getBounds().getNorthEast().toUrlValue()
				},
				maptype: map.getMapTypeId()
			};

			$gmapsSearchBrick.data("type", "gmaps");
			$gmapsSearchBrick.data("topic", currentMap);

			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$gmapsSearchBrick.data('position',  map.getCenter().toUrlValue());
			$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

		});

		google.maps.event.addListener(map, 'maptypeid_changed', function() {

			currentMap.maptype = map.getMapTypeId();

			$gmapsSearchBrick.data("topic", currentMap);

			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$gmapsSearchBrick.data('position',  map.getCenter().toUrlValue());
			$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

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
				$gmapsSearchBrick.data("type", "streetview");
				$gmapsSearchBrick.data("topic", currentStreetMap);

				//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
				$gmapsSearchBrick.data('position',  map.getCenter().toUrlValue());
				$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());
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
				$gmapsSearchBrick.data("topic", currentStreetMap);

				//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
				$gmapsSearchBrick.data('position',  map.getCenter().toUrlValue());
				$gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());
			}

		});
	}

	//build the gmaps brick (coming from database)
	wikiverse.buildGmaps = function($mapbrick, mapObj, callback) {

		var map;
		var myMaptypeID;
		var currentMap;
		var currentStreetMap;

		//$mapbrick.append('<input id="pac-input" class="controls" type="text" placeholder="Enter a location">')

		var $mapcanvas = $('<div id="map_canvas"></div>');

		$mapbrick.data('type', 'gmaps');
		$mapbrick.data('position', mapObj.center);
		$mapbrick.data('bounds', mapObj.bounds.southWest + "," + mapObj.bounds.northEast);

		$mapbrick
			.addClass('w2-fix')
			.addClass('gmaps');

		$mapbrick.append($mapcanvas);

		$mapbrick.append(getInstagramsButton);
		$mapbrick.append(getFlickrsButton);

		$packeryContainer.packery();


		//call the event for the Fotosearch on click
		getGmapsFotos($mapbrick);


		if (mapObj.maptype.toLowerCase() === "roadmap") {
			myMaptypeID = google.maps.MapTypeId.ROADMAP;
		} else if (mapObj.maptype.toLowerCase() === "satellite") {
			myMaptypeID = google.maps.MapTypeId.SATELLITE;
		} else if (mapObj.maptype.toLowerCase() === "hybrid") {
			myMaptypeID = google.maps.MapTypeId.HYBRID;
		} else if (mapObj.maptype.toLowerCase() === "terrain") {
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
					southWest: map.getBounds().getSouthWest().toUrlValue(),
					northEast: map.getBounds().getNorthEast().toUrlValue()
				},
				maptype: map.getMapTypeId()
			};

			$mapbrick.data("topic", currentMap);

			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$mapbrick.data('position',  map.getCenter().toUrlValue());
			$mapbrick.data('bounds', map.getBounds().toUrlValue());
		});

		google.maps.event.addListener(map, 'maptypeid_changed', function() {

			currentMap.maptype = map.getMapTypeId();

			$mapbrick.data("topic", currentMap);

			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$mapbrick.data('position',  map.getCenter().toUrlValue());
			$mapbrick.data('bounds', map.getBounds().toUrlValue());

		});

		google.maps.event.addListener(map, 'click', function(event) {

			markers.forEach(function(marker) {
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

			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$mapbrick.data('position',  map.getCenter().toUrlValue());
			$mapbrick.data('bounds', map.getBounds().toUrlValue());
		});

		var thePanorama = map.getStreetView(); //get the streetview object

		google.maps.event.addDomListener(window, 'idle', function() {
			$packeryContainer.packery();
		});

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
				$mapbrick.data("type", "streetview");
				$mapbrick.data("topic", currentStreetMap);
				//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
				$mapbrick.data('position',  map.getCenter().toUrlValue());
				$mapbrick.data('bounds', map.getBounds().toUrlValue());
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
				$mapbrick.data("topic", currentStreetMap);
				//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
				$mapbrick.data('position',  map.getCenter().toUrlValue());
				$mapbrick.data('bounds', map.getBounds().toUrlValue());
			}
		});
	}
	//build the streetmap map brick (from database)
	wikiverse.buildStreetMap = function($mapbrick, streetObj, callback) {

		var currentStreetMap;

		var $mapcanvas = $('<div id="map_canvas"></div>');

		$mapbrick.data('type', 'streetview');
		$mapbrick.addClass('w2-fix');

		$mapbrick.append($mapcanvas);

		$mapbrick.append(getInstagramsButton);
		$mapbrick.append(getFlickrsButton);		

		$packeryContainer.packery();

		//call the event for the Fotosearch on click
		getGmapsFotos($mapbrick);

		var myCenter = new google.maps.LatLng(streetObj.center.split(",")[0], streetObj.center.split(",")[1]);
		//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
		$mapbrick.data('position',  myCenter.toUrlValue());

		var panoramaOptions = {
			position: myCenter,
			zoomControl: false,
			linksControl: false,
			panControl: false,
			disableDefaultUI: true,
			pov: {
				heading: parseFloat(streetObj.heading),
				pitch: parseFloat(streetObj.pitch),
				zoom: parseFloat(streetObj.zoom)
			},
			visible: true
		};

		var thePanorama = new google.maps.StreetViewPanorama($mapcanvas[0], panoramaOptions);

		//store the featured image in the brick itself (there are no imgs within street views, we have to explicitely grab it)
		
		$mapbrick.data('featuredImage', 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + myCenter.toUrlValue() + '&heading=' + panoramaOptions.pov.heading + '&pitch=' + panoramaOptions.pov.pitch + '&key=AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8')

		callback($mapbrick);

		google.maps.event.addListener(thePanorama, 'pov_changed', function() { //detect if entering Streetview

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};

			$mapbrick.data("topic", currentStreetMap);
			//store position and bounds into the data container (for later use of getFlickrs/Instagrams)
			$mapbrick.data('position',  myCenter.toUrlValue());


		});

		//if nothing changes, re-save the data-topic (otherwise its lost upon resave without moving)
		$mapbrick.data("topic", streetObj);
	}

	//search for flickrs
	function getFlickrs(topic, sort, type, dataLoaded, triggerSearchResultsFunction) {

		type = type || "textQuery";

		var APIextras = "url_q,url_z,tags,owner_name,geo";
		var APIkey = '1a7d3826d58da8a6285ef7062f670d30';

		function buildFlickrResultArray(data, triggerSearchResultsFunction){

			var resultsArray = data.photos.photo.map(function(photoObj, index) {

				if (photoObj.url_z){

					return {
						Topic: {		

							owner: photoObj.owner,
							id: photoObj.id,	
							title: photoObj.title,
							thumbURL: photoObj.url_q,
							mediumURL: photoObj.url_z,
							tags: photoObj.tags.split(" ")

						},
						Type: "Flickr"
					};				
				}
			});

			dataLoaded(resultsArray, "Flickr", triggerSearchResultsFunction);
		}


		//if query is coordinates (bounds)
		if (type === "geoQuery") {

			var latitude = topic.split(',')[0];
			var longitude = topic.split(',')[1];


			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data: {

					method: 'flickr.places.findByLatLon',
					api_key: APIkey,
					lat: latitude,
					lon: longitude,
					format: 'json',
					nojsoncallback: 1
				},
				success: function(data) {

					$.ajax({
						url: 'https://api.flickr.com/services/rest',
						data: {

							method: 'flickr.photos.search',
							api_key: APIkey,
							place_id: data.places.place[0].woeid,
							format: 'json',
							nojsoncallback: 1,
							per_page: 40,
							extras: APIextras,
							sort: sort
						},
						success: function(data) {
							buildFlickrResultArray(data, triggerSearchResultsFunction);
						}
					});

				}
			});

		} else if (type === "textQuery") { // is textQuery

			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data: {

					method: 'flickr.photos.search',
					api_key: APIkey,
					text: topic,
					format: 'json',
					nojsoncallback: 1,
					per_page: 100,
					extras: APIextras,
					sort: sort
				},
				success: function(data) {
					buildFlickrResultArray(data, triggerSearchResultsFunction);			
				}
			});

		} else if (type === "userQuery") {

			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data: {

					method: 'flickr.people.findByUsername',
					api_key: APIkey,
					username: topic,
					format: 'json',
					nojsoncallback: 1
				},
				success: function(data) {

					$.ajax({
						url: 'https://api.flickr.com/services/rest',
						data: {

							method: 'flickr.photos.search',
							api_key: APIkey,
							user_id: data.user.id,
							format: 'json',
							nojsoncallback: 1,
							per_page: 40,
							extras: APIextras,
							sort: sort
						},
						success: function(data) {							
							buildFlickrResultArray(data, triggerSearchResultsFunction);						
						}
					});
			
				}
			});
		}
	}

	//search for instagrams
	function getInstagrams(query, type, dataLoaded, triggerSearchResultsFunction) {

		type = type || "hashtag";

		var client_id = "db522e56e7574ce9bb70fa5cc760d2e7";

		var access_parameters = {
			client_id: client_id
		};

		var instagramUrl;


		function buildInstagramResultArray(data, triggerSearchResultsFunction){

			var resultsArray = data.data.map(function(photoObj, index) {

				return {
					Topic: {		

						owner: photoObj.user.username,
						id: photoObj.id,	
						title: query,
						thumbURL: photoObj.images.low_resolution.url,
						mediumURL: photoObj.images.standard_resolution.url,
						tags: photoObj.tags

					},
					Type: "Instagram"
				};
			});

			dataLoaded(resultsArray, "Instagram", triggerSearchResultsFunction);	
		}


		// if coordinate
		if (type === "coordinates") {

			var latitude = query.split(',')[0];
			var longitude = query.split(',')[1];

			if (valid_coords(latitude, longitude)) {

				$.ajax({
					url: 'https://api.instagram.com/v1/media/search',
					data: {
						lat: latitude,
						lng: longitude,
						client_id: 'db522e56e7574ce9bb70fa5cc760d2e7',
						format: 'json'
					},
					dataType: 'jsonp',
					success: function(data) {
		
						buildInstagramResultArray(data, triggerSearchResultsFunction);
				
					}
				});
			} else {
				$instagramSearchBrick.find('.results').append('<div class="no-results">"' + query + '" is not a coordinate .. :( </div>');
			}
		} else if (type === "hashtag") {

			instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';
			//var instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?client_id=db522e56e7574ce9bb70fa5cc760d2e7';

			$.getJSON(instagramUrl, access_parameters, function(data) {

				buildInstagramResultArray(data, triggerSearchResultsFunction);

			});

		} else if (type === "username") {

			$.ajax({
				url: 'https://api.instagram.com/v1/users/search',
				data: {
					q: query,
					client_id: 'db522e56e7574ce9bb70fa5cc760d2e7',
					format: 'json'
				},
				dataType: 'jsonp',
				success: function(data) {

					if (typeof data.data !== 'undefined' && data.data.length > 0) {

						data.data.map(function(user, index) {

							if (user.username === query) {
								var userID = user.id;
								var getUserUrl = 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';

								$.getJSON(getUserUrl, access_parameters, function(data) {
									
									buildInstagramResultArray(data, triggerSearchResultsFunction);	
					
								});
								return;
							}

						});


					} else {
						$results.append('<div class="no-results">No user found with this query: "' + query + '"</div>');
					}
				}
			});
		}
	}

	//for search query, trigger the search to other sources
	function getConnections(source, topic, parent) {

		//Open the sidebar:
		if (!$('body').hasClass('cbp-spmenu-push-toright')) {
			toggleSidebar();
		}

		prepareSearchNavbar(topic, parent);

		switch (source) {

			case "Flickr":
				getFlickrs(topic, "relevance", "textQuery", searchResultsLoaded, "buildFotoSearchResults");
			break;

			case "Instagram":
				//remove whitespace from instagram query
				getInstagrams(topic.replace(/ /g, ''), "hashtag", searchResultsLoaded, "buildFotoSearchResults");
			break;

			case "Youtube":
				getYoutubes(topic, searchResultsLoaded, "buildYoutubeSearchResults");
			break;

			case "Soundcloud":
				getSoundclouds(topic, searchResultsLoaded, "buildListResults");
			break;

			case "Twitter":
				getTweets(topic, searchResultsLoaded, "buildTwitterSearchResults");
			break;

			case "Wikipedia":
				getWikis(topic, "en", searchResultsLoaded, "buildListResults");
			break;
		}
	}

	//for twitter/flickr/instagram tags, when clicked, search those'in same source
	function onTagClickedDoSearch($brick, type) {
		$brick.find('.tag').on('click', function(e) {
			e.preventDefault();
			getConnections(type, $(this).html(), $brick.data('id'));
		});
	}

	wikiverse.buildFlickr = function($brick, photoObj, callback){

		wikiverse.buildFoto($brick, photoObj, "Flickr", callback);

	}

	wikiverse.buildInstagram = function($brick, photoObj, callback){

		wikiverse.buildFoto($brick, photoObj, "Instagram", callback);
		
	}
	//build a foto brick, either flickr or instagram
	wikiverse.buildFoto = function($brick, photoObj, type, callback) {

		$brick.addClass('foto');
		$brick.data('type', type);
		$brick.data('topic', photoObj);

		var $photo = $('<img class="img-result" src="' + photoObj.mediumURL + '">');

		var htmlTitleOverlay =
			'<div class="title-overlay overlay">' +
			'<p class="foto-title">' + photoObj.title + '</p>' +
			'<p class="">by <strong class="foto-owner"></strong> on <strong>' + type + '</strong></p>' +
			'</div>';

		var htmlTagsOverlay =
			'<div class="tags-overlay overlay">' +
			'<p class="foto-tags"></p>' +
			'</div>';

		var $tagsOverlay = $(htmlTagsOverlay);
		var $titleOverlay = $(htmlTitleOverlay);

		$brick.append($photo);
		$brick.append($tagsOverlay);
		$brick.append($titleOverlay);
		$brick.find('.foto-owner').append(photoObj.owner);

		if (photoObj.tags) {
			photoObj.tags.map(function(tag, index) {
				$brick.find('.foto-tags').append('#<strong><a class="instaTag tag" href="#">' + tag + '</a></strong>');
			});
		} 

		if (photoObj.size === "small") {
			$brick.addClass('w1');
		} else if (photoObj.size === "large") {
			$brick.addClass('w2');
		}

		//add class if is Portrait
		if (isPortrait($brick.find('img'))) {
			$brick.addClass('portrait')
		}

		if(type === "Flickr"){

			getFlickrUsername(photoObj.owner, function(username) {

				$brick.find('.foto-owner').empty();
				$brick.find('.foto-owner').append(username);

				//store the tags and re-assign them to the foto data (for later save)
				var thisPhoto = $brick.data('topic');
				thisPhoto.owner = username;

				$brick.data('topic', thisPhoto);

			});

		}

		//search for tags on click
		onTagClickedDoSearch($brick, type);

		var imgLoad = imagesLoaded($brick);

		imgLoad.on('progress', function(imgLoad, image) {
			if (!image.isLoaded) {
				return;
			}
			callback($brick);
			$packeryContainer.packery();

			$('#global-loading').remove();
		});

	};

	//create the flickr brick
	wikiverse.buildFotoSearchResults = function(results, searchResultsListBuilt) {

		results.forEach(function(result, index) {
			
			if(result){

				var $result = $('<img class="result" width="112" src="' + result.Topic.thumbURL + '">');
				$result.data("topic", result);

				//append row to sidebar-results-table
				$results.append($result);

			}

		});

		searchResultsListBuilt($results);
		
	};

	//strip html from given text
	function strip(html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}

	//build the soundcloud brick
	wikiverse.buildSoundcloud = function($brick, soundcloudObj, callback) {

		$brick.addClass('w2-fix');
		$brick.data('type', 'Soundcloud');
		$brick.data('topic', soundcloudObj);

		var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="//w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

		$brick.append($soundcloudIframe);
		$brick.prepend(handle);
		callback($brick);
	}

	//search for soundclouds
	function getSoundclouds(query, dataLoaded, triggerSearchResultsFunction) {

		SC.initialize({
			client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
		});

		SC.get('/tracks', {
			q: query,
			limit: 50
		}, function(tracks) {

			//build a homogenic array here (equally looking for all sources: topic and type)
			var resultsArray = tracks.map(function(item, index){

				return {
					Topic: {
						title: item.title,
						uri: item.uri
					},
					Type: "Soundcloud"
				}

				resultsArray.push(result);
			});

			dataLoaded(resultsArray, "Soundcloud", triggerSearchResultsFunction);
		
		});
	}

	wikiverse.buildListResults = function(results, searchResultsListBuilt){

		$results.append(resultsTable);

		results.forEach(function(result, index) {	

			var $result = $('<tr class="result" data-toggle="tooltip" title="' + strip(result.Topic.snippet) + '"><td>' + result.Topic.title + '</td></tr>');
			$result.data("topic", result);

			//append row to sidebar-results-table
			$results.find('.table').append($result);

			//create the tooltips
			$('tr').tooltip({ 
				animation: false,
				placement: 'bottom'
			});

		});

		searchResultsListBuilt($results);

	}

	//stack the twitter search results in the sidebar
	wikiverse.buildTwitterSearchResults = function(results) {

		$results.append(resultsTable);

		results.forEach(function(result, index) {

			var $result = $('<tr class="result"><td class="twitterThumb col-md-2"><img src="' + result.Topic.userThumb + '"></td><td class="col-md-10" ><strong>' + result.Topic.user + '</strong><br>' + result.Topic.title + '</td></tr>');
			$result.data("topic", result);

			//append row to sidebar-results-table
			$results.find('.table').append($result);

		});

		searchResultsListBuilt($results);
	}

	//search the Twitter API for tweets
	function getTweets(query, dataLoaded, triggerSearchResultsFunction) {

		$.ajax({
			url: '/app/plugins/wp-twitter-api/api.php',
			data: {
				"search": query
			},
			success: function(data) {

				var data = JSON.parse(data);
	
				var resultsArray = data.statuses.map(function(tweet, index){

					return {
						Topic: {							
							title: tweet.text,
							user: tweet.user.screen_name,
							userThumb: tweet.user.profile_image_url_https						
						},
						Type: "Twitter"
					}
				});
				dataLoaded(resultsArray, "Twitter", triggerSearchResultsFunction);
			}
		});
	}

	//build a note 
	/*function buildNote($brick, topic, callback){

		$brick.addClass('note');
		$brick.addClass('transparent');
		$brick.removeClass('well');
		$brick.removeClass('well-sm');

		$brick.append('<blockquote>' + topic.note + '</blockquote>');

		callback($brick);
	}*/
	//create a note
	function createNote($brick, callback){

		$brick.addClass('note');
		$brick.addClass('transparent');
		$brick.removeClass('well');
		$brick.removeClass('well-sm');

		$brick.append(note);
		$brick.append('<button id="saveNote" type="button" style="display: block; width: 100%;" class="btn btn-xs btn-default">save this note</button>');

		//instantiate for furher multiple use
		var $saveNotebutton = $('#saveNote');
		
		//scroll to textarea
		$('html, body').animate({
		    scrollTop: $brick.offset().top - 50
		}, 1000, function(){
			//when finished scrolling
			
			//focus textarea
			$brick.find('#note').focus();

			//fade for highlight functionality
			$brick.fadeTo('fast', 0.1).fadeTo('fast', 1.0);

		});

		//prepare object for note
		var noteObj = {
			note: ""
		};

		//on savenote click, swap the textarea with a blockquote
		$saveNotebutton.on('click', function(event) {
			event.preventDefault();
			/* Act on the event */

			var $textarea = $brick.find('#note'); 
			var text = $textarea.val();

			noteObj.note = text;

			$textarea.remove();
			$saveNotebutton.remove();

			$brick.prepend('<blockquote>' + text + '</blockquote>');

			$packeryContainer.packery();
		});

		//store the note temporarly
		$brick.data('type', 'note');
		$brick.data('topic', noteObj);

		callback($brick);
	}

	//find URLs in tweets/wikis,etc and replace them with clickable link 
	function urlify(text) {
	    var urlRegex = /(https?:\/\/[^\s]+)/g;
	    return text.replace(urlRegex, function(url) {
	        return '<a class="externalLink" target="_blank" href="' + url + '">' + url + '</a>';
	    })
	    // or alternatively
	    // return text.replace(urlRegex, '<a href="$1">$1</a>')
	}

	//build a tweet
	wikiverse.buildTwitter = function($brick, twitterObj, callback) {

		$brick.addClass('w2-fix');
		$brick.addClass('Twitter');

		//replace hashtags with links
		var tweet = twitterObj.title.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
			tweet = tweet.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
			tweet = urlify(tweet);

		var $tweetContainer = $('<div class="col-md-2"><img class="twitterUserThumb" src="' + twitterObj.userThumb + '"></div><div class="col-md-10"><strong>' + twitterObj.user + '</strong><br><p>' + tweet + '</p></div>');

		$tweetContainer.on('click', 'a:not(.externalLink)', function(event) {
			event.preventDefault();
			getConnections("Twitter", $(this).attr('hashtag'), $brick.data('id'));
			$(this).contents().unwrap();
		});

		$brick.data('type', 'Twitter');
		$brick.data('topic', twitterObj);

		$brick.append($tweetContainer);
		callback($brick);

	};


	//gets the wikilanguages for any given article - not used at the moment
	function getWikiLanguages(topic, lang, $brick) {

		$.ajax({
			url: 'https://' + lang + '.wikipedia.org/w/api.php',
			data: {
				action: 'query',
				titles: topic,
				prop: 'langlinks',
				format: 'json',
				lllimit: 500
			},
			dataType: 'jsonp',
			success: function(data) {

				var languageObj = data.query.pages[Object.keys(data.query.pages)[0]].langlinks;

				if (!$.isEmptyObject(languageObj)) {
					var langDropDown = $('<select class="pull-right languages show-menu-arrow" data-width="50%" data-size="20" data-style="btn btn-default btn-xs" data-live-search="true"></select>');

					$.each(languageObj, function() {

						langDropDown.append('<option value="' + this.lang + '" data-topic="' + this['*'] + '">' + getLanguage(this.lang) + '</option>');

					});

					langDropDown.prepend('<option selected>read in..</option>');

					$brick.prepend(langDropDown);

					//make it a beautiful dropdown with selectpicker
					langDropDown.selectpicker();

					var thisTopic = $brick.data('topic');	

					langDropDown.change(function() {

						thisTopic = {
							title: $(this).children(":selected").data('topic'),
							language: $(this).children(":selected").attr('value')
						};
						var $thisBrick = buildBrick([parseInt($brick.css('left')), parseInt($brick.css('top'))]);
						
						buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), brickDataLoaded);
					});
					$packeryContainer.packery();
				}
			}
		});

	}

	//get the Interwikilinks for any given Wiki article
	function getInterWikiLinks(section, $brick) {

		$.ajax({
			url: 'https://' + section.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: section.title,
				format: 'json',
				prop: 'links',
				section: section.index
			},
			dataType: 'jsonp',
			success: function(data) {

				if (typeof data.parse.links !== 'undefined' && data.parse.links.length > 0) {

					var interWikiArray = data.parse.links;

					var interWikiDropDown = $('<select class="pull-right points-to show-menu-arrow" data-width="50%" data-style="btn btn-default btn-xs" data-size="20"></select>');

					interWikiArray.forEach(function(link, index) {

						interWikiDropDown.append('<option index="' + link.ns + '" topic="' + link['*'] + '">' + link['*'] + '</option>');

					});

					interWikiDropDown.prepend('<option selected>Points to..</option>');

					$brick.prepend(interWikiDropDown);
					interWikiDropDown.selectpicker();

					interWikiDropDown.change(function() {

						var thisTopic = {

							title: $(this).children(":selected").attr('topic'),
							language: section.language
						};
						var $thisBrick = buildBrick([parseInt($brick.css('left')), parseInt($brick.css('top'))]);
						buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), brickDataLoaded);
					});

					$packeryContainer.packery();
				}
			}
		});

	}

	//"get" functions always do query the respective APIs and built an equally looking (wikiverse)results array for all sources 
	function getWikis(topic, lang, dataLoaded, triggerSearchResultsFunction) {

		$.ajax({
			url: 'https://' + lang + '.wikipedia.org/w/api.php',
			data: {
				action: 'query',
				list: 'search',
				srsearch: topic,
				format: 'json',
				srlimit: 50
			},
			dataType: 'jsonp',
			success: function(data) {		
				
				//build a homogenic array here (equally looking for all sources: topic and type)
				var resultsArray = data.query.search.map(function(item, index){

					return {
						Topic: {
							title: item.title,
							snippet: strip(item.snippet),
							language: lang
						},
						Type: "Wikipedia"
					}
				});

				dataLoaded(resultsArray, "Wikipedia", triggerSearchResultsFunction);	
			}
		});
	}

	function searchResultsListBuilt($results){		

		//bind event to every row -> so you can start the wikiverse
		$results.find('.result').unbind('click').on('click', function(event) {			

			//if there is no parent saved in the searchkeyword, you are searching for soemthign new, thus 
			//updatethesearchistory and use that searchquery for a fresh parent node in the mindmap
			if(!$searchKeyword.data('parent')){
				updateSearchHistory();				
			}

			//if there is a searchkeyword parent, we are using the search to continue a topic, take that as parent
			//if not, it means we are pushing a topic to the board for the first time, take the searchquery id as parent
			//
			//not that updateSearchhistory is emptying the searchkeyword.data(parent) in case something is added to the searchhistory, 
			//thus forcing the second (if not) state!
			var parent = $searchKeyword.data('parent') || wikiverse.searchHistory[$searchKeyword.html().toLowerCase()];

			var $thisBrick = buildBrick([parseInt($topBrick.css('left')), parseInt($topBrick.css('top')) - 200], undefined, parent);
			var result = $(this).data("topic");

			//concatenate the respective function to push bricks to the board (buildWikis, buildYoutubes, etc)
			wikiverse["build" + result.Type]($thisBrick, result.Topic, brickDataLoaded);

			$(this).tooltip('destroy');
			$(this).remove();
			
			//build a node with the searchqueryNode as parent
			buildNode(result, $thisBrick.data('id'), parent);
			return false;
		});

		//remove the loading icon when done
		$sidebar.find("#loading").remove();	
	}

	function updateSearchHistory(){

		//if search keyword is not already in history, add it
		if (!wikiverse.searchHistory.hasOwnProperty($searchKeyword.html().toLowerCase())){
			wikiverse.searchHistory[$searchKeyword.html().toLowerCase()] = getRandomWvID(); 

			//empty the $searchkeyword parent id so that a new searchquery parent is created
			
			var searchQueryNodeData = {
				Topic: {
					title: $searchKeyword.html()				
				},
				Type: "searchQuery",
				Id: wikiverse.searchHistory[$searchKeyword.html().toLowerCase()]
			}

			//build a node for the searchquery
			buildNode(searchQueryNodeData, wikiverse.searchHistory[$searchKeyword.html().toLowerCase()]);
		}
	}

	//search for sections of a wiki article
	function getWikiSections($brick, topic){

		$.ajax({
			url: 'https://' + topic.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: topic.title,
				format: 'json',
				prop: 'sections',
				mobileformat: true
					/*disableeditsection: true,
					disablepp: true,
					//preview: true,
					sectionprevue: true,
					section:0,
					disabletoc: true,
					mobileformat:true*/
			},
			dataType: 'jsonp',
			success: function(data) {
				//if there is sections, append them

				var $sectionResults = $('<div class="sections"></div>');

				if (typeof data.parse.sections !== 'undefined' && data.parse.sections.length > 0) {

					$brick.append($sectionResults);

					data.parse.sections.forEach(function(section) {

						//if not any of those, add the resulting sections
						if ((section.line !== "References") && (section.line !== "Notes") && (section.line !== "External links") && (section.line !== "Citations") && (section.line !== "Bibliography") && (section.line !== "Notes and references")) {
							$sectionResults.append(' <button type="button" class="list-group-item result" title="' + section.anchor + '" index="' + section.index + '">' + section.line + '</button>');
						}
					});

					$packeryContainer.packery();

					//create the section object and trigger the creation of a section brick
					$sectionResults.find(".result").on('click', function() {

						$packeryContainer.packery('stamp', $brick);

						var sectionData = {

							title: $(this).html(),
							language: topic.language,
							name: topic.title,
							index: $(this).attr("index")
						};

						$(this).remove();

						var $nextBrick = buildBrick([parseInt($brick.css('left')), parseInt($brick.css('top'))], undefined, $brick.data('id'));
						wikiverse.buildSection($nextBrick, sectionData, brickDataLoaded);
						
						var brickData = {
							Type: "wikiSection",
							Topic: sectionData,
							Id: $nextBrick.data('id')
						}

						buildNode(brickData, $nextBrick.data('id'), $brick.data('id'));

						$packeryContainer.packery('unstamp', $brick);
					});
				}
				else{
					$sectionResults.append('No Sections found for this Wikipedia article..');
				}
			}
		});
	}

	var rmOptions = {
		speed: 700,
		moreLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> more </button>',
		lessLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> less </button>',
		afterToggle: function() {
			$packeryContainer.packery();
		}
	};
	//build a wiki Brick
	wikiverse.buildWikipedia = function($brick, topic, callback) {

		var $connections = $(wikiverse_nav);
		var $sectionsButton = $('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> sections </button>');

		$brick.data('type', 'Wikipedia');
		$brick.data('topic', topic);

		$brick.addClass('wiki');

		$brick.prepend('<h2>' + topic.title + '</h2>');
		
		$brick.prepend($connections);
		$connections.selectpicker();

		$connections.change(function(event) {
			getConnections($(this).find("option:selected").text(), topic.title, $brick.data('id'));
		});	

		$brick.append($sectionsButton);

		$sectionsButton.on('click', function(){
			$packeryContainer.packery('stamp', $brick);
			getWikiSections($brick, topic);
			$sectionsButton.remove();
			$packeryContainer.packery('unstamp', $brick);
		});		

		//Go get the Main Image - 2 API Calls necessairy.. :(
		$.ajax({
			url: 'https://' + topic.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: topic.title,
				format: 'json',
				prop: 'images'
			},
			dataType: 'jsonp',
			success: function(data) {
				//if there is images, grab the first and append it
				if (typeof data.parse.images !== 'undefined' && data.parse.images.length > 0) {
					data.parse.images.every(function(image) {
						//only look for jpgs
						if (image.indexOf("jpg") > -1) {
							//Go grab the URL
							$.ajax({
								url: 'https://en.wikipedia.org/w/api.php',
								data: {
									action: 'query',
									titles: 'File:' + image,
									prop: 'imageinfo',
									iiprop: 'url',
									format: 'json',
									iiurlwidth: 260
								},
								dataType: 'jsonp',
								success: function(data) {

									//get the first key in obj
									//for (first in data.query.pages) break;
									//now done better like this:

									var imageUrl = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].thumburl;
									var image = $('<img src="' + imageUrl + '">');

									image.insertAfter($brick.find("h2"));

									var imgLoad = imagesLoaded($brick);

									imgLoad.on('progress', function(imgLoad, image) {
										if (!image.isLoaded) {
											return;
										}
										callback($brick);
										$packeryContainer.packery();

										$('#global-loading').remove();
									});
								}
							});
							//break the loop if a jpg was found
							return false;
						} else {
							return true;
						}
					});
				}
			}
		});

		//Go get the first Paragraph of the article
		$.ajax({
			url: 'https://' + topic.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: topic.title,
				format: 'json',
				prop: 'text',
				section: 0,
				preview: true,
				mobileformat: true,
				redirects: true
					/*disableeditsection: true,
					disablepp: true,

					sectionprevue: true,
					disabletoc: true,
					mobileformat:true*/
			},
			dataType: 'jsonp',
			success: function(data) {

				if (data.parse.text['*'].length > 0) {
					var infobox = $(data.parse.text['*']).find('p:first');

					//if (infobox.length){

					infobox.find('.error').remove();
					infobox.find('.reference').remove();
					infobox.find('.references').remove();
					infobox.find('.org').remove();
					infobox.find('.external').remove();
					infobox.find('#coordinates').remove();
					//infobox.find('*').css('max-width', '290px');
					infobox.find('img').unwrap();

					var article = $('<div class="article"></div>');

					if ($brick.find("img").length) {
						article.insertAfter($brick.find("img"));
					} else {
						article.insertAfter($brick.find("h2"));
					}

					article.append(infobox);

					article.readmore(rmOptions);

					$packeryContainer.packery();

					//enable to create new bricks out of links
					buildNextTopic($brick, topic.language);

					callback($brick);
				}
			}
		});
	};

	//build a section brick 
	wikiverse.buildSection = function($brick, section, callback) {

		$brick.data('type', 'wikiSection');
		$brick.data('topic', section);

		$brick.addClass('wiki');

		$brick.prepend('<p><h4>' + section.name + '</h4></p>');

		//search another source menu:
		var $connections = $(wikiverse_nav);
		$brick.prepend($connections);
		$connections.selectpicker();

		$connections.change(function(event) {
			getConnections($(this).find("option:selected").text(), section.title, $brick.data('id'));
		});	

		$.ajax({
			url: 'https://' + section.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: section.name,
				format: 'json',
				prop: 'text',
				disableeditsection: true,
				disablepp: true,
				//preview: true,
				//sectionprevue: true,
				section: section.index,
				disabletoc: true,
				mobileformat: true
			},
			dataType: 'jsonp',
			success: function(data) {

				var wholeSection = $(data.parse.text['*']);

				wholeSection.find('.error').remove();
				wholeSection.find('.reference').remove();
				wholeSection.find('.references').remove();
				wholeSection.find('.notice').remove();
				wholeSection.find('.ambox').remove();
				wholeSection.find('.org').remove();
				wholeSection.find('table').remove();
				//sectionHTML.find('*').css('max-width', '290px');
				wholeSection.find('img').unwrap();
				wholeSection.find('.external').remove();
				wholeSection.find('#coordinates').remove();

				//if image is bigger than 290, shrink it
				if (wholeSection.find('img').width() > 250 || wholeSection.find('img').attr("width") > 250) {

					wholeSection.find('img').attr('width', 250);
					wholeSection.find('img').removeAttr('height');
				}
				wholeSection.find('a[class*=exter]').remove();

				$brick.append(wholeSection);
				wholeSection.wrap('<div class="section"></div>');

				$('.section').readmore(rmOptions);

				//check if there is Geolocations

				/*
				if ($brick.find('.geo-dms').length) {
						var geoPosition = $brick.find('.geo-nondefault .geo').html();
						console.log(geoPosition);
					} // end if geo
				*/

				//enable to create new bricks out of links
				buildNextTopic($brick, section.language);

				callback($brick);
				$packeryContainer.packery();
			}
		});
	};

	//stack the youtube search results in the sidebar
	wikiverse.buildYoutubeSearchResults = function(results) {

		$results.append(resultsTable);

		results.forEach(function(result, index) {

			var $result = $('<tr class="result" data-toggle="tooltip" youtubeID="' + result.Topic.youtubeID + '" title="' + strip(result.Topic.snippet) + '"><td class="youtubeThumb col-md-6"><img height="100" src="' + result.Topic.thumbnailURL + '"></td class="col-md-6"><td>' + result.Topic.title + '</td></tr>');
			$result.data("topic", result);

			//append row to sidebar-results-table
			$results.find('.table').append($result);

		});

		searchResultsListBuilt($results);

	};

	//build a youtube brick 
	wikiverse.buildYoutube = function($brick, youtubeObj, callback) {

		var relatedButton = '<button class="btn btn-default btn-xs related" type="button">get related videos</button>';
		var youtubeThumb = '<img class="" id="ytplayer" type="text/html" src="' + youtubeObj.thumbnailURL + '">';

		//stop all other players
		$('.youtube').find("iframe").remove();
		$('.youtube').find("img").show();
		$('.youtube').find(".youtubePlayButton").show();
		$('.youtube').removeClass("w2-fix");

		//$brick.addClass('w2-fix');
		$brick.addClass('youtube');

		if (youtubeObj.size === "large") {
			$brick.addClass('w2');
		}

		$brick.data('type', 'Youtube');
		$brick.data('topic', youtubeObj);

		$brick.append(relatedButton);
		
		$brick.append(youtubeThumb);

		$brick.append('<i class="fa youtubePlayButton fa-youtube-play"></i>');

		imagesLoaded('#packery .youtube', function() {
			$packeryContainer.packery();
		});

		$brick.find('.youtubePlayButton').on('click', function() {
			playYoutube($brick, youtubeObj);
		});

		$brick.find('.related').on('click', function() {
			getRelatedYoutubes(youtubeObj.youtubeID, youtubeObj.query, searchResultsLoaded, "buildYoutubeSearchResults", $brick.data('id'));
		});

		callback($brick);
	};

	//play a youtube video
	playYoutube = function($brick, youtubeObj) {

		//stop all other players
		$('.youtube').find("iframe").remove();
		$('.youtube').find("img").show();
		$('.youtube').find(".youtubePlayButton").show();
		$('.youtube').removeClass("w2-fix");

		$brick.addClass('w2-fix');

		var iframe = '<iframe class="" id="ytplayer" type="text/html" width="460" height="260" src="//www.youtube.com/embed/' + youtubeObj.youtubeID + '?autoplay=1" webkitallowfullscreen autoplay mozallowfullscreen allowfullscreen frameborder="0"/>';

		$brick.find('img').hide();
		$brick.find('.youtubePlayButton').hide();

		$brick.append(iframe);

		$packeryContainer.packery();
	};

	//make each brick draggable 
	makeEachDraggable = function(i, itemElem) {
		
		// make element draggable with Draggabilly
		var draggie; 
		
		if($(itemElem).hasClass('gmaps')){

			draggie = new Draggabilly(itemElem, {
		      handle: '.handle'
		    });
			
		}
		else{

			draggie = new Draggabilly(itemElem);
		}
		

		// bind Draggabilly events to Packery
		$packeryContainer.packery('bindDraggabillyEvents', draggie);
	};


	function prepareBoardTitle(board){

		$('#wvTitle > h1').append(board.title);
		$('#boardDescription').append(board.description);

	}

	//get new random number not inside the already present IDs
	function getRandomWvID() {
	    var rand = Math.floor(Math.random() * 200);
	    if ($.inArray(rand, wikiverse.thisBoardsIDs) === -1) {
	    	wikiverse.thisBoardsIDs.push(rand);
	        return rand;
	    } else {
	        return getRandomWvID();
	    }
	}

	//build an empty brick
	function buildBrick(position, id, parent) {

		//if not provided, set position array (x,y coordinates) to 2 undefined values to omit the packery fit!
		position = position || [undefined,undefined];

		var $brick = $(defaultBrick);		

		//if no id is passed from backend, get random not in this boards IDs
		id = id || getRandomWvID();

		$brick.data('id', id);
		$brick.attr('id', "n"+	id);
		$brick.data('parent', parent);

		$packeryContainer.append($brick).packery('appended', $brick);
		$brick.each(makeEachDraggable);

		//fit the brick at given position: first is x, second y
		$packeryContainer.packery('fit', $brick[0], position[0], position[1]);
		$packeryContainer.packery();

		return $brick;
	}

	//build a board -  this is called only for saved boards (coming from db)
	wikiverse.buildBoard = function($packeryContainer, board) {
		
		prepareBoardTitle(board);

		//overwrite the searchHistory with the one coming from db
		wikiverse.searchHistory = board.search_history;

		$.each(board.search_history, function(query, id){

			wikiverse.thisBoardsIDs.push(id);

		});	

		//if there are bricks in the board
		if(!$.isEmptyObject(board.bricks)){

			$('#global-loading').removeClass("invisible");

			$.each(board.bricks, function(index, brick) {

				//build a brick at position 0,0
				var $thisBrick = (brick.Type === "gmaps" || brick.Type === "streetview") ? buildGmapsBrick([undefined,undefined]) : buildBrick([undefined,undefined], brick.Id, brick.Parent);

				//get all Ids of this board (for later picking different ones)
				wikiverse.thisBoardsIDs.push(brick.Id);

				switch (brick.Type) {
					case "Wikipedia":
						wikiverse.buildWikipedia($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "wikiSection":
						wikiverse.buildSection($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "Flickr":
						wikiverse.buildFoto($thisBrick, brick.Topic, "Flickr", brickDataLoaded);
					break;

					case "Instagram":
						wikiverse.buildFoto($thisBrick, brick.Topic, "Instagram", brickDataLoaded);
					break;

					case "Youtube":
						wikiverse.buildYoutube($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "gmaps":						
						wikiverse.buildGmaps($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "streetview":
						wikiverse.buildStreetMap($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "Soundcloud":
						wikiverse.buildSoundcloud($thisBrick, brick.Topic, brickDataLoaded);
					break;

					case "Twitter":
						wikiverse.buildTwitter($thisBrick, brick.Topic, brickDataLoaded);
					break;

					/*case "note":
						buildNote($thisBrick, brick.Topic, brickDataLoaded);
					break;*/
				}
			});
		}
		//this always needs to happen, also without any bricks, coz we need the search query nodes in the graph!
		wikiverse.buildMindmap(board);
	}

	wikiverse.buildMindmap = function(board){

		wikiverse.mindmapObj = {
			nodes: [],
			edges: []
		}

		$.each(board.search_history, function(query, id){

			var node = {
				id: "n" + id,
				label: query,
				x: Math.random(),
				y: Math.random(),
				size: 15,
				parent: "n0", 
				color: '#f8f8f8',
				icon: {
					font: 'FontAwesome', // or 'FontAwesome' etc..
					content: '\uF002', // or custom fontawesome code eg. "\uF129"
					scale: 0.7, // 70% of node size
					color: '#000' // foreground color (white)
				}
		    }
		    wikiverse.mindmapObj.nodes.push(node);
		});
		
		var edgeId = 0; 

		$.each(board.bricks, function(key, brick){

			//if there is an Id, and its not a gmaps or streetview brick
			if(brick.Id && (brick.Type !== "gmaps" || brick.Type !== "streetview")){

				var node = {
					id: "n" + brick.Id,
					label: brick.Topic.title,
					x: Math.random(),
					y: Math.random(),
					size: 10,
					parent: "n" + brick.Parent,
					color: '#f8f8f8',
					border_size: 2,
					border_color: "#000",
					icon: {
						font: 'FontAwesome', // or 'FontAwesome' etc..
						content: nodeSettings[brick.Type][0], // or custom fontawesome code eg. "\uF129"
						scale: 0.8, // 70% of node size
						color: nodeSettings[brick.Type][1] // foreground color (white)
					}
			    }

			    var edgeIDString = ++edgeId; 

		    	var edge = {
					id: "e" + edgeIDString,
					source: "n" + brick.Parent,
					target: "n" + brick.Id,
					size: 2,
					color: "#f8f8f8",
					type: "curvedArrow"
			    }

			    wikiverse.mindmapObj.nodes.push(node);
			    wikiverse.mindmapObj.edges.push(edge);

			}
		});
		
		wikiverse.mindmap.graph.read(wikiverse.mindmapObj);
	}


	function removeNode(id, $brick){

		//update thisBoardsIDs array: 
		removeIDfromThisBoardsIds(id);

		//get the given node by Id
		var nodesObj = wikiverse.mindmap.graph.getNodesById();
		var thisNode = nodesObj["n" + id];

		//recreate the children for this node
		wikiverse.mindmap.graph.nodes().map(function(node, index){
			
			var neighbors = wikiverse.mindmap.graph.neighbors(node.id);
			delete neighbors[node.parent]
			node.children = neighbors;

		});
		//drop the given node
		wikiverse.mindmap.graph.dropNode("n" + id);

		//get the last edge and grab its ID
		var edgesArray = wikiverse.mindmap.graph.edges(); 
		//if there are no edges, start with 0, if there are take the last edge, grab its id, remove the "e" from the id
		var lastEdgeId = (edgesArray.length > 0) ? parseInt(edgesArray[edgesArray.length-1].id.replace(/\D/g,'')) : 0;

		$.each(thisNode.children, function(nodeId, nodeObj){
			//for each child, create a new edge, thus increment
			lastEdgeId++;
			//set the new parent for the child nodes
			nodeObj.parent = thisNode.parent;

			//also update all DOM elements with given ID with the new parent (so it can be safely stored to db)
			$("#" + nodeId).data('parent', parseInt(thisNode.parent.replace(/\D/g,'')))			

	    	//create new edges for the child nodes to the parent
	    	wikiverse.mindmap.graph.addEdge({
	    	  id: "e" + lastEdgeId,
	    	  // Reference extremities:
	    	  source: thisNode.parent,
	    	  target: nodeId,
	    	  size: 2,
	    	  color: "#f8f8f8",
	    	  type: "curvedArrow"
	    	});	

		});

		//if sidebar is open do the fruchertmanreingold, if not, dont do anything and save memory!
		if($('#rightSidebar').hasClass('cbp-spmenu-open')) {			
			sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
			wikiverse.mindmap.refresh();
		}
	}

	function buildNode(brickData, id, parent){

		// Then, let's add some data to display:
		wikiverse.mindmap.graph.addNode({
			id: "n" + id,
			label: brickData.Topic.title,
			x: Math.random(),
			y: Math.random(),
			size: 15,
			parent: "n" + parent,
			color: '#f8f8f8',
			border_size: 2,
			border_color: "#000",
			icon: {
				font: 'FontAwesome', // or 'FontAwesome' etc..
				content: nodeSettings[brickData.Type][0], // or custom fontawesome code eg. "\uF129"
				scale: 0.8, // 70% of node size
				color: nodeSettings[brickData.Type][1] // foreground color (white)
			}
	    });

		//if a parent is passed, create an edge, otherwise its the first node, without parent
		if(parent){

			//get the last edge and grab its ID
			var edgesArray = wikiverse.mindmap.graph.edges();
			//if there are no edges, start with 0
			var lastEdgeId = (edgesArray.length > 0) ? parseInt(edgesArray[edgesArray.length-1].id.replace(/\D/g,'')) : 0;
			lastEdgeId++;

			wikiverse.mindmap.graph.addEdge({
			  id: 'e' + lastEdgeId,
			  // Reference extremities:
			  source: 'n' + parent,
			  target: 'n' + id,
			  size: 2,
			  color: "#f8f8f8",
			  type: "curvedArrow"
			});			

		}

		//if sidebar is open do the fruchertmanreingold, if not, dont do anything and save memory!
		if($('#rightSidebar').hasClass('cbp-spmenu-open')) {			
			sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
			wikiverse.mindmap.refresh();
		}
	}

	//toggle the search overlay
	wikiverse.toggleSearch = function() {
		
		$('#searchResults h3').hide();

		//$('.sourceParams').hide();
		//$('#addNote').show();

		//$('#source').val($("#source option:first").val());
		//$('#source').selectpicker('refresh');

		$('.search').addClass('open');
		$('.search > form > input[type="search"]').focus();

	};

	//fork the board, copy it to your boards
	wikiverse.forkBoard = function(wpnonce) {
		var forkedTitle = $('#wvTitle h1').html();
		var newAuthor = $('#wvAuthor').attr('data-currentUser');

		wikiverse.createBoard(wpnonce, forkedTitle, newAuthor);
	};

	//collect the bricks for saveboard/createboard/forkboard
	wikiverse.collectBricks = function() {

		var $firstBrick = $packeryContainer.find('.brick:first'); 
		var featuredImage; 

		if($firstBrick.data('type') === "streetview"){
			featuredImage = $firstBrick.data('featuredImage');
		}
		else {
			featuredImage = $firstBrick.find('img').attr('src');
		}

		var bricks = $packeryContainer.packery('getItemElements');

		var wikiverseParsed = bricks.reduce(function(Brick, brick, index){

			Brick[index] = {
				Type: $(brick).data('type'),
				Topic: $(brick).data('topic'),
				Id: $(brick).data('id'),
				Parent: $(brick).data('parent')				
			};
			return Brick;
		}, {});

		var board = {
			"title": "",
			"author": $('#wvAuthor').attr('data-author'),
			"featured_image": featuredImage,
			"search_history": wikiverse.searchHistory,
			"bricks": wikiverseParsed
		};


		return board;
	};

	//save a board when modified
	wikiverse.saveBoard = function(wpnonce) {

		var board = wikiverse.collectBricks();

		board.title = $('#wvTitle').text();

		$.ajax({
			type: 'POST',
			url: "/wp/wp-admin/admin-ajax.php",
			data: {
				action: 'apf_editpost',
				boardID: $('#postID').html(),
				boardmeta: JSON.stringify(board),
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
					addclass: "stack-topright",
					stack: myStack,
					nonblock: {
						nonblock: true,
						nonblock_opacity: 0.2
					}
				});
			},
			error: function(MLHttpRequest, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	};

	//create a new board
	wikiverse.createBoard = function(wpnonce, forkedTitle, newAuthor) {

		var board = wikiverse.collectBricks();

		$("#saveBoardModal").modal('show');

		//Focus MOdal Input and trigger enter save
		$('#saveBoardModal').on('shown.bs.modal', function() {

			//if its being forked
			if (forkedTitle) {
				$('#saveThisBoard').addClass('invisible');
				$('#copyThisBoard').removeClass('invisible');
				$('#copyThisBoardDescription').removeClass('invisible');
				$("#boardTitle").val(forkedTitle);

				//enable the save board button
				$("#boardSubmitButton").prop('disabled', false);
				board.author = newAuthor;
			}

			$("#boardTitle").focus();

			$('#boardTitle').keyup(function(e) {
				e.preventDefault();
				//enable the save board button
				$("#boardSubmitButton").prop('disabled', false);

				//make enter save the board
				if (e.keyCode === 13) {
					$("#boardSubmitButton").trigger('click');
				}
			});
		});

		$("#boardSubmitButton").on("click", function() {

			var value = $.trim($("#boardTitle").val());

			if (value.length > 0) {

				//this is saved here because its not available before
				board.title = $('#boardTitle').val();

				$.ajax({
					type: 'POST',
					url: "https://wikiver.se/wp/wp-admin/admin-ajax.php",
					data: {
						action: 'apf_addpost',
						boardtitle: board.title,
						boardmeta: JSON.stringify(board),
						nonce: wpnonce
					},
					success: function(data, textStatus, XMLHttpRequest) {

						var id = '#apf-response';
						$(id).html('');
						$(id).append(data);

						var url = JSON.parse(data)[0];
						var ID = JSON.parse(data)[1];

						//update the browser history and the new url
						history.pushState('', 'wikiverse', url);

						//update the Post ID
						$('#postID').html(ID);

						//update the board title
						$('#wvTitle h1').html(board.title);

						//update the board author
						$('#wvAuthor h2').html('by ' + '<a href="/user/' + board.author + '">' + board.author + '</a>');

						var $buttonToSwap;
						var PNotifyMessage;

						if (forkedTitle) {
							$buttonToSwap = $('#forkBoard');
							PNotifyMessage = "This board now is owned by you. Go enhance it!";
						} else {
							$buttonToSwap = $('#createBoard');
							PNotifyMessage = "board created successfully!";
						}

						$buttonToSwap.removeAttr('id');
						$buttonToSwap.attr('id', 'saveBoard');
						$buttonToSwap.html('Save Changes');

						new PNotify({
							text: PNotifyMessage,
							type: 'success',
							icon: 'fa fa-floppy-o',
							styling: 'fontawesome',
							shadow: false,
							animation: 'fade',
							addclass: "stack-topright",
							stack: myStack,
							nonblock: {
								nonblock: true,
								nonblock_opacity: 0.2
							}
						});
					},
					error: function(MLHttpRequest, textStatus, errorThrown) {
						alert(errorThrown);
					}
				});

				$("#saveBoardModal").modal('hide');


			} else {
				$('#boardTitle').parent(".form-group").addClass("has-error");
			}

		});

	};

	//clear a board from all bricks
	wikiverse.clearBoard = function(wpnonce) {
		if (confirm('Are you sure you want to clear this board?')) {
			var elements = $packeryContainer.packery('getItemElements');
			$packeryContainer.packery('remove', elements);

			//remove all nodes
			/*wikiverse.mindmap.graph.clear();

			//re-add search nodes
			$.each(board.search_history, function(query, id){

				var node = {
					id: "n" + id,
					label: query,
					x: Math.random(),
					y: Math.random(),
					size: 20,
					parent: "n0", 
					color: '#ccc',
					icon: {
						font: 'FontAwesome', // or 'FontAwesome' etc..
						content: '\uF129', // or custom fontawesome code eg. "\uF129"
						scale: 0.7, // 70% of node size
						color: '#ffffff' // foreground color (white)
					}
			    }
			    wikiverse.mindmapObj.nodes.push(node);
			});*/
		}
	};

	function SVGMenu( el, options ) {
		this.el = el;
		this.init();
	}

	SVGMenu.prototype.init = function() {
		this.trigger = this.el.querySelector( 'button.menu__handle' );
		this.shapeEl = this.el.querySelector( 'div.morph-shape' );

		var s = Snap( this.shapeEl.querySelector( 'svg' ) );
		this.pathEl = s.select( 'path' );
		this.paths = {
			reset : this.pathEl.attr( 'd' ),
			open : this.shapeEl.getAttribute( 'data-morph-open' ),
			close : this.shapeEl.getAttribute( 'data-morph-close' )
		};

		this.isOpen = false;

		this.initEvents();
	};

	SVGMenu.prototype.initEvents = function() {
		this.trigger.addEventListener( 'click', this.toggle.bind(this) );
	};

	SVGMenu.prototype.toggle = function() {
		var self = this;

		if( this.isOpen ) {
			classie.remove( self.el, 'menu--anim' );
			setTimeout( function() { classie.remove( self.el, 'menu--open' );	}, 250 );
		}
		else {
			classie.add( self.el, 'menu--anim' );
			setTimeout( function() { classie.add( self.el, 'menu--open' );	}, 250 );
		}
		this.pathEl.stop().animate( { 'path' : this.isOpen ? this.paths.close : this.paths.open }, 350, mina.easeout, function() {
			self.pathEl.stop().animate( { 'path' : self.paths.reset }, 800, mina.elastic );
		} );
		
		this.isOpen = !this.isOpen;
	};

	//get the wiki languages
	getLanguage = function(langCode) {

		var langarray = {

			'en': 'English',
			'de': 'Deutsch',
			'fr': 'Français',
			'nl': 'Nederlands',
			'it': 'Italiano',
			'es': 'Español',
			'pl': 'Polski',
			'ru': 'Русский',
			'ja': '日本語',
			'pt': 'Português',
			'zh': '中文',
			'sv': 'Svenska',
			'vi': 'Tiếng Việt',
			'uk': 'Українська',
			'ca': 'Català',
			'no': 'Norsk (Bokmål)',
			'fi': 'Suomi',
			'cs': 'Čeština',
			'fa': 'فارسی',
			'hu': 'Magyar',
			'ko': '한국어',
			'ro': 'Română',
			'id': 'Bahasa Indonesia',
			'ar': 'العربية',
			'tr': 'Türkçe',
			'sk': 'Slovenčina',
			'kk': 'Қазақша',
			'eo': 'Esperanto',
			'da': 'Dansk',
			'sr': 'Српски / Srpski',
			'lt': 'Lietuvių',
			'eu': 'Euskara',
			'ms': 'Bahasa Melayu',
			'he': 'עברית',
			'bg': 'Български',
			'sl': 'Slovenščina',
			'vo': 'Volapük',
			'hr': 'Hrvatski',
			'war': 'Winaray',
			'hi': 'हिन्दी',
			'et': 'Eesti',
			'gl': 'Galego',
			'nn': 'Nynorsk',
			'az': 'Azərbaycanca',
			'simple': 'Simple English',
			'la': 'Latina',
			'el': 'Ελληνικά',
			'th': 'ไทย',
			'sh': 'Srpskohrvatski / Српскохрватски',
			'oc': 'Occitan',
			'new': 'नेपाल भाषा',
			'mk': 'Македонски',
			'ka': 'ქართული',
			'roa-rup': 'Armãneashce',
			'tl': 'Tagalog',
			'pms': 'Piemontèis',
			'be': 'Беларуская',
			'ht': 'Krèyol ayisyen',
			'te': 'తెలుగు',
			'uz': 'O‘zbek',
			'ta': 'தமிழ்',
			'be-x-old': 'Беларуская (тарашкевіца)',
			'lv': 'Latviešu',
			'br': 'Brezhoneg',
			'sq': 'Shqip',
			'ceb': 'Sinugboanong Binisaya',
			'jv': 'Basa Jawa',
			'mg': 'Malagasy',
			'cy': 'Cymraeg',
			'mr': 'मराठी',
			'lb': 'Lëtzebuergesch',
			'is': 'Íslenska',
			'bs': 'Bosanski',
			'hy': 'Հայերեն',
			'my': 'မြန်မာဘာသာ',
			'yo': 'Yorùbá',
			'an': 'Aragonés',
			'lmo': 'Lumbaart',
			'ml': 'മലയാളം',
			'fy': 'Frysk',
			'pnb': 'شاہ مکھی پنجابی (Shāhmukhī Pañjābī)',
			'af': 'Afrikaans',
			'bpy': 'ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী',
			'bn': 'বাংলা',
			'sw': 'Kiswahili',
			'io': 'Ido',
			'scn': 'Sicilianu',
			'ne': 'नेपाली',
			'gu': 'ગુજરાતી',
			'zh-yue': '粵語',
			'ur': 'اردو',
			'ba': 'Башҡорт',
			'nds': 'Plattdüütsch',
			'ku': 'Kurdî / كوردی',
			'ast': 'Asturianu',
			'ky': 'Кыргызча',
			'qu': 'Runa Simi',
			'su': 'Basa Sunda',
			'diq': 'Zazaki',
			'tt': 'Tatarça / Татарча',
			'ga': 'Gaeilge',
			'cv': 'Чăваш',
			'ia': 'Interlingua',
			'nap': 'Nnapulitano',
			'bat-smg': 'Žemaitėška',
			'map-bms': 'Basa Banyumasan',
			'als': 'Alemannisch',
			'wa': 'Walon',
			'kn': 'ಕನ್ನಡ',
			'am': 'አማርኛ',
			'sco': 'Scots',
			'ckb': 'Soranî / کوردی',
			'gd': 'Gàidhlig',
			'bug': 'Basa Ugi',
			'tg': 'Тоҷикӣ',
			'mzn': 'مَزِروني',
			'hif': 'Fiji Hindi',
			'zh-min-nan': 'Bân-lâm-gú',
			'yi': 'ייִדיש',
			'vec': 'Vèneto',
			'arz': 'مصرى (Maṣrī)',
			'roa-tara': 'Tarandíne',
			'nah': 'Nāhuatl',
			'os': 'Иронау',
			'sah': 'Саха тыла (Saxa Tyla)',
			'mn': 'Монгол',
			'sa': 'संस्कृतम्',
			'pam': 'Kapampangan',
			'hsb': 'Hornjoserbsce',
			'li': 'Limburgs',
			'mi': 'Māori',
			'si': 'සිංහල',
			'se': 'Sámegiella',
			'co': 'Corsu',
			'gan': '贛語',
			'glk': 'گیلکی',
			'bar': 'Boarisch',
			'bo': 'བོད་སྐད',
			'fo': 'Føroyskt',
			'ilo': 'Ilokano',
			'bcl': 'Bikol',
			'mrj': 'Кырык Мары (Kyryk Mary) ',
			'fiu-vro': 'Võro',
			'nds-nl': 'Nedersaksisch',
			'ps': 'پښتو',
			'tk': 'تركمن / Туркмен',
			'vls': 'West-Vlams',
			'gv': 'Gaelg',
			'rue': 'русиньскый язык',
			'pa': 'ਪੰਜਾਬੀ',
			'xmf': 'მარგალური (Margaluri)',
			'pag': 'Pangasinan',
			'dv': 'Divehi',
			'nrm': 'Nouormand/Normaund',
			'zea': 'Zeêuws',
			'kv': 'Коми',
			'koi': 'Перем Коми (Perem Komi)',
			'km': 'ភាសាខ្មែរ',
			'rm': 'Rumantsch',
			'csb': 'Kaszëbsczi',
			'lad': 'Dzhudezmo',
			'udm': 'Удмурт кыл',
			'or': 'ଓଡ଼ିଆ',
			'mt': 'Malti',
			'mhr': 'Олык Марий (Olyk Marij)',
			'fur': 'Furlan',
			'lij': 'Líguru',
			'wuu': '吴语',
			'ug': 'ئۇيغۇر تىلى',
			'frr': 'Nordfriisk',
			'pi': 'पाऴि',
			'sc': 'Sardu',
			'zh-classical': '古文 / 文言文',
			'bh': 'भोजपुरी',
			'ksh': 'Ripoarisch',
			'nov': 'Novial',
			'ang': 'Englisc',
			'so': 'Soomaaliga',
			'stq': 'Seeltersk',
			'kw': 'Kernewek/Karnuack',
			'nv': 'Diné bizaad',
			'vep': 'Vepsän',
			'hak': 'Hak-kâ-fa / 客家話',
			'ay': 'Aymar',
			'frp': 'Arpitan',
			'pcd': 'Picard',
			'ext': 'Estremeñu',
			'szl': 'Ślůnski',
			'gag': 'Gagauz',
			'gn': 'Avañe',
			'ln': 'Lingala',
			'ie': 'Interlingue',
			'eml': 'Emiliàn e rumagnòl',
			'haw': 'Hawai`i',
			'xal': 'Хальмг',
			'pfl': 'Pfälzisch',
			'pdc': 'Deitsch',
			'rw': 'Ikinyarwanda',
			'krc': 'Къарачай-Малкъар (Qarachay-Malqar)',
			'crh': 'Qırımtatarca',
			'ace': 'Bahsa Acèh',
			'to': 'faka Tonga',
			'as': 'অসমীয়া',
			'ce': 'Нохчийн',
			'kl': 'Kalaallisut',
			'arc': 'Aramaic',
			'dsb': 'Dolnoserbski',
			'myv': 'Эрзянь (Erzjanj Kelj)',
			'pap': 'Papiamentu',
			'bjn': 'Bahasa Banjar',
			'sn': 'chiShona',
			'tpi': 'Tok Pisin',
			'lbe': 'Лакку',
			'lez': 'Лезги чІал (Lezgi č’al)',
			'kab': 'Taqbaylit',
			'mdf': 'Мокшень (Mokshanj Kälj)',
			'wo': 'Wolof',
			'jbo': 'Lojban',
			'av': 'Авар',
			'srn': 'Sranantongo',
			'cbk-zam': 'Chavacano de Zamboanga',
			'bxr': 'Буряад',
			'ty': 'Reo Mā`ohi',
			'lo': 'ລາວ',
			'kbd': 'Адыгэбзэ (Adighabze)',
			'ab': 'Аҧсуа',
			'tet': 'Tetun',
			'mwl': 'Mirandés',
			'ltg': 'Latgaļu',
			'na': 'dorerin Naoero',
			'kg': 'KiKongo',
			'ig': 'Igbo',
			'nso': 'Sesotho sa Leboa',
			'za': 'Cuengh',
			'kaa': 'Qaraqalpaqsha',
			'zu': 'isiZulu',
			'chy': 'Tsetsêhestâhese',
			'rmy': 'romani - रोमानी',
			'cu': 'Словѣньскъ',
			'tn': 'Setswana',
			'chr': 'ᏣᎳᎩ',
			'got': 'Gothic',
			'cdo': 'Mìng-dĕ̤ng-ngṳ̄',
			'sm': 'Gagana Samoa',
			'bi': 'Bislama',
			'mo': 'Молдовеняскэ',
			'bm': 'Bamanankan',
			'iu': 'ᐃᓄᒃᑎᑐᑦ',
			'pih': 'Norfuk',
			'ss': 'SiSwati',
			'sd': 'سنڌي، سندھی ، सिन्ध',
			'pnt': 'Ποντιακά',
			'ee': 'Eʋegbe',
			'ki': 'Gĩkũyũ',
			'om': 'Oromoo',
			'ha': 'هَوُسَ',
			'ti': 'ትግርኛ',
			'ts': 'Xitsonga',
			'ks': 'कश्मीरी / كشميري',
			'fj': 'Na Vosa Vakaviti',
			'sg': 'Sängö',
			've': 'Tshivenda',
			'rn': 'Kirundi',
			'cr': 'Nehiyaw',
			'ak': 'Akana',
			'tum': 'chiTumbuka',
			'lg': 'Luganda',
			'dz': 'ཇོང་ཁ',
			'ny': 'Chi-Chewa',
			'ik': 'Iñupiak',
			'ch': 'Chamoru',
			'ff': 'Fulfulde',
			'st': 'Sesotho',
			'tw': 'Twi',
			'xh': 'isiXhosa',
			'ng': 'Oshiwambo',
			'ii': 'ꆇꉙ',
			'cho': 'Choctaw',
			'mh': 'Ebon',
			'aa': 'Afar',
			'kj': 'Kuanyama',
			'ho': 'Hiri Motu',
			'mus': 'Muskogee',
			'kr': 'Kanuri',
			'hz': 'Otsiherero'
		};

		var language = langarray[langCode];

		return language;

	};

	function graphEventHandlers(){

		// We first need to save the original colors of our
		// nodes and edges, like this:
		wikiverse.mindmap.graph.nodes().forEach(function(n) {
		  n.originalColor = n.color;
		});
		wikiverse.mindmap.graph.edges().forEach(function(e) {
		  e.originalColor = e.color;
		});

		// When a node is clicked, we check for each node
		// if it is a neighbor of the clicked one. If not,
		// we set its color as grey, and else, it takes its
		// original color.
		// We do the same for the edges, and we only keep
		// edges that have both extremities colored.
		wikiverse.mindmap.bind('clickNode', function(e) {
		  var nodeId = e.data.node.id,
		      toKeep = wikiverse.mindmap.graph.neighbors(nodeId);
		  toKeep[nodeId] = e.data.node;

		  wikiverse.mindmap.graph.nodes().forEach(function(n) {
		    if (toKeep[n.id]){
		      n.color = n.originalColor;
		  	  n.icon.color = "#fff";
		  	}
		    else
		      n.color = '#eee';
		  });

		  wikiverse.mindmap.graph.edges().forEach(function(e) {
		    if (toKeep[e.source] && toKeep[e.target])
		      e.color = e.originalColor;
		    else
		      e.color = '#eee';
		  });

		  // Since the data has been modified, we need to
		  // call the refresh method to make the colors
		  // update effective.
		  wikiverse.mindmap.refresh();
		});

		// When the stage is clicked, we just color each
		// node and edge with its original color.
		/*wikiverse.mindmap.bind('clickStage', function(e) {
		  wikiverse.mindmap.graph.nodes().forEach(function(n) {
		    n.color = n.originalColor;
		  });

		  wikiverse.mindmap.graph.edges().forEach(function(e) {
		    e.color = e.originalColor;
		  });

		  // Same as in the previous event:
		  wikiverse.mindmap.refresh();
		});*/
	}

	//----------------keyboard shortcuts----------------------------


	//CTRL-S for save board
	document.addEventListener("keydown", function(e) {
		if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			$('#saveBoard').trigger('click');
		}
	}, false);


	/*document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 87) {
			e.preventDefault();
			$('li#wikipedia').trigger('click');
		}
	}, false);

	document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 89) {
			e.preventDefault();
			$('li#youtube').trigger('click');
		}
	}, false);

	document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 71) {
			e.preventDefault();
			$('li#gmaps').trigger('click');
		}
	}, false);

	document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 70) {
			e.preventDefault();
			$('li#flickr').trigger('click');
		}
	}, false);

	document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 73) {
			e.preventDefault();
			$('li#instagram').trigger('click');
		}
	}, false);

	document.addEventListener("keydown", function(e) {
		if (!($("input").is(":focus")) && e.keyCode === 65) {
			e.preventDefault();
			$('li#instagram').trigger('click');
			$('li#gmaps').trigger('click');
			$('li#flickr').trigger('click');
			$('li#soundcloud').trigger('click');
			$('li#wikipedia').trigger('click');
			$('li#youtube').trigger('click');
		}
	}, false);*/

	//call the board-pilots on click (saveboard, clearboard, etc)
	$('.board-pilot').click(function() {

		//Close the sidebar if open:
		if ($('body').hasClass('cbp-spmenu-push-toright')) {
			toggleSidebar();
		}

		wikiverse[$(this).attr('id')](wpnonce);
	});


	//----------------keyboard shortcuts----------------------------



	//----------------EVENTS----------------------------
	//

	$('.otherSource').change(function(event) {
		getConnections($(this).val(), $(this).parents('#sidebar').find('h3').html(), $searchKeyword.data('parent'));
	});

	//close sidebar
	$('#sidebar .fa').click(function() {
		toggleSidebar();
	});

	//close sidebar
	$('#rightSidebar .fa').click(function() {
		toggleRightSidebar();
	});

	function removeIDfromThisBoardsIds(id){

		//delete item from thisBoardsIds
		var indexToDelete = wikiverse.thisBoardsIDs.indexOf(id);

		if (indexToDelete > -1) {
		    wikiverse.thisBoardsIDs.splice(indexToDelete, 1);
		}		

	}

	// REMOVE ITEM
	$packeryContainer.on("click", ".brick .cross", function() {

		var $thisBrick = $(this).parent(".brick");

		if(!$thisBrick.hasClass('gmaps')) removeNode($thisBrick.data('id'), $thisBrick);

		//$thisBrick.fadeOut('slow').remove();
		$packeryContainer.packery('remove', $thisBrick);
		$packeryContainer.packery();
	});

	//show save board button on packery change (needs work)
	$packeryContainer.packery('on', 'layoutComplete', function(pckryInstance, laidOutItems) {

		//cant use show() or fadeIn() coz it messes up the bootstrap nav
		$(".board-pilot, .searchButton").removeClass('invisible');

	});

	//detect if user is interacting with a board of somebody else
	$packeryContainer.one('click', '.brick', function() {
		new PNotify({
			text: $('#author').attr('data-message'),
			type: 'info',
			styling: 'fontawesome',
			shadow: false,
			animation: 'fade',
			addclass: "stack-topright",
			stack: myStack,
			nonblock: {
				nonblock: true,
				nonblock_opacity: 0.2
			}
		});
	});
/*
	// show item order after layout
	function orderItems() {
	  var itemElems = pckry.getItemElements();
	  for ( var i=0, len = itemElems.length; i < len; i++ ) {
	    var elem = itemElems[i];
	    elem.textContent = i + 1;
	  }
	  console.log(itemElems);
	}

	$packeryContainer.on( 'layoutComplete', orderItems );*/

	//Toggle Size of Images on click
	$packeryContainer.on('dblclick', 'img', toggleImageSize);

	return wikiverse;

})(jQuery);
