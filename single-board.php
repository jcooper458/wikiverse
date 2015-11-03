<?php $author_id=$post->post_author; ?>

<!--<div class="row" id=""><div class="" id="mindmap"></div></div>-->

<div id="wvTitle" class="text-center"><h1></h1></div>
<div id="wvAuthor" data-currentUser="<?php echo $current_user->user_login;?>" data-author="<?php the_author_meta( 'user_nicename', $author_id ); ?>" class="text-center"><h2>by <a href="/user/<?php the_author_meta( 'user_nicename', $author_id ); ?>"><?php the_author_meta( 'user_nicename', $author_id ); ?></a></h2></div>

<div id="packery" class="packery"></div>

<div id="postID" class="invisible"><?php echo $post->ID; ?></div>
