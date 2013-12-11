<?php
/**
 * ICE API: feature extensions, jQuery Grid Rotator class file
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
 * jQuery Grid Rotator feature
 *
 * This option is a wrapper for the jQuery Grid Rotator plugin
 *
 * @link http://tympanus.net/codrops/2012/08/02/animated-responsive-image-grid/
 * @package ICE-extensions
 * @subpackage features
 */
class ICE_Ext_Feature_Scripts_Gridrotator
	extends ICE_Feature
{
	/**
	 * The animation 'in' easing
	 *
	 * @var string
	 */
	protected $anim_easing_in;

	/**
	 * The animation 'out' easing
	 *
	 * @var string
	 */
	protected $anim_easing_out;

	/**
	 * The animation speed in milliseconds
	 *
	 * @var integer
	 */
	protected $anim_speed;
	
	/**
	 * The animation type
	 *
	 * Accepts a valid jQuery animation type
	 *
	 * @var string
	 */
	protected $anim_type;

	/**
	 * Number of columns
	 *
	 * @var integer
	 */
	protected $columns;

	/**
	 * A valid callback which returns an array of image URIs
	 *
	 * @var boolean|string
	 */
	protected $images_callback;

	/**
	 * The interval in milliseconds at which to rotate the items
	 *
	 * @var integer
	 */
	protected $interval;

	/**
	 * The path to the loading image
	 *
	 * @var string
	 */
	protected $loading_image;

	/**
	 * The name of the loop template to use
	 *
	 * @var string
	 */
	protected $loop;

	/**
	 * Max number of steps to replace
	 * 
	 * @see $step
	 * @var string|integer the string 'random' or an integer
	 */
	protected $max_step;

	/**
	 * Prevent user from clicking the items
	 *
	 * @var boolean
	 */
	protected $prevent_click;

	/**
	 * Number of rows
	 *
	 * @var integer
	 */
	protected $rows;

	/**
	 * Number of items that are replaced at the same time
	 *
	 * @var string|integer the string 'random' or an integer
	 */
	protected $step;

	/**
	 * Rows/Columns under 240 screen width
	 *
	 * @var string
	 */
	protected $w240;

	/**
	 * Rows/Columns under 320 screen width
	 *
	 * @var string
	 */
	protected $w320;

	/**
	 * Rows/Columns under 480 screen width
	 *
	 * @var string
	 */
	protected $w480;

	/**
	 * Rows/Columns under 768 screen width
	 *
	 * @var string
	 */
	protected $w768;

	/**
	 * Rows/Columns under 1040 screen width
	 *
	 * @var string
	 */
	protected $w1024;

	/**
	 */
	protected function get_property( $name )
	{
		switch ( $name ) {
			case 'anim_easing_in':
			case 'anim_easing_out':
			case 'anim_speed':
			case 'anim_type':
			case 'columns':
			case 'images_callback':
			case 'interval':
			case 'loading_image':
			case 'loop':
			case 'max_step':
			case 'prevent_click':
			case 'rows':
			case 'step':
			case 'w1024':
			case 'w240':
			case 'w320':
			case 'w480':
			case 'w768':
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
		$this->title = __( 'Grid Rotator Plugin' );
		$this->description = __( 'A wrapper for the jQuery Grid Rotator plugin' );
		$this->class = "ri-grid ri-grid-size-1 ri-shadow";
	}
	
	/**
	 */
	public function init_styles()
	{
		parent::init_styles();

		// slurp grid rotator styles
		$this->style()->cache( 'gridrotator', 'assets/css/style.css' );
	}

	/**
	 */
	public function init_scripts()
	{
		parent::init_scripts();

		// enqueue grid rotator script
		wp_enqueue_script(
			'gridrotator',
			$this->locate_file_url( 'assets/js/jquery.gridrotator.js' ),
			array( 'modernizr-custom', 'jquery-transit' )
		);
	}
	
	/**
	 */
	public function configure()
	{
		// RUN PARENT FIRST!
		parent::configure();

		// init properties
		$this->import_property( 'anim_easing_in', 'string' );
		$this->import_property( 'anim_easing_out', 'string' );
		$this->import_property( 'anim_speed', 'integer' );
		$this->import_property( 'anim_type', 'string' );
		$this->import_property( 'columns', 'integer' );
		$this->import_property( 'images_callback', 'string' );
		$this->import_property( 'interval', 'integer' );
		$this->import_property( 'loading_image', 'string', $this->locate_file_url( 'assets/images/loading.gif' ) );
		$this->import_property( 'loop', 'string', 'images' );
		$this->import_property( 'max_step' );
		$this->import_property( 'prevent_click', 'boolean' );
		$this->import_property( 'rows', 'integer' );
		$this->import_property( 'step' );
		$this->import_property( 'w1024', 'string' );
		$this->import_property( 'w240', 'string' );
		$this->import_property( 'w320', 'string' );
		$this->import_property( 'w480', 'string' );
		$this->import_property( 'w768', 'string' );
	}

	/**
	 */
	public function get_template_vars()
	{
		// images are empty by default
		$images = array();

		// callback supplied?
		if ( is_callable( $this->images_callback ) ) {
			// yep, use it
			$images = call_user_func( $this->images_callback );
		}
		
		// new script helper
		$script = new ICE_Script();
		$logic = $script->logic();

		// add variables
		$logic->av( 'animEasingIn', $this->anim_easing_in );
		$logic->av( 'animEasingOut', $this->anim_easing_out );
		$logic->av( 'animSpeed', $this->anim_speed );
		$logic->av( 'animType', $this->anim_type );
		$logic->av( 'columns', $this->columns );
		$logic->av( 'interval', $this->interval );
		$logic->av( 'loadingImage', $this->loading_image );
		$logic->av( 'maxStep', $this->max_step );
		$logic->av( 'preventClick', $this->prevent_click );
		$logic->av( 'rows', $this->rows );
		$logic->av( 'step', $this->step );
		$logic->av( 'w1024', $this->w1024 );
		$logic->av( 'w240', $this->w240 );
		$logic->av( 'w320', $this->w320 );
		$logic->av( 'w480', $this->w480 );
		$logic->av( 'w768', $this->w768 );

		// return vars
		return array(
			'images' => $images,
			'loop' => $this->loop,
			'options' => $logic->export_variables(true),
			'selector' => '#' . $this->element()->id()
		);
	}

}

?>
