
function buildHomeWikipedia(topic){

	var $brick = $(".homeWiki");

	$brick.prepend('<p><h3>' + topic + '</h3></p>');

	//Go get the first Paragraph of the article
	$.ajax({
		url: 'http://en.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: topic,
			format:'json',
			prop:'text',
			section:0,
			preview: true,
			mobileformat:true,
			redirects: true
		},
		dataType:'jsonp',
		success: function(data){

			if (data.parse.text['*'].length > 0) {
				var infobox = $(data.parse.text['*']).find('p:first');
				
				infobox.find('.error').remove();
				infobox.find('.reference').remove();
				infobox.find('.references').remove();
				infobox.find('.org').remove();

				infobox.find('img').unwrap();
				
				$brick.append(infobox);				

				pckry.reloadItems();	
				pckry.layout();	
			}
		}
	});
}


//Go get the infobox
/*$.ajax({
	url: 'http://'+lang+'.wikipedia.org/w/api.php',
	data:{
		action:'parse',
		page: topic,
		format:'json',
		prop:'text',
		disableeditsection: true,
		disablepp: true,
		//preview: true,
		sectionprevue: true,
		section:0,
		disabletoc: true,
		mobileformat:true
	},
	dataType:'jsonp',
	success: function(data){

		var infobox = $(data.parse.text['*']).find('.infobox');

		if (infobox.length){

			infobox.find('.error').remove();
			infobox.find('.reference').remove();
			infobox.find('.references').remove();
			infobox.find('.org').remove();
			infobox.find('*').css('max-width', '290px');
			infobox.find('img').unwrap();

			$brick.append(infobox);

		}
		//enable to create new bricks out of links
		buildNextTopic($brick, lang);
		getWikiLanguages(topic, lang, $brick);

		$packeryContainer.packery();
	}
});*/



/*
function getFlickrExifData($brick, photoObj){

	$brick.find('.getExifButton').on('click', function(e) {
		
		e.preventDefault();

		//if(($(this).parents('.row').find('.exif').is(':empty'))){
			$.ajax({
				url: 'https://api.flickr.com/services/rest',
				data:{

					method: 'flickr.photos.getExif',
					api_key: '1a7d3826d58da8a6285ef7062f670d30',
					photo_id: photoObj.id,
					format: 'json',
					nojsoncallback: 1,
					per_page: 40
				},
				success: function(data){
					console.log(data)
					if (data.stat === "ok") {
						console.log(data)
						//$brick.find('.exif').html(data.person.username._content);
					}
				}
			});
		//}	
	});		
}
*/
