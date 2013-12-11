<?php
/*
Template Name: Start
*/
?>

<link rel="stylesheet" href="/wv/themes/buddy-theme/buddy/lib/scripts/jquery-ui/css/ui-lightness/jquery-ui-1.8.23.custom.css" type="text/css" media="screen, projection" />
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
  html { height: 100% }
  body { height: 100%; margin: 0px; padding: 0px }
  #map_canvas { height: 100% }
</style>

<?php get_header();

global $gp_settings;

?>



<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<div id="content">
		
		<?php 
			$nonce = wp_create_nonce('savewall');
			
			if ( is_user_logged_in() ) {echo '<div id="menu">'; wallC_button($nonce);echo '</div>'; }else{echo '<div id="menu"><a class="bp-button login-button" href="http://wikiver.se/login">Login</a> to create and save your own walls</div>';} ?>
		
		<div id="listing">
		
				<div class="brick" type="search" id="wikistart" data-sort="0" >
					 
				
					
					<div class="wikiforms">
						<input id="walltitle" type="text" placeholder="Insert a title.." />
						<textarea name="wallcontent" id="wallcontent" placeholder="Optionally insert a description.." ></textarea>

					</div>	
					<div class="wikiforms">
				  	
				    	
				   
				   	 </div>	
				   	 
				   	 					
					 <div id='line'></div>
					 
				   	<div class="wikiforms">
				   	
				    	<select id="langselect" name="input">
			
					    	<option>&#8211; select a Language &#8211;</option>
					    	<option value="en">English</option>
					    	<option value="de">Deutsch</option>
					    	<option value="fr">Français</option>
					    	<option value="nl">Nederlands</option>
					    	<option value="it">Italiano</option>
					    	<option value="es">Español</option>
					    	<option value="pl">Polski</option>
					    	<option value="ru">Русский</option>
					    	<option value="ja">日本語</option>
					    	<option value="pt">Português</option>
					    	<option value="zh">中文</option>
					    	<option value="sv">Svenska</option>
					    	<option value="vi">Tiếng Việt</option>
					    	<option value="uk">Українська</option>
					    	<option value="ca">Català</option>
					    	<option value="no">Norsk (Bokmål)</option>
					    	<option value="fi">Suomi</option>
					    	<option value="cs">Čeština</option>
					    	<option value="fa">فارسی</option>
					    	<option value="hu">Magyar</option>
					    	<option value="ko">한국어</option>
					    	<option value="ro">Română</option>
					    	<option value="id">Bahasa Indonesia</option>
					    	<option value="ar">العربية</option>
					    	<option value="tr">Türkçe</option>
					    	<option value="sk">Slovenčina</option>
					    	<option value="kk">Қазақша</option>
					    	<option value="eo">Esperanto</option>
					    	<option value="da">Dansk</option>
					    	<option value="sr">Српски / Srpski</option>
					    	<option value="lt">Lietuvių</option>
					    	<option value="eu">Euskara</option>
					    	<option value="ms">Bahasa Melayu</option>
					    	<option value="he">עברית</option>
					    	<option value="bg">Български</option>
					    	<option value="sl">Slovenščina</option>
					    	<option value="vo">Volapük</option>
					    	<option value="hr">Hrvatski</option>
					    	<option value="war">Winaray</option>
					    	<option value="hi">हिन्दी</option>
					    	<option value="et">Eesti</option>
					    	<option value="gl">Galego</option>
					    	<option value="nn">Nynorsk</option>
					    	<option value="az">Azərbaycanca</option>
					    	<option value="simple">Simple English</option>
					    	<option value="la">Latina</option>
					    	<option value="el">Ελληνικά</option>
					    	<option value="th">ไทย</option>
					    	<option value="sh">Srpskohrvatski / Српскохрватски</option>
					    	<option value="oc">Occitan</option>
					    	<option value="new">नेपाल भाषा</option>
					    	<option value="mk">Македонски</option>
					    	<option value="ka">ქართული</option>
					    	<option value="roa-rup">Armãneashce</option>
					    	<option value="tl">Tagalog</option>
					    	<option value="pms">Piemontèis</option>
					    	<option value="be">Беларуская</option>
					    	<option value="ht">Krèyol ayisyen</option>
					    	<option value="te">తెలుగు</option>
					    	<option value="uz">O‘zbek</option>
					    	<option value="ta">தமிழ்</option>
					    	<option value="be-x-old">Беларуская (тарашкевіца)</option>
					    	<option value="lv">Latviešu</option>
					    	<option value="br">Brezhoneg</option>
					    	<option value="sq">Shqip</option>
					    	<option value="ceb">Sinugboanong Binisaya</option>
					    	<option value="jv">Basa Jawa</option>
					    	<option value="mg">Malagasy</option>
					    	<option value="cy">Cymraeg</option>
					    	<option value="mr">मराठी</option>
					    	<option value="lb">Lëtzebuergesch</option>
					    	<option value="is">Íslenska</option>
					    	<option value="bs">Bosanski</option>
					    	<option value="hy">Հայերեն</option>
					    	<option value="my">မြန်မာဘာသာ</option>
					    	<option value="yo">Yorùbá</option>
					    	<option value="an">Aragonés</option>
					    	<option value="lmo">Lumbaart</option>
					    	<option value="ml">മലയാളം</option>
					    	<option value="fy">Frysk</option>
					    	<option value="pnb">شاہ مکھی پنجابی (Shāhmukhī Pañjābī)</option>
					    	<option value="af">Afrikaans</option>
					    	<option value="bpy">ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী</option>
					    	<option value="bn">বাংলা</option>
					    	<option value="sw">Kiswahili</option>
					    	<option value="io">Ido</option>
					    	<option value="scn">Sicilianu</option>
					    	<option value="ne">नेपाली</option>
					    	<option value="gu">ગુજરાતી</option>
					    	<option value="zh-yue">粵語</option>
					    	<option value="ur">اردو</option>
					    	<option value="ba">Башҡорт</option>
					    	<option value="nds">Plattdüütsch</option>
					    	<option value="ku">Kurdî / كوردی</option>
					    	<option value="ast">Asturianu</option>
					    	<option value="ky">Кыргызча</option>
					    	<option value="qu">Runa Simi</option>
					    	<option value="su">Basa Sunda</option>
					    	<option value="diq">Zazaki</option>
					    	<option value="tt">Tatarça / Татарча</option>
					    	<option value="ga">Gaeilge</option>
					    	<option value="cv">Чăваш</option>
					    	<option value="ia">Interlingua</option>
					    	<option value="nap">Nnapulitano</option>
					    	<option value="bat-smg">Žemaitėška</option>
					    	<option value="map-bms">Basa Banyumasan</option>
					    	<option value="als">Alemannisch</option>
					    	<option value="wa">Walon</option>
					    	<option value="kn">ಕನ್ನಡ</option>
					    	<option value="am">አማርኛ</option>
					    	<option value="sco">Scots</option>
					    	<option value="ckb">Soranî / کوردی</option>
					    	<option value="gd">Gàidhlig</option>
					    	<option value="bug">Basa Ugi</option>
					    	<option value="tg">Тоҷикӣ</option>
					    	<option value="mzn">مَزِروني</option>
					    	<option value="hif">Fiji Hindi</option>
					    	<option value="zh-min-nan">Bân-lâm-gú</option>
					    	<option value="yi">ייִדיש</option>
					    	<option value="vec">Vèneto</option>
					    	<option value="arz">مصرى (Maṣrī)</option>
					    	<option value="roa-tara">Tarandíne</option>
					    	<option value="nah">Nāhuatl</option>
					    	<option value="os">Иронау</option>
					    	<option value="sah">Саха тыла (Saxa Tyla)</option>
					    	<option value="mn">Монгол</option>
					    	<option value="sa">संस्कृतम्</option>
					    	<option value="pam">Kapampangan</option>
					    	<option value="hsb">Hornjoserbsce</option>
					    	<option value="li">Limburgs</option>
					    	<option value="mi">Māori</option>
					    	<option value="si">සිංහල</option>
					    	<option value="se">Sámegiella</option>
					    	<option value="co">Corsu</option>
					    	<option value="gan">贛語</option>
					    	<option value="glk">گیلکی</option>
					    	<option value="bar">Boarisch</option>
					    	<option value="bo">བོད་སྐད</option>
					    	<option value="fo">Føroyskt</option>
					    	<option value="ilo">Ilokano</option>
					    	<option value="bcl">Bikol</option>
					    	<option value="mrj">Кырык Мары (Kyryk Mary) </option>
					    	<option value="fiu-vro">Võro</option>
					    	<option value="nds-nl">Nedersaksisch</option>
					    	<option value="ps">پښتو</option>
					    	<option value="tk">تركمن / Туркмен</option>
					    	<option value="vls">West-Vlams</option>
					    	<option value="gv">Gaelg</option>
					    	<option value="rue">русиньскый язык</option>
					    	<option value="pa">ਪੰਜਾਬੀ</option>
					    	<option value="xmf">მარგალური (Margaluri)</option>
					    	<option value="pag">Pangasinan</option>
					    	<option value="dv">Divehi</option>
					    	<option value="nrm">Nouormand/Normaund</option>
					    	<option value="zea">Zeêuws</option>
					    	<option value="kv">Коми</option>
					    	<option value="koi">Перем Коми (Perem Komi)</option>
					    	<option value="km">ភាសាខ្មែរ</option>
					    	<option value="rm">Rumantsch</option>
					    	<option value="csb">Kaszëbsczi</option>
					    	<option value="lad">Dzhudezmo</option>
					    	<option value="udm">Удмурт кыл</option>
					    	<option value="or">ଓଡ଼ିଆ</option>
					    	<option value="mt">Malti</option>
					    	<option value="mhr">Олык Марий (Olyk Marij)</option>
					    	<option value="fur">Furlan</option>
					    	<option value="lij">Líguru</option>
					    	<option value="wuu">吴语</option>
					    	<option value="ug">ئۇيغۇر تىلى</option>
					    	<option value="frr">Nordfriisk</option>
					    	<option value="pi">पाऴि</option>
					    	<option value="sc">Sardu</option>
					    	<option value="zh-classical">古文 / 文言文</option>
					    	<option value="bh">भोजपुरी</option>
					    	<option value="ksh">Ripoarisch</option>
					    	<option value="nov">Novial</option>
					    	<option value="ang">Englisc</option>
					    	<option value="so">Soomaaliga</option>
					    	<option value="stq">Seeltersk</option>
					    	<option value="kw">Kernewek/Karnuack</option>
					    	<option value="nv">Diné bizaad</option>
					    	<option value="vep">Vepsän</option>
					    	<option value="hak">Hak-kâ-fa / 客家話</option>
					    	<option value="ay">Aymar</option>
					    	<option value="frp">Arpitan</option>
					    	<option value="pcd">Picard</option>
					    	<option value="ext">Estremeñu</option>
					    	<option value="szl">Ślůnski</option>
					    	<option value="gag">Gagauz</option>
					    	<option value="gn">Avañe</option>
					    	<option value="ln">Lingala</option>
					    	<option value="ie">Interlingue</option>
					    	<option value="eml">Emiliàn e rumagnòl</option>
					    	<option value="haw">Hawai`i</option>
					    	<option value="xal">Хальмг</option>
					    	<option value="pfl">Pfälzisch</option>
					    	<option value="pdc">Deitsch</option>
					    	<option value="rw">Ikinyarwanda</option>
					    	<option value="krc">Къарачай-Малкъар (Qarachay-Malqar)</option>
					    	<option value="crh">Qırımtatarca</option>
					    	<option value="ace">Bahsa Acèh</option>
					    	<option value="to">faka Tonga</option>
					    	<option value="as">অসমীয়া</option>
					    	<option value="ce">Нохчийн</option>
					    	<option value="kl">Kalaallisut</option>
					    	<option value="arc">Aramaic</option>
					    	<option value="dsb">Dolnoserbski</option>
					    	<option value="myv">Эрзянь (Erzjanj Kelj)</option>
					    	<option value="pap">Papiamentu</option>
					    	<option value="bjn">Bahasa Banjar</option>
					    	<option value="sn">chiShona</option>
					    	<option value="tpi">Tok Pisin</option>
					    	<option value="lbe">Лакку</option>
					    	<option value="lez">Лезги чІал (Lezgi č’al)</option>
					    	<option value="kab">Taqbaylit</option>
					    	<option value="mdf">Мокшень (Mokshanj Kälj)</option>
					    	<option value="wo">Wolof</option>
					    	<option value="jbo">Lojban</option>
					    	<option value="av">Авар</option>
					    	<option value="srn">Sranantongo</option>
					    	<option value="cbk-zam">Chavacano de Zamboanga</option>
					    	<option value="bxr">Буряад</option>
					    	<option value="ty">Reo Mā`ohi</option>
					    	<option value="lo">ລາວ</option>
					    	<option value="kbd">Адыгэбзэ (Adighabze)</option>
					    	<option value="ab">Аҧсуа</option>
					    	<option value="tet">Tetun</option>
					    	<option value="mwl">Mirandés</option>
					    	<option value="ltg">Latgaļu</option>
					    	<option value="na">dorerin Naoero</option>
					    	<option value="kg">KiKongo</option>
					    	<option value="ig">Igbo</option>
					    	<option value="nso">Sesotho sa Leboa</option>
					    	<option value="za">Cuengh</option>
					    	<option value="kaa">Qaraqalpaqsha</option>
					    	<option value="zu">isiZulu</option>
					    	<option value="chy">Tsetsêhestâhese</option>
					    	<option value="rmy">romani &#8211; रोमानी</option>
					    	<option value="cu">Словѣньскъ</option>
					    	<option value="tn">Setswana</option>
					    	<option value="chr">ᏣᎳᎩ</option>
					    	<option value="got">Gothic</option>
					    	<option value="cdo">Mìng-dĕ̤ng-ngṳ̄</option>
					    	<option value="sm">Gagana Samoa</option>
					    	<option value="bi">Bislama</option>
					    	<option value="mo">Молдовеняскэ</option>
					    	<option value="bm">Bamanankan</option>
					    	<option value="iu">ᐃᓄᒃᑎᑐᑦ</option>
					    	<option value="pih">Norfuk</option>
					    	<option value="ss">SiSwati</option>
					    	<option value="sd">سنڌي، سندھی ، सिन्ध</option>
					    	<option value="pnt">Ποντιακά</option>
					    	<option value="ee">Eʋegbe</option>
					    	<option value="ki">Gĩkũyũ</option>
					    	<option value="om">Oromoo</option>
					    	<option value="ha">هَوُسَ</option>
					    	<option value="ti">ትግርኛ</option>
					    	<option value="ts">Xitsonga</option>
					    	<option value="ks">कश्मीरी / كشميري</option>
					    	<option value="fj">Na Vosa Vakaviti</option>
					    	<option value="sg">Sängö</option>
					    	<option value="ve">Tshivenda</option>
					    	<option value="rn">Kirundi</option>
					    	<option value="cr">Nehiyaw</option>
					    	<option value="ak">Akana</option>
					    	<option value="tum">chiTumbuka</option>
					    	<option value="lg">Luganda</option>
					    	<option value="dz">ཇོང་ཁ</option>
					    	<option value="ny">Chi-Chewa</option>
					    	<option value="ik">Iñupiak</option>
					    	<option value="ch">Chamoru</option>
					    	<option value="ff">Fulfulde</option>
					    	<option value="st">Sesotho</option>
					    	<option value="tw">Twi</option>
					    	<option value="xh">isiXhosa</option>
					    	<option value="ng">Oshiwambo</option>
					    	<option value="ii">ꆇꉙ</option>
					    	<option value="cho">Choctaw</option>
					    	<option value="mh">Ebon</option>
					    	<option value="aa">Afar</option>
					    	<option value="kj">Kuanyama</option>
					    	<option value="ho">Hiri Motu</option>
					    	<option value="mus">Muskogee</option>
					    	<option value="kr">Kanuri</option>
					    	<option value="hz">Otsiherero</option>
					    	</select>
						
				    	<input id="wikiform" type="text" placeholder="Search Wikipedia.." />
				    	
				    	<a class="button" id="start" href="#">Search</a>
				   	 </div>		
				   	 				
				   	 <div id='line'></div>
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
				    	
					    
					    <a class="button" id="videos" href="#">Search</a>
				   
				   	 </div>		
				   	 				
				   	 <div id='line'></div>
				   	 
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
				    	
					    
					    <a class="button" id="flickr" href="#">Search</a>
				   
				   	 </div>	
				   	 
				   	 <div id='line'></div>
				   	 
				   	 <div class="wikiforms">
					   	 
					 
				    	
				    	<input id="googleform" type="text" placeholder="Search Google.." />
				    	<a class="button" id="google" href="#">Search</a>
				   
				   	 </div>							
				</div>
				<!-- <div class="brick w2" id="map_canvas"  style="width:100%; height:100%""></div> -->
			</div> <?php //end listing ?>
		
		<div class="padder<?php if(has_post_thumbnail() && $gp_settings['show_image'] == "Show") { ?> content-post-thumbnail<?php } ?>">
			
			
			
			<div class="clear"></div>
		
		</div><?php // End padder ?>
		
	</div> <?php // End content ?>
	
