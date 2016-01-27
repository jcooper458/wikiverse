import $ from 'jquery'

//search the Twitter API for tweets
export const getTweets = (query, searchType, lang, dataLoaded, triggerSearchResultsFunction) => {

    var queryString = query + '&result_type=' + searchType + '&lang=' + lang + '&count=50';

    $.ajax({
        url: '/app/plugins/wp-twitter-api/api.php',
        data: {
            "search": queryString
        },
        success: function(data) {

            var data = JSON.parse(data);

            var resultsArray = data.statuses.map(function(tweet, index) {

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


const buildYoutubeResultArray = (data, topic, dataLoaded, triggerFunction) => {

    var resultsArray = data.items.map(function(item, index) {

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


export const getYoutubes = (topic, order, lang, dataLoaded, triggerFunction) => {

    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
            "q": topic,
            "key": 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
            "part": 'snippet',
            "order": order,
            "relevanceLanguage": lang,
            "maxResults": 50
        },
        dataType: 'jsonp',
        success: function(data) {
            buildYoutubeResultArray(data, topic, dataLoaded, triggerFunction);
        }
    });
}

export const getRelatedYoutubes = (videoID, origQuery, dataLoaded, triggerFunction, parent) => {

    prepareSearchNavbar(origQuery, "Youtube", parent);

    //Open the sidebar:
    if (!$sidebar.hasClass('cbp-spmenu-open')) {
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

export const getInstagrams = (query, type, dataLoaded, triggerSearchResultsFunction) => {

    type = type || "hashtag";

    var client_id = "db522e56e7574ce9bb70fa5cc760d2e7";

    var access_parameters = {
        client_id: client_id
    };

    var instagramUrl;

    const buildInstagramResultArray = (data, triggerSearchResultsFunction) => {

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

export const getFlickrs = (topic, sort, type, dataLoaded, triggerSearchResultsFunction) => {

    type = type || "textQuery";

    var APIextras = "url_q,url_c,tags,owner_name,geo";
    var APIkey = '1a7d3826d58da8a6285ef7062f670d30';

    const buildFlickrResultArray = (data, triggerSearchResultsFunction) => {

        var resultsArray = data.photos.photo.map(function(photoObj, index) {

            if (photoObj.url_c) {
                return {
                    Topic: {

                        owner: photoObj.owner,
                        id: photoObj.id,
                        title: photoObj.title,
                        thumbURL: photoObj.url_q,
                        mediumURL: photoObj.url_c,
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
                        per_page: 100,
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
                        per_page: 100,
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

export const getSoundclouds = (query, dataLoaded, triggerSearchResultsFunction) => {

    SC.initialize({
        client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
    });

    SC.get('/tracks', {
        q: query,
        limit: 50
    }, function(tracks) {

        //build a homogenic array here (equally looking for all sources: topic and type)
        var resultsArray = tracks.map(function(item, index) {
            return {
                Topic: {
                    title: item.title,
                    uri: item.uri,
                    snippet: item.description
                },
                Type: "Soundcloud"
            }
        });

        dataLoaded(resultsArray, "Soundcloud", triggerSearchResultsFunction);

    });
}

//"get" functions always do query the respective APIs and built an equally looking (wikiverse)results array for all sources
export const getWikis = (topic, lang, dataLoaded, triggerSearchResultsFunction) => {

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
            var resultsArray = data.query.search.map(function(item, index) {

                return {
                    Topic: {
                        title: item.title,
                        snippet: wikiverse.strip(item.snippet),
                        language: lang
                    },
                    Type: "Wikipedia"
                }
            });

            dataLoaded(resultsArray, "Wikipedia", triggerSearchResultsFunction);
        }
    });
}

export const searchResultsListBuilt = ($results) => {

    //bind event to every row -> so you can start the wikiverse
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
        var parent = $searchKeyword.data('parent') || wikiverse.searchHistory[$searchKeyword.val().toLowerCase()];

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

//get the username for any given flickr picture
export const getFlickrUsername = (user_id, callback) => {

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


