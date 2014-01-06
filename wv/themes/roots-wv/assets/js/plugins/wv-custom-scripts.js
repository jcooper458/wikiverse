var $container = $('#packery');

var $wikiSearchBrick = $("#wikipedia-search");
var $youtubeSearchBrick = $("#youtube-search");
var $flickrSearchBrick = $("#flickr-search");
var $gmapsSearchBrick = $("#gmaps-search");

function buildNextTopic($brick, lang){
	
	$brick.find("a").unbind('click').click(function(e) {
		
		e.preventDefault();
		
		var topic = $(this).attr("title");
		$(this).contents().unwrap();

		buildWikipedia(topic, lang);
		return false;
	});
}

function getGmaps(query){

	//create the geocoder
	var geocoder = new google.maps.Geocoder();
	var center;
	var currentMap;

	//geocode adress
	geocoder.geocode( { 'address': query}, function(results, status) {

		if (status === google.maps.GeocoderStatus.OK) {
			
			//console.log(results[0].geometry.bounds);
			currentMap = {
					center: results[0].geometry.location,
					bounds: results[0].geometry.bounds,
					maptype: "roadmap"
				};

			buildGmaps(currentMap);
		
		} else {
			alert("No place has been found with that query.. Try something else.");
		}
		
		
		
	});
}

function buildGmaps(mapObj){


	var map;
	var myMaptypeID;
	var $mapbrick;
	var currentMap;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map-canvas"></div>');

	$mapbrick = $('<div class="brick w2" data-type="gmaps" data-topic=""></div>').append($mapcanvas);
	$mapbrick.prepend('<span class="cross"> ✘ </span>');
	
	$container.append($mapbrick).packery( 'appended', $mapbrick);

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
	var myLatlng = new google.maps.LatLng(mapObj.center.nb, mapObj.center.ob);
	
	//same for the bounds, on top we need to rebuild LatLngs to re-build a bounds object
	var LatLng1 = new google.maps.LatLng(mapObj.bounds.ea.d, mapObj.bounds.fa.b);
	var LatLng2 = new google.maps.LatLng(mapObj.bounds.ea.b, mapObj.bounds.fa.d);
	
	//last but not least: the bound object with the newly created Latlngs
	var myBounds = new google.maps.LatLngBounds(LatLng1, LatLng2);

	var mapOptions = {
		zoom: 8,
		center: myLatlng,
		draggable: false,
		scrollwheel: false,
		mapTypeId: myMaptypeID
	};

	map = new google.maps.Map($mapcanvas[0], mapOptions);

	map.fitBounds(myBounds);


	google.maps.event.addListener(map, 'idle', function() {

		currentMap = {
			center: map.getCenter(),
			bounds: map.getBounds(),
			maptype: map.getMapTypeId()
		};
	
		$mapbrick.data( "topic", currentMap );

	});

	google.maps.event.addListener(map, 'maptypeid_changed', function() {

		currentMap.maptype = map.getMapTypeId();
		
		$mapbrick.data( "topic", currentMap );

	});

	var thePanorama = map.getStreetView(); //get the streetview object
	
	//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position,
				zoom: thePanorama.pov.zoom,
				adress: thePanorama.links[0].description,
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
				center: thePanorama.position,
				zoom: thePanorama.pov.zoom,
				adress: thePanorama.links[0].description,
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

	var $mapcanvas = $('<div id="map-canvas"></div>');

	$mapbrick = $('<div class="brick w2" data-type="streetview" data-topic=""></div>').append($mapcanvas);
	$mapbrick.prepend('<span class="cross"> ✘ </span>');
	
	$container.append($mapbrick).packery( 'appended', $mapbrick);
	$mapbrick.each( makeEachDraggable );


	var center = new google.maps.LatLng(streetObj.center.nb, streetObj.center.ob);

	var panoramaOptions = {
			position:center,
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
			center: thePanorama.position,
			zoom: thePanorama.pov.zoom,
			adress: thePanorama.links[0].description,
			pitch: thePanorama.pov.pitch,
			heading: thePanorama.pov.heading
		};

		$mapbrick.data( "topic", currentStreetMap );

	});

	//if nothing changes, re-save the data-topic (otherwise its lost upon resave without moving)
	$mapbrick.data( "topic", streetObj );
}

