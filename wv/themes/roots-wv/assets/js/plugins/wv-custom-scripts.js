var $container = $('#packery');

var $wikiSearchBrick = $("#wikipedia-search");
var $youtubeSearchBrick = $("#youtube-search");
var $flickrSearchBrick = $("#flickr-search");
var $gmapsSearchBrick = $("#gmaps-search");

var close_icon = '<span class="cross"><i class="fa fa-close"></i></span>';
var youtube_icon = '<i class="fa fa-youtube-square"></i>';
var wikiverse_nav = '<div class="wikiverse-nav pull-left"><i class="fa fa-youtube-square youtube-icon icon"></i>&nbsp;<i class="fa fa-flickr flickr-icon icon"></i></div>';
var defaultBrick = '<div class="brick">' + close_icon + '<span class="handle"> <i class="fa fa-arrows"></i></span></div>';

$('.selectpicker').selectpicker();

getSearchBoxes();

// initialize Packery
$container.packery({
	itemSelector: '.brick',
	gutter: 10
});


//----------------EVENTS----------------------------

// REMOVE ITEM
$( "#packery" ).on( "click", ".cross", function() {
	var $thisBrick = jQuery(this).parent(".brick");
	$container.packery( 'remove', $thisBrick );
});


//create flickr interconnection button and trigger flickr search
$( "#packery" ).on("click", ".flickr-icon", function(){

	$flickrSearchBrick.removeClass("invisible");
	$container.append($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");
	
	$flickrSearchBrick.find('input').val(topic);
	$flickrSearchBrick.find('.searchbox').attr('disabled', 'true');
	$flickrSearchBrick.find('.start').addClass('disabled');

	$flickrSearchBrick.find('#sort-info').remove();

	$flickrSearchBrick.find('.start').trigger( "click" );

});

//create youtube interconnection button and trigger flickr search
$( "#packery" ).on("click", ".youtube-icon", function(){

	$youtubeSearchBrick.removeClass("invisible");
	$container.append($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);

	var $thisBrick = $(this).parents(".brick");

	var topic = $thisBrick.data("topic");
	
	$youtubeSearchBrick.find('input').val(topic);
	$youtubeSearchBrick.find('.searchbox').attr('disabled', 'true');
	$youtubeSearchBrick.find('.start').addClass('disabled');

	$youtubeSearchBrick.find('.start').trigger( "click" );

});


	//if article is about a location (has coordinates):
/*	
	if(wikitext.find('.geo-nondefault .geo').length){

		var geoPosition = wikitext.find('.geo-nondefault .geo').html();

		$brick.find('.wikiverse-nav').prepend('<i class="fa fa-map-marker gmaps-icon icon"></i>&nbsp;');

		//if click on gmaps interconnection
		$brick.find(".wikiverse-nav .gmaps-icon").on("click", function(){

			getGmapsSearch();
			

			$('#pac-input').val(topic);
			e = jQuery.Event("keypress");
			e.which = 13; //choose the one you want
		    d = jQuery.Event("keydown");
			d.keyCode = 50;
			$("#pac-input").trigger('click');
			//$("#pac-input").trigger(d);
			//  $("#pac-input").trigger(e);

		});

	}
	*/


//show save wall button on packery change (needs work)
$container.packery( 'on', 'layoutComplete', function( pckryInstance, laidOutItems ) {
	
	$("#saveWall").fadeIn();
	
});

$container.packery( 'on', 'layoutComplete', orderItems );
$container.packery( 'on', 'dragItemPositioned', orderItems );

//----------------EVENTS----------------------------

function getLanguage(langCode){

	var langarray = {

		'en'	:	'English'	,
		'de'	:	'Deutsch'	,
		'fr'	:	'Français'	,
		'nl'	:	'Nederlands'	,
		'it'	:	'Italiano'	,
		'es'	:	'Español'	,
		'pl'	:	'Polski'	,
		'ru'	:	'Русский'	,
		'ja'	:	'日本語'	,
		'pt'	:	'Português'	,
		'zh'	:	'中文'	,
		'sv'	:	'Svenska'	,
		'vi'	:	'Tiếng Việt'	,
		'uk'	:	'Українська'	,
		'ca'	:	'Català'	,
		'no'	:	'Norsk (Bokmål)'	,
		'fi'	:	'Suomi'	,
		'cs'	:	'Čeština'	,
		'fa'	:	'فارسی'	,
		'hu'	:	'Magyar'	,
		'ko'	:	'한국어'	,
		'ro'	:	'Română'	,
		'id'	:	'Bahasa Indonesia'	,
		'ar'	:	'العربية'	,
		'tr'	:	'Türkçe'	,
		'sk'	:	'Slovenčina'	,
		'kk'	:	'Қазақша'	,
		'eo'	:	'Esperanto'	,
		'da'	:	'Dansk'	,
		'sr'	:	'Српски / Srpski'	,
		'lt'	:	'Lietuvių'	,
		'eu'	:	'Euskara'	,
		'ms'	:	'Bahasa Melayu'	,
		'he'	:	'עברית'	,
		'bg'	:	'Български'	,
		'sl'	:	'Slovenščina'	,
		'vo'	:	'Volapük'	,
		'hr'	:	'Hrvatski'	,
		'war'	:	'Winaray'	,
		'hi'	:	'हिन्दी'	,
		'et'	:	'Eesti'	,
		'gl'	:	'Galego'	,
		'nn'	:	'Nynorsk'	,
		'az'	:	'Azərbaycanca'	,
		'simple'	:	'Simple English'	,
		'la'	:	'Latina'	,
		'el'	:	'Ελληνικά'	,
		'th'	:	'ไทย'	,
		'sh'	:	'Srpskohrvatski / Српскохрватски'	,
		'oc'	:	'Occitan'	,
		'new'	:	'नेपाल भाषा'	,
		'mk'	:	'Македонски'	,
		'ka'	:	'ქართული'	,
		'roa-rup'	:	'Armãneashce'	,
		'tl'	:	'Tagalog'	,
		'pms'	:	'Piemontèis'	,
		'be'	:	'Беларуская'	,
		'ht'	:	'Krèyol ayisyen'	,
		'te'	:	'తెలుగు'	,
		'uz'	:	'O‘zbek'	,
		'ta'	:	'தமிழ்'	,
		'be-x-old'	:	'Беларуская (тарашкевіца)'	,
		'lv'	:	'Latviešu'	,
		'br'	:	'Brezhoneg'	,
		'sq'	:	'Shqip'	,
		'ceb'	:	'Sinugboanong Binisaya'	,
		'jv'	:	'Basa Jawa'	,
		'mg'	:	'Malagasy'	,
		'cy'	:	'Cymraeg'	,
		'mr'	:	'मराठी'	,
		'lb'	:	'Lëtzebuergesch'	,
		'is'	:	'Íslenska'	,
		'bs'	:	'Bosanski'	,
		'hy'	:	'Հայերեն'	,
		'my'	:	'မြန်မာဘာသာ'	,
		'yo'	:	'Yorùbá'	,
		'an'	:	'Aragonés'	,
		'lmo'	:	'Lumbaart'	,
		'ml'	:	'മലയാളം'	,
		'fy'	:	'Frysk'	,
		'pnb'	:	'شاہ مکھی پنجابی (Shāhmukhī Pañjābī)'	,
		'af'	:	'Afrikaans'	,
		'bpy'	:	'ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী'	,
		'bn'	:	'বাংলা'	,
		'sw'	:	'Kiswahili'	,
		'io'	:	'Ido'	,
		'scn'	:	'Sicilianu'	,
		'ne'	:	'नेपाली'	,
		'gu'	:	'ગુજરાતી'	,
		'zh-yue'	:	'粵語'	,
		'ur'	:	'اردو'	,
		'ba'	:	'Башҡорт'	,
		'nds'	:	'Plattdüütsch'	,
		'ku'	:	'Kurdî / كوردی'	,
		'ast'	:	'Asturianu'	,
		'ky'	:	'Кыргызча'	,
		'qu'	:	'Runa Simi'	,
		'su'	:	'Basa Sunda'	,
		'diq'	:	'Zazaki'	,
		'tt'	:	'Tatarça / Татарча'	,
		'ga'	:	'Gaeilge'	,
		'cv'	:	'Чăваш'	,
		'ia'	:	'Interlingua'	,
		'nap'	:	'Nnapulitano'	,
		'bat-smg'	:	'Žemaitėška'	,
		'map-bms'	:	'Basa Banyumasan'	,
		'als'	:	'Alemannisch'	,
		'wa'	:	'Walon'	,
		'kn'	:	'ಕನ್ನಡ'	,
		'am'	:	'አማርኛ'	,
		'sco'	:	'Scots'	,
		'ckb'	:	'Soranî / کوردی'	,
		'gd'	:	'Gàidhlig'	,
		'bug'	:	'Basa Ugi'	,
		'tg'	:	'Тоҷикӣ'	,
		'mzn'	:	'مَزِروني'	,
		'hif'	:	'Fiji Hindi'	,
		'zh-min-nan'	:	'Bân-lâm-gú'	,
		'yi'	:	'ייִדיש'	,
		'vec'	:	'Vèneto'	,
		'arz'	:	'مصرى (Maṣrī)'	,
		'roa-tara'	:	'Tarandíne'	,
		'nah'	:	'Nāhuatl'	,
		'os'	:	'Иронау'	,
		'sah'	:	'Саха тыла (Saxa Tyla)'	,
		'mn'	:	'Монгол'	,
		'sa'	:	'संस्कृतम्'	,
		'pam'	:	'Kapampangan'	,
		'hsb'	:	'Hornjoserbsce'	,
		'li'	:	'Limburgs'	,
		'mi'	:	'Māori'	,
		'si'	:	'සිංහල'	,
		'se'	:	'Sámegiella'	,
		'co'	:	'Corsu'	,
		'gan'	:	'贛語'	,
		'glk'	:	'گیلکی'	,
		'bar'	:	'Boarisch'	,
		'bo'	:	'བོད་སྐད'	,
		'fo'	:	'Føroyskt'	,
		'ilo'	:	'Ilokano'	,
		'bcl'	:	'Bikol'	,
		'mrj'	:	'Кырык Мары (Kyryk Mary) '	,
		'fiu-vro'	:	'Võro'	,
		'nds-nl'	:	'Nedersaksisch'	,
		'ps'	:	'پښتو'	,
		'tk'	:	'تركمن / Туркмен'	,
		'vls'	:	'West-Vlams'	,
		'gv'	:	'Gaelg'	,
		'rue'	:	'русиньскый язык'	,
		'pa'	:	'ਪੰਜਾਬੀ'	,
		'xmf'	:	'მარგალური (Margaluri)'	,
		'pag'	:	'Pangasinan'	,
		'dv'	:	'Divehi'	,
		'nrm'	:	'Nouormand/Normaund'	,
		'zea'	:	'Zeêuws'	,
		'kv'	:	'Коми'	,
		'koi'	:	'Перем Коми (Perem Komi)'	,
		'km'	:	'ភាសាខ្មែរ'	,
		'rm'	:	'Rumantsch'	,
		'csb'	:	'Kaszëbsczi'	,
		'lad'	:	'Dzhudezmo'	,
		'udm'	:	'Удмурт кыл'	,
		'or'	:	'ଓଡ଼ିଆ'	,
		'mt'	:	'Malti'	,
		'mhr'	:	'Олык Марий (Olyk Marij)'	,
		'fur'	:	'Furlan'	,
		'lij'	:	'Líguru'	,
		'wuu'	:	'吴语'	,
		'ug'	:	'ئۇيغۇر تىلى'	,
		'frr'	:	'Nordfriisk'	,
		'pi'	:	'पाऴि'	,
		'sc'	:	'Sardu'	,
		'zh-classical'	:	'古文 / 文言文'	,
		'bh'	:	'भोजपुरी'	,
		'ksh'	:	'Ripoarisch'	,
		'nov'	:	'Novial'	,
		'ang'	:	'Englisc'	,
		'so'	:	'Soomaaliga'	,
		'stq'	:	'Seeltersk'	,
		'kw'	:	'Kernewek/Karnuack'	,
		'nv'	:	'Diné bizaad'	,
		'vep'	:	'Vepsän'	,
		'hak'	:	'Hak-kâ-fa / 客家話'	,
		'ay'	:	'Aymar'	,
		'frp'	:	'Arpitan'	,
		'pcd'	:	'Picard'	,
		'ext'	:	'Estremeñu'	,
		'szl'	:	'Ślůnski'	,
		'gag'	:	'Gagauz'	,
		'gn'	:	'Avañe'	,
		'ln'	:	'Lingala'	,
		'ie'	:	'Interlingue'	,
		'eml'	:	'Emiliàn e rumagnòl'	,
		'haw'	:	'Hawai`i'	,
		'xal'	:	'Хальмг'	,
		'pfl'	:	'Pfälzisch'	,
		'pdc'	:	'Deitsch'	,
		'rw'	:	'Ikinyarwanda'	,
		'krc'	:	'Къарачай-Малкъар (Qarachay-Malqar)'	,
		'crh'	:	'Qırımtatarca'	,
		'ace'	:	'Bahsa Acèh'	,
		'to'	:	'faka Tonga'	,
		'as'	:	'অসমীয়া'	,
		'ce'	:	'Нохчийн'	,
		'kl'	:	'Kalaallisut'	,
		'arc'	:	'Aramaic'	,
		'dsb'	:	'Dolnoserbski'	,
		'myv'	:	'Эрзянь (Erzjanj Kelj)'	,
		'pap'	:	'Papiamentu'	,
		'bjn'	:	'Bahasa Banjar'	,
		'sn'	:	'chiShona'	,
		'tpi'	:	'Tok Pisin'	,
		'lbe'	:	'Лакку'	,
		'lez'	:	'Лезги чІал (Lezgi č’al)'	,
		'kab'	:	'Taqbaylit'	,
		'mdf'	:	'Мокшень (Mokshanj Kälj)'	,
		'wo'	:	'Wolof'	,
		'jbo'	:	'Lojban'	,
		'av'	:	'Авар'	,
		'srn'	:	'Sranantongo'	,
		'cbk-zam'	:	'Chavacano de Zamboanga'	,
		'bxr'	:	'Буряад'	,
		'ty'	:	'Reo Mā`ohi'	,
		'lo'	:	'ລາວ'	,
		'kbd'	:	'Адыгэбзэ (Adighabze)'	,
		'ab'	:	'Аҧсуа'	,
		'tet'	:	'Tetun'	,
		'mwl'	:	'Mirandés'	,
		'ltg'	:	'Latgaļu'	,
		'na'	:	'dorerin Naoero'	,
		'kg'	:	'KiKongo'	,
		'ig'	:	'Igbo'	,
		'nso'	:	'Sesotho sa Leboa'	,
		'za'	:	'Cuengh'	,
		'kaa'	:	'Qaraqalpaqsha'	,
		'zu'	:	'isiZulu'	,
		'chy'	:	'Tsetsêhestâhese'	,
		'rmy'	:	'romani - रोमानी'	,
		'cu'	:	'Словѣньскъ'	,
		'tn'	:	'Setswana'	,
		'chr'	:	'ᏣᎳᎩ'	,
		'got'	:	'Gothic'	,
		'cdo'	:	'Mìng-dĕ̤ng-ngṳ̄'	,
		'sm'	:	'Gagana Samoa'	,
		'bi'	:	'Bislama'	,
		'mo'	:	'Молдовеняскэ'	,
		'bm'	:	'Bamanankan'	,
		'iu'	:	'ᐃᓄᒃᑎᑐᑦ'	,
		'pih'	:	'Norfuk'	,
		'ss'	:	'SiSwati'	,
		'sd'	:	'سنڌي، سندھی ، सिन्ध'	,
		'pnt'	:	'Ποντιακά'	,
		'ee'	:	'Eʋegbe'	,
		'ki'	:	'Gĩkũyũ'	,
		'om'	:	'Oromoo'	,
		'ha'	:	'هَوُسَ'	,
		'ti'	:	'ትግርኛ'	,
		'ts'	:	'Xitsonga'	,
		'ks'	:	'कश्मीरी / كشميري'	,
		'fj'	:	'Na Vosa Vakaviti'	,
		'sg'	:	'Sängö'	,
		've'	:	'Tshivenda'	,
		'rn'	:	'Kirundi'	,
		'cr'	:	'Nehiyaw'	,
		'ak'	:	'Akana'	,
		'tum'	:	'chiTumbuka'	,
		'lg'	:	'Luganda'	,
		'dz'	:	'ཇོང་ཁ'	,
		'ny'	:	'Chi-Chewa'	,
		'ik'	:	'Iñupiak'	,
		'ch'	:	'Chamoru'	,
		'ff'	:	'Fulfulde'	,
		'st'	:	'Sesotho'	,
		'tw'	:	'Twi'	,
		'xh'	:	'isiXhosa'	,
		'ng'	:	'Oshiwambo'	,
		'ii'	:	'ꆇꉙ'	,
		'cho'	:	'Choctaw'	,
		'mh'	:	'Ebon'	,
		'aa'	:	'Afar'	,
		'kj'	:	'Kuanyama'	,
		'ho'	:	'Hiri Motu'	,
		'mus'	:	'Muskogee'	,
		'kr'	:	'Kanuri'	,
		'hz'	:	'Otsiherero'
	};

	var language = langarray[langCode];

	return language;

}

function buildNextTopic($brick, lang){

	$brick.find("a").unbind('click').click(function(e) {

		e.preventDefault();

		var topic = $(this).attr("title");
		$(this).contents().unwrap();

		//note how this is minus 1 because the first brick will have already a tabindex of 1 whilst when saved in db it will start from 0
		buildWikipedia(topic, lang, $brick.attr("tabindex") - 1);
		return false;
	});
}

function getGmapsSearch(){

	$gmapsSearchBrick.removeClass("invisible");
	$container.append($gmapsSearchBrick).packery( 'prepended', $gmapsSearchBrick);
	$gmapsSearchBrick.each( makeEachDraggable );

	var mapOptions = {
		center: {lat: 35, lng: 0},
		zoom: 1
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var input = document.getElementById('pac-input');

	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.bindTo('bounds', map);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		infowindow.close();
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

	// Set the position of the marker using the place ID and location
	marker.setPlace({
		placeId: place.place_id,
		location: place.geometry.location
	});
	marker.setVisible(true);

	infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	//	'Place ID: ' + place.place_id + '<br>' +
	place.formatted_address);

	infowindow.open(map, marker);
});

	google.maps.event.addListener(map, 'idle', function() {

		currentMap = {
			center: map.getCenter().toUrlValue(),
			bounds: {
				southWest : map.getBounds().getSouthWest().toUrlValue(),
				northEast : map.getBounds().getNorthEast().toUrlValue()
			},
			maptype: map.getMapTypeId()
		};

		$gmapsSearchBrick.data("topic", currentMap );

	});

	google.maps.event.addListener(map, 'maptypeid_changed', function() {

		currentMap.maptype = map.getMapTypeId();

		$gmapsSearchBrick.data( "topic", currentMap );

	});

	var thePanorama = map.getStreetView(); //get the streetview object

	//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {

		console.log(thePanorama);

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$gmapsSearchBrick.data( "type", "streetview" );
			$gmapsSearchBrick.data( "topic", currentStreetMap );
		}

	});

		//detect if entering Streetview -> Change the type to streetview
		google.maps.event.addListener(thePanorama, 'pov_changed', function() {

			if (thePanorama.getVisible()) {
				console.log(thePanorama);
				currentStreetMap = {
					center: thePanorama.position.toUrlValue(),
					zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$gmapsSearchBrick.data( "topic", currentStreetMap );
		}

	});



	}

