 <div>
					  	 <input id="address" type="textbox" value="Sydney, NSW">
					  	 <input type="button" value="Encode" onclick="codeAddress()">
					 </div>

// change size of clicked element
    /* $container.delegate( '.authorWiki', 'click', function(){
        jQuery(this).toggleClass('w2');
        $container.isotope('reLayout');
      
      });*/
-----------------THE TITLE WITHIN THE WALL: 

					<div class="title">
						<h1 class="page-title"><?php the_title(); ?></h1>
						<?php the_content(); ?>
					</div>	

--------------CENTERED ISOTOPE:
	jQuery.Isotope.prototype._getCenteredMasonryColumns = function() {
        this.width = this.element.width();
        var parentWidth = this.element.parent().width();
        // i.e. options.masonry && options.masonry.columnWidth
        var colW = this.options.masonry && this.options.masonry.columnWidth ||
        // or use the size of the first item
        this.$filteredAtoms.outerWidth(true) ||
        // if there's no items, use size of container
        parentWidth;
        var cols = Math.floor(parentWidth / colW);
        cols = Math.max(cols, 1);
        // i.e. this.masonry.cols = ....
        this.masonry.cols = cols;
        // i.e. this.masonry.columnWidth = ...
        this.masonry.columnWidth = colW;
    };

    jQuery.Isotope.prototype._masonryReset = function() {
        // layout-specific props
        this.masonry = {};
        // FIXME shouldn't have to call this again
        this._getCenteredMasonryColumns();
        var i = this.masonry.cols;
        this.masonry.colYs = [];
        while (i--) {
            this.masonry.colYs.push(0);
        }
    };

    jQuery.Isotope.prototype._masonryResizeChanged = function() {
        var prevColCount = this.masonry.cols;
        // get updated colCount
        this._getCenteredMasonryColumns();
        return (this.masonry.cols !== prevColCount);
    };

    jQuery.Isotope.prototype._masonryGetContainerSize = function() {
        var unusedCols = 0,
            i = this.masonry.cols;
        // count unused columns
        while (--i) {
            if (this.masonry.colYs[i] !== 0) {
                break;
            }
            unusedCols++;
        }
        return {
            height: Math.max.apply(Math, this.masonry.colYs),
            // fit container to columns that have been used;
            width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth
        };
    };

-------------------GRIDSTER STUFF:


function removeGrid($post){

	var gridster = jQuery(".gridster ul").gridster().data('gridster');
	
	var cross = jQuery($post).find("span.cross");
	
	cross.on('click', function(){
		
		jQuery("a#editWall").html('Save Wall');
        jQuery("a#editWall").fadeIn("slow");

		gridster.remove_widget( $post );
	});
}

function gridStart() {

jQuery("a#start").unbind('click').click(function() {
	
	var author = jQuery("#wikiform").val();
	var $post = jQuery(this).parents(".brick");
	var lang = jQuery("#langselect").val();
	var id = $post.attr("data-sort");
	
	gridsterWikiBrickCreator(id, author, lang);
	jQuery("a#editWall").html('Save Wall');
    jQuery("a#editWall").fadeIn("slow");
    jQuery("a#saveWall").fadeIn("slow");
	});

}

function furtherGrid($dhis, lang){
	//console.log($dhis);
	$dhis.find("a").unbind('click').click(function(e) {
		
		e.preventDefault();
		
		var $topic = jQuery(this).attr("title");
 		jQuery(this).contents().unwrap();
 		
 		var id = $dhis.attr("data-sort");
 		gridsterWikiBrickCreator(id, $topic, lang);
 		jQuery("a#editWall").html('Save Wall');
        jQuery("a#editWall").fadeIn("slow");
 		return false;
	});
}


