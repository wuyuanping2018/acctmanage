//'use strict';

/*!
 * @name: optimezed-detail.js
 * @description: 全国优化详情页面js
 * @author: wuyuanping
 * @update: 2017-07-27
 */
//调用其他js
//document.write("<script language=javascript src='js/show-detail.js'></script>");

//"use strict";
function sendAjaxTOService(url,data) {
    var jData = JSON.stringify(req);
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset:utf-8',
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback',
        data: { "data": data },
        success: function success(data) {
            res.loadFoo(data, myChart);
            //   console.log(data);
        }
    });
}
var ajaxUrl = 'http://113.18.253.50:8080/networkManagerback/gthl/api';
//异步请求函数封装(有图形生成)
function sendAjax(req, res) {
    var jsonData = JSON.stringify(req);
    console.log(jsonData);
    var myChart = echarts.init(document.getElementById(res.id));
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        url: ajaxUrl,
        xhrFields: {
            withCredentials: true
        },
        data: jsonData,
        beforeSend: function beforeSend() {
            myChart.showLoading({
                text: '数据加载中...', //loading话术
                effect: 'bubble' //'spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
            });
            $('.show-loading').css('display', 'block').prev().css('display', 'block');
        },
        success: function success(data) {
            myChart.hideLoading();
            $('.show-loading').css('display', 'none').prev().css('display', 'none');
            res.loadFoo(data, myChart);
            //   console.log(data);
        }
    });
}
//异步请求函数封装(纯数据)
function noPicAjax(req, loadFoo) {
    var jsonData = JSON.stringify(req);
    console.log(jsonData);
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        url: ajaxUrl,
        xhrFields: {
            withCredentials: true
        },
        data: jsonData,
        beforeSend: function beforeSend() {
            $('.show-loading').css('display', 'block').prev().css('display', 'block');
        },
        success: function success(data) {
            console.log(data);
            $('.show-loading').css('display', 'none').prev().css('display', 'none');
            if(data.res==0){
                loadFoo(data);
            }else if(data.res==2){
                location.href = 'login.html'
            }

        },
        complete: function() {
            $('.show-loading').css('display', 'none').prev().css('display', 'none');
        }
    });
}

$(function(){
   $('html,body').animate({
       scrollTop: '0px'
   },400);
});





//各查询按钮
//链路流量监控
$('#g00-config').click(function() {
    console.log('ok');
    var startDate = $('#start-date').val().split('-').join('');
    var endDate = $('#end-date').val().split('-').join('');

        sendAjax({
            'cid': '1028',
            'content': {
                'starttime': startDate,
                'endtime': endDate,
                'nowpage': 1
            }
        }, {loadFoo: function(data,myChart) {
            console.log(data);
            showg00Check(data,myChart);
        },id: 'show-pic'});

    });


//全国优化前后对比
$('#g11-config').click(function() {
    var $date = $('.data-select select[name="recent-date"]').val();
    var $corporation = $('.data-select select[name="corporation"]').val();
    sessionStorage.service = $corporation;
    sendAjax({
        'cid': '1006',
        'content': {
            'date': $date,
            'corporation': $corporation
        }
    }, { loadFoo: showg11, id: 'show-pic' });
});
//路由发布查询
$('#route-config').click(function() {
    //模糊搜索IP
    var searchIP = $('#checkIP').val();
    console.log(searchIP);
    noPicAjax({
        'cid': '1024',
        'content': {
            'ip': searchIP,
            'nowpage': 1
        }
    }, showg12);
});


//游戏加速详情查询
$('#g20-config').click(function() {
    var $gameName = $('#for-search-game').val();
    ($gameName=="--请选择--")&&($gameName='');
    var $date = $('#game-detail-date').val().split('-').join('');
    var $corporation = $('#game-detail-corporation').val();
    $('.show-data').css('height','1390px');
    sessionStorage.service = $corporation;
    noPicAjax({
        'cid': '1015',
        'content': {
            'date': $date,
            'gamename': $gameName,
            'corporation': $corporation
        }
    }, showg20);
});
//游戏连接数查询
$('#g21-check-out').on('click','button',function() {
    var config = $(this).attr('id');
    var start = $('#start-date').val();
    var end = $('#end-date').val();
    if(config=='g21-config') {
        sendAjax(
            {
                'cid': '1011',
                'content': {
                    'startdate': start.split('-').join(''),
                    'enddate': end.split('-').join('')
                }
            },
            {loadFoo: function(data,myChart){
                //console.log(data);
                showg21(data,myChart);
                $('#start-date').val(start);
                $('#end-date').val(end);

            },id: 'show-pic'}

        );
    }else if(config=='g21-top-config') {
        sendAjax(
            {
                'cid': '1022',
                'content': {
                    'nowpage': '1',
                    'pagesize': 20,
                    'begintime': start.split('-').join(''),
                    'endtime': end.split('-').join('')
                }
            },
            {loadFoo: function(data,myChart){
                //console.log(data);
                showg21top(data,myChart);
                $('#start-date').val(start);
                $('#end-date').val(end);

            }, id: 'show-pic'}
        );
    }

});

//游戏信息管理查询
$('#g23-config').click(function() {
    var gameName = $('#for-search-game').val();
    var ip = $('#game-ip').val();
    $(this).attr('btn-clicked','clicked');
    noPicAjax({
        'cid': '1016',
        'content': {
            'gameid': '',
            'name': '',
            'nowpage': 1,
            'gamename': gameName,
            'ip': ip
        }
    }, showg23);
});


//导出数据
//导出数据请求接口
var aUrl = 'http://117.169.35.142:8081';

function print(url) {
    window.open(aUrl+url);
}
    //优化对比
$('#g11-print').click(function() {
    //var url = '/Ajax/exportProvinceList.ashx?sys=game';
    //print(url);
    $('#img-url').val(imgURL);
    //传长数据用表单submit
    $("#img-form").submit();
});
    //游戏连接数（名称）
