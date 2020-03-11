//不同语言
var zh =
    '{"h2_start":"测试","text_start":"在成为正式玩家之前请回答题目。</br>注意！你仅有120分钟的答题时间。</br>满分150，答对<strong>总题数的3/5</strong>即80分即可","h2_end":"非常棒，你完成了测试。","text_end":"谢谢。请输入你的Xbox ID并等待我们的回复！","leave_warning":"您离开答题页面时间过长，页面已自动关闭，请手动刷新以重新开始","timeOut_warning":"时间到，终止答题，答题页面已自动关闭，请手动刷新以重新开始","title_warning":"答题过程中请勿离开页面","notice_warning":"注意！您已经离开答题页面！离开5秒后页面将自动关闭！这将不会保存您的任何记录！请马上回到答题页面！"}';
var en =
    '{"h2_start":"TEST","text_start":"Please answer the questions to be a formal player.</br>Be careful! You only have 120 minutes to answer questions.</br>150 points out of 80 passes, only need to answer <strong>less than 3/5</strong> to pass","h2_end":"Great.That is all.","text_end":"Thank you. Please input your Xbox ID and wait for our reply.","leave_warning":"You have been away from the TEST page for too long. The page has been closed automatically. Please refresh manually to start again.","timeOut_warning":"The time is up. Stop answering. The TEST page has been closed automatically. Please refresh manually to start again.","title_warning":"Do not leave the page during the TEST","notice_warning":"Be careful! You have left the TEST page! The page will close automatically after 5 seconds! This will not save any of your records! Please go back to the TEST page now!"}';

var lang = navigator.language || navigator.userLanguage; //获取浏览器语言
lang = (lang).toLowerCase();
lang = lang.substr(0, 2);
if (lang == "zh") { //根据语言加载json
    language = JSON.parse(en);
} else {
    language = JSON.parse(en);
}

window.onload = function () { //开始填入文字
    document.getElementById("h2").innerHTML = language.h2_start;
    document.getElementById("text").innerHTML = language.text_start;
    if (Notification.permission != "granted") {
        Notification.requestPermission();
    } //请求获取用户通知权限
}

var obj; //全局声明题目json对象

//加载题目和随机抽题次序并定义所以变量
function start() {
    var url = "./lib/js/exam_" + lang + ".json" //加载对应json
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null); //不发送数据到服务器
    request.onload = function () {
        if (request.status == 200) { //服务器返回值200,加载成功
            obj = JSON.parse(request.responseText); //字符串转json对象
        }
        ;
        //随机顺序
        out = []; //全局声明记录抽取题目顺序的数组
        var arr = new Array(obj.length);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
        ;
        while (arr.length) {
            var e = parseInt(Math.random() * arr.length);
            out = out.concat(arr.splice(e, 1));
        }
        ;
        log = {}; //全局声明保存用户选择的json对象
        //开始前声明题目和次序为0
        x = 0;
        num = 0;
        answer = null; //声明默认空回答值
        load();
        //隐藏起始页显示答题页
        document.querySelector("header").style.display = "none";
        document.querySelector("main").style.display = "inline";
        countDown(); //开始倒计时
    }
}

//End按钮
function end() {
    var recaptcha_response = grecaptcha.getResponse();
    if (recaptcha_response.length == 0 || recaptcha_response == null) {
        alert("Please finish the reCAPTCHA\n请完成reCAPTCHA人机验证");
    } else {
        log.XboxId = document.getElementById("XboxId").value; //记录用户XboxId
        log.recaptcha = grecaptcha.getResponse();
        log = JSON.stringify(log); //完成答题后转换json记录为字符串
        console.log(log);
        var request = new XMLHttpRequest();
        request.open("post", "./api.php", true);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send("answer=" + log);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response_json = JSON.parse(request.responseText);
                console.log(response_json);
                if (response_json.result == "failed") {
                    document.getElementById("submit_hero").innerHTML = "<h1>You haven't passed the exam 你没有通过测试</h1>";
                } else {
                    if (response_json.result == "success") {
                        document.getElementById("submit_hero").innerHTML = "<h1>You have passed the exam 你通过了测试</h1>";
                    }
                }
            }
        }
    }
}

