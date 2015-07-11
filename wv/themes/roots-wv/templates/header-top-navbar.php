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
	    	

			<div class="btn-group sources-menu">
			  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			    Start    <span class="caret"></span>
			  </button>
			  <ul class="dropdown-menu">
			    <li><a href="#"><i id="wikipedia-icon" class="fa fa-wikipedia"></i>		Wikipedia	</a></li>
			    <li><a href="#"><i id="youtube-icon"   class="fa fa-youtube"></i>		YouTube		</a></li>
			    <li><a href="#"><i id="flickr-icon"    class="fa fa-flickr"></i>		Flickr		</a></li>
			    <li><a href="#"><i id="instagram-icon"    class="fa fa-instagram"></i>	Instagram	</a></li>
			    <li><a href="#"><i id="soundcloud-icon"    class="fa fa-soundcloud"></i>Soundcloud	</a></li>
			    <li><a href="#"><i id="gmaps-icon"     class="fa fa-map-marker"></i>	Google Maps	</a></li>
			  </ul>
			</div>

	      	
	    </div>
	     <div class="col-lg-2 col-md-2 col-sm-2">
	     	<!--<a class="navbar-brand" id="logo" href="<?php echo home_url(); ?>/"><?php bloginfo('name'); ?></a>-->
	     	<h4 id="logo"><?php bloginfo('name'); ?></h4>
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
