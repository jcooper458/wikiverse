<div id="packery">

	
</div>


<?php get_template_part('templates/searchboxes'); ?>


<!-- Modal -->
<div class="modal fade" id="saveWallModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Save this wall</h4>
      </div>
      <div class="modal-body">
      
      	<div class="form-group">
      		<input id="wallTitle" placeholder="Insert a Title for your Wall" type="text" class="form-control">
      	</div>	    
		  
      </div>
      <div class="modal-footer">
       
        <button class="btn btn-default" id="wallSubmitButton" disabled type="button">Save Wall</button>
        
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->