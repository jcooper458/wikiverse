<?php
/**
 * Display Features in a nice Grid
 */
?>
<ul class="block-grid mobile" id="items">
<?php if ( have_posts()): while ( have_posts() ):the_post();?>
			<!-- the post -->
		<li class="featured-item eight">
			<div <?php post_class(); ?> id="post-<?php the_ID(); ?>">
				<div class="feature-item">
					<h4 class="post-title">
					<a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a>	
						<?php edit_post_link(' ✍','',' ');?>
					</h4>			
					<!-- show the post thumb? -->
					<div class="post-thumb-small feature-image">
						<a href="<?php the_permalink() ?>" rel="bookmark" title="<?php _e( 'Permanent Link to', 'infinity' ) ?> <?php the_title_attribute(); ?>"><?php the_post_thumbnail( array( 'width' => 380, 'height' => 150, 'crop' => true ) ) ?></a>
					</div>							
					<div class="entry">
						<?php
							do_action( 'open_single_entry' );
							the_excerpt( __( 'Read the rest of this entry &rarr;', 'infinity' ) );
						?>
					</div>
				</div>
			</div>
		</li>
<?php endwhile; else: ?>
<?php endif;?>
</ul>