function buildGmaps(mapObj){

	var map;
	var myMaptypeID;
	var currentMap;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map-canvas"></div>');

	var $mapbrick = $(defaultBrick);

	$mapbrick.data('type', 'gmaps');
	$mapbrick.addClass('w2');
	$mapbrick.prepend($mapcanvas);

	$container.append($mapbrick).packery( 'appended', $mapbrick);

	$mapbrick.each( makeEachDraggable );


	if (mapObj.maptype.toLowerCase() === "roadmap"){
		myMaptypeID = google.maps.MapTypeId.ROADMAP;
	}
	else if(mapObj.maptype.toLowerCase() === "satellite"){
		myMaptypeID = google.maps.MapTypeId.SATELLITE;
	}
	else if(mapObj.maptype.toLowerCase() === "hybrid"){
		myMaptypeID = google.maps.MapTypeId.HYBRID;
	}
	else if(mapObj.maptype.toLowerCase() === "terrain"){
		myMaptypeID = google.maps.MapTypeId.TERRAIN;
	}

	//It is necessairy to re-build a valid LatLng object. The one recreated from the JSON string is invalid.
	var myCenter = new google.maps.LatLng(mapObj.center.split(",")[0], mapObj.center.split(",")[1]);


	//same for the bounds, on top we need to rebuild LatLngs to re-build a bounds object
	var LatLngNe = new google.maps.LatLng(mapObj.bounds.northEast.split(",")[0], mapObj.bounds.northEast.split(",")[1]);
	var LatLngSw = new google.maps.LatLng(mapObj.bounds.southWest.split(",")[0], mapObj.bounds.southWest.split(",")[1]);

	//last but not least: the bound object with the newly created Latlngs
	var myBounds = new google.maps.LatLngBounds(LatLngSw, LatLngNe);

	var mapOptions = {
		zoom: 8,
		center: myCenter,
		scrollwheel: false,
		mapTypeId: myMaptypeID
	};

	map = new google.maps.Map($mapcanvas[0], mapOptions);

	map.fitBounds(myBounds);

	google.maps.event.addListener(map, 'idle', function() {

		currentMap = {
			center: map.getCenter().toUrlValue(),
			bounds: {
				southWest : map.getBounds().getSouthWest().toUrlValue(),
				northEast : map.getBounds().getNorthEast().toUrlValue()
			},
			maptype: map.getMapTypeId()
		};

		$mapbrick.data( "topic", currentMap );

	});

	google.maps.event.addListener(map, 'maptypeid_changed', function() {

		currentMap.maptype = map.getMapTypeId();

		$mapbrick.data( "topic", currentMap );

	});

	var thePanorama = map.getStreetView(); //get the streetview object

	//detect if entering Streetview -> Change the type to streetview
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {

		if (thePanorama.getVisible()) {

			currentStreetMap = {
				center: thePanorama.position.toUrlValue(),
				zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$mapbrick.data( "type", "streetview" );
			$mapbrick.data( "topic", currentStreetMap );
		}

	});

		//detect if entering Streetview -> Change the type to streetview
		google.maps.event.addListener(thePanorama, 'pov_changed', function() {

			if (thePanorama.getVisible()) {

				currentStreetMap = {
					center: thePanorama.position.toUrlValue(),
					zoom: thePanorama.pov.zoom,
				//adress: thePanorama.links[0].description,
				pitch: thePanorama.pov.pitch,
				heading: thePanorama.pov.heading
			};
			$mapbrick.data( "topic", currentStreetMap );
		}

	});

	}