$('#g21-print').click(function() {
    var gameUserTime = '/Ajax/ExportExcel.ashx?action=GamesUserTime';
    var gameUser = '/Ajax/ExportExcel.ashx?action=GamesUser';
    if($(this).attr('data-show')=='g21'){
        print(gameUserTime);
    }else if($(this).attr('data-show')=='g21-top'){
        print(gameUser);
    }


});
    //游戏流量报表
$('#g22-print').click(function() {
    var groupipinfo = '/Ajax/ExportExcel.ashx?action=GroupInfo';
    print(groupipinfo);
});
    //链路流量
$('#g00-print').click(function() {
    var url = '/Ajax/GstraDeal.ashx?action=dowload';
    print(url);
});
    //游戏加速详情
$('#g20-print').click(function() {
    var url = '/Ajax/ExportExcel.ashx?action=PingList';
    print(url);
});
    //游戏信息管理
$('#game-message-print').click(function() {
    var url = '/Ajax/exportGameList.ashx';
    print(url);
});

    //投诉列表
$('#complain-handle-print').click(function() {
    var url = '/Ajax/exportComplain.ashx';
    print(url);
});



//#config按钮
$('.data-select').on('click', '#config', function () {
    // var dateStr = $('.data-select input[type="date"]').val().split('-').join('');// 格式：20170802
    // console.log(startDate,endDate);
    //console.log(dateStr);
    //全国优化示意查询
    if (sessionStorage.show == 'g10') {

    }
    //优化对比查询
    else if (sessionStorage.show == 'g11') {


    }
        //路由发布情况
    else if (sessionStorage.show == 'g12') {

    }
        //加速IP查询
    else if (sessionStorage.show == 'g13') {

    }
        //游戏加速详情
    else if (sessionStorage.show == 'g20') {

    }
        //游戏连接数
    else if(sessionStorage.show=='g21'){

    }
        //游戏链路流量(改为链路流量监控)
    else if (sessionStorage.show == 'g00') {

    }
    //游戏流量报表
    else if (sessionStorage.show == 'g22') {
        //var gameName = $('#check-out input[name="game-name"]').val();
        //var startDate = $('#check-out input[name="start-date"]').val().split('-').join('');
        //var endDate = $('#check-out input[name="end-date"]').val().split('-').join('');

    }
    //游戏信息管理
    else if (sessionStorage.show == 'g23') {
        //var $gameName = $('#check-out input[name="game-name"]').val();
        //var $gameIp = $('#check-out input[name="game-ip"]').val();
        //console.log($gameIp, $gameName);
    }
});

//加载访问用户(在线用户)统计函数: 在g21点击在线用户时加载
function loadVisitor(gid) {
    loadModel(970, 40);
    $('.data-model .data-pic').css('display', 'none');
    $('.data-model .list-detail').css('height', '840px');
    //生成表格表头
    $('#model-thead').html(
        '<tr><th rowspan="2">\u5E8F\u53F7</th>' +
        '<th rowspan="2">\u7528\u6237\u5730\u5740</th>' +
        '<th rowspan="2">\u8FDE\u63A5\u65B9\u5F0F</th>' +
        '<th colspan="3" style="border-bottom:none">\u6D41\u91CF(Byte)</th>' +
        '</tr><tr>' +
        '<th>\u4E0A\u884C\u6D41\u91CF</th>' +
        '<th>\u4E0B\u884C\u6D41\u91CF</th>' +
        '<th>\u603B\u6D41\u91CF</th>' +
        '</tr>');

    //console.log(gid);
    var jsonData = JSON.stringify({
        'cid': '1018',
        'content': {
            'appid': gid
        }
    });
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset:utf-8',
        url: ajaxUrl + '?jsoncallback=?',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 30000,
        data: { "data": jsonData },
        beforeSend: function beforeSend() {
            $('.show-loading').css('display', 'block').prev().css('display', 'block');
        },
        success: function success(data) {
            $('.show-loading').css('display', 'none').prev().css('display', 'none');
            showg21topDetail(data);
        }
    });
}

