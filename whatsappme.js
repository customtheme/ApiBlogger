(function ($) {
  'use strict';

  $(function () {
    var delay_on_start = 3000;
    var $whatsappme = $('.whatsappme');
    var wame_settings = $whatsappme.data('settings');

    // In some strange cases data settings are empty
    if (typeof(wame_settings) == 'undefined') {
      try {
        wame_settings = JSON.parse($whatsappme.attr('data-settings'));
      } catch (error) {
        wame_settings = undefined;
      }
    }

    // only works if whatsappme is defined
    if ($whatsappme.length && !!wame_settings && !!wame_settings.telephone) {
      whatsappme_magic();
    }

    function whatsappme_magic() {
      var is_mobile = !!navigator.userAgent.match(/Android|iPhone|BlackBerry|IEMobile|Opera Mini/i);
      var timeoutID = null;

      // stored values
      var is_clicked = localStorage.whatsappme_click == 'yes';
      var views = wame_settings.message_text === '' ? 0 : parseInt(localStorage.whatsappme_views || 0) + 1;
      localStorage.whatsappme_views = views;

      // show button / dialog
      if (!wame_settings.mobile_only || is_mobile) {
        setTimeout(function () {
          $whatsappme.addClass('whatsappme--show');
        }, delay_on_start);
        if (views > 1 && !is_clicked) {
          setTimeout(function () {
            $whatsappme.addClass('whatsappme--dialog');
          }, delay_on_start + wame_settings.message_delay);
        }
      }

      if (!is_mobile && wame_settings.message_text !== '') {
        $('.whatsappme__button').mouseenter(function () {
          timeoutID = setTimeout(function () {
            $whatsappme.addClass('whatsappme--dialog');
          }, 1600);
        }).mouseleave(function () {
          clearTimeout(timeoutID);
        });
      }

      $('.whatsappme__button').click(function () {
        $whatsappme.removeClass('whatsappme--dialog');
        localStorage.whatsappme_click = 'yes';

        // Send Google Analytics event
        if (typeof (ga) !== 'undefined') {
          ga('send', 'event', {
            eventCategory: 'WhatsAppMe',
            eventAction: 'click',
            eventLabel: window.location.toString(),
            transport: 'beacon'
          });
        }

        whatsapp_open(wame_settings.telephone, wame_settings.message_send);
      });

      $('.whatsappme__close').click(function () {
        $whatsappme.removeClass('whatsappme--dialog');
        localStorage.whatsappme_click = 'yes';
      });
    }

    // Open WhatsApp link with optional message
    function whatsapp_open(phone, message) {
      var link = 'https://api.whatsapp.com/send?phone=' + phone;
      if (typeof (message) == 'string' && message != '') {
        link += '&text=' + encodeURIComponent(message);
      }

      window.open(link, 'whatsappme');
    }

  });

})(jQuery);