function buildStreetMap(streetObj) {

	var $mapbrick;
	var currentStreetMap;

	var $mapcanvas = $('<div id="map-canvas"></div>');

	var $mapbrick = $(defaultBrick);

	$mapbrick.data('type', 'streetview');
	$mapbrick.addClass('w2');
	$mapbrick.prepend($mapcanvas);

	$container.append($mapbrick).packery( 'appended', $mapbrick);
	$mapbrick.each( makeEachDraggable );


	var myCenter = new google.maps.LatLng(streetObj.center.split(",")[0], streetObj.center.split(",")[1]);

	var panoramaOptions = {
		position:myCenter,
		zoomControl: false,
		linksControl: false,
		panControl: false,
		disableDefaultUI: true,
		pov: {
			heading: parseFloat(streetObj.heading),
			pitch: parseFloat(streetObj.pitch),
			zoom: parseFloat(streetObj.zoom)
		},
		visible:true
	};

	var thePanorama = new google.maps.StreetViewPanorama($mapcanvas[0], panoramaOptions);

	google.maps.event.addListener(thePanorama, 'pov_changed', function() { //detect if entering Streetview

		currentStreetMap = {
			center: thePanorama.position.toUrlValue(),
			zoom: thePanorama.pov.zoom,
			//adress: thePanorama.links[0].description,
			pitch: thePanorama.pov.pitch,
			heading: thePanorama.pov.heading
		};

		$mapbrick.data( "topic", currentStreetMap );

	});

	//if nothing changes, re-save the data-topic (otherwise its lost upon resave without moving)
	$mapbrick.data( "topic", streetObj );
}

