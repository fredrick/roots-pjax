/**
 * Roots PJAX
 * WordPress meets HTML5 Boilerplate, Bootstrap, and PJAX
 * https://github.com/wayoutmind/roots-pjax
 */

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name rp.min.js
// ==/ClosureCompiler==

(function($){
  $(document).ready(function() {
    /** Load PJAX on navigation interaction
      */
    $('a:not(:has(img))').pjax('#wrap').live('click', function() {
      $('.active').removeClass('current-menu-item active');
      $('.active').removeClass('current_page_parent active');
      $(this).parent().addClass('current-menu-item active');
    });
    /** Watch PJAX requests so metadata in document can be modified dynamically
      */
    $('body').bind('pjax:start', function() {
      $(this).ajaxSuccess(function(event, request, settings) {
          // Body Class
        var classes = request.getResponseHeader('X-WordPress-Body-Class');
        $(this).attr('class', classes);
        var link = {
          canonical: request.getResponseHeader('X-WordPress-Link-Canonical'),
          previous: request.getResponseHeader('X-WordPress-Link-Previous'),
          next: request.getResponseHeader('X-WordPress-Link-Next')
        }
        var title = {
          previous: request.getResponseHeader('X-WordPress-Title-Previous'),
          next: request.getResponseHeader('X-WordPress-Title-Next')
        }
        // Canonical link
        $('link[rel="canonical"]').attr('href', link.canonical);
        // Previous link
        $('link[rel="prev"]').attr('href', link.previous);
        $('link[rel="prev"]').attr('title', title.previous);
        if ($('link[rel="prev"]').length === 0) {
          $('head').append('<link rel="previous" title="' + title.previous + '" href="' + link.previous + '" />');
        }
        // Next link
        $('link[rel="next"]').attr('href', link.next);
        $('link[rel="next"]').attr('title', title.next);
        if ($('link[rel="next"]').length === 0) {
          $('head').append('<link rel="previous" title="' + title.next + '" href="' + link.next + '" />');
        }
      });
    });
  });
})(jQuery);