function buildFlickr(photoURL){

	var $flickrPhoto = $('<img width="600" src="'+photoURL+'">');
	
	var $flickrBrick = $('<div class="brick w2" data-type="flickr" data-topic="'+photoURL+'"></div>').append($flickrPhoto);
	$flickrBrick.prepend('<span class="cross"> ✘ </span>');

	$flickrBrick.imagesLoaded(function(){

		$container.append($flickrBrick).packery( 'appended', $flickrBrick);
	
	});

	$flickrBrick.each( makeEachDraggable );

}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function getFlickrs(topic) {

	var $divFlickrResults = $('<div class="flickr"></div>');
	//if no table is already in the brick
	if($flickrSearchBrick.find('div.flickr').length === 0){

		$flickrSearchBrick.append($divFlickrResults);
	}

    $.ajax({
        url: 'http://api.flickr.com/services/rest',
        data:{

            method: 'flickr.photos.search',
            api_key: '1a7d3826d58da8a6285ef7062f670d30',
            text: topic,
            format: 'json',
            nojsoncallback: 1,
            per_page: 20,
            sort: 'interestingness-desc'
        },
        success: function(data){

			$.each(data.photos.photo, function(){

				$.ajax({
					url: 'http://api.flickr.com/services/rest',
					data:{

						method: 'flickr.photos.getSizes',
						api_key: '1a7d3826d58da8a6285ef7062f670d30',
						photo_id: this.id,
						format: 'json',
						nojsoncallback: 1
					},
					success: function(data){

						var thumbURL = data.sizes.size[1].source;
						var mediumURL = data.sizes.size[6].source;

						//append row to searchbox-table 
						$divFlickrResults.append('<img width="149" large="'+mediumURL+'" src="'+thumbURL+'">');
						
						//relayout packery
						$container.packery();

						$divFlickrResults.find('img').unbind('click').click(function(e) {

							var thisURL = $(this).attr('large');
							buildFlickr(thisURL);
						});
						

					}

				});
			});

		},
        error: function (data){
			console.log(data);
            /*var $container = $('#packery');
            var content = "Flickr error..";
            var $box = $('<p></p>').append(content);
                $box = $('<div class="brick "></div>').append($box);
              
				$container.append($box).packery( 'appended', $box );
			*/
        
            return false;
            }
    });
}

function getYoutubes(topic) {

	var $tableYoutubeResults = $('<table class="table table-hover youtube"></table>');
	//if no table is already in the brick
	if($youtubeSearchBrick.find('table.youtube').length === 0){

		$youtubeSearchBrick.append($tableYoutubeResults);
	}

    $.ajax({
        url: 'https://gdata.youtube.com/feeds/api/videos',
        data:{

            q:topic,
            alt: 'json',
            'max-results': 10
        },
        dataType:'jsonp',
        success: function(data){

			if(data.feed.entry ){
				$.each(data.feed.entry, function(){
					
					var title = this.title.$t;
					var snippet = this.content.$t;
					var youtubeID = this.id.$t.match(/[^\\/]+$/);
					var thumbnailURL = this.media$group.media$thumbnail[1].url;

					//append row to searchbox-table 
					$tableYoutubeResults.append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td class="youtubeThumb"><img src="'+thumbnailURL+'"></td><td class="result" youtubeID="'+youtubeID+'">'+title+'</td></tr>');
					
					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});

					//bind event to every row -> so you can start the wikiverse
					$tableYoutubeResults.find('tr').unbind('click').click(function(e) {
		
						var currentYoutubeID = $(this).find('.result').attr('youtubeID');
						
						buildYoutube(currentYoutubeID);

						return false;
					});

				});

				//if no nav is already in the brick	
				if($youtubeSearchBrick.find('.nav').length === 0 ){
			
					//append a clear button and the wikipedia icon
					$youtubeSearchBrick.append('<div class="search-ui"><ul class="nav nav-pills"><li class="pull-right"><a id="clear"><h6>clear results</h6></a></li></ul></div');

				}
				
				//when clear results is clicked
				$('#clear').on('click', function(){

					//remove all UI elements
					$tableYoutubeResults.remove();
					$(this).parents('.search-ui').remove();

					//empty the youtube-searchbox for new search
					$('#youtube-searchinput').val('');
				});

				//relayout packery
				$container.packery();

			//nothing has been found on Wikipedia
			}else{

				//append row to searchbox-table: NO RESULTS
				$tableYoutubeResults.append('<tr class="no-results"><td>No Youtube Videos found for "'+topic+'"</td></tr>');

				//destroy all UI after 2 seconds
				setTimeout( function(){

					//if only one result is there, delete everything
					if($('table#youtube.results tr').length ===  1){

						//remove all UI elements
						$tableYoutubeResults.remove();

						//empty the wiki-searchbox for new search
						$('#youtube-searchinput').val('');

					}else{
						//only remove the not-found row
						$tableYoutubeResults.find('.no-results').remove();
						$('#youtube-searchinput').val('');
					}
					

				}, 2000 );

			}

		},
        error: function (data){
				
            var $container = $('#packery');
            var content = "Wikipedia seems to have the hickup..";
            var $box = $('<p></p>').append(content);
                $box = $('<div class="brick "></div>').append($box);
              
				$container.append($box).packery( 'appended', $box );
	
        
            return false;
            }
    });
}

