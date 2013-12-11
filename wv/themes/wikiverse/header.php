<!doctype html>  

<!--[if IEMobile 7 ]> <html <?php language_attributes(); ?>class="no-js iem7"> <![endif]-->
<!--[if lt IE 7 ]> <html <?php language_attributes(); ?> class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html <?php language_attributes(); ?> class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html <?php language_attributes(); ?> class="no-js ie8"> <![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		
		<title><?php wp_title( '|', true, 'right' ); ?></title>
				
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<script src="/wv/themes/wikiverse/js/draggabilly.js"></script>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

			
		<!-- media-queries.js (fallback) -->
		<!--[if lt IE 9]>
			<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>			
		<![endif]-->

		<!-- html5.js -->
		<!--[if lt IE 9]>
			<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		
  		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

		<!-- wordpress head functions -->
		<?php wp_head(); ?>
		<!-- end of wordpress head -->

		<!-- theme options from options panel -->
		<?php get_wpbs_theme_options(); ?>

		<!-- typeahead plugin - if top nav search bar enabled -->
		<?php require_once('library/typeahead.php'); ?>
		
		<!--<script src="/wv/themes/wikiverse/js/select2.min.js"></script>	-->	
		

	</head>
	
	<body <?php body_class(); ?>>
				
		<header role="banner">
		
			<div id="inner-header" class="clearfix">
				
				<div class="navbar navbar-fixed-top">
					<div class="navbar-inner">
						<div class="container-fluid nav-container">
							<nav role="navigation">
								<a class="brand" id="logo" title="<?php echo get_bloginfo('description'); ?>" href="<?php echo home_url(); ?>">
									<?php if(of_get_option('branding_logo','')!='') { ?>
										<img src="<?php echo of_get_option('branding_logo'); ?>" alt="<?php echo get_bloginfo('description'); ?>">
										<?php }
										if(of_get_option('site_name','1')) bloginfo('name'); ?></a>
								
								<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
							        <span class="icon-bar"></span>
							        <span class="icon-bar"></span>
							        <span class="icon-bar"></span>
								</a>
								
								<div class="nav-collapse">
									<div class="btn-group">
									
									    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									    Wikipedia
									    <span class="caret"></span>
									    </a>
									    <ul class="dropdown-menu">
									    	<li>
									    		<form class="navbar-form">
												 	<input id="wikipedia" type="text" class="wikiverse-search span3">
												</form>
										 	</li>
										 	 <li class="divider"></li>
										 	 <li>
										 	 	<?php require_once( 'templates/parts/select-language.php');?>
										 	 </li>
									    </ul>
									</div>
									<div class="btn-group">
									    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									    Flickr
									    <span class="caret"></span>
									    </a>
									    <ul class="dropdown-menu">
									    	<form class="navbar-form">
										    	<input type="text" class="wikiverse-search span3">
										 	</form>
									    </ul>
									</div>
									<div class="btn-group">
									    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									    Youtube
									    <span class="caret"></span>
									    </a>
									    <ul class="dropdown-menu">
									    	<form class="navbar-form">
										    	<input type="text" class="wikiverse-search span3">
										 	</form>
									    </ul>
									</div>
									<div class="btn-group">
									    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									    GMaps
									    <span class="caret"></span>
									    </a>
									    <ul class="dropdown-menu">
									    	<form class="navbar-form">
										    	<input type="text" class="wikiverse-search span3">
										 	</form>
									    </ul>
									</div>									
									<?php bones_main_nav(); // Adjust using Menus in Wordpress Admin ?>
								</div>
								
							</nav>
							
							<?php if(of_get_option('search_bar', '1')) {?>
							<form class="navbar-search pull-right" role="search" method="get" id="searchform" action="<?php echo home_url( '/' ); ?>">
								<input name="s" id="s" type="text" class="search-query" autocomplete="off" placeholder="<?php _e('Search','bonestheme'); ?>" data-provide="typeahead" data-items="4" data-source='<?php echo $typeahead_data; ?>'>
							</form>
							<?php } ?>
							
						</div> <!-- end .nav-container -->
					</div> <!-- end .navbar-inner -->
				</div> <!-- end .navbar -->
			
			</div> <!-- end #inner-header -->
		<script>
			//this is to prevent the focus of the wikiverse-search inputs to collapse the dropdown
				jQuery('.wikiverse-search').bind('click', function (e) {
				  e.stopPropagation()
				});

		</script>
		</header> <!-- end header -->
		
		<div class="container-fluid">
