<?php 
$args = array( 'post_type'=> 'board', 'category_name' => 'home' );

$homePosts = get_posts( $args ) 
?>

<div id="JSONboardArray" class="invisible">

	<?php 
		$boardArray = [];
		foreach ( $homePosts as $post ) :  
			setup_postdata( $post ); 				
			array_push($boardArray, $post->post_content);				
		endforeach;
		echo json_encode($boardArray);
		wp_reset_postdata();
	?>

</div>



<div class="container buffer-bottom" role="document">
  <div class="gigante">wikiverse</div>
  <h1>is a powerful content aggregator.</h1>
  <h3>Create stunning infoboards with data from wikipedia, flickr, youtube and many other sources. </h5>
</div>


<div id="video" class="">
  <video loop muted autoplay poster="img/videoframe.jpg" class="">
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.mp4" type="video/mp4"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.ogv" type="video/ogg"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.webm" type="video/webm"/>
     No Video supported. 
  </video>
</div>

<!--<div id="homeBoard1" class="packery"></div>-->
	
<!--<div class="container buffer-bottom" role="document">
  <h1>Enjoy serendipity</h1>
  <h3>Start with one keyword. Get the craziest connections.</h5>
</div>	-->

<div class="container buffer-bottom" role="document">
  <h1><a href="/login">Sign up</a>  or <a href="/start">try it out</a> and start building your own boards!</h1>
  <h3>Enjoy serendipity and create some crazy connections.</h3>
  <h3>Or gather well-thought-out topics into one handpicked infoboard.</h3>
</div>

<div class="container buffer-bottom" role="document">
</div>