function gridsterWikiBrickCreator(ide, author, language) {

var isiPad = navigator.userAgent.match(/iPad/i) != null;

var ua = navigator.userAgent;
var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

var title = author;
var $titleclass = title.replace(/\s+/g, '-').toLowerCase();

var $post = jQuery('div[data-sort="'+ide+'"]');
var $color = $post.find(".postLink").attr('color');

var gridster = jQuery(".gridster ul").gridster().data('gridster');
  
 var $loading = jQuery("<p style='font-weight:bold;  font-family: Helvetica;'>Loading…</p>");	
      $loading = jQuery('<div class="postLink"></div>').append($loading);
  var $box_loading = jQuery("<div class='container'></div>").append($loading);
  if (!isiPad) {$box_loading = $box_loading.prepend('<span class="cross"></span>');}	
      $box_loading = jQuery('<li class="brick loading" title="'+title+'"  data-sort="'+ide+'" language="'+language+'" color='+$color+'></li>').append($box_loading);	
   removeGrid($box_loading);
   
  //$loading.effect("pulsate", { times:10 }, 1000);	  

  gridster.add_widget($box_loading);

  jQuery.ajax({
		
		url: 'http://'+language+'.wikipedia.org/w/api.php',
      	data: {
         	action:'parse',
		     prop:'text',
             page:title,
          	format:'json',
          	redirects:'',
          	//section:'0'
        },
        dataType:'jsonp',
       	success: function(data) {
       	
		    if(typeof data.parse != 'undefined'){
		    	
		    	var $container = jQuery('#listing');
		    	
		     	var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');	
		    	var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');		    				
		    	var pictures = jQuery("<div>"+data.parse.text['*']+"<div>").children('.thumb');
		     		     	
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
		   			var gridster = jQuery(".gridster ul").gridster().data('gridster');		   			   			  			
		   			gridster.remove_widget( $box_loading );
		   			var $box_desc = jQuery('<p></p>');
		   			
		   		if ($card){
		   					   										   		
		    			$box_desc.append($card);//start building the wiki brick
		    			$box_desc = $box_desc.append("<br><div id='line'></div><br>" );
		    			
		    		}//line of separation between Card and Description
		    		    $box_desc = $box_desc.append($desc);
		    		    $box_desc = jQuery('<div class="postLink"></div>').append($box_desc);
		    		    $box_desc = jQuery('<div class="container"></div>').append($box_desc);
		    		    if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}			    		    
                        $box_desc = jQuery(' <li class="brick wiki" title="'+title+'" language="'+language+'"></li>').append($box_desc);		    		    								
                       
                        var heightsum = 0;
                        var picrows = 0;
                        
                        if ($box_desc.find("img").length){
	                        $box_desc.find("img").each(function(){
	                            heightsum = heightsum + this.height;
	                        })
	                        
	                        picrows = heightsum / 100;
                        	picrows = Math.round(picrows) + 2;
                        }
                         var size = $box_desc.text().length;
                        	rows = size / 100;
                        	rows = Math.round(rows) + 1;
                        	rows = rows + picrows; 
                      
                        gridster.add_widget($box_desc, 1, rows);
                        
                        furtherGrid($box_desc, language);
                        removeGrid($box_desc);
                        
						//$container.isotope( 'insert', $box_desc);
						//$container.append( $box_desc ).isotope( 'appended', $box_desc);
								    		  					 	
				
					 	//keepIniPad();
					 	//toggleCandy();						 		
		    		 
		    		   // interWiki($box_desc, title, language);
		    		    
		    		    		    		       	    	    	  	    			
		    		
						
		    				    
		    	}// end if something has been found
		    	
		    			    		
		    			    	
		    												
  			}//if something has been found
  			else{
	  				var gridster = jQuery(".gridster ul").gridster().data('gridster');
	  				
	  				gridster.remove_widget( $box_loading );
	  				
			   		var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
			   		var $box = jQuery('<p></p>').append($content);
			   			$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
			   		    $box = jQuery('<div class="container"></div>').append($box);	
			   		    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}							
			   		    $box = jQuery('<div class="brick uthorWiki '+$titleclass+'" color='+$color+'></div>').append($box);					
			   	
 			   		gridster.add_widget($box);	 						 									    			
		       		removeGrid($box);
               		return false;   
	  				
  		
  			
  			     	    			
		    }//End else not found
       	},
       	error: function (data){
       	
       			var gridster = jQuery(".gridster ul").gridster().data('gridster');	  				
	  				gridster.remove_widget( $box_loading );
	  				
       			var content = "Wikipedia seems to have the hickup..";
       			var $box = jQuery('<p></p>').append($content);
					$box = jQuery('<div class="brick wiki" color='+$color+'></div>').append($box);
	    		
 					gridster.add_widget($box);	
 					removeGrid($box);
		    
				return false; 
       	}
  	});

	
}


This was a try to dynamically set the size for a wiki brick:

						 var heightsum = 0;
                        var picrows = 0;
                        
                        if ($box_desc.find("img").length){
	                        $box_desc.find("img").each(function(){
	                            
	                            
	                            heightsum = heightsum + this.height;
	                            	
	                        })
	                        picrows = heightsum / 100;
                        	picrows = Math.round(picrows) + 2;
                        }
                         var size = $box_desc.text().length;
                        	rows = size / 70;
                        	rows = Math.round(rows) + 1;
                        	
                        	
                        	
                        	rows = rows + picrows; 
                        	                     	
                        console.log("-----------");
                        console.log(size);	
                         	
                        console.log(rows);
                         console.log("-----------");
                         
                         
