<?php
/* 
Plugin Name: Ajax wall creator
Plugin URI: 
Description:Allows to create wikiverse walls from front end 
Author: kubante
Version: 0.1
Author URI: 
*/ 

define('APFSURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );  
define('APFPATH', WP_PLUGIN_DIR."/".dirname( plugin_basename( __FILE__ ) ) ); 


function wallCScripts(){
    wp_enqueue_script('apf', WP_PLUGIN_URL.'/wall-creator/js/wall-creator.js', array('jquery'));  
    wp_localize_script( 'apf', 'apfajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_enqueue_scripts', 'wallCScripts');



function apf_addpost() { 

	$nonce = $_REQUEST['nonce'];
	if (! wp_verify_nonce($nonce, 'wall') ) die("Security Check");
	 
    $results = '';  
    $title = $_POST['walltitle'];   
    $meta = $_POST['wallmeta']; 
    $user_id = get_current_user_id();
    
   /*foreach ($meta as $m){//build the tags
	   
	   $tags .= $m.", ";
   }
    
    $metaserialized = serialize($meta);
*/
    $post_id = wp_insert_post( array(  
    
        'post_title'        => $title,  
        'post_status'       => 'publish', 
        'post_type'         => 'wall', 
        'post_author'       => $user_id,
        //'tags_input'    	=> $tags
        
    ) );  
    
	add_post_meta($post_id, "wikiverse", $meta);//add the iter to a custom field   
    
	$permalink = get_permalink( $post_id );
    //$results = $title . " - " . $permalink;  
	
	die($permalink); 

} 

function apf_editpost() { 
	
	$nonce = $_REQUEST['nonce'];
	if (! wp_verify_nonce($nonce, 'wall') ) die("Security Check");
	
	$meta = $_POST['wallmeta']; 
	$postID = $_POST['wallID']; 

    
  update_post_meta($postID, "wikiverse", $meta);
    
  die($meta." ".$postID);  
} 

// creating Ajax call for WordPress  
add_action( 'wp_ajax_nopriv_apf_addpost', 'apf_addpost' );  
add_action( 'wp_ajax_apf_addpost', 'apf_addpost' );
add_action( 'wp_ajax_apf_editpost', 'apf_editpost' );
?>