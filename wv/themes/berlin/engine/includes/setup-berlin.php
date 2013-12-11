<?php

// buddypress
require_once 'buddypress-berlin.php';

// sidebars
require_once 'sidebars-berlin.php';

// add WP Thumb for dynamic thumbnails across the theme.
if( !class_exists( 'WP_Thumb' ) ){
	require_once( 'WPThumb/wpthumb.php' );
}

// slider
if ( is_main_site() )
{
	/**
	 * Init custom metaboxes
	 */
	function berlin_cmb_init()
	{
		infinity_premium_cmb_load();
	}
	add_action( 'init', 'berlin_cmb_init', 9999 );

	// load slider setup
	require_once( 'feature-slider/setup.php' );
	require_once( 'feature-slider/features-widget.php' );
}

//
// Helpers
//

/**
 * Returns true if color preset is red
 *
 * @return boolean
 */
function berlin_color_red()
{
	return ( infinity_option_get( 'berlin-color-preset' ) == 'red' ) ;
}

/**
 * Returns true if color preset is blue
 *
 * @return boolean
 */
function berlin_color_blue()
{
	return ( infinity_option_get( 'berlin-color-preset' ) == 'blue' );
}

/**
 * Returns true if color preset is purple
 *
 * @return boolean
 */
function berlin_color_purple()
{
	return ( infinity_option_get( 'berlin-color-preset' ) == 'purple' );
}

/**
 * Returns true if color preset is green
 *
 * @return boolean
 */
function berlin_color_green()
{
	return ( infinity_option_get( 'berlin-color-preset' ) == 'green' );
}

/**
 * Returns true if color preset is teal
 *
 * @return boolean
 */
function berlin_color_teal()
{
	return ( infinity_option_get( 'berlin-color-preset' ) == 'teal' );
}


//
// Actions
//

/**
 * Add color button classes to buttons depending on preset style/option
 */
function berlin_buttons()
{
	// get button color option
	$berlin_button_color = infinity_option_get( 'berlin-button-color' );

	// render script tag ?>
	<script type="text/javascript">
		jQuery(document).ready(function() {
			jQuery('.bp-primary-action,div.group-button').addClass('button white');
			jQuery('.generic-button .acomment-reply,div.not_friends').addClass('button white');
			jQuery('.bp-secondary-action, .view-post,.comment-reply-link').addClass('button white');
			jQuery('.standard-form .button,.not_friends,.group-button,.dir-form .button,.not-following,#item-buttons .group-button,.joyride-next-tip').addClass('<?php echo $berlin_button_color ?>');
			jQuery('input[type="submit"],.submit,#item-buttons .generic-button,#aw-whats-new-submit,input#submit').addClass('button <?php echo $berlin_button_color ?>');
			jQuery('div.pending,.dir-list .group-button,.dir-list .friendship-button').removeClass('<?php echo $berlin_button_color ?>');
			jQuery('#previous-next,#upload, div.submit,div,reply,#groups_search_submit').removeClass('<?php echo $berlin_button_color ?> button');
			jQuery('div.pending,.dir-list .group-button,.dir-list .friendship-button').addClass('white');
			jQuery('#upload').addClass('button green');
		});
	</script><?php
}
add_action( 'close_body', 'berlin_buttons' );

/**
 * Add quick link to WP Admin Bar to Balance Control Panel
 */
function berlin_admin_bar_link()
{
	global $wp_admin_bar;

	// only show to super admin
	if ( current_user_can( 'edit_theme_options' ) && is_admin_bar_showing() ) {
		// add the menu item
		$wp_admin_bar->add_menu( array(
			'id' => 'berlin_link',
			'parent' => 'dashboard',
			'title' => 'Berlin',
			'href' => admin_url( 'admin.php?page=infinity-theme&route=cpanel/options' )
		) );
	}
}
add_action( 'admin_bar_menu', 'berlin_admin_bar_link' );

/**
 * Update nag
 */
function berlin_update_nag()
{
	// call update nag helper
	infinity_dashboard_update_nag(array(
		'package_file' => 'http://library.presscrew.com/packages.xml'
	));
}
add_action( 'admin_notices', 'berlin_update_nag' );

/**
 * Compiler configuration callback, DO NOT TOUCH
 */
function infinity_compiler_config()
{
	return array(
		'output' => 'berlin',
		'refs' => array(
			'infinity' => 'buddypress',
			'infinity-premium' => 'master',
			'infinity-berlin' => 'master'
	));
}

?>