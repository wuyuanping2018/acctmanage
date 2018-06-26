
/*!
 * @name: login.js
 * @description: 登录页面js
 * @author: wuyuanping
 * @update: 2018-06-14
 */
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
//验证用户名和密码
$('#submit').click(function () {
    var uname = $('#username').val();
    var upwd = $('#password').val();
    var isRecord = $('#record').prop('checked');
    //location.href = 'gameSpeed.html';
    var unamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
    var upwdPattern = /^[a-zA-Z0-9_!@#$%^&*]{4,16}$/;
    if(uname==''||upwd==''){
        $('.msg').text('用户名或密码不能为空');
    }
    else if(unamePattern.test(uname)&&upwdPattern.test(upwd)){
        //var str = { 'cid': '2001', 'content': { 'username': uname, 'password': upwd } };
        var str = {cid: '2001', content: {username: uname, password: upwd } };
        str = JSON.stringify(str);
        $.ajax({
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            url: 'http://113.18.253.50:8080/networkManagerback/gthl/api',
            xhrFields: {
                withCredentials: true
            },
            //dataType: 'jsonp',
            //jsonp: 'callback',
            //jsonpCallback: 'callbackfunction',
            data: str,
            success: function success(data) {
                console.log(str);
                console.log(data);
                if (data.res == '0') {
                    sessionStorage.userName = uname;
                    save();
                    location.href = 'user-manage-system.html';
                } else if (data.res != 0) {
                    $('.msg').text('账号或密码错误');
                    setTimeout(function () {
                        $('.msg').text('');
                    }, 3000);
                }
            }
        });
    }else{
        $('.msg').text('请输入合法字符');
        setTimeout(function () {
            $('.msg').text('');
        }, 3000);
    }

});


$(function(){
    //console.log($.cookie('username'),$.cookie('password'),$.cookie('rmbUser'));
    if ($.cookie("rmbUser") == 'true') {
        $("#record").prop("checked", true);
        $("#username").val($.cookie("username"));
        $("#password").val($.cookie("password"));
    }


});
//记住密码
function save() {
    if ($("#record").prop("checked")) {
        var username = $("#username").val();
        var password = $("#password").val();
        $.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie
        $.cookie("username", username, { expires: 7 });
        $.cookie("password", password, { expires: 7 });
    }else{
        $.cookie("rmbUser", "false", { expire: -1 });
        $.cookie("username", "", { expires: -1 });
        $.cookie("password", "", { expires: -1 });
    }
}





