// Modified http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
// Only fires on body class (working off strictly WordPress body_class)
var $container = $('#packery');
var ExampleSite = {
  // All pages
  common: {
    init: function() {
    
		$('.selectpicker').selectpicker();
		
		getSearchBoxes();
		
		// initialize Packery
		$container.packery({
			itemSelector: '.brick',
			gutter: 10
		});
		
		// REMOVE ITEM
		$( "#packery" ).on( "click", ".cross", function() {
				var thisBrick = jQuery(this).parent(".brick");
				$container.packery( 'remove', thisBrick );
			});

		// REMOVE ITEM
		$( "#packery" ).on( "click", ".more-link", function() {

				var topic = jQuery(this).parents(".brick").attr("title");
				var lang = jQuery(this).parents(".brick").attr("lang");
				var $brick = jQuery(this).parents(".brick");

				$brick.find(".more-link").remove();

				expandWiki(topic, lang, $brick);
			});
		
			
		$container.packery( 'on', 'layoutComplete', function( pckryInstance, laidOutItems ) {
			
			$("#saveWall").fadeIn();
			
		});
			
	
      
      
    },
    finalize: function() {

	
    }
  },
  // Singe Wall
  single_wall:{
	init: function() {
		
		
		
		
		
		buildWall();
		
	
		
	}
  },
  // Home page
  home: {
    init: function() {
    
	
	
	}
 },
  // About page
  about: {
    init: function() {
      // JS here
    }
  }
};

var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = ExampleSite;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {

    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });

    UTIL.fire('common', 'finalize');
  }
};

$(document).ready(UTIL.loadEvents);