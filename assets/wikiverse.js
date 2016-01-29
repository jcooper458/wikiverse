(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFlickrUsername = exports.getWikis = exports.getSoundclouds = exports.getFlickrs = exports.getInstagrams = exports.getRelatedYoutubes = exports.getYoutubes = exports.getTweets = undefined;

var _helpers = require('./helpers.js');

var $ = jQuery;

//search the Twitter API for tweets
var getTweets = exports.getTweets = function getTweets(query, searchType, lang, dataLoaded, triggerSearchResultsFunction) {

    var queryString = query + '&result_type=' + searchType + '&lang=' + lang + '&count=50';

    $.ajax({
        url: '/app/plugins/wp-twitter-api/api.php',
        data: {
            "search": queryString
        },
        success: function success(data) {

            var data = JSON.parse(data);

            var resultsArray = data.statuses.map(function (tweet, index) {

                return {
                    Topic: {
                        title: tweet.text,
                        user: tweet.user.screen_name,
                        userThumb: tweet.user.profile_image_url_https
                    },
                    Type: "Twitter"
                };
            });
            dataLoaded(resultsArray, "Twitter", triggerSearchResultsFunction);
        }
    });
};

var buildYoutubeResultArray = function buildYoutubeResultArray(data, topic, dataLoaded, triggerFunction) {

    var resultsArray = data.items.map(function (item, index) {

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
};

var getYoutubes = exports.getYoutubes = function getYoutubes(topic, order, lang, dataLoaded, triggerFunction) {

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
        success: function success(data) {
            buildYoutubeResultArray(data, topic, dataLoaded, triggerFunction);
        }
    });
};

var getRelatedYoutubes = exports.getRelatedYoutubes = function getRelatedYoutubes(videoID, origQuery, dataLoaded, triggerFunction, parent) {

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
        success: function success(data) {
            buildYoutubeResultArray(data, origQuery, dataLoaded, triggerFunction);
        }
    });
};

var getInstagrams = exports.getInstagrams = function getInstagrams(query, type, dataLoaded, triggerSearchResultsFunction) {

    type = type || "hashtag";

    var client_id = "db522e56e7574ce9bb70fa5cc760d2e7";

    var access_parameters = {
        client_id: client_id
    };

    var instagramUrl;

    var buildInstagramResultArray = function buildInstagramResultArray(data, triggerSearchResultsFunction) {

        var resultsArray = data.data.map(function (photoObj, index) {

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
    };

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
                success: function success(data) {

                    buildInstagramResultArray(data, triggerSearchResultsFunction);
                }
            });
        } else {
            $instagramSearchBrick.find('.results').append('<div class="no-results">"' + query + '" is not a coordinate .. :( </div>');
        }
    } else if (type === "hashtag") {

        instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';
        //var instagramUrl = 'https://api.instagram.com/v1/tags/' + query + '/media/recent?client_id=db522e56e7574ce9bb70fa5cc760d2e7';

        $.getJSON(instagramUrl, access_parameters, function (data) {

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
            success: function success(data) {

                if (typeof data.data !== 'undefined' && data.data.length > 0) {

                    data.data.map(function (user, index) {

                        if (user.username === query) {
                            var userID = user.id;
                            var getUserUrl = 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?callback=?&count=40&client_id=db522e56e7574ce9bb70fa5cc760d2e7';

                            $.getJSON(getUserUrl, access_parameters, function (data) {

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
};

var getFlickrs = exports.getFlickrs = function getFlickrs(topic, sort, type, dataLoaded, triggerSearchResultsFunction) {

    type = type || "textQuery";

    var APIextras = "url_q,url_c,tags,owner_name,geo";
    var APIkey = '1a7d3826d58da8a6285ef7062f670d30';

    var buildFlickrResultArray = function buildFlickrResultArray(data, triggerSearchResultsFunction) {

        var resultsArray = data.photos.photo.map(function (photoObj, index) {

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
    };

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
            success: function success(data) {

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
                    success: function success(data) {
                        buildFlickrResultArray(data, triggerSearchResultsFunction);
                    }
                });
            }
        });
    } else if (type === "textQuery") {
        // is textQuery

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
            success: function success(data) {
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
            success: function success(data) {

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
                    success: function success(data) {
                        buildFlickrResultArray(data, triggerSearchResultsFunction);
                    }
                });
            }
        });
    }
};

var getSoundclouds = exports.getSoundclouds = function getSoundclouds(query, dataLoaded, triggerSearchResultsFunction) {

    SC.initialize({
        client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
    });

    SC.get('/tracks', {
        q: query,
        limit: 50
    }, function (tracks) {

        //build a homogenic array here (equally looking for all sources: topic and type)
        var resultsArray = tracks.map(function (item, index) {
            return {
                Topic: {
                    title: item.title,
                    uri: item.uri,
                    snippet: item.description
                },
                Type: "Soundcloud"
            };
        });

        dataLoaded(resultsArray, "Soundcloud", triggerSearchResultsFunction);
    });
};

//"get" functions always do query the respective APIs and built an equally looking results array for all sources
var getWikis = exports.getWikis = function getWikis(topic, lang, dataLoaded, triggerSearchResultsFunction) {

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
        success: function success(data) {

            //build a homogenic array here (equally looking for all sources: topic and type)
            var resultsArray = data.query.search.map(function (item, index) {

                return {
                    Topic: {
                        title: item.title,
                        snippet: (0, _helpers.strip)(item.snippet),
                        language: lang
                    },
                    Type: "Wikipedia"
                };
            });

            dataLoaded(resultsArray, "Wikipedia", triggerSearchResultsFunction);
        }
    });
};

//get the username for any given flickr picture
var getFlickrUsername = exports.getFlickrUsername = function getFlickrUsername(user_id, callback) {

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
        success: function success(data) {
            if (data.stat === "ok") {
                callback(data.person.username._content);
            }
        }
    });
};

},{"./helpers.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//strip html from given text
var strip = exports.strip = function strip(dirtyString) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = dirtyString;
    return tmp.textContent || tmp.innerText || "";
};

//check weather image is in portrait mode or not
var isPortrait = exports.isPortrait = function isPortrait(imgElement) {

    if (imgElement.width() < imgElement.height()) {
        return true;
    } else {
        return false;
    }
};

