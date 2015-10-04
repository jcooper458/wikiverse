var WIKIVERSE = (function($) {

	var wikiverse = {};

	var close_icon = '<span class="cross control-buttons"><i class="fa fa-close"></i></span>';
	var youtube_icon = '<i class="fa fa-youtube-square"></i>';
	var loadingIcon = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right"></span>';
	var wikiverse_nav = '<select class="selectpicker connections show-menu-arrow" data-style="btn btn-default btn-xs" data-width="100%" data-size="20"><option selected="">try another source..</option><option><i class="fa fa-youtube-square youtube-icon icon"></i>youtube</option><option><i class="fa fa-flickr flickr-icon icon"></i>flickr</option><option><i class="fa fa-instagram instagram-icon icon"></i></div>instagram</option><option><i class="fa fa-soundcloud soundcloud-icon icon"></i>soundcloud</option></select>';
	var defaultBrick = '<div class="brick well well-sm">' + close_icon + '<span class="handle control-buttons"> <i class="fa fa-arrows"></i></span></div>';
	var resultsTable = '<table class="table table-hover"></table>';
	var getInstagramsButton = '<button id="getInstagrams" class="btn btn-default btn-xs getFotos" type="button">get instragram fotos of this location</button>';
	var getFlickrsButton = '<button id="getFlickrs" class="btn btn-default btn-xs getFotos" type="button">get flickr fotos of this location</button>';
	var loadingIcon = '<span id="loading" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">';
	var note = '<textarea id="note" class="form-control" placeholder="add your own infos.." rows="3"></textarea>';

	//used for pNotify
	var myStack = {"dir1":"down", "dir2":"left", "push":"top"};

	//var is_root = location.pathname === "/";

	var wpnonce = $('#nonce').html();


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
		buildYoutube,
		buildWikipedia,
		buildTweet,
		buildSection,
		buildYoutubeSearchResults,
		makeEachDraggable,
		playYoutube,
		destroyBoard,
		getLanguage;

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

	 //item ordering for saving of the bricks order
	function orderItems(packery, items) {

		var itemElems = $packeryContainer.packery('getItemElements');

		for (var i = 0, len = itemElems.length; i < len; i++) {
			var elem = itemElems[i];
			$(elem).attr("tabindex", i);
		}
	}

	//clean up the sidebar navbar for the new search
	function prepareSearchNavbar(query){

		//empty the search results
		$results.empty();
		$sidebar.find("#loading").remove();
		
		//empty the searchkeyword and re-fill it with new search query
		$searchKeyword.empty();
		$searchKeyword.append(query);

		//create a loading icon
		$sidebar.append(loadingIcon);

	}

	//callback for when search results are loaded
	function searchResultsLoaded(){
		$sidebar.find("#loading").remove();
	}

	function isPortrait(imgElement) {

		if (imgElement.width() < imgElement.height()) {
			return true;
		} else {
			return false;
		}
	}

	//callback foor content loaded into brick
	function APIsContentLoaded($brick) {
		$brick.fadeTo('slow', 1);
		$packeryContainer.packery();
	}

	//search youtube videos
	function getYoutubes($parentBrick, topic, callback) {

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
				buildYoutubeSearchResults($parentBrick, data, topic);
				callback();
			}
		});
	}

	//search for related youtube videos
	function getRelatedYoutubes(videoID, origQuery) {

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
				buildYoutubeSearchResults($(defaultBrick), data, origQuery);
				callback();
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
	function buildBrick($packeryContainer, x, y) {

		var $brick = $(defaultBrick);

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
			$packeryContainer.packery('stamp', $brick);

			var topic = $(this).attr("title");
			$(this).contents().unwrap();

			var brickData = {
				title: topic,
				language: lang
			};

			var y = parseInt($brick.css('top') + 500);
			var x = parseInt($brick.css('left') + 500);

			var $thisBrick = buildBrick($packeryContainer, x, y);

			//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
			buildWikipedia($thisBrick, brickData, $brick.attr("tabindex") - 1, APIsContentLoaded);
			$packeryContainer.packery('unstamp', $brick);
		});
	}
	//toggle the sidebar
	function toggleSidebar() {

		classie.toggle(document.body, 'cbp-spmenu-push-toright');
		classie.toggle($('#sidebar')[0], 'cbp-spmenu-open');
		classie.toggle($('#sidebar')[0], 'autoOverflow');
		classie.toggle($('#searchMeta')[0], 'fixed');

		//close and plus button logic 
		//if sidebar open, hide the plus
		if($('#sidebar').hasClass('cbp-spmenu-open')){
			$('#openSidebar').addClass('invisible');
		}else{
			$('#openSidebar').removeClass('invisible');
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
				getInstagrams($(defaultBrick), position, "coordinates");
			}
			else {
				getFlickrs($(defaultBrick), position, "relevance", "geoQuery");
			}
		});
	}

	var markers = [];

	//create the gmaps brick (first time creation)
	function getGmapsSearch($gmapsSearchBrick) {

		$gmapsSearchBrick.addClass('w2-fix visible');

		$gmapsSearchBrick.append(getInstagramsButton);
		$gmapsSearchBrick.append(getFlickrsButton);
		
		//build a search input
		var $input = $('<input class="controls" type="text" placeholder="Enter a location">');

		//append some markup to the gmaps brick
		$gmapsSearchBrick.append('<div id="map_canvas"></div>');
		$gmapsSearchBrick.append($input);		

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

		google.maps.event.addListener(map, 'idle', function() {

			currentMap = {
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

			$packeryContainer.packery();

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
	function buildGmaps($mapbrick, mapObj, callback) {

		var map;
		var myMaptypeID;
		var currentMap;
		var currentStreetMap;

		//$mapbrick.append('<input id="pac-input" class="controls" type="text" placeholder="Enter a location">');
		if(!is_root){
			$mapbrick.append(getInstagramsButton);
			$mapbrick.append(getFlickrsButton);
		}

		var $mapcanvas = $('<div id="map_canvas"></div>');

		$mapbrick.data('type', 'gmaps');
		$mapbrick.data('position', mapObj.center);
		$mapbrick.data('bounds', mapObj.bounds.southWest + "," + mapObj.bounds.northEast);

		$mapbrick
			.addClass('w2-fix')
			.addClass('gmaps');

		$mapbrick.append($mapcanvas);

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
	function buildStreetMap($mapbrick, streetObj, callback) {

		var currentStreetMap;

		var $mapcanvas = $('<div id="map_canvas"></div>');

		$mapbrick.data('type', 'streetview');
		$mapbrick.addClass('w2-fix');

		$mapbrick.prepend($mapcanvas);
		$mapbrick.prepend(getInstagramsButton);
		$mapbrick.prepend(getFlickrsButton);		

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

	//search for flickr tags
	function getFlickrTags(photoObj, callback) {

		$.ajax({
			url: 'https://api.flickr.com/services/rest',
			data: {

				method: 'flickr.photos.getInfo',
				api_key: '1a7d3826d58da8a6285ef7062f670d30',
				photo_id: photoObj.id,
				format: 'json',
				nojsoncallback: 1,
				per_page: 50
			},
			success: function(data) {
				callback(data.photo.tags.tag);
			}
		});
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

	//search for flickrs
	function getFlickrs($parentBrick, topic, sort, type, callback) {

		type = type || "textQuery";

		//if query is coordinates (bounds)
		if (type === "geoQuery") {

			var latitude = topic.split(',')[0];
			var longitude = topic.split(',')[1];

			if (valid_coords(latitude, longitude)) {

				$.ajax({
					url: 'https://api.flickr.com/services/rest',
					data: {

						method: 'flickr.places.findByLatLon',
						api_key: '1a7d3826d58da8a6285ef7062f670d30',
						lat: latitude,
						lon: longitude,
						format: 'json',
						nojsoncallback: 1
					},
					success: function(data) {

						if (data.places.place.length >= 1) {
							$.ajax({
								url: 'https://api.flickr.com/services/rest',
								data: {

									method: 'flickr.photos.search',
									api_key: '1a7d3826d58da8a6285ef7062f670d30',
									place_id: data.places.place[0].woeid,
									format: 'json',
									nojsoncallback: 1,
									per_page: 40,
									sort: sort
								},
								success: function(data) {

									if (data.photos.photo.length >= 1) {
										data.photos.photo.forEach(function(photoObj, index) {

											$.ajax({
												url: 'https://api.flickr.com/services/rest',
												data: {

													method: 'flickr.photos.getSizes',
													api_key: '1a7d3826d58da8a6285ef7062f670d30',
													photo_id: photoObj.id,
													format: 'json',
													nojsoncallback: 1
												},
												success: function(data) {
													buildFlickrSearchResults($parentBrick, data, photoObj);
													callback();
												}
											});
										});
									} else {
										$results.append('<div class="no-results">No pictures found for "' + data.places.place[0].name + '"</div>');
									}
								}
							});
						} else {
							$results.append('<div class="no-results">No places found for these coordinates: "' + topic + '"</div>');
						}
					}
				});
			} else {
				$results.append('<div class="no-results">"' + topic + '" is not a coordinate .. :( </div>');
			}
		} else if (type === "textQuery") { // is textQuery

			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data: {

					method: 'flickr.photos.search',
					api_key: '1a7d3826d58da8a6285ef7062f670d30',
					text: topic,
					format: 'json',
					nojsoncallback: 1,
					per_page: 40,
					sort: sort
				},
				success: function(data) {
					if (typeof data.photos.photo !== 'undefined' && data.photos.photo.length > 0) {
						data.photos.photo.forEach(function(photoObj, index) {

							$.ajax({
								url: 'https://api.flickr.com/services/rest',
								data: {
									method: 'flickr.photos.getSizes',
									api_key: '1a7d3826d58da8a6285ef7062f670d30',
									photo_id: photoObj.id,
									format: 'json',
									nojsoncallback: 1
								},
								success: function(data) {
									buildFlickrSearchResults($parentBrick, data, photoObj);
									callback();
								}

							});
						});
					} else {
						$results.append('<div class="no-results">No pictures found for "' + topic + '"</div>');
					}
				}
			});
		} else if (type === "userQuery") {

			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data: {

					method: 'flickr.people.findByUsername',
					api_key: '1a7d3826d58da8a6285ef7062f670d30',
					username: topic,
					format: 'json',
					nojsoncallback: 1
				},
				success: function(data) {

					if (data.user.id) {

						$.ajax({
							url: 'https://api.flickr.com/services/rest',
							data: {

								method: 'flickr.photos.search',
								api_key: '1a7d3826d58da8a6285ef7062f670d30',
								user_id: data.user.id,
								format: 'json',
								nojsoncallback: 1,
								per_page: 40,
								sort: sort
							},
							success: function(data) {
								if (typeof data.photos.photo !== 'undefined' && data.photos.photo.length > 0) {
									data.photos.photo.forEach(function(photoObj, index) {

										$.ajax({
											url: 'https://api.flickr.com/services/rest',
											data: {

												method: 'flickr.photos.getSizes',
												api_key: '1a7d3826d58da8a6285ef7062f670d30',
												photo_id: photoObj.id,
												format: 'json',
												nojsoncallback: 1
											},
											success: function(data) {
												buildFlickrSearchResults($parentBrick, data, photoObj);
												callback();
											}
										});
									});
								} else {
									$results.append('<div class="no-results">No pictures found for user "' + topic + '"</div>');
								}
							}
						});
					} else {
						$results.append('<div class="no-results">No User found with username: "' + topic + '"</div>');
					}
				}
			});
		}
	}

	//search for instagrams
	function getInstagrams($parentBrick, query, type, callback) {

		type = type || "hashtag";

		var client_id = "db522e56e7574ce9bb70fa5cc760d2e7";

		var access_parameters = {
			client_id: client_id
		};

		var instagramUrl;

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

						if (typeof data.data !== 'undefined' && data.data.length > 0) {
							data.data.forEach(function(photo, index) {
								buildInstagramSearchResults($parentBrick, photo);
								callback();
							});
						} else {
							$results.append('<div class="no-results">No pictures found at this location:  "' + query + '"</div>');
						}
					}
				});
			} else {
				$instagramSearchBrick.find('.results').append('<div class="no-results">"' + query + '" is not a coordinate .. :( </div>');
			}
		} else if (type === "hashtag") {

			instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';
			//var instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?client_id=db522e56e7574ce9bb70fa5cc760d2e7';

			$.getJSON(instagramUrl, access_parameters, function(data) {

				if (typeof data.data !== 'undefined' && data.data.length > 0) {
					data.data.forEach(function(photo, index) {
						buildInstagramSearchResults($parentBrick, photo);
						callback();
					});
				} else {
					$results.append('<div class="no-results">No pictures found for "' + query + '"</div>');
				}
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
									if (data.meta.code !== 400) {
										data.data.forEach(function(photo, index) {
											buildInstagramSearchResults($parentBrick, photo);
											callback();
										});
									} else {
										$results.append('<div class="no-results">Search failed with error message: ' + data.meta.error_message + '</div>');
									}
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
	function getConnections(source, topic) {

		//Open the sidebar:
		if (!$('body').hasClass('cbp-spmenu-push-toright')) {
			toggleSidebar();
		}

		prepareSearchNavbar(topic);

		switch (source) {

			case "flickr":
				getFlickrs($(defaultBrick), topic, "relevance", "textQuery", searchResultsLoaded);
			break;

			case "instagram":
				//remove whitespace from instagram query
				getInstagrams($(defaultBrick), topic.replace(/ /g, ''), "hashtag", searchResultsLoaded);
			break;

			case "youtube":
				getYoutubes($(defaultBrick), topic, searchResultsLoaded);
			break;

			case "soundcloud":
				getSoundcloud($(defaultBrick), topic, searchResultsLoaded);
			break;

			case "twitter":
				getTweets($(defaultBrick), topic, searchResultsLoaded);
			break;

			case "wikipedia":
				getWikis($(defaultBrick), topic, "en", searchResultsLoaded);
			break;
		}
	}

	//for twitter/flickr/instagram tags, when clicked, search those'in same source
	function onTagClickedDoSearch($brick, type) {
		$brick.find('.tag').on('click', function(e) {
			e.preventDefault();
			getConnections(type, $(this).html());
		});
	}

	//build a foto brick, either flickr or instagram
	buildFoto = function($brick, photoObj, type, callback) {

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

		if (type === "instagram") {
			if (photoObj.tags) {
				photoObj.tags.map(function(tag, index) {
					$brick.find('.foto-tags').append('#<strong><a class="instaTag tag" href="#">' + tag + '</a></strong>');
				});
			}
		} else if (type === "flickr") {

			if (!photoObj.tags) {
				//because this needs more time we are doing it on click, and not inside getFlickrs
				getFlickrTags(photoObj, function(tags) {
					//to store only the tag name and save only that
					var tempTagArray = [];

					if (tags) {
						tags.map(function(tag, index) {
							$brick.find('.foto-tags').append('#<strong><a class="flickrTag tag" href="#">' + tag.raw + '</a></strong>');
							tempTagArray.push(tag.raw);
						});

						//store the tags and re-assign them to the foto data (for later save)
						var thisPhoto = $brick.data('topic');
						thisPhoto.tags = tempTagArray;

						$brick.data('topic', thisPhoto);

						//search for tags on click
						onTagClickedDoSearch($brick, type);
					}
				});
				getFlickrUsername(photoObj.owner, function(username) {

					$brick.find('.foto-owner').empty();
					$brick.find('.foto-owner').append(username);

					//store the tags and re-assign them to the foto data (for later save)
					var thisPhoto = $brick.data('topic');
					thisPhoto.owner = username;

					$brick.data('topic', thisPhoto);

				});
			} else {

				photoObj.tags.map(function(tag, index) {
					$brick.find('.foto-tags').append('#<strong><a class="flickrTag tag" href="#">' + tag + '</a></strong>');
				});
			}
		}
		//search for tags on click
		onTagClickedDoSearch($brick, type);

		var imgLoad = imagesLoaded($brick);

		imgLoad.on('progress', function(imgLoad, image) {
			if (!image.isLoaded) {
				return;
			}
			if (photoObj.size === "small") {
				$brick.addClass('w1');
			} else if (photoObj.size === "large") {
				$brick.addClass('w2');
			}

			$packeryContainer.packery();
			callback($brick);

			//add class if is Portrait
			if (isPortrait($brick.find('img'))) {
				$brick.addClass('portrait')
			}
		});

	};

	//create the flickr brick
	buildFlickrSearchResults = function($parentBrick, apiData, photoObj) {

		if (typeof apiData.sizes.size !== 'undefined' && apiData.sizes.size.length > 0 && typeof apiData.sizes.size[6] !== 'undefined') {

			var thumbURL = apiData.sizes.size[1].source;
			var mediumURL = apiData.sizes.size[6].source;

			var $thumb = $('<img width="112" src="' + thumbURL + '">');

			$thumb.data('owner', photoObj.owner);
			$thumb.data('mediumURL', mediumURL);
			$thumb.data('id', photoObj.id);
			$thumb.data('title', photoObj.title);

			$results.append($thumb);

			var y = parseInt($parentBrick.css('top'));
			var x = parseInt($parentBrick.css('left'));

			$results.find('img').unbind('click').click(function(e) {


				var thisPhoto = {

					thumbURL: $(this).attr('src'),
					mediumURL: $(this).data('mediumURL'),
					size: 'small',
					id: $(this).data('id'),
					title: $(this).data('title'),
					owner: $(this).data('owner')

				};

				var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')) + 450, parseInt($parentBrick.css('top')) + 100);

				buildFoto($thisBrick, thisPhoto, "flickr", APIsContentLoaded);
				$(this).remove();

			});

		}
	};

	//create the instragram brick 
	buildInstagramSearchResults = function($parentBrick, photo) {

		var $thumb = $('<img class="img-search" src="' + photo.images.low_resolution.url + '" width="112">');

		$results.append($thumb);

		$thumb.data('mediumURL', photo.images.standard_resolution.url);
		$thumb.data('owner', photo.user.username);
		$thumb.data('id', photo.id);
		$thumb.data('tags', photo.tags);

		if (photo.caption) {
			$thumb.data('title', photo.caption.text);
		} else {
			$thumb.data('title', " ");
		}
		//maybe re-add later on
		//$thumb.data('filter', photo.filtér);

		var y = parseInt($parentBrick.css('top'));
		var x = parseInt($parentBrick.css('left'));

		$results.find('img').unbind('click').click(function(e) {

			var thisPhoto = {

				mediumURL: $(this).data('mediumURL'),
				thumbURL: $(this).attr('src'),
				id: $(this).data('id'),
				owner: $(this).data('owner'),
				title: $(this).data('title'),
				tags: $(this).data('tags'),
				size: 'small'
			};

			var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')) + 450, parseInt($parentBrick.css('top')) + 10);

			buildFoto($thisBrick, thisPhoto, "instagram", APIsContentLoaded);
			$(this).remove();

		});
	}


	//strip html from given text
	function strip(html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}

	//build the soundcloud brick
	function buildSoundcloud($brick, soundcloudObj, callback) {

		$brick.addClass('w2-fix');

		var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

		$brick.data('type', 'soundcloud');
		$brick.data('topic', soundcloudObj);

		$brick.append($soundcloudIframe);
		callback($brick);
	}

	//search for soundclouds
	function getSoundcloud($parentBrick, query, callback) {

		SC.initialize({
			client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
		});

		SC.get('/tracks', {
			q: query,
			limit: 50
		}, function(tracks) {

			$results.append(resultsTable);

			tracks.forEach(function(track, index) {
				
				//append row to searchbox-table
				$results.find('table').append('<tr data-toggle="tooltip" title="' + track.title + '" uri="' + track.uri + '" genre="' + track.genre + '"><td><el class="result">' + track.title + '</el></td></tr>');
				
				//create the tooltips
				$('tr').tooltip({
					animation: true,
					placement: 'bottom'
				});

				var y = parseInt($parentBrick.css('top'));
				var x = parseInt($parentBrick.css('left'));

				//bind event to every row
				$results.find('tr').unbind('click').click(function(e) {

					var soundcloudObj = {
						title: $(this).attr('title'),
						uri: $(this).attr('uri'),
						genre: $(this).attr('genre')
					};

					var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')) + 50, parseInt($parentBrick.css('top')) + 10);

					buildSoundcloud($thisBrick, soundcloudObj, APIsContentLoaded);

					$(this).tooltip('destroy');
					$(this).remove();

					return false;

				});
			});

			callback();
		
		});
	}

	//stack the twitter search results in the sidebar
	function buildTwitterSearchResults($parentBrick, apiData) {

		if (typeof apiData.statuses !== 'undefined' && apiData.statuses.length > 0) {

			$results.append(resultsTable);

			apiData.statuses.map(function(tweet, index) {

				var text = tweet.text;
				var userThumb = tweet.user.profile_image_url;				

				//append row to sidebar-results-table
				if (tweet) {
					$results.find('.table').append('<tr text="' + text + '" user="' + tweet.user.name + '"><td class="twitterThumb col-md-2"><img src="' + userThumb + '"></td><td class="result col-md-10" ><strong>' + tweet.user.name + '</strong><br>' + text + '</td></tr>');
				}

				//bind event to every row -> so you can start the wikiverse
				$results.find('tr').unbind('click').click(function(e) {

					$(this).remove();

					var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')) + 400, parseInt($parentBrick.css('top')));

					var twitterObj = {
						text: $(this).attr('text'),
						user: $(this).attr('user'),
						userThumb: $(this).find('img').attr('src')
					};

					buildTweet($thisBrick, twitterObj, APIsContentLoaded);

					return false;
				});

			});
			//nothing has been found on youtube
		} else {
			//append row to searchbox-table: NO RESULTS
			$results.append('<tr class="no-results"><td>No Tweets found .. </td></tr>');

		}
	}
	//search the Twitter API for tweets
	function getTweets($parentBrick, query, callback) {

		$.ajax({
			url: '/app/plugins/wp-twitter-api/api.php',
			data: {
				"search": query
			},
			success: function(data) {
				var $data = JSON.parse(data);

				if($data.statuses.length === 0){
					$results.append('<tr class="no-results"><td>No Tweets found for ' + query + ' .. </td></tr>');
				}
				else {
					buildTwitterSearchResults($parentBrick, $data);
					callback();
				}
			}
		});
	}

	//build a note 
	function buildNote($brick, topic, callback){

		$brick.addClass('note');
		$brick.addClass('transparent');
		$brick.removeClass('well');
		$brick.removeClass('well-sm');

		$brick.append('<blockquote>' + topic.note + '</blockquote>');

		callback($brick);
	}
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
	buildTweet = function($brick, twitterObj, callback) {

		$brick.addClass('w2-fix');
		$brick.addClass('twitter');

		//replace hashtags with links
		var tweet = twitterObj.text.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
			tweet = tweet.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
			tweet = urlify(tweet);

		var $tweetContainer = $('<div class="col-md-2"><img class="twitterUserThumb" src="' + twitterObj.userThumb + '"></div><div class="col-md-10"><strong>' + twitterObj.user + '</strong><br><p>' + tweet + '</p></div>');

		$tweetContainer.on('click', 'a:not(.externalLink)', function(event) {
			event.preventDefault();
			getConnections("twitter", $(this).attr('hashtag'))
			$(this).contents().unwrap();
		});

		$brick.data('type', 'twitter');
		$brick.data('topic', twitterObj);

		$brick.append($tweetContainer);
		callback($brick);

	};


	//gets the wikilanguages for any given article - not used at the moment
	function getWikiLanguages(topic, lang, $brick) {

		$.ajax({
			url: 'http://' + lang + '.wikipedia.org/w/api.php',
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
					var thisY = parseInt($brick.css('top'));
					var thisX = parseInt($brick.css('left'));

					langDropDown.change(function() {

						thisTopic = {
							title: $(this).children(":selected").data('topic'),
							language: $(this).children(":selected").attr('value')
						};
						var $thisBrick = buildBrick($packeryContainer, thisX, thisY);
						//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
						buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), APIsContentLoaded);
					});
					$packeryContainer.packery();
				}
			}
		});

	}

	//get the Interwikilinks for any given Wiki article
	function getInterWikiLinks(section, $brick) {

		$.ajax({
			url: 'http://' + section.language + '.wikipedia.org/w/api.php',
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

					var thisY = parseInt($brick.css('top'));
					var thisX = parseInt($brick.css('left'));

					interWikiDropDown.change(function() {

						var thisTopic = {

							title: $(this).children(":selected").attr('topic'),
							language: section.language
						};
						var $thisBrick = buildBrick($packeryContainer, thisX, thisY);
						buildWikipedia($thisBrick, thisTopic, $brick.attr("tabindex"), APIsContentLoaded);
					});

					$packeryContainer.packery();
				}
			}
		});

	}

	//search for wikis
	function getWikis($parentBrick, topic, lang, callback) {

		$.ajax({
			url: 'http://' + lang + '.wikipedia.org/w/api.php',
			data: {
				action: 'query',
				list: 'search',
				srsearch: topic,
				format: 'json',
				srlimit: 50
			},
			dataType: 'jsonp',
			success: function(data) {

				if (data.query.search.length > 0) {

					$results.append(resultsTable);

					$.each(data.query.search, function() {

						var title = this.title;
						var snippet = this.snippet;

						//stop loading glyph
						$('.glyphicon').addClass('invisible');
						
						//append row to sidebar-results-table
						$results.find('.table').append('<tr data-toggle="tooltip" title="' + strip(snippet) + '"><td><el class="result">' + title + '</el></td></tr>');
					
						//create the tooltips
						$('tr').tooltip({
							animation: false,
							placement: 'bottom'
						});
						//bind event to every row -> so you can start the wikiverse
						$results.find('tr').unbind('click').click(function(e) {

							var topic = {
								title: $(this).find('.result').html(),
								language: lang
							};
							var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')), parseInt($parentBrick.css('top')));

							//build the wikis next to the search brick
							buildWikipedia($thisBrick, topic, -1, APIsContentLoaded);

							$(this).tooltip('destroy');
							$(this).remove();

							return false;
						});

					});

					callback();

					//nothing has been found on Wikipedia
				} else {
					//append row to searchbox-table: NO RESULTS
					$results.append('<tr class="no-results"><td>No Wikipedia articles found for "' + topic + '"</td></tr>');
				}
			},
			error: function(data) {

				var $packeryContainer = $('#packery');
				var content = "Wikipedia seems to have the hickup..";
				var $box = $('<p></p>').append(content);
				$box = $('<div class="brick "></div>').append($box);

				$packeryContainer.append($box).packery('appended', $box);


				return false;
			}
		});
	}

	//search for sections of a wiki article
	function getWikiSections($brick, topic){

		$.ajax({
			url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
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

						var section = {

							title: topic.title,
							language: topic.language,
							name: $(this).html(),
							index: $(this).attr("index")
						};

						$(this).remove();

						var newY = parseInt($brick.css('top'));
						var newX = parseInt($brick.css('left'));

						var $thisBrick = buildBrick($packeryContainer, newX, newY);
						buildSection($thisBrick, section, $brick.attr("tabindex"), APIsContentLoaded);

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
	buildWikipedia = function($brick, topic, parent, callback) {
		
		var $connections = $(wikiverse_nav);
		var $sectionsButton = $('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> sections </button>');

		$brick.data('type', 'wiki');
		$brick.data('parent', parent);
		$brick.data('topic', topic);

		$brick.addClass('wiki');

		$brick.prepend('<h2>' + topic.title + '</h2>');
		
		$brick.prepend($connections);
		$connections.selectpicker();

		$connections.change(function(event) {
			getConnections($(this).find("option:selected").text(), topic.title);
		});	

		$brick.append($sectionsButton);

		$sectionsButton.on('click', function(){
			getWikiSections($brick, topic);
			$sectionsButton.remove();
		});		

		//Go get the Main Image - 2 API Calls necessairy.. :(
		$.ajax({
			url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
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
								url: 'http://en.wikipedia.org/w/api.php',
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

									imagesLoaded($brick, function() {
										$packeryContainer.packery();
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
			url: 'http://' + topic.language + '.wikipedia.org/w/api.php',
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
					//}
					//enable to create new bricks out of links
					buildNextTopic($brick, topic.language);

					callback($brick);
				}
			}
		});
	};

	//build a section brick 
	buildSection = function($brick, section, parent, callback) {

		$brick.data('type', 'wikiSection');
		$brick.data('parent', parent);
		$brick.data('topic', section);

		$brick.addClass('wiki');

		$brick.prepend('<p><h2>' + section.title + '</h2></p>');

		//search another source menu:
		var $connections = $(wikiverse_nav);
		$brick.prepend($connections);
		$connections.selectpicker();

		$connections.change(function(event) {
			getConnections($(this).find("option:selected").text(), section.title);
		});	

		$.ajax({
			url: 'http://' + section.language + '.wikipedia.org/w/api.php',
			data: {
				action: 'parse',
				page: section.title,
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
	buildYoutubeSearchResults = function($parentBrick, apiData, origQuery) {

		if (typeof apiData.items !== 'undefined' && apiData.items.length > 0) {

			apiData.items.forEach(function(video, index) {

				var title = video.snippet.title;
				var snippet = video.snippet.description;
				var youtubeID = video.id.videoId;
				var thumbURL = video.snippet.thumbnails.high.url;

				$results.append(resultsTable);

				if (youtubeID) {
					$results.find('table').append('<tr data-toggle="tooltip" youtubeID="' + youtubeID + '" title="' + strip(snippet) + '"><td class="youtubeThumb col-md-6"><img height="100" src="' + thumbURL + '"></td class="col-md-6"><td class="result" >' + title + '</td></tr>');
				}

				//create the tooltips
				$('tr').tooltip({
					animation: true,
					placement: 'bottom'
				});

				//bind event to every row -> so you can start the wikiverse
				$results.find('tr').unbind('click').click(function(e) {


					var currentYoutubeID = $(this).find('.result').attr('youtubeID');

					$(this).tooltip('destroy');
					$(this).remove();

					var $thisBrick = buildBrick($packeryContainer, parseInt($parentBrick.css('left')) + 50, parseInt($parentBrick.css('top')) + 10);

					var youtubeObj = {
						query: origQuery,
						youtubeID: $(this).attr('youtubeID'),
						size: 'small',
						thumbnailURL: $(this).find('img').attr('src')
					};

					buildYoutube($thisBrick, youtubeObj, APIsContentLoaded);

					return false;
				});

			});
			//nothing has been found on youtube
		} else {
			//append row to searchbox-table: NO RESULTS
			$results.append('<tr class="no-results"><td>No Youtube Videos found .. </td></tr>');
		}
	};

	//build a youtube brick 
	buildYoutube = function($brick, youtubeObj, callback) {

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

		$brick.data('type', 'youtube');
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
			getRelatedYoutubes(youtubeObj.youtubeID, youtubeObj.query);
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

		var iframe = '<iframe class="" id="ytplayer" type="text/html" width="460" height="260" src="http://www.youtube.com/embed/' + youtubeObj.youtubeID + '?autoplay=1" webkitallowfullscreen autoplay mozallowfullscreen allowfullscreen frameborder="0"/>';

		$brick.find('img').hide();
		$brick.find('.youtubePlayButton').hide();

		$brick.append(iframe);

		$packeryContainer.packery();
	};

	//make each brick draggable 
	makeEachDraggable = function(i, itemElem) {
		// make element draggable with Draggabilly
		var draggie = new Draggabilly(itemElem, {
			handle: '.handle'
		});
		// bind Draggabilly events to Packery
		$packeryContainer.packery('bindDraggabillyEvents', draggie);
	};

	//build a board
	wikiverse.buildBoard = function($packeryContainer, board) {

		if (typeof board.theme === 'undefined') board.theme = "superhero";

		$('link[title="main"]').attr('href', "//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/" + board.theme + "/bootstrap.min.css");
		$('body').data('theme', board.theme);

		$('#wvTitle > h1').append(board.title);
		$('#boardDescription').append(board.description);

		$.each(board.bricks, function(index, brick) {

			var $thisBrick = buildBrick($packeryContainer);

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

				case "twitter":
					buildTweet($thisBrick, brick.Topic, APIsContentLoaded);
					break;

				case "note":
					buildNote($thisBrick, brick.Topic, APIsContentLoaded);
					break;
			}

		});

	}
	//play the board - slow scrolling and fade
	wikiverse.playBoard = function(wpnonce) {
		$('#playBoard').fadeOut();
		//stop scrolling
		//$('html, body').stop(true);

		//fadeout elems
		$('.brick .fa').fadeOut();
		$('nav').fadeTo('slow', 0.3);
		$('.wikiverse-nav').fadeOut();
		$('.selectpicker').css('visibility', 'hidden');
		$('html, body').animate({
			scrollTop: $(document).height()
		}, 50000);
		return false;
	};
	//stop the playing board
	wikiverse.stopBoard = function(wpnonce) {
		$('#playBoard').fadeIn();
		$('html, body').stop(true);
		$('.brick .fa').fadeIn();
		$('nav').fadeTo('slow', 1);
		$('.wikiverse-nav').fadeIn();
		$('.selectpicker').css('visibility', 'visible');
		//$('.selectpicker').selectpicker('refresh');
		$('html, body').animate({
			scrollTop: 0
		}, 'fast');
		return false;
	};

	//toggle the search overlay
	wikiverse.toggleSearch = function() {
		
		$('.sourceParams').hide();
		$('#addNote').show();

		$('#source').val($("#source option:first").val());
		$('#source').selectpicker('refresh');

		$('#search').addClass('open');
		$('#search > form > input[type="search"]').focus();

	};

	//fork the board, copy it to your boards
	wikiverse.forkBoard = function(wpnonce) {
		var forkedTitle = $('#wvTitle h1').html();
		var newAuthor = $('#wvAuthor').attr('data-currentUser');

		wikiverse.createBoard(wpnonce, forkedTitle, newAuthor);
	};

	//collect the bricks for saveboard/createboard/forkboard
	wikiverse.collectBricks = function() {

		var wikiverseParsed = {};
		var $firstBrick = $packeryContainer.find('.brick[tabindex=0]'); 
		var featuredImage; 

		if($firstBrick.data('type') === "streetview"){
			featuredImage = $firstBrick.data('featuredImage');
		}
		else {
			featuredImage = $firstBrick.find('img').attr('src');
		}
		 

		var board = {
			"title": "",
			"author": $('#wvAuthor').attr('data-author'),
			"theme": $('body').data('theme'),
			"featured_image": featuredImage,
			"bricks": wikiverseParsed
		};

		var bricks = $packeryContainer.packery('getItemElements');

		var tabindex = 0;

		$.each(bricks, function() {

			var type = $(this).data('type');
			var topic = $(this).data('topic');
			var parent = $(this).data('parent');

			wikiverseParsed[tabindex] = {

				Type: type,
				Topic: topic,
				Parent: parent
			};
			tabindex++;
		});

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
					url: "/wp/wp-admin/admin-ajax.php",
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
		}
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

	//initiate the wikiverse search functionality
	wikiverse.initSearch = function() {

		//but also open the search if clicked
		$('.searchButton').on('click', function(event) {
			event.preventDefault();
			wikiverse.toggleSearch();

			//Close the sidebar, if open:
			if ($('body').hasClass('cbp-spmenu-push-toright')) {
				toggleSidebar();
			}
		});

		//close the search
		$('#search, #search button.close').on('click', function(event) {
			if (event.target.className === 'close') {
				$(this).removeClass('open');
			}
		});

		//adding escape functionality for closing search
		$(document).keyup(function(e) {
			if ($('#search').hasClass('open') && e.keyCode === 27) { // escape key maps to keycode `27`
				$('#search').removeClass('open');
			}
		});

		//topbrick is the toppest brick in regards to the scroll position
		//this is used to insert bricks at the same height of the scroll position
		var $topBrick = $(defaultBrick);

		//detect top element
		$(document).scroll(function() {
			var cutoff = $(window).scrollTop();
			$('.brick').removeClass('top').each(function() {
				if ($(this).offset().top > cutoff) {
					$topBrick = $(this);
					$topBrick.addClass('top');

					return false; // stops the iteration after the first one on screen
				}
			});
		});

		//set default lang to english
		var lang = "en";

		$('#langselect').live('change', function() {
			lang = $(this).val();
		});

		$('div.sourceParams').hide();

		//first dropdown (source), on change, conditionally open the others
		$('#source').on('change', function() {

			var selected = $('#source option:selected').val();

			//hide add a note
			$("div#addNote.row").hide();

			if (selected === "instagram") {
				$('div.sourceParams').hide();
				$("div#instagramType.row").show();
				$("div#searchInput.row").show();
				$("div#searchButton.row").show();
			} else if (selected === "wikipedia") {
				//WIKIPEDIA AUTOCOMPLETE
				$('#searchInput input').typeahead('destroy');
				$('#searchInput input').typeahead({
					source: function(query, process) {
						return $.ajax({
							url: 'http://' + lang + '.wikipedia.org/w/api.php',
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
					matcher: function(item) {
						if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
							return true;
						}
					}
				});
				$('div.sourceParams').hide();
				$("div#wikipediaType.row").show();
				$("div#searchInput.row").show();
				$("div#searchButton.row").show();
			} else if (selected === "flickr") {
				$('div.sourceParams').hide();
				$("div#flickrType.row").show();
				$("div#flickrSort.row").show();
				$("div#searchInput.row").show();
				$("div#searchButton.row").show();
			} else if (selected === "gmaps") {

				var $mabDefaultBrick = $(defaultBrick);
				$('#search').removeClass('open');
				var $thisBrick = buildBrick($packeryContainer, parseInt($mabDefaultBrick.css('left')), parseInt($mabDefaultBrick.css('top')));

				getGmapsSearch($thisBrick);

			} else if (selected === "youtube") {

				//YOUTUBE AUTOCOMPLETE
				$('#searchInput input').typeahead('destroy');

				$('#searchInput input').typeahead({

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
								$.each(json[1], function() {
									resultArray.push(this[0]);
								});
								process(resultArray);
							}
						});
					},
					matcher: function(item) {
						if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
							return true;
						}
					}
				});
				$('div.sourceParams').hide();
				$("div#searchInput.row").show();
				$("div#searchButton.row").show();
			} else {
				$('div.sourceParams').hide();
				$("div#searchInput.row").show();
				$("div#searchButton.row").show();				
			}
			$('#searchInput input').focus();
		});

		$("#wv_search").on("click", function() {

			var query, topic, sort;

			//close the search
			$('#search').removeClass('open');

			//if not already open, open the sidebar:
			if (!$('body').hasClass('cbp-spmenu-push-toright')) {
				toggleSidebar();
			}

			//get the query from the search div
			query = $("#searchInput input").val();

			prepareSearchNavbar(query);

			switch ($('#source').val()) {
				case "wikipedia":					
					getWikis($topBrick, query, lang, searchResultsLoaded);
					break;

				case "flickr":
					var flickrType = $("#flickrType select").val();
					sort = $("#flickrSort select").val();
					getFlickrs($topBrick, query, sort, flickrType, searchResultsLoaded);
					break;

				case "instagram":
					var instagramType = $("#instagramType select").val();
					getInstagrams($topBrick, query, instagramType, searchResultsLoaded);
					break;

				case "youtube":
					getYoutubes($topBrick, query, searchResultsLoaded);
					break;

				case "soundcloud":
					getSoundcloud($topBrick, query, searchResultsLoaded);
					break;

				case "twitter":
					getTweets($topBrick, query, searchResultsLoaded);
					break;
			}
		});

		$("#addNoteButton").on("click", function() {
			//close the search
			$('#search').removeClass('open');

			var $noteBrick = buildBrick($packeryContainer);

			createNote($noteBrick, APIsContentLoaded);
		});

	};


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


	//----------------GENERAL STUFF----------------------------



	//$packeryContainer.find('div.brick').each( makeEachDraggable );

	//var container = document.querySelector('.packery');
	//var pckry = Packery.data( container );

	//----------------GENERAL STUFF----------------------------

	//----------------EVENTS----------------------------
	//
	/*$('#sidebar').mousewheel(function(ev, delta) {
	    var scrollTop = $(this).scrollTop();
	    $(this).scrollTop(scrollTop-Math.round(delta * 20));

	});*/

	$('.otherSource').change(function(event) {
		getConnections($(this).val(), $(this).parents('#sidebar').find('h3').html());
	});

	//close sidebar
	$('#sidebar .fa').click(function() {
		toggleSidebar();
	});

	// REMOVE ITEM
	$packeryContainer.on("click", ".brick .cross", function() {
		var $thisBrick = jQuery(this).parent(".brick");
		//$thisBrick.fadeOut('slow').remove();
		$packeryContainer.packery('remove', $thisBrick);
		$packeryContainer.packery();
	});

	// Stop PLAY when click anywhere
	$(document).on("click", function(e) {
		if (!$('#playBoard').is(":visible")) {
			wikiverse.stopBoard();
		}
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


	//Toggle Size of Images on click
	$packeryContainer.on('click', 'img', toggleImageSize);

	$packeryContainer.packery('on', 'layoutComplete', orderItems);
	$packeryContainer.packery('on', 'dragItemPositioned', orderItems);


	return wikiverse;

})(jQuery);
