<aside id="sidebar" role="complementary" class="<?php do_action( 'sidebar_class' ); ?>">
	<div id="inside-sidebar">
	
	<!-- <a onclick="goFullscreen();" class="button" id="fullscreen" >Go Fullscreen</a>-->
	
	<?php 
		
		$nonce_save = wp_create_nonce('savewall');
		$nonce_edit = wp_create_nonce('editwall');
	?>
	
	 <?php if ( !is_singular('wall') ): ?>	
		<aside class="widget">
		
		    	<h4>Create your own wall</h4>
		    	<input id="walltitle" type="text" placeholder="Insert a title.." />
		    	<textarea name="wallcontent" id="wallcontent" placeholder="Optionally insert a description.." ></textarea>
		    	
		    	
		    	
		    </aside>
		 <?php endif;?>	
		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		
		<?php if ( is_singular('wall') ){ // create the save wall buttons - either Add Wall or Edit Wall in regard to where you are (wikistart or single_wall)
			
			//user is logged in and can either edit other posts or is the author of the current post:
				global $current_user;
				get_currentuserinfo();
				if (is_user_logged_in() && (current_user_can('edit_others_posts') || $current_user->ID == $post->post_author) ) {
					wallC_edit_button($post->ID, $nonce_edit); // this function spits out the save button and is defined in wall-creator.php
				}
						
		}else{
		
			if ( is_user_logged_in() ) {echo '<div id="menu">'; wallC_button($nonce_save); echo '</div>'; }else{echo '<div id="menu"><a class="bp-button login-button orange" href="http://wikiver.se/login">Login</a> to create and save your own walls</div>';}
			
		} ?>	
		
		<?php endwhile; endif; ?>
	
		<aside class="widget">
		
		    <div class="brick" type="search" id="wikistart" data-sort="0" >	
		
		    		<?php if ( is_page() ): ?>	
		    		<div class="wikiforms">
		    		
		    			<input id="wikiverse-search" type="text" placeholder="Insert anything.." /><br>
		    			<input type="checkbox" name="wikipedia" value="wikipedia">Wikipedia<br>
		    			<input type="checkbox" name="youtube" value="youtube">YouTube<br>
		    			<input type="checkbox" name="youtube" value="youtube">Flickr<br>
		    		<a class="button black" id="start" href="#">Search</a><br>
		    			
		    		</div>	
		    		<?php endif;?>	
		
		    	   	 					
		    			
		</aside>		
		
		<aside class="widget">
		<h4>Google Maps</h4>	 
		       	 <div class="wikiforms">
		        	
		        	<select id="maptype" name="input">		
		    	    	
		    	    	<option>Roadmap</option>
		    	    	<option>Satellite</option>
		    	    	<option>Hybrid</option>
		    	    	<option>Terrain</option>
		    	    	
		    	    </select>
		        	
		        	<input id="gmaps" type="text" placeholder="Search Maps.." />
		        	<a class="button black" onclick="searchGmaps()" id="gmaps" href="#">Search</a>
		       
		       	 </div>	
		</aside>
		
		<aside class="widget">
		<h4>Wikipedia</h4>
		    	   	<div class="wikiforms">
		    	   	
		    			<?php
		    				infinity_get_template_part( 'templates/parts/select-language');
		    			?>
		    			
		    	    	<input id="wikiform" type="text" placeholder="Search Wikipedia.." />
		    	    	
		    	    	<a class="button black" id="wikipedia" onclick="searchWikipedia()" href="#">Search</a>
		
		    	   	 </div>	
		</aside>
		       	 	
		<aside class="widget">
		    <h4>YouTube</h4>
		    	<div class="wikiforms">
		
		       	 	<select id="maxutube" name="input">
		
		    	    	<option>&#8211; maximum results &#8211;</option>
		    	    	<option>1</option>
		    	    	<option>2</option>
		    	    	<option>3</option>
		    	    	<option>4</option>
		    	    	<option>5</option>
		    	    	<option>6</option>
		    	    	<option>7</option>
		    	    	<option>8</option>
		    	    	<option>9</option>
		    	    	<option>10</option>
		    	    	
		    	    </select>
		       	
		        	<input id="utubeform" type="text" placeholder="Search Youtube.." />
		        	    
		    	    <a class="button black youtube-button" onclick="searchYoutube()" id="videos" href="#">Search</a>
		       
		       	</div>		
		</aside>  	 				
		       	
		<aside class="widget">   	
		<h4>Flickr</h4> 
		       	 <div class="wikiforms">
		    	   	 
		    	   	 <select id="maxflickr" name="input">
		
		    	    	<option>&#8211; maximum results &#8211;</option>
		    	    	<option>1</option>
		    	    	<option>2</option>
		    	    	<option>3</option>
		    	    	<option>4</option>
		    	    	<option>5</option>
		    	    	<option>6</option>
		    	    	<option>7</option>
		    	    	<option>8</option>
		    	    	<option>9</option>
		    	    	<option>10</option>
		
		    	    </select>
		        	
		        	<input id="flickrform" type="text" placeholder="Search Flickr.." />
		        	
		    	    
		    	    <a class="button black" onclick="searchFlickr()" id="flickr" href="#">Search</a>
		       
		       	 </div>	
		</aside>
		       	 
		       	 
		<aside class="widget">
		<h4>Google</h4>	 
		       	 <div class="wikiforms">
		        	
		        	<input id="googleform" type="text" placeholder="Search Google.." />
		        	<a class="button black" id="google" href="#">Search</a>
		       
		       	 </div>	
		</aside>
		 <?php if ( is_singular('wall') ): ?>	
		    <aside class="widget">
		    <h4>Sorting</h4>	 
		    	  
		    			<div class="wikimenu">
		    				   	  	 
		    				   	  	<br>
		    				   	 	 <a onclick="sort('type');" class="button white" id="sort" >type</a>  
		    					   	 <a onclick="sort('number');" class="button white" id="sort" >chronos</a> 
		    					   	 <a onclick="sort('title');" class="button white" id="sort" >abc</a>
		    			</div>	
		    	
		    </aside>	
		 <?php endif;?>			   	 					
		</div>	
	</aside>
	
			
		</aside>
		</div>
	</div>
</aside>


		
