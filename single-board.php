<div class="text-center"><h1><?php the_title(); ?></h1></div>

<div id="packery" class="packery"></div>

<div id="JSONboard" class="invisible"><?php echo json_decode($post->post_content); ?></div>
<div id="postID" class="invisible"><?php echo $post->ID; ?></div>

<?php get_template_part('templates/searchboxes'); ?>