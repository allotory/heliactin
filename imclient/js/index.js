
// 登录
$('#sname').on('click', function () {
    $('.login').toggleClass('open');
    $('.overlay').toggleClass('add');
});

// 默认页面
var GLOBALSTATE = {
    route: '.list-account'
};

// 设置页面
setRoute(GLOBALSTATE.route);
$('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');

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

// Set Name
// setName(localStorage.getItem('username'));

// Dyncolor ftw
// if (localStorage.getItem('color') !== null) {
//     var colorarray = JSON.parse(localStorage.getItem('color'));
//     stylechange(colorarray);
// } else {
//      var colorarray = [15, 157, 88]; // 15 157 88 = #0f9d58
//     localStorage.setItem('color', JSON.stringify(colorarray));
//     stylechange(colorarray);
// }

// // Helpers
// function setName(name) {
//     $.trim(name) === '' || $.trim(name) === null ? name = 'John Doe' : name = name;
//     $('h1').text(name);
//     localStorage.setItem('username', name);
//     $('#username').val(name).addClass('used');
//     $('.card.menu > .header > h3').text(name);
// }

// Stylechanger
// function stylechange(arr) {
//     // var x = 'rgba(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',1)';
//     var x = 'rgba(' + 0 + ',' + 153 + ',' + 255 + ',1)';
//     console.log('.dialog h3 {color: ' + x + '} .i-group input:focus ~ label,.i-group input.used ~ label {color: ' + x + ';} .bar:before,.bar:after {background:' + x + '} .i-group label {color: ' + x + ';} ul.nav > li.active {color:' + x + '} .style-tx {color: ' + x + ';}.style-bg {background:' + x + ';color: white;}@keyframes navgrow {100% {width: 100%;background-color: ' + x + ';}} ul.list li.context {background-color: ' + x + '}');
//     $('#dynamic-styles').text('.dialog h3 {color: ' + x + '} .i-group input:focus ~ label,.i-group input.used ~ label {color: ' + x + ';} .bar:before,.bar:after {background:' + x + '} .i-group label {color: ' + x + ';} ul.nav > li.active {color:' + x + '} .style-tx {color: ' + x + ';}.style-bg {background:' + x + ';color: white;}@keyframes navgrow {100% {width: 100%;background-color: ' + x + ';}} ul.list li.context {background-color: ' + x + '}');
// }

// 关闭 modal
function closeModal() {
    $('#new-user').val('');
    $('.overlay').removeClass('add');
    $('.floater').removeClass('active');
    $('#contact-modal').fadeOut();

    $('#contact-modal').off('click', '.btn.save');

}

// 设置 modal
function setModal(mode, $ctx) {
    var $mod = $('#contact-modal');
    switch (mode) {
        case 'add':
            $mod.find('h3').text('Add Contact');
            break;

        case 'edit':
            $mod.find('h3').text('Edit Contact');
            $mod.find('#new-user').val($ctx.text()).addClass('used');
            break;
    }

    $mod.fadeIn();
    $('.overlay').addClass('add');
    $mod.find('#new-user').focus();
}

// 后退按钮
$('.mdi-arrow-left').on('click', function () {
    $('.shown').removeClass('shown');
    setRoute('.list-text');
});

// 设置显示页面
function setRoute(route) {
    GLOBALSTATE.route = route;
    $(route).addClass('shown');

    if (route !== '.list-account') {
        $('#add-contact-floater').addClass('hidden');
    } else {
        $('#add-contact-floater').removeClass('hidden');
    }

    if (route !== '.list-text') {
        $('#chat-floater').addClass('hidden');
    } else {
        $('#chat-floater').removeClass('hidden');
    }

    if (route === '.list-chat') {
        $('.mdi-menu').hide();
        $('.mdi-arrow-left').show();
        $('#content').addClass('chat');
    } else {
        $('#content').removeClass('chat');
        $('.mdi-menu').show();
        $('.mdi-arrow-left').hide();
    }
}

// 设置输入框离开效果
$('#username').on('blur', function () {
    // setName($(this).val());

    $('.card.menu > .header > img').addClass('excite');
    setTimeout(function () {
        $('.card.menu > .header > img').removeClass('excite');
    }, 800);

});

// 发送消息
// $('.mdi-send').on('click', function () {
//     var $chatmessage = '<p>' + $('.chat-input').val() + '</p>';
//     $('ul.chat > li > .current').append($chatmessage);
//     $('.chat-input').val('');
// });