function buildFlickr(photoURL){

	var $flickrPhoto = $('<img width="280" src="'+photoURL+'">');

	var $flickrBrick = $(defaultBrick);

	$flickrBrick.data('type', 'flickr');
	$flickrBrick.data('topic', photoURL);

	$container.append($flickrBrick).packery( 'appended', $flickrBrick);

	$flickrBrick.each( makeEachDraggable );

	$flickrBrick.imagesLoaded(function(instance){

		$flickrBrick.append($flickrPhoto);
		$container.packery();
	});
}

function strip(html)
{
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function getFlickrs(topic, sort) {

	//if sort not passed, set it to interesting
	if(!sort){

		sort = 'interestingness-desc';
	}

	var $divFlickrResults;

	//if no table is already in the brick
	if($flickrSearchBrick.find('div.flickr').length === 0){

		$divFlickrResults = $('<div class="flickr"></div>');
		$flickrSearchBrick.append($divFlickrResults);
	}
	else{

		$divFlickrResults = $('div.flickr');

	}
	$.ajax({
		url: 'https://api.flickr.com/services/rest',
		data:{

			method: 'flickr.photos.search',
			api_key: '1a7d3826d58da8a6285ef7062f670d30',
			text: topic,
			format: 'json',
			nojsoncallback: 1,
			per_page: 20,
			sort: sort
		},
		success: function(data){

			$.each(data.photos.photo, function(){

				$.ajax({
					url: 'https://api.flickr.com/services/rest',
					data:{

						method: 'flickr.photos.getSizes',
						api_key: '1a7d3826d58da8a6285ef7062f670d30',
						photo_id: this.id,
						format: 'json',
						nojsoncallback: 1
					},
					success: function(data){

						var thumbURL = data.sizes.size[1].source;
						var mediumURL = data.sizes.size[6].source;

						//append row to searchbox-table
						$divFlickrResults.append('<img width="145" large="'+mediumURL+'" src="'+thumbURL+'">');

						//relayout packery
						//$container.packery();

						$divFlickrResults.find('img').unbind('click').click(function(e) {

							var thisURL = $(this).attr('large');
							buildFlickr(thisURL);
							$(this).remove();
						});

										//if no nav is already in the brick
										if($flickrSearchBrick.find('.nav').length === 0 ){

							//append a clear button and the wikipedia icon
							$flickrSearchBrick.append('<div class="search-ui"><ul class="nav nav-pills"><li class="pull-right"><a class="clear"><h6>clear results</h6></a></li></ul></div');

						}

						//when clear results is clicked
						$('.clear').on('click', function(){

								//remove all UI elements
								$divFlickrResults.remove();
								$(this).parents('.search-ui').remove();

								//empty the wiki-searchbox for new search
								$('#flickr-searchinput').val('');
							});

						//relayout packery
						$container.packery();

					}

				});
});

},
error: function (data){
	console.log(data);
            /*var $container = $('#packery');
            var content = "Flickr error..";
            var $box = $('<p></p>').append(content);
                $box = $('<div class="brick "></div>').append($box);

				$container.append($box).packery( 'appended', $box );
				*/

				return false;
			}
		});
}

function getYoutubes(topic) {

	var $tableYoutubeResults;

	//if no table is already in the brick
	if($youtubeSearchBrick.find('table.youtube').length === 0){

		$tableYoutubeResults = $('<table class="table table-hover youtube"></table>');
		$youtubeSearchBrick.append($tableYoutubeResults);

	}
	else{

		$tableYoutubeResults = $('table.youtube');

	}


	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/search',
		data:{

			q: topic,
			key: 'AIzaSyCtYijGwLNP1Vf8RuitR5AgTagybiIFod8',
			part: 'snippet'
		},
		dataType:'jsonp',
		success: function(data){



			if(data.items ){
				$.each(data.items, function(){

					console.log(this);

					var title = this.snippet.channelTitle;
					var snippet = this.snippet.description;
					var youtubeID = this.id.videoId;
					var thumbnailURL = this.snippet.thumbnails.default.url;

					//append row to searchbox-table
					$tableYoutubeResults.append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td class="youtubeThumb"><img src="'+thumbnailURL+'"></td><td class="result" youtubeID="'+youtubeID+'">'+title+'</td></tr>');

					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});

					//bind event to every row -> so you can start the wikiverse
					$tableYoutubeResults.find('tr').unbind('click').click(function(e) {

						var currentYoutubeID = $(this).find('.result').attr('youtubeID');

						$(this).tooltip('destroy');
						$(this).remove();

						buildYoutube(currentYoutubeID);

						return false;
					});

				});

				//if no nav is already in the brick
				if($youtubeSearchBrick.find('.nav').length === 0 ){

					//append a clear button and the wikipedia icon
					$youtubeSearchBrick.append('<div class="search-ui"><ul class="nav nav-pills"><li class="pull-right"><a class="clear"><h6>clear results</h6></a></li></ul></div');

				}

				//when clear results is clicked
				$('.clear').on('click', function(){

					//remove all UI elements
					$tableYoutubeResults.remove();
					$(this).parents('.search-ui').remove();

					//empty the youtube-searchbox for new search
					$('#youtube-searchinput').val('');
				});

				//relayout packery
				$container.packery();

			//nothing has been found on Wikipedia
		}else{

				//append row to searchbox-table: NO RESULTS
				$tableYoutubeResults.append('<tr class="no-results"><td>No Youtube Videos found for "'+topic+'"</td></tr>');

				//destroy all UI after 2 seconds
				setTimeout( function(){

					//if only one result is there, delete everything
					if($('table#youtube.results tr').length ===  1){

						//remove all UI elements
						$tableYoutubeResults.remove();

						//empty the wiki-searchbox for new search
						$('#youtube-searchinput').val('');

					}else{
						//only remove the not-found row
						$tableYoutubeResults.find('.no-results').remove();
						$('#youtube-searchinput').val('');
					}


				}, 2000 );

			}

		},
		error: function (data){

			var $container = $('#packery');
			var content = "Wikipedia seems to have the hickup..";
			var $box = $('<p></p>').append(content);
			$box = $('<div class="brick "></div>').append($box);

			$container.append($box).packery( 'appended', $box );


			return false;
		}
	});
}

