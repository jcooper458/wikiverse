
  <nav id="rightSidebar" class="cbp-spmenu wv_sidebar cbp-spmenu-verticalRight cbp-spmenu-right fixed">

    <div id="searchMeta" class="fixed">
      <i id="closeRightSidebar" class="fa fa-close invisible"></i>
      <i id="openRightSidebar" class="fa fa-code-fork"></i>
    </div>
    <div id="mindmap"></div>
  </nav>

  <nav id="sidebar" class="cbp-spmenu wv_sidebar cbp-spmenu-vertical cbp-spmenu-left fixed">

    <div id="searchMeta" class="">

      <i id="closeSidebar" class="fa fa-close invisible"></i>
      <i id="openSidebar" class="fa fa-plus"></i>

      <div class="search-ui">


        <input id="search-keyword" type="text" class="form-control" placeholder="Search for...">

          <div class="" id="sourceType" >
            <select class="selectpicker sourceType show-menu-arrow" data-style="btn btn-default" data-width="100%">
              <!--<option ="">try another source..</option>-->
              <option selected><i class="fa fa-wikipedia wikipedia-icon icon"></i>Wikipedia</option>
              <option><i class="fa fa-youtube-square youtube-icon icon"></i>Youtube</option>
              <option><i class="fa fa-twitter twitter-icon icon"></i>Twitter</option>
              <option><i class="fa fa-flickr flickr-icon icon"></i>Flickr</option>
              <option><i class="fa fa-instagram instagram-icon icon"></i></div>Instagram</option>
              <option><i class="fa fa-soundcloud soundcloud-icon icon"></i>Soundcloud</option>
            </select>
          </div>

          <div class="sourceParams" id="languageType">
              <?php get_template_part('templates/languages'); ?>
          </div>

          <div type="Instagram" class="sourceParams" id="instagramType">
            <select id="instagramSearchType" name="input" class="selectpicker" data-style="btn btn-default" data-width="100%">
              <option value="hashtag">#hashtag</option>
              <option value="username">@username</option>
              <option value="coordinates" >coordinates</option>
            </select>
          </div>

          <div type="Flickr" class="sourceParams" id="flickrType">
            <select id="flickrSearchType" name="flickrType" class="selectpicker" data-style="btn btn-default" data-width="100%">
              <option value="textQuery">keyword</option>
              <option value="userQuery">username</option>
              <option value="geoQuery">coordinates</option>
            </select>
          </div>

          <div type="Flickr" class="sourceParams" id="flickrSort">
            <select id="flickrSortType" name="flickrSort" class="selectpicker" data-style="btn btn-default" data-width="100%">
              <option value="relevance">sort by relevance</option>
              <option value="interestingness-desc">sort by interestingness</option>
            </select>
          </div>

          <div type="Twitter" class="sourceParams" id="twitterType">
            <select id="twitterSearchType" name="twitterSearchType" class="selectpicker" data-style="btn btn-default" data-width="100%">
              <option value="popular">get popular results</option>
              <option value="recent">get recent results</option>
              <option value="mixed">get mixed results</option>
            </select>
          </div>

          <div type="Youtube" class="sourceParams" id="youtubeType">
            <select id="youtubeSortType" name="youtubeSort" class="selectpicker" data-style="btn btn-default" data-width="100%">
              <option value="relevance">sort by relevance</option>
              <option value="date">sort by date</option>
              <option value="viewCount">sort by view count</option>
              <option value="rating">sort by rating</option>
            </select>
          </div>

      </div>
    </div>  
    <div class="results"></div>
  </nav>
  
<div id="global-search" class="search">
	<button type="button" class="close">×</button>

	<div class="search-container center buffer-top-large">

		<div class="row" id="searchInput" >
			<input type="search" value="" placeholder="" />
		</div>


		<div class="row" id="searchResults" >
			<h3>wikiverse found content from following sources: </h3>
			<div class="resultsCount">
				<button id="Wikipedia" 		source="wikis" 			fn="buildListResults" 			type="submit"  	class="btn btn-primary source"></button>
				<button id="Flickr"  		source="flickrs"  		fn="buildFotoSearchResults" 	type="submit" 	class="btn btn-primary source"></button>
				<button id="Instagram" 		source="instagrams" 	fn="buildFotoSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Youtube" 		source="youtubes" 		fn="buildYoutubeSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Twitter" 		source="twitters" 		fn="buildTwitterSearchResults" 	type="submit" 	class="btn btn-primary source"> </button>
				<button id="Soundcloud" 	source="soundclouds" 	fn="buildListResults" 			type="submit" 	class="btn btn-primary source"> </button>
			</div>
		</div>
	</div>
</div>

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
