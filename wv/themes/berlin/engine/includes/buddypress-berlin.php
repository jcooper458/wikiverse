<?php

/**
 * Change Default Avatar Sizes
 */
if ( !defined( 'BP_AVATAR_THUMB_WIDTH' ) )
	define( 'BP_AVATAR_THUMB_WIDTH', 80 );

if ( !defined( 'BP_AVATAR_THUMB_HEIGHT' ) )
	define( 'BP_AVATAR_THUMB_HEIGHT', 80 );

if ( !defined( 'BP_AVATAR_FULL_WIDTH' ) )
	define( 'BP_AVATAR_FULL_WIDTH', 300 );

if ( !defined( 'BP_AVATAR_FULL_HEIGHT' ) )
	define( 'BP_AVATAR_FULL_HEIGHT', 300 );


/**
 * Custom menu
 */
function berlin_buddypress_custom_menu()
{
	return infinity_register_bp_menu( 'Berlin Menu' );
}
add_action( 'infinity_dashboard_activated', 'berlin_buddypress_custom_menu' );

// is members component enabled?
if ( function_exists( 'bp_is_member' ) )
{
	/**
	 * Add Group Navigation Items to Group Pages
	 *
	 * @package Infinity
	 * @subpackage base
	 */
	function berlin_buddypress_group_navigation()
	{
		if ( bp_is_group() ) :
			infinity_get_template_part( 'templates/parts/group-navigation' );
		endif;
	}
	add_action( 'open_sidebar', 'berlin_buddypress_group_navigation' );

	/**
	 * Add Profile Navigation to Member Pages
	 *
	 * @package Infinity
	 * @subpackage base
	 */
	function berlin_profile_navigation()
	{
		if ( bp_is_user() ) :
			infinity_get_template_part( 'templates/parts/profile-navigation' );
		endif;
	}
	add_action( 'open_sidebar', 'berlin_profile_navigation' );

	/**
	 * Add User Navigation to Menu based on theme option
	 *
	 * @package Infinity
	 * @subpackage base
	 */
	function berlin_buddypress_member_navigation()
	{
			infinity_get_template_part( 'templates/parts/buddypress-member-navigation' );
	}
	add_action('close_main_menu','berlin_buddypress_member_navigation');

	/**
	 * Inject member grid
	 */
	function berlin_buddypress_member_grid() {
		if (
			is_page_template( 'homepage-grid-template.php' ) &&
			current_theme_supports( 'infinity-bp-grid-members' )
		) {
			// render feature
			infinity_feature( 'infinity-bp-grid-members' );
		}
	}
	add_action( 'open_container', 'berlin_buddypress_member_grid' );
}

?>