//模态弹出页面样式
function loadModel(height, top) {
    var modelHeight = parseInt($('.optimized-detail').css('height'));
    var bodyHeight = parseInt($('#main').css('height'));
    var headHeight = parseInt($('#header').css('height'));
    if(modelHeight < (bodyHeight-headHeight)) {
        modelHeight = bodyHeight-headHeight;
    }
    $('.optimized-detail>div.model').css('zIndex', 10).css('height',modelHeight+'px').css('backgroundColor', 'rgba(10,15,20,.7)');
    $('.show-area-optimized').css('height', height + 'px').css('zIndex', 100).animate({
        opacity: 1,
        top: top + 'px'
    }, 500);
}
//详情点击模态弹出(表格中a标记点击事件)
$('#tb').on('click', 'a', function (e) {
    e.preventDefault();
    //用户列表绑定宽带详情
    if (sessionStorage.show == 'user-manage') {
            var top = $('#content').scrollTop();
            //console.log(top+'scroll');
            top >= 400 && (top = 400);
            loadModel(310, 25+top);
            //$('.data-model .list-detail').css('height', '200px');
            //参数
            var localuserid = $(this).attr('href');
            //var date = $('#game-detail-date').val().split('-').join('');
            //if (date == '') {
            //    date = transDate().start;
            //}
            noPicAjax({
                'cid': '2013',
                'content': {
                    'localuserid': localuserid
                }
            }, showUserDetail);
        }
        //top10游戏访问量（在线用户：访问量）
    else if (sessionStorage.show == 'g21') {
        var gid = $(this).attr('href');
        var appName = $(this).attr('title');
        $('.data-model .data-list .title').html('数据列表(' + appName + ')');
        loadVisitor(gid);
    }
        //游戏流量报表
    else if (sessionStorage.show == 'g22') {
        if ($(this).attr('id') == 'flow-trend') {
            loadModel(970, 40);
            var gameName = $(this).attr('title');
            $('.model-pic').css('height', '420px').html('<div id="show-up"></div>');
            $('.data-model .data-pic').css('display', 'block');
            $('.data-model .data-pic .title').html(gameName).css('background', '#2d5f84').css('color', '#fff');
            $('.data-model .data-list .title').css('display', 'none');
            $('.data-model .list-detail').css('height', '420px').css('padding', 0).html('<div id="show-down"></div>');
            $('#show-up').css('height', '100%');
            $('#show-down').css('height', '100%');
            var gameId = $(this).attr('href');
            //console.log(gameId);
            //请求参数cid:
            noPicAjax({
                'cid': '1021',
                'content': {
                    'gameid': gameId
                }
            }, showg22Detail);
        } else if ($(this).attr('id') == 'visitor') {
            loadModel(970, 25);
            var vid = $(this).attr('href');
            var vName = $(this).attr('title');
            $('.data-model .data-pic').css('display', 'none');
            $('.data-model .list-detail').css('height', '840px').html(
                '<div class="show-loading-model"></div>' +
                '<div class="show-loading">' +
                '\u6B63\u5728\u52A0\u8F7D\u6570\u636E...\n' +
                '</div>' +
                '<table class="table table-mystriped table-bordered table-hover">' +
                '<thead id="model-thead">' +
                '<tr>' +
                '<th rowspan="2">\u5E8F\u53F7</th>' +
                '<th rowspan="2">\u7528\u6237\u5730\u5740</th>\<' +
                'th rowspan="2">\u8FDE\u63A5\u65B9\u5F0F</th>' +
                '<th colspan="3" style="border-bottom:none">\u6D41\u91CF(Byte)</th>' +
                '</tr><tr>' +
                '<th>\u4E0A\u884C\u6D41\u91CF</th>' +
                '<th>\u4E0B\u884C\u6D41\u91CF</th>' +
                '<th>\u603B\u6D41\u91CF</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody id="model-tb">' +
                '</tbody>' +
                '</table>');

            $('.data-model .data-list .title').css('display', 'block').html('数据列表(' + vName + ')');
            var jsonData = JSON.stringify({
                'cid': '1018',
                'content': {
                    'appid': vid
                }
            });
            $.ajax({
                type: 'POST',
                contentType: 'application/json;charset:utf-8',
                url: ajaxUrl + '?jsoncallback=?',
                dataType: 'jsonp',
                jsonp: 'callback',
                timeout: 30000,
                data: { "data": jsonData },
                beforeSend: function beforeSend() {
                    $('.show-loading').css('display', 'block').prev().css('display', 'block');
                },
                success: function success(data) {
                    $('.show-loading').css('display', 'none').prev().css('display', 'none');
                    showg20Detail(data);
                }
            });
        }
    }
    //游戏信息管理
    else if (sessionStorage.show == 'g23') {
        //根据不同高度的选项弹出模态框，确保其能在当前高度显示
        var getScrollTopForLoadModel = function getScrollTopForLoadModel(height) {
            $('.data-model .data-pic').css('display', 'none');
            var top = $(document).scrollTop();
            top <= 30 && (top = 30);
            top >= 1160 && (top = 1160);
            loadModel(height, top);
        };

        var g23Aid = $(this).attr('id');
        //IP详情
        if (g23Aid == 'ip-detail') {
            getScrollTopForLoadModel(880);
            $('.data-model').load('ip-detail.html');
            var ipDetailId = $(this).attr('href');
            sessionStorage.gameName = $(this).next().attr('href');
            noPicAjax({
                'cid': '1019',
                'content': {
                    'id': ipDetailId,
                    'state': 0,
                    'nowpage': 1,
                    'ip': ''
                }
            }, showg23ipDetail);
            //编辑
        } else if (g23Aid == 'game-edit') {
            getScrollTopForLoadModel(610);
            $('.data-model .data-select').css('display', 'none');
            $('.data-model .data-pic').css('display', 'none');
            // $('.data-model .title').css('background')
            $('.data-model .list-detail').load('gameMessage-addEdit.html').css('height', '500px');
            $('.data-model .data-list  .title').html('游戏信息编辑');
            var gameEditId = $(this).next().attr('href');
            sessionStorage.gameEditId = gameEditId;
            noPicAjax({ 'cid': '1033', 'content': { 'id': gameEditId } }, function (data) {
                //console.log(data.content);
                var content = data.content;
                var index = content.Gameport;
                $('#game-name').val(content.GameName);
                $('#game-firm').val(content.Gamefirm);
                $('#type' + index).prop('checked', true);
                $('#game-begin').val(content.ServerIPB);
                $('#game-end').val(content.ServerIPE);
                $('#des-content').val(content.Gameremark);
            });
            //删除
        } else if (g23Aid == 'game-delete') {
            console.log('game-delete');
            var did = $(this).attr('href');
            var deleteName = $(this).prev().attr('href');
            if (confirm('确认删除\"' + deleteName + '\"')) {
                noPicAjax({
                    'cid': '1030',
                    'content': {
                        'ids': did
                    }
                }, function (data) {
                    console.log(data);
                    if (data.res == 0) {
                        noPicAjax({
                            'cid': '1016',
                            'content': {
                                'gameid': '',
                                'name': '',
                                'nowpage': '1'
                            }
                        }, showg23);
                    }
                });
            }
        }
    }
    //游戏投诉处理
    else if (sessionStorage.show == 'g30') {
        $('.data-model .data-pic').css('display', 'none');
        $('#complain-model').css('display', 'none');
        $('.data-model .data-list').css('display', 'none');
        $('#complain-handle ').css('display', 'block');
        loadModel(640, 25);
        //游戏名加载到下拉列表中
        var loadOption = function(data) {
            //console.log(data);
            var content = data.content;
            var html = '';
            $.each(content, function (i, p) {

                if(p.gamename==$('#handle-game-name').html()){
                    html +=
                        '<option selected value="' + p.id + '">' + p.gamename +
                        '</option>\n';
                }
                else{
                    html +=
                        '<option  value="' + p.id + '">' + p.gamename + '</option>';
                }
            });
            $('#game-sort').html(html);
        };

        var gName = $(this).parent().prev().prev().prev().prev().prev().text();
        var gNum = $(this).parent().prev().prev().prev().prev().prev().prev().text();
        var cContent = $(this).parent().prev().prev().prev().prev().text();
        var cUser = sessionStorage.userName;
        var cTime = $(this).parent().prev().prev().prev().text();
        var reply = $(this).parent().prev().prev().text();
        var area = $(this).parent().prev().prev().attr('href');
        var cTel= $(this).parent().prev().attr('href');
        var cId = $(this).attr('href');
        //console.log(gName,gNum,cContent,cUser,cTime,reply,cTel,area);
        $('#game-num').html(gNum);
        $('#handle-game-name').html(gName);
        $('#game-area').html(area);
        $('#c-content').html(cContent);
        $('#c-user').html(cUser);
        $('#c-time').html(cTime);
        $('#c-tel').html(cTel);
        $('#c-reply').html(reply);
        $('#handle-config').attr('href',cId);
        noPicAjax({ 'cid': '1023', 'content': {} }, loadOption);

    }
    else if (sessionStorage.show == 'g40') {
        loadModel(880, 20);
        $('.data-model .data-pic').css('display', 'none');
        $('.data-model .data-list').css('display', 'none');
        $('#complain-model').css('display', 'none');
        $('#complain-handle').css('display', 'block');
        $('#complain-handle>.title').html('修改SNMP主机设备');
    }
    //用户管理
    else if(sessionStorage.show=='g62'){
        var uClass = $(this).attr('class');
        if(uClass=='user-edit'){
            loadModel(700, 20);
            //机构id
            var adminId = $(this).attr('href');
            $('#complain-model ').css('display', 'block');
            $('#complain-model > .title').html('编辑用户');
            $('#upwd-tr').hide();
            $('#con-upwd-tr').hide();
            getRole();
            getDept();
            $('#user-config').attr('href',adminId);
        }else if(uClass=='user-delete'){
            var delId = $(this).prev().attr('href');
            if(confirm('确认删除？')){
                noPicAjax({
                    'cid': '7006',
                    'content': {
                        'ids': delId
                    }
                }, function(data){
                    if(data.res==0){
                        alert('删除成功');
                        noPicAjax(
                            {
                                'cid': '7004',
                                'content': {
                                    'username': ''
                                }
                            },
                            showg62
                        );
                    }
                });
            }
        }

    }
});

