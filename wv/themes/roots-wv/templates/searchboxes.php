<div id="wikipedia-search" class="brick invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small">

		<div class="col-lg-2">
			
	  		<?php get_template_part('templates/languages'); ?>
		</div>
	  	<div class="col-lg-10">
	  	
	  	<div class="input-group">
	      <input type="text" id="wiki-searchinput" placeholder="search Wikipedia" class="form-control">
	      <span class="input-group-btn">
	        <button class="btn btn-default start"1 type="button">Start</button>
	      </span>
	    </div><!-- /input-group -->
	   
	   </div> 
	</div> 
</div>

<div id="youtube-search" class="brick invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">
		<div class="col-lg-2 col-md-2 col-sm-2">
			<i class="fa fa-youtube-square"></i>
		</div>
	
	  	<div class="col-lg-10 col-md-10 col-sm-10">
	  	
	  	<div class="input-group">
	      <input type="text" id="youtube-searchinput" placeholder="search Youtube" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Start</button>
	      </span>
	    </div><!-- /input-group -->
	   
	   </div> 
	</div> 
</div>

<div id="flickr-search" class="brick invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">
		<div class="col-lg-2 col-md-2 col-sm-2">
			<i class="fa fa-flickr"></i>
		</div>
	
	  	<div class="col-lg-10 col-md-10 col-sm-10">
	  	
	  	<div class="input-group">
	      <input type="text" id="flickr-searchinput" placeholder="search flickr" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Start</button>
	      </span>
	    </div><!-- /input-group -->
	   
	   </div> 
	</div> 
</div>

<div id="gmaps-search" data-type="gmaps" data-topic="" class="brick invisible w2">
	<span class="cross"><i class="fa fa-close"></i></span>
	<span class="handle"> <i class="fa fa-map-marker"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">

		<input id="pac-input" class="controls" type="text" placeholder="Enter a location">
		<div id="map-canvas"></div> 
	   
	   </div> 
	</div> 
</div>