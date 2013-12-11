<?php
/**
 * ICE API: feature extensions, Grid Rotator images loop template file
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

/* @var $images array Image URIs for the list */
/* @var $loop string The name of the loop template to load */
/* @var $options string Grid rotator options */
/* @var $selector string The selector to target */

?>
<?php $this->load_template_part( $loop ); ?>

<script type="text/javascript">
	jQuery(document).ready(function($){
		// set up the grid
		$( '<?php echo $selector ?>' ).gridrotator(<?php echo $options ?>);
	});
</script>