function getWikiLanguages(topic, lang, $brick){

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'query',
			titles:topic,
			prop:'langlinks',
			format:'json',
			lllimit: 500
		},
		dataType:'jsonp',
		success: function(data){

			var languageObj = data.query.pages[Object.keys(data.query.pages)[0]].langlinks;

			var langDropDown = $('<select class="selectpicker pull-right show-menu-arrow" data-size="20" data-live-search="true"></select>');

			$.each(languageObj, function(){

				langDropDown.append('<option value="'+this.lang+'" data-topic="'+this['*']+'">'+getLanguage(this.lang)+'</option>');

			});

			langDropDown.prepend('<option selected>Read in..</option>');

			$brick.prepend(langDropDown);

			//make it a beautiful dropdown with selectpicker
			langDropDown.selectpicker();

			langDropDown.change(function(){

				var lang = $(this).children(":selected").attr('value');
				var topic = $(this).children(":selected").data('topic');

				buildWikipedia(topic, lang, $brick.attr("tabindex"));
			});


		}
	});

}

function getWikis(topic, lang) {

	var $tableWikiResults;

	//if no table is already in the brick
	if($wikiSearchBrick.find('table.wiki').length === 0){

		$tableWikiResults = $('<table class="table table-hover wiki"></table>');
		$wikiSearchBrick.append($tableWikiResults);

	}
	else{

		$tableWikiResults = $('table.wiki');

	}

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'query',
			list:'search',
			srsearch:topic,
			format:'json'
		},
		dataType:'jsonp',
		success: function(data){

			if(data.query.search.length !== 0 ){

				$.each(data.query.search, function(){

					var title = this.title;
					var snippet = this.snippet;

					//append row to searchbox-table
					$tableWikiResults.append('<tr data-toggle="tooltip" title="'+strip(snippet)+'"><td><el class="result">'+title+'</el></td></tr>');

					//create the tooltips
					$('tr').tooltip({animation: true, placement: 'bottom'});
					//bind event to every row -> so you can start the wikiverse
					$tableWikiResults.find('tr').unbind('click').click(function(e) {

						var topic = $(this).find('.result').html();

						buildWikipedia(topic, lang, -1);

						$(this).tooltip('destroy');
						$(this).remove();
						return false;
					});

				});

				//if no nav is already in the brick
				if($wikiSearchBrick.find('.nav').length === 0 ){

					//append a clear button and the wikipedia icon
					$wikiSearchBrick.append('<div class="search-ui"><ul class="nav nav-pills"><li class="pull-right"><a class="clear"><h6>clear results</h6></a></li></ul></div');

				}

				//when clear results is clicked
				$('#clear').on('click', function(){

						//remove all UI elements
						$tableWikiResults.remove();
						$(this).parents('.search-ui').remove();

						//empty the wiki-searchbox for new search
						$('#wiki-searchinput').val('');
					});

				//relayout packery
				$container.packery();

			//nothing has been found on Wikipedia
		}else{

				//append row to searchbox-table: NO RESULTS
				$tableWikiResults.append('<tr class="no-results"><td>No Wikipedia articles found for "'+topic+'"</td></tr>');

				//destroy all UI after 2 seconds
				setTimeout( function(){

					//if only one result is there, delete everything
					if($('table#wiki.results tr').length ===  1){

						//remove all UI elements
						$tableWikiResults.remove();

						//empty the wiki-searchbox for new search
						$('#wiki-searchinput').val('');

					}else{
						//only remove the not-found row
						$tableWikiResults.find('.no-results').remove();
						$('#wiki-searchinput').val('');
					}


				}, 2000 );

			}
		},
		error: function (data){

			var $container = $('#packery');
			var content = "Wikipedia seems to have the hickup..";
			var $box = $('<p></p>').append(content);
			$box = $('<div class="brick "></div>').append($box);

			$container.append($box).packery( 'appended', $box );


			return false;
		}
	});
}

