<?php $author_id=$post->post_author; ?>

<div id="wvTitle"><h1 class="text-center"></h1></div>

<div id="wvAuthor" data-currentUser="<?php echo $current_user->user_login;?>" data-author="<?php the_author_meta( 'user_nicename', $author_id ); ?>" class="text-center">
	by <a href="/user/<?php the_author_meta( 'user_nicename', $author_id ); ?>"><?php the_author_meta( 'user_nicename', $author_id ); ?>
	</a>
</div>

<div id="packery" class="packery"></div>

<div id="postID" class="invisible"><?php echo $post->ID; ?></div>