//find URLs in tweets/wikis,etc and replace them with clickable link
var urlify = exports.urlify = function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a class="externalLink" target="_blank" href="' + url + '">' + url + '</a>';
    });
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
};

//function used within validate coordinates
var inrange = exports.inrange = function inrange(min, number, max) {
    if (!isNaN(number) && number >= min && number <= max) {
        return true;
    } else {
        return false;
    }
};

//validate if it is a coordinate
var valid_coords = exports.valid_coords = function valid_coords(number_lat, number_lng) {
    if (inrange(-90, number_lat, 90) && inrange(-180, number_lng, 180)) {
        $("#btnSaveResort").removeAttr("disabled");
        return true;
    } else {
        $("#btnSaveResort").attr("disabled", "disabled");
        return false;
    }
};

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (next) {
    return function (reducer, initialState) {
      var store = next(reducer, initialState);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

module.exports = exports['default'];
},{"./compose":6}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsMapValues = require('./utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
    return bindActionCreator(actionCreator, dispatch);
  });
}

module.exports = exports['default'];
},{"./utils/mapValues":10}],5:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('./createStore');

var _utilsIsPlainObject = require('./utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

var _utilsMapValues = require('./utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

var _utilsPick = require('./utils/pick');

var _utilsPick2 = _interopRequireDefault(_utilsPick);

/* eslint-disable no-console */

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!_utilsIsPlainObject2['default'](inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

function combineReducers(reducers) {
  var finalReducers = _utilsPick2['default'](reducers, function (val) {
    return typeof val === 'function';
  });
  var sanityError;

  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination(state, action) {
    if (state === undefined) state = {};

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        console.error(warningMessage);
      }
    }

    var hasChanged = false;
    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      return nextStateForKey;
    });

    return hasChanged ? finalState : state;
  };
}

module.exports = exports['default'];
}).call(this,require('_process'))
},{"./createStore":7,"./utils/isPlainObject":9,"./utils/mapValues":10,"./utils/pick":11,"_process":15}],6:[function(require,module,exports){
/**
 * Composes single-argument functions from right to left.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
"use strict";

exports.__esModule = true;
exports["default"] = compose;

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    if (funcs.length === 0) {
      return arguments[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);

    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

module.exports = exports["default"];
},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = createStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsPlainObject = require('./utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

exports.ActionTypes = ActionTypes;
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, initialState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var listeners = [];
  var isDispatching = false;

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    listeners.push(listener);
    var isSubscribed = true;

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!_utilsIsPlainObject2['default'](action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    listeners.slice().forEach(function (listener) {
      return listener();
    });
    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  };
}
},{"./utils/isPlainObject":9}],8:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (isCrushed.name !== 'isCrushed' && process.env.NODE_ENV !== 'production') {
  /*eslint-disable no-console */
  console.error('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
  /*eslint-enable */
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
}).call(this,require('_process'))
},{"./applyMiddleware":3,"./bindActionCreators":4,"./combineReducers":5,"./compose":6,"./createStore":7,"_process":15}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = isPlainObject;
var fnToString = function fnToString(fn) {
  return Function.prototype.toString.call(fn);
};
var objStringValue = fnToString(Object);

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

function isPlainObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

  if (proto === null) {
    return true;
  }

  var constructor = proto.constructor;

  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
}

