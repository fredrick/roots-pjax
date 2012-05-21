<?php
/** 
 * Supply metadata
 */
//header('X-Body-Class: ' . body_class());
header('X-Link-Canonical: ' . get_permalink());

$previous_id = get_adjacent_post($in_same_cat = false, $excluded_categories = '', $previous = true)->ID;
$next_id = get_adjacent_post($in_same_cat = false, $excluded_categories = '', $previous = false)->ID;

if (!is_singular()) {
    header('X-Link-Previous: ' . get_previous_posts_page_link());
    header('X-Link-Next: ' . get_next_posts_page_link());
} else {
    header('X-Link-Previous: ' . get_permalink($previous_id));
    header('X-Link-Next: ' . get_permalink($next_id));
}

header('X-Title-Previous: ' . get_the_title($previous_id));
header('X-Title-Next: ' . get_the_title($next_id));
?>
<title><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>