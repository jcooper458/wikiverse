<header class="banner navbar navbar-default navbar-static-top" role="banner">
  <div class="fluid-container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      
    </div>

    <nav class="collapse navbar-collapse" role="navigation">
    <div class="row">
	    <div class="col-lg-5 col-md-5 col-sm-5 top-buffer-small">
	    	
	      	<img class="icon" id="wikipedia-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/wikipedia.png">
	      	<img class="icon" id="youtube-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/youtube.png">
	      	<img class="icon" id="flickr-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/flickr.png">
	        <img class="icon" id="gmaps-icon" src="<?php echo get_stylesheet_directory_uri();?>/assets/img/gmaps.png">
	    </div>
	     <div class="col-lg-2 col-md-2 col-sm-2">
	     	<a class="navbar-brand" id="logo" href="<?php echo home_url(); ?>/"><?php bloginfo('name'); ?></a>
	     </div>
	  	 <div class="col-lg-5 col-md-5 col-sm-5 top-buffer-small">
	  	    <?php if ( is_user_logged_in() ) { 
	    	$nonce = wp_create_nonce( 'wall' ); ?>

	    	<?php if ( is_front_page() ) { ?>
				<button class="btn btn-default pull-right"  id="saveWall" onclick="createWall('<?php echo $nonce ?>');" type="button">Save Wall</button>
			<?php }  ?>

			<?php if ( is_singular("wall") ) { ?>
				<button class="btn btn-default pull-right"  id="editWall" onclick="editWall('<?php echo $nonce ?>');" type="button">Save Changes</button>
			<?php }  ?> 	

			<?php } else {?> 
				<!--<button class="btn btn-default pull-right" id="editWall" type="button"><a href="/login" >Login</a></button>
				<button class="btn btn-default pull-right" id="editWall" type="button"><a href="/wp-login.php?action=register" >Register</a></button>-->
			<?php }  ?> 	
	     </div>
    </div>
    </nav>
  </div>
</header>
