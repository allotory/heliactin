/**
 * animation
 * Created by Ellery on 2017/4/3.
 */

// 遮罩层波纹效果
$('.floater').on('click', function (event) {
    var $ripple = $('<div class="ripple tiny bright"></div>');
    var x = event.offsetX;
    var y = event.offsetY;
    var $me = $(this);

    $ripple.css({
        top: y,
        left: x
    });
    $(this).append($ripple);

    setTimeout(function () {
        $me.find('.ripple').remove();
    }, 530)

});

// 页面点击波纹效果
$('ul.mat-ripple').on('click', 'li', function (event) {
    if ($(this).parent().hasClass('tiny')) {
        var $ripple = $('<div class="ripple tiny"></div>');
    } else {
        var $ripple = $('<div class="ripple"></div>');
    }
    var x = event.offsetX;
    var y = event.offsetY;

    var $me = $(this);

    $ripple.css({
        top: y,
        left: x
    });

    $(this).append($ripple);

    setTimeout(function () {
        $me.find('.ripple').remove();
    }, 530)
});