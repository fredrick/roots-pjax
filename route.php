<?php
/**
 * Roots PJAX
 * WordPress meets HTML5 Boilerplate, Bootstrap, and PJAX
 * https://github.com/wayoutmind/roots-pjax
 */

define('ROOTSPJAX_URL', get_bloginfo('stylesheet_directory'));

class RootsPJAX {

  /**
   * Initialize Roots PJAX
   */
  public static function load() {
    wp_enqueue_script('pjax', ROOTSPJAX_URL . '/js/vendor/pjax/jquery.pjax.js', array('jquery'), false, true);
    wp_enqueue_script('crackle', ROOTSPJAX_URL . '/js/vendor/crackle/crackle.min.js', array('jquery'), false, true);
    wp_enqueue_script('roots-pjax', ROOTSPJAX_URL . '/rp.min.js', array('jquery', 'pjax', 'crackle'), false, true);
    wp_enqueue_script('roots-pjax-main', ROOTSPJAX_URL . '/js/main.js', array('roots-pjax'), false, true);
  }

  /**
   * Filter PJAX requests
   */
  public static function filter() {
    if (array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX']) {
      if (is_feed() || is_attachment()) {
        ob_start();
        header('X-PJAX: false');
        ob_end_clean();
      } else {
        ob_start();
        header('X-PJAX: true');
        ob_end_clean();
      }
    }
  }

  /**
   * Render PJAX partials
   */
  public static function render() {
    if (array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX']) {

      // Load PJAX template conditionally based on post's template (as defined via WordPress Administration)
      global $wp_query;
      $template_name = get_post_meta( $wp_query->post->ID, '_wp_page_template', true );

      /** Front page
        */
      if (is_front_page()) {
        // Front page, default/posts page
        require(STYLESHEETPATH . '/templates/front-page.php');
        exit;
      }
      /** Templated page
        */
      else if ($template_name == 'default') {
        require(STYLESHEETPATH . '/templates/page.php');
        exit;
      } else if ($template_name != '') {
        require(STYLESHEETPATH . '/templates/' . $template_name);
        exit;
      } else {
      /** Untemplated page
        */
        if (is_single()) {
          // Single page
          require(STYLESHEETPATH . '/templates/single.php');
          exit;
        } else if (is_archive()) {
          // Archive
          require(STYLESHEETPATH . '/templates/archive.php');
          exit;
        } else if (is_search()) {
          // Search results
          require(STYLESHEETPATH . '/templates/search.php');
          exit;
        } else if (is_home()) {
          // Posts page
          require(STYLESHEETPATH . '/templates/index.php');
          exit;
        } else {
          // Untemplated default
          require(STYLESHEETPATH . '/templates/page.php');
          exit;
        }
      }
    }
  }
}
?>