function buildWikipedia(topic, lang, parent){

	var $brick = $(defaultBrick);

	$brick.data('type', 'wiki');
	$brick.data('parent', parent);
	$brick.data('lang', lang);
	$brick.data('topic', topic);
	
	$brick.prepend('<p><h2>'+topic+'</h2></p>');
	$brick.prepend( wikiverse_nav );

	$container.append($brick).packery( 'appended', $brick);

	$brick.each( makeEachDraggable );
		//$container.packery( 'bindDraggabillyEvents', $brick );

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: topic,
			format:'json',
			prop:'sections',
			/*disableeditsection: true,
			disablepp: true,
			//preview: true,
			sectionprevue: true,
			section:0,
			disabletoc: true,
			mobileformat:true*/
		},
		dataType:'jsonp',
		success: function(data){
			//onsole.log(data)

			$tableSectionResults = $('<table class="table table-hover wiki"></table>');
			$brick.append($tableSectionResults);

			data.parse.sections.forEach(function(section){
				//console.log(section);
				$tableSectionResults.append('<tr><td><div class="result" title="' + section.anchor + '" index="' + section.index + '">' + section.line + '</div></td></tr>');
				
			});			

			$tableSectionResults.find(".result").on('click', function() {

				var index = $(this).attr("index");
				console.log(index);
				//$(this).remove();

				buildSection(topic, lang, index, $brick.attr("tabindex"));
	
			});

			//enable to create new bricks out of links
			buildNextTopic($brick, lang);
			getWikiLanguages(topic, lang, $brick);

			$container.packery();
		}
	});
}

