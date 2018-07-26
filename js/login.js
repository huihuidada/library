window.onload = function() {
    var session;
    $(".login").click(function() {
        var userValue = $(".input_1").val();
        var username = $(".input_1").attr("name");
        var passValue = $(".input_2").val();
        var password = $(".input_2").attr("name");
        var script = document.createElement("script");
        script.src = "https://api.xiyoumobile.com/xiyoulibv2/user/login?callback=handleResponse";

        script.src = addUrl(script.src, username, userValue);
        script.src = addUrl(script.src, password, passValue);
        document.body.insertBefore(script, document.body.firstChild);
        // $.ajax({
        // 	type:"GET",
        // 	url:"https://api.xiyoumobile.com/xiyoulibv2/user/login",
        // 	data:{username:userValue , password:passValue},
        // 	datatype:"json"
        // }).done(function(res){
        // 	if(res.Result == true){
        // 		session = res.Detail;
        // 		$(".error").text("正确");
        // 	}
        // 	else{
        // 		$(".error").text("用户名/密码输入不正确");
        // 	}
        // })
    });
}

function addUrl(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += name + "=" + encodeURIComponent(value);
    return url;
}

function handleResponse(res) {
    if (res.Result == true) {
        // $(".error").text("输入正确");
        session = res.Detail;
        window.location.href = "main.html?session=" + session;
    }
    if (res.Result == false) {
        $(".error").text("用户名/密码输入不正确");
    }
}