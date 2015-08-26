
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
  <h1>is a powerful content aggregator</h1>
  <h3>create stunning infoboards with data from wikipedia, flickr, youtube and many other sources </h5>
</div>


<div id="homeBoard1" class="packery"></div>
	
<div class="container buffer-bottom" role="document">
  <div class="gigante">wikiverse</div>
  <h1>some more text here</h1>
  <h3>some more sources here soon </h5>
</div>


<div id="homeBoard2" class="packery"></div>
	
<div class="container buffer-bottom" role="document">
  <div class="gigante">enjoy serendipity</div>
  <h1>start with a topic, get lost</h1>
  <h3>create stunning infoboards with data from wikipedia, flickr, youtube and many other sources </h5>
</div>

<div id="homeBoard3" class="packery"></div>
	
<div class="container buffer-bottom" role="document">
  <div class="gigante">wikiverse</div>
  <h1>is a powerful content aggregator</h1>
  <h3>even more sources here soon  </h5>
</div>

