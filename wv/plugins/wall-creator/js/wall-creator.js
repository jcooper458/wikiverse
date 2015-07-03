function apfaddpost(wpnonce) { 
	
	
	var wikiverse = {};

	  var $container = $('#packery');
	  
	  //remove search bricks: 
	  var searchBricks = jQuery(".search");
	  $container.packery( 'remove', searchBricks );
			
	  var itemElems = $container.packery('getItemElements');
	  
	  var tabindex = 0;
	  
	  $.each(itemElems, function(){
		  
		  var type = $(this).data('type');
		  var topic = $(this).data('title');
		  var language = $(this).data('lang');
		  
		  wikiverse[tabindex] = {
		  
		  		Type: type,
		  		Topic: topic,
		  		Language: language,
			  
		  };
		  
		
		  tabindex++;
		  
	  });
	
	var JSONwikiverse = JSON.stringify(wikiverse);
		
	
	
		$("#saveWallModal").modal('show');
	
		 $('#wallTitle').keyup(function () {
		 
			$("#wallSubmitButton").prop('disabled', false);
		 }); 
		 
			$("#wallSubmitButton").on("click", function(){
				
				
				var value=$.trim($("#wallTitle").val());

				if(value.length>0)
				{
				
					var title = $('#wallTitle').val();
					
					$.ajax({  
					    type: 'POST',  
					    url: apfajax.ajaxurl,  
					    data: {  
					        action: 'apf_addpost',  
					        walltitle: title,
					        wallmeta: JSONwikiverse,
					        nonce: wpnonce
					    },  
					    success: function(data, textStatus, XMLHttpRequest) {  
					        var id = '#apf-response';  
					        $(id).html('');  
					        $(id).append(data);  
							history.pushState('', 'wikiverse', data);
					    },  
					    error: function(MLHttpRequest, textStatus, errorThrown) {  
					        alert("cdascsacsa");  
					    }  
					}); 
					
					$("#saveWallModal").modal('hide');
					
				 
				}
				else{
					
					$('#wallTitle').parent(".form-group").addClass("has-error");
					
				}
			
			}); 
				 
}

function apfeditpost(wpnonce) { 
	
	var postid = $('#postID').html();
	
	var wikiverse = {};

	  var $container = $('#packery');
	  
	  //remove search bricks: 
	  var searchBricks = jQuery(".search");
	  $container.packery( 'remove', searchBricks );
			
	  var itemElems = $container.packery('getItemElements');
	  
	  var tabindex = 0;
	  
	  $.each(itemElems, function(){
		  
		  var type = $(this).data('type');
		  var topic = $(this).data('title');
		  var language = $(this).data('lang');
		  
		  wikiverse[tabindex] = {
		  
		  		Type: type,
		  		Topic: topic,
		  		Language: language,
			  
		  };
		  
		  tabindex++;
		  
	  });
	
	var JSONwikiverse = JSON.stringify(wikiverse);
	
	    
	    $.ajax({  
	        type: 'POST',  
	        url: apfajax.ajaxurl,  
	        data: {  
	            action: 'apf_editpost',  
	            wallID: postid,
	            wallmeta: JSONwikiverse,
	            nonce: wpnonce
	        },  
	        success: function(data, textStatus, XMLHttpRequest) {  
	            var id = '#apf-response';  
	            $(id).html('');  
	            $(id).append(data);  
	    		
	        },  
	        error: function(MLHttpRequest, textStatus, errorThrown) {  
	            alert("Error in the AJAX for saving the wall");  
	        }  
	    }); 
	    
			 
}