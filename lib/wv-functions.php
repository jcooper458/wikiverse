<?php
/**
 * Custom functions
 */
/*------------- DISABLE ADMIN BAR -----------------*/

//remove the admin bar
add_filter('show_admin_bar', '__return_false');
/**
 * Remove the slug from published post permalinks. Only affect our CPT though.
 */

function wv_remove_cpt_slug( $post_link, $post, $leavename ) {
 
    if ( 'board' != $post->post_type || 'publish' != $post->post_status ) {
        return $post_link;
    }
 
    $post_link = str_replace( '/' . $post->post_type . '/', '/', $post_link );
 
    return $post_link;
}
add_filter( 'post_type_link', 'wv_remove_cpt_slug', 10, 3 );


/**
 * Have WordPress match postname to any of our public post types (page, post, race)
 * All of our public post types can have /post-name/ as the slug, so they better be unique across all posts
 * By default, core only accounts for posts and pages where the slug is /post-name/
 */
function wv_parse_request_trick( $query ) {
 
    // Only noop the main query
    if ( ! $query->is_main_query() )
        return;
 
    // Only noop our very specific rewrite rule match
    if ( 2 != count( $query->query ) || ! isset( $query->query['page'] ) ) {
        return;
    }
 
    // 'name' will be set if post permalinks are just post_name, otherwise the page rule will match
    if ( ! empty( $query->query['name'] ) ) {
        $query->set( 'post_type', array( 'post', 'board', 'page' ) );
    }
}
add_action( 'pre_get_posts', 'wv_parse_request_trick' );



/*-------------CREATE CPT board-----------------*/

add_action( 'init', 'register_cpt_board' );

function register_cpt_board() {

    $labels = array( 
        'name' => _x( 'board', 'board' ),
        'singular_name' => _x( 'board', 'board' ),
        'add_new' => _x( 'New board', 'board' ),
        'add_new_item' => _x( 'Add New board', 'board' ),
        'edit_item' => _x( 'Edit board', 'board' ),
        'new_item' => _x( 'New board', 'board' ),
        'view_item' => _x( 'View board', 'board' ),
        'search_items' => _x( 'Search for boards ', 'board' ),
        'not_found' => _x( 'No boards found', 'board' ),
        'not_found_in_trash' => _x( 'No board members found in trash', 'board' ),
        'menu_name' => _x( 'boards', 'board' ),
        );

    $args = array( 
        'labels' => $labels,
        'hierarchical' => true,
        
       // 'menu_icon' => get_stylesheet_directory_uri() . '/includes/images/bike_icon.png',  // Icon Path
        
        'supports' => array( 'title', 'author', 'thumbnail', 'editor'),
      //  'yarpp_support' => true,
        'public' => true,
        'show_ui' => true,
        'menu_position' => 55,   
        'show_in_nav_menus' => true,
        'publicly_queryable' => true,
        'has_archive' => true,
        'query_var' => true,
        'can_export' => true,
        'rewrite' => array('slug'=>''),
        'taxonomies' => array('category'),
        'capability_type' => 'post'
        );

    register_post_type( 'board', $args );
}


add_action( 'login_head', 'theme_hide_login_logo_login_head' );

function theme_hide_login_logo_login_head() {
    echo '<style> #login h1 { display: none; } </style>';
}

add_filter('posts_where', 'include_for_author');

function include_for_author($where){
    if(is_author())
        $where = str_replace(".post_type = 'post'", ".post_type in ('post', 'board')", $where);

    return $where;
}

function add_subscriber_delete_cap() {
    $role = get_role( 'subscriber' );
    $role->add_cap( 'delete_posts' );
    $role->add_cap( 'delete_published_posts' );
}
add_action( 'admin_init', 'add_subscriber_delete_cap');

/**
 * Redirect to the custom login page
 */
