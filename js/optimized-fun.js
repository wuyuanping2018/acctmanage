//'use strict';

/*!
 * @name: optimezed-fun.js
 * @description: 优化详情页面各详情函数
 * @author: wuyuanping
 * @update: 2017-08-13
 */
//"use strict";

//全部变量ajaxUrl: 异步请求接口
var ajaxUrl = eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('\'\\7\\6\\6\\3\\5\\1\\1\\0\\0\\e\\2\\0\\c\\b\\2\\a\\i\\2\\0\\j\\h\\5\\8\\f\\8\\0\\1\\4\\3\\9\\1\\4\\3\\9\\2\\4\\g\\7\\d\';',20,20,'x31|x2f|x2e|x70|x61|x3a|x74|x68|x38|x69|x33|x39|x36|x78|x37|x30|x73|x32|x35|x34'.split('|'),0,{}));
var imgURL = '';
var modelnow = ['网络畅游模式','教育资源','奖励卡模式','不良内容拦截模式'];
//打开菜单函数，点击更多到页面是打开相应的左侧菜单栏
function menuOpen(menuId) {
    $("#menu").find(".active").removeClass("active");
    $("#"+menuId).parent('li').addClass('active').siblings().removeClass('active');
    var parentId = '#show-'+menuId.slice(0,2);
    $(parentId).children('span').eq(1).removeClass('right-arrow').addClass('down');
    var ue = $(parentId).next().children('li');
    var uHeight = ue.length*40+'px';
    $(parentId).next().addClass('show').animate({
        height: uHeight
    });
}

//关闭模态框
function closeTree() {
    $('#show-tree').animate({
        opacity: 0,
        top: 0
    }, 300, function () {
        $(this).css('height', 0);
    });
    $('.show-area-optimized').animate({
        opacity: 0,
        top: 0,
        zIndex: -1
    }, 300, function () {
        $(this).css('height', 0);
    });
    $('.model').css('zIndex', -10).css('backgroundColor', 'rgba(0,0,0,0)');
}



// 用户列表
function showUser(data) {
    $('.show-data .list-detail').css('overflow','auto');
    $('.btn-icon').css('display','block');
    var content = data.content;
    var k = content.length; //总条数
    var pages = Math.ceil(k / 10); //总页数
    if(pages==0){
        pages = 1
    }
    //表格加载函数
    function loadTable(page) {
        var html = '';
        var start = 10 * (page - 1);
        var length = page < pages ? start + 10 : k;
        for (var i = start; i < length; i++) {
           html +=
                '<tr>' +
                '<td>' + content[i].openid + '</td>' +
                '<td>' + content[i].nickname + '</td>' +
                '<td>' + content[i].addtime + '</td>' +
                '<td title="' + content[i].nickname + '">' +
                    '<a href="' + content[i].localuserid + '">\u8BE6\u60C5</a>' +
                '</td>' +
                '</tr>';
        }
        $('#tb').html(html);
    }
    //生成分页
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
            loadTable(num);
        }
    });

    //保持高度一致
    var height = parseFloat($('#content').css('height')) + 55;
    //$('#aside').css('height', height + 'px');

}
// 绑定账号信息
function showUserDetail(data) {
    console.log(data);
    var allData = data.content;
    var listHtml = '';

    $.each(allData, function (i, p) {
        var modeIndex = p.modelnow*1-1;
        listHtml +=
            '<tr>' +
            '<td>' + p.broadbandacc + '</td>' +
            '<td>' + p.tel + '</td>' +
            '<td>' + p.addr + '</td>' +
            '<td>' + modelnow[modeIndex] + '</td>' +
            '<td>' + p.remarks + '</td>' +
            '<td>' + (p.state?'开通':'未开通') + '</td>' +
            '<td>' + p.nickname + '</td>' +
            '</tr>';
    });
    $('#model-tb').html(listHtml);
    var height = $('.data-model').css('height');
    console.log('=====>>'+height);
    $('.show-area-optimized').css('height', height);
}

//宽带账号管理 showAcct
function showAcct (data) {
    $('.show-data .list-detail').css('overflow','auto');
    $('.btn-icon').css('display','block');
    var k = data.content.allcount; //总条数
    var pages = Math.ceil(k / 10); //总页数
    if(pages==0){
        pages = 1
    }
    //根据页码获取数据
    function getPagerToLoad(pager) {
        noPicAjax({
            'cid': '2021',
            'content': {
                'broadbandacc': '',
                'nowpage': pager,
                'pagesize': ''
            }
        }, function (data) {
            loadList(data);
            //保持高度一致
            var height = parseFloat($('#aside').css('height')) - 55;
           $('#content').css('height', height + 'px');
        });
    }

    //表格加载函数
    function loadList(data) {
        var content = data.content.broadbandList;
        var html = '';
        var length = content.length;
        for (var i = 0; i < length; i++) {
            var modelIndex = content[i].model*1-1;
            var isBundle = content[i].authstate;
            html +=
                '<tr>' +
                '<td>' + content[i].broadbandacc + '</td>' +
                '<td>' + content[i].password + '</td>' +
                '<td>' + content[i].tel + '</td>' +
                '<td>' + modelnow[modelIndex] + '</td>' +
                '<td>' + content[i].addtime + '</td>' +
                '<td>' + content[i].endtime + '</td>' +
                '<td title="' + content[i].broadbandid + '">' +
                '<a href="' + content[i].broadbandacc + '">'+(isBundle?"绑定":"未绑定")+'</a>' +
                '</td>' +
                //'<td>' + content[i].duetime + '</td>' +
                '</tr>';
        }
        $('#tb').html(html);
    }
    //生成分页
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
            if(num!=1){
                getPagerToLoad(num);
            }else{
                loadList(data);
            }
        }
    });

    //保持高度一致
    var height = parseFloat($('#content').css('height')) + 55;
    //$('#aside').css('height', height + 'px');

}




