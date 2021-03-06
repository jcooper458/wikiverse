<?php

use Roots\Sage\Config;
use Roots\Sage\Wrapper;

?>

<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
  <?php get_template_part('templates/head'); ?>
  <body <?php body_class(); ?>>
    <!--[if lt IE 9]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
    <?php  
      do_action('get_header');  

      //for everything that is not the frontpage: 
      if(!is_front_page()) {
        
        get_template_part('templates/header');

        if(!is_author()) {
          get_template_part('templates/wv-markup'); 
        }

      ?>
      <div class="container-fluid" role="document">
        <div class="content">
          <main class="main" role="main">
            <?php include Wrapper\template_path(); ?>
          </main><!-- /.main -->
          <?php if (Config\display_sidebar()) : ?>
            <aside class="sidebar" role="complementary">
              <?php include Wrapper\sidebar_path(); ?>
            </aside><!-- /.sidebar -->
          <?php endif; ?>
        </div><!-- /.content -->
      </div><!-- /.wrap -->
      <?php

      //else for the frontpage
      }
      else{
        get_template_part('templates/headerHomepage');
        include Wrapper\template_path(); 
        do_action('get_footer');
        get_template_part('templates/footer');
       
      }
       wp_footer();
    ?>



  </body>

</html>
