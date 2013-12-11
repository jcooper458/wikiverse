<?php

// ! // Load WikiVerse JS 
function wikiverse_startwall_js() { { 
    if ( is_page() || is_singular( 'wall' ) ): ?>
<!-- html -->   
<?php include( get_stylesheet_directory() . '/engine/includes/scripts.php'); ?>


<script>

jQuery.noConflict(); 

jQuery(document).ready(function(){ 
		
    var $container = jQuery('#listing');
	//var sortData = jQuery("#brickdata tr td#sort").html();
		
		
				
			$container.packery({
			  itemSelector: '.brick'
			});
					
 
        
     jQuery('div.brick').livequery(function(event) { 
	      
	         jQuery("a#editWall").html('Save Wall');
	         jQuery("a#editWall").fadeIn("slow");
	         jQuery("a#saveWall").fadeIn("slow");
        
        }); 
     
   	autocompleteUtube();
	searchGoogle();	 
	removeCandy();  
   // recordClicks(".record");

	//gridStart();
	//clearBricks();
	getLang();
	buildWall();
	wikiverse_search();
	//buildSoundcloud(5);

	
});


</script>
<!-- end -->
<?php
	endif; }} 
// Hook into action
add_action('close_body','wikiverse_startwall_js');

function front_editor_disable() {
	if ( ! is_single() )
		return true;
}
add_filter('front_end_editor_disable', 'front_editor_disable');

add_filter('show_admin_bar', '__return_false');  //disable adminbar

?>