module.exports = exports['default'];
},{}],10:[function(require,module,exports){
/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj The source object.
 * @param {Function} fn The mapper function that receives the value and the key.
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
"use strict";

exports.__esModule = true;
exports["default"] = mapValues;

function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = fn(obj[key], key);
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],11:[function(require,module,exports){
/**
 * Picks key-value pairs from an object where values satisfy a predicate.
 *
 * @param {Object} obj The object to pick from.
 * @param {Function} fn The predicate the values must satisfy to be copied.
 * @returns {Object} The object with the values that satisfied the predicate.
 */
"use strict";

exports.__esModule = true;
exports["default"] = pick;

function pick(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    if (fn(obj[key])) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wvReducer = undefined;

var _redux = require('redux');

var wvReducer = exports.wvReducer = function wvReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case 'ADD_BRICK':
            return {
                title: state.title,
                author: state.author,
                featured_image: state.featured_image,
                bricks: [{ id: action.id, text: action.text }]
            };

        default:
            return state;
    }
};

// const testReducer = () => {

//     const stateBefore = {
//         title: "bob dylan",
//         author: "kubante",
//         featured_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//         bricks: []
//     };

//     const action = {
//         type: 'ADD_BRICK',
//         id: 0,
//         text: 'A brick dummy text'
//     };

//     const stateAfter = {
//         title: "bob dylan",
//         author: "kubante",
//         featured_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//         bricks: [
//             {
//                 id: 0,
//                 text: 'A brick dummy text'
//             }
//         ]
//     };

//     deepFreeze(stateBefore);
//     deepFreeze(action);

//     expect(wvReducer(stateBefore, action)).toEqual(stateAfter);
// }
// testReducer();
// console.log("all tests passed");

// const { createStore } = Redux;
// const store = createStore(wvReducer);

// store.dispatch({type: "addBrick"});

// console.log(store.getState());
//
// {
//   "title": "bob dylan",
//   "author": "kubante",
//   "featured_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//   "search_history": {
//     "bob dylan": 15,
//     "bergen": 150
//   },
//   "bricks": {}
// }

},{"redux":8}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var $ = jQuery;

//create the stars effect on homepage
var stars = exports.stars = function stars(canvas) {

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 30);
        };
    })();

    $(canvas).attr("width", $(window).width() - 20);
    $(canvas).attr("height", $("#top-home-container").height() - 10);

    var context = canvas.getContext('2d');
    var sizes = ['micro', 'mini', 'medium', 'big', 'max'];
    var elements = [];
    var max_bright = 1;
    var min_bright = .2;

    /* FUNCTIONS */
    var generate = function generate(starsCount, opacity) {
        for (var i = 0; i < starsCount; i++) {
            var x = randomInt(2, canvas.offsetWidth - 2),
                y = randomInt(2, canvas.offsetHeight - 2),
                size = sizes[randomInt(0, sizes.length - 1)];

            elements.push(star(x, y, size, opacity));
        }
    };

    var star = function star(x, y, size, alpha) {
        var radius = 0;
        switch (size) {
            case 'micro':
                radius = 0.5;
                break;
            case 'mini':
                radius = 1;
                break;
            case 'medium':
                radius = 1.5;
                break;
            case 'big':
                radius = 2;
                break;
            case 'max':
                radius = 3;
                break;
        }

        var gradient = context.createRadialGradient(x, y, 0, x + radius, y + radius, radius * 2);

        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + alpha + ')');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        /* clear background pixels */
        context.beginPath();
        context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
        context.closePath();

        /* draw star */
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = gradient;
        context.fill();

        return {
            'x': x,
            'y': y,
            'size': size,
            'alpha': alpha
        };
    };

    var randomInt = function randomInt(a, b) {
        return Math.floor(Math.random() * (b - a + 1) + a);
    };

    var randomFloatAround = function randomFloatAround(num) {
        var plusminus = randomInt(0, 1000) % 2,
            val = num;
        if (plusminus) val += 0.1;else val -= 0.1;
        return parseFloat(val.toFixed(1));
    };

    /* init */
    generate(200, .6);
};

},{}],14:[function(require,module,exports){
'use strict';

//vendor imports

var _redux = require('redux');

var _reducers = require('./reducers.js');

var _helpers = require('./helpers.js');

var _APIcalls = require('./APIcalls.js');

var _stars = require('./stars.js');

window.WIKIVERSE = (function ($) {

    var wikiverse = {};

    var close_icon = '<span class="cross control-buttons"><i class="fa fa-close"></i></span>';
    var fotoResizeButton = '<span class="resize control-buttons"><i class="fa fa-expand"></i></span>';
    var youtube_icon = '<i class="fa fa-youtube-square"></i>';
    var wikiverse_nav = '<select class="selectpicker connections show-menu-arrow" data-style="btn btn-default btn-xs" data-width="100%" data-size="20"><option selected="">try another source..</option><option><i class="fa fa-youtube-square youtube-icon icon"></i>Youtube</option><option><i class="fa fa-twitter twitter-icon icon"></i>Twitter</option><option><i class="fa fa-flickr flickr-icon icon"></i>Flickr</option><option><i class="fa fa-instagram instagram-icon icon"></i></div>Instagram</option><option><i class="fa fa-soundcloud soundcloud-icon icon"></i>Soundcloud</option></select>';
    var handle = '<div class="row handle"><p class="text-center"><i class="fa fa-hand-rock-o"></i>&nbsp;&nbsp;grab me here</p></div>';
    var defaultBrick = '<div class="brick">' + close_icon + '</div>';
    var defaultMapBrick = '<div class="brick gmaps">' + (handle + close_icon) + '</div>';
    var tableHover = '<table class="table table-hover"></table>';
    var getInstagramsButton = '<button id="Instagram" class="btn btn-default btn-xs getFotos" type="button">get instragram fotos of this location</button>';
    var getFlickrsButton = '<button id="Flickr" class="btn btn-default btn-xs getFotos" type="button">get flickr fotos of this location</button>';
    var loadingIcon = '<span id="loading" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">';
    var note = '<textarea id="note" class="form-control" placeholder="add your own infos.." rows="3"></textarea>';

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
    wikiverse.sigmaRenderer = {
        container: document.getElementById('mindmap'),
        type: 'canvas'
    };

    //set default settings for the searches
    wikiverse.searchLang = "en";
    wikiverse.instagramSearchType = "hashtag";
    wikiverse.flickrSearchType = "textQuery";
    wikiverse.flickrSortType = "relevance";
    wikiverse.youtubeSortType = "relevance";
    wikiverse.twitterSearchType = "popular";

    var fruchtermanReingoldSettings = {
        autoArea: true,
        area: 1,
        gravity: 10,
        speed: 0.1,
        iterations: 1000
    };

    var nodeSettings = {
        Wikipedia: ['', "#89A4BE"],
        wikiSection: ['', "#89A4BE"],
        Twitter: ['', "#2CB8E3"],
        Youtube: ['', "#CC181E"],
        Instagram: ['', "#2E5F80"],
        Flickr: ['', "#FF0085"],
        Soundcloud: ['', "#FF6700"],
        searchQuery: ['', "#89A4BE"]
    };

    var rmOptions = {
        speed: 700,
        moreLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> more </button>',
        lessLink: '<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> less </button>',
        afterToggle: function afterToggle() {
            pckry.layout();
        }
    };
    //const is_root = location.pathname === "/";

    var wpnonce = $('#nonce').html();

    //topbrick is the toppest brick in regards to the scroll position
    //this is used to insert bricks at the same height of the scroll position
    var $topBrick = $(defaultBrick);

    var $results = $('.results');
    var $searchKeyword = $('#search-keyword');
    var $sidebar = $('#sidebar');
    var $sourceParams = $('.sourceParams');
    var $sourceType = $('.sourceType');

    //this is needed for all non-packery actions
    var $packeryContainer = $('.packery');

    //for all packery actions, use packeryContainer
    var packeryContainer = document.querySelector('#packery');

    var pckry = new Packery(packeryContainer, {
        itemSelector: '.brick',
        gutter: 10,
        transitionDuration: 0,
        columnWidth: 225
    });

    // --------SIGMA class enhancements, init, filters and eventhandlers

    sigma.classes.graph.addMethod('neighbors', function (nodeId) {
        var k,
            neighbors = {},
            index = this.allNeighborsIndex[nodeId] || {};

        for (k in index) {
            neighbors[k] = this.nodesIndex[k];
        }return neighbors;
    });

    sigma.classes.graph.addMethod('getNodesById', function () {
        return this.nodesIndex;
    });

    var initialState = {
        search_history: {}
    };

    //initiate the wikiverse search functionality
    //this is called on document ready (from _main.js)
    wikiverse.init = function () {
        var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];

        wikiverse.store = (0, _redux.createStore)(_reducers.wvReducer, state);

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
    };

    var searchResultsListBuilt = function searchResultsListBuilt($results) {

        $results.find('.result').unbind('click').on('click', function (event) {

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

            var $thisBrick = buildBrick([parseInt($topBrick.css('left')), parseInt($topBrick.css('top')) - 200], undefined, parent);
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
    };

    //toggles the image size on click (works also for youtube)
    var toggleImageSize = function toggleImageSize($brick, $enlargeIcon) {

        var tempDataObj = $brick.data('topic');

        //make it large
        $brick.toggleClass("w2");

        $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
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
    };

    var mindMapEventHandler = function mindMapEventHandler() {

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
        wikiverse.mindmap.bind('clickNode', function (e) {

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
                }, 800, function () {
                    $("#" + nodeId).fadeOut(function () {
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
    };

    //clean up the sidebar navbar for the new search
    var prepareSearchNavbar = function prepareSearchNavbar(query, source, parent) {
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
    };

    //callback for when API search results are loaded
    var searchResultsLoaded = function searchResultsLoaded(results, source, triggerSearchResultsFunction) {

        //
        if (results.length > 0) {

            //this is the source button within the quicksearch
            $('#' + source).show();

            //create the incrementing number animation
            var number = 0;
            var interval = setInterval(function () {

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
    };

    //callback foor content loaded into brick
    var brickDataLoaded = function brickDataLoaded($brick) {

        $brick.fadeTo('slow', 1);
        pckry.layout();
    };

    //build an empty brick
    var buildGmapsBrick = function buildGmapsBrick(x, y) {

        var $brick = $(defaultMapBrick);

        packeryContainer.appendChild($brick[0]);
        pckry.appended($brick[0]);

        $brick.each(makeEachDraggable);

        //fit the brick at given position: first is x, second y
        pckry.fit($brick[0], x, y);
        pckry.layout();

        return $brick;
    };

    //for Wikipedia, trigger the next brick on click of links
    var buildNextTopic = function buildNextTopic($brick, lang) {

        $brick.find(".article a, .section a").unbind('click').click(function (e) {

            e.preventDefault();

            //stamp this brick so it doesnt move around
            pckry.stamp($brick[0]);

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
            };

            //unstamp it after everything is done
            pckry.unstamp($brick[0]);

            buildNode(brickData, $nextBrick.data('id'), $brick.data('id'));
        });
    };
    //toggle the sidebar
    var toggleSidebar = function toggleSidebar() {

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
    };

    //toggle the sidebar
    var toggleBottomSidebar = function toggleBottomSidebar() {

        var $bottomSidebar = $('#bottomSidebar');

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
    };

    //get the pictures for given location of a map (instagram and flickr)
    var getGmapsFotos = function getGmapsFotos($mapsBrick) {

        $mapsBrick.find('.getFotos').on('click', function () {

            var position = $(this).parents(".brick").data("position");

            prepareSearchNavbar(position, $(this).attr('id'));

            //Open the sidebar:
            if (!$sidebar.hasClass('cbp-spmenu-open')) {
                toggleSidebar();
            }
            if ($(this).attr('id') === "Instagram") {
                (0, _APIcalls.getInstagrams)(position, "coordinates", searchResultsLoaded, "buildFotoSearchResults");
            } else {
                (0, _APIcalls.getFlickrs)(position, "relevance", "geoQuery", searchResultsLoaded, "buildFotoSearchResults");
            }
        });
    };

    var markers = [];

    //create the gmaps brick (first time creation)
    var getGmapsSearch = function getGmapsSearch($gmapsSearchBrick) {

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
            zoom: 1
        };

        //scrollwheel: false,
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

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function () {

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
        google.maps.event.addListenerOnce(map, 'idle', function () {
            pckry.layout();
        });

        google.maps.event.addListener(map, 'idle', function () {

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

        google.maps.event.addListener(map, 'maptypeid_changed', function () {

            currentMap.maptype = map.getMapTypeId();

            $gmapsSearchBrick.data("topic", currentMap);

            //store position and bounds into the data container (for later use of getFlickrs/Instagrams)
            $gmapsSearchBrick.data('position', map.getCenter().toUrlValue());
            $gmapsSearchBrick.data('bounds', map.getBounds().toUrlValue());
        });

        var thePanorama = map.getStreetView(); //get the streetview object

        //detect if entering Streetview -> Change the type to streetview
        google.maps.event.addListener(thePanorama, 'visible_changed', function () {

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
        google.maps.event.addListener(thePanorama, 'pov_changed', function () {

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
    };

    //build the gmaps brick (coming from database)
    wikiverse.buildGmaps = function ($mapbrick, mapObj, callback) {

        var map;
        var myMaptypeID;
        var currentMap;
        var currentStreetMap;

        //$mapbrick.append('<input id="pac-input" class="controls" type="text" placeholder="Enter a location">')

        var $mapcanvas = $('<div id="map_canvas"></div>');

        $mapbrick.data('type', 'gmaps');
        $mapbrick.data('position', mapObj.center);
        $mapbrick.data('bounds', mapObj.bounds.southWest + "," + mapObj.bounds.northEast);

        $mapbrick.addClass('w2-fix').addClass('gmaps');

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

        google.maps.event.addListener(map, 'idle', function () {

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

        google.maps.event.addListener(map, 'maptypeid_changed', function () {

            currentMap.maptype = map.getMapTypeId();

            $mapbrick.data("topic", currentMap);

            //store position and bounds into the data container (for later use of getFlickrs/Instagrams)
            $mapbrick.data('position', map.getCenter().toUrlValue());
            $mapbrick.data('bounds', map.getBounds().toUrlValue());
        });

        google.maps.event.addListener(map, 'click', function (event) {

            markers.forEach(function (marker) {
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

        google.maps.event.addDomListener(window, 'idle', function () {
            pckry.layout();
        });

        //detect if entering Streetview -> Change the type to streetview
        google.maps.event.addListener(thePanorama, 'visible_changed', function () {

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
        google.maps.event.addListener(thePanorama, 'pov_changed', function () {

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
    };
    //build the streetmap map brick (from database)
    wikiverse.buildStreetMap = function ($mapbrick, streetObj, callback) {

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

        $mapbrick.data('featuredImage', 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + myCenter.toUrlValue() + '&heading=' + panoramaOptions.pov.heading + '&pitch=' + panoramaOptions.pov.pitch + '&key=AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8');

        callback($mapbrick);

        google.maps.event.addListener(thePanorama, 'pov_changed', function () {
            //detect if entering Streetview

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
    };

    //for search query, trigger the search to other sources
    var getConnections = function getConnections(source, topic, parent) {

        //Open the sidebar:
        if (!$sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }

        prepareSearchNavbar(topic, source, parent);

        switch (source) {

            case "Flickr":
                (0, _APIcalls.getFlickrs)(topic, wikiverse.flickrSortType, wikiverse.flickrSearchType, searchResultsLoaded, "buildFotoSearchResults");
                break;

            case "Instagram":
                //remove whitespace from instagram query
                (0, _APIcalls.getInstagrams)(topic.replace(/ /g, ''), wikiverse.instagramSearchType, searchResultsLoaded, "buildFotoSearchResults");
                break;

            case "Youtube":
                (0, _APIcalls.getYoutubes)(topic, wikiverse.youtubeSortType, wikiverse.searchLang, searchResultsLoaded, "buildYoutubeSearchResults");
                break;

            case "Soundcloud":
                (0, _APIcalls.getSoundclouds)(topic, searchResultsLoaded, "buildListResults");
                break;

            case "Twitter":
                (0, _APIcalls.getTweets)(topic, wikiverse.twitterSearchType, wikiverse.searchLang, searchResultsLoaded, "buildTwitterSearchResults");
                break;

            case "Wikipedia":
                (0, _APIcalls.getWikis)(topic, wikiverse.searchLang, searchResultsLoaded, "buildListResults");
                break;
        }
    };

    wikiverse.buildFlickr = function ($brick, photoObj, callback) {

        wikiverse.buildFoto($brick, photoObj, "Flickr", callback);
    };

    wikiverse.buildInstagram = function ($brick, photoObj, callback) {

        wikiverse.buildFoto($brick, photoObj, "Instagram", callback);
    };

    //build a foto brick, either flickr or instagram
    wikiverse.buildFoto = function ($brick, photoObj, type, callback) {

        $brick.addClass('foto');
        $brick.data('type', type);
        $brick.data('topic', photoObj);

        var $photo = $('<img class="img-result" src="' + photoObj.mediumURL + '">');
        var $figure = $('<figure class="effect-julia"></figure>');

        var figureOverlayHTML = '<figcaption>' + '<h4>' + photoObj.title + ' <span class="foto-owner">by ' + photoObj.owner + '</span></h4>' + '<div class="foto-tags"></div>' + '<h5 class="fotoType"><strong>' + type.toLowerCase() + '</strong></h5>' + '</figcaption>' + $brick.prepend($(fotoResizeButton));
        $brick.append($figure);

        $figure.append($photo);
        $figure.append($(figureOverlayHTML));

        if (photoObj.tags) {
            photoObj.tags.map(function (tag, index) {
                $figure.find('.foto-tags').append('<p class="tag">#<span>' + tag + '</span></p>');
            });
        }

        if (photoObj.size === "small") {
            $brick.addClass('w1');
        } else if (photoObj.size === "large") {
            $brick.addClass('w2');
        }

        //add class if is Portrait
        if ((0, _helpers.isPortrait)($brick.find('img'))) {
            $brick.addClass('portrait');
        }

        if (type === "Flickr") {

            (0, _APIcalls.getFlickrUsername)(photoObj.owner, function (username) {

                $figure.find('.foto-owner').empty();
                $figure.find('.foto-owner').append(username);

                //store the tags and re-assign them to the foto data (for later save)
                var thisPhoto = $brick.data('topic');
                thisPhoto.owner = username;

                $brick.data('topic', thisPhoto);
            });

            $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                pckry.layout();
            });
        }

        //on tag click search for tags
        $brick.find('.foto-tags .tag').on('click', function (e) {
            e.preventDefault();
            getConnections(type, $(this).find("span").html(), $brick.data('id'));
            $sourceType.trigger("change");
        });

        var imgLoad = imagesLoaded($brick);

        imgLoad.on('progress', function (imgLoad, image) {
            if (!image.isLoaded) {
                return;
            }
            callback($brick);
            pckry.layout();
        });
    };

    //create the flickr brick
    wikiverse.buildFotoSearchResults = function (results, searchResultsListBuilt) {

        results.forEach(function (result, index) {

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
    wikiverse.buildSoundcloud = function ($brick, soundcloudObj, callback) {

        $brick.addClass('w2-fix');
        $brick.data('type', 'Soundcloud');
        $brick.data('topic', soundcloudObj);

        var $soundcloudIframe = $('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="//w.soundcloud.com/player/?url=' + soundcloudObj.uri + '&color=0066cc"></iframe>');

        $brick.append($soundcloudIframe);
        $brick.prepend(handle);
        callback($brick);
    };

    wikiverse.buildListResults = function (results, searchResultsListBuilt) {

        $results.append(tableHover);

        results.forEach(function (result, index) {

            var $result = $('<tr class="result" data-toggle="tooltip" title="' + (0, _helpers.strip)(result.Topic.snippet) + '"><td>' + result.Topic.title + '</td></tr>');
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
    };

    //stack the twitter search results in the sidebar
    wikiverse.buildTwitterSearchResults = function (results) {

        $results.append(tableHover);

        results.forEach(function (result, index) {

            var $result = $('<tr class="result"><td class="twitterThumb col-md-2"><img src="' + result.Topic.userThumb + '"></td><td class="col-md-10" ><strong>' + result.Topic.user + '</strong><br>' + result.Topic.title + '</td></tr>');
            $result.data("topic", result);

            //append row to sidebar-results-table
            $results.find('.table').append($result);
        });
        searchResultsListBuilt($results);
    };

    //build a tweet
    wikiverse.buildTwitter = function ($brick, twitterObj, callback) {

        $brick.addClass('w2');
        $brick.addClass('Twitter');

        $brick.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
            pckry.layout();
        });

        //replace hashtags with links
        var tweet = twitterObj.title.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
        tweet = tweet.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<a hashtag="$2" href="#">$2</a>');
        tweet = (0, _helpers.urlify)(tweet);

        var $tweetContainer = $('<div class="col-md-2"><img class="twitterUserThumb" src="' + twitterObj.userThumb + '"></div><div class="col-md-10"><strong>' + twitterObj.user + '</strong><br><p>' + tweet + '</p></div>');

        $tweetContainer.on('click', 'a:not(.externalLink)', function (event) {
            event.preventDefault();
            getConnections("Twitter", $(this).attr('hashtag'), $brick.data('id'));
            $(this).contents().unwrap();
        });

        $brick.data('type', 'Twitter');
        $brick.data('topic', twitterObj);

        $brick.append($tweetContainer);
        callback($brick);
    };

    var updateSearchHistory = function updateSearchHistory() {

        var searchQuery = $searchKeyword.val();

        console.log(wikiverse.store.getState());

        var searchHistory = wikiverse.store.getState().search_history;

        //if search keyword is not already in history, add it
        if (!searchHistory.hasOwnProperty(searchQuery.toLowerCase())) {
            searchHistory[searchQuery.toLowerCase()] = Date.now();

            //empty the $searchkeyword parent id so that a new searchquery parent is created

            var searchQueryNodeData = {
                Topic: {
                    title: searchQuery
                },
                Type: "searchQuery",
                Id: searchHistory[searchQuery.toLowerCase()]
            };

            //build a node for the searchquery
            buildNode(searchQueryNodeData, searchHistory[searchQuery.toLowerCase()]);
        }
    };

    //search for sections of a wiki article
    var getWikiSections = function getWikiSections($brick, topic) {

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
            success: function success(data) {

                if (typeof data.parse.sections !== 'undefined' && data.parse.sections.length > 0) {

                    var $sectionsButton = $('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> sections </button>');

                    $brick.append($sectionsButton);
                    pckry.layout();

                    $sectionsButton.one('click', function () {

                        $(this).remove();

                        var $sectionsTable = $(tableHover);
                        $brick.append($sectionsTable);

                        data.parse.sections.forEach(function (section) {

                            //if not any of those, add the resulting sections
                            if (section.line !== "References" && section.line !== "Notes" && section.line !== "External links" && section.line !== "Citations" && section.line !== "Bibliography" && section.line !== "Notes and references") {
                                $sectionsTable.append('<tr class="section" data-wvtitle="' + section.anchor + '" data-wvindex="' + section.index + '"><td>' + section.line + '</td></tr>');
                            }
                        });

                        pckry.layout();

                        //create the section object and trigger the creation of a section brick
                        $sectionsTable.find(".section").on('click', function () {

                            pckry.stamp($brick[0]);

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
                            };

                            buildNode(brickData, $nextBrick.data('id'), $brick.data('id'));

                            pckry.unstamp($brick[0]);
                        });
                    });
                }
            }
        });
    };

    //build a wiki Brick
    wikiverse.buildWikipedia = function ($brick, topic, callback) {

        var $connections = $(wikiverse_nav);

        $brick.data('type', 'Wikipedia');
        $brick.data('topic', topic);

        $brick.addClass('wiki');

        $brick.prepend('<h4 class="wikiTitle">' + topic.title + '</h4>');

        $brick.prepend($connections);
        $connections.selectpicker();

        $connections.change(function (event) {
            getConnections($(this).find("option:selected").text(), topic.title, $brick.data('id'));
            $sourceType.trigger('change');
        });

        $brick.one("mouseenter", function () {
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
            success: function success(data) {
                //if there is images, grab the first and append it
                if (typeof data.parse.images !== 'undefined' && data.parse.images.length > 0) {
                    data.parse.images.every(function (image) {
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
                                success: function success(data) {

                                    //get the first key in obj
                                    //for (first in data.query.pages) break;
                                    //now done better like this:

                                    var imageUrl = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].thumburl;
                                    var image = $('<img src="' + imageUrl + '">');

                                    image.insertAfter($brick.find(".wikiTitle"));

                                    var imgLoad = imagesLoaded($brick);

                                    imgLoad.on('progress', function (imgLoad, image) {
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
            success: function success(data) {

                if (data.parse.text['*'].length > 0) {
                    var paragraph = $(data.parse.text['*']).find('p:first');

                    //if there is "may refer to", also include the first list
                    if (/may refer to/i.test(paragraph.text())) {
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
    wikiverse.buildSection = function ($brick, section, callback) {

        $brick.data('type', 'wikiSection');
        $brick.data('topic', section);

        $brick.addClass('wiki');
        //$brick.addClass('w2');

        $brick.prepend('<h4>' + section.name + '</h4>');

        //search another source menu:
        var $connections = $(wikiverse_nav);
        $brick.prepend($connections);
        $connections.selectpicker();

        $connections.change(function (event) {
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
            success: function success(data) {

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
    wikiverse.buildYoutubeSearchResults = function (results) {

        $results.append(tableHover);

        results.forEach(function (result, index) {

            var $result = $('<tr class="result" data-toggle="tooltip" youtubeID="' + result.Topic.youtubeID + '" title="' + (0, _helpers.strip)(result.Topic.snippet) + '"><td class="youtubeThumb col-md-6"><img height="100" src="' + result.Topic.thumbnailURL + '"></td class="col-md-6"><td>' + result.Topic.title + '</td></tr>');
            $result.data("topic", result);

            //append row to sidebar-results-table
            $results.find('.table').append($result);
        });

        searchResultsListBuilt($results);
    };

    //build a youtube brick
    wikiverse.buildYoutube = function ($brick, youtubeObj, callback) {

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

        imagesLoaded('#packery .youtube', function () {
            pckry.layout();
        });

        $brick.find('.youtubePlayButton').on('click', function () {
            playYoutube($brick, youtubeObj);
        });

        $brick.find('.related').on('click', function () {
            (0, _APIcalls.getRelatedYoutubes)(youtubeObj.youtubeID, youtubeObj.query, searchResultsLoaded, "buildYoutubeSearchResults", $brick.data('id'));
            $sourceType.trigger('change');
        });

        callback($brick);
    };

    //play a youtube video
    var playYoutube = function playYoutube($brick, youtubeObj) {

        //stop all other players
        $('.youtube').find("iframe").remove();
        $('.youtube').find("img").show();
        $('.youtube').find(".youtubePlayButton").show();
        $('.youtube').removeClass("w2-fix");

        $brick.addClass('w2-fix');

        var iframe = '<iframe class="" id="ytplayer" type="text/html" width="460" height="260" src="//www.youtube.com/embed/' + youtubeObj.youtubeID + '\'?autoplay=1" webkitallowfullscreen autoplay mozallowfullscreen allowfullscreen frameborder="0"/>';

        $brick.find('img').hide();
        $brick.find('.youtubePlayButton').hide();

        $brick.append(iframe);

        pckry.layout();
    };

    //make each brick draggable
    var makeEachDraggable = function makeEachDraggable(i, itemElem) {

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
        pckry.bindDraggabillyEvents(draggie);
    };

    var prepareBoardTitle = function prepareBoardTitle(board) {

        $('#wvTitle h1').append(board.title);
        $('#boardDescription').append(board.description);
    };

    //build an empty brick
    var buildBrick = function buildBrick(position, id, parent) {

        //if not provided, set position array (x,y coordinates) to 2 undefined values to omit the packery fit!
        position = position || [undefined, undefined];

        var $brick = $(defaultBrick);

        //if no id is passed from backend, get random not in this boards IDs
        id = id || Date.now();

        $brick.data('id', id);
        $brick.attr('id', "n" + id);
        $brick.data('parent', parent);

        packeryContainer.appendChild($brick[0]);
        pckry.appended($brick[0]);

        $brick.each(makeEachDraggable);

        //fit the brick at given position: first is x, second y
        pckry.fit($brick[0], position[0], position[1]);
        pckry.layout();

        return $brick;
    };

    //build a board -   this is called only for saved boards (coming from db)
    wikiverse.buildBoard = function (board) {

        prepareBoardTitle(board);

        //if there are bricks in the board
        if (!$.isEmptyObject(board.bricks)) {

            $.each(board.bricks, function (index, brick) {
                //set a timeout to make the building of the bricks smooth and successive
                setTimeout(function () {
                    //build a brick at position 0,0
                    var $thisBrick = brick.Type === "gmaps" || brick.Type === "streetview" ? buildGmapsBrick([undefined, undefined]) : buildBrick([undefined, undefined], brick.Id, brick.Parent);

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
                }, 150 * index);
            });
        }
        //this always needs to happen, also without any bricks, coz we need the search query nodes in the graph!
        wikiverse.buildMindmap(board);
    };

    wikiverse.buildMindmap = function (board) {

        var mindmapObj = {
            nodes: [],
            edges: []
        };

        $.each(board.search_history, function (query, id) {

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
                    content: '', // or custom fontawesome code eg. "\uF129"
                    scale: 0.7, // 70% of node size
                    color: '#89A4BE' // foreground color (white)
                }
            };
            mindmapObj.nodes.push(node);
        });

        var edgeId = 0;

        $.each(board.bricks, function (key, brick) {

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
                };

                var edgeIDString = ++edgeId;

                var edge = {
                    id: "e" + edgeIDString,
                    source: "n" + brick.Parent,
                    target: "n" + brick.Id,
                    size: 2,
                    color: "#8b9aa8",
                    type: "curvedArrow"
                };

                mindmapObj.nodes.push(node);
                mindmapObj.edges.push(edge);
            }
        });
        wikiverse.mindmap.graph.read(mindmapObj);

        updateFilters();
    };

    var removeNode = function removeNode(id, $brick) {

        //get the given node by Id
        var nodesObj = wikiverse.mindmap.graph.getNodesById();
        var thisNode = nodesObj["n" + id];

        //recreate the children for this node
        wikiverse.mindmap.graph.nodes().map(function (node, index) {

            var neighbors = wikiverse.mindmap.graph.neighbors(node.id);
            delete neighbors[node.parent];
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
        var lastEdgeId = edgesArray.length > 0 ? parseInt(edgesArray[edgesArray.length - 1].id.replace(/\D/g, '')) : 0;

        $.each(thisNode.children, function (nodeId, nodeObj) {
            //for each child, create a new edge, thus increment
            lastEdgeId++;

            //set the new parent for the child nodes
            nodeObj.parent = thisNode.parent;

            //also update all DOM elements with given ID with the new parent (so it can be safely stored to db)
            $("#" + nodeId).data('parent', parseInt(thisNode.parent.replace(/\D/g, '')));

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
    };

    var buildNode = function buildNode(brickData, id, parent) {

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
            var lastEdgeId = edgesArray.length > 0 ? parseInt(edgesArray[edgesArray.length - 1].id.replace(/\D/g, '')) : 0;
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
    };

    var updateFilters = function updateFilters() {
        $('#filter button').hide();

        wikiverse.mindmap.graph.nodes().forEach(function (node, index) {
            $("#filter #filter_" + node.source).show();
        });

        $("#filter #filter_All").show();
    };

    //toggle the search overlay
    wikiverse.toggleSearch = function () {

        $('#searchResults h3').hide();

        $('.search').addClass('open');
        $('.search input[type="search"]').val('');
        $('.search input[type="search"]').focus();

        $('.source').hide();
    };

    //fork the board, copy it to your boards
    wikiverse.forkBoard = function (wpnonce) {
        var forkedTitle = $('#wvTitle h1').html();
        var newAuthor = $('#wvAuthor').attr('data-currentUser');

        wikiverse.createBoard(wpnonce, forkedTitle, newAuthor);
    };

    //collect the bricks for saveboard/createboard/forkboard
    wikiverse.collectBricks = function () {

        //get all bricks
        var bricks = pckry.getItemElements();
        //find all images
        var image = $(bricks).find('img:first');

        //identify first brick with image
        var $firstBrickWithImage = $(image[0]).parents(".brick");
        var featuredImage;

        if (bricks.length > 0) {
            //if its a streetview, take the rendered streetview image stores in the gmaps function
            if ($firstBrickWithImage.data('type') === "streetview") {
                featuredImage = $firstBrick.data('featuredImage');
            } else {
                featuredImage = image[0].currentSrc;
            }
        }

        var wikiverseParsed = bricks.reduce(function (Brick, brick, index) {

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
    wikiverse.saveBoard = function (wpnonce) {

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
            success: function success(data, textStatus, XMLHttpRequest) {
                var id = '#apf-response';
                $(id).html('');
                $(id).append(data);
            },
            error: function error(MLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    };

    //create a new board
    wikiverse.createBoard = function (wpnonce, forkedTitle, newAuthor) {

        var board = wikiverse.collectBricks();

        $("#saveBoardModal").modal('show');

        //Focus MOdal Input and trigger enter save
        $('#saveBoardModal').on('shown.bs.modal', function () {

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

            $('#boardTitle').keyup(function (e) {
                e.preventDefault();
                //enable the save board button
                $("#boardSubmitButton").prop('disabled', false);

                //make enter save the board
                if (e.keyCode === 13) {
                    $("#boardSubmitButton").trigger('click');
                }
            });
        });

        $("#boardSubmitButton").on("click", function () {

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
                    success: function success(data, textStatus, XMLHttpRequest) {

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
                    error: function error(MLHttpRequest, textStatus, errorThrown) {
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
    wikiverse.clearBoard = function (wpnonce) {

        if (confirm('Are you sure you want to clear this board?')) {

            var elements = pckry.getItemElements();
            pckry.remove(elements);

            //remove all nodes
            wikiverse.mindmap.graph.clear();

            updateFilters();

            $("#filter #filter_All").hide();
            wikiverse.mindmap.refresh();
        }
    };

    //filter by source
    var sourceFilter = function sourceFilter(source) {

        //reset all filters first
        wikiverse.filter.undo('node-source-equals-x').apply();

        //if All, dont filter anything
        if (source !== "All") {
            //create the mot filter
            wikiverse.filter.nodesBy(function (node) {
                return node.source === source || node.source === "searchQuery";
            }, 'node-source-equals-x').apply();
        }
    };

    //----------------EVENTS----------------------------
    //

    $sourceType.change(function (event) {

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

    $('#toggleSidebar .left').click(function () {
        toggleSidebar();
    });

    $('#toggleSidebar .right').click(function () {
        toggleBottomSidebar();
    });

    //filter
    $('#filter button').on('click', function () {
        sourceFilter($(this).attr('data-source'));
    });

    // REMOVE ITEM
    $packeryContainer.on("click", ".brick .cross", function () {

        var $thisBrick = $(this).parent(".brick");

        if (!$thisBrick.hasClass('gmaps')) removeNode($thisBrick.data('id'), $thisBrick);

        pckry.remove($thisBrick[0]);
        pckry.layout();
    });

    //Toggle Size of Images on click
    $packeryContainer.on("click", ".foto .resize", function (e) {
        toggleImageSize($(e.target).parents(".brick"), $(e.target));
    });

    //Fix title on scroll
    $(window).scroll(function () {
        var sticky = $('#wvTitle h1'),
            scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixedTitle');else sticky.removeClass('fixedTitle');
    });
    //----------------keyboard shortcuts----------------------------

    //CTRL-S for save board
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            $('#saveBoard').trigger('click');
        }
    }, false);

    $searchKeyword.keyup(function (e) {
        //reset the searchkeyword parent so that there is no parent, and thus a new searhquery node is created
        $searchKeyword.removeData('parent');

        e.preventDefault();
        //make enter save the board
        if (e.keyCode === 13) {
            $sourceType.trigger('change');
        }
    });

    //wv_search
    $('.search input').keyup(function (e) {
        e.preventDefault();

        //make enter save the board
        if (e.keyCode === 13) {

            //get the query from the search div
            var query = $("#searchInput input").val();

            //call the search functions with static, default parameters
            //this is because its a quick search via the "add content" button
            (0, _APIcalls.getWikis)(query, "en", searchResultsLoaded);
            (0, _APIcalls.getSoundclouds)(query, searchResultsLoaded);
            (0, _APIcalls.getTweets)(query, "popular", "en", searchResultsLoaded);
            (0, _APIcalls.getYoutubes)(query, "relevance", "en", searchResultsLoaded);
            (0, _APIcalls.getFlickrs)(query, "relevance", "textQuery", searchResultsLoaded);
            (0, _APIcalls.getInstagrams)(query, "hashtag", searchResultsLoaded);

            //reset the searchkeyword parent so that there is no parent, and thus a new searhquery node is created
            $searchKeyword.removeData('parent');
        }
    });

    //call the board-pilots on click (saveboard, clearboard, etc)
    $('.board-pilot').click(function () {

        //Close the sidebar if open:
        if ($sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }
        //save, clear or edit board
        wikiverse[$(this).attr('id')](wpnonce);
    });

    //but also open the search if clicked
    $('.searchButton').on('click', function (event) {
        event.preventDefault();
        wikiverse.toggleSearch();

        //Close the sidebar, if open:
        if ($sidebar.hasClass('cbp-spmenu-open')) {
            toggleSidebar();
        }
    });

    //close the search
    $('.search, .search button.close').on('click', function (event) {
        if (event.target.className === 'close') {
            $(this).removeClass('open');
        }
    });

    //adding escape functionality for closing search
    $(document).keyup(function (e) {
        if ($('.search').hasClass('open') && e.keyCode === 27) {
            // escape key maps to keycode `27`
            $('.search').removeClass('open');
        }
    });

    //detect top element
    $(document).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var first = false;
        $(".brick").each(function () {
            var offset = $(this).offset();
            if (scrollTop <= offset.top && $(this).height() + offset.top < scrollTop + windowHeight && first === false) {
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
    $sourceParams.find('select').on('change', function () {

        //wikiverse source parameter variable ()
        wikiverse[$(this).attr('id')] = $(this).val();

        //call getconnections by triggering a change on sourcetype
        $sourceType.trigger('change');
    });

    $(".source").on("click", function () {

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

    $("#addMap").on("click", function () {

        var $mapDefaultBrick = $(defaultMapBrick);
        var $thisBrick = buildGmapsBrick(parseInt($mapDefaultBrick.css('left')), parseInt($mapDefaultBrick.css('top')));

        getGmapsSearch($thisBrick);
    });
    //---------------END -keyboard shortcuts----------------------------
    /* END EVENTS */

    //return stars to be used elsewhere on page
    wikiverse.stars = _stars.stars;

    return wikiverse;
})(jQuery);

//wv imports

},{"./APIcalls.js":1,"./helpers.js":2,"./reducers.js":12,"./stars.js":13,"redux":8}],15:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[14]);
