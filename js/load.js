//"use strict";

/*!
 * @name: load.js
 * @description: 异步加载页面，以及浏览器前进后退刷新
 * @author: 吴远平
 * @update: 2017-08-22
 */

$.extend({
    /**
     *  使用jquery的load方法加载页面,
     *  根据url地址加载该页面中的id为content的内容 到 本页面的ID为content的位置
     *  url     链接URL
     *  data    链接请求参数
     */
    loadPage: function loadPage(url, data) {
        $.ajaxSetup({ cache: false });
        $("#content").load(url + " #content ", data, function (result) {
            // 将被加载页的JavaScript加载到本页执行
           var $result = $(result);
            // 将页面传递参数data定义为param 在被加载页接收
            $result.find("script").prepend("var param = " + JSON.stringify(data)).appendTo('#content');
        });
    },
    /**
     * 保存链接url、菜单ID、链接请求数据到 历史记录中
     * url        链接URL
     * menuId    菜单ID
     * data        链接请求参数
     */
    pushState: function pushState(url, menuId, data) {
        // 如果URL没有menuId，即认为该菜单页面中链接跳转，使用该链接所在页的menuId
        if (menuId == null || menuId == '') {
            menuId = history.state.menuId;
        }
        console.log("pushState:" + url + ":::" + menuId + ":::" + data);
        // 将URL，menuId, 请求参数保存到历史记录中
        history.pushState({ urlStr: url, menuId: menuId, data: data }, "页面标题", "?_url=" + url);
    },
    /**
     * 浏览器 前进、后退事件
     */
    popState: function popState() {
        window.addEventListener("popstate", function () {
            var currentState = history.state;
            console.log(currentState);
            if (currentState != null) {
               var url = currentState.urlStr;
               $.menuOpen(currentState.menuId);
               $.loadPage(url, currentState.data);
            }
        });
    },
    /**
     * 浏览器刷新事件
     */
    refresh: function refresh() {
        var currentState = history.state;
        if (currentState != null) {
            var loadUrl = currentState.urlStr;
            var page = loadUrl.split("#")[1];
            var pageScript = "";
            if (page != null) {
                pageScript = " $table.page(" + page + ").draw(false);";
            }
            $.loadPage(loadUrl, currentState.data);
        }
    },
    /**
     * 菜单树展开方法
     * menuId      菜单对应的ID
     */
    menuOpen: function menuOpen(menuId) {
        $("#menu").find(".active").removeClass("active");
        $("#"+menuId).parent('li').addClass('active').siblings().removeClass('active');
        var parentId = '#show-'+menuId.slice(0,2);
        $(parentId).children('span').eq(1).removeClass('right-arrow').addClass('down');
        var ue = $(parentId).next().children('li');
        var uHeight = ue.length*40+'px';
        $(parentId).next().addClass('show').animate({
            height: uHeight
        })
    }
});

/*
 *加载变换内容，主要url参数为dom对象，并且该dom中的url放在href中，
 *调用方式如：<span onclick="javascript:load(this);" href="/backstage/website/test.html">测试</span>
 *注意：1.该dom对象最好不要用a标签，因为点击a标签会进入href指定的页面
 *      2.要加载的内容要用 id="content" 标注，因为load中指明了加载页面中指定的id为content下的内容
 *    3.对应页面的JavaScript写在content下
 */
function load(url, data) {
    // url
    var urlStr = $(url).attr("href");
    var menuId = sessionStorage.show;//菜单ID
    if(menuId=='show-all'){
        $('#tree').css('display','block');
    }else{
        $('#tree').css('display','none');
    }
    $.pushState(urlStr, menuId, data);
    // 加载对应URL页面
    $.loadPage($(url).attr("href"), data);
}

/*
 浏览器前进后退触发事件
 */
$.popState();

/*
 * 浏览器刷新事件
 */
$(function () {
    //  $.refresh();
});