//Next按钮
function next() {
    log[num + 1] = answer; //确认记录当前回答于log
    answer = null; //回答值清空
    x++; //下一题
    if (x != obj.length) {
        load(); //加载题目
    } else {
        finish(); //完成所有题目
    }
}

//未确认前记录活跃选项
function choose(option) {
    answer = 'a' + option; //传递用户活跃选项
    //改变活跃选项样式
    document.getElementById(option).classList.add("bg-dark");
    document.getElementById('a' + option).classList.add("text-light");
    //移除其余选项样式
    var other = ['1', '2', '3', '4'].filter(function (v) {
        return !([option].indexOf(v) > -1)
    });
    for (var i = 0; i < 3; i++) {
        var o = other[i];
        document.getElementById(o).classList.remove("bg-dark");
        document.getElementById('a' + o).classList.remove("text-light");
    }
    ;
}

//加载题目
function load() {
    num = out[x]; //题号
    document.getElementById("q").innerHTML = obj[num].q; //获取并填充题目问题
    for (var i = 1; i < 5; i++) {
        var a = 'a' + i; //获取并填充题目四选项
        document.getElementById(a).innerHTML = obj[num][a];
        //清除上一次选择样式
        document.getElementById(i).classList.remove("bg-dark");
        document.getElementById(a).classList.remove("text-light");
    }
    ;
}

//完成所有题目
function finish() {
    clearInterval(countDown); //停止倒计时
    document.querySelector("header").style.display = "inline"; //显示起始页
    document.querySelector("main").style.display = "none"; //隐藏答题页
    //填入文字
    document.getElementById("h2").innerHTML = language.h2_end;
    document.getElementById("text").innerHTML = language.text_end;
    //更改按钮定义
    document.getElementById("btn").innerHTML = "End";
    document.getElementById("btn").removeAttribute("onclick");
    document.getElementById("btn").setAttribute("onclick", "end()");
    //显示输入栏
    document.getElementById("recaptcha").style.visibility = "visible";
    document.getElementById("XboxId").style.display = "inline";
}

/*----------下面是防作弊部分----------*/

//屏蔽鼠标右键
window.oncontextmenu = function (e) {
    e.preventDefault();
}

//移动端屏蔽长按菜单
window.ontouchstart = function (e) {
    e.preventDefault();
}
var wait;
// window 失去焦点
window.onblur = function () {
    if (x != obj.length) {
        title = document.title; //记录标题
        var notification = new Notification("EarthMCBE TEST", {
            body: language.notice_warning,
            icon: 'favicon.ico',
            vibrate: [200, 100, 200]
        }); //发出通知提示
        document.title = language.title_warning; //页面标题提示
        time = 5; //设置倒计时5秒
        wait = setInterval(function () { //页面失去焦点倒计时
            if (time == 0) { //倒计时结束
                clearInterval(wait); //删除倒计时
                document.querySelector("body").innerHTML = "<strong>" + language.leave_warning +
                    "</strong>"; //清除页面
            } else {
                time--; //时间减1
            }
        }, 1000); //每1000毫秒执行1次
    }
    ;
}

// window 获得焦点
window.onfocus = function () {
    clearInterval(wait); //删除倒计时
    document.title = title; //恢复标题
}

//答题2小时倒计时
function countDown() {
    var countDown = setInterval(
        function () {
            clearInterval(countDown); //清除倒计时
            document.querySelector("body").innerHTML = "<strong>" + language.timeOut_warning + "</strong>"; //清除页面
        }, 7200000);
}

//关闭页面提示
window.onbeforeunload = function (e) {
    var e = window.event || e;
    e.returnValue;
}