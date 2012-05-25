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
    wp_enqueue_script('pjax', ROOTSPJAX_URL . '/pjax/jquery.pjax.js', array('jquery'));
    wp_enqueue_script('roots-pjax', ROOTSPJAX_URL . '/rp.min.js', array('jquery', 'pjax'), false, true);
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

      /** Templated page
        */
      if ($template_name == 'default') {
        require('templates/page.php');
        exit;
      } else if ($template_name != '') {
        require('templates/' . $template_name);
        exit;
      } else {
      /** Untemplated page
        */
        if (is_single()) {
          // Single page
          require('templates/single.php');
          exit;
        } else if (is_archive()) {
          // Archive
          require('templates/archive.php');
          exit;
        } else if (is_search()) {
          // Search results
          require('templates/search.php');
          exit;
        } else if (is_front_page()) {
          // Front page, default/posts page
          require('templates/front-page.php');
          exit;
        }
        else if (is_home()) {
          // Posts page
          require('templates/index.php');
          exit;
        } else {
          // Untemplated default
          require('templates/page.php');
          exit;
        }
      }
    }
  }
}
?>
