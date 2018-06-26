//'use strict';

/*!
 * @name: main.js
 * @description: 主页js
 * @author: wuyuanping
 * @update: 2018-06-05
 */
//加载页面判断，没有登录直接跳转登录页
//"use strict";
//全部变量ajaxUrl: 异步请求接口
var ajaxUrl = 'http://113.18.253.50:8080/networkManagerback/gthl/api';
$(function () {

    //var req = {
    //    'cid': '1001'
    //};
    //var jsonData = JSON.stringify(req);
    //$.ajax({
    //    type: 'POST',
    //    contentType: 'application/json;charset:utf-8',
    //    url: swcjcamoP1 + '?jsoncallback=?',
    //    dataType: 'jsonp',
    //    jsonp: 'callback',
    //    data: { "data": jsonData },
    //    success: function success(data) {
    //        if (data.res == '-101') {
    //            //跳转登录页面
    //            location.href = 'login.html';
    //        } else {
    //            //加载图表显示页面
    //            $('#user').text(sessionStorage.userName);
    //            load('#content');
    //        }
    //    }
    //});
    if(sessionStorage.userName){
        $('#admin').text(sessionStorage.userName);
        sessionStorage.show = 'user-manage';
        load('#content');
        var bodyHeight = parseInt($('#main').css('height'));
        var headHeight = parseInt($('#header').css('height'));
        $('#content').css('height',(bodyHeight-headHeight)+'px');

    }else {
        location.href = 'login.html';
    }


});

//收放按钮
$('#header').on('click', '#menu-button', function () {
    var showId = sessionStorage.show;
    if ($('#aside').hasClass('col-sm-2')) {
        $('#aside').removeClass('col-sm-2').css('display', 'none');
        $('#main').removeClass('col-sm-10').addClass('col-sm-12');
        load('#'+showId);
    } else {
        $('#aside').addClass('col-sm-2').css('display', 'block');
        $('#main').removeClass('col-sm-12').addClass('col-sm-10');
        load('#'+showId);
    }
});

//admin
$('#manager').on('click', function (e) {
    $('#user-message').css('zIndex', 100).animate({
        opacity: 1,
        top: '50px'
    }, 500);
});
//点击其他任意地方隐藏div
$('body').bind('click', function (event) {
    // IE支持 event.srcElement ， FF支持 event.target
    var evt = event.srcElement ? event.srcElement : event.target;
    if (evt.id == 'user-message' || evt.id == 'admin' || evt.id == 'caret') {
        return evt;
    } // 如果是元素本身，则返回
    else {
            $('#user-message').css('zIndex', -1).css('opacity', 0).css('top', '20px'); // 如不是则隐藏元素
        }
});

//background: #ddd;color: #5FAEE2;

$('#user-message').on('mouseenter', 'div', function () {
    $(this).css('background', '#f5f5f5').css('color', '#5faee2');

});
$('#user-message').on('mouseleave', 'div', function () {
    $(this).css('background', '#fff').css('color', '#666');
});

//用户修改密码，注销;
$('#user-message').on('click', 'div', function () {
    var gid = $(this).attr('id');
    if (gid == 'to-change-system') {
        $('.bg-model').css('zIndex',1000).css('background','rgba(0,0,0,.7)');
        $('#button-container').css('zIndex',1001).css('opacity',1);
    } else if (gid == 'to-change-pwd') {
        sessionStorage.show = 'g63';
        //$('#content').load('all-optimized.html');
        load(this);
    } else if (gid == 'log-out') {
        if (confirm('是否注销？')) {
            var req = {
                'cid': '2002',
                'content': {
                    'username': sessionStorage.userName
                }
            };
            var jsonData = JSON.stringify(req);
            $.ajax({
                type: 'POST',
                contentType: 'application/json;charset=utf-8',
                url: 'http://113.18.253.50:8080/networkManagerback/gthl/api',
                xhrFields: {
                    withCredentials: true
                },
                data: jsonData,
                success: function success(data) {
                    console.log(data);
                    if (data.res == 0) {
                        sessionStorage.removeItem('userName');
                        location.href = 'login.html';
                    }
                }
            });
        }
    }
});