//关闭模态:引用show-detail.js中的关闭函数closeTree;
$('.close-model').click(function () {
    $('#complain-model').css('display', 'none');
    $('#complain-handle ').css('display', 'none');
    closeTree();
});
$('.optimized-detail>div.model').click(function () {
    $('#complain-model').css('display', 'none');
    $('#complain-handle ').css('display', 'none');
    closeTree();
});

//获取批量删除id
function deleteId() {
    var checks = $('#tb').find('input[type="checkbox"]');
    var ids = [];
    $.each(checks, function (i, p) {
        var deleteItem = $(p).attr('name').split('-');
        $(p).prop('checked') && ids.push(deleteItem[1]);
    });
    //console.log(ids.toString());
    return ids.toString();
}
//批量删除成功，移出DOM树
function deleteSelected(data) {
    if (data.res == 0) {
        alert('删除成功');
        var leap = $('#thead input[type="checkbox"]').prop('checked');
        var checks = $('#tb').find('input[type="checkbox"]');
        if (leap) {
            $('#tb').html('');
        } else {
            var trs = $('#tb').children('tr');
            $.each(checks, function (i, p) {
                $(p).prop('checked') && trs.eq(i).remove();
            });
        }
    }
}

//复选框逻辑
//全选
$('#thead').on('change', 'input[type="checkbox"]', function () {
    var leap = $(this).prop('checked');
    var checks = $('#tb').find('input[type="checkbox"]');
    $.each(checks, function (i, p) {
        $(p).prop('checked', leap);
    });
});
//个体选择影响全选
$('#tb').on('change', 'input[type="checkbox"]', function () {
    var leap = true;
    var checks = $('#tb').find('input[type="checkbox"]');
    for (var i = 0; i < checks.length; i++) {
        leap && (leap = checks.eq(i).prop('checked'));
        if (!leap) {
            break;
        }
    }
    $('#thead input[type="checkbox"]').prop('checked', leap);
});


//游戏名称搜索和下拉列表选择
$('#load-game-name').change(function () {
    $('#for-search-game').val($(this).val());
});