// $('.chat-input').on('keyup', function (event) {
//     event.preventDefault();
//     if (event.which === 13) {
//         $('.mdi-send').trigger('click');
//     }
// });


// 聊天界面
$('.list-text > ul > li').on('click', function () {
    $('ul.chat > li').eq(1).html('<img src="'
        + $(this).find('img').prop('src') + '"><div class="message"><p>'
        + $(this).find('.txt').text() + '</p></div>');

    // timeout just for eyecandy...
    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
    }, 300);
});

$('.list-account > ul > li').on('click', function () {
    $('ul.chat > li').eq(1).html('<img src="'
        + $(this).find('img').prop('src') + '"><div class="message"><p>'
        + $(this).find('.txt').text() + '</p></div>');

    // timeout just for eyecandy...
    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
    }, 300);
});

// 列表编辑
$('.list-account > .list').on('click', 'i', function () {
    // $(this).parent().children().removeClass('active');
    // $(this).parent().find('.context').remove();

    // $(this).addClass('active');

    if ($(this).parent().parent().children().hasClass('active')) {
        $(this).parent().parent().children().removeClass('active');
        $(this).parent().parent().find('.context').remove();
    } else {

        $(this).parent().addClass('active');

        var $TARGET = $(this).parent();
        if (!$(this).parent().next().hasClass('context')) {
            var $ctx = $('<li class="context"><i class="mdi mdi-pencil"></i><i class="mdi mdi-delete"></i></li>');

            $ctx.on('click', '.mdi-pencil', function () {
                setModal('edit', $TARGET);

                $('#contact-modal').one('click', '.btn.save', function () {
                    $TARGET.find('.name').text($('#new-user').val());
                    closeModal();
                });
            });

            $ctx.on('click', '.mdi-delete', function () {
                $TARGET.remove();
            });


            $(this).parent().after($ctx);
        }
    }

});

// 设置导航页面
$('.nav li').on('click', function () {
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');
    $('.shown').removeClass('shown');
    var route = $(this).data('route');
    $(route).addClass('shown');
    setRoute(route);
});


// 全屏按钮
$('#head').on('click', '.mdi-fullscreen', function () {
    $(this).removeClass('mdi-fullscreen').addClass('mdi-fullscreen-exit');
    $('#hangout').css({
        width: '900px'
    });
});

$('#head').on('click', '.mdi-fullscreen-exit', function () {
    $(this).removeClass('mdi-fullscreen-exit').addClass('mdi-fullscreen');
    $('#hangout').css({
        width: '400px'
    });
});

// 个人信息页面
$('#head .mdi-menu').on('click', function () {
    $('.info').toggleClass('open');
    $('.overlay').toggleClass('add');
});

// 向下折叠
$('#head .mdi-chevron-down').on('click', function () {
    if ($('#hangout').hasClass('collapsed')) {
        $(this).removeClass('mdi-chevron-up').addClass('mdi-chevron-down');
        $('#hangout').removeClass('collapsed');
    } else {
        $(this).removeClass('mdi-chevron-down').addClass('mdi-chevron-up');
        $('#hangout').addClass('collapsed');
    }

});

// 搜索
$('.search-filter').on('keyup', function () {
    var filter = $(this).val();
    $(GLOBALSTATE.route + ' .list > li').filter(function () {
        var regex = new RegExp(filter, 'ig');

        if (regex.test($(this).text())) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

// modal 取消按钮
$('#contact-modal').on('click', '.btn.cancel', function () {
    closeModal();
});

// 添加按钮
$('#new-user').on('keydown', function (event) {
    switch (event.which) {
        case 13:
            event.preventDefault();
            $('.btn.save').trigger('click');
            break;

        case 27:
            event.preventDefault();
            $('.btn.cancel').trigger('click');
            break;
    }

});

// 添加用户
$('#add-contact-floater').on('click', function () {
    if ($(this).hasClass('active')) {
        closeModal();
        $(this).removeClass('active');

    } else {

        $(this).addClass('active');
        setModal('add');
        $('#contact-modal').one('click', '.btn.save', function () {
            $('.list-account > .list').prepend(
                '<li><img src="http://lorempixel.com/100/100/people/1/"><span class="name">'
                + $('#new-user').val() + '</span><i class="mdi mdi-menu-down"></i></li>');
            closeModal();
        });
    }
});