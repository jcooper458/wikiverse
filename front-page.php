<div id="top-home-container" class="container-fluid dark-blue buffer-bottom">
  <canvas id="stars" height width></canvas>
  <div class="container" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12 buffer-bottom">
      <div class="gigante"><p>wikiverse</p> <span id="front-beta">beta</span></div>
      <a href="https://twitter.com/wikiverse1" class="twitter-follow-button" data-show-count="false" data-show-screen-name="false">Follow @wikiverse1</a>
      <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
      &nbsp;&nbsp;<iframe src="https://ghbtns.com/github-btn.html?user=kubante&repo=wikiverse&type=star&count=false" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
      <h1>is a powerful content aggregator.</h1>
      <h3>Create stunning infoboards with data from wikipedia, flickr, youtube and many other sources. </h5>
    </div>
  </div>
</div>

<div id="demo" class="">
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

<div id="register" class="container-fluid dark-blue buffer-bottom buffer-top">
  <div class="container" role="document">
    <div class="col-lg-7 col-md-7 col-sm-7 buffer-top-large">
      <h1><a href="/login">Sign up</a>  or just <a href="/start">try it out</a></h1>
      <br>
      <h3>Create interesting connections and enjoy serendipity.</h3>
      <h3 class="buffer-bottom">Or gather thought-out topics into one handpicked selection.</h3>
      <br>
      <h4>Drag and drop the content to align it as you prefer.</h4>
      <h4>Follow your train of thought with the mindmap.</h4>
    </div>
    <div class="col-lg-5 col-md-5 col-sm-5">

      <div id="mindmap"></div>
        
        <!--<img class="img-responsive buffer-top buffer-bottom" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/wv_mindmap.png">-->
    
    </div>
  </div>
</div>

<?php 
$fotoURL = "";

$query = new WP_Query( array( 'post_type' => 'board', 'cat' => '3' ) );

?>
<div id="featured" class="container-fluid buffer-bottom buffer-top">
  <div class="container" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <h1>Staff picks</h1>

      <div id="packerySite" class="packerySite packery buffer-top">

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

<div id="thanks" class="container-fluid dark-blue buffer-bottom buffer-top">
  <div class="container" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12 buffer-bottom buffer-top">
      <h1>100% free and open source</h1>
      <h3>Use <a href="https://wikiver.se/login">https://wikiver.se</a> to save your boards.</h3>
      <h3>Or install wikiverse on your own server and host the boards yourself.</h3>
      <h4>Follow the instructions on <a href="https://github.com/kubante/wikiverse">Github</a></h4>
      <br>
      <h2>wikiverse is built with open-source software</h2>
      <h4 class="buffer-bottom">
        <a target="_blank" href="http://www.ecmascript.org/">ES6</a>, 
        <a target="_blank" href="https://jquery.com/">jQuery</a>, 
        <a target="_blank" href="http://packery.metafizzy.co/">packery</a>, 
        <a target="_blank" href="http://sigmajs.org/">sigma.js</a>, 
        <a target="_blank" href="http://d3js.org/">d3.js</a>, 
        <a target="_blank" href="http://getbootstrap.com/">bootstrap</a>, 
        <a target="_blank" href="http://tympanus.net/codrops/">codrops</a>, 
        <a target="_blank" href="https://wordpress.com/">wordpress</a>, 
        <a target="_blank" href="https://roots.io/sage/">sage</a> 
      </h4>    
    </div>
  </div>
</div>


<div id="contribute" class="container-fluid buffer-bottom buffer-top">
  <div class="container" role="document">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <blockquote>
          <p>There
would of course be no atlas possible without the archive that precedes it;<br>
the atlas offers in this sense the "becoming-sight" and "becoming-knowledge" of the archive.</p>
          <footer>Georges Didi-Huberman in <cite title="Source Title">The eye of history</cite></footer>
      </blockquote>
    </div>
  </div>
</div>

<!--
<div class="container buffer-bottom" role="document">
</div>
-->