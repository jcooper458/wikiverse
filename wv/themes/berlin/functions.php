<?php
/**
 * Compiled Theme
 *
 * Git refs used for compiling:
 * ------------------------------------------------------------------------------------
 *  Theme                   Branch              SHA
 * ------------------------------------------------------------------------------------
 * infinity                buddypress          1895403c5cf42d736ddf806d70376fcbbc2faa79
 * infinity-premium        master              7b253696df66e843eb736d18e1c4c340a7aaedaa
 * infinity-berlin         master              afda782eb492ad97694838cd410a2ee3ab27fff6
 *
 * @author Infinity Theme Compiler
 */

/**
 * Themes on top of which this theme is compiled
 */
define( 'ICE_THEMES_COMPILED', 'infinity,infinity-premium' );

?>
<?php
/**
 * Infinity Berlin Theme: theme functions
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 */

/**
 * Setup
 */
require_once 'engine/includes/setup-berlin.php';

?>
<?php
/**
 * Infinity Premium Theme: theme functions
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2012 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 */

/**
 * Setup
 */
require_once 'engine/includes/setup-premium.php';

/**
 * BuddyPress Setup
 */
require_once 'engine/includes/buddypress-premium.php';

?>
<?php
/**
 * Infinity Theme: theme functions
 *
 * @author Marshall Sorenson <marshall@presscrew.com>
 * @link http://infinity.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Marshall Sorenson
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @package Infinity
 * @since 1.0
 */

/**
 * To Infinity, and beyond! (sorry, had to do it)
 */
require_once( 'engine/infinity.php' );

//
// At this point, Infinity is fully loaded and initialized,
// and your includes/setup.php has been loaded if applicable.
//
// So... get to work! (Unless you don't roll on Shabbos)
//

?>