//runLog: 日志管理： 运行日志
/*function runLog(data) {
    //console.log(data);

    //生成表主体
    var k = data.content.allcount; //总条数
    var pages = Math.ceil(k / 10); //总页数
    //表格主体
    loadTable(1, data);
    //发送请求获取数据
    function getPagerToLoad(pager) {
        noPicAjax({
            'cid': '6001',
            'content': {
                'startdate': '20160101',
                'enddate': transDate().end,
                'nowpage': pager
            }
        }, function (data) {
            loadTable(pager, data);
            //保持高度一致
            var height = parseFloat($('#content').css('height')) + 55;
           // $('#aside').css('height', height + 'px');
        });
    }
    //表格加载函数
    function loadTable(page, data) {
        var html = '';
        var list = JSON.parse(data.content.list);
        var start = 10 * (page - 1);
        for (var i = 0; i < list.length; i++) {
            var dTime = list[i].Time.split('T');
            html +=
                '<tr>' +
                '<td style="vertical-align: middle">' + (start + i + 1) + '</td>' +
                '<td style="text-align: left;width:830px;word-wrap:break-word;word-break:break-all;">' + list[i].Log + '</td>' +
                '<td style="vertical-align: middle">' + dTime[0] + ' ' + dTime[1] + '</td>' +
                '</tr>';
        }
        $('#tb').html(html);
    }

    //生成分页

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
            getPagerToLoad(num);
        }
    });

    //保持高度一致
    var height = parseFloat($('#content').css('height')) + 55;
    //$('#aside').css('height', height + 'px');
}*/

//showg51: 游戏操作日志 //保持高度一致
//var height = parseFloat($('#content').css('height'))+55;
//$('#aside').css('height',height+'px');
function runLog(data) {
    //console.log(data);

    //生成表格主体
    var list = data.content.userloglist;
    var html = '';
    $.each(list, function (i, p) {
        html +=
            '<tr>' +
            '<td>' + p.id + '</td>' +
            '<td>' + p.actioncontent + '</td>' +
            '<td>' + p.actiontype + '</td>' +
            '<td>' + p.localuserid + '</td>' +
            '<td>' + p.openid + '</td>' +
            '<td>' + p.remark + '</td>' +
            '<td>' + p.dateadd + '</td>' +
            '</tr>';
    });
    $('#tb').html(html);
    $('.page').html('共' + list.length + '条记录');
    //保持高度一致
    var height = parseFloat($('#content').css('height')) + 55;
    //$('#aside').css('height', height + 'px');
}

//showg60: 机构管理
function showg60(data) {
   // console.log(data);
    //生成表头
    $('#thead').html(
        '<th>' +
        '<div class="form-inline"><div class="checkbox">' +
            '<label><input type="checkbox" name="choose-all"></label>' +
        '</div></div>' +
        '</th>' +
        '<th>\u673A\u6784\u540D\u79F0</th>' +
        '<th>\u542F\u7528</th>' +
        '<th>\u6DFB\u52A0\u65F6\u95F4</th>' +
        '<th>\u4FEE\u6539\u65F6\u95F4</th>' +
        '<th>\u64CD\u4F5C</th>');
    //生成表主体
    var list = JSON.parse(data.content);
    var html = '';
    $.each(list, function (i, p) {
        var sEnable = p.SinstitutionsEnable == '0' ? '是' : '否';
        var uDate = p.SinstitutionsUpdateTime.split('T'); //修改时间
        var aDate = p.SinstitutionsAddtime.split('T'); //添加时间
        html +=
            '<tr>' +
            '<td><div class="form-inline"><div class="checkbox">' +
            '<label><input type="checkbox" name="choose-' + p.SinstitutionsId + '">' +
            '</label>' +
            '</div></div>' +
            '</td>' +
            '<td class="for-search">' + p.SinstitutionsName + '</td>' +
            '<td>' + sEnable + '</td>' +
            '<td>' + aDate[0] + ' ' + aDate[1] + '</td>' +
            '<td>' + uDate[0] + ' ' + uDate[1] + '</td>' +
            '<td>' +
                '<button class="edit btn btn-xs btn-default" title="' + p.SinstitutionsName + '">\u7F16\u8F91</button>' +
                '<button class="delete btn btn-xs btn-danger" title="' + p.SinstitutionsId + '" style="margin-left:10px">\u5220\u9664</button>' +
            '</td>' +
            '</tr>';
    });
    $('#tb').html(html);
}