//位于表格有颜色按钮
$('.btn-icon').on('click', '.btn', function () {
    //showg12: 路由新增，删除，导出按钮点击事件:.btn-icon
    if (sessionStorage.show == 'g12') {
        var btnID = $(this).attr('id');
        if (btnID == 'add') {
            $('.add-ip').addClass('show-block');
            $('#new-ip').val('');
            $('#add-ip').html('添加IP');
        } else if (btnID == 'add-ip') {
            var newIP = $('#new-ip').val();
            if (newIP != false&&$(this).html()=='添加IP') {
                console.log(newIP);
                noPicAjax({
                    'cid': '1025',
                    'content': {
                        'ip': newIP
                    }
                }, addItem);
            } else if(newIP != false&&$(this).html()=='编辑IP'){
                var ip = $(this).prev().val();
                var id = $(this).attr('href');
                console.log(id,ip);
                noPicAjax({
                    'cid': '1026',
                    'content': {
                        'ip': ip,
                        'id': id
                    }
                }, addItem);

            } else {
                $('.add-ip>span').css('display', 'inline').css('background','red').text('IP地址不能为空');
                setTimeout(function () {
                    $('.add-ip>span').css('display', 'none');
                }, 3000);
            }
        } else if (btnID == 'close-ip') {
            $(this).parent().removeClass('show-block');
        }
    }

    //showg23:游戏管理添加，批量删除，导出按钮
    else if (sessionStorage.show == 'g23') {
            var g23Id = $(this).attr('id');
            //添加
            if (g23Id == 'add') {
                loadModel(610, 25);
                $('.data-model .data-select').css('display', 'none');
                $('.data-model .data-pic').css('display', 'none');
                // $('.data-model .title').css('background')
                $('.data-model .list-detail').load('gameMessage-addEdit.html').css('height', '500px');
                $('.data-model .data-list  .title').html('游戏信息添加');
            } else if (g23Id == 'delete') {
                deleteId();
                noPicAjax({
                    'cid': '1030',
                    'content': {
                        'ids': deleteId()
                    }
                }, deleteSelected);
            }
        }
        //showg30：投诉添加，批量删除，数据导出按钮
    else if (sessionStorage.show == 'g30') {
        var g30Id = $(this).attr('id');
        //console.log(g30Id);
        //添加
        if (g30Id == 'add') {
            //游戏名称载入下拉列表选项
            var loadOption = function loadOption(data) {
                var content = data.content;
                var html = '';
                $.each(content, function (i, p) {html +=
                    '<option value="' + p.gamename + '">' + p.gamename + '</option>';
                        });
                $('#game-name').html(html);
                $('#search-game').val($('#game-name').val());
            };

            loadModel(670, 20);
            $('.data-model .data-list').css('display', 'none');
            $('.data-model .data-pic').css('display', 'none');
            $('#complain-handle').css('display', 'none');
            $('#complain-model ').css('display', 'block');
            noPicAjax({ 'cid': '1023', 'content': {} }, loadOption);
                    //批量删除
        } else if (g30Id == 'delete') {
            if (confirm('确认删除所选项？')) {
                noPicAjax({
                    'cid': '4005',
                    'content': {
                        'ids': deleteId()
                    }
                }, deleteSelected);
            }
        }
    }
    //showg40：设备管理
    else if(sessionStorage.show=='g40'){
        var g40Id = $(this).attr('id');
        if(g40Id=='add'){
            loadModel(880, 20);
            $('.data-model .data-pic').css('display', 'none');
            $('.data-model .data-list').css('display', 'none');
            $('#complain-model').css('display', 'none');
            $('#complain-handle').css('display', 'block');
            $('#complain-handle>.title').html('添加SNMP主机设备');
        }
    }
    //showg60: 机构管理添加，删除点击事件
    else if (sessionStorage.show == 'g60') {
        var g60Bid = $(this).attr('id');
        if (g60Bid == 'add') {
            g60BtnEvent('add');
        } else if (g60Bid == 'refresh') {
            noPicAjax({
                'cid': '7001'
            }, showg60);
        } else if (g60Bid == 'delete') {
            if (confirm('确认删除所选')) {
                noPicAjax({
                    'cid': '7003',
                    'content': {
                        'ids': deleteId()
                    }
                }, deleteSelected);
            }
        }
    }
    //showg61: 角色管理添加，删除点击事件
    else if (sessionStorage.show == 'g61') {
        var g61Bid = $(this).attr('id');
        if (g61Bid == 'add') {
            g60BtnEvent('add');
        } else if (g61Bid == 'refresh') {
            noPicAjax({
                'cid': '7008',
                'content': {
                    'rolename': ''
                }
            }, showg61);
        } else if (g61Bid == 'delete') {
            if (confirm('确认删除所选')) {
                noPicAjax({
                    'cid': '7010',
                    'content': {
                        'ids': deleteId()
                    }
                }, deleteSelected);
            }
        }
    }
    //showg62: 用户管理，刷新，添加，删除点击事件
    else if(sessionStorage.show=='g62'){
        var g62Id = $(this).attr('id');
        if(g62Id=='add-user'){
            loadModel(800, 20);
            $('#complain-model ').css('display', 'block');
            $('#complain-model > .title').html('新增用户');
            $('#upwd-tr').show();
            $('#con-upwd-tr').show();
            getRole();
            getDept();
            $('#user-config').attr('href',-1);
        }else if(g62Id=='delete'){
            if (confirm('确认删除所选项？')) {
                noPicAjax({
                    'cid': '7006',
                    'content': {
                        'ids': deleteId()
                    }
                }, deleteSelected);
            }
        }else if(g62Id=='refresh'){
            noPicAjax(
                {
                    'cid': '7004',
                    'content': {
                        'username': ''
                    }
                },
                showg62
            );
        }
    }
});

//showg12:新增，删除，导出处理函数
function addItem(data) {
    //console.log(data);
    if (data.res == 0) {
        noPicAjax(
            {
                'cid': '1024',
                'content': {
                    'nowpage': 1
                }
            },
            showg12
        );
        $('.add-ip>span').css('display', 'inline').css('background','green').text('操作成功');
        setTimeout(function () {
            $('.add-ip>span').css('display', 'none');
        }, 3000);
    }
}

//新增发布备案模态框确定按钮
$('#add-issuer-config').click(function(){
    var declareTime = $('#issuer-time').val().split('-').join('');
    var declarePeople = $('#issuer-user').val();
    var IP = $('#new-issuer-ip').val();
    var ipLocation = $('#ip-area').val();
    var url = $('#issuer-url').val();
    var content = $('#use-content').val();
    var remark = $('#other-content').val();
    noPicAjax({
        'cid': '2002',
        'content': {
            'id': '',
            'action': 'add',
            'DeclareTime': declareTime,
            'DeclarePeople': declarePeople,
            'IP': IP,
            'IpLocation': ipLocation,
            'Url': url,
            'Content': content,
            'Remark': remark
        }
    },function(data){
        console.log(data);
    });
});

