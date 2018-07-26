window.onload = function() {

    //为foot设置切换页面
    $(".basic_info a").click(function() {
        $(this).css("backgroundColor", "rgb(234,227,234)");
        $(".content").css("display", "block");
        $(".express_info a").css("backgroundColor", "white");
        $(".content1").css("display", "none");
    })
    $(".express_info a").click(function() {
        $(this).css("backgroundColor", "rgb(234,227,234)");
        $(".content1").css("display", "block");
        $(".basic_info a").css("backgroundColor", "white");
        $(".content").css("display", "none");
    })

    var session = getSession();
    $(".exit").click(function() {
        window.location.href = "main.html?session=" + session;
    })
    var id = getID();
    // console.log(id);
    $.ajax({
        type: "GET",
        url: "http://api.xiyoumobile.com/xiyoulibv2/book/detail/id/" + id,
        dataType: "jsonp",
        data: { 'id': id },
        success: function(res) {
            // console.log(res);
            var bookInfo = res.Detail;
            var text = "";
            var title = bookInfo.Title;
            var author = bookInfo.Author;
            var page = bookInfo.Form;
            var pub = bookInfo.Pub;
            var isbn = bookInfo.ISBN;

            var price, binding;
            var img;

            if (bookInfo.DoubanInfo) {
                if (bookInfo.DoubanInfo.Images) {
                    img = bookInfo.DoubanInfo.Images.small;
                } else {
                    img = "../picture/7.png";
                }
                if (bookInfo.DoubanInfo.Price) {
                    price = bookInfo.DoubanInfo.Price;
                } else {
                    price = "暂无";
                }
                if (bookInfo.DoubanInfo.Binding) {
                    binding = bookInfo.DoubanInfo.Binding;
                } else {
                    binding = "暂无";
                }
            } else {
                price = "暂无";
                binding = "暂无";
                img = "../picture/7.png";
            }
            // console.log(img);
            text += "<div class='bookframe'>" +
                "<img src=" + img + ">" +
                "<p class='bookName'>" + title + "</p>" +
                // "<p>图书馆索书号:"+bookInfo+"</p>"+
                "<p>作者:" + author + "</p>" +
                "<p>页数:" + page + "</p>" +
                "<p>价格:" + price + "</p>" +
                "<p>装订:" + binding + "</p>" +
                "<p>出版社:" + pub + "</p>" +
                // "<p>出版日期:"+bookInfo+"</p>"+
                "<p>标准号:" + isbn + "</p>" +
                "</div>";
            $(".bookBorder").html(text);

            $(".num_left span").text(bookInfo.Avaliable);
            $(".num_right span").text(bookInfo.Total);

            var array = bookInfo.CirculationInfo;
            var text1 = "";
            $.each(array, function(index, value) {
                if (value.Status == "本馆借出") {
                    text1 += "<div class='bookContent' id='red'>" +
                        "<p>索书号:" + value.Sort + "</p>" +
                        "<p>状态:" + value.Status + "</p>" +
                        "<p>所在书库:" + value.Department + "</p>" +
                        "<p>应还日期:" + value.Date + "</p>" +
                        "</div>";
                } else {
                    text1 += "<div class='bookContent' id='blue'>" +
                        "<p>索书号:" + value.Sort + "</p>" +
                        "<p>状态:" + value.Status + "</p>" +
                        "<p>所在书库:" + value.Department + "</p>" +
                        "</div>";
                }
            })
            $(".bookBorder1").html(text1);
        }
    })


}

function getID() {
    var index1 = window.location.search.indexOf("session");
    var index2 = window.location.search.indexOf("id");
    // console.log(index);
    return window.location.search.substr(index2 + 3, index1 - 5);
}

function getSession() {
    var index = window.location.search.indexOf("session");
    return window.location.search.substr(index + 8);
}