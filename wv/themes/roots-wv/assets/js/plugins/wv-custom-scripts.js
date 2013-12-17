var $container = jQuery('#packery');

function buildWall(){

	var str = jQuery("#wikiverse").html();
	
	var wikiverse =	JSON.parse(str);
	
	$.each(wikiverse, function() {
	
		if(this.Type === "wiki"){
			buildWikipedia(this.Topic, this.Language);
		}
		if(this.Type === "vimeo"){
			buildVimeo(this.Topic);
		}
		if(this.Type === "youtube"){
			buildYoutube(this.Topic);
		}
	});
}

function furtherAuthor($post, language){
	
	$post.find("a").unbind('click').click(function(e) {
		
		e.preventDefault();
		
		var topic = jQuery(this).attr("title");
		jQuery(this).contents().unwrap();
		
		var id = $post.attr("data-sort");
		buildWikipedia(topic, language);
		return false;
	});
}

function buildWikipedia(topic, language) {
    var title = topic;
    jQuery.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data:{
            action:'parse',
            prop:'text',
            page:title,
            format:'json',
            redirects:''
        },
        dataType:'jsonp',
        success: function(data){
            if(typeof data.parse !== 'undefined'){
                
                var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');
                var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');
                
                wikidesc.find('sup').remove();
                wikidesc.find('span.IPA').remove();
                wikidesc.find('span.nowrap').remove();
                wikidesc.find('.dablink').remove();
                wikidesc.find('.editsection').remove();
                wikidesc.find('.magnify').remove();
                wikidesc.find('.toc').remove();
                wikidesc.find('.error').remove();
                wikidesc.find('a[href$="ogg"]').remove();
                wikidesc.find('a:contains("edit")').remove();
                
                var $desc = wikidesc.html();
                var $card = wikicard.html();
                
                if($desc){

                    var $box_desc = jQuery('<p></p>').append($card);
                    
                    if ($card){ $box_desc = $box_desc.append("<br><div id='line'></div><br>" );}
                        
                        $box_desc = $box_desc.append($desc);

                        
                        $box_desc = jQuery('<div class="brick" type="wiki" lang="'+language+'" title="'+title+'"></div>').append($box_desc);
                        $box_desc.prepend('<span class="cross"> ✘ </span>');

                        $container.append($box_desc).packery( 'appended', $box_desc);

						$box_desc.each( makeEachDraggable );
                                          
                        furtherAuthor($box_desc, language);
                               
                }
                }
              else{console.log("Nothing found on Wikipedia");}
        },
        error: function (data){
        
                var $container = jQuery('#packery');
                var content = "Wikipedia seems to have the hickup..";
                var $box = jQuery('<p></p>').append(content);
                    $box = jQuery('<div class="brick "></div>').append($box);
                  
					$container.packery( 'appended', $box );
					
            
                return false;
                }
    });
}

function buildYoutube(query){
	
	
	var $iframe = '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/'+query+'" frameborder="0"/>';
	

    $iframe = jQuery('<div class="brick w2-tube" type="youtube" title="'+query+'"></div>').append($iframe);
    $iframe.prepend('<span class="cross"> ✘ </span>');
                             
    $container.append($iframe).packery( 'appended', $iframe);

	$iframe.each( makeEachDraggable );
	
}

function getVimeoId( url ) {
  // look for a string with 'vimeo', then whatever, then a 
  // forward slash and a group of digits.
  var match = /vimeo.*\/(\d+)/i.exec( url );

  // if the match isn't null (i.e. it matched)
  if ( match ) {
    // the grouped/matched digits from the regex
    return match[1];
  }
}

function buildVimeo(vimeoID){

	var $iframe = '<iframe src="//player.vimeo.com/video/'+vimeoID+'" width="500" height="290" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
	
	$iframe = jQuery('<div class="brick w2-vimeo" type="vimeo" title="'+vimeoID+'"></div>').append($iframe);
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
	$('#searchbox').typeahead({
		source: function(query, process) {
		return $.ajax({
				url: "http://en.wikipedia.org/w/api.php",
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
	
	
	$("#wikipedia-icon").on("click", function(){
	
		var $wikisearch = $("#wikipedia-search");
		
		$wikisearch.removeClass("invisible");
		$container.append($wikisearch).packery( 'prepended', $wikisearch);
	});
	
	$("#wikipedia-search .start").on("click", function(){
			
		var topic = $("#searchbox").val();

		buildWikipedia( topic, lang );
		
	});
	
	
	
	$("#youtube-icon").on("click", function(){
	
		var $youtubesearch = $("#youtube-search");
		
		$youtubesearch.removeClass("invisible");
		$container.append($youtubesearch).packery( 'prepended', $youtubesearch);
	});
	
	$("#youtube-search .start").on("click", function(){
		
		var query = $("#youtube-search .searchbox").val();
		
		var video_id = query.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition !== -1) {
			video_id = video_id.substring(0, ampersandPosition);
		}
		
		buildYoutube(video_id);
		
	});
	
	$("#vimeo-icon").on("click", function(){
	
		var $vimeosearch = $("#vimeo-search");
		$vimeosearch.removeClass("invisible");
		$container.append($vimeosearch).packery( 'prepended', $vimeosearch);
	});
	$("#vimeo-search .start").on("click", function(){
		
		var query = $("#vimeo-search .searchbox").val();
		var vimeoID = getVimeoId(query);
		buildVimeo(vimeoID);
		
	});
	
}