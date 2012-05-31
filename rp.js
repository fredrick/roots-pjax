/**
 * Roots PJAX
 * WordPress meets HTML5 Boilerplate, Bootstrap, and PJAX
 * https://github.com/wayoutmind/roots-pjax
 */

(function($){
  $(document).ready(function() {
    if (Modernizr.history) {
      var Not = Crackle.not;
      /**
       * Load PJAX
       */
      $('a:not(:has(img))').pjax('#wrap', { timeout: 2000 });

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
            'current_page_ancestor'
          ].join(' ');
          $('.active').removeClass(activeClasses);
          while($('.active').length > 0) {
            $('.active').removeClass('active');
          }
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
            before: Crackle.stringify($.makeArray($('head').children())).map(function(e) {
              return e.replace(/(\r\n|\n|\r|\t)/gm,"");
            }),
            after: Crackle.stringify($.makeArray($(JSON.parse(request.getResponseHeader('X-WordPress-Head'))
                      .replace(/(\r\n|\n|\r|\t)/gm,""))))
          };
          head.diff = Not(head.after).in(head.before);
          for (var i = 0; i < head.diff.length; i++) {
            var id = '#' + $(head.diff[i]).attr('id');
            if ($(id).length > 0) {
              $(id).remove();
              $('head').append(head.diff[i]);
            } else {
              $('head').append(footer.diff[i]);
            }
          }
          // Footer
          var footer = {
            before: Crackle.stringify($.makeArray($('footer').nextAll())).map(function(e) {
              return e.replace(/(\r\n|\n|\r|\t)/gm,"");
            }),
            after: Crackle.stringify($.makeArray($(JSON.parse(request.getResponseHeader('X-WordPress-Footer'))
                      .replace(/(\r\n|\n|\r|\t)/gm,""))))
          };
          footer.diff = Not(footer.after).in(footer.before).map(function(e) {
            if ($(e).attr('id') === 'wpadminbar') {
              return Crackle.stringify($(e).removeClass());
            }
            else {
              return e;
            }
          });
          for (var i = 0; i < footer.diff.length; i++) {
            var id = '#' + $(footer.diff[i]).attr('id');
            if ($(id).length > 0) {
              $(id).remove();
              $('body').append(footer.diff[i]);
            } else {
              $('body').append(footer.diff[i]);
            }
          }
        });
      });
    }
  });
})(jQuery);
