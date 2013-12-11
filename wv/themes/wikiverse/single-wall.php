<?php get_header(); ?>
			
			<div id="content" class="clearfix row-fluid">
			
				<div id="main" role="main">

					<div id="listing">
								
					</div>
					
					
				</div> <!-- end #main -->
    
				<?php //get_sidebar(); // sidebar 1 ?>
    
			</div> <!-- end #content -->
			
			<?php include( get_stylesheet_directory() . '/engine/includes/wikiverse-table.php'); ?>

			
			<script src="/wv/themes/wikiverse/js/packery.js"></script>	

		<script>
				var $container = jQuery('#listing');
				// initialize
				$container.packery({
				  itemSelector: '.brick',
				  gutter: 10
				});

	

		
			

		jQuery(document).ready(function(){ 
			buildWall();
		
		
		});

	</script>
	<?php include 'engine/includes/scripts.php'; ?>
<?php get_footer(); ?>