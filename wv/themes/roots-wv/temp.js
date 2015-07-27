
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