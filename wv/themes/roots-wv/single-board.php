<div id="packery"><?php get_template_part('templates/searchboxes'); ?></div>

<div id="wikiverse"><?php $wikiverse = get_post_meta($post->ID, "wikiverse"); echo $wikiverse[0];?></div>
<div id="postID"><?php echo $post->ID; ?></div>


