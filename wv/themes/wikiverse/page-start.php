<?php
/*
Template Name: Start
*/
?>

<?php get_header(); ?>
			

			<div id="content" class="clearfix row-fluid">
			
				<div id="main" class="span12 clearfix" role="main">

					<div id="listing">
							  <div class="brick"></div>
							  <div class="brick w2"></div>
					</div>
			
				</div> <!-- end #main -->
    
				<?php //get_sidebar(); // sidebar 1 ?>
    
			</div> <!-- end #content -->

			<script src="/wv/themes/wikiverse/js/packery.js"></script>	
			<?php include 'engine/includes/scripts.php'; ?>

			<script>

				var container = document.querySelector('#listing');
				var pckry = new Packery( container, {
				  // options
				  itemSelector: '.brick',
				  gutter: 10,
				
				});
				var itemElems = pckry.getItemElements();
				// for each item...
				for ( var i=0, len = itemElems.length; i < len; i++ ) {
				  var elem = itemElems[i];
				  // make element draggable with Draggabilly
				  var draggie = new Draggabilly( elem );
				  // bind Draggabilly events to Packery
				  pckry.bindDraggabillyEvents( draggie );
				}

				jQuery(document).ready(function(){ 
			
					//wikiverse_search();
				
				});
			</script>
<?php get_footer(); ?>