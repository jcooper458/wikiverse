<?php 

global $current_user;
get_currentuserinfo();

?>



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

         <?php if ( is_page('start') ) { ?>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">start <span class="caret"></span></a>
          <ul class="dropdown-menu sources-menu">
			    <li id="wikipedia" ><a href="#"><i class="fa fa-wikipedia"></i>		Wikipedia	</a></li>
			    <li id="youtube"   ><a href="#"><i class="fa fa-youtube"></i>		YouTube		</a></li>
			    <li id="flickr"    ><a href="#"><i class="fa fa-flickr"></i>		Flickr		</a></li>
			    <li id="instagram" ><a href="#"><i    class="fa fa-instagram"></i>	Instagram	</a></li>
			    <li id="soundcloud"><a href="#"><i     class="fa fa-soundcloud"></i>&nbsp;Soundcloud	</a></li>
			    <li id="gmaps"     ><a href="#">&nbsp;<i class="fa fa-map-marker"></i>	Google Maps	</a></li>
          </ul>
        </li>

      <?php } else if (is_page('home')) { ?>

          <li><a href="/start">create board</a></li>

      <?php }  ?>

      </ul>


      <ul class="nav navbar-nav navbar-right">
        	
 	    <?php if ( is_user_logged_in() ) { 
	    	$nonce = wp_create_nonce( 'board' ); ?>
        <div id="nonce"><?php echo $nonce ?></div>
	    	<?php if ( is_page('start') ) { ?>
	    		<li><a href="#" id="saveboard" onclick="createboard('<?php echo $nonce ?>');" >Save board</a></li>
			<?php }  ?>

			<?php if ( is_singular("board") ) { ?>
				<li><a href="#" id="editboard" onclick="editboard('<?php echo $nonce ?>');" >Save Changes</a></li>
			<?php }  ?> 	

			<?php } else {?> 
				<!--<button class="btn btn-default pull-right" id="editboard" type="button"><a href="/login" >Login</a></button>
				<button class="btn btn-default pull-right" id="editboard" type="button"><a href="/wp-login.php?action=register" >Register</a></button>-->
			<?php }  ?> 	
       <?php if ( is_user_logged_in() ) { ?>
          <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo esc_html($current_user->display_name); ?> <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="/start">Create Board</a></li>
            <li><a href="/user/<?php echo esc_html($current_user->display_name); ?>">My boards</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="/user">Change Password</a></li>            
            <li><a href="<?php echo wp_logout_url( home_url() ); ?>">Logout</a></li>
          </ul>
        </li>
        <?php } else { ?>
            <li><a href="/login">login</a></li>
            <li><a href="/login?action=register">sign up</a></li>
         <?php } ?> 
      </ul>


    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

</header>
