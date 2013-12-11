<?php
/**
 * Infinity Premium Theme: BuddyPress includes
 */

// abort if bp not active
if ( false == function_exists( 'bp_is_member' ) ) {
	// return to calling script
	return;
}

//
// Actions
//

/**
 * Initialize vert nav setup
 */
function infinity_premium_bp_vertnav_setup()
{
	// maybe call helper function
	if ( current_theme_supports( 'infinity-bp-vertnav' ) ) {
		infinity_bp_nav_inject_options_setup();
	}
}
add_action( 'bp_setup_nav', 'infinity_premium_bp_vertnav_setup', 999 );

/**
 * Add profile vertical navigation items to member pages
 */
function infinity_premium_bp_profile_nav_vert()
{
	if ( current_theme_supports( 'infinity-bp-vertnav' ) && bp_is_user() ) {
		infinity_get_template_part( 'templates/parts/profile-navigation-vert' );
	}
}
add_action( 'open_sidebar', 'infinity_premium_bp_profile_nav_vert', 11 );

/**
 * Add group vertical navigation items to group pages
 */
function infinity_premium_bp_group_nav_vert()
{
	if ( current_theme_supports( 'infinity-bp-vertnav' ) && bp_is_group() ) {
		infinity_get_template_part( 'templates/parts/group-navigation-vert' );
	}
}
add_action( 'open_sidebar', 'infinity_premium_bp_group_nav_vert', 11 );

/**
 * Add vertical activity tabs on the stream directory
 */
function infinity_premium_bp_activity_tabs_vert()
{
	if ( current_theme_supports( 'infinity-bp-vertnav' ) && bp_is_activity_component() && bp_is_directory() ) {
		infinity_get_template_part( 'templates/parts/activity-tabs-vert' );
	}
}
add_action( 'open_sidebar', 'infinity_premium_bp_activity_tabs_vert', 11 );
add_action( 'template_notices', 'infinity_premium_bp_activity_tabs_vert', 11 );

/**
 * Render tour feature markup
 */
function infinity_premium_bp_tour()
{
	if ( is_activity_page() && is_user_logged_in() ) {
		infinity_feature( 'infinity-bp-tour' );
	}
}
add_action( 'close_body', 'infinity_premium_bp_tour' );

//
// Helpers
//

if ( false === function_exists( 'is_activity_page' ) ) {
	/**
	* Returns true if current page is the main activity page
	*/
	function is_activity_page() {
		return ( bp_is_activity_component() && !bp_is_user() );
	}
}

?>