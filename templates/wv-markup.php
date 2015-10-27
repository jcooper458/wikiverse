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
				<button id="Wikipedia" 		source="wikis" 			fn="buildListResults" 			type="submit"  	class="btn btn-primary source">wikis</button>
				<button id="Flickr"  		source="flickrs"  		fn="buildFotoSearchResults" 	type="submit" 	class="btn btn-primary source"></button>
				<button id="Instagram" 		source="instagrams" 	fn="buildFotoSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Youtube" 		source="youtubes" 		fn="buildYoutubeSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Twitter" 		source="twitters" 		fn="buildTwitterSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Soundcloud" 	source="soundclouds" 	fn="buildListResults" 			type="submit" 	class="btn btn-primary source"> </button>
			</div>
		</div>
	</div>

</div>

<!--


		<div class="row" id="addNote">
			<h3>..or write an own text..</h3>
			<button id="addNoteButton" type="button" style="display: block; width: 100%;" class="btn btn-lg btn-default">add a note</button>
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
