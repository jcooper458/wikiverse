<header class="" role="banner">
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#"><?php bloginfo('name'); ?></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Start <span class="caret"></span></a>
          <ul class="dropdown-menu sources-menu">
			    <li id="wikipedia-icon" ><a href="#"><i class="fa fa-wikipedia"></i>		Wikipedia	</a></li>
			    <li id="youtube-icon"   ><a href="#"><i class="fa fa-youtube"></i>		YouTube		</a></li>
			    <li id="flickr-icon"    ><a href="#"><i class="fa fa-flickr"></i>		Flickr		</a></li>
			    <li id="instagram-icon" ><a href="#"><i    class="fa fa-instagram"></i>	Instagram	</a></li>
			    <li id="soundcloud-icon"><a href="#"><i     class="fa fa-soundcloud"></i>&nbsp;Soundcloud	</a></li>
			    <li id="gmaps-icon"     ><a href="#">&nbsp;<i class="fa fa-map-marker"></i>	Google Maps	</a></li>
          </ul>
        </li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        	
 	    <?php if ( is_user_logged_in() ) { 
	    	$nonce = wp_create_nonce( 'wall' ); ?>

	    	<?php if ( is_front_page() ) { ?>
	    		<li><a href="#" id="saveWall" onclick="createWall('<?php echo $nonce ?>');" >Save Wall</a></li>
			<?php }  ?>

			<?php if ( is_singular("wall") ) { ?>
				<li><a href="#" id="editWall" onclick="editWall('<?php echo $nonce ?>');" >Save Changes</a></li>
			<?php }  ?> 	

			<?php } else {?> 
				<!--<button class="btn btn-default pull-right" id="editWall" type="button"><a href="/login" >Login</a></button>
				<button class="btn btn-default pull-right" id="editWall" type="button"><a href="/wp-login.php?action=register" >Register</a></button>-->
			<?php }  ?> 	

      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>




</header>
