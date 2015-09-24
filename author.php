<?php 
$curauth = (isset($_GET['author_name'])) ? get_user_by('slug', $author_name) : get_userdata(intval($author));
?>



<div id="packerySite" class="packerySite">

	<?php 
	$fotoURL = "";

	if ( have_posts() ) : while ( have_posts() ) : the_post(); 
	?>
	
	<div id="" class="text-center"><h1><?php echo $curauth->data->user_login; ?>'s boards</h1></div>
	
	<?php
	$the_title = get_the_title();
	$the_permalink = get_the_permalink();
	$the_content = get_the_content();
	$the_content_Array = json_decode($the_content);

	/*foreach ($the_content_Array->bricks as $value) {

	}*/


	?>
	<div class="brick well well-sm visible">
		<?php if ($post->post_author == $current_user->ID) { ?><span class="cross control-buttons"><a onclick="return confirm('Are you SURE you want to delete this board?')" href="<?php echo get_delete_post_link( $post->ID ) ?>"><i class="fa fa-close"></i></a></span><?php } ?>
		<?php if(isset($the_content_Array->featured_image)){ echo '<a href="'. $the_permalink . '"><img src="' . $the_content_Array->featured_image . '"></a>'; }?>
		<?php echo '<a href="'. $the_permalink . '"><h3>' . $the_title . '</h3></a>'; ?>	

		<?php 
		echo '</div>';

		wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));

		?>
	<?php endwhile; else: ?>

	<p><?php _e($curauth->data->user_login . ' has no boards yet.'); ?></p>

<?php endif; ?>
</div>

<script type="text/javascript">



</script>