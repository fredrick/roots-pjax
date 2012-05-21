<?php
/**
 * Thematic PJAX
 * A Thematic child theme made responsive
 */

define('ROOTSPJAX_URL', get_bloginfo('stylesheet_directory'));

class ThematicPJAX {
    public static function load() {
        wp_enqueue_script('pjax', ROOTSPJAX_URL . '/pjax/jquery.pjax.js', array('jquery'));
        wp_enqueue_script('thematic-pjax', ROOTSPJAX_URL . '/thematic-pjax.js', array('jquery', 'pjax'));
    }

    /**
     * PJAX templates
     */

    public static function render() {
        if (array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX']) {

            // Load PJAX template conditionally based on post's template (as defined via Wordpress Administration)
            global $wp_query;
            $template_name = get_post_meta( $wp_query->post->ID, '_wp_page_template', true );
            
            if ($template_name == 'default') {
                include('templates/page.php');
                exit;
            } else {
                include('templates/' . $template_name);
                exit;
            }
        }   
    }
}
?>