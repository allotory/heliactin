'user strict'

// 默认主页页面
let GLOBALSTATE = {
    route: '.list-login'
};

// 设置页面
setRoute(GLOBALSTATE.route);
initLogin();
$('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');

// 显示登录界面
function initLogin() {
    $('.mdi-menu').hide();
    $('.nav').hide();
    $('.title').text('IM');
}

// 注册新用户
$('#signUp').on('click', function() {
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    if (username === '') {
        alert('用户名不能为空');
        return false;
    } else if (username.length < 6 || username.length > 15) {
        alert('用户名长度应在 6 ~ 15 个字符之间');
        return false;
    } else if (password === '' || confirmPassword === '') {
        alert('密码和确认密码不能为空');
        return false;
    } else if (password.length < 6) {
        alert('密码长度应大于6个字符');
        return false;
    } else if (password !== confirmPassword) {
        alert('密码和确认密码应一致');
        return false;
    }

    $.ajax({
        url: '/signup',
        type: 'POST',
        async: true,
        data: {
            username: username,
            password: password
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            if (data === 'success') {
                alert('注册成功，请重新登录')
            } else if (data === 'failure') {
                alert('注册失败，请稍后重试');
            } else {
                alert('系统错误，请稍后重试');
            }

            $('#loginLink').trigger('click');
        },
        error: function (xhr, textStatus) {
            console.log('注册失败，请稍后重试');
            console.log(xhr);
            console.log(textStatus);
        }
    })
});


//
// let socket = io.connect('localhost:3000'); //连接服务器
// socket.on('welcome', function (data) { //监听事件，获取服务器发送的消息
//     console.log(data.text); //输出消息
// });


$('#signIn').on('click', function () {

    let username = $('#username').val();
    let password = $('#password').val();

    if (username === '') {
        alert('用户名不能为空');
        return false;
    } else if (password === '') {
        alert('密码不能为空');
        return false;
    }

    $.ajax({
        url: '/signin',
        type: 'POST',
        async: true,
        data: {
            username: username,
            password: password
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);

            if (data === 'failure') {
                alert('登录失败，请稍后重试');
            }

            // 登录成功
            let obj = JSON.parse(data);
            console.log(obj);

            // 显示首页界面
            GLOBALSTATE.route = '.list-account';
            setRoute(GLOBALSTATE.route);
            $('.nav').show();
            $('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');
            $('.list-login').css('display', 'none');

            // 显示好友列表
            let fhtml = '';
            for (let f in obj.friends) {
                fhtml += '<li onclick="listAccountChat()" id="friend-' + obj.friends[f].id + '">' +
                    '<img src="../static/css/images/avatar.jpg">' +
                        '<div class="content-container">' +
                        '<span class="name">'+ obj.friends[f].nickname + '</span>' +
                        '<span class="txt">' + obj.friends[f].autograph + '</span>' +
                    '</div>' +
                    '<i class="mdi mdi-menu-down"></i>' +
                '</li>';
            }
            $('#friendsList').html(fhtml);

            // 显示全部以参加的组
            let ghtml = '';
            for (let g in obj.groups) {
                ghtml += '<li id="group-' + obj.groups[g].id + '">' +
                    '<img src="../static/css/images/avatar.jpg">' +
                    '<div class="content-container">' +
                        '<span class="name">' + obj.groups[g].groupname + '</span>' +
                        '<span class="txt">' + obj.groups[g].gautograph + '</span>' +
                    '</div>' +
                    '<span class="time">14:00</span>' +
                '</li>';
            }
            $('#groupList').html(ghtml);

        },
        error: function (xhr, textStatus) {
            console.log('登录失败，请稍后重试');
            console.log(xhr);
            console.log(textStatus);
        }
    })

    // //在服务器接收消息之后，以回调函数返回数据给客户端告诉昵称是否存在
    // socket.emit('name', username, function (data) {
    //     if (data) { //昵称不存在列表中，昵称添加成功
    //         console.log('successfully'); //设置昵称成功
    //
    //         GLOBALSTATE.route = '.list-account';
    //         setRoute(GLOBALSTATE.route);
    //         $('.nav').show();
    //         $('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');
    //         $('.list-login').css('display', 'none');
    //     }
    //     else { //昵称存在于列表
    //         alert('昵称已存在');
    //     }
    // });
});

