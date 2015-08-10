
<?php 
$args = array( 'post_type'=> 'board', 'category_name' => 'home' );

$homePosts = get_posts( $args ) 
?>

<div id="wikiverseJSON" class="invisible">

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


<div id="packery" class="packery"></div>
	
