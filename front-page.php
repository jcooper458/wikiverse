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


<!--<div id="video" class="">
  <video loop muted autoplay poster="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.png" class="">
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.mp4" type="video/mp4"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.ogv" type="video/ogg"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.webm" type="video/webm"/>
     No Video supported. 
  </video>
</div>-->

<!--<div id="homeBoard1" class="packery"></div>-->
	
<!--<div class="container buffer-bottom" role="document">
  <h1>Enjoy serendipity</h1>
  <h3>Start with one keyword. Get the craziest connections.</h5>
</div>	-->

<div class="container buffer-bottom" role="document">
  <h1><a href="/login">Sign up</a>  or <a href="/start">try it out</a> and start building your own boards!</h1>
  <h3>Enjoy serendipity by creating some crazy connections.</h3>
  <h3>Or gather thought-out topics into one handpicked selection.</h3>
</div>

<div class="container buffer-bottom" role="document">
</div>


<?php 
$fotoURL = "";

$query = new WP_Query( array( 'post_type' => 'board', 'cat' => '3' ) );

?>
<div class="container buffer-bottom" role="document">
<h1>Featured boards</h1>

<div id="packerySite" class="packerySite buffer-top">

<?php 
if ( $query->have_posts() ) : while ( $query->have_posts() ) : $query->the_post(); 


  $the_title = get_the_title();
  $the_permalink = get_the_permalink();
  $the_content = get_the_content();
  $the_content_Array = json_decode($the_content);

?>
  <div class="brick well well-sm visible">

    <?php if(isset($the_content_Array->featured_image)){ echo '<a href="'. $the_permalink . '"><img src="' . $the_content_Array->featured_image . '"></a>'; }?>
    <?php echo '<a href="'. $the_permalink . '"><h3>' . $the_title . '</h3></a>'; ?>  

    <?php 
  echo '</div>';

  wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));

  ?>
<?php endwhile; endif; ?>


</div>
</div>