<script type="text/javascript">

function buildWall(){

	var rows = jQuery("#brickdata tr"); // find the table containing all the data
			i = 1;
			var timer = new Array();
			
			rows.each(function(index) {
				
				var id = jQuery(this).find("#index").html();
				
				var type = jQuery(this).find("#type").html();
				
				i++;
				
				if (type == "wiki"){
					var topic = jQuery(this).find("#topic").html(); 
					var lang = jQuery(this).find("#lang").html();
					var pics = jQuery(this).find("#pictures").html();
					//timer[i] = setTimeout(function() {buildWikipedia(id, topic, lang)}, i * 100);
					buildWikipedia(id, topic, lang, pics);
				}
				/*
				else if (type == "youtube"){
					var videoid = jQuery(this).find("#videoid").html();
					var title = jQuery(this).find("#title").html();
					var query = jQuery(this).find("#query").html();
					//timer[i] = setTimeout(function() {buildUtube(topic, id)}, i * 100);
					buildUtubeBrick(videoid, title, query, id);
				
				} */
				else if (type == "flickr"){
					var mediumurl = jQuery(this).find("#mediumurl").html();
					var bigurl = jQuery(this).find("#bigurl").html();  
					var query = jQuery(this).find("#topic").html();
					//timer[i] = setTimeout(function() {buildFlickr(mediumurl, bigurl, topic, id)}, i * 200);
					buildFlickrBrick(mediumurl, bigurl, query, id);
					
				} 
				else if (type == "gmaps"){
					var z = jQuery(this).find("#z").html();
					var y = jQuery(this).find("#y").html();
					var $center = new google.maps.LatLng(y, z);
					var zoom = jQuery(this).find("#zoom").html();
					var maptype = jQuery(this).find("#maptype").html();
					if (maptype == "streetview"){
					
						var heading = jQuery(this).find("#heading").html();
						var pitch = jQuery(this).find("#pitch").html();
						
						buildStreetview($center, heading, zoom, pitch, maptype, id);
						
					}else{
						
						buildGmaps($center, zoom, maptype, id);
					}
					
				} 
			 });
}

function searchGmaps(){

	
		var adress = jQuery("input#gmaps").val(); 
		var maptype = jQuery("#maptype").val();
		
		//create the geocoder 	
		var geocoder = new google.maps.Geocoder(); 	
		
		//geocode adress
		geocoder.geocode( { 'address': adress}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {		     
		  	
		    var $center = results[0].geometry.location;    
		    
		  } else {
		    alert("Geocode was not successful for the following reason: " + status);
		  }
		  
		  buildGmaps($center, 10, maptype);
		  
		 });

}

