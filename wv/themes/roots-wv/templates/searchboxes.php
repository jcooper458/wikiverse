<div id="wikipedia-search" class="invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>

	<i class="fa fa-wikipedia"></i>&nbsp;Wikipedia

	<?php get_template_part('templates/languages'); ?>

	<div class="input-group">
		<input type="text" id="wiki-searchinput" placeholder="" class="form-control">
		<span class="input-group-btn">
			<button class="btn btn-default start"1 type="button">Search</button>
		</span>
	</div><!-- /input-group -->

	<table class="table table-hover wiki results"></table>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>

<div id="youtube-search" class="invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	
	<i class="fa fa-youtube"></i>&nbsp;Youtube Search

	<div class="input-group">
		<input type="text" id="youtube-searchinput" placeholder="" class="form-control searchbox">
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

<div id="flickr-search" class="invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>

	<i class="fa fa-flickr"></i>&nbsp;Flickr Search

	<div class="input-group-btn">
		<h5>Search by:  </h5>
		<div class="input-group-btn">
			<select id="flickrType" name="flickrType" class="selectpicker show-menu-arrow">
				<option value="textQuery">query</option>
				<option value="userQuery">username</option>
				<option value="geoQuery">coordinates</option>
			</select>
		</div><!-- /btn-group -->
		<div class="input-group">
			<input type="text" id="flickr-searchinput" placeholder="" class="form-control searchbox">
			<span class="input-group-btn">
				<button class="btn btn-default start" type="button">Search</button>
			</span>
		</div><!-- /input-group -->
	</div><!-- /input-group -->

	<h5>Sort by: </h5>

	<div class="radio-inline">
		<label><input class="interestingness" type="radio" name="sort" value="relevance" checked>Relevance</label>
	</div>
	<div class="radio-inline">
		<label><input class="relevance" type="radio" name="sort" value="interestingness-desc">Interestingness</label>
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

<div id="instagram-search" class="invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>
	
	<i class="fa fa-instagram"></i>&nbsp;Instagram Search

	<h5>Search by:  </h5>
	<div class="input-group-btn">
		<div class="input-group-btn">
			<select id="instagramType" name="input" class="selectpicker show-menu-arrow">
				<option value="hashtag"		>hashtag</option>
				<option value="username"	>username</option>
				<option value="coordinates"	>coordinates</option>
			</select>
		</div><!-- /btn-group -->
		<div class="input-group">
			<input type="text" id="instragram-searchinput" placeholder="" class="form-control form-inline searchbox">
			<span class="input-group-btn">
				<button class="btn btn-default start" type="button">Search</button>
			</span>
		</div><!-- /input-group -->
	</div><!-- /input-group -->

	<div class="instagram results"></div>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>


<div id="gmaps-search" data-type="gmaps" data-topic="" class="search brick invisible w2-map gmaps">
	<span class="cross"><i class="fa fa-close"></i></span>

	<span class="instagram"><i class="fa fa-instagram"></i></span>
	<span class="flickr-search"><i class="fa fa-flickr"></i></span>

	<i class="fa fa-map-marker"></i>&nbsp;Google Maps Search

	<input id="pac-input" class="controls" type="text" placeholder="Enter a location">
	<div id="map_canvas"></div>
	
</div>

<div id="soundcloud-search" class="invisible search">
	<span class="cross"><i class="fa fa-close"></i></span>

	<i class="fa fa-soundcloud"></i>&nbsp;Soundcloud Search

	<div class="input-group">
		<input type="text" id="soundcloud-searchinput" placeholder="" class="form-control searchbox">
		<span class="input-group-btn">
			<button class="btn btn-default start" type="button">Search</button>
		</span>
	</div><!-- /input-group -->

	<table class="table table-hover soundcloud results"></table>

	<div class="search-ui">
		<ul class="nav nav-pills">
			<li class="pull-right">
				<a class="clear"><h6>clear results</h6></a>
			</li>
		</ul>
	</div>
</div>