//showg23:游戏信息管理
//游戏添加和编辑处理
function gameAddOrEdit(type, id) {
    var alertText = type == 'add' ? '添加' : '编辑';
    var gameName = $('#game-name').val();
    var gameFirm = $('#game-firm').val();
    var gamePort = $('#radios input:checked').val();
    var gameBegin = $('#game-begin').val();
    var gameEnd = $('#game-end').val();
    var gameRemark = $('#des-content').val();
    //console.log(gamePort);
    if(gameName!=''&&gameFirm!=''&&gamePort!=''&&gameBegin!=''&&gameEnd!=''){
        noPicAjax({
            'cid': '1029',
            'content': {
                'id': id,
                'action': type,
                'gamename': gameName,
                'gamefirm': gameFirm,
                'gameport': gamePort,
                'serveripbegin': gameBegin,
                'serveripend': gameEnd,
                'gameremark': gameRemark
            }
        }, function (data) {
            if (data.res == 0) {
                closeTree();
                alert(alertText + '成功');
            } else {
                alert('操作失败，请重试');
            }
        });
    }else{
        alert('必填项不能为空');
    }

}

//游戏信息管理：模态框#add-edit中的按钮点击
$('.data-model').on('click', '.msg', function () {
    //游戏信息 cid:1029添加/修改 id  action  gamename gamefirm gameremark
    // serveripbegin serveripend gameport

    if ($(this).attr('id') == 'message-cancel') {
        //取消：关闭弹出框
        closeTree();
    } else {
        if ($('#add-edit').parent().prev().html() == '游戏信息添加') {
            gameAddOrEdit('add', '');
        } else {
            gameAddOrEdit('update', sessionStorage.gameEditId);
        }
    }
});

//游戏信息管理ip详情模态框中编辑，删除事件
$('.show-area-optimized .data-model').on('click','a',function(e){
    e.preventDefault();
   if(sessionStorage.show=='g23'){
       console.log('g23-ip详情-编辑');
   }
});

//showg30：投诉添加模态框事件
//游戏名下拉框
$('#game-name').change(function () {
    $('#search-game').val($(this).val());
});
//  游戏名输入表单
//showg30: 投诉添加模态框提交按钮
$('#complain-model').on('click', '.complain-handle-btn', function () {
    if ($(this).attr('id') == 'complain-config') {
        var gameName = $('#search-game').val();
        var area = $('#complain-area').val();
        var contact = $('#complain-tel').val();
        var address = $('#complain-addr').val();
        var username = $('#complain-man').val();
        var complaincontent = $('#complain-content').val();
        var type = $('#radios input:checked').val();
        var req = {
            'cid': '4002',
            'content': {
                'gamename': gameName,
                'area': area,
                'contact': contact,
                'address': address,
                'username': username,
                'complaincontent': complaincontent,
                'type': type
            }
        };
        if (complaincontent != '') {
            noPicAjax(req, function (data) {
                if (data.res == 0) {
                    alert('添加成功');
                    $('.data-model .data-list').css('display', 'block');
                    $('#complain-model ').css('display', 'none');
                    closeTree();
                    noPicAjax({
                        'cid': '1013',
                        'content': {
                            'startdate': '',
                            'enddate': '',
                            'gameid': '',
                            'sn': '',
                            'state': '',
                            'nowpage': 1
                        }
                    },showg30);
                }
            });
        } else {
            alert('请输入投诉内容');
        }
    } else {
        $('.data-model .data-list').css('display', 'block');
        $('#complain-model ').css('display', 'none');
        closeTree();
    }
});
//showg30: 投诉处理模态框提交按钮
$('#complain-handle').on('click', '.btn', function () {
    if($(this).attr('id')=='handle-config'){
        var ID = $('#game-num').text();
        var reply = $('#handle-content').val();
        var gameId = $('#game-sort').val();
        var errorType = $('#fault-sort').val();
        console.log(reply);
        var req = {
            'cid': '4003',
            'content': {
                'reply': reply,
                'id': ID,
                'gameid': gameId,
                'errortype': errorType,
                'address': ''
            }
        };
        if (reply != '') {
            noPicAjax(req, function (data) {
                console.log(data);
                if (data.res == 0) {
                    alert('提交成功');
                    $('.data-model .data-list').css('display', 'block');
                    $('#complain-handle ').css('display', 'none');
                    closeTree();
                    noPicAjax({
                        'cid': '1013',
                        'content': {
                            'startdate': '',
                            'enddate': '',
                            'gameid': '',
                            'sn': '',
                            'state': '',
                            'nowpage': 1
                        }
                    },showg30);
                }
            });
        }else {
            alert('请输入回复内容');
        }

    }else{
        $('.data-model .data-list').css('display', 'block');
        $('#complain-handle').css('display', 'none');
        closeTree();
    }

});

//showg61和showg60:机构和角色添加，编辑页面html
function g60BtnEvent(to) {
    var title = to == 'add' ? '添加' : '编辑';
    //var showTitle = sessionStorage.title.slice(0,2);
    $('.show-data .data-pic .title').html(title + '信息');
    $('.show-data .data-pic').css('height', 0).css('overflow', 'hidden').css('display', 'block').animate({
        height: '101px'
    }, 400);
    $('#show-pic').css('height', '59px').css('padding', '15px').html(
        '<table  cellspacing="5">' +
        '<tr>' +
        '<td>\u540D\u79F0:&nbsp;<input id="oName" type="text" name="name"/>' +
        '</td>' +
        '<td>\u6392\u5E8F:&nbsp;<input id="order" type="text" name="name"/></td>' +
        '<td ><span>\u662F\u5426\u542F\u7528:</span>' +
        '<select id="enable" name="enable" class="fr">' +
        '<option value="0">\u662F</option>' +
        '<option value="1">\u5426</option>' +
        '</select>' +
        '</td>' +
        '<td style="column-span:2">' +
        '<button id="' + to + '-config" type="button"  class="btn btn-primary">' + (to == 'add' ? '添加' : '确认') + '</button>' +
        '</td>' +
        '<td>' +
        '<button id="cancel" type="button" class="btn btn-warning">\u53D6\u6D88</button>' +
        '</td>' +
        '</tr>' +
        '</table>');
}

