<?php
/**
 * ICE API: feature extensions, BuddyPress members grid loop template file
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package ICE-extensions
 * @subpackage features
 * @since 1.0
 */

/* @var $this ICE_Feature_Renderer */
?>

<?php if ( bp_has_members( 'user_id=0&type=&max=50&per_page=50' ) ) : ?>
	<div <?php $this->render_attrs() ?>>
		<ul>
			<?php while ( bp_members() ) : bp_the_member(); ?>
			<li>
				<a class="user-avatar" href="<?php bp_member_permalink() ?>" title="<?php bp_member_name(); ?>"><?php bp_member_avatar('type=full&width=100&height=100') ?></a>
			</li>
			<?php endwhile; ?>
		</ul>
	</div>
<?php endif; ?>
