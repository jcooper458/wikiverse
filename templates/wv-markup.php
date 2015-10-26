<div id="global-search" class="search">
	<button type="button" class="close">×</button>

	<div class="search-container center buffer-top-large">

		<div class="row sourceParams" id="searchInput" >
			<input type="search" value="" placeholder="type any keyword here.." />
		</div>        

		<div class="row sourceParams" id="searchButton" >
			<button id="wv_search" type="submit" class="btn btn-primary btn-lg">Search</button>
		</div>
		<div class="row" id="searchResults" >
			<h3>wikiverse found content from following sources: </h3>
			<div class="resultsCount">
				<button id="wikis" 			source="wikis" 			fn="buildListResults" 		type="submit"  	class="btn btn-primary source">wikis</button>
				<button id="flickrs"  		source="flickrs"  		fn="getFlickrs" 	type="submit" 	class="btn btn-primary source"></button>
				<button id="instagrams" 	source="instagrams" 	fn="getInstagrams" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="youtubes" 		source="youtubes" 		fn="getYoutubes" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="twitters" 		source="twitters" 		fn="buildTwitterSearchResults" 		type="submit" 	class="btn btn-primary source"> </button>
				<button id="soundclouds" 	source="soundclouds" 	fn="buildListResults" type="submit" 	class="btn btn-primary source"> </button>
			</div>
		</div>
	</div>

</div>

<!--
<div id="advanced-search" class="search">
	<button type="button" class="close">×</button>

	<div class="search-container center buffer-top-large">

		<div class="row">
			<h3>Add content from any of the following sources..</h3>
			<select id="source" name="searchType" class="selectpicker" data-style="btn btn-default btn-lg" data-width="100%">
				<option value="">select a source</option>
				<option value="wikipedia">  <i class="fa fa-wikipedia"></i>wikipedia</option>
				<option value="youtube">    <i class="fa fa-youtube"></i>youtube</option>
				<option value="flickr">     <i class="fa fa-flickr"></i>flickr</option>
				<option value="instagram">  <i class="fa fa-instagram"></i>instagram</option>
				<option value="twitter">    <i class="fa fa-twitter"></i>twitter</option>
				<option value="soundcloud"> <i class="fa fa-soundcloud"></i>soundcloud</option>
				<option value="gmaps">      <i class="fa fa-map-marker"></i>gmaps</option>
			</select>
		</div> 

		<div class="row" id="addNote">
			<h3>..or write an own text..</h3>
			<button id="addNoteButton" type="button" style="display: block; width: 100%;" class="btn btn-lg btn-default">add a note</button>
		</div>    

		<div class="row sourceParams" id="wikipediaType" >
			<h4>Wikipedia, fine! Which language do you want?</h4>
			<?php //get_template_part('templates/languages'); ?>
		</div>  

		<div class="row sourceParams" id="instagramType" >
			<h4>Optionally select some more criteria, search by..</h4>
			<select name="input" class="selectpicker" data-style="btn btn-default" data-width="100%">
				<option value="hashtag">#hashtag</option>
				<option value="username"  >@username</option>
				<option value="coordinates" >coordinates</option>
			</select>
		</div>        

		<div class="row sourceParams" id="flickrType" >
			<h4>Optionally select some more criteria, search by..</h4>
			<select name="flickrType" class="selectpicker" data-style="btn btn-default" data-width="100%">
				<option value="textQuery">keyword</option>
				<option value="userQuery">username</option>
				<option value="geoQuery">coordinates</option>
			</select>
		</div>

		<div class="row sourceParams" id="flickrSort" >
			<h4>..optionally sort by..</h4>
			<select name="flickrSort" class="selectpicker" data-style="btn btn-default" data-width="100%">
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

</div>-->

<!-- Button trigger modal -->

<!-- Modal -->
<div class="modal fade" id="saveBoardModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="saveThisBoard">Save this board</h4>
        <h4 class="modal-title invisible" id="copyThisBoard">Copy this board</h4><br>
        <h5 class="modal-title invisible" id="copyThisBoardDescription">You are about to clone this board. It will then be listed under your boards. Enjoy modifying and enhancing it!</h5>

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