//showg60:机构添加,编辑,删除更新
function addOganization(data) {
    console.log(data);
    if (data.res == '0') {
        //添加成功更新列表
        noPicAjax({
            'cid': '7001'
        }, showg60);
        alert('操作成功');
        //收起添加区域
        $('.show-data .data-pic').animate({
            height: 0
        }, 250, function () {
            $(this).css('display', 'none');
        });
    }
}

//showg61:角色添加,编辑,删除更新
function updateRole(data) {
    console.log(data);
    if (data.res == '0') {

        //添加成功更新
        noPicAjax({
            'cid': '7008',
            'content': {
                'rolename': ''
            }
        }, showg61);
        alert('操作成功');
        //收起添加区域
        $('.show-data .data-pic').animate({
            height: 0
        }, 250, function () {
            $(this).css('display', 'none');
        });
    }
}

//系统管理确认，取消按钮(机构管理，角色管理)
$('#show-pic').on('click', '.btn', function () {
    //showg60: 机构管理确认，取消按钮
    if (sessionStorage.show == 'g60') {
        if ($(this).attr('id') == 'cancel') {
            $('.show-data .data-pic').animate({
                height: 0
            }, 400, function () {
                $(this).css('display', 'none');
            });
        } else {
            var action = $(this).attr('id').split('-');
            var oName = $('#oName').val();
            var order = $('#order').val();
            (order=='')&&(order=10);
            var enable = $('#enable').val();
            if (action[0] == 'add') {
                noPicAjax({
                    'cid': '7002',
                    'content': {
                        'sinstiname': oName,
                        'sortid': order,
                        'enable': enable,
                        'action': action[0]
                    }
                }, addOganization);
            } else if (action[0] == 'update') {
                noPicAjax({
                    'cid': '7002',
                    'content': {
                        'sinstiname': oName,
                        'sortid': order,
                        'enable': enable,
                        'action': action[0],
                        'id': sessionStorage.uid
                    }
                }, addOganization);
            }
        }
    }
    //showg61: 角色管理确认，取消按钮
    else if (sessionStorage.show == 'g61') {
            if ($(this).attr('id') == 'cancel') {
                $('.show-data .data-pic').animate({
                    height: 0
                }, 400, function () {
                    $(this).css('display', 'none');
                });
            } else {
                var action61 = $(this).attr('id').split('-');
                var name = $('#oName').val();
                var order61 = $('#order').val();
                (order61=='')&&(order61='10');
                var enable61 = $('#enable').val();
                if (action61[0] == 'add') {
                    noPicAjax({
                        'cid': '7009',
                        'content': {
                            'name': name,
                            'sort': order61,
                            'enable': enable61,
                            'action': action61[0]
                        }
                    }, updateRole);
                } else if (action61[0] == 'update') {
                    console.log('61');
                    noPicAjax({
                        'cid': '7009',
                        'content': {
                            'name': name,
                            'sort': order61,
                            'enable': enable61,
                            'action': action61[0],
                            'id': sessionStorage.uid
                        }
                    }, updateRole);
                }
            }
        }
});

//showg60: 机构和角色编辑，删除按钮
$('.show-data .list-detail .table').on('click', '.btn', function () {
    //机构编辑，删除按钮
    if (sessionStorage.show == 'g60') {
        if ($(this).hasClass('edit')) {
            g60BtnEvent('update');
            //表单值为选择编辑的对应项目名称
            $('#oName').val($(this).attr('title'));
            sessionStorage.uid = $(this).next().attr('title');
        } else {
            var did = $(this).attr('title');
            var deleteName = $(this).prev().attr('title');
            if (confirm('确认删除\"' + deleteName + '\"')) {
                noPicAjax({
                    'cid': '7003',
                    'content': {
                        'ids': did
                    }
                }, addOganization);
            }
        }
    }
    //角色编辑，删除按钮
    else if (sessionStorage.show == 'g61') {
            if ($(this).hasClass('edit')) {
                g60BtnEvent('update');
                //#show-pic下的表单值为选择编辑的对应项目名称
                $('#oName').val($(this).attr('title'));
                sessionStorage.uid = $(this).next().attr('title');
            } else {
                var rid = $(this).attr('title');
                var deleterName = $(this).prev().attr('title');
                if (confirm('确认删除\"' + deleterName + '\"')) {
                    noPicAjax({
                        'cid': '7010',
                        'content': {
                            'ids': rid
                        }
                    }, updateRole);
                }
            }
        }
});

//回到顶部按钮，平滑滚动
$('.pagination').on('click', '.scroll-top', function (e) {
    e.preventDefault();
    $('html,body').animate({ scrollTop: '0px' }, 500);
});

//获取角色名称列表
function getRole(){
    noPicAjax(
        {
            'cid': '7008',
            'content': {
                'rolename': ''
            }
        },
        function(data){
            var list = JSON.parse(data.content);
            var html = '';
            $.each(list,function(i,p){
                //console.log(p.SroleName);
                html += '<option value="'+p.SroleId+'">'+p.SroleName+'</option>';
            });

            $('#user-role').html(html);
        }
    );
}
//或者机构名称列表
function getDept(){
    noPicAjax(
        {
            'cid': '7001'
        },
        function(data){
            var list = JSON.parse(data.content);
            var html = '';
            $.each(list,function(i,p){
                //console.log(p.SinstitutionsName);
                html +=
                    '<option value="'+p.SinstitutionsId+'">'+p.SinstitutionsName+'</option>';
            });

            $('#dept-name').html(html);
        }
    );
}