function getWikis(topic, lang) {

	var $tableWikiResults = $('<table class="table table-hover wiki"></table>');

	//if no table is already in the brick
	if($wikiSearchBrick.find('table.wiki').length === 0){

		$wikiSearchBrick.append($tableWikiResults);
	
	}

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
			if(data.query.search.length !== 0 ){

				$.each(data.query.search, function(){

					var title = this.title;
					var snippet = this.snippet;
										
					//append row to searchbox-table 
					$tableWikiResults.append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td><el class="result">'+title+'</el><el class="pull-right">'+lang+'</el></td></tr>');
					
					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});
					//bind event to every row -> so you can start the wikiverse
					$tableWikiResults.find('tr').unbind('click').click(function(e) {
		
						var topic = $(this).find('.result').html();
						
						buildWikipedia(topic, lang);
						return false;
					});

				});

				//if no nav is already in the brick	
				if($wikiSearchBrick.find('.nav').length === 0 ){

					//append a clear button and the wikipedia icon
					$wikiSearchBrick.append('<div class="search-ui"><img class="wiki-icon pull-left" src="/wv/themes/roots-wv/assets/img/wikipedia_xs.png"><ul class="nav nav-pills"><li class="pull-right"><a id="clear"><h6>clear results</h6></a></li></ul></div');

				}
				
				//when clear results is clicked
				$('#clear').on('click', function(){

						//remove all UI elements
						$tableWikiResults.remove();
						$(this).parents('.search-ui').remove();

						//empty the wiki-searchbox for new search
						$('#wiki-searchinput').val('');
				});

				//relayout packery
				$container.packery();

			//nothing has been found on Wikipedia
			}else{

				//append row to searchbox-table: NO RESULTS
				$tableWikiResults.append('<tr class="no-results"><td>No Wikipedia articles found for "'+topic+'"</td></tr>');

				//destroy all UI after 2 seconds
				setTimeout( function(){

					//if only one result is there, delete everything
					if($('table#wiki.results tr').length ===  1){

						//remove all UI elements
						$tableWikiResults.remove();

						//empty the wiki-searchbox for new search
						$('#wiki-searchinput').val('');

					}else{
						//only remove the not-found row
						$tableWikiResults.find('.no-results').remove();
						$('#wiki-searchinput').val('');
					}
					

				}, 2000 );

			}
		},
        error: function (data){
				
            var $container = $('#packery');
            var content = "Wikipedia seems to have the hickup..";
            var $box = $('<p></p>').append(content);
                $box = $('<div class="brick "></div>').append($box);
              
			$container.append($box).packery( 'appended', $box );
	
        
            return false;
            }
    });
}

function buildWikipedia(topic, lang){
	
	$.ajax({
        url: 'http://'+lang+'.wikipedia.org/w/api.php',
        data:{
            action:'parse',
            page: topic,
            format:'json',
            prop:'text',
            section:0,
        },
        dataType:'jsonp',
        success: function(data){
            
            var wikitext = $("<div>"+data.parse.text['*']+"<div>").children('.infobox, p');

				wikitext.find('.error').remove();
				wikitext.find('.reference').remove();
				wikitext.find('*').css('max-width', '280px');
				wikitext.find('img').unwrap();
				wikitext.find('img').addClass('pull-left');

            var $brick = $('<p><img class="wiki-icon pull-right" src="/wv/themes/roots-wv/assets/img/wikipedia_xs.png"></p>').append('<h4>'+topic+'</h4>');
                
                $.each(wikitext, function(){

					$brick.append(this);

                });

                $brick = $('<div class="brick" data-type="wiki" data-lang="'+lang+'" data-topic="'+topic+'"></div>').append($brick);
                $brick.prepend('<span class="cross"> ✘ </span>');

                $container.append($brick).packery( 'appended', $brick);
                $brick.each( makeEachDraggable );
				
				//enable to create new bricks out of links
				buildNextTopic($brick, lang);
        }
    });
}


