var all;
var session = getSession();

window.onload = function() {
    var detail;
    var readertype;
    $.ajax({
        type: "GET",
        url: "http://api.xiyoumobile.com/xiyoulibv2/user/info",
        dataType: "jsonp",
        jsonpCallback: "handleResponse",
        data: { "session": session },
        success: function(res) {
            var result = res.Result;
            detail = res.Detail;
            // readertype = detail.ReaderType;
            if (result) {
                var info = $(".info");
                info.text(detail.Department + " " + detail.Name);
            }
        }
    })


    //可以借书的总量
    switch (readertype) {
        case "本科生":
            all = 15;
            break;
        case "老师":
            all = 20;
            break;
        default:
            all = 15;
            break;
    }
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://api.xiyoumobile.com/xiyoulibv2/user/rent",
        data: { "session": session },
        success: function(res) {
            var result = res.Result;
            var detail_rent = res.Detail;
            console.log(res);
            if (result) {
                var text = "";
                var borrowNow = 0; //已借数量
                var reBorrow = 0; //续借数量
                var surplus = 0; //剩余可借数量
                var outDate = 0; //逾期数量

                if (detail_rent == "NO_RECORD") {
                    surplus = all - borrowNow;
                    $(".blue").html(borrowNow);
                    $(".red").html(reBorrow);
                    $(".green").html(surplus);
                    $(".yellow").html(outDate);
                } else {
                    $.each(detail_rent, function(index, value) {
                        borrowNow++;
                        switch (value.State) {
                            case "本馆续借":
                                reBorrow++;
                                break;
                            case "过期暂停":
                                outDate++;
                                break;
                            default:
                                break;
                        }

                        if (value.CanRenew) {
                            text += "<div class='book'>" +
                                "<div class='bookContent'>" +
                                "<p class='book_name'>" + value.Title + "</p>" +
                                "<p class='book_time'>到期时间：" + value.Date + "</p>" +
                                "<div class='button_reborrow' nameid=" + value.Barcode + ">我要续借</div>" +
                                "</div>" +
                                "</div>";
                        } else {
                            text += "<div class='book'>" +
                                "<div class='bookContent'>" +
                                "<p class='book_name'>" + value.Title + "</p>" +
                                "<p class='book_time'>到期时间：" + value.Date + "</p>" +
                                "<p class='book_state'>状态：" +
                                "<span class='book_stateName'>本馆续借</span>" +
                                "</p>" +
                                "</div>" +
                                "</div>";
                        }
                        // $(".borrow_list").html(text);
                    })
                    $(".borrow_list").html(text);

                    surplus = all - borrowNow;
                    $(".blue").html(borrowNow);
                    $(".red").html(reBorrow);
                    $(".green").html(surplus);
                    $(".yellow").html(outDate);



                    var array = [];
                    var buttonArray = $(".button_reborrow");
                    //统计续借书籍时所需要的参数信息
                    $.each(detail_rent, function(index, value) {
                        array[index] = {
                            session: session,
                            department_id: value.Department_id,
                            library_id: value.Library_id
                        }
                    })


                    // 给续借绑定点击事件
                    $.each(buttonArray, function(index, value) {
                        $(this).click(function(event) {
                            var target = event.target;
                            var Barcode = target.getAttribute('nameid');
                            var data = array[index];
                            data.barcode = Barcode;
                            $.ajax({
                                type: "GET",
                                url: "http://api.xiyoumobile.com/xiyoulibv2/user/renew",
                                dataType: "jsonp",
                                data: data,
                                success: function(res) {

                                    if (res.Result) {
                                        var detail = res.Detail;
                                        $(event.target).parent().find('p').eq(1).replaceWith("<p class='book_time'>到期时间：" + detail + "</p>");
                                        $(event.target).replaceWith("<p class='book_state'>状态：" +
                                            "<span class='book_stateName'>本馆续借</span>" +
                                            "</p>");
                                    }
                                }
                            });
                        })
                    })
                }
            }
        }
    })


    //切换两个按钮所要展示的内容
    $(".button_borrow a").click(function() {
        $(".button_book a").css("background-color", "white");
        $(".button_borrow a").css("background-color", "rgb(234,227,234)");
        $(".search_content").css("display", "none");
        $(".content").css("display", "block");
    })
    $(".button_book a").click(function() {
        $(".button_borrow a").css("background-color", "white");
        $(".button_book a").css("background-color", "rgb(234,227,234)");
        $(".content").css("display", "none");
        $(".search_content").css("display", "block");
    })

    //调用图书检索API
    $(".search_submit").click(function() {
        var data = $(".search_text").val();
        if (!data) {
            $(".search_book").html("搜索内容为空");
        } else {
            $.ajax({
                type: "GET",
                url: "http://api.xiyoumobile.com/xiyoulibv2/book/search",
                dataType: "jsonp",
                data: { keyword: data },
                success: function(res) {
                    // console.log(res);
                    var text = "";
                    var bookList = res.Detail.BookData;
                    if (res.Detail.Amount) {
                        $.each(bookList, function(index, value) {
                            text += "<div class='book'>" +
                                "<div class='bookContent'>" +
                                "<div class='book_name1'>" +
                                "<a href='#moreInfo' code=' " + value.ID + "'>" + value.Title + "</a>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        })
                    } else {
                        text = "未查到相关信息";
                    }
                    $(".search_book").html(text);

                    //为每个书名设置详情点击事件
                    var nameInfo = $(".book_name1 a");
                    $.each(nameInfo, function(index, value) {
                        $(this).click(function(event) {
                            var target = event.target;
                            var data = target.getAttribute("code");
                            window.location.href = "moreInfo.html?id=" + data + "$session=" + session;
                        })
                    })
                }
            })
        }
    })
}

function getSession() {
    return window.location.search.substr(9);
}

//JSONP方法发送请求 添加url后面的参数
// function addUrl(url , name , value){
// 	url += (url.indexOf("?") == -1)? "?": "&";
// 	url += name +"="+ encodeURIComponent(value);
// 	return url;
// }

// //调用info接口后的回调函数
// function handleResponse(res){
// 	var result = res.Result;
// 	detail = res.Detail;
// 	// readertype = detail.ReaderType;
// 	if(result){
// 		var info = $(".info");
// 		info.text(detail.Department +" "+ detail.Name);
// 	}
// }

// //调用rent接口后的回调函数
// function handleResponse1(res){
// 	var result = res.Result;
// 	var detail_rent = res.Detail;
// 	if(result){
// 		var text="";
// 		var borrowNow = 0;	//已借数量
// 		var reBorrow = 0;	//续借数量
// 		var surplus = 0; 	//剩余可借数量
// 		var outDate = 0;	//逾期数量

// 		if(!detail_rent){
// 			text = "暂无借阅书籍";
// 		}
// 		else{
// 			$.each(detail_rent , function(index , value){
// 				borrowNow++;
// 				switch(value.State){
// 					case "本馆续借":
// 						reBorrow++;
// 						break;
// 					case "过期暂停":
// 						outDate++;
// 						break;
// 					default:
// 						break;
// 				}

// 				if(value.CanRenew){
// 					text+="<div class='book'>"+
// 							"<div class='bookContent'>"+
// 								"<p class='book_name'>" +value.Title+ "</p>"+
// 								"<p class='book_time'>到期时间：" +value.Date+ "</p>"+
// 								"<a class='button_reborrow' nameid=" + value.Barcode + ">我要续借</a>"+
// 							"</div>"+
// 						"</div>";
// 				}
// 				else{
// 					text+="<div class='book'>"+
// 							"<div class='bookContent'>"+
// 								"<p class='book_name'>" +value.Title+ "</p>"+
// 								"<p class='book_time'>到期时间：" +value.Date+ "</p>"+
// 								"<p class='book_state'>状态："+
// 									"<span class='book_stateName'>本馆续借</span>"+
// 								"</p>"+
// 							"</div>"+
// 						"</div>";
// 				}
// 				// $(".borrow_list").html(text);
// 			})
// 			$(".borrow_list").html(text);

// 			surplus = all - borrowNow;
// 			$(".blue").html(borrowNow);
// 			$(".red").html(reBorrow);
// 			$(".green").html(surplus);
// 			$(".yellow").html(outDate);



// 			var array = [];
// 			var buttonArray = $(".button_reborrow");
// 			//统计续借书籍时所需要的参数信息
// 			$.each(detail_rent , function(index , value){
// 				array[index] = {
// 					session: session,
// 					department_id: value.Department_id,
// 					library_id: value.Library_id
// 				}
// 			})


// 			// 给续借绑定点击事件
// 			$.each(buttonArray , function(index , value){
// 				$(this).click(function(event){
// 					var target = event.target; 
// 					var Barcode = target.getAttribute('nameid');
// 					var data = array[index];
// 					data.barcode = Barcode;
// 					$.ajax({
// 						type:"GET",
// 						url:"http://api.xiyoumobile.com/xiyoulibv2/user/renew",
// 						dataType:"jsonp",
// 						data:data,
// 						success:function(res){

// 							if(res.Result){
// 								var detail = res.Detail;
// 								$(event.target).parent().find('p').eq(1).replaceWith("<p class='book_time'>到期时间：" +detail+ "</p>");
// 								$(event.target).replaceWith("<p class='book_state'>状态："+
// 									"<span class='book_stateName'>本馆续借</span>"+
// 									"</p>");
// 							}
// 						}
// 					});
// 				})
// 			})
// 		}
// 	}
// }