<?php endwhile; endif; ?>

<?php get_footer(); ?>

<?php include 'scripts.php'; ?>

<script>

jQuery.noConflict(); 

jQuery(document).ready(function(){ 
		
    var $container = jQuery('#listing'),
        $body = jQuery('body'),
        colW = 298,
        columns = null;
		
		$container.imagesLoaded( function(){
		
			$container.isotope({
    			itemSelector : '.brick',
        		masonry: {
        		    columnWidth: colW
        		},
        		getSortData : {
        		    number : function($elem) {
        				return parseInt($elem.attr('data-sort'));
        		    }
        		},
   				sortBy : 'number',
    			sortAscending : true,
        		animationEngine : 'css',
        		transformsEnabled: false
        	
           });
        });
     jQuery('div.wikibrick').livequery(function(event) { 
	           
	         jQuery("a#editWall").html('Save Wall');
	         jQuery("a#editWall").fadeIn("slow");
	         jQuery("a#saveWall").fadeIn("slow");
        
        }); 
  
   	autocompleteUtube();
    searchUtube();
	searchFlickr(); 
	searchGoogle(); 
	removeCandy();  
   // recordClicks(".record");
	authorsWiki();
	//gridStart();
	//clearBricks();
	getLang();
	//gmaps();

	
});


</script>
