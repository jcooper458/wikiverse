<a id="mobile-sidebar-button" href="#inside-sidebar" class="show-for-small hide-for-large button black">Sidebar</a>
<?php if ( is_user_logged_in() ): ?>
					<ul class="sf-menu sf-js-enabled" id="user-header-nav">	
						<li class="header-avatar"><a title="View your Public Profile" href="<?php echo bp_get_loggedin_user_link();?>"><?php echo bp_loggedin_user_avatar( 'type=thumb&width=80&height=80' ); ?></a></li>
						<li class="notifications"><?php bp_adminbar_notifications_menu(); ?></li>					
						<li class="account"><?php bp_adminbar_account_menu(); ?></li>
					</ul>
<?php else: ?>
<a id="mobile-login-button" href="<?php echo wp_login_url(); ?>" class="show-for-small hide-for-large button black">Login</a>
	<ul class="sf-menu sf-js-enabled" id="user-header-nav">	
	<li class="login-form-link"><a href="<?php echo bp_get_loggedin_user_link();?>">Login</a>
	<ul><form name="login-form" id="sidebar-login-form" class="standard-form" action="<?php echo site_url('wp-login.php', 'login-post'); ?>" method="post">
					<input type="text" name="log" id="side-user-login" class="input" value="<?php echo esc_attr(stripslashes($user_login)); ?>" /></label>
					
					<input type="password" name="pwd" id="sidebar-user-pass" class="input" value="" /></label>
					
					<div class="sidebar-login-button"><label><input name="rememberme" type="checkbox" id="sidebar-rememberme" value="forever" /><?php _e('Remember Me', 'buddypress'); ?></label></div>
					
					<?php do_action('bp_sidebar_login_form'); ?>
					<input type="submit" name="wp-submit" id="sidebar-wp-submit" value="<?php _e('Log In'); ?>" tabindex="100" />
					<input type="hidden" name="testcookie" value="1" />
				</form>
				<div id="bp-connect-buttons">
				<?php do_action('bp_after_sidebar_login_form');?>
				</div>
</ul>
	</li>
	<li id="join-us-link"><a title="Register an Account"
						<?php if ( function_exists('bp_signup_slug')  ) : ?> 
						href="<?php echo site_url(); ?>/<?php bp_signup_slug(); ?>">
						<?php else: ?>
						href="<?php echo wp_login_url(); ?>?action=register">
						<?php endif; ?>
						Join us!</a>
</li>
		</ul>	
	</nav>
<?php endif; ?>