<?php
/**
 * Custom functions
 */
/*------------- DISABLE ADMIN BAR -----------------*/
add_filter('show_admin_bar', '__return_false');

/*-------------CREATE CPT WALL-----------------*/

add_action( 'init', 'register_cpt_wall' );

function register_cpt_wall() {

    $labels = array( 
        'name' => _x( 'Wall', 'wall' ),
        'singular_name' => _x( 'wall', 'wall' ),
        'add_new' => _x( 'New wall', 'wall' ),
        'add_new_item' => _x( 'Add New wall', 'wall' ),
        'edit_item' => _x( 'Edit wall', 'wall' ),
        'new_item' => _x( 'New wall', 'wall' ),
        'view_item' => _x( 'View wall', 'wall' ),
        'search_items' => _x( 'Search for walls ', 'wall' ),
        'not_found' => _x( 'No walls found', 'wall' ),
        'not_found_in_trash' => _x( 'No wall members found in trash', 'wall' ),
        'menu_name' => _x( 'Walls', 'wall' ),
    );

    $args = array( 
        'labels' => $labels,
        'hierarchical' => true,
        
       // 'menu_icon' => get_stylesheet_directory_uri() . '/includes/images/bike_icon.png',  // Icon Path
        
        'supports' => array( 'title', 'author', 'thumbnail', 'custom-fields'),
      //  'yarpp_support' => true,
        'public' => true,
        'show_ui' => true,
        'menu_position' => 55,   
        'show_in_nav_menus' => true,
        'publicly_queryable' => true,
        'has_archive' => true,
        'query_var' => true,
        'can_export' => true,
        'rewrite' => array('slug'=>'walls','with_front'=>false),
        'capability_type' => 'post'
    );

    register_post_type( 'wall', $args );
}