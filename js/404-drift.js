// make the 404 page slightly deeper than the user has scrolled 🙈
if ($('.404-drift').length > 0) {
  $('.404-drift').height($(window).height()-100); // make the 404 div as tall as the page
                                                  // so we have just a little scroll space

  $('.404-message').html('<span class="emoji">😅</span> or maybe your content is just down here?')

  var scrollPostition = new Object();
  scrollPostition.current = 0;

  $(window).scroll(function (event) {
    scrollPostition.new = $(window).scrollTop();
    // console.log(scrollPostition);

    if (scrollPostition.new > scrollPostition.current) {
      scrollPostition.direction = 'down';
      var newHeight = $('.404-drift').height() + (scrollPostition.new - scrollPostition.current) + 1;
      $('.404-drift').height(newHeight);
    } else {
      scrollPostition.direction = 'up';
      var newHeight = $('.404-drift').height() + (scrollPostition.new - scrollPostition.current);
      $('.404-drift').height(newHeight);
    }

    scrollPostition.current = scrollPostition.new;
  });

}
