<?php

namespace Roots\Sage\Assets;

/**
 * Scripts and stylesheets
 *
 * Enqueue stylesheets in the following order:
 * 1. /theme/dist/styles/main.css
 *
 * Enqueue scripts in the following order:
 * 1. /theme/dist/scripts/modernizr.js
 * 2. /theme/dist/scripts/main.js
 */

class JsonManifest {
  private $manifest;

  public function __construct($manifest_path) {
    if (file_exists($manifest_path)) {
      $this->manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
      $this->manifest = [];
    }
  }

  public function get() {
    return $this->manifest;
  }

  public function getPath($key = '', $default = null) {
    $collection = $this->manifest;
    if (is_null($key)) {
      return $collection;
    }
    if (isset($collection[$key])) {
      return $collection[$key];
    }
    foreach (explode('.', $key) as $segment) {
      if (!isset($collection[$segment])) {
        return $default;
      } else {
        $collection = $collection[$segment];
      }
    }
    return $collection;
  }
}

function asset_path($filename) {
  $dist_path = get_template_directory_uri() . DIST_DIR;
  $directory = dirname($filename) . '/';
  $file = basename($filename);
  static $manifest;

  if (empty($manifest)) {
    $manifest_path = get_template_directory() . DIST_DIR . 'assets.json';
    $manifest = new JsonManifest($manifest_path);
  }

  if (array_key_exists($file, $manifest->get())) {
    return $dist_path . $directory . $manifest->get()[$file];
  } else {
    return $dist_path . $directory . $file;
  }
}

function assets() {
  wp_enqueue_style('sage_css', asset_path('styles/main.css'), false, null);

  wp_enqueue_script('modernizr', asset_path('scripts/modernizr.js'), [], null, true);
  wp_enqueue_script('sage_js', asset_path('scripts/main.js'), ['jquery'], null, true);
  wp_enqueue_script('wikiverse', get_stylesheet_directory_uri() . '/assets/wikiverse.js', [], null, true);

  wp_enqueue_script('gmaps', 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&signed_in=true', [], null, false);  
  wp_enqueue_script('soundcloud', '//connect.soundcloud.com/sdk-2.0.0.js', [], null, false);
  wp_enqueue_script('soundcloud_player', '//w.soundcloud.com/player/api.js', [], null, false);
  
  // wp_enqueue_script('redux', '//cdnjs.cloudflare.com/ajax/libs/redux/3.0.5/redux.min.js', [], null, false);
  
  // wp_enqueue_script('expect', '//npmcdn.com/expect/umd/expect.min.js', [], null, false);
  // wp_enqueue_script('deepFreeze', '//wzrd.in/standalone/deep-freeze@latest', [], null, false);

  wp_enqueue_style('font_awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css', false, null, false);
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\assets', 100);
