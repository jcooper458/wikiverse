<?php
/**
 * single template
 *
 * @author Bowe Frankema <bowe@presscrew.com>
 * @link http://shop.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Bowe Frankema
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @since 1.0
 */

	infinity_get_header();
	if ( have_posts()): while ( have_posts() ): the_post(); do_action( 'open_loop' );
?>
<div id="content" role="main" class="<?php do_action( 'content_class' ); ?>">
	<?php
		do_action( 'open_content' );
		do_action( 'open_single' );
	?>
	<div class="post">
			<!-- the post -->
			<div <?php post_class(); ?> id="post-<?php the_ID(); ?>">
				<div class="post-content">
					<h1 class="post-title">
						<?php the_title(); ?>
						<?php edit_post_link(' ✍','',' ');?>
					</h1>	
					<?php
						do_action( 'open_loop_single' );
					?>	
					<!-- show the post thumb? -->
					<?php
						infinity_get_template_part( 'templates/parts/post-thumbnail');	
					?>	
					<?php
						do_action( 'before_single_entry' )
					?>
					<div class="entry">
						<?php
							do_action( 'open_single_entry' );
							the_content( __( 'Read the rest of this entry &rarr;', 'infinity' ) );
							wp_link_pages( array( 'before' => '<div class="page-link">' . __( '<span>Pages:</span>', 'infinity' ), 'after' => '</div>' ) ); 
						?>
						
						<!-- More Features -->
						<div id="feature-box" class="author-box">
							<h3>Learn more about our Community <span>or just</span>
							<?php if ( infinity_option_get( 'berlin-flex-slider-button' ) == 1 ): ?>
							<a id="callout-button" title="<?php echo infinity_option_get( 'berlin-flex-slider-button-text' ); ?>"
						<?php if ( function_exists('bp_signup_slug')  ) : ?> 
						href="<?php echo site_url(); ?>/<?php bp_signup_slug(); ?>">
						<?php else: ?>
						href="	<?php echo wp_login_url(); ?>?action=register">
						<?php endif; ?>
						<span><?php echo infinity_option_get( 'berlin-flex-slider-button-text' ); ?> &rarr; </span></a>
						<?php endif; ?>
							</h3>
						</div>
						
						<?php
						// The Query
						query_posts( array( 'post_type' => 'features', 'showposts' => 10 ) );?>
						<?php
		  					infinity_get_template_part( 'templates/loops/loop', 'feature-grid-12' ); 
						?>
						<?php   
						// Reset Query
						wp_reset_query();
						?>							
					</div>
				</div>
			</div>
			<?php
			endwhile;
		else: ?>
			<h1>
				<?php _e( 'Sorry, no posts matched your criteria.', 'infinity' ) ?>
			</h1>
	<?php
		endif;
	?>			
		
	</div>
</div>
<?php	
	infinity_get_sidebar ();
	infinity_get_footer();
?>
