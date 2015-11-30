
<div class="container-fluid dark-blue">
  <div class="container buffer-bottom" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="gigante"><p>wikiverse</p> <span id="front-beta">beta</span></div>
      <h1>is a powerful content aggregator.</h1>
      <h3>Create stunning infoboards with data from wikipedia, flickr, youtube and many other sources. </h5>
    </div>
  </div>
</div>

<div id="video" class="">
  <video muted autoplay poster="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.png" class="">
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.mp4" type="video/mp4"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.ogv" type="video/ogg"/>
    <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv.webm" type="video/webm"/>
     No Video supported. 
  </video>
</div>
<!--
<video loop muted autoplay class="video-stream" x-webkit-airplay="allow" data-youtube-id="N9oxmRT2YWw" src="http://v20.lscache8.c.youtube.com/videoplayback?sparams=id%2Cexpire%2Cip%2Cipbits%2Citag%2Cratebypass%2Coc%3AU0hPRVRMVV9FSkNOOV9MRllD&amp;itag=43&amp;ipbits=0&amp;signature=D2BCBE2F115E68C5FF97673F1D797F3C3E3BFB99.59252109C7D2B995A8D51A461FF9A6264879948E&amp;sver=3&amp;ratebypass=yes&amp;expire=1300417200&amp;key=yt1&amp;ip=0.0.0.0&amp;id=37da319914f6616c"></video>
-->
<!--<div id="homeBoard1" class="packery"></div>-->
	
<!--<div class="container buffer-bottom" role="document">
  <h1>Enjoy serendipity</h1>
  <h3>Start with one keyword. Get the craziest connections.</h5>
</div>	-->

<div class="container-fluid dark-blue">
  <div class="container buffer-bottom" role="document">
    <div class="col-lg-8 col-md-8 col-sm-8 buffer-top-large">
      <h1><a href="/login">Sign up</a>  or just <a href="/start">try it out</a></h1>
      <h3>Create some crazy connections and enjoy serendipity.</h3>
      <h3 class="buffer-bottom">Or gather thought-out topics into one handpicked selection.</h3>
      <h4>Drag and drop the topics to align them as you prefer.</h4>
      <h4>Follow your train of thought with the mindmap.</h4>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-4">
      <img class="img-responsive" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv_mindmap.png">
    </div>
  </div>
</div>

<?php 
$fotoURL = "";

$query = new WP_Query( array( 'post_type' => 'board', 'cat' => '3' ) );

?>
<div class="container-fluid">
  <div class="container buffer-bottom" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <h1>Staff-picked boards</h1>

      <div id="packerySite" class="packerySite buffer-top">

      <?php 
      if ( $query->have_posts() ) : while ( $query->have_posts() ) : $query->the_post(); 


        $the_title = get_the_title();
        $the_permalink = get_the_permalink();
        $the_content = get_the_content();
        $the_content_Array = json_decode($the_content);

      ?>
        <div class="brick well well-sm visible">

          <?php if(isset($the_content_Array->featured_image)){ echo '<a href="'. $the_permalink . '"><img src="' . $the_content_Array->featured_image . '"></a>'; }?>
          <?php echo '<a href="'. $the_permalink . '"><h3>' . $the_title . '</h3></a>'; ?>  

          <?php 
        echo '</div>';

        wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>'));

        ?>
      <?php endwhile; endif; ?>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid dark-blue">
  <div class="container buffer-bottom" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <h1>100% free and open source</h1>
      <h3>Use <a href="https://wikiver.se/login">https://wikiver.se</a> to save your boards.</h3>
      <h3 class="buffer-bottom">Or install wikiverse on your own server and start self-hosting infoboards.</h3>
      <h4>Follow the instructions on <a href="https://github.com/kubante/wikiverse">Github</a></h4>
    </div>
  </div>
</div>


<div class="container-fluid">
  <div class="container buffer-bottom" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <h1>Built with open-source software</h1>
      <h4><a href="https://jquery.com/">jQuery</a>, <a href="http://packery.metafizzy.co/">packery</a>, <a href="http://sigmajs.org/">sigma.js</a>, <a href="http://getbootstrap.com/">bootstrap</a>, <a href="https://wordpress.com/">Wordpress</a>, <a href="https://roots.io/sage/">Sage</a> </h4>
      <h3 class="buffer-bottom">wikiverse needs you.</h3>
      <h4>Graphic designers, UI/UX designers, developers are welcome!</h4>
      <h4>Fork wikiverse <a href="https://github.com/kubante/wikiverse">on Github</a> and get started contributing.</h4>
    </div>
  </div>
</div>

<!--
<div class="container buffer-bottom" role="document">
</div>
-->