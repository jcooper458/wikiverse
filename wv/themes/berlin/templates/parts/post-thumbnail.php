<?php 
/**
 * Infinity Theme: Post Thumbnail
 *
 * The Post Thumbnail Template part
 * 
 * @author Bowe Frankema <bowe@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Bowe Frankema
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package Infinity
 * @subpackage templates
 * @since 1.0
 */
?>
<?php  /* video added? */ if ( get_post_meta( $post->ID, '_berlin_video_url', true) && get_post_meta( $post->ID, '_berlin_video_provider',true) == "vimeo"   ) : ?>
	<div class="postthumb">    
		<iframe src="http://player.vimeo.com/video/<?php echo get_post_meta($post->ID, '_berlin_video_url', true) ?>?title=0&amp;byline=0&amp;portrait=0" width="400" height="225" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
	</div> 
		
	<?php elseif ( get_post_meta( $post->ID, '_berlin_video_url', true) && get_post_meta( $post->ID, '_berlin_video_provider',true) == "youtube" ) : ?>
	<iframe width="400" height="225" src="http://www.youtube.com/embed/<?php echo get_post_meta($post->ID, '_berlin_video_url', true) ?>?hd=1" frameborder="0" allowfullscreen> </iframe>
	<?php else: ?>	
	
	<?php /* if not load post thumb */ if (has_post_thumbnail()):?>	
	<figure class="postthumb">
		<a href="<?php the_permalink() ?>" rel="bookmark" title="<?php _e( 'Permanent Link to', infinity_text_domain ) ?> <?php the_title_attribute(); ?>"><?php the_post_thumbnail( array( 'width' => 870, 'height' => 240,  'crop' => true ,'retina' => true ) ) ?></a>
	</figure>
	<?php endif;?>
<?php endif; ?>		