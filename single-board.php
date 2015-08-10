<div id="packery"></div>

<?php 
$boardArray = [];
array_push($boardArray, $post->post_content);
 ?>

<div id="wikiverseJSON" class="invisible"><?php echo json_encode($boardArray);  ?></div>
<div id="postID" class="invisible"><?php echo $post->ID; ?></div>

<?php get_template_part('templates/searchboxes'); ?>