function buildWall(){

	var str = $("#wikiverse").html();
	
	var wikiverse =	JSON.parse(str);

	$.each(wikiverse, function() {

		if(this.Type === "wiki"){
			buildWikipedia(this.Topic, this.Language);
		}
		if(this.Type === "flickr"){
			buildFlickr(this.Topic);
		}
		if(this.Type === "youtube"){
			buildYoutube(this.Topic);
		}
		if(this.Type === "gmaps"){
			buildGmaps(this.Topic);
		}
		if(this.Type === "streetview"){
			buildStreetMap(this.Topic);
		}
	});
}



function buildYoutube(youtubeID){
	
	var $iframe = '<iframe id="ytplayer" type="text/html" width="600" height="380" src="http://www.youtube.com/embed/'+youtubeID+'" frameborder="0"/>';
	
   $iframe = $('<div class="brick w2" data-type="youtube" data-topic="'+youtubeID+'"></div>').append($iframe);
   $iframe.prepend('<span class="cross"> ✘ </span>');
                             
   $container.append($iframe).packery( 'appended', $iframe);

	$iframe.each( makeEachDraggable );
	
}


function makeEachDraggable( i, itemElem ) {
    // make element draggable with Draggabilly
    var draggie = new Draggabilly( itemElem );
    // bind Draggabilly events to Packery
    $container.packery( 'bindDraggabillyEvents', draggie );
  }
  
  
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
		$container.append($wikiSearchBrick).packery( 'prepended', $wikiSearchBrick);

	});
	
	$("#wikipedia-search .start").on("click", function(){
			
		var topic = $("#wiki-searchinput").val();

		getWikis( topic, lang );
		
	});
	
	
	
	$("#youtube-icon").on("click", function(){
		
		$youtubeSearchBrick.removeClass("invisible");
		$container.append($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);
	});
	
	$("#youtube-search .start").on("click", function(){
		
		var topic = $("#youtube-search .searchbox").val();
		getYoutubes( topic );

	});
	

	$("#flickr-icon").on("click", function(){

		$flickrSearchBrick.removeClass("invisible");
		$container.append($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);
	});

	$("#flickr-search .start").on("click", function(){
		
		var query = $("#flickr-search .searchbox").val();
		getFlickrs(query);
		
	});

	$("#gmaps-icon").on("click", function(){
	
		$gmapsSearchBrick.removeClass("invisible");
		$container.append($gmapsSearchBrick).packery( 'prepended', $gmapsSearchBrick);
	});

	$("#gmaps-search .start").on("click", function(){
		
		var query = $("#gmaps-search .searchbox").val();

		getGmaps(query);
		
	});
	
}

function createWall(wpnonce) {
	
	
	var wikiverse = {};

	var $container = $('#packery');
	
	//remove search bricks: 
	var searchBricks = jQuery(".search");
	$container.packery( 'remove', searchBricks );

	var itemElems = $container.packery('getItemElements');
	
	var tabindex = 0;
	
	$.each(itemElems, function(){

		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var language = $(this).data('lang');
		
		
		wikiverse[tabindex] = {
		
				Type: type,
				Topic: topic,
				Language: language,
			
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

	var $container = $('#packery');
	
	//remove search bricks: 
	var searchBricks = jQuery(".search");
	$container.packery( 'remove', searchBricks );
	
	var itemElems = $container.packery('getItemElements');
	
	var tabindex = 0;
	
	$.each(itemElems, function(){
		
		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var language = $(this).data('lang');

		wikiverse[tabindex] = {

				Type: type,
				Topic: topic,
				Language: language,
		
		};

		tabindex++;

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
				
			},
			error: function(MLHttpRequest, textStatus, errorThrown) {
				alert("cdascsacsa");
			}
		});
}