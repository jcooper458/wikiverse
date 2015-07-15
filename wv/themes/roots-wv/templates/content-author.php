<?php 
$args = array( 'post_type' => 'wall', 'posts_per_page' => 10 );
$loop = new WP_Query( $args );
while ( $loop->have_posts() ) : $loop->the_post();

  $the_title = get_the_title();
  $the_permalink = get_the_permalink();

  echo '<div class="entry-content">';
  echo '<a href="'. $the_permalink . '">' . $the_title . '</a>';
  echo '</div>';

  wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));

endwhile;
?>