function buildSection(topic, lang, index, parent){

	console.log(lang);

	var $brick = $(defaultBrick);

	$brick.data('type', 'wiki');
	$brick.data('parent', parent);
	$brick.data('lang', lang);
	$brick.data('topic', topic);
	
	$brick.prepend('<p><h2>'+topic+'</h2></p>');
	$brick.prepend( wikiverse_nav );

	$container.append($brick).packery( 'appended', $brick);

	$brick.each( makeEachDraggable );
		//$container.packery( 'bindDraggabillyEvents', $brick );

	$.ajax({
		url: 'http://'+lang+'.wikipedia.org/w/api.php',
		data:{
			action:'parse',
			page: topic,
			format:'json',
			prop:'text',
			disableeditsection: true,
			disablepp: true,
			//preview: true,
			//sectionprevue: true,
			section: index,
			disabletoc: true,
			mobileformat:true
		},
		dataType:'jsonp',
		success: function(data){
			
		

			//enable to create new bricks out of links
			buildNextTopic($brick, lang);
			getWikiLanguages(topic, lang, $brick);*/

			$container.packery();
		}
	});	


}

function buildWall(){

	var str = $("#wikiverse").html();

	var wikiverse =	JSON.parse(str);

	$.each(wikiverse, function() {

		if(this.Type === "wiki"){
			buildWikipedia(this.Topic, this.Language, this.Parent);
		}
		if(this.Type === "flickr"){
			buildFlickr(this.Topic);
		}
		if(this.Type === "youtube"){
			buildYoutube(this.Topic);
		}
		if(this.Type === "gmaps"){
			buildGmaps(this.Topic);
		}
		if(this.Type === "streetview"){
			buildStreetMap(this.Topic);
		}
	});
}



