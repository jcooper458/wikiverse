// Modified http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
// Only fires on body class (working off strictly WordPress body_class)
var ExampleSite = {
  // All pages
  common: {
    init: function() {
    

    },
    finalize: function() {

	
    }
  },
  // Singe board
  single_board:{
	init: function() {

		buildboard();
		
	}
  },
  // Home page
  home: {
    init: function() {
      
      buildboard();

       /*function HomeryMakeEachDraggable( i, itemElem ) {
        // make element draggable with Draggabilly
        var draggie = new Draggabilly( itemElem );
        // bind Draggabilly events to Packery
        $homeryContainer.packery( 'bindDraggabillyEvents', draggie );
      }

      var $homeryContainer = $('#packery');

      $homeryContainer.packery({
        itemSelector: '.item',
        //gutter: 5,
        transitionDuration: 0,
        columnWidth: 50,
        rowHeight: 50
      });

      // for each item element
      $homeryContainer.find('div.item').each( HomeryMakeEachDraggable );


      var bricksArray = [];

      var container = $('#packery'); 
      var pckry = Packery.data( container );

      var shufflers = [];
      var nonShufflers = [];
      for ( var i=0, len = pckry.items.length; i < len; i++ ) {
        var item = pckry.items[i];
        var collection = classie.has( item.element, 'ignore-shuffle' ) ?
          nonShufflers : shufflers;
        collection.push( item );
      }

      shufflers.sort( function() {
        return Math.random() > 0.5;
      });
      pckry.items = nonShufflers.concat( shufflers );
      pckry.layout();*/

      //buildHomeBoard();
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