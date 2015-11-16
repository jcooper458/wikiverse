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

  <nav id="rightSidebar" class="cbp-spmenu wv_sidebar cbp-spmenu-verticalRight cbp-spmenu-right fixed">
   
    <div id="" class="fixed">      
      <i id="closeRightSidebar" class="fa fa-close"></i>
      <i id="openRightSidebar" class="fa fa-code-fork"></i> 
    </div>
    <div id="mindmap"></div>
  </nav>

  <nav id="sidebar" class="cbp-spmenu wv_sidebar cbp-spmenu-vertical cbp-spmenu-left fixed">
   
    <div id="searchMeta" class="fixed">      

      <i id="closeSidebar" class="fa fa-close"></i>
      <i id="openSidebar" class="fa fa-plus"></i>
      <h3 id="search-keyword" class=""></h3> 
      <div class="search-ui">
        <ul class="nav nav-pills">
          <li class="">
            <button class="btn btn-xs btn-primary searchButton cursor">search for something else</button>
            <select class="selectpicker pull-left otherSource show-menu-arrow" data-style="btn btn-default btn-xs" data-width="50%" data-size="20">
              <option selected="">try another source..</option>
              <option><i class="fa fa-youtube-square youtube-icon icon"></i>Youtube</option>
              <option><i class="fa fa-wikipedia wikipedia-icon icon"></i>Wikipedia</option>
              <option><i class="fa fa-twitter twitter-icon icon"></i>Twitter</option>
              <option><i class="fa fa-flickr flickr-icon icon"></i>Flickr</option>
              <option><i class="fa fa-instagram instagram-icon icon"></i></div>Instagram</option>
              <option><i class="fa fa-soundcloud soundcloud-icon icon"></i>Soundcloud</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
    <div class="results autoOverflow"></div>
  </nav>

  <nav id="wv_nav" class="navbar navbar-default navbar-transparent navbar-fixed-top">
    <div class="container-fluid">
      
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a> <span id="beta">beta</span>
      </div>         

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">     

        <ul class="nav navbar-nav">    
        <li>&nbsp;&nbsp;&nbsp;&nbsp;</li> 
        <?php if ( is_singular("board") && ( $current_user->ID == $post->post_author ) || ( is_page('start'))) { ?>    

        <li><a class="searchButton" href="#">add content</a></li>              
        <!--<li><a id="addNoteButton"  href="#"><i class="fa fa-sticky-note-o"></i>&nbsp;&nbsp;add a note</a></li>  -->           
        <li><a id="addMap"  href="#">add a map</a></li>              

        <?php }  ?>
      </ul>

      <ul class="nav navbar-nav navbar-right">

        <?php if ( is_user_logged_in() ) { 
           ?>   

          <?php if ( is_page('start') ) { ?>
          <li><a href="#" class="board-pilot invisible" id="clearBoard">clear board</a></li> 
          <li><a href="#" class="board-pilot invisible" id="createBoard" >save board</a></li>
          <?php }  ?>
          <?php if ( is_singular("board")) { ?>            
          <?php if ( $current_user->ID != $post->post_author ) { // if is author ?>
          <li><a href="#" class="board-pilot invisible" id="forkBoard">fork board</a></li> 
          <?php } else{ // if is not author?>
          <li><a href="#" class="board-pilot" id="saveBoard" >save changes</a></li>
          <li><a href="#" class="board-pilot invisible" id="clearBoard">clear board</a></li> 
          <?php }  ?>

          <?php }  ?>

          <?php } else {?> 
          
          <?php }  ?>   
          <?php if ( is_user_logged_in() ) { ?>

          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo esc_html($current_user->display_name); ?> <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="/start">create board</a></li>
              <li><a href="/user/<?php echo esc_html($current_user->user_login); ?>">my boards</a></li>
              <li role="separator" class="divider"></li>         
              <li><a href="<?php echo wp_logout_url( home_url() ); ?>">logout</a></li>
            </ul>
          </li>
          <?php } else { ?>
          <li><a href="/login">login</a></li>
          <li><a href="/login">sign up</a></li>
          <?php } ?> 
        </ul>

      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>

</header>
