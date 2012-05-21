<?php
/**
 * Roots PJAX
 * WordPress meets HTML5 Boilerplate, Bootstrap, and PJAX, a Roots Child Theme
 */

require('roots-pjax.php');

/* Begin custom functionality */
/* End custom functionality */

// Load Roots PJAX
add_action('get_header', 'RootsPJAX::load');
add_filter('get_header', 'RootsPJAX::render');
?>