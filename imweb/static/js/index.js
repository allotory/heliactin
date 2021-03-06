'user strict';

// 全局变量
let GLOBALSTATE = {
    // 默认导航页面
    route: '.list-login',
    // 当前群组 ID
    globalGroup: 0,
    // 是否为私聊
    privateChat: false,
    // 私聊对象
    privateChatFrom: 0,
    privateChatTo: 0,
    // 全局数据
    globalData: null
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
        success: function (data) {
            console.log('[IM] Signup success info: ' + data);
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
            console.log('[IM] Signup error info: 注册失败，请稍后重试');
            console.log(xhr);
            console.log(textStatus);
        }
    });
});



let socket = null;
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
        success: function (data) {
            if (data === 'failure') {
                alert('登录失败，请稍后重试');
            }

            console.log('[IM] Global json data:' + data);

            // 登录成功
            let obj = JSON.parse(data);
            console.log('[IM] Global object data:' + obj);

            // 设置全局数据
            GLOBALSTATE.globalData = obj;

            // 显示首页界面
            GLOBALSTATE.route = '.list-account';
            setRoute(GLOBALSTATE.route);
            $('.nav').show();
            $('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');
            $('.list-login').css('display', 'none');

            // 个人信息
            $('#nickname').val(obj.user.nickname);
            $('#userAvatar').attr('src', obj.user.avatar);

            // 显示好友列表
            let fhtml = '';
            for (let f in obj.friends) {
                fhtml += '<li onclick="listFriendsChat(' + obj.user.id + ', ' + obj.friends[f].id + ')" id="friend_' + obj.friends[f].id + '">' +
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
                ghtml += '<li onclick="listGroupsChat(this.id, ' + obj.user.id + ')" id="group_' + obj.groups[g].id + '">' +
                    '<img src="../static/css/images/avatar.jpg">' +
                    '<div class="content-container">' +
                        '<span class="name">' + obj.groups[g].groupname + '</span>' +
                        '<span class="txt">' + obj.groups[g].gautograph + '</span>' +
                    '</div>' +
                    '<span class="time">14:00</span>' +
                '</li>';
            }
            $('#groupList').html(ghtml);

            // 连接服务器
            socket = io.connect('localhost:3000');
            socket.emit('online', obj.user.id, function (info) {
                if (info) {
                    console.log('[IM] ConnectSocket info: 登录连接服务器成功~');
                }
            });

        },
        error: function (xhr, textStatus) {
            console.log('[IM] ConnectSocket info: 登录失败，请稍后重试');
            console.log(xhr);
            console.log(textStatus);
        }
    })

});

// 好友列表 => 聊天页面
function listFriendsChat(from, to) {

    // 设置当前为私聊
    GLOBALSTATE.privateChat = true;
    GLOBALSTATE.privateChatFrom = from;
    GLOBALSTATE.privateChatTo = to;

    setTimeout(function () {
        $('.shown').removeClass('shown');

        $('.list-chat').addClass('shown');
        setRoute('.list-chat');
        $('.chat-input').focus();
        GLOBALSTATE.route = '.list-account';

        let msg = $('#chatting');
        msg.scrollTop(msg[0].scrollHeight);

    }, 300);

    // 监听私聊消息
    socket.on('receivePrivateMsg', function (fromUser, pmsg) {

        let fromFriend = GLOBALSTATE.globalData.friends;
        let fromUserInfo;
        for (let f in fromFriend) {
            if (fromFriend[f].id === fromUser) {
                fromUserInfo = fromFriend[f];
            }
        }

        let now = new Date();
        let amPm = now.getHours() > 12? 'PM': 'AM';
        let message =
            '<li class="friend">' +
            '<div class="head">' +
            '<span class="name">' + fromUserInfo.nickname + ' </span>' +
            '<span class="time">' + now.getHours() + ':' + now.getMinutes() + ' ' + amPm + ', Today </span>' +
            '</div>' +
            '<div class="message">' + pmsg + '</div>' +
            '</li>';

        $('#chatting').append(message);
        let msg = $('#chatting');
        msg.scrollTop(msg[0].scrollHeight);
    });
}

