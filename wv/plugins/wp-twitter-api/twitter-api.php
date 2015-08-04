<?php
/* 
Plugin Name: twitter api client
Plugin URI: 
Description: Allows to search the twitter api
Author: kubante
Version: 0.1
Author URI: 
*/ 

add_action('admin_init', 'twitter_api_init' );
add_action('admin_menu', 'twitter_api_add_page');

// Init plugin options to white list our options
function twitter_api_init(){
	register_setting( 'twitter_api_settings', 'twitter_api_options', 'twitter_api_validate' );
}

// Add menu page
function twitter_api_add_page() {
	add_options_page('twitterApi\'s credentials', 'Twitter API', 'manage_options', 'twitter_api', 'twitter_api_do_page');
}

// Draw the menu page itself
function twitter_api_do_page() {
	?>
	<div class="wrap">
		<h2>twitter api credentials</h2>
		<form method="post" action="options.php">
			<?php settings_fields('twitter_api_settings'); ?>
			<?php $options = get_option('twitter_api_options'); ?>
			<table class="form-table">
				<tr valign="top"><th scope="row">oauth_access_token</th>
					<td><input type="text" name="twitter_api_options[oauth_access_token]" value="<?php echo $options['oauth_access_token']; ?>" /></td>
				</tr>
				<tr valign="top"><th scope="row">oauth_access_token_secret</th>
					<td><input type="text" name="twitter_api_options[oauth_access_token_secret]" value="<?php echo $options['oauth_access_token_secret']; ?>" /></td>
				</tr>
				<tr valign="top"><th scope="row">consumer_key</th>
					<td><input type="text" name="twitter_api_options[consumer_key]" value="<?php echo $options['consumer_key']; ?>" /></td>
				</tr>
				<tr valign="top"><th scope="row">consumer_secret</th>
					<td><input type="text" name="twitter_api_options[consumer_secret]" value="<?php echo $options['consumer_secret']; ?>" /></td>
				</tr>
			</table>
			<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
			</p>
		</form>
	</div>
	<?php	
}

// Sanitize and validate input. Accepts an array, return a sanitized array.
function twitter_api_validate($input) {

	// Say our second option must be safe text with no HTML tags
	$input['oauth_access_token'] =  wp_filter_nohtml_kses($input['oauth_access_token']);
	$input['oauth_access_token_secret'] =  wp_filter_nohtml_kses($input['oauth_access_token_secret']);
	$input['consumer_key'] =  wp_filter_nohtml_kses($input['consumer_key']);
	$input['consumer_secret'] =  wp_filter_nohtml_kses($input['consumer_secret']);
	
	return $input;
}

