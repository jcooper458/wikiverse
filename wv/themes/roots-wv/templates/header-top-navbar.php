<header class="banner navbar navbar-default navbar-static-top" role="banner">
  <div class="fluid-container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" id="logo" href="<?php echo home_url(); ?>/"><?php bloginfo('name'); ?></a>
    </div>

    <nav class="collapse navbar-collapse" role="navigation">
    <div class="row top-buffer-small">
	    <div class="col-lg-6 col-md-6 col-sm-6">
	      	<img class="icon" id="wikipedia-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/wikipedia.png">
	      	<img class="icon" id="youtube-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/youtube.png">
	      	<!--<img class="icon" id="gmaps-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/gmaps.png">-->
	      	<img class="icon" id="vimeo-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/vimeo.png">
	      	
	      	<?php if ( is_user_logged_in() ) { 
	    		$nonce = wp_create_nonce( 'wall' ); ?>
	    		<?php if ( is_front_page() ) { ?>
					<button class="btn btn-default"  id="saveWall" onclick="apfaddpost('<?php echo $nonce ?>');" type="button">Save Wall</button>
				<?php }  ?>
				<?php if ( is_singular("wall") ) { ?>
					<button class="btn btn-default"  id="editWall" onclick="apfeditpost('<?php echo $nonce ?>');" type="button">Save Changes</button>
				<?php }  ?> 	
			<?php }  ?> 
	      	
	    </div>
	  
	     
    </div>
    </nav>
  </div>
</header>
