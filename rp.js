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
    /**
     * Load PJAX
     */
    $('a:not(:has(img))').pjax('#wrap');
    /**
     * Filter PJAX requests
     */
    $.ajaxPrefilter(function(options, pjax, xhr) {
      var isPJAX = (!!options.container && !!options.clickedElement);
      if (isPJAX && !options.crossDomain) {
        var request = new XMLHttpRequest();
        request.open('HEAD', pjax.url, true);
        request.onreadystatechange = function() {
          if (this.readyState === this.DONE) {
            var isHTML = (request.getResponseHeader('Content-Type').indexOf('text/html') !== -1);
            if (!isHTML) {
              xhr.abort();
              window.location.href = pjax.url;
            }
          }
        }
        request.send();
      }
    });
    /**
     * Update static DOM nodes
     */
    $('body').delegate('a', 'click', function() {
      var activeClasses = [
        'current-menu-item',
        'current-menu-parent',
        'current-menu-ancestor',
        'current_page_item',
        'current_page_parent',
        'current_page_ancestor',
        'active'
      ].join(' ');
      $('.active').removeClass(activeClasses);
      $(this).parent().addClass('active');
    });
    $(document).bind('pjax:start', function() {
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
