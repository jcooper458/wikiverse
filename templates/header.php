<?php 

global $current_user;
get_currentuserinfo();

$nonce = wp_create_nonce( 'board' );

//if user is not logged in: 
if ( !is_user_logged_in() ) {
  $msg = "Hi! we noticed you are not logged in and are interacting with someone else's board. Your changes won't be saved unless you sign-up.";
}
//if user is logged in:
else{
  //but is not author
  if ( $current_user->ID == $post->post_author ) { 
    $msg = "Welcome back " . $current_user->user_nicename . "!";   
  } 
  //else, user is logged in, and also author
  else{
    $msg = "You are interacting with someone else's board. If you want to save your changes to your own board, click on 'fork board', in the menu. Otherwise you can just play around but your changes won't be saved"; 
  }
}
?>

<div id="nonce" class="invisible"><?php echo $nonce ?></div>  
<div id="author" data-message="<?php echo $msg ?>" class="invisible"></div>  

<header class="banner" role="banner">

  <nav id="sidebar" class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left well well-sm fixed">
    <div id="searchMeta" class="well">
      <i id="closeSidebar" class="fa fa-close"></i>
      <h3 id="search-keyword" class=""></h3> 
      <div class="search-ui">
        <ul class="nav nav-pills">
          <li class="">
            <button class="btn btn-xs btn-primary searchButton cursor">search for something else</button>
            <select class="selectpicker pull-left otherSource show-menu-arrow" data-style="btn btn-default btn-xs" data-width="50%" data-size="20">
              <option selected="">try another source..</option>
              <option><i class="fa fa-youtube-square youtube-icon icon"></i>youtube</option>
              <option><i class="fa fa-wikipedia wikipedia-icon icon"></i>wikipedia</option>
              <option><i class="fa fa-twitter twitter-icon icon"></i>twitter</option>
              <option><i class="fa fa-flickr flickr-icon icon"></i>flickr</option>
              <option><i class="fa fa-instagram instagram-icon icon"></i></div>instagram</option>
              <option><i class="fa fa-soundcloud soundcloud-icon icon"></i>soundcloud</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
    <div class="results"></div>
  </nav>

  <nav id="wv_nav" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">

      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a> <p id="beta">beta</p>
      </div>         

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">     

        <ul class="nav navbar-nav">    

        <?php if ( is_singular("board") && ( $current_user->ID == $post->post_author ) || ( is_page('start'))) { ?>    

        <li><a class="searchButton" href="#">add content</a></li>              

        <?php }  ?>
      </ul>

      <ul class="nav navbar-nav navbar-right">

        <?php if ( is_user_logged_in() ) { 
           ?>   

          <?php if ( is_page('start') ) { ?>
          <li><a href="#" class="board-pilot invisible" id="playBoard" ><i class="fa fa-play"></i></i></a></li> 
          <li><a href="#" class="board-pilot invisible" id="clearBoard">clear board</a></li> 
          <li><a href="#" class="board-pilot invisible" id="createBoard" >save board</a></li>
          <?php }  ?>
          <?php if ( is_singular("board")) { ?>            
          <li><a href="#" class="board-pilot invisible" id="playBoard"><i class="fa fa-play"></i></i></a></li>    
          <?php if ( $current_user->ID != $post->post_author ) { // if is author ?>
          <li><a href="#" class="board-pilot invisible" id="forkBoard">fork board</a></li> 
          <?php }  else{ // if is not author?>
          <li><a href="#" class="board-pilot invisible" id="forkBoard">copy board</a></li>    
          <li><a href="#" class="board-pilot" id="saveBoard" >save changes</a></li>
          <li><a href="#" class="board-pilot invisible" id="clearBoard">clear board</a></li> 
          <?php }  ?>

          <?php }  ?>

          <?php } else {?> 
          <!--<button class="btn btn-default pull-right" id="editboard" type="button"><a href="/login" >Login</a></button>
          <button class="btn btn-default pull-right" id="editboard" type="button"><a href="/wp-login.php?action=register" >Register</a></button>-->
          <?php }  ?>   
          <?php if ( is_user_logged_in() ) { ?>

          <li class="dropdown" id="theme-dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-cogs icon-large"></i>theme<b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="#" class="change-style-menu-item" rel="superhero"><i class="icon-fixed-width icon-pencil"></i> Superhero (Default)</a></li>
              <li><a href="#" class="change-style-menu-item" rel="yeti"><i class="icon-fixed-width icon-pencil"></i> Yeti</a></li>
              <li><a href="#" class="change-style-menu-item" rel="flatly"><i class="icon-fixed-width icon-pencil"></i> Flatly</a></li>
              <li><a href="#" class="change-style-menu-item" rel="darkly"><i class="icon-fixed-width icon-pencil"></i> Darkly</a></li>
              <li><a href="#" class="change-style-menu-item" rel="journal"><i class="icon-fixed-width icon-pencil"></i> Journal</a></li>
              <li><a href="#" class="change-style-menu-item" rel="readable"><i class="icon-fixed-width icon-pencil"></i> Readable</a></li>
              <li><a href="#" class="change-style-menu-item" rel="slate"><i class="icon-fixed-width icon-pencil"></i> Slate</a></li>
              <li><a href="#" class="change-style-menu-item" rel="lumen"><i class="icon-fixed-width icon-pencil"></i> Lumen</a></li>
              <li><a href="#" class="change-style-menu-item" rel="simplex"><i class="icon-fixed-width icon-pencil"></i> Simplex</a></li>
            </ul>
          </li>


          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo esc_html($current_user->display_name); ?> <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="/start">create board</a></li>
              <li><a href="/user/<?php echo esc_html($current_user->display_name); ?>">my boards</a></li>
              <li role="separator" class="divider"></li>         
              <li><a href="<?php echo wp_logout_url( home_url() ); ?>">logout</a></li>
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
