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
	    	
	      	<i id="wikipedia-icon" class="fa fa-wikipedia"></i>
	      	<i id="youtube-icon"   class="fa fa-youtube-square"></i>
	      	<i id="flickr-icon"    class="fa fa-flickr"></i>
	      	<i id="instagram-icon"    class="fa fa-instagram"></i>
	      	&nbsp;<i id="gmaps-icon"     class="fa fa-map-marker"></i>
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
