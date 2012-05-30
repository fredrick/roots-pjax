/**
 * Roots PJAX
 * WordPress meets HTML5 Boilerplate, Bootstrap, and PJAX
 * https://github.com/wayoutmind/roots-pjax
 */

(function($){
  $(document).ready(function() {
    if (Modernizr.history) {
      /**
       * Load PJAX
       */
      $('a:not(:has(img))').pjax('#wrap');

      /**
       * Annotate AJAX requests
       */
      $.ajaxPrefilter(function(options, caller, xhr) {
        xhr.url = caller.url;
      });

      /**
       * Filter PJAX requests
       */
      $(document).bind('pjax:beforeSend', function(event, xhr) {
        var request = new XMLHttpRequest();
        request.open('HEAD', xhr.url, false);
        request.setRequestHeader('X-PJAX', true);
        request.send();
        var isHTML = (request.getResponseHeader('Content-Type').indexOf('text/html') !== -1);
        var isPJAX = (request.getResponseHeader('X-PJAX') !== 'false');
        if (isHTML && isPJAX) {
          // Navigation
          var activeClasses = [
            'current-menu-item',
            'current-menu-parent',
            'current-menu-ancestor',
            'current_page_item',
            'current_page_parent',
            'current_page_ancestor',
            'active active',
            'active'
          ].join(' ');
          $('.active').removeClass(activeClasses);
          $(event.relatedTarget).parent().addClass('active');
          return true;
        } else {
          xhr.abort();
          window.location.href = xhr.url;
        }
      });

      /**
       * Update DOM
       */
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
          // Head
          var head = {
            children: $.makeArray($('head').children())
                        .map(function(child) { return child.outerHTML.replace(/'/g, '"'); }),
            nodes: request.getResponseHeader('X-WordPress-Head')
                    .split('|')
                    .map(function(child) { return child.replace(/'/g, '"'); })
                    .filter(function(child) { return child !== ''; })
          };
          for (var i = 0; i < head.nodes.length; i++) {
            if (head.children.indexOf(head.nodes[i]) === -1) {
              $('head').append(head.nodes[i]);
            }
          }
          // Footer
          var footer = {
            children: $.makeArray($('body').children('link, script'))
                        .map(function(child) { return child.outerHTML.replace(/'/g, '"'); }),
            nodes: request.getResponseHeader('X-WordPress-Footer')
                    .split('|')
                    .map(function(child) { return child.replace(/'/g, '"'); })
                    .filter(function(child) { return child !== ''; })
          };
          for (var i = 0; i < footer.nodes.length; i++) {
            if (footer.children.indexOf(footer.nodes[i]) === -1) {
              $('body').append(footer.nodes[i]);
            }
          }
        });
      });
    }
  });
})(jQuery);