*-----------------------------------------****

function recordClicks(tag, id){  

jQuery(tag).on('click', function(){ //tag is to pass in what shall be recorded
   		
   		var author = jQuery(this).attr('title');//ok, here we have to define some "eckdaten" - first, what wiki-article are we recording?
   		var index = ++id; // then the index of its predecessor, 
   		var language = jQuery(this).parents(".brick").attr("language");  
   		var type = "wiki";
   		//var pathname = window.location.pathname; // my actual url
   		var post = jQuery(this).parents(".brick");
      	
   		if (post.length){//we want to know if wikipedia actually found something, if not, do not even add it to the array
   			recordArray.push({"type":"wiki","topic":author, "index":id, "lang":language}); // this is to create an array and have everything in one place.
   			console.log(recordArray);
   		}
});
	
}

*-----------------------------------------****

function authorsMeta(ide, author, language) {

var isiPad = navigator.userAgent.match(/iPad/i) != null;

// For use within iPad developer UIWebView
// Thanks to Andrew Hedges!
var ua = navigator.userAgent;
var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

var title = author;
var $titleclass = title.replace(/\s+/g, '-').toLowerCase();

var $post = jQuery('div[data-sort="'+ide+'"]');
var $color = $post.find(".postLink").attr('color');

  var $container = jQuery('#listing,.listing');
  
  var $loading = jQuery("<p style='font-weight:bold;  font-family: Helvetica;'>Loading…</p>");	
      $loading = jQuery('<div class="postLink"></div>').append($loading);
  var $box_loading = jQuery("<div class='container'></div>").append($loading);
  if (!isiPad) {$box_loading = $box_loading.prepend('<span class="cross"></span>');}	
      $box_loading = jQuery("<div class='brick loading' color="+$color+"></div>").append($box_loading);	
   removeCandy($box_loading);
  //$loading.effect("pulsate", { times:10 }, 1000);	  

  $container.append( $box_loading ).isotope( 'appended', $box_loading);	

  jQuery.ajax({
		
		url: 'http://'+language+'.wikipedia.org/w/api.php',
      	data: {
         	action:'parse',
		     prop:'text',
             page:title,
          	format:'json',
          	redirects:'',
          	//section:'0'
        },
        dataType:'jsonp',
       	success: function(data) {
       	
		    if(typeof data.parse != 'undefined'){
		    	
		    	var $container = jQuery('#listing');
		 
		     	var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');
		    	var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');		    				
		    	var pictures = jQuery("<div>"+data.parse.text['*']+"<div>").children('.thumb');
		     		     	
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
		   			
		   			$container.isotope( 'remove', $box_loading);
		   					   										   		
		    		var $box_desc = jQuery('<p></p>').append($card);//start building the authorsMeta Candy
		    		if ($card){
		    			$box_desc = $box_desc.append("<br><div id='line'></div><br>" );}//line of separation between Card and Description
		    		    $box_desc = $box_desc.append($desc);
		    		    
		    		    $box_desc = jQuery('<div class="postLink"></div>').append($box_desc);
		    		    $box_desc = jQuery('<div class="container"></div>').append($box_desc); // keep color also here, furtherWikis won´t pass the color
		    		    if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}		    		    
                        $box_desc = jQuery('<div class="brick wiki" title="'+title+'"  data-sort="'+ide+'" language="'+language+'" color='+$color+'"></div>').append($box_desc);		    		    		
						$container.isotope( 'insert', $box_desc);
						//$container.append( $box_desc ).isotope( 'appended', $box_desc);
								    		  					 	
					 	removeCandy($box_desc);
					 	keepIniPad();
					 	//toggleCandy();						 		
		    		    furtherAuthor($box_desc, language);
		    		    interWiki($box_desc, title, language);
		    		    
		    		    		    		       	    	    	  	    			
		    			/*---------------------WIKIMORE----------------------------------*/
					 	var wikimore = wikidesc.next();
		    	    	var moreWiki = function (wikimore){ //this is the function to insert wikiMores into our isotope DOM
		    	    		
		    	    		var $more = wikimore.html();
		    	   
					 		var $line = jQuery("<div id='line'></div>" );			
		    	    		$box_desc = $box_desc.append($line); // here we are building the Button to trigger further wikiMores
		    	    		$box_desc = $box_desc.append("<p id='moreWiki'>More</p>");
		    	    		
		    	    		$container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    		
		    	    		$box_desc.find("p#moreWiki").click(function() {
				    			
				    			var $wikimore = jQuery('<p></p>').append($more);
				    			
				    			jQuery(this).replaceWith($wikimore);
				    			
				    			jQuery('#listing').isotope('reLayout');
				    			
				    			var $parent = $wikimore.parent(".wiki");				    		
				    			var wikinext = wikimore.next();
				    	
				    			if(wikinext.next().next().length){
					    			moreWiki(wikinext.next());	
					    		}
					    		furtherAuthor($parent, lang);				    					    								 	
				    			keepIniPad();			    			
					    		return false;
       							
				    		});
				    	}
				    	moreWiki(wikimore);	
						
		    				    
		    	}//if something has been found
		    	else{	    		
		    					
		    		var $container = jQuery('#listing,.listing');
		    			$loading = jQuery(".loading");
						$container.isotope( 'remove', $loading);
  					    $container.isotope( 'remove', $box_loading);
					var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
					var $box = jQuery('<p></p>').append($content);
						$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
					    $box = jQuery('<div class="container"></div>').append($box);
					    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}	
					    $box = jQuery('<div class="brick wiki '+$titleclass+'" color='+$color+'></div>').append($box);					
					
					$container.isotope( 'insert', $box );	
 					removeCandy($box);
 					return false; 
		    					    		   	
		    	}//else show the "be the first to write this article"	
		    			    		
		    			    	
		    	/*---------------------PICTURES----------------------------------*/

		    	if(pictures.length > 0){
		    	
		    		var $line = jQuery("<div id='line'></div>" );			
		    	    $box_desc = $box_desc.append($line); // here we are building the Button to trigger further picturess
		    	    $box_desc = $box_desc.append("<p id='pictures'>Pictures</p>");
		    	    $container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    
		    	    var addPictures = function (pictures, lang, id){ //this is the function to insert picturess into our isotope DOM
		    	    
				    	pictures.find('.magnify').remove();
				   
				    	$box_desc.find("p#pictures").click(function() {
				    		
				    		jQuery(this).empty().remove();
				    		$line.empty().remove();
				    		
				    		pictures.each(function(){
				    			
				    			var $pictures = jQuery('<p></p>').append(this);
				    				$pictures = jQuery('<div class="postLink" color='+$color+'></div>').append($pictures);
				    				$pictures = jQuery('<div class="container"></div>').append($pictures);
		    	    				if (!isiPad) {$pictures = $pictures.prepend('<span class="cross"></span>');}
		    	    				$pictures = jQuery('<div class="brick wiki '+$titleclass+'" title='+title+' language="'+lang+'" color='+$color+'></div>').append($pictures);
		    	    				
				    				$container.isotope( 'insert', $pictures );
				    				//toggleCandy();
				    				$pictures.attr("data-sort", ++id);
				    				furtherAuthor($pictures, lang);	
				    				removeCandy($pictures);
				    			
				    		});
       						
       						return false;
       						
				    	});
				    }
				    var id = $box_desc.attr("data-sort");
       				
				    addPictures(pictures, language, ide);  		
				} // if there are pictures..
												
  			}//if something has been found
  			else{ //wikiArticle not found:  
  				var isSingle = <?php if(is_single()){echo "true";}else{echo "false";};?>;			
  				if (isSingle){ //if is single, then show dont remove the candy if nothing is found, but simply show the title (e.g. the tags, the title, the author)
	  				
	  				var $container = jQuery('#listing,.listing');								
					$container.isotope( 'remove', $box_loading);
					
					var $box = jQuery('<br><p style="font-weight:bold;font-size:13px;">'+title+'</p>');
					$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
				 	$box_desc = jQuery('<div class="container" color='+$color+'></div>').append($box);				    		    
				 	if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}	
                    $box_desc = jQuery('<div class="brick wiki '+$titleclass+'" language="'+language+'" color='+$color+'></div>').append($box_desc);		    		    
		    		    	    		   		    		    
		    		var sum = Number(ide) + 1;
		    		
		    		$box_desc.attr('data-sort', sum);
		    		$container.isotope( 'insert', $box_desc );	
		    		removeCandy($box_desc);
					 
  				}else{ //else is not single, do the usual not found error
	  			
	  				var $container = jQuery('#listing,.listing');
	  				$container.isotope( 'remove', $box_loading);
	  				
			   		var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
			   		var $box = jQuery('<p></p>').append($content);
			   			$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
			   		    $box = jQuery('<div class="container"></div>').append($box);	
			   		    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}							
			   		    $box = jQuery('<div class="brick uthorWiki '+$titleclass+'" color='+$color+'></div>').append($box);					
			   		    
	    	   		var sum = Number(ide) + 1;		    			 
 			   		$box.attr('data-sort', sum);
 			   		$container.isotope( 'insert', $box);	 						 									    			
		       		removeCandy($box);
               		return false;   
	  				
  				}//end else isSingle
  			
  			     	    			
		    }//End else not found
       	},
       	error: function (data){
       	
       				$box_loading.empty().remove();
       			var $container = jQuery('#listing,.listing');
       			var content = "Wikipedia seems to have the hickup..";
       			var $box = jQuery('<p></p>').append($content);
					$box = jQuery('<div class="brick wiki" color='+$color+'></div>').append($box);
	    		
 				 var sum = Number(ide) + 1;		    			 
 				 $box.attr('data-sort', sum);
 				 $container.isotope( 'insert', $box );	
		    	 removeCandy($box);
		    
				return false; 
       	}
  	});

	
}



