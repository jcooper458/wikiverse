<div id="search">
	<span class="cross close control-buttons"><i class="fa fa-close"></i></span>

	<div class="search-container center buffer-top-large">

		<div class="row">
			<h3>First select a source..</h3>
			<select id="source" name="searchType" class="selectpicker" data-style="btn btn-default btn-lg" data-width="100%">
				<option value=""></option>
				<option value="wikipedia">  <i class="fa fa-wikipedia"></i>wikipedia</option>
				<option value="youtube">    <i class="fa fa-youtube"></i>youtube</option>
				<option value="flickr">     <i class="fa fa-flickr"></i>flickr</option>
				<option value="instagram">  <i class="fa fa-instagram"></i>instagram</option>
				<option value="twitter">    <i class="fa fa-twitter"></i>twitter</option>
				<option value="soundcloud"> <i class="fa fa-soundcloud"></i>soundcloud</option>
				<option value="gmaps">      <i class="fa fa-map-marker"></i>gmaps</option>
			</select>
		</div>    

		<div class="row sourceParams" id="wikipediaType" >
			<h3>Wikipedia, fine! Which language do you want?</h3>
			<?php get_template_part('templates/languages'); ?>
		</div>  

		<div class="row sourceParams" id="instagramType" >
			<h3>Optionally select some more criteria, search by..</h3>
			<select name="input" class="selectpicker" data-style="btn btn-default btn-lg" data-width="100%">
				<option value="hashtag">#hashtag</option>
				<option value="username"  >@username</option>
				<option value="coordinates" >coordinates</option>
			</select>
		</div>        

		<div class="row sourceParams" id="flickrType" >
			<h3>Optionally select some more criteria, search by..</h3>
			<select name="flickrType" class="selectpicker" data-style="btn btn-default btn-lg" data-width="100%">
				<option value="textQuery">keyword</option>
				<option value="userQuery">username</option>
				<option value="geoQuery">coordinates</option>
			</select>
		</div>

		<div class="row sourceParams" id="flickrSort" >
			<h3>..optionally sort by..</h3>
			<select name="flickrSort" class="selectpicker" data-style="btn btn-default btn-lg" data-width="100%">
				<option value="relevance">by relevance</option>
				<option value="interestingness-desc">by interestingness</option>
			</select>
		</div>

		<div class="row sourceParams" id="searchInput" >
			<input type="search" value="" placeholder="type any keyword here.." />
		</div>        

		<div class="row sourceParams" id="searchButton" >
		<button id="wv_search" type="submit" class="btn btn-primary btn-lg">Search</button>
		</div>

	</div>

</div>