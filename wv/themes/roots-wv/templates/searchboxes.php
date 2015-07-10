<div id="wikipedia-search" class="brick stamp invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container">

	  	<?php get_template_part('templates/languages'); ?>
	  	
	  	<div class="input-group">
	      <input type="text" id="wiki-searchinput" placeholder="search Wikipedia" class="form-control">
	      <span class="input-group-btn">
	        <button class="btn btn-default start"1 type="button">Search</button>
	      </span>
	    </div><!-- /input-group -->
	</div> 
	
	<table class="table table-hover wiki results"></table>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>

<div id="youtube-search" class="brick stamp invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">
		
		<i class="fa fa-youtube-square"></i>

	  	<div class="input-group">
	      <input type="text" id="youtube-searchinput" placeholder="search Youtube" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Search</button>
	      </span>
	    </div><!-- /input-group -->
	   
	   <table class="table table-hover results youtube"></table>

		<div class="search-ui">
			<ul class="nav nav-pills">
				<li class="pull-right">
					<a class="clear"><h6>clear results</h6></a>
				</li>
			</ul>
		</div>
	</div> 
</div>

<div id="flickr-search" class="brick w2 stamp invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">
	 
		<i class="fa fa-flickr"></i>

  	
	  	<div class="input-group">
	      <input type="text" id="flickr-searchinput" placeholder="search flickr" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Search</button>
	      </span>
	    </div><!-- /input-group -->


	   	<label class="radio-inline">
		  <input class="interestingness" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="interestingness-desc" checked="checked"> Interestingness
		</label>
		<label class="radio-inline">
		  <input class="relevance" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="relevance"> Relevance
		</label>

	</div> 
	
	<div class="flickr results"></div>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>

<div id="instagram-search" class="brick w2 stamp invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">	 

		<i class="fa fa-instagram"></i>
	  	
	  	<div class="input-group">
	      <input type="text" id="instragram-searchinput" placeholder="hashtag or coordinates" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Search</button>
	      </span>
	    </div><!-- /input-group -->

	</div> 

	<div class="instagram results"></div>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>


<div id="gmaps-search" data-type="gmaps" data-topic="" class="brick stamp invisible w2">
	<span class="cross"><i class="fa fa-close"></i></span>
	<span class="handle"> <i class="fa fa-arrows"></i></span>
	<span class="instagram"><i class="fa fa-instagram"></i></span>
	<span class="flickr-search"><i class="fa fa-flickr"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">

		<input id="pac-input" class="controls" type="text" placeholder="Enter a location">
		<div id="map-canvas"></div> 
	   
	   </div> 
	</div> 
</div>

<div id="soundcloud-search" class="brick stamp invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	<div class="container top-buffer-small  bottom-buffer-small">
	 
		<i class="fa fa-soundcloud"></i>

	  	<div class="input-group">
	      <input type="text" id="soundcloud-searchinput" placeholder="search soundcloud" class="form-control searchbox">
	      <span class="input-group-btn">
	        <button class="btn btn-default start" type="button">Search</button>
	      </span>
	    </div><!-- /input-group -->

	   	<label class="radio-inline">
		  <input class="bpm" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="bpm" checked="checked"> bpm
		</label>
		<label class="radio-inline">
		  <input class="license" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="relevance"> license
		</label>

	</div> 
	
	<table class="table table-hover soundcloud results"></table>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>