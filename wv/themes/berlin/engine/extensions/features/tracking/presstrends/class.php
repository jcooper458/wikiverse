<?php
/**
 * ICE API: feature extensions, Press Trends class file
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package ICE-extensions
 * @subpackage features
 * @since 1.1
 */

ICE_Loader::load( 'components/features/component' );

/**
 * Press Trends feature
 *
 * @link http://www.presstrends.io/
 * @package ICE-extensions
 * @subpackage features
 */
class ICE_Ext_Feature_Tracking_Presstrends
	extends ICE_Feature
{
	/**
	 */
	protected $suboptions = true;

	// local properties

	/**
	 * Path to the PHP file containing the code which PressTrends spits out
	 *
	 * @var string
	 */
	protected $api_include;

	/**
	 */
	protected function get_property( $name )
	{
		switch ( $name ) {
			case 'api_include':
				return $this->$name;
			default:
				return parent::get_property( $name );
		}
	}

	/**
	 */
	protected function init()
	{
		// run parent
		parent::init();

		// set property defaults
		$this->title = __( 'Press Trends Tracking' );
		$this->description = __( 'A simple feature for adding Press Trends tracking' );

		// add render action to admin init
		add_action( 'admin_init', array( $this, 'load_api_include' ) );
	}
	
	/**
	 */
	public function configure()
	{
		// RUN PARENT FIRST!
		parent::configure();

		// init properties
		$this->import_property( 'api_include', 'string' );
	}

	/**
	 * Returns true if Press Trends is enabled
	 *
	 * @return boolean
	 */
	public function is_toggled_on()
	{
		// get the sub option
		$enable = $this->get_suboption( 'enable' );

		// its a toggle, so just a simple test works
		return ( $enable->get() );
	}

	/**
	 * Load the file containing the api code
	 *
	 * @return boolean
	 */
	public function load_api_include()
	{
		// make sure api code is actually set
		if ( $this->api_include && $this->is_toggled_on() ) {
			// locate file
			$filename = ICE_Scheme::instance()->locate_file( $this->api_include );
			// make sure we found a file and its readable
			if ( $filename && is_readable( $filename ) ) {
				// include it
				include_once $filename;
				// success
				return true;
			}
		}

		// did not load
		return false;
	}

}

?>
