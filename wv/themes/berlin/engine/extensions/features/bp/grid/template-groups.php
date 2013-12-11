<?php
/**
 * ICE API: feature extensions, BuddyPress groups grid loop template file
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package ICE-extensions
 * @subpackage features
 * @since 1.0
 */

/* @var $this ICE_Feature_Renderer */
?>

<?php if ( bp_has_groups( '&type=&max=50&per_page=50' ) ) : ?>
	<div <?php $this->render_attrs() ?>>
		<ul>
			<?php while ( bp_groups() ) : bp_the_group(); ?>
			<li>
				<a href="<?php bp_group_permalink(); ?>"><?php bp_group_avatar( 'type=full&width=100&height=100' ); ?></a>
			</li>
			<?php endwhile; ?>
		</ul>
	</div>
<?php endif; ?>