
	<article id="page-<?php the_ID(); ?>" class="meta-box hentry">
		<div class="post-content cf">

<?php if ( !empty($_GET['success']) ): ?>
			<div class="message-box message-success">
				<span class="icon-thumbs-up"></span>
				Profile updated successfully!
			</div>
<?php endif; ?>

<?php if ( !empty($error) ): ?>
			<div class="message-box message-error">
				<span class="icon-thumbs-up"></span>
				<?php echo $error; ?>
			</div>
<?php endif; ?>

			<header class="entry-header">
				<h1 class="entry-title">Welcome, <span class="userColor"><?php echo esc_html($current_user->display_name); ?></span></h1>
			</header>

			<div class="entry-content">

				<?php 
				$args = array( 'post_type' => 'wall', 'posts_per_page' => -1 );
				$loop = new WP_Query( $args );
				while ( $loop->have_posts() ) : $loop->the_post();

				  $the_title = get_the_title();
				  $the_permalink = get_the_permalink();

				  echo '<div class="entry-content">';
				  echo '<a href="'. $the_permalink . '">' . $the_title . '</a>';
				  echo '</div>';

				  wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));

				endwhile;
				?>

				<hr>
			</div><!-- .entry-content -->

				<h2>Change password</h2>
				<p>You may change your password if you are so inclined.</p>

				<form method="post" id="adduser" action="/user/">

					<p class="form-password">
						<label for="current_pass">Current Password</label>
						<input class="text-input" name="current_pass" type="password" id="current_pass">
					</p>

					<p class="form-password">
						<label for="pass1">New Password</label>
						<input class="text-input" name="pass1" type="password" id="pass1">
					</p>

					<p class="form-password">
						<label for="pass2">Confirm Password</label>
						<input class="text-input" name="pass2" type="password" id="pass2">
					</p>

					<?php

					// action hook for plugin and extra fields
					do_action('edit_user_profile', $current_user);

					?>
					<p class="form-submit">
						<input name="updateuser" type="submit" id="updateuser" class="submit button" value="Update profile">
						<input name="action" type="hidden" id="action" value="update-user">
					</p>
				</form>

				<hr>

				<p><a style="float:right" href="<?php echo wp_logout_url( home_url() ); ?>" class="icon-cancel standard-button button-logout">logout</a></p>

		</div>
	</article>



