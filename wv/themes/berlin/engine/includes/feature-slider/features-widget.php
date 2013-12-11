<?php
/**
 * Create a nice and simple BuddyPress Navigation Widget
 *
 * @author Bowe Frankema <bowe@presscrew.com>
 * @link http://shop.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Bowe Frankema
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 */ 
class BerlinFeaturedWidget extends WP_Widget {
 
    function BerlinFeaturedWidget() {
          $widget_ops = array( 'classname' => 'berlin_featured_profile_widget', 'description' => __( "Displays the Site Features you have added in a nice grid. Its best to place this widget on your homepage in the Center Homepage Widget, but you can also put it in a sidebar if you wish." ) );
          $this->WP_Widget('BerlinFeaturedWidget', __('Homepage Site Features'), $widget_ops);
    }
 
    function widget($args, $instance) {
          extract($args);
?>
<!-- html -->
     <div class="home-member-box widget">        				
			<?php
				// The Query
				query_posts( array( 'post_type' => 'features', 'showposts' => 6 ) );?>
			<?php
			   //Call a pre-made Infinity Loop
			  infinity_get_template_part( 'templates/loops/loop', 'feature-grid-8' ); 
			?>
			<?php   
				// Reset Query
				wp_reset_query();
			?>       
	    </div>
<!-- end -->                
<?php
    }
 
 
    function update($new_instance, $old_instance) {
            return $new_instance;
    }
 
}
add_action('widgets_init', create_function('', 'return register_widget("BerlinFeaturedWidget");'));
?>