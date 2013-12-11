<?php
/**
 * Template Name: Homepage Slider Template
 *
 * @author Bowe Frankema <bowe@presscrew.com>
 * @link http://shop.presscrew.com/
 * @copyright Copyright (C) 2010-2011 Bowe Frankema
 * @license http://www.gnu.org/licenses/gpl.html GPLv2 or later
 * @since 1.0
 */
    infinity_get_header();
?>
<div id="content" role="main" class="column sixteen">
    <?php
        do_action( 'open_content' );
        do_action( 'open_home' );
    ?> 
	<div id="center-homepage-widget">
		<?php
			if (is_active_sidebar('homepage-center-widget')) {
				                dynamic_sidebar( 'Homepage Center Widget' );
			}
			else {
			    the_widget('BerlinFeaturedWidget');
			}
		?>
	</div>    
	<?php if ( is_active_sidebar( 'Homepage Left' ) || is_active_sidebar( 'Homepage Middle' ) || is_active_sidebar( 'Homepage Right' )  ) : ?>     
	<div class="homepage-widgets row">
	    <div id="homepage-widget-left" class="column five homepage-widget">         
	            <?php
	                dynamic_sidebar( 'Homepage Left' );
	            ?>
	    </div>
	             
	    <div id="homepage-widget-middle" class="column five homepage-widget">  
	            <?php
	                dynamic_sidebar( 'Homepage Middle' );
	            ?>
	    </div>
	     
	    <div id="homepage-widget-right" class="column six homepage-widget">   
	            <?php
	            	dynamic_sidebar( 'Homepage Right' );
	            ?>
	    </div>  
	</div>  
	<?php else: ?>
	<?php if ( current_user_can( 'edit_theme_options' ) ) : ?> 
		<aside class="widget no-widget">
			<h4>Woops no widgets have been found! <a href="<?php echo home_url( '/'  ); ?>wp-admin/widgets.php" title="Add Widgets">Add some Widgets!</a> </h4>
			Your homepage has several widget areas you can use. You can use them to showcase your members, groups or simply a bit of text. It's all up to you! <a href="<?php echo home_url( '/'  ); ?>wp-admin/widgets.php" title="Add Widgets">Add Widgets</a>
		</aside>
	<?php endif; ?>
	<?php endif; ?>
    <?php
        do_action( 'close_home' );
        do_action( 'close_content' );
    ?>
</div>
<?php
    infinity_get_footer();
?>