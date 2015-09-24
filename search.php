<?php get_search_form(); ?>

<?php get_template_part('templates/page', 'header'); ?>


<?php if (!have_posts()) : ?>
  <div class="alert alert-warning">
    <?php _e('Sorry, no results were found.', 'sage'); ?>
  </div>
  <?php get_search_form(); ?>
<?php endif; ?>



<div id="packerySite" class="packerySite">

	<?php while (have_posts()) : the_post();

		$the_title = get_the_title();
		$the_permalink = get_the_permalink();
		$the_content = get_the_content();
		$the_content_Array = json_decode($the_content);

	 ?>
	  	<div class="brick well well-sm visible">

			<?php if(isset($the_content_Array->featured_image)){ echo '<a href="'. $the_permalink . '"><img src="' . $the_content_Array->featured_image . '"></a>'; }?>
			<?php echo '<a href="'. $the_permalink . '"><h3>' . $the_title . '</h3></a>'; ?>	

		</div>

	<?php endwhile; ?>

</div>

<?php the_posts_navigation(); ?>
