<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <title><?php wp_title('|', true, 'right'); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <?php wp_head(); ?>

  <link rel="alternate" type="application/rss+xml" title="<?php echo get_bloginfo('name'); ?> Feed" href="<?php echo home_url(); ?>/feed/">
</head>

<?php

global $current_user;
get_currentuserinfo();

if ( !empty($_POST) && !empty( $_POST['action'] ) && $_POST['action'] == 'update-user' ) {

	/* Update user password */
	if ( !empty($_POST['current_pass']) && !empty($_POST['pass1'] ) && !empty( $_POST['pass2'] ) ) {

		if ( !wp_check_password( $_POST['current_pass'], $current_user->user_pass, $current_user->ID) ) {
			$error = 'Your current password does not match. Please retry.';
		} elseif ( $_POST['pass1'] != $_POST['pass2'] ) {
			$error = 'The passwords do not match. Please retry.';
		} elseif ( strlen($_POST['pass1']) < 4 ) {
			$error = 'A bit short as a password, don\'t you thing?';
		} elseif ( false !== strpos( wp_unslash($_POST['pass1']), "\\" ) ) {
			$error = 'Password may not contain the character "\\" (backslash).';
		} else {
			$error = wp_update_user( array( 'ID' => $current_user->ID, 'user_pass' => esc_attr( $_POST['pass1'] ) ) );

			if ( !is_int($error) ) {
				$error = 'An error occurred while updating your profile. Please retry.';
			} else {
				$error = false;
			}
		}

		if ( empty($error) ) {
			do_action('edit_user_profile_update', $current_user->ID);
			wp_redirect( site_url('/user/') . '?success=1' );
			exit;
		}
	}
}

?>

