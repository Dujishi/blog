function toggleMenu() {
  var nav = document.getElementsByClassName("site-header-nav")[0];
  if (nav.style.display == "inline-flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "inline-flex";
  }
}

jQuery(function () {
  // 回到顶部
  function toTop() {
    var $toTop = $(".gotop");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() >= $(window).height()) {
        $toTop.css("display", "block").fadeIn();
      } else {
        $toTop.fadeOut();
      }
    });

    $toTop.on("click", function (evt) {
      var $obj = $("body,html");
      $obj.animate({
        scrollTop: 0
      }, 240);

      evt.preventDefault();
    });
  }

  toTop();
});

/**
 * js网页雪花效果jquery插件
 */
(function ($) {

  $.fn.snow = function (options) {

    var $flake = $('<div id="snowbox" />').css({ 'position': 'absolute', 'top': '-50px' }).html('&#10052;'),
      documentHeight = $(document).height(),
      documentWidth = $(document).width(),
      defaults = {
        minSize: 10,		//雪花的最小尺寸
        maxSize: 20,		//雪花的最大尺寸
        newOn: 1000,		//雪花出现的频率
        flakeColor: "#FFFFFF"
      },
      options = $.extend({}, defaults, options);

    var interval = setInterval(function () {
      var startPositionLeft = Math.random() * documentWidth - 100,
        startOpacity = 0.5 + Math.random(),
        sizeFlake = options.minSize + Math.random() * options.maxSize,
        endPositionTop = documentHeight - 40,
        endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
        durationFall = documentHeight * 10 + Math.random() * 5000;
      $flake.clone().appendTo('body').css({
        left: startPositionLeft,
        opacity: startOpacity,
        'font-size': sizeFlake,
        color: options.flakeColor
      }).animate({
        top: endPositionTop,
        left: endPositionLeft,
        opacity: 0.2
      }, durationFall, 'linear', function () {
        $(this).remove()
      }
      );

    }, options.newOn);

  };

})(jQuery);


$(function () {
  $.fn.snow({
    minSize: 5, //雪花的最小尺寸
    maxSize: 40, //雪花的最大尺寸
    newOn: 100 //雪花出现的频率 这个数值越小雪花越多
  });
});
