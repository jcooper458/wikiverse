<?php
/**
 * ICE API: feature extensions, BuddyPress grid class file
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package ICE-extensions
 * @subpackage features
 * @since 1.0
 */

ICE_Loader::load_ext( 'features/scripts/gridrotator' );

/**
 * BuddyPress grid feature
 *
 * @package ICE-extensions
 * @subpackage features
 */
class ICE_Ext_Feature_Bp_Grid
	extends ICE_Ext_Feature_Scripts_Gridrotator
{
	/**
	 */
	protected function init()
	{
		// run parent
		parent::init();

		// set property defaults
		$this->title = __( 'BuddyPress Members Grid', infinity_text_domain );
		$this->description = __( 'Displays an animated grid of BuddyPress members', infinity_text_domain );
	}
	
	/**
	 */
	public function init_styles()
	{
		parent::init_styles();

		// slurp overriding grid styles
		$this->style()
			->cache( 'style', 'style.css' )
			->add_dep( 'gridrotator' );
	}

}

?>
