'use strict';

//vendor imports
import { createStore } from 'redux'
import { wvReducer } from './reducers.js'

//wv imports
import {strip, isPortrait, urlify, inrange, valid_coords} from './helpers.js'
    
import {
    getTweets, 
    getYoutubes, 
    getRelatedYoutubes, 
    getInstagrams,
    getFlickrs,
    getFlickrUsername,
    getSoundclouds,
    getWikis
    } from './APIcalls.js';

import {stars} from './stars.js'

window.WIKIVERSE = (function($) {

    const wikiverse = {};

    const close_icon = '<span class="cross control-buttons"><i class="fa fa-close"></i></span>';
    const fotoResizeButton = '<span class="resize control-buttons"><i class="fa fa-expand"></i></span>';
    const youtube_icon = '<i class="fa fa-youtube-square"></i>';
    const wikiverse_nav = '<select class="selectpicker connections show-menu-arrow" data-style="btn btn-default btn-xs" data-width="100%" data-size="20"><option selected="">try another source..</option><option><i class="fa fa-youtube-square youtube-icon icon"></i>Youtube</option><option><i class="fa fa-twitter twitter-icon icon"></i>Twitter</option><option><i class="fa fa-flickr flickr-icon icon"></i>Flickr</option><option><i class="fa fa-instagram instagram-icon icon"></i></div>Instagram</option><option><i class="fa fa-soundcloud soundcloud-icon icon"></i>Soundcloud</option></select>';
    const handle = '<div class="row handle"><p class="text-center"><i class="fa fa-hand-rock-o"></i>&nbsp;&nbsp;grab me here</p></div>';
    const defaultBrick = `<div class="brick">${close_icon}</div>`;
    const defaultMapBrick = `<div class="brick gmaps">${handle + close_icon}</div>`;
    const tableHover = '<table class="table table-hover"></table>';
    const getInstagramsButton = '<button id="Instagram" class="btn btn-default btn-xs getFotos" type="button">get instragram fotos of this location</button>';
    const getFlickrsButton = '<button id="Flickr" class="btn btn-default btn-xs getFotos" type="button">get flickr fotos of this location</button>';
    const loadingIcon = '<span id="loading" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">';
    const note = '<textarea id="note" class="form-control" placeholder="add your own infos.." rows="3"></textarea>';

    wikiverse.sigmaSettings = {
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
        edgeHoverExtremities: true,
        mouseWheelEnabled: false,
        labelSize: "proportional",
        labelColor: "node",
        labelHoverShadow: "node",
        labelHoverColor: "node"
    };
    wikiverse.sigmaRenderer =  {
        container: document.getElementById('mindmap'),
        type: 'canvas'
    };

    //set default settings for the searches
    wikiverse.searchLang = "en";
    wikiverse.instagramSearchType = "hashtag";
    wikiverse.flickrSearchType = "textQuery";
    wikiverse.flickrSortType = "relevance";
    wikiverse.youtubeSortType ="relevance";
    wikiverse.twitterSearchType = "popular";

    const fruchtermanReingoldSettings = {
        autoArea: true,
        area: 1,
        gravity: 10,
        speed: 0.1,
        iterations: 1000
    };

    const nodeSettings = {
        Wikipedia: ["\uF266", "#89A4BE"],
        wikiSection: ["\uF266", "#89A4BE"],
        Twitter: ["\uF099", "#2CB8E3"],
        Youtube: ["\uF167", "#CC181E"],
        Instagram: ["\uF16d", "#2E5F80"],
        Flickr: ["\uF16e", "#FF0085"],
        Soundcloud: ["\uF1be", "#FF6700"],
        searchQuery: ["\uF002", "#89A4BE"],
    };

    const rmOptions = {
        speed: 700,
        moreLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> more </button>',
        lessLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> less </button>',
        afterToggle: function() {
            pckry.layout();
        }
    };
    //const is_root = location.pathname === "/";

    const wpnonce = $('#nonce').html();

    //topbrick is the toppest brick in regards to the scroll position
    //this is used to insert bricks at the same height of the scroll position
    var $topBrick = $(defaultBrick);

    const $results = $('.results');
    const $searchKeyword = $('#search-keyword');
    const $sidebar = $('#sidebar');
    const $sourceParams = $('.sourceParams');
    const $sourceType = $('.sourceType');

    //this is needed for all non-packery actions
    const $packeryContainer = $('.packery');

    //for all packery actions, use packeryContainer
    const packeryContainer = document.querySelector('#packery');

    const pckry = new Packery( packeryContainer, {
        itemSelector: '.brick',
        gutter: 10,
        transitionDuration: 0,
        columnWidth: 225
    });


    // --------SIGMA class enhancements, init, filters and eventhandlers

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

    var initialState = {
        search_history: {}
    };

    //initiate the wikiverse search functionality
    //this is called on document ready (from _main.js)
    const init = (state = initialState) => {

        wikiverse.store = createStore(wvReducer, state);

        //overwrite the wikiverse mindmapobject
        //used in both buildMindmap and init
        wikiverse.mindmap = new sigma({
            renderer: wikiverse.sigmaRenderer,
            settings: wikiverse.sigmaSettings
        });
        //overwrite the wikiverse mindmap filter
        wikiverse.filter = sigma.plugins.filter(wikiverse.mindmap);
        wikiverse.cam = wikiverse.mindmap.camera;

        mindMapEventHandler();

        //hide the sources button that hold results
        //  $('.source').hide();
        $sourceParams.hide();

    }

    const searchResultsListBuilt = ($results) => {

        $results.find('.result').unbind('click').on('click', function(event) {

            //if there is no parent saved in the searchkeyword, you are searching for soemthign new, thus
            //updatethesearchistory and use that searchquery for a fresh parent node in the mindmap
            if (!$searchKeyword.data('parent')) {
                updateSearchHistory();
            }

            //if there is a searchkeyword parent, we are using the search to continue a topic, take that as parent
            //if not, it means we are pushing a topic to the board for the first time, take the searchquery id as parent
            //
            //not that updateSearchhistory is emptying the searchkeyword.data(parent) in case something is added to the searchhistory,
            //thus forcing the second (if not) state!
            var parent = $searchKeyword.data('parent') || wikiverse.store.getState().search_history[$searchKeyword.val().toLowerCase()];

            var x = parseInt($topBrick.css('left'));
            var y = parseInt($topBrick.css('top')) - 200;

            var $thisBrick = buildBrick([x, y], undefined, parent);
            var result = $(this).data("topic");

            //concatenate the respective function to push bricks to the board (buildWikis, buildYoutubes, etc)
            wikiverse["build" + result.Type]($thisBrick, result.Topic, brickDataLoaded);

            $(this).tooltip('destroy');
            $(this).remove();

            //build a node with the searchqueryNode as parent
            buildNode(result, $thisBrick.data('id'), parent);

        });

        //remove the loading icon when done
        $sidebar.find("#loading").remove();
    }

    //toggles the image size on click (works also for youtube)
    const toggleImageSize = ($brick, $enlargeIcon) => {

        var tempDataObj = $brick.data('topic');

        //make it large
        $brick.toggleClass("w2");

        $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            pckry.layout();
        });

        //if it is large, update the dataObj so it saves the state
        if ($brick.hasClass("w2")) {
            tempDataObj.size = 'large';
        } else {
            tempDataObj.size = 'small';
        }
        //set the dataObj to data topic
        $brick.data('topic', tempDataObj);

        //change the icon based on if expanded or compressed:
        $enlargeIcon.hasClass('fa-expand') ? $enlargeIcon.removeClass('fa-expand').addClass('fa-compress') : $enlargeIcon.removeClass('fa-compress').addClass('fa-expand');
    }

    const mindMapEventHandler = () => {

        // We first need to save the original colors of our
        // nodes and edges, like this:
        /* wikiverse.mindmap.graph.nodes().forEach(function(n) {
             n.originalColor = n.color;
         });
         wikiverse.mindmap.graph.edges().forEach(function(e) {
             e.originalColor = e.color;
         });*/

        // When a node is clicked, we check for each node
        // if it is a neighbor of the clicked one. If not,
        // we set its color as grey, and else, it takes its
        // original color.
        // We do the same for the edges, and we only keep
        // edges that have both extremities colored.
        wikiverse.mindmap.bind('clickNode', function(e) {

            var nodeId = e.data.node.id,
                toKeep = wikiverse.mindmap.graph.neighbors(nodeId);
            /* toKeep[nodeId] = e.data.node;

             wikiverse.mindmap.graph.nodes().forEach(function(n) {
                 if (toKeep[n.id]) {
                     n.color = n.originalColor;
                     n.icon.color = "#fff";
                 } else
                     n.color = '#eee';
             });

             wikiverse.mindmap.graph.edges().forEach(function(e) {
                 if (toKeep[e.source] && toKeep[e.target])
                     e.color = e.originalColor;
                 else
                     e.color = '#eee';
             });*/

            // Since the data has been modified, we need to
            // call the refresh method to make the colors
            // update effective.
            wikiverse.mindmap.refresh();

            //if not search query node, scroll to brick
            if (wikiverse.mindmap.graph.nodes(nodeId).source !== "searchQuery") {
                //scroll to clicked element

                $('html, body').animate({
                    scrollTop: $("#" + nodeId).offset().top - 40
                }, 800, function() {
                    $("#" + nodeId).fadeOut(function() {
                        $(this).fadeIn("slow");
                    });
                });

            } //if not search query node

        });

        // When the stage is clicked, we just color each
        // node and edge with its original color.
        /*wikiverse.mindmap.bind('clickStage', function(e) {
                wikiverse.mindmap.graph.nodes().forEach(function(n) {
                    n.color = n.originalColor;
                    n.icon.color = "#000";
                });

                wikiverse.mindmap.graph.edges().forEach(function(e) {
                    e.color = e.originalColor;
                });

                // Same as in the previous event:
                wikiverse.mindmap.refresh();
            });*/
    }

    //clean up the sidebar navbar for the new search
    const prepareSearchNavbar = (query, source, parent) => {
        $sourceType.hide();
        //empty the search results
        $results.empty();
        $sidebar.find("#loading").remove();

        //empty the searchkeyword and re-fill it with new search query
        $searchKeyword.val('');
        $searchKeyword.val(query.toLowerCase());

        //store the parent in case it is passed, in case we are getting a connection from the board
        if (parent) {
            $searchKeyword.data('parent', parent);
        }

        $sourceType.val(source);
        $sourceType.selectpicker('refresh');

        //create a loading icon
        $results.append(loadingIcon);

    }


    //callback for when API search results are loaded
    const searchResultsLoaded = (results, source, triggerSearchResultsFunction) => {

        //
        if (results.length > 0) {

            //this is the source button within the quicksearch
            $('#' + source).show();

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
            if (triggerSearchResultsFunction) {
                wikiverse[triggerSearchResultsFunction](results, searchResultsListBuilt);
            }
        } else {
            $results.append("Nothing found for " + $searchKeyword.val() + " on " + source);
            $results.append(". \n\nTry another source or look for something else: ");

            //remove the loading icon when done
            $sidebar.find("#loading").remove();
        }
    }


    //callback foor content loaded into brick
    const brickDataLoaded = ($brick) => {

        $brick.fadeTo('slow', 1);
        pckry.layout();
    }


    //build an empty brick
    const buildGmapsBrick = (x, y) => {

        var $brick = $(defaultMapBrick);

        packeryContainer.appendChild( $brick[0] );
        pckry.appended( $brick[0] );
        
        $brick.each(makeEachDraggable);

        //fit the brick at given position: first is x, second y
        pckry.fit($brick[0], x, y )
        pckry.layout();

        return $brick;
    }

    //for Wikipedia, trigger the next brick on click of links
    const buildNextTopic = ($brick, lang) => {

        $brick.find(".article a, .section a").unbind('click').click(function(e) {

            e.preventDefault();

            //stamp this brick so it doesnt move around
            pckry.stamp( $brick[0] )

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
            pckry.unstamp( $brick[0] )

            buildNode(brickData, $nextBrick.data('id'), $brick.data('id'));
        });
    }
        //toggle the sidebar
    const toggleSidebar = () => {

        classie.toggle($sidebar[0], 'cbp-spmenu-open');

        //focus the search input
        $searchKeyword.focus();

        //close and plus button logic
        //if sidebar open, hide the plus
        if ($sidebar.hasClass('cbp-spmenu-open')) {
            $('#openSidebar').hide();
            $('#closeSidebar').removeClass('invisible');
            $('#closeSidebar').show();
        } else {
            $('#closeSidebar').hide();
            $('#openSidebar').show();
        }
    }

    //toggle the sidebar
    const toggleBottomSidebar = () => {

        const $bottomSidebar = $('#bottomSidebar');

        //adjust the size of the mindmap container
        $("#mindmap").css("height", $bottomSidebar.height() - 10 + "px");

        classie.toggle($bottomSidebar[0], 'cbp-spmenu-open');

        //close and plus button logic
        //if sidebar open, hide the plus
        if ($bottomSidebar.hasClass('cbp-spmenu-open')) {

            //only show filters for sources that are present on the board
            updateFilters();

            sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
            wikiverse.mindmap.refresh();

            $('#closeBottomSidebar').removeClass('invisible');
            $('#closeBottomSidebar').show();
            $('#openRightSidebar').hide();
        } else {
            $('#closeBottomSidebar').hide();
            $('#openRightSidebar').show();
        }

    }

    //get the pictures for given location of a map (instagram and flickr)
    const getGmapsFotos = ($mapsBrick) => {

        $mapsBrick.find('.getFotos').on('click', function() {

            var position = $(this).parents(".brick").data("position");

            prepareSearchNavbar(position, $(this).attr('id'));

            //Open the sidebar:
            if (!$sidebar.hasClass('cbp-spmenu-open')) {
                toggleSidebar();
            }
            if ($(this).attr('id') === "Instagram") {
                getInstagrams(position, "coordinates", searchResultsLoaded, "buildFotoSearchResults");
            } else {
                getFlickrs(position, "relevance", "geoQuery", searchResultsLoaded, "buildFotoSearchResults");
            }
        });
    }

    var markers = [];

    //create the gmaps brick (first time creation)
    const getGmapsSearch = ($gmapsSearchBrick) => {

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
        google.maps.event.addListenerOnce(map, 'idle', function() {
            pckry.layout();
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
            $gmapsSearchBrick.data('position', map.getCenter().toUrlValue());
            $gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());

        });

        google.maps.event.addListener(map, 'maptypeid_changed', function() {

            currentMap.maptype = map.getMapTypeId();

            $gmapsSearchBrick.data("topic", currentMap);

            //store position and bounds into the data container (for later use of getFlickrs/Instagrams)
            $gmapsSearchBrick.data('position', map.getCenter().toUrlValue());
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
                $gmapsSearchBrick.data('position', map.getCenter().toUrlValue());
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
                $gmapsSearchBrick.data('position', map.getCenter().toUrlValue());
                $gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());
            }

        });
    }

    //build the gmaps brick (coming from database)
    wikiverse.buildGmaps = ($mapbrick, mapObj, callback) => {

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

            pckry.layout();


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
                $mapbrick.data('position', map.getCenter().toUrlValue());
                $mapbrick.data('bounds', map.getBounds().toUrlValue());
            });

            google.maps.event.addListener(map, 'maptypeid_changed', function() {

                currentMap.maptype = map.getMapTypeId();

                $mapbrick.data("topic", currentMap);

                //store position and bounds into the data container (for later use of getFlickrs/Instagrams)
                $mapbrick.data('position', map.getCenter().toUrlValue());
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
                $mapbrick.data('position', map.getCenter().toUrlValue());
                $mapbrick.data('bounds', map.getBounds().toUrlValue());
            });

            var thePanorama = map.getStreetView(); //get the streetview object

            google.maps.event.addDomListener(window, 'idle', function() {
                pckry.layout();
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
                    $mapbrick.data('position', map.getCenter().toUrlValue());
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
                    $mapbrick.data('position', map.getCenter().toUrlValue());
                    $mapbrick.data('bounds', map.getBounds().toUrlValue());
                }
            });
        }
        //build the streetmap map brick (from database)
    wikiverse.buildStreetMap = ($mapbrick, streetObj, callback) => {

        var currentStreetMap;

        var $mapcanvas = $('<div id="map_canvas"></div>');

        $mapbrick.data('type', 'streetview');
        $mapbrick.addClass('w2-fix');

        $mapbrick.append($mapcanvas);

        $mapbrick.append(getInstagramsButton);
        $mapbrick.append(getFlickrsButton);

        pckry.layout();

        //call the event for the Fotosearch on click
        getGmapsFotos($mapbrick);

        var myCenter = new google.maps.LatLng(streetObj.center.split(",")[0], streetObj.center.split(",")[1]);
        //store position and bounds into the data container (for later use of getFlickrs/Instagrams)
        $mapbrick.data('position', myCenter.toUrlValue());

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
            $mapbrick.data('position', myCenter.toUrlValue());


        });

        //if nothing changes, re-save the data-topic (otherwise its lost upon resave without moving)
        $mapbrick.data("topic", streetObj);
    }

    //for search query, trigger the search to other sources
    const getConnections = (source, topic, parent) => {

        //Open the sidebar:
        if (!$sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }

        prepareSearchNavbar(topic, source, parent);

        switch (source) {

            case "Flickr":
                getFlickrs(topic, wikiverse.flickrSortType, wikiverse.flickrSearchType, searchResultsLoaded, "buildFotoSearchResults");
                break;

            case "Instagram":
                //remove whitespace from instagram query
                getInstagrams(topic.replace(/ /g, ''), wikiverse.instagramSearchType, searchResultsLoaded, "buildFotoSearchResults");
                break;

            case "Youtube":
                getYoutubes(topic, wikiverse.youtubeSortType, wikiverse.searchLang, searchResultsLoaded, "buildYoutubeSearchResults");
                break;

            case "Soundcloud":
                getSoundclouds(topic, searchResultsLoaded, "buildListResults");
                break;

            case "Twitter":
                getTweets(topic, wikiverse.twitterSearchType, wikiverse.searchLang, searchResultsLoaded, "buildTwitterSearchResults");
                break;

            case "Wikipedia":
                getWikis(topic, wikiverse.searchLang, searchResultsLoaded, "buildListResults");
                break;
        }
    }

    wikiverse.buildFlickr = ($brick, photoObj, callback) => {

        wikiverse.buildFoto($brick, photoObj, "Flickr", callback);

    }

    wikiverse.buildInstagram = ($brick, photoObj, callback) => {

        wikiverse.buildFoto($brick, photoObj, "Instagram", callback);

    }
    
    //build a foto brick, either flickr or instagram
    wikiverse.buildFoto = ($brick, photoObj, type, callback) => {

        $brick.addClass('foto');
        $brick.data('type', type);
        $brick.data('topic', photoObj);

        var $photo = $('<img class="img-result" src="' + photoObj.mediumURL + '">');
        var $figure = $('<figure class="effect-julia"></figure>');

        var figureOverlayHTML = '<figcaption>' +
            '<h4>' + photoObj.title + ' <span class="foto-owner">by ' + photoObj.owner + '</span></h4>' +
            '<div class="foto-tags"></div>' +
            '<h5 class="fotoType"><strong>' + type.toLowerCase() + '</strong></h5>' +
            '</figcaption>' +

            $brick.prepend($(fotoResizeButton));
        $brick.append($figure);

        $figure.append($photo);
        $figure.append($(figureOverlayHTML));

        if (photoObj.tags) {
            photoObj.tags.map(function(tag, index) {
                $figure.find('.foto-tags').append('<p class="tag">#<span>' + tag + '</span></p>');
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

        if (type === "Flickr") {

            getFlickrUsername(photoObj.owner, function(username) {

                $figure.find('.foto-owner').empty();
                $figure.find('.foto-owner').append(username);

                //store the tags and re-assign them to the foto data (for later save)
                var thisPhoto = $brick.data('topic');
                thisPhoto.owner = username;

                $brick.data('topic', thisPhoto);

            });

            $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                pckry.layout();
            });

        }

        //on tag click search for tags
        $brick.find('.foto-tags .tag').on('click', function(e) {
            e.preventDefault();
            getConnections(type, $(this).find("span").html(), $brick.data('id'));
            $sourceType.trigger("change");
        });

        var imgLoad = imagesLoaded($brick);

        imgLoad.on('progress', function(imgLoad, image) {
            if (!image.isLoaded) {
                return;
            }
            callback($brick);
            pckry.layout();

        });

    };

    //create the flickr brick
    wikiverse.buildFotoSearchResults = (results, searchResultsListBuilt) => {

        results.forEach(function(result, index) {

            if (result) {

                var $result = $('<img class="result" width="118" src="' + result.Topic.thumbURL + '">');
                $result.data("topic", result);

                //append row to sidebar-results-table
                $results.append($result);

            }

        });

        searchResultsListBuilt($results);

    };


    //build the soundcloud brick
    wikiverse.buildSoundcloud = ($brick, soundcloudObj, callback) => {

        $brick.addClass('w2-fix');
        $brick.data('type', 'Soundcloud');
        $brick.data('topic', soundcloudObj);

        var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="//w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

        $brick.append($soundcloudIframe);
        $brick.prepend(handle);
        callback($brick);
    }

    wikiverse.buildListResults = (results, searchResultsListBuilt) => {

        $results.append(tableHover);

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
    wikiverse.buildTwitterSearchResults = (results) => {

        $results.append(tableHover);

        results.forEach(function(result, index) {

            var $result = $('<tr class="result"><td class="twitterThumb col-md-2"><img src="' + result.Topic.userThumb + '"></td><td class="col-md-10" ><strong>' + result.Topic.user + '</strong><br>' + result.Topic.title + '</td></tr>');
            $result.data("topic", result);

            //append row to sidebar-results-table
            $results.find('.table').append($result);

        });
        searchResultsListBuilt($results);
    }

    //build a tweet
    wikiverse.buildTwitter = ($brick, twitterObj, callback) => {

        $brick.addClass('w2');
        $brick.addClass('Twitter');

        $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            pckry.layout();
        });

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

    const updateSearchHistory = () => {

        let searchQuery = $searchKeyword.val();

        let searchHistory = wikiverse.store.getState().search_history;

        //if search keyword is not already in history, add it
        if (!searchHistory.hasOwnProperty(searchQuery.toLowerCase())) {
            searchHistory[searchQuery.toLowerCase()] =  Date.now().toString().substr(9);

            //empty the $searchkeyword parent id so that a new searchquery parent is created

            let searchQueryNodeData = {
                Topic: {
                    title: searchQuery
                },
                Type: "searchQuery",
                Id: searchHistory[searchQuery.toLowerCase()]
            }
            console.log(wikiverse.store.getState().search_history);
            //build a node for the searchquery
            buildNode(searchQueryNodeData, searchHistory[searchQuery.toLowerCase()]);
        }
    }

    //search for sections of a wiki article
    const getWikiSections = ($brick, topic) => {

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

                if (typeof data.parse.sections !== 'undefined' && data.parse.sections.length > 0) {

                    var $sectionsButton = $('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> sections </button>');

                    $brick.append($sectionsButton);
                    pckry.layout();

                    $sectionsButton.one('click', function() {

                        $(this).remove();

                        var $sectionsTable = $(tableHover)
                        $brick.append($sectionsTable);

                        data.parse.sections.forEach(function(section) {

                            //if not any of those, add the resulting sections
                            if ((section.line !== "References") && (section.line !== "Notes") && (section.line !== "External links") && (section.line !== "Citations") && (section.line !== "Bibliography") && (section.line !== "Notes and references")) {
                                $sectionsTable.append('<tr class="section" data-wvtitle="' + section.anchor + '" data-wvindex="' + section.index + '"><td>' + section.line + '</td></tr>');
                            }

                        });

                        pckry.layout();

                        //create the section object and trigger the creation of a section brick
                        $sectionsTable.find(".section").on('click', function() {

                            pckry.stamp( $brick[0] )

                            var sectionData = {
                                title: $(this).find('td').html(),
                                language: topic.language,
                                name: topic.title,
                                index: $(this).attr("data-wvindex")
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

                            pckry.unstamp( $brick[0] )
                        });

                    });
                }
            }
        });
    }

    //build a wiki Brick
    wikiverse.buildWikipedia = ($brick, topic, callback) => {

        var $connections = $(wikiverse_nav);

        $brick.data('type', 'Wikipedia');
        $brick.data('topic', topic);

        $brick.addClass('wiki');

        $brick.prepend('<h4 class="wikiTitle">' + topic.title + '</h4>');

        $brick.prepend($connections);
        $connections.selectpicker();

        $connections.change(function(event) {
            getConnections($(this).find("option:selected").text(), topic.title, $brick.data('id'));
            $sourceType.trigger('change');
        });

        $brick.one("mouseenter", function() {
            getWikiSections($brick, topic);
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

                                    image.insertAfter($brick.find(".wikiTitle"));

                                    var imgLoad = imagesLoaded($brick);

                                    imgLoad.on('progress', function(imgLoad, image) {
                                        if (!image.isLoaded) {
                                            return;
                                        }
                                        callback($brick);
                                        pckry.layout();

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
                    var paragraph = $(data.parse.text['*']).find('p:first');

                    //if there is "may refer to", also include the first list
                    if(/may refer to/i.test(paragraph.text())){
                        paragraph.append($(data.parse.text['*']).find('ul:first'));
                    }

                    paragraph.find('.error').remove();
                    paragraph.find('.reference').remove();
                    paragraph.find('.references').remove();
                    paragraph.find('.org').remove();
                    paragraph.find('.external').remove();
                    paragraph.find('#coordinates').remove();
                    //paragraph.find('*').css('max-width', '290px');
                    paragraph.find('img').unwrap();
                    paragraph.find('.IPA a').contents().unwrap();

                    var article = $('<div class="article"></div>');

                    if ($brick.find("img").length) {
                        article.insertAfter($brick.find("img"));
                    } else {
                        article.insertAfter($brick.find(".wikiTitle"));
                    }

                    article.append(paragraph);

                    article.readmore(rmOptions);

                    pckry.layout();

                    //enable to create new bricks out of links
                    buildNextTopic($brick, topic.language);

                    callback($brick);
                }
            }
        });
    };

    //build a section brick
    wikiverse.buildSection = ($brick, section, callback) => {

        $brick.data('type', 'wikiSection');
        $brick.data('topic', section);

        $brick.addClass('wiki');
        //$brick.addClass('w2');

        $brick.prepend('<h4>' + section.name + '</h4>');

        //search another source menu:
        var $connections = $(wikiverse_nav);
        $brick.prepend($connections);
        $connections.selectpicker();

        $connections.change(function(event) {
            getConnections($(this).find("option:selected").text(), section.title, $brick.data('id'));
            $sourceType.trigger("change");
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
                if (wholeSection.find('img').width() > 460 || wholeSection.find('img').attr("width") > 460) {

                    wholeSection.find('img').attr('width', 460);
                    wholeSection.find('img').removeAttr('height');
                }
                wholeSection.find('a[class*=exter]').remove();

                $brick.append(wholeSection);
                wholeSection.wrap('<div class="section"></div>');

                $('.section').readmore(rmOptions);

                //enable to create new bricks out of links
                buildNextTopic($brick, section.language);

                callback($brick);
                pckry.layout();
            }
        });
    };

    //stack the youtube search results in the sidebar
    wikiverse.buildYoutubeSearchResults = (results) => {

        $results.append(tableHover);

        results.forEach(function(result, index) {

            var $result = $('<tr class="result" data-toggle="tooltip" youtubeID="' + result.Topic.youtubeID + '" title="' + strip(result.Topic.snippet) + '"><td class="youtubeThumb col-md-6"><img height="100" src="' + result.Topic.thumbnailURL + '"></td class="col-md-6"><td>' + result.Topic.title + '</td></tr>');
            $result.data("topic", result);

            //append row to sidebar-results-table
            $results.find('.table').append($result);

        });

        searchResultsListBuilt($results);

    };

    //play a youtube video
    const playYoutube = function($brick, youtubeObj) {

        //stop all other players
        $('.youtube').find("iframe").remove();
        $('.youtube').find("img").show();
        $('.youtube').find(".youtubePlayButton").show();
        $('.youtube').removeClass("w2-fix");

        $brick.addClass('w2-fix');

        var iframe = `<iframe class="" id="ytplayer" type="text/html" width="460" height="260" src="//www.youtube.com/embed/${youtubeObj.youtubeID}'?autoplay=1" webkitallowfullscreen autoplay mozallowfullscreen allowfullscreen frameborder="0"/>`;

        $brick.find('img').hide();
        $brick.find('.youtubePlayButton').hide();

        $brick.append(iframe);

        pckry.layout();
    };

    //make each brick draggable
    const makeEachDraggable = function(i, itemElem) {

        // make element draggable with Draggabilly
        var draggie;

        if ($(itemElem).hasClass('gmaps')) {

            draggie = new Draggabilly(itemElem, {
                handle: '.handle'
            });

        } else {
            draggie = new Draggabilly(itemElem);
        }

        // bind Draggabilly events to Packery
        pckry.bindDraggabillyEvents( draggie );
    };


    const prepareBoardTitle = (board) => {

        $('#wvTitle h1').append(board.title);
        $('#boardDescription').append(board.description);

    }

    //build an empty brick
    const buildBrick = (position, id, parent) => {

        //if not provided, set position array (x,y coordinates) to 2 undefined values to omit the packery fit!
        position = position || [undefined, undefined];

        var $brick = $(defaultBrick);

        //if no id is passed from backend, get random not in this boards IDs
        id = id || Date.now().toString().substr(9);

        $brick.data('id', id);
        $brick.attr('id', "n" + id);
        $brick.data('parent', parent);

        packeryContainer.appendChild( $brick[0] );
        pckry.appended( $brick[0] );
        
        $brick.each(makeEachDraggable);

        //fit the brick at given position: first is x, second y
        pckry.fit($brick[0], position[0], position[1] )
        pckry.layout();

        return $brick;
    }

    //build a youtube brick
    wikiverse.buildYoutube = ($brick, youtubeObj, callback) => {

        let relatedButton = `<button class="btn btn-default btn-xs related" type="button">get related videos</button>`;
        let youtubeThumb = `<img class="" id="ytplayer" type="text/html" src="${youtubeObj.thumbnailURL}">`;
        let playButton = `<i class="fa youtubePlayButton fa-youtube-play"></i>`;

        //stop all other players
        $('.youtube').find("iframe").remove();
        $('.youtube').find("img").show();
        $('.youtube').find(".youtubePlayButton").show();
        $('.youtube').removeClass("w2-fix");

        $brick.addClass('youtube');

        if (youtubeObj.size === "large") {
            $brick.addClass('w2');
        }

        $brick.data('type', 'Youtube');
        $brick.data('topic', youtubeObj);

        $brick.append(relatedButton);
        $brick.append(youtubeThumb);
        $brick.append(playButton);

        imagesLoaded('#packery .youtube', function() {
            pckry.layout();
        });

        $brick.find('.youtubePlayButton').on('click', function() {
            playYoutube($brick, youtubeObj);
        });

        $brick.find('.related').on('click', function() {
            getRelatedYoutubes(youtubeObj.youtubeID, youtubeObj.query, searchResultsLoaded, "buildYoutubeSearchResults", $brick.data('id'));
            $sourceType.trigger('change');
        });

        callback($brick);
    };


    //build a board -   this is called only for saved boards (coming from db)
    const buildBoard = (board) => {

        prepareBoardTitle(board);

        //if there are bricks in the board
        if (!$.isEmptyObject(board.bricks)) {

            $.each(board.bricks, function(index, brick) {
                //set a timeout to make the building of the bricks smooth and successive
                setTimeout(function() {
                    //build a brick at position 0,0
                    var $thisBrick = (brick.Type === "gmaps" || brick.Type === "streetview") ? buildGmapsBrick([undefined, undefined]) : buildBrick([undefined, undefined], brick.Id, brick.Parent);

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
                }, 150*index);
            });
        }
        //this always needs to happen, also without any bricks, coz we need the search query nodes in the graph!
        wikiverse.buildMindmap(board);
    }

    wikiverse.buildMindmap = (board) => {

        var mindmapObj = {
            nodes: [],
            edges: []
        }

        $.each(board.search_history, function(query, id) {

            var node = {
                id: "n" + id,
                label: query,
                x: Math.random(),
                y: Math.random(),
                size: 20,
                parent: "n0",
                source: "searchQuery",
                color: '#2B3E50',
                border_color: "#89A4BE",
                icon: {
                    font: 'FontAwesome', // or 'FontAwesome' etc..
                    content: '\uF002', // or custom fontawesome code eg. "\uF129"
                    scale: 0.7, // 70% of node size
                    color: '#89A4BE' // foreground color (white)
                }
            }
            mindmapObj.nodes.push(node);
        });

        var edgeId = 0;

        $.each(board.bricks, function(key, brick) {

            //if there is an Id, and its not a gmaps or streetview brick
            if (brick.Id && (brick.Type !== "gmaps" || brick.Type !== "streetview")) {

                var node = {
                    id: "n" + brick.Id,
                    label: brick.Topic.title,
                    x: Math.random(),
                    y: Math.random(),
                    size: 10,
                    parent: "n" + brick.Parent,
                    color: '#2B3E50',
                    source: brick.Type,
                    border_size: 2,
                    border_color: "#89A4BE",
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
                    color: "#8b9aa8",
                    type: "curvedArrow"
                }

                mindmapObj.nodes.push(node);
                mindmapObj.edges.push(edge);

            }
        });
        wikiverse.mindmap.graph.read(mindmapObj);

        updateFilters();
    }


    const removeNode = (id, $brick) => {

        //get the given node by Id
        var nodesObj = wikiverse.mindmap.graph.getNodesById();
        var thisNode = nodesObj["n" + id];

        //recreate the children for this node
        wikiverse.mindmap.graph.nodes().map(function(node, index) {

            var neighbors = wikiverse.mindmap.graph.neighbors(node.id);
            delete neighbors[node.parent]
            node.children = neighbors;

        });

        //if for some reason, there is no parent, grab the root of the tree
        if (!thisNode.parent || thisNode.parent === "undefined") {
            thisNode.parent = "n" + wikiverse.searchHistory[Object.keys(wikiverse.searchHistory)[0]];
        }

        //drop the given node
        wikiverse.mindmap.graph.dropNode("n" + id);

        //get the last edge and grab its ID
        var edgesArray = wikiverse.mindmap.graph.edges();
        //if there are no edges, start with 0, if there are take the last edge, grab its id, remove the "e" from the id
        var lastEdgeId = (edgesArray.length > 0) ? parseInt(edgesArray[edgesArray.length - 1].id.replace(/\D/g, '')) : 0;

        $.each(thisNode.children, function(nodeId, nodeObj) {
            //for each child, create a new edge, thus increment
            lastEdgeId++;

            //set the new parent for the child nodes
            nodeObj.parent = thisNode.parent;

            //also update all DOM elements with given ID with the new parent (so it can be safely stored to db)
            $("#" + nodeId).data('parent', parseInt(thisNode.parent.replace(/\D/g, '')))

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
        if ($('#bottomSidebar').hasClass('cbp-spmenu-open')) {
            updateFilters();
            sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
            wikiverse.mindmap.refresh();
        }
    }

    const buildNode = (brickData, id, parent) => {

        // Then, let's add some data to display:
        wikiverse.mindmap.graph.addNode({
            id: "n" + id,
            label: brickData.Topic.title,
            x: Math.random(),
            y: Math.random(),
            size: 15,
            parent: "n" + parent,
            color: '#2B3E50',
            source: brickData.Type,
            border_size: 2,
            border_color: "#89A4BE",
            icon: {
                font: 'FontAwesome', // or 'FontAwesome' etc..
                content: nodeSettings[brickData.Type][0], // or custom fontawesome code eg. "\uF129"
                scale: 0.8, // 70% of node size
                color: nodeSettings[brickData.Type][1] // foreground color (white)
            }
        });

        //if a parent is passed, create an edge, otherwise its the first node, without parent, thus without edge
        if (parent) {

            //get the last edge and grab its ID
            var edgesArray = wikiverse.mindmap.graph.edges();
            //if there are no edges, start with 0
            var lastEdgeId = (edgesArray.length > 0) ? parseInt(edgesArray[edgesArray.length - 1].id.replace(/\D/g, '')) : 0;
            lastEdgeId++;

            wikiverse.mindmap.graph.addEdge({
                id: 'e' + lastEdgeId,
                // Reference extremities:
                source: 'n' + parent,
                target: 'n' + id,
                size: 2,
                color: "#8b9aa8",
                type: "curvedArrow"
            });
        }

        //if sidebar is open do the fruchertmanreingold, if not, dont do anything and save memory!
        if ($('#bottomSidebar').hasClass('cbp-spmenu-open')) {
            updateFilters();
            sigma.layouts.fruchtermanReingold.start(wikiverse.mindmap, fruchtermanReingoldSettings);
            wikiverse.mindmap.refresh();
        }
    }

    const updateFilters = () => {
        $('#filter button').hide();

        wikiverse.mindmap.graph.nodes().forEach(function(node, index) {
            $("#filter #filter_" + node.source).show();
        });

        $("#filter #filter_All").show();
    }

    //toggle the search overlay
    wikiverse.toggleSearch = () => {

        $('#searchResults h3').hide();

        $('.search').addClass('open');
        $('.search input[type="search"]').val('');
        $('.search input[type="search"]').focus();

        $('.source').hide();

    };

    //fork the board, copy it to your boards
    wikiverse.forkBoard = (wpnonce) => {
        var forkedTitle = $('#wvTitle h1').html();
        var newAuthor = $('#wvAuthor').attr('data-currentUser');

        wikiverse.createBoard(wpnonce, forkedTitle, newAuthor);
    };

    //collect the bricks for saveboard/createboard/forkboard
    wikiverse.collectBricks = () => {

        //get all bricks
        var bricks = pckry.getItemElements()
        //find all images
        var image = $(bricks).find('img:first');

        //identify first brick with image 
        var $firstBrickWithImage = $(image[0]).parents(".brick");
        var featuredImage;
        
        if(bricks.length > 0){            
            //if its a streetview, take the rendered streetview image stores in the gmaps function
            if ($firstBrickWithImage.data('type') === "streetview") {
                featuredImage = $firstBrick.data('featuredImage');
            } else {
                featuredImage = image[0].currentSrc
            }
        }

        var wikiverseParsed = bricks.reduce(function(Brick, brick, index) {

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
    wikiverse.saveBoard = (wpnonce) => {

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

            },
            error: function(MLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    };

    //create a new board
    wikiverse.createBoard = (wpnonce, forkedTitle, newAuthor) => {

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
                        $('#wvAuthor').html('by ' + '<a href="/user/' + board.author + '">' + board.author + '</a>');

                        var $buttonToSwap;
             

                        if (forkedTitle) {
                            $buttonToSwap = $('#forkBoard');
      
                        } else {
                            $buttonToSwap = $('#createBoard');
           
                        }

                        $buttonToSwap.removeAttr('id');
                        $buttonToSwap.attr('id', 'saveBoard');
                        $buttonToSwap.html('save changes');


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
    wikiverse.clearBoard = (wpnonce) => {

        if (confirm('Are you sure you want to clear this board?')) {

            var elements = pckry.getItemElements();
            pckry.remove( elements );

            //remove all nodes
            wikiverse.mindmap.graph.clear();

            updateFilters();

            $("#filter #filter_All").hide();
            wikiverse.mindmap.refresh();

        }
    };

    //filter by source
    const sourceFilter = (source) => {

        //reset all filters first
        wikiverse.filter.undo('node-source-equals-x').apply();

        //if All, dont filter anything
        if (source !== "All") {
            //create the mot filter
            wikiverse.filter.nodesBy(function(node) {
                return (node.source ===  source || node.source ===  "searchQuery");
            }, 'node-source-equals-x').apply();
        }
    }





    //----------------EVENTS----------------------------
    //

    $sourceType.change(function(event) {

        //these are the different dropdowns for an advanced search
        $sourceParams.hide();

        //if something is inside the search input
        if ($searchKeyword.val() !== "") {

            //grab the content
            getConnections($(this).val(), $searchKeyword.val(), $searchKeyword.data('parent'));

            //do the conditional for the respective source dropdowns
            switch ($(this).val()) {

                case "Flickr":
                    $('#flickrType, #flickrSort').show();
                    break;

                case "Instagram":
                    $('#instagramType').show();
                    break;

                case "Wikipedia":
                    $('#languageType').show();
                    break;

                case "Twitter":
                    $('#languageType, #twitterType').show();
                    break;

                case "Youtube":
                    $('#youtubeType, #languageType').show();
                    break;

            }
        } else {
            //else highlight the fact that the searchquery is empty
            $searchKeyword.fadeOut().fadeIn();
        }
    });

    $('#toggleSidebar .left').click(function() {
        toggleSidebar();
    });

    $('#toggleSidebar .right').click(function() {
        toggleBottomSidebar();
    });

    //filter
    $('#filter button').on('click', function() {
        sourceFilter($(this).attr('data-source'));
    });

    // REMOVE ITEM
    $packeryContainer.on("click", ".brick .cross", function() {

        var $thisBrick = $(this).parent(".brick");

        if (!$thisBrick.hasClass('gmaps')) removeNode($thisBrick.data('id'), $thisBrick);

        pckry.remove( $thisBrick[0] )
        pckry.layout();

    });

    //Toggle Size of Images on click
    $packeryContainer.on("click", ".foto .resize", function(e) {
        toggleImageSize($(e.target).parents(".brick"), $(e.target));
    });

    //Fix title on scroll
    $(window).scroll(function() {
        var sticky = $('#wvTitle h1'),
            scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixedTitle');
        else sticky.removeClass('fixedTitle');
    });
    //----------------keyboard shortcuts----------------------------


    //CTRL-S for save board
    document.addEventListener("keydown", function(e) {
        if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            $('#saveBoard').trigger('click');
        }
    }, false);

    $searchKeyword.keyup(function(e) {
        //reset the searchkeyword parent so that there is no parent, and thus a new searhquery node is created
        $searchKeyword.removeData('parent');

        e.preventDefault();
        //make enter save the board
        if (e.keyCode === 13) {
            $sourceType.trigger('change');
        }
    });

    //wv_search
    $('.search input').keyup(function(e) {
        e.preventDefault();

        //make enter save the board
        if (e.keyCode === 13) {

            //get the query from the search div
            var query = $("#searchInput input").val();

            //call the search functions with static, default parameters
            //this is because its a quick search via the "add content" button
            getWikis(query, "en", searchResultsLoaded);
            getSoundclouds(query, searchResultsLoaded);
            getTweets(query, "popular", "en", searchResultsLoaded);
            getYoutubes(query, "relevance", "en", searchResultsLoaded);
            getFlickrs(query, "relevance", "textQuery", searchResultsLoaded);
            getInstagrams(query, "hashtag", searchResultsLoaded);

            //reset the searchkeyword parent so that there is no parent, and thus a new searhquery node is created
            $searchKeyword.removeData('parent');
        }
    });

    //call the board-pilots on click (saveboard, clearboard, etc)
    $('.board-pilot').click(function() {

        //Close the sidebar if open:
        if ($sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }
        //save, clear or edit board
        wikiverse[$(this).attr('id')](wpnonce);
    });

    //but also open the search if clicked
    $('.searchButton').on('click', function(event) {
        event.preventDefault();
        wikiverse.toggleSearch();

        //Close the sidebar, if open:
        if ($sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }
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
        $(".brick").each(function() {
            var offset = $(this).offset();
            if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight) && first === false) {
                $(this).addClass("top");

                $topBrick = $(this);

                first = true;
            } else {
                $(this).removeClass("top");
                first = false;
            }
        });
    });

    //when any of the search source parameters are changed,
    //the value is passed to the global wikiverse source parameter variable
    //and getConnections is called via the sourceType trigger
    $sourceParams.find('select').on('change', function() {

        //wikiverse source parameter variable ()
        wikiverse[$(this).attr('id')] = $(this).val();

        //call getconnections by triggering a change on sourcetype
        $sourceType.trigger('change');
    });

    $(".source").on("click", function() {

        var query = $("#searchInput input").val();

        //close the search
        $('.search').removeClass('open');

        //if not already open, open the sidebar:
        if (!$sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }

        prepareSearchNavbar(query, $(this).attr("id"));

        var thisResultsArray = $(this).data("results");
        var functionToBuildSearchResults = $(this).attr("fn");

        wikiverse[functionToBuildSearchResults](thisResultsArray, searchResultsListBuilt);
        $sourceType.trigger('change');

    });

    $("#addMap").on("click", function() {

        var $mapDefaultBrick = $(defaultMapBrick);
        var $thisBrick = buildGmapsBrick(parseInt($mapDefaultBrick.css('left')), parseInt($mapDefaultBrick.css('top')));

        getGmapsSearch($thisBrick);

    });
    //---------------END -keyboard shortcuts----------------------------
    /* END EVENTS */

    //return stars to be used elsewhere on page
    return {init, buildBoard, stars}

})(jQuery);
