<?php
/**
 * ICE API: feature extensions, Grid Rotator images template part file
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package ICE-extensions
 * @subpackage features
 * @since 1.1
 */

/* @var $this ICE_Feature_Renderer */
/* @var $images array of image URIs for the list */
?>
<div <?php $this->render_attrs() ?>>
	<ul>
		<?php foreach( $images as $image ): ?>
			<li><a href="#"><img src="<?php echo $image ?>"></a></li>
		<?php endforeach; ?>
	</ul>
</div>