//showg61: 角色管理
function showg61(data) {
    //console.log(data);
    //生成表头
    $('#thead').html(
        '<th>' +
        '<div class="form-inline"><div class="checkbox">' +
        '<label><input type="checkbox" name="choose-all">' +
        '</label>' +
        '</div></div>' +
        '</th>' +
        '<th>\u89D2\u8272ID</th>' +
        '<th>\u89D2\u8272\u540D\u79F0</th>' +
        '<th>\u542F\u7528</th>' +
        '<th>\u6DFB\u52A0\u65F6\u95F4</th>' +
        '<th>\u4FEE\u6539\u65F6\u95F4</th>' +
        '<th>\u64CD\u4F5C</th>');
    //生成表主体
    var list = JSON.parse(data.content);
    var html = '';
    $.each(list, function (i, p) {
        var sEnable = p.SroleEnable == '0' ? '是' : '否';
        var uDate = p.SroleUpdateTime.split('T'); //修改时间
        var aDate = p.SroleAddtime.split('T'); //添加时间
        html +=
            '<tr><td><div class="form-inline"><div class="checkbox">' +
            '<label><input type="checkbox" name="choose-' + p.SroleId + '">' + '</label>' +
            '</div></div> ' +
            '</td>' +
            '<td>' + p.SroleId + '</td>' +
            '<td class="for-search">' + p.SroleName + '</td>' +
            '<td>' + sEnable + '</td>' +
            '<td>' + aDate[0] + ' ' + aDate[1] + '</td>' +
            '<td>' + uDate[0] + ' ' + uDate[1] + '</td>' +
            '<td>' +
            '<button class="edit btn btn-xs btn-default" title="' + p.SroleName + '">\u7F16\u8F91</button>' +
            '<button class="delete btn btn-xs btn-danger" title="' + p.SroleId + '" style="margin-left:10px">\u5220\u9664</button>' +
            '</td>' +
            '</tr>' +
            '';
    });

    $('#tb').html(html);
}

//showg62: 用户管理
function showg62(data) {
    //console.log(data);
    //生成表头
    $('#thead').html(
        '<th>' +
        '<div class="form-inline"><div class="checkbox">' +
        '<label><input type="checkbox" name="choose-all">' +
        '</label>' +
        '</div></div>' +
        '</th>' +
        '<th>\u7528\u6237\u540D</th>' +
        '<th>\u7528\u6237\u89D2\u8272</th>' +
        '<th>\u6240\u5C5E\u673A\u6784</th>' +
        '<th>\u64CD\u4F5C</th>');

    //生成表主体
    var list = JSON.parse(data.content);
    var html = '';
    $.each(list, function (i, p) {
        html +=
            '<tr>' +
            '<td>' +
            '<div class="form-inline"><div class="checkbox">' +
            '<label><input type="checkbox" name="choose-' + p.SadminId + '">' +
            '</label>' +
            '</div></div>' +
            '</td>' +
            '<td class="for-search">' + p.SadminName + '</td>' +
            '<td>' + p.SroleName + '</td>' +
            '<td>' + p.SinstitutionsName + '</td>' +
            '<td>' +
                '<a style="display:none;" href="#">\u6743\u9650\u7BA1\u7406</a>' +
                '<a class="reset-pwd" href="#">\u5BC6\u7801\u91CD\u7F6E</a>' +
                '<a class="user-edit" href="' + p.SadminId + '">\u7F16\u8F91</a>' +
                '<a class="user-delete" href="#">\u5220\u9664</a>' +
            '</td>' +
            '</tr>';
    });
    $('#tb').html(html);
    //保持高度一致
    var height = parseFloat($('#content').css('height')) + 55;
    //if(height<1000){
    //    $('#aside').css('height', '999px');
    //}

}

//showg63： 修改密码
function showg63(data) {
    console.log(data);
    if (data.res == 0) {
        alert('修改成功');
        $('#content').load('user-manage.html');
        //$('#aside').css('height', '1380px');
    }
}

//日期转换函数,格式：new Date()的时间转为类似‘20170801’
function transDate() {
    var day = new Date();
    var end = day.toLocaleDateString().split('/');
    day.setTime(day.getTime() - 24 * 60 * 60 * 1000);
    var start = day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + day.getDate();
    start = start.split('/');
    function trans(date) {
        for (var i = 1; i <= 2; i++) {
            if (date[i].length < 2) {
                date[i] = '0' + date[i];
            }
        }
        return date.join('');
    }
    var getDay = {};
    getDay.start = trans(start);
    getDay.end = trans(end);
    return getDay;
}

