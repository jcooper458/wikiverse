<?php

// Add Homepage Sidebars (only registered on WP Single & Main Blog in MultiSite
if ( is_main_site() )  {
	
	register_sidebar( array(
		'name' => 'Homepage Center Widget',
		'id' => 'homepage-center-widget',
		'description' => "The Full Width Center Widget on the Homepage",
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));

	register_sidebar( array(
		'name' => 'Homepage Left',
		'id' => 'homepage-left',
		'description' => "The Left Widget on the Homepage",
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));

	register_sidebar( array(
		'name' => 'Homepage Middle',
		'id' => 'homepage-middle',
		'description' => "The Middle Widget on the Homepage",
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));

	register_sidebar( array(
		'name' => 'Homepage right',
		'id' => 'homepage-right',
		'description' => "The right Widget on the Homepage",
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));
}

?>