function buildGmaps($center, zoom, maptype, ide) {

  var map;	   
  var $container = jQuery('#listing'); 
  
  var $mapcanvas = jQuery('<div id="map_canvas"></div>');
    $mapbrick = $mapcanvas.prepend('<span class="cross"></span>');
    $mapbrick = jQuery('<div class="brick w2" data-sort="'+ide+'" zoom="'+zoom+'" maptype="'+maptype+'" y="'+$center.hb+'" z="'+$center.ib+'" type="gmaps"></div>').append($mapbrick);	
    removeCandy($mapbrick);
  
  $container.append($mapbrick).packery( 'appended', $mapbrick);	
  
  if (maptype.toLowerCase() == "roadmap"){
    MY_MAPTYPE_ID = google.maps.MapTypeId.ROADMAP;
  }
  else if(maptype.toLowerCase() == "satellite"){
	MY_MAPTYPE_ID = google.maps.MapTypeId.SATELLITE;
  }
  else if(maptype.toLowerCase() == "hybrid"){
	MY_MAPTYPE_ID = google.maps.MapTypeId.HYBRID; 
  }
  else if(maptype.toLowerCase() == "terrain"){
	MY_MAPTYPE_ID = google.maps.MapTypeId.TERRAIN; 
  }
    
   var center = new google.maps.LatLng($center.hb, $center.ib);
     
   var mapOptions = {
     zoom: Number(zoom),
     center: $center,        
     mapTypeId: MY_MAPTYPE_ID      
   }
   map = new google.maps.Map($mapcanvas[0], mapOptions);
    	        
   google.maps.event.addListener(map, 'idle', function() {
   		console.log("inmap");
   		var center = map.getCenter();
   		var zoom = map.getZoom();
   		var maptype = map.getMapTypeId();
   		
   		$mapbrick.attr("y", center.hb);
   		$mapbrick.attr("z", center.ib);
   		$mapbrick.attr("zoom", zoom);
   		$mapbrick.attr("maptype", maptype);
   		
   });
   
   /*google.maps.event.addListener(map, 'click', function() {
   
   		var center = map.getCenter();   		
   		var adress = codeLatLng(center.Ya, center.Za);   	
   		 		
   		$mapbrick.attr("adress", adress);   
   		
   });*/
   
   var thePanorama = map.getStreetView(); //get the streetview object

   google.maps.event.addListener(thePanorama, 'pov_changed', function() { //detect if entering Streetview
  
   		$mapbrick.attr("maptype", "streetview");
   		$mapbrick.attr("y", thePanorama.position.hb);
   		$mapbrick.attr("z", thePanorama.position.ib); 
   		$mapbrick.attr("zoom", thePanorama.pov.zoom);
   		$mapbrick.attr("adress", thePanorama.links[0].description);
   		$mapbrick.attr("heading", thePanorama.pov.heading);
   		$mapbrick.attr("pitch", thePanorama.pov.pitch);
   		         
   });
   
}

function buildStreetview($center, heading, zoom, pitch, maptype, ide) {

  var $container = jQuery('#listing'); 
  
  var $mapcanvas = jQuery('<div id="map_canvas"></div>');
      $mapbrick = $mapcanvas.prepend('<span class="cross"></span>');
      $mapbrick = jQuery('<div class="brick w2" data-sort="'+ide+'" zoom="'+zoom+'" maptype="'+maptype+'" y="'+$center.hb+'" z="'+$center.ib+'" type="gmaps"></div>').append($mapbrick);	
      removeCandy($mapbrick);
  	
  $container.append($mapbrick).packery( 'appended', $mapbrick);

  var center = new google.maps.LatLng($center.hb, $center.ib);

	var panoramaOptions = {
    	position:center,
    	pov: {
    	  heading: Number(heading),
    	  pitch: Number(pitch),
    	  zoom: Number(zoom)
    	},
    	visible:true
    	}
 
  var thePanorama = new google.maps.StreetViewPanorama($mapcanvas[0], panoramaOptions);

  google.maps.event.addListener(thePanorama, 'pov_changed', function() { //detect if entering Streetview
   		
   		$mapbrick.attr("zoom", thePanorama.pov.zoom);
   		$mapbrick.attr("heading", thePanorama.pov.heading);
   		$mapbrick.attr("pitch", thePanorama.pov.pitch);
   		//$mapbrick.attr("adress", thePanorama.links[0].description);
   		$mapbrick.attr("y", thePanorama.position.hb);
   		$mapbrick.attr("z", thePanorama.position.ib);        
   });

}

var adress;

function codeLatLng(lat, lng) {
 	
 	var geocoder = new google.maps.Geocoder();
 
 	
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
	        adress = results[1].formatted_address;
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }

});

return adress
}

function getLang(){ 

jQuery("#langselect").live('change',function(){

	var language = jQuery("select#langselect :selected").val();
	
	jQuery("#wikiform").val("");
	
	wikiform(language);

});

}

