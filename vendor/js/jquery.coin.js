(function fn($) {
    $.fn.coin = function fn(coinClass, content, trail) {
        coinClass = coinClass || 'coin';
        content = content || '100$';
        trail = trail || '75px';

        var offset = this.offset();
        var $coin = $(document.createElement('div'));
        $coin.addClass(coinClass).css({
            position: 'absolute',
            top: offset.top,
            left: offset.left,
            'text-align': 'center',
            'margin-top': '-20px',
        }).html(content);
        $('body').append($coin);
        $coin.addClass('speech-bubble').animate({ top: '-=' + trail, opacity: ['0', 'linear'] }, 1500, 'swing', function fn() {
            this.remove();
        });
    };
}(jQuery));
