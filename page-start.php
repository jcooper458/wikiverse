<?php while (have_posts()) : the_post(); ?>
  <?php //get_template_part('templates/page', 'header'); ?>

  <div id="postID" class="invisible"></div>

  <div id="packery" class="packery"></div>

  <?php get_template_part('templates/searchboxes'); ?>

<?php endwhile; ?>
<!-- Button trigger modal -->

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Save this board</h4>
        <i class="fa fa-icon-save"></i>
      </div>
      <div class="modal-body">
      
        <div class="form-group">
          <input id="boardTitle" placeholder="Insert a Title for your board" type="text" class="form-control">
        </div>      
      
      </div>
      <div class="modal-footer">
       
        <button class="btn btn-default" id="boardSubmitButton" disabled type="button">Save board</button>
        
      </div>
    </div>
  </div>
</div>