function autocompleteUtube(){

jQuery("#utubeform").autocomplete({
    source: function(request, response) {
      jQuery.ajax({
            url: "http://"+language+".wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});
}

function buildSoundcloud(ide){

SC.initialize({

  client_id: '15bc70bcd9762ddca2e82ee99de9e2e7'
  
});

var track_url = 'http://soundcloud.com/forss/flickermood';
var $container = jQuery('#listing');


SC.get('/tracks', { q: 'buskers', license: 'cc-by-sa' }, function(tracks) {
  console.log(tracks);
});
return false; 
SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {

      $SoundCloud = jQuery("<div class='container'></div>").append(oEmbed.html);
  	  $SoundCloud = $SoundCloud.prepend('<span class="cross"></span>');
      $SoundCloud = jQuery("<div class='brick w2' type='soundcloud' data-sort='"+ide+"' query='"+track_url+"'></div>").append($SoundCloud);	
      removeCandy($SoundCloud);
  
  $container.packery( 'appended', $SoundCloud);

});
	
}

function searchYoutube(){

		var videoquery = jQuery("#utubeform").val();
		var maxresults = jQuery("#maxutube").val();		
		
		buildUtube(videoquery, maxresults);
}
      

function searchFlickr(){
	
		var flickrquery = jQuery("#flickrform").val();
		var maxresults = jQuery("#maxflickr").val();
		buildFlickr(flickrquery, maxresults);
	
}

function buildFlickr(flickrquery, maxresults){
	
		jQuery.getJSON('http://api.flickr.com/services/rest/?format=json&extras=url_m, url_n, url_z, url_c, url_l, url_o&method=flickr.photos.search&api_key=e941605ac9af3466c1c46f15ec9e4d92&tags=' + flickrquery + '&per_page=' + maxresults + '&sort=relevance&jsoncallback=?', 
		function(data){
			i = 1;
			var timer = new Array();
			jQuery.each(data.photos.photo, function(i, foto){
				
				
				var mediumurl = foto.url_m;
				var bigurl = foto.url_l;
				
				i++;
				timer[i] = setTimeout(function() {buildFlickrBrick(mediumurl, bigurl, flickrquery)}, i * 200);
             
			});
			
		});
}

function buildUtube(videoquery, maxresults, ide){
  
  jQuery.getJSON('https://gdata.youtube.com/feeds/api/videos?v=2&max-results='+maxresults+'&q='+videoquery+'&alt=jsonc', 
		
    function(data){
        jQuery.each(data.data.items, function(key, value){ 
        	
        	buildUtubeBrick(value.id, value.title, videoquery, ide);
            	       
        });
    });
	
}

function buildFlickrBrick(mediumurl, bigurl, flickrquery, ide){
	
	var $container = jQuery('#listing');
				
    var $flickrPic = jQuery('<a href="'+bigurl+'"><img src="'+mediumurl+'" class="small-image"></a>');
        $flickrPic = jQuery("<div class='container'></div>").append($flickrPic);
    	$flickrPic = $flickrPic.prepend('<span class="cross"></span>');
        $flickrPic = jQuery("<div class='brick' title='"+flickrquery+"'data-sort='"+ide+"' type='flickr'></div>").append($flickrPic);	
        removeCandy($flickrPic);
       
	    
		$container.append($flickrPic).packery( 'appended', $flickrPic);
}

function buildUtubeBrick(videoId, title, query, ide){
	
	  
  var $container = jQuery('#listing');
  
  var $Utube = jQuery('<iframe width="280" height="200" src="http://www.youtube.com/embed/'+videoId+'" frameborder="0" allowfullscreen></iframe>');
      $Utube = jQuery("<div class='container'></div>").append($Utube);
  	  $Utube = $Utube.prepend('<span class="cross"></span>');
      $Utube = jQuery("<div class='brick' type='youtube' data-sort='"+ide+"' query='"+query+"' title='"+title+"' videoid='"+videoId+"'></div>").append($Utube);	
      removeCandy($Utube);
  
  $container.append($Utube).packery( 'appended', $Utube);
}

function wikiform(language){

jQuery("#wikiform").autocomplete({
    source: function(request, response) {
      jQuery.ajax({
            url: "http://"+language+".wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});

}

function wikiverse_search(){
/*
jQuery(".wikiverse-search").autocomplete({
    source: function(request, response) {
      jQuery.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});*/

/*jQuery("a#start").unbind('click').click(function() {

	var topic = jQuery("#wikiverse-search").val();
	
	buildWikipedia("1", topic, "en");
	buildFlickr(topic, 5);	
	buildUtube(topic, 5, 1);
	
	});
*/
}

/*function sort(param){
	
	jQuery('#listing').isotope({ sortBy : param });
	jQuery('#listing').attr('datasort', param)
	return false;
}*/

function furtherAuthor($post, lang){
	//console.log($dhis);
	$post.find("a").unbind('click').click(function(e) {
		
		e.preventDefault();
		
		var $topic = jQuery(this).attr("title");
 		jQuery(this).contents().unwrap();
 		
 		var id = $post.attr("data-sort");
 		buildWikipedia(id, $topic, lang);
 		jQuery("a#editWall").html('Save Wall');
        jQuery("a#editWall").fadeIn("slow");
 		return false;
	});
}

function searchWikipedia() {

	var author = jQuery("#wikiform").val();

	var $post = jQuery(this).parents(".brick");
	var lang = jQuery("#langselect").val();
	var id = $post.attr("data-sort");
	console.log(lang);

	//if (lang==""){lang = "eng"}

	buildWikipedia(id, author, lang);
}

function removeCandy($post){

	var $container = jQuery('#listing');
	
	var cross = jQuery($post).find("span.cross");
	
	cross.on('click', function(){
		
		jQuery("a#editWall").html('Save Wall');
        jQuery("a#editWall").fadeIn("slow");
		$container.packery( 'remove', $post);
		
	});
}

function langArray(language){

var langarray = 	{ 
	
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
'hz'	:	'Otsiherero'	,


}	

lang = langarray[language];

  return lang; 	
  
/* THIS IS TO CREATE A DROPDOWN WITH ALL WIKIPEDIA LANGUAGES
var langDropDown = " ";   //initiate a drop down
  	langDropDown += '<select class="large gfield_select" id="langselect" name="input_17">';
    langDropDown += "<option>-- select a Language --</option>";	
        		
  	jQuery.each(langarray, function(key, value) {
        
       langDropDown += "<option rel='"+ value +"' value='" + key + "'>" + value + "</option>";	 //get both, language and title      			
        	
 	});
  	
  	langDropDown += "</select>"; 
  	  
  	console.log(jQuery(langDropDown));*/
  	
  	

}

function interWiki($authorCard, wiki, language){ // this is for the submit a rC form, to get the language for the wikipedia retrieval of the tags/articles

	jQuery.ajax({
	
       	url: 'http://'+language+'.wikipedia.org/w/api.php',
         	data: {
            action:'query',
       	    prop:'langlinks',
            titles:wiki,
            format:'json',
            lllimit:'90'
           },     
           dataType:'jsonp',
           success: function(data) {
          
          		var langDropDown = " ";   //initiate a drop down
          		  		
          		jQuery.each(data.query.pages, function(k, v){ //iterate through language json
              		 
              		langDropDown += "<select id='langDropDown' pageid='" + k + "'>";
              		langDropDown += "<option>read in other languages</option>";
              		
              		jQuery.each(v.langlinks, function(key, value){ //one level deeper
              			 
              			langDropDown += '<option rel="'+ value.lang +'" value="' + value['*'] + '">' + langArray(value.lang) + '</option>';	 //get both, language and title      			
              			    			
              			
         			});	
          		});
          		 
          		langDropDown += "</select>";   
          		
          		if( jQuery(langDropDown).find('option').length > 1){
          		     	    	    	     		     			
          			$authorCard.find(".wikicontainer").prepend(langDropDown);
          		
          		}
          		
          		//jQuery('#listing').isotope('reLayout');
             
              	$authorCard.find('select#langDropDown').change(function(){
            
	 				var lang = jQuery(this).find("option:selected").attr("rel");	
	 				var author = jQuery(this).attr("value");	
	 				var id = $authorCard.attr("data-sort");
	 				
	 				buildWikipedia(id, author, lang);
	 				//gridster Creator(id, author, lang);
 				
	 			});
          	},
          	error: function (data){
          	
          	   	console.log("error");
          	   	return false; 
          	}
          	
      });
}

function keepIniPad(){

//var a=document.getElementsByTagName("a");
var a=jQuery("a.thumbLink, a#showTitle, #footer a, a.ab-item, a#seemore");

for(var i=0;i<a.length;i++) {
    if(!a[i].onclick && a[i].getAttribute("target") != "_blank") {
        a[i].onclick=function() {
                window.location=this.getAttribute("href");
                return false; 
        }
    }
}

} 		

function buildWikipedia(ide, author, language, pics) {

 
var title = author;
var $titleclass = title.replace(/\s+/g, '-').toLowerCase();

var $post = jQuery('div[data-sort="'+ide+'"]');


 var $container = jQuery('#listing');
 var $box_loading = jQuery('<div class="wikicontainer"></div>').append($box_loading);
     $box_loading = jQuery("<div class='brick'>Loading...</div>");	
  
  $container.append($box_loading).packery( 'appended', $box_loading);
 

/*var container = document.querySelector('#listing');

var pckry = new Packery( container, {

		  // options
		  itemSelector: '.brick',
		  gutter: 10,
		
		});
    var loading = document.createElement('div');
    loading.className = 'brick';
    container.appendChild( loading );
  
  // add and lay out newly appended elements
  pckry.appended( loading );*/


  jQuery.ajax({
		
		url: 'http://'+language+'.wikipedia.org/w/api.php',
      	data: {
         	action:'parse',
		     prop:'text',
             page:title,
          	format:'json',
          	redirects:'',
          	//section:'0'
        },
        dataType:'jsonp',
       	success: function(data) {
       	
		    if(typeof data.parse != 'undefined'){
		    	
		    	var $container = jQuery('#listing');
		 
		     	var wikidesc = jQuery("<div>"+data.parse.text['*']+"<div>").children('p');
		    	var wikicard = jQuery("<div>"+data.parse.text['*']+"<div>").children('.infobox');		    				
		    	var pictures = jQuery("<div>"+data.parse.text['*']+"<div>").children('.thumb');
		     		     	
		    	wikidesc.find('sup').remove();
		    	wikidesc.find('span.IPA').remove();
		    	wikidesc.find('span.nowrap').remove();
		    	wikidesc.find('.dablink').remove();
		    	wikidesc.find('.editsection').remove();
		    	wikidesc.find('.magnify').remove();
		    	wikidesc.find('.toc').remove(); 
		    	wikidesc.find('.error').remove();            	
                wikidesc.find('a[href$="ogg"]').remove();            	
				wikidesc.find('a:contains("edit")').remove();          	
                
                var $desc = wikidesc.html();
                var $card = wikicard.html();
                
		   		if($desc){

		   			$container.packery( 'remove', $box_loading);
		   	
		    		var $box_desc = jQuery('<p></p>').append($card);//start building the buildWikipedia Candy
		    		if ($card){
		    			$box_desc = $box_desc.append("<br><div id='line'></div><br>" );}//line of separation between Card and Description
		    		    $box_desc = $box_desc.append($desc);

		    		    $box_desc = jQuery('<div class="wikicontainer"></div>').append($box_desc);
		    		    $box_desc.prepend('<span class="cross"></span>');   		    
                        $box_desc = jQuery('<div class="brick" type="wiki" title="'+title+'"  data-sort="'+ide+'" language="'+language+'" haspics='+pics+'"></div>').append($box_desc);
                        	    		    		
						$container.append($box_desc).packery( 'appended', $box_desc);

						removeCandy($box_desc);

						var container = document.querySelector('#listing');
						var pckry = new Packery( container, {
						  // options
						  itemSelector: '.brick',
						  gutter: 10,

						});

						var itemElems = pckry.getItemElements();
						// for each item...
						for ( var i=0, len = itemElems.length; i < len; i++ ) {
						  var elem = itemElems[i];
						  // make element draggable with Draggabilly
						  var draggie = new Draggabilly( elem );
						  // bind Draggabilly events to Packery
						  pckry.bindDraggabillyEvents( draggie );
						}
						
					 	//keepIniPad();
					 	//toggleCandy();						 		
		    		    furtherAuthor($box_desc, language);
		    		   // interWiki($box_desc, title, language);
		    		    
		    		    		    		       	    	    	  	    			
		    			/*---------------------WIKIMORE----------------------------------*/
					 	var wikimore = wikidesc.next();
		    	    	var moreWiki = function (wikimore){ //this is the function to insert wikiMores into our isotope DOM
		    	    		
		    	    		var $more = wikimore.html();
		    	   
					 		var $line = jQuery("<div id='line'></div>" );			
		    	    		$box_desc = $box_desc.append($line); // here we are building the Button to trigger further wikiMores
		    	    		$box_desc = $box_desc.append("<p id='moreWiki'>More</p>");
		    	    		
		    	    	//	$container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    		
		    	    		$box_desc.find("p#moreWiki").click(function() {
				    			
				    			var $wikimore = jQuery('<p></p>').append($more);
				    			
				    			jQuery(this).replaceWith($wikimore);
				    			
				    			//jQuery('#listing').isotope('reLayout');
				    			
				    			var $parent = $wikimore.parent(".brick");				    		
				    			var wikinext = wikimore.next();
				    	
				    			if(wikinext.next().next().length){
					    			moreWiki(wikinext.next());	
					    		}
					    		furtherAuthor($parent, lang);				    					    								 	
				    			keepIniPad();			    			
					    		return false;
       							
				    		});
				    	}
				    	moreWiki(wikimore);	
						
		    				    
		    	}//if something has been found
		    	else{	    		
		    					
		    		var $container = jQuery('#listing,.listing');
		    			$loading = jQuery(".loading");
						$container.packery( 'remove', $loading);
  					    $container.packery( 'remove', $box_loading);
					var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
					var $box = jQuery('<p></p>').append($content);
				
					    $box = jQuery('<div class="container"></div>').append($box);
					    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}	
					    $box = jQuery('<div class="brick" color='+$color+'></div>').append($box);					
					
					$container.packery( 'appended', $box );	
 					removeCandy($box);
 					return false; 
		    					    		   	
		    	}//else show the "be the first to write this article"	
		    			    		
		    			    	
		    	/*---------------------PICTURES----------------------------------*/

		    	if(pictures.length > 0){
		    
		    		var $line = jQuery("<div id='line'></div>" );			
		    	    $box_desc = $box_desc.append($line); // here we are building the Button to trigger further picturess
		    	    $box_desc = $box_desc.append("<p id='pictures'>Pictures</p>");
		    	   // $container.isotope('reLayout');//this is to prevent the Pictures About button to be overlap other candies. relayout always fixes possible overlap pingsc
		    	    
		    	    var addPictures = function (pictures, lang){ //this is the function to insert picturess into our isotope DOM
		    	    
				    		pictures.find('.magnify').remove();
				    	
				    		jQuery(this).empty().remove();
				    		$line.empty().remove();
				    		
				    		pictures.each(function(){
				    			
				    			var $pictures = jQuery('<p></p>').append(this);
				    			
				    				$pictures = jQuery('<div class="container"></div>').append($pictures);
		    	    				$pictures = $pictures.prepend('<span class="cross"></span>');
		    	    				$pictures = jQuery('<div class="brick" title="'+title+'" type="wikipicture"></div>').append($pictures);
		    	    		
				    				$container.packery( 'appended', $pictures );
				    			
				    				furtherAuthor($pictures, lang);	
				    				removeCandy($pictures);
				    			
				    		});
       						$box_desc.attr("haspics", "true");
       						//$container.isotope('reLayout');
       						return false;
       					
				    }//and var addpictures
				   // addPictures(pictures, language);
       				/*if ($box_desc.attr("haspics") === "true"){
       				
	       				addPictures(pictures, language);
	       				
       				}
       				else{
       					
       					$box_desc.find("p#pictures").click(function() {
	       					addPictures(pictures, language);
	       			    });	
       				}*/
				    
				      		
				} // end if there are pictures
												
  			}//if something has been found
  			else{ //wikiArticle not found:  
  				var isSingle = <?php if(is_single()){echo "true";}else{echo "false";};?>;			
  				if (isSingle){ //if is single, then show dont remove the candy if nothing is found, but simply show the title (e.g. the tags, the title, the author)
	  				
	  				var $container = jQuery('#listing,.listing');								
					$container.packery( 'remove', $box_loading);
					
					var $box = jQuery('<br><p style="font-weight:bold;font-size:13px;">'+title+'</p>');
					$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
				 	$box_desc = jQuery('<div class="container" color='+$color+'></div>').append($box);				    		    
				 	if (!isiPad) {$box_desc = $box_desc.prepend('<span class="cross"></span>');}	
                    $box_desc = jQuery('<div class="brick '+$titleclass+'" language="'+language+'" color='+$color+'></div>').append($box_desc);		    		    
		    		    	    		   		    		    
		    		var sum = Number(ide) + 1;
		    		
		    		$box_desc.attr('data-sort', sum);
		    		$container.packery( 'appended', $box_desc );	
		    		removeCandy($box_desc);
					 
  				}else{ //else is not single, do the usual not found error
	  			
	  				var $container = jQuery('#listing,.listing');
	  				$container.packery( 'remove', $box_loading);
	  				
			   		var $content = '<p class="bold">'+title+'</p>still does not exist on Wikipedia. <a href="http://en.wikipedia.org/wiki/Wikipedia:Your_first_article"><br>Be the first to write the article</a>';
			   		var $box = jQuery('<p></p>').append($content);
			   			$box = jQuery('<div class="postLink" color='+$color+'></div>').append($box);
			   		    $box = jQuery('<div class="container"></div>').append($box);	
			   		    if (!isiPad) {$box = $box.prepend('<span class="cross"></span>');}							
			   		    $box = jQuery('<div class="brick '+$titleclass+'" color='+$color+'></div>').append($box);					
			   		    
	    	   		var sum = Number(ide) + 1;		    			 
 			   		$box.attr('data-sort', sum);
 			   		$container.packery( 'appended', $box);	 						 									    			
		       		removeCandy($box);
               		return false;   
	  				
  				}//end else isSingle
  			
  			     	    			
		    }//End else not found
       	},
       	error: function (data){
       	
       				$box_loading.empty().remove();
       			var $container = jQuery('#listing,.listing');
       			var content = "Wikipedia seems to have the hickup..";
       			var $box = jQuery('<p></p>').append($content);
					$box = jQuery('<div class="brick " color='+$color+'></div>').append($box);
	    		
 				 var sum = Number(ide) + 1;		    			 
 				 $box.attr('data-sort', sum);
 				 $container.packery( 'appended', $box );	
		    	 removeCandy($box);
		    
				return false; 
       	}
  	});

	
}

function goFullscreen(){

  jQuery("#map_canvas").toggleClass("fullscreen");
   jQuery("div.brick").toggleClass("fullscreen");

}

</script>