function wv_login_init () {
    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'login';

    if ( isset( $_POST['wp-submit'] ) ) {
        $action = 'post-data';
    } else if ( isset( $_GET['reauth'] ) ) {
        $action = 'reauth';
    }

    // redirect to change password form
    if ( $action == 'rp' || $action == 'resetpass' ) {
        if( isset($_GET['key']) && isset($_GET['login']) ) {
            $rp_path = wp_unslash('/login/');
            $rp_cookie  = 'wp-resetpass-' . COOKIEHASH;
            $value = sprintf( '%s:%s', wp_unslash( $_GET['login'] ), wp_unslash( $_GET['key'] ) );
            setcookie( $rp_cookie, $value, 0, $rp_path, COOKIE_DOMAIN, is_ssl(), true );
        }
        
        wp_redirect( home_url('/login/?action=resetpass') );
        exit;
    }

    // redirect from wrong key when resetting password
    if ( $action == 'lostpassword' && isset($_GET['error']) && ( $_GET['error'] == 'expiredkey' || $_GET['error'] == 'invalidkey' ) ) {
        wp_redirect( home_url( '/login/?action=forgot&failed=wrongkey' ) );
        exit;
    }

    if (
        $action == 'post-data'      ||          // don't mess with POST requests
        $action == 'reauth'         ||          // need to reauthorize
        $action == 'logout'                     // user is logging out
        ) {
        return;
}

wp_redirect( home_url( '/login/' ) );
exit;
}
add_action('login_init', 'wv_login_init');


/**
 * Redirect logged in users to the right page
 */
function wv_template_redirect () {

    $current_user = wp_get_current_user();

    if ( is_page( 'login' ) && is_user_logged_in() ) {
        wp_redirect( home_url( '/user/' . $current_user->user_login ) );
        exit();
    }

    if ( is_page( 'user' ) && !is_user_logged_in() ) {
        wp_redirect( home_url( '/login/' ) );
        exit();
    }
}
add_action( 'template_redirect', 'wv_template_redirect' );


/**
 * Prevent subscribers to access the admin
 */
function wv_admin_init () {

    if ( current_user_can( 'subscriber' ) && !defined( 'DOING_AJAX' ) ) {
        wp_redirect( home_url('/user/') );
        exit;
    }

}
//add_action( 'admin_init', 'wv_admin_init' );


/**
 * Registration page redirect
 */
function wv_registration_redirect ($errors, $sanitized_user_login, $user_email) {

    // don't lose your time with spammers, redirect them to a success page
    if ( !isset($_POST['confirm_email']) || $_POST['confirm_email'] !== '' ) {

        wp_redirect( home_url('/login/') . '?action=register&success=1' );
        exit;

    }

    if ( !empty( $errors->errors) ) {
        if ( isset( $errors->errors['username_exists'] ) ) {

            wp_redirect( home_url('/login/') . '?action=register&failed=username_exists' );

        } else if ( isset( $errors->errors['email_exists'] ) ) {

            wp_redirect( home_url('/login/') . '?action=register&failed=email_exists' );

        } else if ( isset( $errors->errors['invalid_username'] ) ) {

            wp_redirect( home_url('/login/') . '?action=register&failed=invalid_username' );
            
        } else if ( isset( $errors->errors['invalid_email'] ) ) {
            +
            +           wp_redirect( home_url('/login/') . '?action=register&failed=invalid_email' );

        } else if ( isset( $errors->errors['empty_username'] ) || isset( $errors->errors['empty_email'] ) ) {

            wp_redirect( home_url('/login/') . '?action=register&failed=empty' );

        } else {

            wp_redirect( home_url('/login/') . '?action=register&failed=generic' );

        }

        exit;
    }

    return $errors;

}
add_filter('registration_errors', 'wv_registration_redirect', 10, 3);


/**
 * Login page redirect
 */
function wv_login_redirect ($redirect_to, $url, $user) {

    if ( !isset($user->errors) ) {
        return $redirect_to;
    }

    wp_redirect( home_url('/login/') . '?action=login&failed=1');
    exit;

}
add_filter('login_redirect', 'wv_login_redirect', 10, 3);


/**
 * Password reset redirect
 */
function wv_reset_password () {
    $user_data = '';

    if ( !empty( $_POST['user_login'] ) ) {
        if ( strpos( $_POST['user_login'], '@' ) ) {
            $user_data = get_user_by( 'email', trim($_POST['user_login']) );
        } else {
            $user_data = get_user_by( 'login', trim($_POST['user_login']) );
        }
    }

    if ( empty($user_data) ) {
        wp_redirect( home_url('/login/') . '?action=forgot&failed=1' );
        exit;
    }
}
add_action( 'lostpassword_post', 'wv_reset_password');


/**
 * Validate password reset
 */
