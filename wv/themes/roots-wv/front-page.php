
<?php 
$args = array( 'post_type'=> 'board', 'category_name' => 'home' );

$homePosts = get_posts( $args ) 
?>

<div id="wikiverse">

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

<div id="packery" class="packery">
	<!--<div class="brick wi4 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick w4i4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>


    
    <div class="brick wiHi hi4 visible white no-box-shadow">
    	<div class="gigante">wikiverse</div>
	  	<h3>is a powerful content aggregator</h3>
	  	<h5>that lets you create stunning infoboards in seconds, with data from wikipedia, flickr, youtube and many other sources </h5>
    </div>

	<div class="brick wi4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi2 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>	
	<div class="brick wi2 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi2 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi2 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi4 transparent-2 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi2"></div>
	<div class="brick wi4 hi2 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
	<div class="brick wi4 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi42 hi3 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi4 hi2 transparent-2 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi3"></div>
    <div class="brick wi2 hi4 transparent-3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi4 transparent-2 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi1"></div>
    <div class="brick wi2 hi3 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi2 transparent-1 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi2"></div>
    <div class="brick wi4 hi4"></div>
    <div class="brick wi4 hi3"></div>
  	<div class="brick wi4 hi4 transparent-2 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi4 hi3 transparent-3">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi1 transparent-3">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi4 hi4 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi3 hi3 transparent-8">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi1 transparent-3">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi4 hi4 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi3 hi3 transparent-8">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
    <div class="brick wi2 hi1 transparent-3">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi4 hi4 ignore-shuffle">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>
  	<div class="brick wi3 hi3 transparent-8">	<span class="handle"> <i class="fa fa-arrows"></i></span></div>-->
</div>
	
