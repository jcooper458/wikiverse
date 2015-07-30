<?php
/* 
Plugin Name: wv board creator
Plugin URI: 
Description:Allows to create wikiverse boards from front end 
Author: kubante
Version: 0.1
Author URI: 
*/ 


define('APFSURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );  



function boardCScripts(){  
    wp_localize_script( 'apf', 'apfajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_enqueue_scripts', 'boardCScripts');




function apf_addpost() { 

	$nonce = $_REQUEST['nonce'];
	if (! wp_verify_nonce($nonce, 'board') ) die("Security Check");
	 
    $results = '';  
    $title = $_POST['boardtitle'];   
    $meta = $_POST['boardmeta']; 
    $user_id = get_current_user_id();
    
   /*foreach ($meta as $m){//build the tags
	   
	   $tags .= $m.", ";
   }
    
    $metaserialized = serialize($meta);
*/
    $post_id = wp_insert_post( array(  
    
        'post_title'        => $title,  
        'post_status'       => 'publish', 
        'post_type'         => 'board', 
        'post_author'       => $user_id,
        'post_content'    	=> $meta
        
    ) );  
    
	//add_post_meta($post_id, "wikiverse", $meta);//add the iter to a custom field   
    $response = [];
    
	$permalink = get_permalink( $post_id );
    //$results = $title . " - " . $permalink;  
	
  die($permalink . "-" . $post_id); 
	//die($permalink); 

} 

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

// creating Ajax call for WordPress  
add_action( 'wp_ajax_nopriv_apf_addpost', 'apf_addpost' );  
add_action( 'wp_ajax_apf_addpost', 'apf_addpost' );
add_action( 'wp_ajax_apf_editpost', 'apf_editpost' );
?>