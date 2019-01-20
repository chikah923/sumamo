"use strict";
(function() {
  
  /**
   * Variables
   */
  var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),
  
    $document = $(document),
    $window = $(window),
    $html = $("html"),
  
    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,
    onloadCaptchaCallback,
  
    plugins = {
      pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      bootstrapModalDialog: $('.modal'),
      bootstrapTabs: $(".tabs"),
      rdNavbar: $(".rd-navbar"),
      materialParallax: $(".parallax-container"),
      rdGoogleMaps: $(".rd-google-map"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      owl: $(".owl-carousel"),
      swiper: $(".swiper-slider"),
      search: $(".rd-search"),
      searchResults: $('.rd-search-results'),
      statefulButton: $('.btn-stateful'),
      isotope: $(".isotope"),
      popover: $('[data-toggle="popover"]'),
      viewAnimate: $('.view-animate'),
      photoSwipeGallery: $("[data-photo-swipe-item]"),
      radio: $("input[type='radio']"),
      checkbox: $("input[type='checkbox']"),
      customToggle: $("[data-custom-toggle]"),
      progressBar: $(".progress-bar-js"),
      counter: $(".counter"),
      selectFilter: $("select"),
      flickrfeed: $(".flickr"),
      dateCountdown: $('.DateCountdown'),
      captcha: $('.recaptcha'),
      mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
      mfpGallery: $('[data-lightbox^="gallery"]'),
      scroller: $(".scroll-wrap"),
      pageLoader: $(".page-loader"),
      slick: $('.slick-slider'),
      customWaypoints: $('[data-custom-scroll-to]'),
      rdVideoPlayer: $(".rd-video-player"),
      stepper: $("input[type='number']"),
      customParallax: $(".custom-parallax"),
      vide: $(".vide_bg"),
      copyrightYear: $("#copyright-year"),
      mailchimp: $('.mailchimp-mailform'), 
      campaignMonitor: $('.campaign-mailform'),
      jPlayer: $('.jp-jplayer'),
      jPlayerInit: $('.jp-player-init'),
      jPlayerVideo: $('.jp-video-init') 
    };
  
  /**
   * Initialize All Scripts
   */
  $document.ready(function () {
    var isNoviBuilder = window.xMode;
    /**
     * getSwiperHeight
     * @description  calculate the height of swiper slider basing on data attr
     */
    function getSwiperHeight(object, attr) {
      var val = object.attr("data-" + attr),
        dim;
  
      if (!val) {
        return undefined;
      }
  
      dim = val.match(/(px)|(%)|(vh)$/i);
  
      if (dim.length) {
        switch (dim[0]) {
          case "px":
            return parseFloat(val);
          case "vh":
            return $window.height() * (parseFloat(val) / 100);
          case "%":
            return object.width() * (parseFloat(val) / 100);
        }
      } else {
        return undefined;
      }
    }
  
    /**
     * toggleSwiperInnerVideos
     * @description  toggle swiper videos on active slides
     */
    function toggleSwiperInnerVideos(swiper) {
      var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos,
        videoItems = prevSlide.find("video");
      
      for(i = 0; i < videoItems.length; i++) {
        videoItems[i].pause();
      }
  
      videos = nextSlide.find("video");
      if (videos.length) {
        videos.get(0).play();
      }
    }
  
    /**
     * toggleSwiperCaptionAnimation
     * @description  toggle swiper animations on active slides
     */
    function toggleSwiperCaptionAnimation(swiper) {
      var prevSlide = $(swiper.container).find("[data-caption-animate]"),
        nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
        delay,
        duration,
        nextSlideItem,
        prevSlideItem;
      
      for (i = 0; i < prevSlide.length; i++) {
        prevSlideItem = $(prevSlide[i]);
  
        prevSlideItem.removeClass("animated")
          .removeClass(prevSlideItem.attr("data-caption-animate"))
          .addClass("not-animated");
      }
  
      for (i = 0; i < nextSlide.length; i++) {
        nextSlideItem = $(nextSlide[i]);
        delay = nextSlideItem.attr("data-caption-delay");
        duration = nextSlideItem.attr('data-caption-duration');
        
        var tempFunction = function (nextSlideItem, duration) {
          return function(){
            nextSlideItem
              .removeClass("not-animated")
              .addClass(nextSlideItem.attr("data-caption-animate"))
              .addClass("animated");
  
            if (duration) {
              nextSlideItem.css('animation-duration', duration + 'ms');
            }
          };
        };
  
        setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
      }
    }
  
    /**
     * makeParallax
     * @description  create swiper parallax scrolling effect
     */
    function makeParallax(el, speed, wrapper, prevScroll) {
      var scrollY = window.scrollY || window.pageYOffset;
  
      if (prevScroll != scrollY) {
        prevScroll = scrollY;
        el.addClass('no-transition');
        el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
        el.height();
        el.removeClass('no-transition');
  
        if (el.attr('data-fade') === 'true') {
          var bound = el[0].getBoundingClientRect(),
            offsetTop = bound.top * 2 + scrollY,
            sceneHeight = wrapper.outerHeight(),
            sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
            layerDevider = offsetTop + el.outerHeight() / 2.0,
            pos = sceneHeight / 6.0,
            opacity;
          if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
            el[0].style["opacity"] = 1;
          } else {
            if (sceneDevider - pos < layerDevider) {
              opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
            } else {
              opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
            }
            el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
          }
        }
      }
  
      requestAnimationFrame(function () {
        makeParallax(el, speed, wrapper, prevScroll);
      });
    }
  
    /**
     * isScrolledIntoView
     * @description  check the element whas been scrolled into the view
     */
    function isScrolledIntoView(elem) {
      if  (!isNoviBuilder) {
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
      }
      else {
        return true;
      }
    }
  
    /**
     * initOnView
     * @description  calls a function when element has been scrolled into the view
     */
    function lazyInit(element, func) {
      var $win = jQuery(window);
      $win.on('load scroll', function () {
        if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
          func.call();
          element.addClass('lazy-loaded');
        }
      });
    }
  
    /**
     * Page loader
     * @description Enables Page loader
     */
    if (plugins.pageLoader.length > 0) {
  
      $window.on("load", function () {
        var loader = setTimeout(function () {
          plugins.pageLoader.addClass("loaded");
          $window.trigger("resize");
        }, 100);
      });
    } 
  
    /**
     * Custom Waypoints
     */
    if (plugins.customWaypoints.length && !isNoviBuilder) {
      var i;
      for (i = 0; i < plugins.customWaypoints.length; i++) {
        var $this = $(plugins.customWaypoints[i]);
  
        $this.on('click', function (e) {
          e.preventDefault();
          $("body, html").stop().animate({
            scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
          }, 1000, function () {
            $window.trigger("resize");
          });
        });
      }
    }
  
    /**
     * Live Search
     * @description  create live search results
     */
    function liveSearch(options) {
      options.live.removeClass('cleared').html();
      options.current++;
      options.spin.addClass('loading');
  
      $.get(handler, {
        s: decodeURI(options.term),
        liveSearch: options.element.attr('data-search-live'),
        dataType: "html",
        liveCount: options.liveCount,
        filter: options.filter,
        template: options.template
      }, function (data) {
        options.processed++;
        var live = options.live;
        if (options.processed == options.current && !live.hasClass('cleared')) {
          live.find('> #search-results').removeClass('active');
          live.html(data);
          setTimeout(function () {
            live.find('> #search-results').addClass('active');
          }, 50);
        }
        options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
      })
    }  
  
    /**
     * attachFormValidator
     * @description  attach form validation to elements
     */
    function attachFormValidator(elements) {
      for (var i = 0; i < elements.length; i++) {
        var o = $(elements[i]), v;
        o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
        v = o.parent().find(".form-validation");
        if (v.is(":last-child")) {
          o.addClass("form-control-last-child");
        }
      }
  
      elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;
  
          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }
  
          if ($this.parents('.rd-mailform').hasClass('success')) {
            return;
          }
  
          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');
    }
  
    /**
     * isValidated
     * @description  check if all elemnts pass validation
     */
    function isValidated(elements, captcha) {
      var results, errors = 0;
  
      if (elements.length) {
        for (j = 0; j < elements.length; j++) {
  
          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        }
  
        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors == 0
          }
        }
  
        return errors == 0;
      }
      return true;
    }
  
  
    /**
     * validateReCaptcha
     * @description  validate google reCaptcha
     */
    function validateReCaptcha(captcha) {
      var $captchaToken = captcha.find('.g-recaptcha-response').val();
  
      if ($captchaToken == '') {
        captcha
          .siblings('.form-validation')
          .html('Please, prove that you are not robot.')
          .addClass('active');
        captcha
          .closest('.form-group')
          .addClass('has-error');
  
        captcha.on('propertychange', function () {
          var $this = $(this),
            $captchaToken = $this.find('.g-recaptcha-response').val();
  
          if ($captchaToken != '') {
            $this
              .closest('.form-group')
              .removeClass('has-error');
            $this
              .siblings('.form-validation')
              .removeClass('active')
              .html('');
            $this.off('propertychange');
          }
        });
  
        return false;
      }
  
      return true;
    }
  
  
    /**
     * onloadCaptchaCallback
     * @description  init google reCaptcha
     */
    window.onloadCaptchaCallback = function () {
      for (i = 0; i < plugins.captcha.length; i++) {
        var $capthcaItem = $(plugins.captcha[i]);
  
        grecaptcha.render(
          $capthcaItem.attr('id'),
          {
            sitekey: $capthcaItem.attr('data-sitekey'),
            size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
            theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
            callback: function (e) {
              $('.recaptcha').trigger('propertychange');
            }
          }
        );
        $capthcaItem.after("<span class='form-validation'></span>");
      }
    }
  
    /**
     * Init Bootstrap tooltip
     * @description  calls a function when need to init bootstrap tooltips
     */
    function initBootstrapTooltip(tooltipPlacement) {
      if (window.innerWidth < 599) {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltip({
          placement: 'bottom'
        });
      } else {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltipPlacement;
        plugins.bootstrapTooltip.tooltip();
      }
    }
  
    /**
     * Copyright Year
     * @description  Evaluates correct copyright year
     */
    
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }
  
    /**
     * Is Mac os
     * @description  add additional class on html if mac os.
     */
    if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");
  
    /**
     * Bootstrap tabs
     * @description Activate Bootstrap Tabs
     */
  
    if (plugins.bootstrapTabs.length) {
      var i;
      for (i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTabsItem = $(plugins.bootstrapTabs[i]),
          isURLTabs = bootstrapTabsItem.attr('data-url-tabs') == 'true',
          currentHash = window.location.hash,
          tabsNav = bootstrapTabsItem.find('.tabs-nav');
  
        if (isURLTabs) {
          $('[data-content-to]:first-of-type').addClass('show');
        }
  
        bootstrapTabsItem.find('.nav-tabs').on('click', 'a', (function (isURLTabs, currentHash) {
          return function (event) {
            var currentLink = $(this).attr('href');
  
            event.preventDefault();
            $(this).tab('show');
  
            if (isURLTabs) {
              currentHash = currentLink;
              window.location.hash = currentHash;
            }
  
            var currentItem = $('[data-content-to].show');
            currentItem.removeClass('show');
  
            var newItem = $('[data-content-to = ' + currentHash + ']');
            newItem.addClass('show');
          };
        })(isURLTabs, currentHash));
  
        if (isURLTabs && currentHash) {
          bootstrapTabsItem.find("a[href$='" + currentHash + "']").first().trigger('click');
  
          setTimeout(function () {
            window.scrollTo(0, 0);
          }, 200);
        }
  
        tabsNav.on('click', 'a', function (bootstrapTabsItem) {
          return function (e) {
            if ( $(this).attr('href').indexOf('#') == -1) {
              return;
            }
  
            e.preventDefault();
            e.stopPropagation();
            bootstrapTabsItem.find("a[href$='" + $(this).attr('href').split('#').pop() + "']").first().trigger('click');
          };
        }(bootstrapTabsItem));
      }
    }
  
  
    /**
     * IE Polyfills
     * @description  Adds some loosing functionality to IE browsers
     */
    if (isIE) {
      if (isIE < 10) {
        $html.addClass("lt-ie-10");
      }
  
      if (isIE < 11) {
        if (plugins.pointerEvents) {
          $.getScript(plugins.pointerEvents)
            .done(function () {
              $html.addClass("ie-10");
              PointerEventsPolyfill.initialize({});
            });
        }
      }
  
      if (isIE === 11) {
        $("html").addClass("ie-11");
      }
  
      if (isIE === 12) {
        $("html").addClass("ie-edge");
      }
    }
  
    /**
     * Bootstrap Tooltips
     * @description Activate Bootstrap Tooltips
     */
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
      initBootstrapTooltip(tooltipPlacement);
      $window.on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      })
    }
  
    /**
     * bootstrapModalDialog
     * @description Stap vioeo in bootstrapModalDialog
     */
    if (plugins.bootstrapModalDialog.length > 0) {
      var i = 0;
  
      for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
        var modalItem = $(plugins.bootstrapModalDialog[i]);
  
        modalItem.on('hidden.bs.modal', $.proxy(function () {
          var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');
  
          if (rdVideoInside.length) {
            rdVideoInside[0].pause();
          }
  
          if (youTubeVideoInside.length) {
            var videoUrl = youTubeVideoInside.attr('src');
  
            youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
          }
        }, modalItem))
      }
    }
  
    /**
     * RD Google Maps
     * @description Enables RD Google Maps plugin
     */
    if (plugins.rdGoogleMaps.length) {
      var i;
  
      $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAFeB0kVA6ouyJ_gEvFbMaefLy3cBCyRwo&sensor=false&libraries=geometry,places&v=3.7", function () {
        var head = document.getElementsByTagName('head')[0],
          insertBefore = head.insertBefore;
  
        head.insertBefore = function (newElement, referenceElement) {
          if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') != -1 || newElement.innerHTML.indexOf('gm-style') != -1) {
            return;
          }
          insertBefore.call(head, newElement, referenceElement);
        };
  
        for (i = 0; i < plugins.rdGoogleMaps.length; i++) {
  
          var $googleMapItem = $(plugins.rdGoogleMaps[i]);
  
          lazyInit($googleMapItem, $.proxy(function () {
            var $this = $(this),
              styles = $this.attr("data-styles");
  
            $this.googleMap({
              styles: styles ? JSON.parse(styles) : [],
              onInit: function (map) {
                var inputAddress = $('#rd-google-map-address');
  
                if (inputAddress.length) {
                  var input = inputAddress;
                  var geocoder = new google.maps.Geocoder();
                  var marker = new google.maps.Marker(
                    {
                      map: map,
                      icon: "images/gmap_marker.png",
                    }
                  );
                  var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                  autocomplete.bindTo('bounds', map);
                  inputAddress.attr('placeholder', '');
                  inputAddress.on('change', function () {
                    $("#rd-google-map-address-submit").trigger('click');
                  });
                  inputAddress.on('keydown', function (e) {
                    if (e.keyCode == 13) {
                      $("#rd-google-map-address-submit").trigger('click');
                    }
                  });
  
  
                  $("#rd-google-map-address-submit").on('click', function (e) {
                    e.preventDefault();
                    var address = input.val();
                    geocoder.geocode({'address': address}, function (results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();
  
                        map.setCenter(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ));
                        marker.setPosition(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ))
                      }
                    });
                  });
                }
              }
            });
          }, $googleMapItem));
        }
      });
    }
  
    /**
     * Radio
     * @description Add custom styling options for input[type="radio"]
     */
    if (plugins.radio.length) {
      var i;
      for (i = 0; i < plugins.radio.length; i++) {
        var $this = $(plugins.radio[i]);
        $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
      }
    }
  
    /**
     * Checkbox
     * @description Add custom styling options for input[type="checkbox"]
     */
    if (plugins.checkbox.length) {
      var i;
      for (i = 0; i < plugins.checkbox.length; i++) {
        var $this = $(plugins.checkbox[i]);
        $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
      }
    }
  
    /**
     * Popovers
     * @description Enables Popovers plugin
     */
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr('data-placement', 'bottom');
        plugins.popover.popover();
      }
      else {
        plugins.popover.popover();
      }
    }
  
    /**
     * Bootstrap Buttons
     * @description  Enable Bootstrap Buttons plugin
     */
    if (plugins.statefulButton.length) {
      $(plugins.statefulButton).on('click', function () {
        var statefulButtonLoading = $(this).button('loading');
  
        setTimeout(function () {
          statefulButtonLoading.button('reset')
        }, 2000);
      })
    }
  
    /**
     * UI To Top
     * @description Enables ToTop Button
     */
    if (isDesktop && !isNoviBuilder) {
      $().UItoTop({
        easingType: 'easeOutQuart',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }
  
    /**
     * TimeCircles
     * @description  Enable TimeCircles plugin
     */
    if (plugins.dateCountdown.length) {
      var i;
      for (i = 0; i < plugins.dateCountdown.length; i++) {
        var dateCountdownItem = $(plugins.dateCountdown[i]),
          time = {
            "Days": {
              "text": "Days",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Hours": {
              "text": "Hours",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Minutes": {
              "text": "Minutes",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Seconds": {
              "text": "Seconds",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            }
          };
  
        dateCountdownItem.TimeCircles({
          color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
          animation: "smooth",
          bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.9,
          circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
          fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03
        });
  
        $window.on('load resize orientationchange', function () {
          if (window.innerWidth < 479) {
            dateCountdownItem.TimeCircles({
              time: {
                "Days": {
                  "text": "Days",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                "Hours": {
                  "text": "Hours",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                "Minutes": {
                  "text": "Minutes",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                Seconds: {
                  "text": "Seconds",
                  show: false,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                }
              }
            }).rebuild();
          } else if (window.innerWidth < 767) {
            dateCountdownItem.TimeCircles({
              time: {
                "Days": {
                  "text": "Days",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                "Hours": {
                  "text": "Hours",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                "Minutes": {
                  "text": "Minutes",
                  "show": true,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                },
                Seconds: {
                  text: '',
                  show: false,
                  color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                }
              }
            }).rebuild();
          } else {
            dateCountdownItem.TimeCircles({time: time}).rebuild();
          }
        });
      }
    }
  
    /**
     * RD Navbar
     * @description Enables RD Navbar plugin
     */
    if (plugins.rdNavbar.length) {
      plugins.rdNavbar.RDNavbar({
        stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        anchorNavSpeed: 1000,
        responsive: {
          0: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
          },
          768: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
          },
          992: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
          },
          1200: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
          }
        },
        callbacks: {
          onStuck: function () {
            var navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function(){
            return !isNoviBuilder;
          },
          onUnstuck: function () {
            if (this.$clone === null)
              return;

            var navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }
          }
        }
      });
      if (plugins.rdNavbar.attr("data-body-class")) {
        document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
      }
    }
  
    /**
     * ViewPort Universal
     * @description Add class in viewport
     */
    if (plugins.viewAnimate.length) {
      var i;
      for (i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view))
          .trigger("scroll");
      }
    }  
  
    /**
     * Swiper 3.1.7
     * @description  Enable Swiper Slider
     */
    if (plugins.swiper.length) {
      var i;
      for (i = 0; i < plugins.swiper.length; i++) {
        var s = $(plugins.swiper[i]);
        var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          parallax = s.parents('.rd-parallax').length,
          swiperSlide = s.find(".swiper-slide");
  
        for (j = 0; j < swiperSlide.length; j++) {
          var $this = $(swiperSlide[j]),
            url;
  
          if (url = $this.attr("data-slide-bg")) {
            $this.css({
              "background-image": "url(" + url + ")",
              "background-size": "cover"
            })
          }
        }
  
        swiperSlide.end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end()
          .swiper({
            autoplay: isNoviBuilder ? null :  s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
            direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
            effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
            speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
            keyboardControl: s.attr('data-keyboard') === "true",
            mousewheelControl: s.attr('data-mousewheel') === "true",
            mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
            nextButton: next.length ? next.get(0) : null,
            prevButton: prev.length ? prev.get(0) : null,
            pagination: pag.length ? pag.get(0) : null,
            paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
            paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            } : null : null,
            scrollbar: bar.length ? bar.get(0) : null,
            scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
            scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
            loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
            simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
            onTransitionStart: function (swiper) {
              toggleSwiperInnerVideos(swiper);
            },
            onTransitionEnd: function (swiper) {
              toggleSwiperCaptionAnimation(swiper);
            },
            onInit: function (swiper) {
              toggleSwiperInnerVideos(swiper);
              toggleSwiperCaptionAnimation(swiper);
  
              var swiperParalax = s.find(".swiper-parallax");
  
              for (var k = 0; k < swiperParalax.length; k++) {
                var $this = $(swiperParalax[k]),
                  speed;
  
                if (parallax && !isIEBrows && !isMobile) {
                  if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, s, false);
                  }
                }
              }
              $window.on('resize', function () {
                swiper.update(true);
              })
            }
          });
  
        $window
          .on("resize", function () {
            var mh = getSwiperHeight(s, "min-height"),
              h = getSwiperHeight(s, "height");
            if (h) {
              s.css("height", mh ? mh > h ? mh : h : h);
            }
          })
          .trigger("resize");
      }
    }
  
    /**
     * Select2
     * @description Enables select2 plugin
     */
    if (plugins.selectFilter.length) {
      var i;
      for (i = 0; i < plugins.selectFilter.length; i++) {
        var select = $(plugins.selectFilter[i]);
  
        select.select2({
          theme: "bootstrap"
        }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
      }
    }
  
    /**
     * RD Search
     * @description Enables search
     */
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';
  
      if (plugins.search.length) {
  
        plugins.search = $('.' + plugins.search[0].className);
  
        for (i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? (searchItem.find('.' + searchItem.attr('data-search-live'))) : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
              current: 0, processed: 0, timer: {}
            };
  
          if ($('.rd-navbar-search-toggle').length) {
            var toggle = $('.rd-navbar-search-toggle');
            toggle.on('click', function () {
              if (!($(this).hasClass('active'))) {
                searchItem.find('input').val('').trigger('propertychange');
              }
            });
          }
  
          if (options.live) {
            options.clearHandler = false;
  
            searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
              var ctx = this;
  
              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');
  
              clearTimeout(ctx.timer);
  
              if (ctx.term.length > 2) {
                ctx.timer = setTimeout(liveSearch(ctx), 200);
  
                if (ctx.clearHandler == false) {
                  ctx.clearHandler = true;
  
                  $("body").on("click", function (e) {
                    if ($(e.toElement).parents('.rd-search').length == 0) {
                      ctx.live.addClass('cleared').html('');
                    }
                  })
                }
  
              } else if (ctx.term.length == 0) {
                ctx.live.addClass('cleared').html('');
              }
            }, options, this));
          }
  
          searchItem.on('submit', $.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }
  
      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);
  
        if (match != null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }
  
    /**
     * Owl carousel
     * @description Enables Owl carousel plugin
     */
    if (plugins.owl.length) {
      var i;
      for (i = 0; i < plugins.owl.length; i++) {
        var c = $(plugins.owl[i]),
          responsive = {};
  
        var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-"],
          values = [0, 480, 768, 992, 1200, 1800],
          j, k;
  
        for (j = 0; j < values.length; j++) {
          responsive[values[j]] = {};
          for (k = j; k >= -1; k--) {
            if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
              responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
            }
            if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
              responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
            }
            if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
              responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
            }
          }
        }
  
        // Create custom Numbering
        if (typeof(c.attr("data-numbering")) !== 'undefined') {
          var numberingObject = $(c.attr("data-numbering"));
  
          c.on('initialized.owl.carousel changed.owl.carousel', function (numberingObject) {
            return function (e) {
              if (!e.namespace) return;
              numberingObject.find('.numbering-current').text((e.item.index + 1) % e.item.count + 1);
              numberingObject.find('.numbering-count').text(e.item.count);
            };
          }(numberingObject));
        }
  
        c.owlCarousel({
          autoplay: c.attr("data-autoplay") === "true",
          loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
          items: 1,
          dotsContainer: c.attr("data-pagination-class") || false,
          navContainer: c.attr("data-navigation-class") || false,
          mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
          nav: c.attr("data-nav") === "true",
          center: c.attr("data-center") === "true",
          dots: c.attr("data-dots") === "true",
          dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
          animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
          animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
          responsive: responsive,
          navText: []
        });
      }
    }
    
    /**
     * WOW
     * @description Enables Wow animation plugin
     */
    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
      new WOW().init();
    }
  
    /**
     * RD Input Label
     * @description Enables RD Input Label Plugin
     */
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }
  
    /**
     * Regula
     * @description Enables Regula plugin
     */
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    /**
     * MailChimp Ajax subscription
     */

    if (plugins.mailchimp.length) {
      for (i = 0; i < plugins.mailchimp.length; i++) {
        var $mailchimpItem = $(plugins.mailchimp[i]),
          $email = $mailchimpItem.find('input[type="email"]');

        // Required by MailChimp
        $mailchimpItem.attr('novalidate', 'true');
        $email.attr('name', 'EMAIL');

        $mailchimpItem.on('submit', $.proxy(function (e){
          e.preventDefault();

          var $this = this;

          var data = {},
            url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
            dataArray = $this.serializeArray(),
            $output = $("#" + $this.attr("data-form-output"));

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.msg).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function(data){
              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $mailchimpItem));
      }
    }


    /**
     * Campaign Monitor ajax subscription
     */

    if (plugins.campaignMonitor.length) {
      for (i = 0; i < plugins.campaignMonitor.length; i++) {
        var $campaignItem = $(plugins.campaignMonitor[i]);

        $campaignItem.on('submit', $.proxy(function (e){
          var data = {},
            url = this.attr('action'),
            dataArray = this.serializeArray(),
            $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
            $this = $(this);

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.Message).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function(data){
              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $campaignItem));
      }
    }
  
    /**
     * Google ReCaptcha
     * @description Enables Google ReCaptcha
     */
    if (plugins.captcha.length) {
      var i;
      $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }

    /**
     * RD Mailform
     * @version      3.2.0
     */
    if (plugins.rdMailForm.length) {
      var i, j, k,
        msg = {
          'MF000': 'Successfully sent!',
          'MF001': 'Recipients are not set!',
          'MF002': 'Form will not work locally!',
          'MF003': 'Please, define email field in your form!',
          'MF004': 'Please, define type of your form!',
          'MF254': 'Something went wrong with PHPMailer!',
          'MF255': 'Aw, snap! Something went wrong.'
        };

      for (i = 0; i < plugins.rdMailForm.length; i++) {
        var $form = $(plugins.rdMailForm[i]),
          formHasCaptcha = false;

        $form.attr('novalidate', 'novalidate').ajaxForm({
          data: {
            "form-type": $form.attr("data-form-type") || "contact",
            "counter": i
          },
          beforeSubmit: function (arr, $form, options) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              inputs = form.find("[data-constraints]"),
              output = $("#" + form.attr("data-form-output")),
              captcha = form.find('.recaptcha'),
              captchaFlag = true;

            output.removeClass("active error success");

            if (isValidated(inputs, captcha)) {

              // veify reCaptcha
              if (captcha.length) {
                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                  captchaMsg = {
                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                    'CPT002': 'Something wrong with google reCaptcha'
                  };

                formHasCaptcha = true;

                $.ajax({
                  method: "POST",
                  url: "bat/reCaptcha.php",
                  data: {'g-recaptcha-response': captchaToken},
                  async: false
                })
                  .done(function (responceCode) {
                    if (responceCode !== 'CPT000') {
                      if (output.hasClass("snackbars")) {
                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                        setTimeout(function () {
                          output.removeClass("active");
                        }, 3500);

                        captchaFlag = false;
                      } else {
                        output.html(captchaMsg[responceCode]);
                      }

                      output.addClass("active");
                    }
                  });
              }

              if (!captchaFlag) {
                return false;
              }

              form.addClass('form-in-process');

              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                output.addClass("active");
              }
            } else {
              return false;
            }
          },
          error: function (result) {
            if (isNoviBuilder)
              return;

            var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
              form = $(plugins.rdMailForm[this.extraData.counter]);

            output.text(msg[result]);
            form.removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }
          },
          success: function (result) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output")),
              select = form.find('select');

            form
              .addClass('success')
              .removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }

            result = result.length === 5 ? result : 'MF255';
            output.text(msg[result]);

            if (result === "MF000") {
              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active success");
              }
            } else {
              if (output.hasClass("snackbars")) {
                output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active error");
              }
            }

            form.clearForm();

            if (select.length) {
              select.select2("val", "");
            }

            form.find('input, textarea').trigger('blur');

            setTimeout(function () {
              output.removeClass("active error success");
              form.removeClass('success');
            }, 3500);
          }
        });
      }
    } 
    
    /**
     * PhotoSwipe Gallery
     * @description Enables PhotoSwipe Gallery plugin
     */
    if (plugins.photoSwipeGallery.length && !isNoviBuilder ) {
  
      // init image click event
      $document.delegate("[data-photo-swipe-item]", "click", function (event) {
        event.preventDefault();
  
        var $el = $(this),
          $galleryItems = $el.parents("[data-photo-swipe-gallery]").find("a[data-photo-swipe-item]"),
          pswpElement = document.querySelectorAll('.pswp')[0],
          encounteredItems = {},
          pswpItems = [],
          options,
          pswpIndex = 0,
          pswp;
  
        if ($galleryItems.length == 0) {
          $galleryItems = $el;
        }
  
        // loop over the gallery to build up the photoswipe items
        for (i = 0; i < $galleryItems.length; i++) {
          var $item = $($galleryItems[i]),
            src = $item.attr('href'),
            size = $item.attr('data-size').split('x'),
            pswdItem;
  
          if ($item.is(':visible')) {
  
            // if we have this image the first time
            if (!encounteredItems[src]) {
              // build the photoswipe item
              pswdItem = {
                src: src,
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                el: $item // save link to element for getThumbBoundsFn
              },
              // store that we already had this item
              encounteredItems[src] = {
                item: pswdItem,
                index: pswpIndex
              };
  
              // push the item to the photoswipe list
              pswpItems.push(pswdItem);
              pswpIndex++;
            }
          }
        }
        
        options = {
          index: encounteredItems[$el.attr('href')].index,
  
          getThumbBoundsFn: function (index) {
            var $el = pswpItems[index].el,
              offset = $el.offset();
  
            return {
              x: offset.left,
              y: offset.top,
              w: $el.width()
            };
          }
        };
  
        // open the photoswipe gallery
        pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, options);
        pswp.init();
      });
    }
  
    /**
     * Custom Toggles
     */
    if (plugins.customToggle.length) {
      var i;
  
      for (i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);
  
        $this.on('click', $.proxy(function (event) {
          event.preventDefault();
          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));
  
        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
  
        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
      }
    }
  
    /**
     * Progress bar
     * @description  Enable progress bar
     */
    if (plugins.progressBar.length) {
      var i,
        bar,
        type;
  
      for (i = 0; i < plugins.progressBar.length; i++) {
        var progressItem = plugins.progressBar[i];
        bar = null;
  
        if (progressItem.className.indexOf("progress-bar-horizontal") > -1) {
          type = 'Line';
        }
  
        if (progressItem.className.indexOf("progress-bar-radial") > -1) {
          type = 'Circle';
        }
  
        if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
          bar = new ProgressBar[type](progressItem, {
            strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100),
            trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0,
            text: {
              value: progressItem.getAttribute("data-counter") === "true" ? '0' : null,
              className: 'progress-bar__body',
              style: null
            }
          });
          bar.svg.setAttribute('preserveAspectRatio', "none meet");
          if (type === 'Line') {
            bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
          }
  
          bar.path.removeAttribute("stroke");
          bar.path.className.baseVal = "progress-bar__stroke";
          if (bar.trail) {
            bar.trail.removeAttribute("stroke");
            bar.trail.className.baseVal = "progress-bar__trail";
          }
  
          if (progressItem.getAttribute("data-easing") && !isIE) {
            $document
              .on("scroll", {"barItem": bar}, $.proxy(function (event) {
                var bar = event.data.barItem;
                var $this = $(this);
  
                if (isScrolledIntoView($this) && this.className.indexOf("progress-bar--animated") === -1) {
                  this.className += " progress-bar--animated";
                  bar.animate(parseInt($this.attr("data-value"), 10) / 100.0, {
                    easing: $this.attr("data-easing"),
                    duration: $this.attr("data-duration") ? parseInt($this.attr("data-duration"), 10) : 800,
                    step: function (state, b) {
                      if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                        b._container.className.indexOf("progress-bar-vertical") > -1) {
                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                      }
                      b.setText(Math.abs(b.value() * 100).toFixed(0));
                    }
                  });
                }
              }, progressItem))
              .trigger("scroll");
          } else {
            bar.set(parseInt($(progressItem).attr("data-value"), 10) / 100.0);
            bar.setText($(progressItem).attr("data-value"));
            if (type === 'Line') {
              bar.text.style.width = parseInt($(progressItem).attr("data-value"), 10) + "%";
            }
          }
        } else {
          console.error(progressItem.className + ": progress bar type is not defined");
        }
      }
    }
  
    /**
     * jQuery Count To
     * @description Enables Count To plugin
     */
    if (plugins.counter.length) {
      var i;
  
      for (i = 0; i < plugins.counter.length; i++) {
        var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
        $document
          .on("scroll", $.proxy(function () {
            var $this = this;
  
            if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
              $this.countTo({
                refreshInterval: 40,
                from: 0,
                to: parseInt($this.text(), 10),
                speed: $this.attr("data-speed") || 1000,
                formatter: function (value, options) {
                  if ($this.attr('data-formatter') != 'false') {
                    value = value.toFixed(options.decimals);
                    if (value < 10) {
                      return '0' + value;
                    }
                    return value;
  
                  } else if (value.toString().indexOf('.') !== -1) {
                    var decimals = $this.attr('data-to').split('.')[1];
                    return value.toFixed(options.decimals) + '.' + decimals;
  
                  } else {
                    return value.toFixed(options.decimals);
                  }
  
                }
              });
              $this.addClass('animated');
            }
          }, $counterNotAnimated))
          .trigger("scroll");
      }
    }
  
    /**
     * RD Flickr Feed
     * @description Enables RD Flickr Feed plugin
     */
    if (plugins.flickrfeed.length > 0) {
      var i;
      for (i = 0; i < plugins.flickrfeed.length; i++) {
        var flickrfeedItem = $(plugins.flickrfeed[i]);
        flickrfeedItem.RDFlickr({
          callback: function () {
            var items = flickrfeedItem.find("[data-photo-swipe-item]");
  
            if (items.length) {
              for (var j = 0; j < items.length; j++) {
                var image = new Image();
                image.setAttribute('data-index', j);
                image.onload = function () {
                  items[this.getAttribute('data-index')].setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);
                };
                image.src = items[j].getAttribute('href');
              }
            }
          }
        });
      }
    }
  
    /**
     * JQuery mousewheel plugin
     * @description  Enables jquery mousewheel plugin
     */
    if (plugins.scroller.length) {
      var i;
      for (i = 0; i < plugins.scroller.length; i++) {
        var scrollerItem = $(plugins.scroller[i]);
  
        scrollerItem.mCustomScrollbar({
          theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
          scrollInertia: 100,
          scrollButtons: {enable: false}
        });
      }
    }
  
    /**
     * Isotope
     * @description Enables Isotope plugin
     */
    if (plugins.isotope.length) {
      var i, j, isogroup = [];
      for (i = 0; i < plugins.isotope.length; i++) {
        var isotopeItem = plugins.isotope[i],
          filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
          iso;
  
        iso = new Isotope(isotopeItem, {
          itemSelector: '.isotope-item',
          layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
          filter: '*',
          masonry: {
            columnWidth: 0.42
          }
        });
  
        isogroup.push(iso);
  
        filterItems.on("click", function (e) {
          e.preventDefault();
          var filter = $(this),
            iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
            filtersContainer = filter.closest(".isotope-filters");
  
          filtersContainer
            .find('.active')
            .removeClass("active");
          filter.addClass("active");
  
          iso.isotope({
            itemSelector: '.isotope-item',
            layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
            filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]',
            masonry: {
              columnWidth: 0.42
            }
          });
  
          $window.trigger('resize');
  
        }).eq(0).trigger("click");
      }
  
      $window.on('load', function () {
        setTimeout(function () {
          var i;
          for (i = 0; i < isogroup.length; i++) {
            isogroup[i].element.className += " isotope--loaded";
            isogroup[i].layout();
          }
        }, 600);
  
        setTimeout(function () {
          $window.trigger('resize');
        }, 800);
      });
    }
    
    /**
     * RD Video Player
     * @description Enables RD Video player plugin
     */
    if (plugins.rdVideoPlayer.length) {
      var i;
      for (i = 0; i < plugins.rdVideoPlayer.length; i++) {
        var videoItem = plugins.rdVideoPlayer[i],
          volumeWrap = $(".rd-video-volume-wrap");
  
        $(videoItem).RDVideoPlayer({});
  
        volumeWrap.on("mouseenter", function () {
          $(this).addClass("hover")
        });
  
        volumeWrap.on("mouseleave", function () {
          $(this).removeClass("hover")
        });
  
        if (isTouch) {
          volumeWrap.find(".rd-video-volume").on("click", function () {
            $(this).toggleClass("hover")
          });
          $document.on("click", function (e) {
            if (!$(e.target).is(volumeWrap) && $(e.target).parents(volumeWrap).length == 0) {
              volumeWrap.find(".rd-video-volume").removeClass("hover")
            }
          })
        }
      }
    }
  
    /**
     * @module       Magnific Popup
     * @author       Dmitry Semenov
     * @see          http://dimsemenov.com/plugins/magnific-popup/
     * @version      v1.0.0
     */
    if (plugins.mfp.length > 0 || plugins.mfpGallery.length > 0 && !isNoviBuilder) {
      if (plugins.mfp.length) {
        for (i = 0; i < plugins.mfp.length; i++) {
          var mfpItem = plugins.mfp[i];
  
          $(mfpItem).magnificPopup({
            type: mfpItem.getAttribute("data-lightbox")
          });
        }
      }
      if (plugins.mfpGallery.length) {
        for (i = 0; i < plugins.mfpGallery.length; i++) {
          var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');
  
          for (var c = 0; c < mfpGalleryItem.length; c++) {
            $(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
          }
  
          mfpGalleryItem.end()
            .magnificPopup({
              delegate: '[data-lightbox]',
              type: "image",
              gallery: {
                enabled: true
              }
            });
        }
      }
    }
  
    /**
     * Slick carousel
     * @description  Enable Slick carousel plugin
     */
    if (plugins.slick.length) {
      var i;
      for (i = 0; i < plugins.slick.length; i++) {
        var $slickItem = $(plugins.slick[i]);
  
        $slickItem.slick({
          slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
          asNavFor: $slickItem.attr('data-for') || false,
          dots: $slickItem.attr("data-dots") == "true",
          infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") == "true",
          focusOnSelect: true,
          arrows: $slickItem.attr("data-arrows") == "true",
          swipe: $slickItem.attr("data-swipe") == "true",
          autoplay: $slickItem.attr("data-autoplay") == "true",
          vertical: $slickItem.attr("data-vertical") == "true",
          centerMode: $slickItem.attr("data-center-mode") == "true",
          centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
          mobileFirst: true,
          fade: $slickItem.attr("data-fade") == "true",
          responsive: [
            {
              breakpoint: 0,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1,
              }
            },
            {
              breakpoint: 479,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-xs-items'), 10) || 1,
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1,
              }
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1,
                swipe: false
              }
            }
          ]
        })
          .on('afterChange', function (event, slick, currentSlide, nextSlide) {
            var $this = $(this),
              childCarousel = $this.attr('data-child');
  
            if (childCarousel) {
              $(childCarousel + ' .slick-slide').removeClass('slick-current');
              $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
            }
          });
      }
    }
  
    /**
     * Stepper
     * @description Enables Stepper Plugin
     */
    if (plugins.stepper.length) {
      plugins.stepper.stepper({
        labels: {
          up: "",
          down: ""
        }
      });
    }

    /**
     * Material Parallax
     * @description Enables Material Parallax plugin
     */
    if (plugins.materialParallax.length) {
      var i;

      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for (i = 0; i < plugins.materialParallax.length; i++) {
          var parallax = $(plugins.materialParallax[i]),
            imgPath = parallax.data("parallax-img");

          parallax.css({
            "background-image": 'url(' + imgPath + ')',
            "background-attachment": "fixed",
            "background-size": "cover"
          });
        }
      }
    }

    /**
     *  Vide - v0.5.1
     *  @description jQuery plugin for video backgrounds
     */
    if (plugins.vide.length) {
      var i;
      for (i =0; i < plugins.vide.length; i++) {
        plugins.vide.vide({
            mp4: 'video/video-lg',
            poster: 'images/bg-image-10'
          },
          {
            loop: isNoviBuilder ? false : plugins.vide.vide = 'true',
            autoplay: isNoviBuilder ? false : plugins.vide.vide = 'true',
            posterType: 'jpg'
          });
      } 
    }

    /**
     * Jp Video player
     * @description  Custom jPlayer video initialization
     */

    if (plugins.jPlayerVideo.length) {
      $.each(plugins.jPlayerVideo, function (index, item) {
        var $item = $(item);

        $item.find('.jp-video').addClass('jp-video-' + index);

        new jPlayerPlaylist({
          jPlayer: item.getElementsByClassName("jp-jplayer")[0],
          cssSelectorAncestor: ".jp-video-" + index // Need too bee a selector not HTMLElement or Jq object, so we make it unique
        }, jpFormatePlaylistObj($(item).find('.jp-player-list .jp-player-list-item')), {
          playlistOptions: {
            enableRemoveControls: false
          },
          size: {
            width: "100%",
            height: "auto",
          },
          supplied: "webmv, ogv, m4v",
          useStateClassSkin: true,
          volume: 0.4
        });

        $(item).find(".jp-jplayer").on('click', function (e) {
          var $this = $(this);
          if ($('.jp-video-' + index).hasClass('jp-state-playing')) {
            $this.jPlayer("pause");
          } else {
            $this.jPlayer("play");
          }
        });

        var initialContainerWidth = $item.width();
        // this is the overall page container, so whatever is relevant to your page

        $window.resize(function () {
          if ($item.width() !== initialContainerWidth) {
            // checks current container size against it's rendered size on every resize.
            initialContainerWidth = $item.width();
            $item.trigger('resize', $item);
            //pass off to resize listener for performance
          }
        });
      });

      $window.on('resize', function (e) {
        $('.jp-video').each(function (index) {
          // find every instance of jplayer using a class in their default markup
          var $parentContainer = $(this).closest('.jp-video-init'),
            // finds jplayers closest parent element from the ones you give it (can chain as many as you want)
            containerWidth = $parentContainer.width(),
            //takes the closest elements width
            ARWidth = 1280,
            ARHeight = 720;

          // Width and height figures used to calculate the aspect ratio (will not restrict your players to this size)

          var aspectRatio = ARHeight / ARWidth;

          var videoHeight = Math.round(aspectRatio * containerWidth);
          // calculates the appropriate height in rounded pixels using the aspect ratio
          $(this).find('.jp-jplayer').width(containerWidth).height(videoHeight);
          // and then apply the width and height!
        });
      })
        .trigger('resize');
    }

    /**
     * jpFormatePlaylistObj
     * @description  format dynamic playlist object for jPlayer init
     */
    function jpFormatePlaylistObj(playlistHtml) {
      var playlistObj = [];

      // Format object with audio
      for (var i = 0; i < playlistHtml.length; i++){
        var playlistItem = playlistHtml[i],
          itemData = $(playlistItem).data();
        playlistObj[i] = {};

        for ( var key in itemData ){
          playlistObj[i][key.replace('jp', '').toLowerCase()] = itemData[key];
        }
      }

      return playlistObj;
    }

    /**
     * initJplayerBase
     * @description Base jPlayer init
     */
    function initJplayerBase(index, item, mediaObj) {
      return new jPlayerPlaylist({
        jPlayer: item.getElementsByClassName("jp-jplayer")[0],
        cssSelectorAncestor: ".jp-audio-" + index // Need too bee a selector not HTMLElement or Jq object, so we make it unique
      }, mediaObj, {
        playlistOptions: {
          enableRemoveControls: false
        },
        supplied: "ogv, m4v, oga, mp3",
        useStateClassSkin: true,
        volume: 0.4
      });
    }
  });


})();