function buildYoutube(youtubeID){

	var $iframe = '<iframe id="ytplayer" type="text/html" width="290" height="190" src="http://www.youtube.com/embed/'+youtubeID+'" frameborder="0"/>';

	var $youtubeBrick = $(defaultBrick);

	$youtubeBrick.data('type', 'youtube');
	$youtubeBrick.data('topic', youtubeID);

    $youtubeBrick.append($iframe);

	$container.append($youtubeBrick).packery( 'appended', $youtubeBrick);

	$youtubeBrick.each( makeEachDraggable );

}


function makeEachDraggable( i, itemElem ) {
    // make element draggable with Draggabilly
    var draggie = new Draggabilly( itemElem, {
    	handle: '.handle'
    } );
    // bind Draggabilly events to Packery
    $container.packery( 'bindDraggabillyEvents', draggie );
}


function getSearchBoxes(){

	var lang = $("#langselect").val();

	$( "#langselect" ).change(function() {

		lang = $(this).val();

	});

	//WIKIPEDIA AUTOCOMPLETE
	$('#wiki-searchinput').typeahead({
		source: function(query, process) {
			return $.ajax({
				url: "http://"+lang+".wikipedia.org/w/api.php",
				dataType: "jsonp",
				data: {
					'action': "opensearch",
					'format': "json",
					'search': query
				},
				success: function(json) {
					process(json[1]);
				}

			});
		},
		matcher: function (item) {
			if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
				return true;
			}
		}
	});

	//YOUTUBE AUTOCOMPLETE
	$('#youtube-searchinput').typeahead({

		source: function(query, process) {
			return $.ajax({
				url: "http://suggestqueries.google.com/complete/search",
				dataType: "jsonp",
				data: {
					'client': "youtube",
					'ds': "yt",
					'q': query
				},
				success: function(json) {

					var resultArray = [];

					$.each(json[1], function(){

						resultArray.push(this[0]);

					});

					process(resultArray);
				}

			});
		},
		matcher: function (item) {
			if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
				return true;
			}
		}
	});

	$("#wikipedia-icon").on("click", function(){

		$wikiSearchBrick.removeClass("invisible");
		$container.append($wikiSearchBrick).packery( 'prepended', $wikiSearchBrick);

	});



	$("#wikipedia-search .start").on("click", function(){

		var topic = $("#wiki-searchinput").val();
		getWikis( topic, lang );

	});

	/*$("#wiki-searchinput").keyup(function(event){
		if(event.keyCode === 13){
			getWikis( topic, lang );
		}
	});*/




$("#youtube-icon").on("click", function(){

	$youtubeSearchBrick.removeClass("invisible");
	$container.append($youtubeSearchBrick).packery( 'prepended', $youtubeSearchBrick);
});

$("#youtube-search .start").on("click", function(){

	var topic = $("#youtube-search .searchbox").val();
	getYoutubes( topic );

});


$("#flickr-icon").on("click", function(){

	$flickrSearchBrick.removeClass("invisible");
	$container.append($flickrSearchBrick).packery( 'prepended', $flickrSearchBrick);
});

$("#flickr-search .start").on("click", function(){

	var query = $("#flickr-search .searchbox").val();
	var sort = $("#flickr-search #sort-info input[type='radio']:checked").val();

	getFlickrs(query, sort);

});

$("#gmaps-icon").on("click", function(){
	getGmapsSearch();
});


}


function orderItems() {
	var itemElems = $container.packery('getItemElements');
	for ( var i=0, len = itemElems.length; i < len; i++ ) {
		var elem = itemElems[i];

		$(elem).attr( "tabindex", i );
	}
}


function createWall(wpnonce) {

	var wikiverse = {};

	//remove search bricks:
	var searchBricks = jQuery(".search");
	$container.packery( 'remove', searchBricks );

	var itemElems = $container.packery('getItemElements');

	var tabindex = 0;

	$.each(itemElems, function(){

		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var language = $(this).data('lang');
		var parent = $(this).data('parent');

		wikiverse[tabindex] = {

			Type: type,
			Topic: topic,
			Language: language,
			Parent: parent
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
				url: "/wp-admin/admin-ajax.php",
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

function editWall(wpnonce) {

	var postid = $('#postID').html();

	var wikiverse = {};

	//remove search bricks:
	var searchBricks = jQuery(".search");
	$container.packery( 'remove', searchBricks );

	var itemElems = $container.packery('getItemElements');

	//var tabindex = 0;

	$.each(itemElems, function(){

		var type = $(this).data('type');
		var topic = $(this).data('topic');
		var language = $(this).data('lang');
		var parent = $(this).data('parent');
		var tabindex = $(this).attr('tabindex');

		wikiverse[tabindex] = {

			Type: type,
			Topic: topic,
			Language: language,
			Parent: parent

		};

	});

	var JSONwikiverse = JSON.stringify(wikiverse);

	$.ajax({
		type: 'POST',
		url: "/wp-admin/admin-ajax.php",
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
			alert("cdascsacsa");
		}
	});
}