// 群组列表 => 聊天页面
function listGroupsChat(group_id, user_id, data) {

    // 设置全局群组 id
    GLOBALSTATE.globalGroup = group_id;
    // 设置当前为群聊
    GLOBALSTATE.privateChat = false;

    // 在服务器接收消息之后，以回调函数返回数据给客户端
    // 将加入的群组 id 发送到后台
    socket.emit('chatGroupId', group_id, function (data) {
        if (data) {
            setTimeout(function () {
                $('.shown').removeClass('shown');

                $('.list-chat').addClass('shown');
                setRoute('.list-chat');
                $('.chat-input').focus();
                GLOBALSTATE.route = '.list-text';

                let msg = $('#chatting');
                msg.scrollTop(msg[0].scrollHeight);

            }, 300);
        } else {
            alert('进入群组失败，请稍后重试...');
        }
    });

    socket.emit('joinGroup', user_id, function (data) {
        if (data) {
            console.log('[IM] Socket info: 登成功加入群组，可以开始聊天了~');
        }
    });

    // 监听系统消息
    socket.on('sys', function (sysMsg, users) {
        let now = new Date();
        let amPm = now.getHours() > 12? 'PM': 'AM';
        let message =
            '<li class="system">' +
            '<div class="head">' +
            '<span class="name">System </span>' +
            '<span class="time">' + now.getHours() + ':' + now.getMinutes() + ' ' + amPm + ', Today </span>' +
            '</div>' +
            '<div class="message">用户 ' + users + ' 进入当前群组~</div>' +
            '</li>';

        $('#chatting').append(message);
        let msg = $('#chatting');
        msg.scrollTop(msg[0].scrollHeight);
    });

    // 监听群组消息
    socket.on('msg', function (userId, msgs) {

        $.ajax({
            url: '/senderInfo',
            type: 'POST',
            async: true,
            data: {
                userId: userId
            },
            success: function (data) {
                let userName = JSON.parse(data).nickname;

                let now = new Date();
                let amPm = now.getHours() > 12? 'PM': 'AM';
                let message =
                    '<li class="friend">' +
                    '<div class="head">' +
                    '<span class="name">' + userName + ' </span>' +
                    '<span class="time">' + now.getHours() + ':' + now.getMinutes() + ' ' + amPm + ', Today </span>' +
                    '</div>' +
                    '<div class="message">' + msgs + '</div>' +
                    '</li>';

                $('#chatting').append(message);
                let msg = $('#chatting');
                msg.scrollTop(msg[0].scrollHeight);
            },
            error: function (xhr, textStatus) {
                console.log('[IM] Socket info: 查询群用户失败，请稍后重试');
                console.log(xhr);
                console.log(textStatus);
            }
        });

    });
}

// 发送消息
$('.mdi-send').on('click', function () {
    if ($('.chat-input').val() === '') {
        alert('消息不能为空');
    }

    if (GLOBALSTATE.privateChat) {
        // 私聊
        socket.emit("privateMessage", GLOBALSTATE.privateChatFrom, GLOBALSTATE.privateChatTo, $('.chat-input').val());
    } else {
        // 群聊
        socket.emit('message', $('.chat-input').val());
    }

    let now = new Date();
    let amPm = now.getHours() > 12 ? 'PM' : 'AM';
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

// 后退按钮
$('.mdi-arrow-left').on('click', function () {
    if (GLOBALSTATE.privateChat) {
        // 退出私聊
        GLOBALSTATE.privateChat = false;
        socket.emit('leavePrivateChat', GLOBALSTATE.privateChatFrom, GLOBALSTATE.privateChatTo);
        $('#chatting').empty();
        $('.shown').removeClass('shown');
        setRoute(GLOBALSTATE.route);
    } else {
        // 退出群聊
        socket.emit('leaveGroup', GLOBALSTATE.globalGroup);
        $('#chatting').empty();
        $('.shown').removeClass('shown');
        setRoute(GLOBALSTATE.route);
    }
});

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

        let $TARGET = $(this).parent();
        if (!$(this).parent().next().hasClass('context')) {
            let $ctx = $('<li class="context"><i class="mdi mdi-pencil"></i><i class="mdi mdi-delete"></i></li>');

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
    let route = $(this).data('route');
    $(route).addClass('shown');
    setRoute(route);
    GLOBALSTATE.route = route;
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
    let filter = $(this).val();
    $(GLOBALSTATE.route + ' .list > li').filter(function () {
        let regex = new RegExp(filter, 'ig');

        if (regex.test($(this).text())) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$('input').blur(function () {
    if ($(this).val() !== '') {
        $(this).addClass('used');
    }
});

// 设置 modal
function setModal(mode, $ctx) {
    let $mod = $('#contact-modal');
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
                '<li><img src=""><span class="name">'
                + $('#new-user').val() + '</span><i class="mdi mdi-menu-down"></i></li>');
            closeModal();
        });
    }
});