window.quarksAnalytics = (function() {
  var cookieName = 'quarks-analytics-opt-out';

  jQuery(function($) {
    $('input[data-quarks-analytics="opt-out"]').each(function() {
      var checkbox = $(this);

      if (quarksAnalytics.isOptOut()) {
        checkbox.attr('checked', 'checked');
      }

      checkbox.on('change', function() {
        if (jQuery(checkbox).is(':checked')) {
          quarksAnalytics.optOut();
        }
        else {
          quarksAnalytics.optIn();
        }
      })
    });
  });

  return {
    isOptOut: function() {
      return !!Cookies.get(cookieName);
    },

    optOut: function() {
      Cookies.set(cookieName, 'opt-out');
    },

    optIn: function() {
      Cookies.remove(cookieName);
    }
  };
}())

jQuery(function($) {
  twoClickOembed.updateCheckBoxes();

  $('input[data-two-click-oembed="opt-out"]').each(function() {
    var checkbox = $(this);

    checkbox.on('change', function() {
      if (jQuery(checkbox).is(':checked')) {
        twoClickOembed.optOut();

        if (checkbox.is('input[data-two-click-oembed-reload]')) {
          location.reload();
        }
      }
      else {
        twoClickOembed.optIn();
      }
    })
  });
});


jQuery(".share").on('click', function(e) {
  jQuery(".fab").removeClass("no");
  if(e.target != this) return;
  jQuery('.share, .fab').toggleClass("active");
});

jQuery('#flyout-menu-toggle').on('click', function() {
  jQuery('#flyout-menu').toggleClass('show');
  jQuery('#flyout-menu-toggle').toggleClass('active');
  jQuery('#quarks-navbar').toggleClass('flyout-menu-active');
});

jQuery('#flyout-menu').on('mousewheel', function(event) {
  return false;
});

jQuery(function($) {
  $('body').on('mouseenter', '[data-glow=trigger]', function() {
    glowTarget(this).addClass('glow-active');
  });

  $('body').on('mouseleave', '[data-glow=trigger]', function() {
    glowTarget(this).removeClass('glow-active');
  });

  function glowTarget(el) {
    var targetId = $(el).data('glow-target-id');

    if (targetId) {
      return $('#' + targetId);
    }
    else {
      return $(el).parents('[data-glow=root]').find('.with-glow');
    }
  }
})

// Navigation layout settings according to positioning and mediaQueries
jQuery(function($) {
  function inMobileBreakpoint() {
    var maxWidthLimit = 767;

    if (window.matchMedia) {
      return window.matchMedia('(max-width: '+ maxWidthLimit +'px)').matches;
    } else {
      return $(window).width() <= maxWidthLimit;
    }
  }

  var isMobile = inMobileBreakpoint();

  var userAgent = navigator.userAgent.toLowerCase();
  var isIE = (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1);

  var stickyStartsAt = 50;

  function setNavigationLayout() {
    if (! isMobile) {
      var scrollTop = $(window).scrollTop();

      var isStickied = (scrollTop > stickyStartsAt);

      $('#quarks-navbar').toggleClass('stickied', isStickied);

      $('#quarks-navbar').toggleClass('fixed-sticky', (isStickied && isIE));
    }
  }

  window.addEventListener('scroll', _.throttle(function() {
    setNavigationLayout();
  }, 250));

  setNavigationLayout();
});

// Sticky jumpmarks

jQuery(function($) {
  $('.jumpmarks_sticky').each(function() {
    var box = $(this);
    var sectionItems = $('li', box);
    var sections = sectionItems.map(function() {
      var section = $($('a', this).attr('href'));
      section.data('sectionItem', $(this));
      return section[0];
    });

    window.addEventListener('scroll', _.throttle(updateSectionItems, 100, {leading: false}));

    function updateSectionItems() {
      var scrollTop = Math.ceil($(window).scrollTop());
      var currentSection = sections.filter(function() {
        var section = $(this);
        var top = Math.floor(section.offset().top);
        return scrollTop >= top && scrollTop < top + section.height();
      }).first();

      sectionItems.removeClass('current');

      var currentSectionItem = currentSection.data('sectionItem') || $();
      currentSectionItem.addClass('current');

      box.toggleClass('visible', !!currentSection.length);
    }
  });
});

// Flexslider

if (jQuery.flexslider && jQuery.flexslider.defaults) {
  jQuery.flexslider.defaults.init = function(slider) {
    slider.trigger('flexsliderinit');
  }

  jQuery.flexslider.defaults.after = function(slider) {
    slider.trigger('flexsliderafter');
  }
}

jQuery(function($) {
  $('.galerie_container').each(function() {
    var container = this;
    var flexsliderElement = $('.flexslider', container);

    flexsliderElement.on('flexsliderinit', function() {
      var flexslider = flexsliderElement.data('flexslider');
      var label = $('.galerie_image_count')

      $('.galerie_next', container).on('click', function() {
        flexsliderElement.flexslider('next');
      });

      $('.galerie_prev', container).on('click', function() {
        flexsliderElement.flexslider('prev');
      });

      flexsliderElement.on('flexsliderafter', update)
      update();

      function update() {
        label.text((flexslider.currentSlide + 1) + ' von ' + flexslider.count);
      }
    });
  });
});