****--------------------------------------------***



function buildWall(ide, author, language) {

	
// For use within normal web clients 
var isiPad = navigator.userAgent.match(/iPad/i) != null;

// For use within iPad developer UIWebView
// Thanks to Andrew Hedges!
var ua = navigator.userAgent;
var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

var title = author;
var $titleclass = title.replace(/\s+/g, '-').toLowerCase();

var $post = jQuery('div[data-sort="'+ide+'"]');
var $color = $post.find(".postLink").attr('color');


  var $container = jQuery('#listing,.listing');
  
  var $loading = jQuery("<p style='font-weight:bold;  font-family: Helvetica;'>Loading…</p>");	
      $loading = jQuery('<div class="postLink"></div>').append($loading);
  var $box_loading = jQuery("<div class='container'></div>").append($loading);
  if (!isiPad) {$box_loading = $box_loading.prepend('<span class="cross"></span>');}	
      $box_loading = jQuery('<div class="brick loading" title="'+title+'" data-sort="'+ide+'" color="'+$color+'"></div>').append($box_loading);	
   removeCandy($box_loading);
  //$loading.effect("pulsate", { times:10 }, 1000);	  
 	 

  $container.isotope( 'insert', $box_loading );	

  
  jQuery.ajax({
		
		url: 'http://'+language+'.wikipedia.org/w/api.php',
      	data: {
         	action:'parse',
		     prop:'text',
             page:title,
          	format:'json',
          	redirects:'',
          	//section:'0'
        },
        dataType:'jsonp',
       	success: function(data) {
      	
		    if(typeof data.parse != 'undefined'){
		   
		    	var $container = jQuery('#listing');
		 
		     	var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');
		    	var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');		    				
		    	var pictures = jQuery("<div>"+data.parse.text['*']+"<div>").children('.thumb');
		     	
		     	
		    	wikidesc.find('sup').remove();
		    	wikidesc.find('span.IPA').remove();
		    	wikidesc.find('span.nowrap').remove();
		    	wikidesc.find('.dablink').remove();
		    	wikidesc.find('.editsection').remove();
		    	wikidesc.find('.magnify').remove();
		    	wikidesc.find('.error').remove();            	
                wikidesc.find('a[href$="ogg"]').remove();            	
				wikidesc.find('a:contains("edit")').remove();  
			
		    	
		    		var $desc = wikidesc.html();
                    var $card = wikicard.html();
                
		   			  			
		   			$container.isotope( 'remove', $box_loading);
		   			$box_loading.remove();
		   					   										   		
		    		var $box_desc = jQuery('<p></p>').append($card);//start building the authorsMeta Candy
		    		if ($card){
		    		
		    			$box_desc = $box_desc.append("<br><div id='line'></div><br>" );
		    			
		    		}//line of separation between Card and Description
		    		
		    		    $box_desc = $box_desc.append($desc);
		    		
		    		   	$box_desc = jQuery('<div class="postLink" color='+$color+'></div>').append($box_desc);
		    		    $box_desc = jQuery('<div class="container"></div>').append($box_desc); // keep color also here, furtherWikis won´t pass the color
		    		    if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}		    		    
                        $box_desc = jQuery('<div class="brick wiki" data-sort="'+ide+'" title="'+title+'" language="'+language+'" color='+$color+'"></div>').append($box_desc);		    		    		
						$container.isotope( 'insert', $box_desc);
							   				
		   				var links = $box_desc.find("a");
		    		  					 	
					 	removeCandy($box_desc);
					 	keepIniPad();
					 	//toggleCandy();						 		
		    		    furtherAuthor($box_desc, language);
		    		    interWiki($box_desc, title, language);
		    		    
		    		    		    		       	    	    	  	    			
		    			/*---------------------WIKIMORE----------------------------------*/
					 	var wikimore = wikidesc.next();
		    	    	var moreWiki = function (wikimore){ //this is the function to insert wikiMores into our isotope DOM
		    	    		
		    	    		var $more = wikimore.html();
		    	   
					 		var $line = jQuery("<div id='line'></div>" );			
		    	    		$box_desc = $box_desc.append($line); // here we are building the Button to trigger further wikiMores
		    	    		$box_desc = $box_desc.append("<p id='moreWiki'>More</p>");
		    	    		
		    	    		$container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    		
		    	    		$box_desc.find("p#moreWiki").click(function() {
				    			
				    			var $wikimore = jQuery('<p></p>').append($more);
				    			
				    			jQuery(this).replaceWith($wikimore);
				    			
				    			jQuery('#listing').isotope('reLayout');
				    			
				    			var $parent = $wikimore.parent(".wiki");
				    			
				    			
				    			furtherAuthor($parent, lang);				    					    								 	
				    			keepIniPad();
				    			
				    			var wikinext = wikimore.next();
				    			if (wikinext.next().length){
					    			
					    			moreWiki(wikinext.next());
				    			}			    			
				    				
				    							    			
       							return false;
       							
				    		});
				    	}
				    	moreWiki(wikimore);	
						
		    				    
		    	//if something has been found
		    	
		    			    		
		    			    	
		    	/*---------------------PICTURES----------------------------------*/

		    	if(pictures.length > 0){
		    	
		    		var $line = jQuery("<div id='line'></div>" );			
		    	    $box_desc = $box_desc.append($line); // here we are building the Button to trigger further picturess
		    	    $box_desc = $box_desc.append("<p id='pictures'>Pictures</p>");
		    	    $container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    
		    	    var addPictures = function (pictures, lang, id){ //this is the function to insert picturess into our isotope DOM
		    	    
				    	pictures.find('.magnify').remove();
				   
				    	$box_desc.find("p#pictures").click(function() {
				    		
				    		jQuery(this).empty().remove();
				    		$line.empty().remove();
				    		
				    		pictures.each(function(){
				    			
				    			var $pictures = jQuery('<p></p>').append(this);
				    				$pictures = jQuery('<div class="postLink" color='+$color+'></div>').append($pictures);
				    				$pictures = jQuery('<div class="container"></div>').append($pictures);
		    	    				if (!isiPad) {$pictures = $pictures.prepend('<span class="cross"></span>');}
		    	    				$pictures = jQuery('<div class="brick wiki '+$titleclass+'" title='+title+' language="'+lang+'" color='+$color+'></div>').append($pictures);
				    			
				    				$container.isotope( 'insert', $pictures );
				    				//toggleCandy();
				    				$pictures.attr("data-sort", ++id);
				    				furtherAuthor($pictures, lang);	
				    				removeCandy($pictures);
				    			
				    		});
       						
       						return false;
       						
				    	});
				    }
				    var id = $box_desc.attr("data-sort");
       				
				    addPictures(pictures, language, id);  		
				} // if there are pictures..
												
  			}//if something has been found
  			else{ //wikiArticle not found:  
  							
  				
	  			
	  				var $container = jQuery('#listing,.listing');
	  				$container.isotope( 'remove', $box_loading);
	  				
			   		var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
			   		var $box = jQuery('<p></p>').append($content);
			   			$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
			   		    $box = jQuery('<div class="container"></div>').append($box);	
			   		    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}							
			   		    $box = jQuery('<div class="brick wiki '+$titleclass+'" color='+$color+'></div>').append($box);					
			   		    
	    	   		var sum = Number(id) + 1;		    			 
 			   		$box.attr('data-sort', sum);
 			   		$container.isotope( 'insert', $box);	 						 									    			
		       		removeCandy($box);
               		return false;   
	  				
  		
  			
  			     	    			
		    }//End else not found
       	},
       	error: function (data){
       	
       				$box_loading.empty().remove();
       			var $container = jQuery('#listing,.listing');
       			var content = "Wikipedia seems to have the hickup..";
       			var $box = jQuery('<p></p>').append($content);
					$box = jQuery('<div class="brick wiki" color='+$color+'></div>').append($box);
	    		
 				 var sum = Number(id) + 1;		    			 
 				 $box.attr('data-sort', sum);
 				 $container.isotope( 'insert', $box );	
		    	 removeCandy($box);
		    
				return false; 
       	}
  	});

	
}


