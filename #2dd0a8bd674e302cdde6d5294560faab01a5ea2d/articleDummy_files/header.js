window.twoClickOembed = (function() {
  var itemsToReplaceOnOptIn = [];
  var afterReplaceAll = function() {};

  return {
    register: function(el, html, provider) {
      html = unescape(html);
      var usesCustomPoster = jQuery(el).parents().first().is('[data-custom-poster]');
      var item = {
        el: el,
        html: usesCustomPoster ? makeAutoplay(provider, html) : html
      };
      var alert = jQuery('.video_oembed_alert', el);
      var alertVisible = true;

      if (usesCustomPoster) {
        alert.css('visibility', 'hidden');
        alertVisible = false;
      }
      else if (twoClickOembed.isOptIn()) {
        replaceItem(item);
      }
      else if (provider == 'Instagram') {
        itemsToReplaceOnOptIn.push(item);
        afterReplaceAll = function() {
          sbi_init(function(imagesArr,transientName) {
            sbi_cache_all(imagesArr,transientName);
          });
        };
      }

      el.on('click', function() {
        if (!twoClickOembed.isOptIn() && !alertVisible) {
          alertVisible = true;
          alert.css('visibility', 'visible');
        }
        else {
          twoClickOembed.optIn();
          replaceItem(item);
        }
      });
    },

    isOptIn: function() {
      return !!Cookies.get('twoClickOembed-replace');
    },

    optIn: function() {
      if (!twoClickOembed.isOptIn()) {
        for (var i = 0; i < itemsToReplaceOnOptIn.length; i++) {
          var otherItem = itemsToReplaceOnOptIn[i];
          replaceItem(otherItem);
        }

        afterReplaceAll();

        Cookies.set('twoClickOembed-replace', 'always');
        twoClickOembed.updateCheckBoxes();
      }
    },

    optOut: function() {
      Cookies.remove('twoClickOembed-replace');
      twoClickOembed.updateCheckBoxes();
    },

    updateCheckBoxes: function() {
      jQuery('input[data-two-click-oembed="opt-out"]').each(function() {
        var checkbox = jQuery(this);

        if (twoClickOembed.isOptIn()) {
          checkbox.removeAttr('checked');
        }
        else {
          checkbox.attr('checked', 'checked');
        }
      });
    }
  };

  function replaceItem(item) {
    jQuery(item.el).replaceWith(item.html);

    if (window.FB && window.FB.XFBML && window.FB.XFBML.parse) {
       FB.XFBML.parse();
    }
  }

  function unescape(html) {
    return jQuery("<div />").html(html).text()
  }

  function makeAutoplay(provider, html) {
    if (provider == 'Facebook') {
      return html.replace('data-href=', 'data-autoplay="true" data-href=' );
    }
    else if (provider == 'Vimeo' || provider == 'YouTube') {
      var match = html.match(/src="([^"]+)"/);

      if (match) {
         var src = match[1];

         if (src.indexOf('?') >= 0) {
           src = src + '&autoplay=1';
         }
         else {
           src = src + '?autoplay=1';
         }

         return html.replace(/src="([^"]+)"/, 'src="' + src + '"');
       }
    }
    else {
      return html;
    }
  }
}());