//侧边栏点击下拉
$('#menu>li:not([class="no-sub"])>a').on('click', function (e) {
    e.preventDefault();
    $(this).children('span').eq(1).toggleClass('right-arrow').toggleClass('down');
    var ue = $(this).next().children('li');
    var uHeight = ue.length * 40 + 'px';
    if ($(this).next().hasClass('show')) {
        $(this).next().removeClass('show').animate({
            height: 0
        });
    } else {
        $(this).next().addClass('show').animate({
            height: uHeight
        });
    }
});

$('#menu>li:not([class="no-sub"])').on('mouseenter', function () {
    //$(this).children('a').css('background', 'rgba(31,34,43,1)').css('color', '#5FAEE2');
    var $span = $(this).children('a').children('span').eq(0);
    var src = $span.attr('class');
    var url = 'url(img/images/' + src + '-1.png)';
    $span.css('backgroundImage', url);
});

$('#menu>li:not([class="no-sub"])').on('mouseleave', function () {
    //$(this).children('a').css('background', 'rgba(51,54,63,1)').css('color', ' #aaa');
    var $span = $(this).children('a').children('span').eq(0);
    var src = $span.attr('class');
    var url = 'url(img/images/' + src + '.png)';
    $span.css('backgroundImage', url);
});

//用户管理
$('#user-manage').on('click', function (e) {
    e.preventDefault();
    // sendAjax({'cid':'1001'});
    sessionStorage.show = 'user-manage';
    $("#menu").find(".active").removeClass("active");
    $(this).parent().addClass('active');
    load('#user-manage');
    //$('#aside').css('height', '1090px');
});

//宽带账号管理
$('#acct-manage').on('click', function (e) {
    e.preventDefault();
    // sendAjax({'cid':'1001'});
    sessionStorage.show = 'acct-manage';
    $("#menu").find(".active").removeClass("active");
    $(this).parent().addClass('active');
    load('#acct-manage');
    //$('#aside').css('height', '1090px');
});

//运行日志
$('#run-log').on('click', function (e) {
    e.preventDefault();
    // sendAjax({'cid':'1001'});
    sessionStorage.show = 'run-log';
    $("#menu").find(".active").removeClass("active");
    $(this).parent().addClass('active');
    load('#run-log');
    //$('#aside').css('height', '1090px');
});

//链路流量监控 g00: watch-link-flow.html
//$('#g00').click(function (e) {
//    e.preventDefault();
//    sessionStorage.show = 'g00';
//    $("#menu").find(".active").removeClass("active");
//    $(this).parent().addClass('active');
//    load(this);
//});
//
//$('#g10').click(function (e) {
//    e.preventDefault();
//    sessionStorage.show = 'g10';
//    $("#menu").find(".active").removeClass("active");
//    $(this).parent().addClass('active');
//    load(this);
//});

//侧边栏菜单项点击加载页面
//不同的id代表加载的内容
//g1:全国优化详情:
//g10:  all-opitimized.html全国优化示意图
//g11:  all-opitimized-compare.html全国优化前后对比
//g12:  route.html路由发布情况
//g13:  check-ip加速IP查询
//g2:游戏优化详情
//g20:  top10-game  TOP10游戏详情
//g21:  game-speed游戏加速详情
//g22:  game-link-flow游戏链路流量
//g23:  game-visitor游戏访问量
//g24:  game-flow-list游戏流量报表
//g25:  game-message游戏信息管理
//g3:游戏投诉管理
//g30:  complain-handle投诉处理
//g31:  complain-list投诉报表
//g4:设备管理

//g5:日志管理
//g50:  run-log运行日志
//g51:  game-log
//g6:系统管理
//g60:  organization-manage机构管理
//g61:  role-manage角色管理
//g62:  user-manage用户管理
//g63:  change-pwd修改密码

$('#menu ul').on('click', 'a', function (e) {
    e.preventDefault();
    var id = $(this).parent().parent().attr('id');
    var text = $(this).text();
    var lis = $('#' + id).children('li');
    var i = lis.index($(this).parent());
    $("#menu").find(".active").removeClass("active");
    $(this).parent().addClass('active');
    //保存不同选项所代表参数，用于optimized-detail.html页面的加载策略
    sessionStorage.show = id + i; //判断发送不同请求的参数
    sessionStorage.isTopVisit = 1;
    sessionStorage.isTopFlow = 1 ;
    sessionStorage.service = 'dx';
    if (id == 'g1') {
        sessionStorage.area = '各地区';
    }
    console.log(id + i);
    // $('#content').load('all-optimized.html');
    load(this);
});