//接收服务器广播的昵称列表，并显示在页面上
// socket.on('usernames', function (data) {
//     let html = '';
//
//     for (var i = 0; i < data.length; i++) {
//         html += '<li onclick="listAccountChat()">' +
//             '<img src="../static/css/images/avatar.jpg">' +
//                 '<div class="content-container">' +
//                 '<span class="name">'+ data[i] + '</span>' +
//                 '<span class="txt">i get the style search-filtstyle se-faaail</span>' +
//             '</div>' +
//             '<i class="mdi mdi-menu-down"></i>' +
//         '</li>';
//     }
//     $('#friendsList').html(html);
// });

// 好友列表 => 聊天页面
function listAccountChat() {
    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
        GLOBALSTATE.route = '.list-account';

        let msg = $('#chatting');
        msg.scrollTop(msg[0].scrollHeight);

    }, 300);
}

// 发送消息
$('.mdi-send').on('click', function () {
    if ($('.chat-input').val() === '') {
        alert('message required');
    }

    socket.emit('message', $('.chat-input').val());

    let now = new Date();
    let amPm = now.getHours() > 12? 'PM': 'AM';
    let message =
        '<li class="i">' +
            '<div class="head">' +
            '<span class="time">' + now.getHours() + ':' + now.getMinutes() + ' ' + amPm + ', Today </span>' +
        '<span class="name">me</span>' +
            '</div>' +
            '<div class="message">' + $('.chat-input').val() + '</div>' +
        '</li>';

    $('#chatting').append(message);
    $('.chat-input').val('');

    let msg = $('#chatting');
    msg.scrollTop(msg[0].scrollHeight);
});

// 回车发送
$('.chat-input').on('keyup', function (event) {
    event.preventDefault();
    if (event.which === 13) {
        $('.mdi-send').trigger('click');
    }
});

// socket.on('clientReceiveMessage', function(data) {
//     let now = new Date();
//     let amPm = now.getHours() > 12? 'PM': 'AM';
//     let message =
//         '<li class="friend">' +
//         '<div class="head">' +
//         '<span class="name">' + data.sender + ' </span>' +
//         '<span class="time">' + now.getHours() + ':' + now.getMinutes() + ' ' + amPm + ', Today </span>' +
//         '</div>' +
//         '<div class="message">' + data.message + '</div>' +
//         '</li>';
//
//     $('#chatting').append(message);
//     let msg = $('#chatting');
//     msg.scrollTop(msg[0].scrollHeight);
// });


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

// 登录 => 注册
$('#registerLink').on('click', function() {
    $('#confirmPassGroup').css('display', 'block');
    $('#registerLink').css('display', 'none');
    $('#loginLink').css('display', 'inline-block');
    $('.reset').css('margin-top', '163px');
    $('#signIn').css('display', 'none');
    $('#signUp').css('display', 'block')
});

// 注册 => 登录
$('#loginLink').on('click', function() {
    $('#confirmPassGroup').css('display', 'none');
    $('#registerLink').css('display', 'inline-block');
    $('#loginLink').css('display', 'none');
    $('.reset').css('margin-top', '250px');
    $('#signIn').css('display', 'block');
    $('#signUp').css('display', 'none')
    $('#username').val('');
    $('#password').val('');
});

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
    setRoute(GLOBALSTATE.route);
});

// 设置显示页面
function setRoute(route) {
    GLOBALSTATE.route = route;
    $(route).addClass('shown');

    // 添加用户按钮
    if (route !== '.list-account') {
        $('#add-contact-floater').addClass('hidden');
    } else {
        $('#add-contact-floater').removeClass('hidden');
    }

    // 消息按钮
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
        // $('.mdi-arrow-right').hide();
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



// 聊天界面
$('.list-text > ul > li').on('click', function () {
    // $('ul.chat > li').eq(1).html('<img src="'
    //     + $(this).find('img').prop('src') + '"><div class="message"><p>'
    //     + $(this).find('.txt').text() + '</p></div>');

    // timeout just for eyecandy...
    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
        GLOBALSTATE.route = '.list-text';
    }, 300);
});

$('.list-account > ul > li').on('click', function () {
    // $('ul.chat > li').eq(1).html('<img src="'
    //     + $(this).find('img').prop('src') + '"><div class="message"><p>'
    //     + $(this).find('.txt').text() + '</p></div>');

    // timeout just for eyecandy...
    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
        GLOBALSTATE.route = '.list-account';
    }, 300);
});


// 列表编辑
$('.list-account > .list ').on('click', 'i', function (event) {
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

    event.stopPropagation();
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