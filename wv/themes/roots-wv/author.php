
<div id="packery">

	<?php 

	global $current_user;
	global $post; 
	get_currentuserinfo();

	if ( have_posts() ) : while ( have_posts() ) : the_post(); 

	$the_title = get_the_title();
	$the_permalink = get_the_permalink();

	?>
	<div class="brick">

		<?php echo '<a href="'. $the_permalink . '">' . $the_title . '</a>'; ?>
		<?php if ($post->post_author == $current_user->ID) { ?><p><a onclick="return confirm('Are you SURE you want to delete this Wish?')" href="<?php echo get_delete_post_link( $post->ID ) ?>">Delete post</a></p><?php } ?>
		<?php 
		echo '</div>';

		wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));


		?>
	<?php endwhile; else: ?>

	<p><?php _e($current_user->user_login . ' has no boards yet.'); ?></p>

<?php endif; ?>
</div>