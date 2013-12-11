<?php

/**
 * Inject slider template
 */
function berlin_slider_insert()
{
	// load template for the slider
	if ( is_page_template( 'homepage-slider-template.php' ) ): ?>
		<div id="homepage-slider">
			<?php
				infinity_get_template_part( 'engine/includes/feature-slider/template/slider' );
			?>
		</div><?php
	endif;
}
add_action( 'open_container', 'berlin_slider_insert' );

/**
 * Register custom "Features" post type
 *
 * @package Infinity
 * @subpackage berlin
 */
function berlin_features_setup()
{
	$labels = array(
		'name' => _x('Site Features', 'post type general name', 'infinity'),
		'singular_name' => _x('Site Features', 'post type singular name', 'infinity'),
		'add_new' => _x('Add Feature', 'infobox', 'infinity'),
		'add_new_item' => __('Add New Feature', 'infinity'),
		'edit_item' => __('Edit Feature', 'infinity'),
		'new_item' => __('New Feature', 'infinity'),
		'view_item' => __('View Feature', 'infinity'),
		'search_items' => __('Search Feature', 'infinity'),
		'not_found' =>  __('No Features fount', 'infinity'),
		'not_found_in_trash' => __('No Features are found in Trash', 'infinity'),
		'parent_item_colon' => ''
	);

	$args = array(
		'labels' => $labels,
		'public' => true,
		'publicly_queryable' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => true,
		'capability_type' => 'post',
		'hierarchical' => false,
		'menu_position' => null,
		'menu_icon' => get_stylesheet_directory_uri() . '/base/feature-slider/assets/images/slides-icon.png',
		'supports' => array('title','excerpt','editor', 'thumbnail' )
	);

	register_post_type( 'features', $args );
}
add_action( 'init', 'berlin_features_setup' );

/**
 * Add Meta Boxes for Features, Posts and Pages.
 * Uses: https://github.com/jaredatch/Custom-Metaboxes-and-Fields-for-WordPress
 */
function berlin_features_meta_box( $meta_boxes )
{
	// Prefix for all fields
	$prefix = '_berlin_';
	
	$meta_boxes[] = array(
		'id' => 'test_metabox',
		'title' => 'Embed Video',
		'pages' => array('post', 'features','page'), // post type
		'context' => 'normal',
		'priority' => 'high',
		'show_names' => true, // Show field names on the left
		'fields' => array(
			array(
				'name' => 'Video Provider',
				'desc' => 'Where is the video hosted?',
				'id' => $prefix . 'video_provider',
				'type' => 'radio_inline',
				'options' => array(
					array('name' => 'YouTube', 'value' => 'youtube'),
					array('name' => 'Vimeo', 'value' => 'vimeo'),
					)
			),
			array(
				'name' => 'Video ID',
				'desc' => 'Input the video code. This is a numeral code coming straight <strong>after the embed/share URL</strong>. For example: 6893861',
				'id' => $prefix . 'video_url',
				'type' => 'text'
			),
		),
	);

	return $meta_boxes;
}
add_filter( 'cmb_meta_boxes', 'berlin_features_meta_box' );

/**
 * Enqueues Slider JS at the bottom of the homepage
 *
 * @package Infinity
 * @subpackage berlin
 */
function berlin_flex_slider_script()
{
	// must be homepage slider template
	if ( is_page_template( 'homepage-slider-template.php' ) ) {
		// render script block ?>
		<script type="text/javascript">
			jQuery(document).ready(function($){
				$('.flexslider').flexslider({
					animation: 'slide'
				});
			});
		</script><?php
	}
}
add_action('close_body','berlin_flex_slider_script');

?>