function wv_validate_password_reset ($errors, $user) {
    // passwords don't match
    if ( $errors->get_error_code() ) {
        wp_redirect( home_url('/login/?action=resetpass&failed=nomatch') );
        exit;
    }

    // wp-login already checked if the password is valid, so no further check is needed
    if ( !empty( $_POST['pass1'] ) ) {
        reset_password($user, $_POST['pass1']);

        wp_redirect( home_url('/login/?action=resetpass&success=1') );
        exit;
    }

    // redirect to change password form
    wp_redirect( home_url('/login/?action=resetpass') );
    exit;
}
add_action('validate_password_reset', 'wv_validate_password_reset', 10, 2);





/**
 * BOARD creator functions
 */

function boardCScripts(){  
    wp_localize_script( 'apf', 'apfajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_enqueue_scripts', 'boardCScripts');

function apf_addpost() { 

    $nonce = $_REQUEST['nonce'];
    if (! wp_verify_nonce($nonce, 'board') ) die("Security Check");
     
    $results = '';  
    $title = sanitize_text_field($_POST['boardtitle']);   
    $meta = $_POST['boardmeta']; 
    $user_id = get_current_user_id();
    
    $post_id = wp_insert_post( array(  
    
        'post_title'        => $title,  
        'post_status'       => 'publish', 
        'post_type'         => 'board', 
        'post_author'       => $user_id,
        'post_content'      => $meta
        
    ) );  
    
     //add_post_meta($post_id, "wikiverse", $meta);//add the iter to a custom field   
    
    $response = [];    

    $permalink = get_permalink( $post_id );
    //$results = $title . " - " . $permalink;  
  
     array_push($response, $permalink, $post_id);

  die(json_encode($response)); 


} 

/*

//not needed for now because forkBoard is calling createBoard

function apf_clonepost() { 

    $nonce = $_REQUEST['nonce'];
    if (! wp_verify_nonce($nonce, 'board') ) die("Security Check");

    $oldID = $_POST['id'];
    $content = get_post_field('post_content', $oldID);
    $title = get_post_field('post_title', $oldID);
    $user_id = get_current_user_id();
    
    $newid = wp_insert_post( array(  
    
        'post_title'        => $title,  
        'post_status'       => 'publish', 
        'post_type'         => 'board', 
        'post_author'       => $user_id,
        'post_content'      => $content
        
    ) );  
    
    $response = [];    

    $permalink = get_permalink( $newid );
  
    array_push($response, $permalink, $newid, $title, $content, $user_id);

     die(json_encode($response)); 
} 
*/
function apf_editpost() { 
    
    $nonce = $_REQUEST['nonce'];
    if (! wp_verify_nonce($nonce, 'board') ) die("Security Check");
    
    $meta = $_POST['boardmeta']; 
    $postID = $_POST['boardID']; 

  // Update post 37
  $thisPost = array(
      'ID'           => $postID,
      'post_content' => $meta
  );

  // Update the post into the database
  wp_update_post( $thisPost );
    
 // update_post_meta($postID, "wikiverse", $meta);
    
  die($meta." ".$postID);  
} 

function wsl_use_fontawesome_icons( $provider_id, $provider_name, $authenticate_url )
{
    ?>
        <a 
           rel           = "nofollow"
           href          = "<?php echo $authenticate_url; ?>"
           data-provider = "<?php echo $provider_id ?>"
           class         = "btn btn-block btn-social btn-<?php echo strtolower( $provider_id ); ?>" 
         >
       
                <i class="fa fa-<?php echo strtolower( $provider_id ); ?>"></i> Sign in with <?php echo $provider_name; ?>
 
        </a>
    <?php
}
 
 /**
 * Redirect back to homepage and not allow access to 
 * WP admin for Subscribers.
 */
function themeblvd_redirect_admin(){
    if ( ! defined('DOING_AJAX') && ! current_user_can('edit_posts') ) {
        wp_redirect( "/");
        exit;       
    }
}


add_filter( 'wsl_render_auth_widget_alter_provider_icon_markup', 'wsl_use_fontawesome_icons', 10, 3 );

add_action( 'admin_init', 'themeblvd_redirect_admin' );

// creating Ajax call for WordPress  
add_action( 'wp_ajax_nopriv_apf_addpost', 'apf_addpost' );  
add_action( 'wp_ajax_nopriv_apf_clonepost', 'apf_clonepost' );  

add_action( 'wp_ajax_apf_addpost', 'apf_addpost' );
add_action( 'wp_ajax_apf_clonepost', 'apf_clonepost' );
add_action( 'wp_ajax_apf_editpost', 'apf_editpost' );


