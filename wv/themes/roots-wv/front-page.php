<div id="packery">

	
</div>


<?php get_template_part('templates/searchboxes'); ?>

<div class="container">

  <div class="input-group">
    <span class="input-group-btn">
      <button class="btn btn-default btn-lg" type="button">Go!</button>
    </span>
    <input type="text" class="form-control input-lg" placeholder="Insert anything..">
  </div><!-- /input-group -->
    <div class="input-group pull-right">
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox1" value="option1" checked> Wikipedia
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox2" value="option2" checked> Soundcloud
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox3" value="option3" checked> Google Maps
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox1" value="option1" checked> Flickr
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox2" value="option2" checked> Instagram
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="inlineCheckbox3" value="option3" checked> Youtube
    </label>
   </div><!-- /input-group -->

</div><!-- /container -->


<!-- Modal -->
<div class="modal fade" id="saveWallModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Save this wall</h4>
        <i class="fa fa-buysellads"></i>
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