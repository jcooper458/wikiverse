var $container = $('#packery');
var $wikisearch = $("#wikipedia-search");


function buildNextTopic($brick, lang){
	
	$brick.find("a").unbind('click').click(function(e) {
		
		e.preventDefault();
		
		var topic = $(this).attr("title");
		$(this).contents().unwrap();

		buildWikipedia(topic, lang);
		return false;
	});
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function getWikis(topic, lang) {

	$wikisearch.append('<table id="wiki-results" class="table table-hover"></table>');
	var $wikitable = $('#wiki-results');

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
			$.each(data.query.search, function(){

				var title = this.title;
				var snippet = this.snippet;

				
					$wikitable.append('<tr><td class="wiki-result" data-toggle="tooltip" title="'+strip(snippet)+'">'+title+'</td></tr>');
					$('td.wiki-result').tooltip({animation: true});

					$wikitable.find("td").unbind('click').click(function(e) {
		
						var topic = $(this).html();
						
						buildWikipedia(topic, lang);
						return false;
					});

			});
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
				wikitext.find('img').addClass('pull-right');

            var $brick = $('<p><img class="wiki-icon pull-right" src="/wv/themes/roots-wv/assets/img/wikipedia_xs.png"></p>').append('<h4>'+topic+'</h4>');
                
                $.each(wikitext, function(){

					$brick.append(this);

                });

                $brick = $('<div class="brick" type="wiki" lang="'+lang+'" title="'+topic+'"></div>').append($brick);
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
		if(this.Type === "vimeo"){
			buildVimeo(this.Topic);
		}
		if(this.Type === "youtube"){
			buildYoutube(this.Topic);
		}
	});
}



function buildYoutube(query){
	
	
	var $iframe = '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/'+query+'" frameborder="0"/>';
	

    $iframe = $('<div class="brick w2-tube" type="youtube" title="'+query+'"></div>').append($iframe);
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
	
	$iframe = $('<div class="brick w2-vimeo" type="vimeo" title="'+vimeoID+'"></div>').append($iframe);
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
	
	
	$("#wikipedia-icon").on("click", function(){
	
		$wikisearch.removeClass("invisible");
		$container.append($wikisearch).packery( 'prepended', $wikisearch);

	});
	
	$("#wikipedia-search .start").on("click", function(){
			
		var topic = $("#searchbox").val();

		getWikis( topic, lang );
		
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