function recordClicks(tag, id){  

jQuery(tag).on('click', function(){ //tag is to pass in what shall be recorded
   	
   		var author = jQuery(this).attr('title');//ok, here we have to define some "eckdaten" - first, what wiki-article are we recording?
   		var index = ++id; // then the index of its predecessor, 
   		var language = jQuery(this).parents(".brick").attr("language");  
   		
   		var pathname = window.location.pathname;
   		var post = jQuery(this).parents(".brick");
      	
   		if (post.length){//we want to know if wikipedia actually found something, if not, do not even add it to the array
   			
   			jQuery.ajax({
            	type: "POST",
          		url: "/wp-content/themes/wpbm/session.php",
				data: {
                	url: pathname,
                	top: author,
                	lang: language,
                	id:index
            	}
            });
   }
});
	
}

function buildWall(ide, author, language) {

	
// For use within normal web clients 
var isiPad = navigator.userAgent.match(/iPad/i) != null;

// For use within iPad developer UIWebView
// Thanks to Andrew Hedges!
var ua = navigator.userAgent;
var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

var title = author;
var $titleclass = title.replace(/\s+/g, '-').toLowerCase();

var $post = jQuery('div[data-sort="'+ide+'"]');
var $color = $post.find(".postLink").attr('color');


  var $container = jQuery('#listing,.listing');
  
  var $loading = jQuery("<p style='font-weight:bold;  font-family: Helvetica;'>Loading…</p>");	
      $loading = jQuery('<div class="postLink"></div>').append($loading);
  var $box_loading = jQuery("<div class='container'></div>").append($loading);
      $box_loading = jQuery('<div class="brick loading authorWiki" data-sort="'+ide+'" color="'+$color+'"></div>').append($box_loading);	
   
  //$loading.effect("pulsate", { times:10 }, 1000);	  
 	 

  $container.isotope( 'insert', $box_loading );	

  
  jQuery.ajax({
		
		url: 'http://'+language+'.wikipedia.org/w/api.php',
      	data: {
         	action:'parse',
		     prop:'text',
             page:title,
          	format:'json',
          	redirects:'',
          	//section:'0'
        },
        dataType:'jsonp',
       	success: function(data) {
      	
		    if(typeof data.parse != 'undefined'){
		   
		    	var $container = jQuery('#listing');
		 
		     	var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');
		    	var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');		    				
		    	var pictures = jQuery("<div>"+data.parse.text['*']+"<div>").children('.thumb');
		     	var wikimore = wikidesc.next();
		     	
		    	wikidesc.find('sup').remove();
		    	wikidesc.find('span.IPA').remove();
		    	wikidesc.find('span.nowrap').remove();
		    	wikidesc.find('.dablink').remove();
		    	wikidesc.find('.editsection').remove();
		    	wikidesc.find('.magnify').remove();
		    	wikidesc.find('.toc').remove(); 
		    	wikidesc.find('.error').remove();            	
                wikidesc.find('a[href$="ogg"]').remove();            	
				
                if (wikicard.hasClass('geography')){
                
                   	var $desc = wikidesc.html();                                
                    var $more = wikimore.html();
                } //if has geography do not show the card
		    	else {
		    	
		    		var $desc = wikidesc.html();
                    var $card = wikicard.html();
                    var $more = wikimore.html();
		    	}//else if no geography, then show the card (this is because geography messes up the card)
				
		   		
		   			  			
		   			$container.isotope( 'remove', $box_loading);
		   			$box_loading.remove();
		   					   										   		
		    		var $box_desc = jQuery('<p></p>').append($card);//start building the authorsMeta Candy
		    		if ($card){
		    		
		    			$box_desc = $box_desc.append("<br><div id='line'></div><br>" );
		    			
		    		}//line of separation between Card and Description
		    		
		    		    $box_desc = $box_desc.append($desc);
		    		
		    		   	$box_desc = jQuery('<div class="postLink" color='+$color+'></div>').append($box_desc);
		    		    $box_desc = jQuery('<div class="container"></div>').append($box_desc); // keep color also here, furtherWikis won´t pass the color
		    		    if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}		    		    
                        $box_desc = jQuery('<div class="brick authorWiki" title="'+$titleclass+'" data-sort="'+ide+'" language="'+language+'" color='+$color+'"></div>').append($box_desc);		    		    		
						$container.isotope( 'insert', $box_desc);
							   				
		   				var links = $box_desc.find("a");
		    		  					 	
					 	removeCandy($box_desc);
					 	keepIniPad();
					 	//toggleCandy();						 		
		    		    furtherAuthor($box_desc, language);
		    		    interWiki($box_desc, title, language);
		    		    
		    		    		    		       	    	    	  	    			
		    			/*---------------------WIKIMORE----------------------------------*/
					 	
		    	    	var moreWiki = function (more, lang){ //this is the function to insert wikiMores into our isotope DOM
		    	    		
		    	    		
					 		var $line = jQuery("<div id='line'></div>" );			
		    	    		$box_desc = $box_desc.append($line); // here we are building the Button to trigger further wikiMores
		    	    		$box_desc = $box_desc.append("<p id='moreWiki'>More about "+author+"</p>");
		    	    		
		    	    		$container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    		
		    	    		$box_desc.find("p#moreWiki").click(function() {
				    			
				    			var $wikimore = jQuery('<p></p>').append(more);
				    			
				    			jQuery(this).replaceWith($wikimore);
				    			
				    			jQuery('#listing').isotope('reLayout');
				    			
				    			var $parent = $wikimore.parent(".authorWiki");
				    			furtherAuthor($parent, lang);				    					    								 	
				    			keepIniPad();			    			
				    							    			
       							return false;
       							
				    		});
				    	}
				    	moreWiki($more, language);	
						
		    				    
		    	//if something has been found
		    	
		    			    		
		    			    	
		    	/*---------------------PICTURES----------------------------------*/

		    	if(pictures.length > 0){
		    	
		    		var $line = jQuery("<div id='line'></div>" );			
		    	    $box_desc = $box_desc.append($line); // here we are building the Button to trigger further picturess
		    	    $box_desc = $box_desc.append("<p id='pictures'>Pictures about "+author+"</p>");
		    	    $container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    
		    	    var addPictures = function (pictures, lang, id){ //this is the function to insert picturess into our isotope DOM
		    	    
				    	pictures.find('.magnify').remove();
				   
				    	$box_desc.find("p#pictures").click(function() {
				    		
				    		jQuery(this).empty().remove();
				    		$line.empty().remove();
				    		
				    		pictures.each(function(){
				    			
				    			var $pictures = jQuery('<p></p>').append(this);
				    				$pictures = jQuery('<div class="postLink" color='+$color+'></div>').append($pictures);
				    				$pictures = jQuery('<div class="container"></div>').append($pictures);
		    	    				if (!isiPad) {$pictures = $pictures.prepend('<span class="cross"></span>');}
		    	    				$pictures = jQuery('<div class="brick authorWiki '+$titleclass+'" title='+title+' language="'+lang+'" color='+$color+'></div>').append($pictures);
				    			
				    				$container.isotope( 'insert', $pictures );
				    				//toggleCandy();
				    				$pictures.attr("data-sort", ++id);
				    				furtherAuthor($pictures, lang);	
				    				removeCandy($pictures);
				    			
				    		});
       						
       						return false;
       						
				    	});
				    }
				    var id = $box_desc.attr("data-sort");
       				
				    addPictures(pictures, language, id);  		
				} // if there are pictures..
												
  			}//if something has been found
  			else{ //wikiArticle not found:  
  							
  				
	  			
	  				var $container = jQuery('#listing,.listing');
	  				$container.isotope( 'remove', $box_loading);
	  				
			   		var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
			   		var $box = jQuery('<p></p>').append($content);
			   			$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
			   		    $box = jQuery('<div class="container"></div>').append($box);	
			   		    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}							
			   		    $box = jQuery('<div class="brick authorWiki '+$titleclass+'" color='+$color+'></div>').append($box);					
			   		    
	    	   		var sum = Number(id) + 1;		    			 
 			   		$box.attr('data-sort', sum);
 			   		$container.isotope( 'insert', $box);	 						 									    			
		       		removeCandy($box);
               		return false;   
	  				
  		
  			
  			     	    			
		    }//End else not found
       	},
       	error: function (data){
       	
       				$box_loading.empty().remove();
       			var $container = jQuery('#listing,.listing');
       			var content = "Wikipedia seems to have the hickup..";
       			var $box = jQuery('<p></p>').append($content);
					$box = jQuery('<div class="brick authorWiki" color='+$color+'></div>').append($box);
	    		
 				 var sum = Number(id) + 1;		    			 
 				 $box.attr('data-sort', sum);
 				 $container.isotope( 'insert', $box );	
		    	 removeCandy($box);
		    
				return false; 
       	}
  	});

	
}