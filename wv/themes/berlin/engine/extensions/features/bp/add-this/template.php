<?php
/**
 * ICE API: feature extensions, BuddyPress "Add This" feature template file
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
/* @var $button_type string simple|full|toolbar */
?>
<?php if ( 'full' == $button_type ): ?>
	<div <?php $this->render_attrs( 'addthis_toolbox', 'addthis_default_style' ) ?>>
		<a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>
		<a class="addthis_button_tweet"></a>
		<a class="addthis_button_pinterest_pinit"></a>
		<a class="addthis_counter addthis_pill_style"></a>
	</div>
<?php elseif ( 'simple' == $button_type ) :?>
	<div <?php $this->render_attrs( 'addthis_toolbox', 'addthis_default_style' ) ?>>
		<a class="addthis_button_preferred_1"></a>
		<a class="addthis_button_preferred_2"></a>
		<a class="addthis_button_preferred_3"></a>
		<a class="addthis_button_preferred_4"></a>
		<a class="addthis_button_compact"></a>
		<a class="addthis_counter addthis_bubble_style"></a>
	</div>
<?php elseif ( 'toolbar' == $button_type ):  ?>
	<a <?php $this->render_attrs( 'addthis_button' ) ?> href="http://www.addthis.com/bookmark.php?v=300&amp;pubid=xa-505898043bc3ee19"><img src="http://s7.addthis.com/static/btn/v2/lg-share-en.gif" width="125" height="16" alt="Bookmark and Share" style="border:0"/></a>
<?php endif;?>

<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#async=1"></script>

<script type="text/javascript">
	jQuery(document).ready(function(){
		addthis.init()
	});
</script>
