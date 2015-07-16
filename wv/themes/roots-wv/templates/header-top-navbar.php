<header class="" role="banner">
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?php echo site_url(); ?>"><?php bloginfo('name'); ?></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Start <span class="caret"></span></a>
          <ul class="dropdown-menu sources-menu">
			    <li id="wikipedia" ><a href="#"><i class="fa fa-wikipedia"></i>		Wikipedia	</a></li>
			    <li id="youtube"   ><a href="#"><i class="fa fa-youtube"></i>		YouTube		</a></li>
			    <li id="flickr"    ><a href="#"><i class="fa fa-flickr"></i>		Flickr		</a></li>
			    <li id="instagram" ><a href="#"><i    class="fa fa-instagram"></i>	Instagram	</a></li>
			    <li id="soundcloud"><a href="#"><i     class="fa fa-soundcloud"></i>&nbsp;Soundcloud	</a></li>
			    <li id="gmaps"     ><a href="#">&nbsp;<i class="fa fa-map-marker"></i>	Google Maps	</a></li>
          </ul>
        </li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        	
 	    <?php if ( is_user_logged_in() ) { 
	    	$nonce = wp_create_nonce( 'board' ); ?>

	    	<?php if ( is_front_page() ) { ?>
	    		<li><a href="#" id="saveboard" onclick="createboard('<?php echo $nonce ?>');" >Save board</a></li>
			<?php }  ?>

			<?php if ( is_singular("board") ) { ?>
				<li><a href="#" id="editboard" onclick="editboard('<?php echo $nonce ?>');" >Save Changes</a></li>
			<?php }  ?> 	

			<?php } else {?> 
				<!--<button class="btn btn-default pull-right" id="editboard" type="button"><a href="/login" >Login</a></button>
				<button class="btn btn-default pull-right" id="editboard" type="button"><a href="/wp-login.php?action=register" >Register</a></button>-->
			<?php }  ?> 	

      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>




</header>
