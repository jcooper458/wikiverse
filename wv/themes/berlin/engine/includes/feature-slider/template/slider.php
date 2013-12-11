<?php
/**
 * Template Name: Features or Category Slider
 *
 * This template either displays Slides taken from the "Features" custom post type.
 * Or Loops through posts from a certain category. This is based on the theme options set by 
 * the user.
 *
 * @author Bowe Frankema <bowe@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Bowe Frankema
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package Infinity
 * @since 1.0
 */
?>
<?php
// Show slides from the Features custom post type by default
if ( infinity_option_get( 'berlin-flex-slider' ) == 1 ): 
?>
	<div class="flex-container">
		<div class="flexslider">
		  	<ul class="slides">
		<?php
			$captions = array();
			$tmp = $wp_query;
			$wp_query = new WP_Query('post_type=features&order=ASC&posts_per_page=8');
			if($wp_query->have_posts()) :
			while($wp_query->have_posts()) :
			$wp_query->the_post();
			$captions[] = ''.get_the_excerpt().'';
		?>		
			<!-- Loop through slides  -->
			<!-- Image -->
			<?php if(has_post_thumbnail()) :?>
			<li>
					<a href="<?php the_permalink(); ?>">
						<?php the_post_thumbnail( array( 'width' => 1500, 'height' => 300, 'crop' => true ) ) ?>
					</a>
					<?php if ( infinity_option_get( 'berlin-flex-caption' ) == 1 ): ?>
					<!-- Caption -->	
					<div class="flex-caption">
					<h3><?php the_title_attribute();?></h3>
					</div>
					<?php endif;?>
					
			</li>
			<?php else :?>
			<li>
					<img src="<?php echo get_stylesheet_directory_uri()?>/assets/images/no-slides.jpg"/>
			</li>
			<?php endif;?>
			</li>	
		<?php endwhile; else: ?>
			<!-- Fallback to default slide if no features are present -->
		    <li>
		     	<img src="<?php echo get_stylesheet_directory_uri()?>/assets/images/no-slides.jpg"/>
		    </li>     
		<?php
			endif;
			// reset query
			$wp_query = $tmp;
			?>	
			</ul>	
		</div>
	</div>	
<?php endif; // end custom post type slider ?>


<?php if ( infinity_option_get( 'berlin-flex-slider' ) == 2 ): ?>
	<div class="flex-container">
		<div class="flexslider">
		  	<ul class="slides">
		<?php
			$cat = infinity_option_get( 'berlin-flex-slider-category' );
			$quantity = infinity_option_get( 'berlin-flex-slider-amount' );
			$captions = array();
			$tmp = $wp_query;
			$wp_query = new WP_Query('cat='.$cat.'&order=ASC&posts_per_page='.$quantity.'');
			if($wp_query->have_posts()) :
			while($wp_query->have_posts()) :
			$wp_query->the_post();
			$captions[] = '<h3>'.get_the_title($post->ID).'</h3><p>'.get_the_excerpt().'</p>';
			$image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'slider-full');
		?>		
			<!-- Loop through slides  -->
			<!-- Image -->
			<?php if(has_post_thumbnail()) :?>
			<li>
					<a href="<?php the_permalink(); ?>">
						<?php the_post_thumbnail( array( 'width' => 1500, 'height' => 300, 'crop' => true ) ) ?>
					</a>
					<?php if ( infinity_option_get( 'berlin-flex-caption' ) == 1 ): ?>
					<!-- Caption -->	
					<div class="flex-caption">
					<h3><?php the_title_attribute();?></h3>
					</div>
					<?php endif;?>
					
			</li>
			<?php else :?>
			<li>
					<img src="<?php echo get_stylesheet_directory_uri()?>/assets/images/no-slides.jpg"/>
			</li>
			<?php endif;?>
			</li>	
		<?php endwhile; else: ?>
			<!-- Fallback to default slide if no features are present -->
		    <li>
		     	<img src="<?php echo get_stylesheet_directory_uri()?>/assets/images/no-slides.jpg"/>
		    </li>     
		<?php
			endif;
			// reset query
			$wp_query = $tmp;
			?>	
			</ul>	
		</div>
	</div>	
<?php endif; // end custom post type slider ?>
<?php
	// is slider title set?
	if ( infinity_option_get( 'berlin-flex-slider-title' ) ):
		// show homepage intro text if set ?>
		<div class="callout-box">
			<?php
				if ( infinity_option_get( 'berlin-flex-slider-button' ) == 1 ):
					$text = infinity_option_get( 'berlin-flex-slider-button-text' );
					$href = ( function_exists( 'bp_signup_slug' ) ) ? bp_get_signup_slug() : wp_login_url() . '?action=register';
			?>
			<h2><?php echo infinity_option_get( 'berlin-flex-slider-title' ); ?> <a id="callout-button" title="<?php echo $text; ?>" href="<?php echo $href; ?>"><span><?php echo $text; ?> &rarr; </span></a></h2>
			<?php
				endif;
			?>
		</div>
<?php
	endif;
?>
