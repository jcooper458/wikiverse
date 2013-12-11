<?php

//
// Actions and Filters
//

/**
 * Add Better excerpts to posts
 */
function infinity_premium_excerpt_more( $more )
{
	global $post;

	return '<a class="moretag" href="'. get_permalink($post->ID) . '">&rarr;</a>';
}
add_filter( 'excerpt_more', 'infinity_premium_excerpt_more' );

//
// Meta Boxes
//

/**
 * Load custom metaboxes library
 */
function infinity_premium_cmb_load()
{
	if ( !class_exists( 'cmb_Meta_Box' ) ) {
		require_once( 'cmb/init.php' );
	}
}

//
// Helpers
//

if ( false === function_exists( 'the_post_name' ) ) {
	/**
	* Echo the post name (slug)
	*/
	function the_post_name()
	{
		// use global post
		global $post;
		
		// post_name property is the slug
		echo $post->post_name;
	}
}
?>