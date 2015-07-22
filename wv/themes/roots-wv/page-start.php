<div id="postID"></div>

<div id="packery">
</div>

<?php get_template_part('templates/searchboxes'); ?>

<!-- Modal -->
<div class="modal fade" id="saveboardModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
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
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->