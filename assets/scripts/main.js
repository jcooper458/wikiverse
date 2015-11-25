/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {

        //the user page needs an own packery instance
        //so that the imagesloaded can be called conventionally
        $('#packeryUser').imagesLoaded( function() {
          
          // initialize Packery
          $('#packerySite').packery({
            itemSelector: '.brick',
            gutter: 10,
            transitionDuration: 0,
            columnWidth: 225
          });
        });
      },
      finalize: function() {

      }
    },
    // Home page
    'home': {
      init: function() {

      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // single board page
    'single_board': {
      init: function() {
        WIKIVERSE.init();

        $.getJSON('/wp-json/posts/' + $("#postID").html(), function(board) {
          WIKIVERSE.buildBoard($('#packery'), JSON.parse(board.content_raw));
        });
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // Start page
    'start': {
      init: function() {
        WIKIVERSE.init();
        WIKIVERSE.toggleSearch();
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS      
      }
    },
    // Login page
    'login': {
      init: function() {

      },
      finalize: function() {
        $('#user_login').focus();
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.