//用户管理添加，编辑处理
function userAddOrEdit(type,id){
    var alertText = type == 'add' ? '添加' : '编辑';
    var userName = $('#user').val();
    var password = $('#upwd').val();
    var phone = $('#user-tel').val();
    var email = $('#user-email').val();
    var qq = $('#link-num').val();
    var address = $('#user-addr').val();
    var sinti = $('#dept-name').val();
    var roleid = $('#user-role').val();
    var content = {};
    if(id!=undefined){
        content = {
            'id': id,
            'action': type,
            'username': userName,
            'password': password,
            'phone': phone,
            'email': email,
            'qq': qq,
            'address': address,
            'sinti': sinti,
            'roleid': roleid

        };
    }else{
        content = {
            'action': type,
            'username': userName,
            'password': password,
            'phone': phone,
            'email': email,
            'qq': qq,
            'address': address,
            'sinti': sinti,
            'roleid': roleid
        };
    }
    noPicAjax(
        {
            'cid': '7005',
            'content': content
        },
        function(data){
            if (data.res == '0') {
                closeTree();
                alert(alertText + '成功');
                noPicAjax(
                    {
                        'cid': '7004',
                        'content': {
                            'username': ''
                        }
                    },
                    showg62
                );
            } else {
                alert('操作失败，请重试');
            }
        }
    );

}



//showg62:用户管理确认，取消按钮
$('#complain-model').on('click','.user-btn',function () {
    var btnId = $(this).attr('id');
    if(btnId=='user-config'){
        var id = $(this).attr('href');
        if(id=='-1'){
            userAddOrEdit('add');
            console.log('add');
        }else{
            userAddOrEdit('update',id);
            console.log('edit');
        }

    }
    else{
        $('.data-model .data-list').css('display', 'block');
        $('#complain-model ').css('display', 'none');
        closeTree();
    }

});
//修改密码按钮
$('.list-detail').on('click', 'button', function () {
    var oldPwd = $('.list-detail #old-pwd').val();
    var newPwd = $('.list-detail #new-pwd').val();
    var configPwd = $('.list-detail #con-new-pwd').val();
    //console.log(newPwd,configPwd);
    var id = $(this).attr('id');
    //console.log(id);
    if (id == 'config-pwd') {
        if (newPwd != configPwd) {
            alert('两次密码不一致');
        } else {
            noPicAjax({
                'cid': '7007',
                'content': {
                    'oldpwd': oldPwd,
                    'newpwd': newPwd
                }
            }, showg63);
        }
    } else if (id == 'cancel') {
        //$('#content').load('show-detail.html');
        load(this);
       // $('#aside').css('height', '1380px');
    }
});


//获取ip备案查询列表
function issuerIpCheck(pager,loadFoo) {
    //var begin = $('#begin-date').val().split('-').join('');
    //var end = $('#end-date').val().split('-').join('');
    var issuerIp = $('#issuer-ip').val();
    var req = {
        'cid': '2001',
        'content': {
            'IP': issuerIp,
            'begintime': '',
            'endtime': '',
            'nowpage': pager,
            'pagesize': 25
        }
    };
    noPicAjax(req, loadFoo);
}

//ip备案列表
function ipRecords(data){
    $('.show-data .data-list .title').html('查询结果');
    console.log(data);
    var items = 25;
    var count = data.content.count;
    var pages = Math.ceil(count/items);
    //生成分页
    if(pages>0){
        $('#show-list').css('display','table');
        $('.no-result').css('display','none');
        $('.pagination').jqPaginator({
            totalPages: pages,
            //totalCount: k,
            //pageSize: 13,
            visiblePages: 8,
            currentPage: 1,
            activeClass: 'active',
            first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
            prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
            next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
            last: '<li class="last"><a href="javascript:void(0);">最后1页</a></li>',
            page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            onPageChange: function onPageChange(num) {
                $('#page-num').html('当前第' + num + '页');
                //分页点击
                if(num==1){
                    loadTable(data);
                }else {
                    issuerIpCheck(num,loadTable)
                }
            }
        });
    }else {
        $('#show-list').css('display','none');
        $('.no-result').css('display','block');
        $('.pagination').html('');
    }


    function loadTable(data) {
        var content = JSON.parse(data.content.list);
        //列表
        var html = '';
        for(var i = 0; i < content.length; i++){
            var declareTime = content[i].DeclareTime.slice(0,10);
            html +=
                '<tr>' +
                '<td>' + declareTime + '</td>' +
                '<td>' + content[i].DeclarePeople + '</td>' +
                '<td>' + content[i].IP + '</td>' +
                '<td>' + content[i].IpLocation + '</td>' +
                '<td>' + content[i].Url + '</td>' +
                '<td>' + content[i].Content + '</td>' +
                '<td>' + content[i].Delay + '</td>' +
                '<td>' + content[i].Loss + '</td>' +
                '<td>' + content[i].Shake + '</td>' +
                '<td>' + content[i].IsRecall + '</td>' +
                '<td>' + content[i].RecallReason + '</td>' +
                '<td>' + content[i].Remark + '</td>' +
                '<td>' +
                '<a href="' + content[i].ID + '">编辑</a>' +
                '</td>' +
                '</tr>';
        }
        $('#tb').html(html);
        //保持高度一致
        //var height = parseFloat($('#content').css('height')) + 55;
        //if(height>1000){
        //    $('#aside').css('height', height + 'px');
        //}
    }

}

//新增发布备案
$('#add-issuer').click(function(){
    loadModel(760, 20);
    $('#complain-model ').css('display', 'block');
});