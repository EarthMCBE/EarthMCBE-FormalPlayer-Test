//判断浏览器语言
var lang = navigator.language || navigator.userLanguage;
lang = (lang).toLowerCase();
lang = lang.substr(0, 2);
if (lang != "zh") {
    lang = "en"
};

var obj;

//加载题目和随机抽题次序并定义所以变量
function start() {
    var url = "./lib/js/exam_" + lang + ".json" //加载对应json
    var request = new XMLHttpRequest();
    request.open("get",url);
    request.send(null); //不发送数据到服务器
    request.onload = function () {
        if (request.status == 200) {//服务器返回值200,加载成功
            obj = JSON.parse(request.responseText);//字符串转json对象
        };
        out = []; //全局声明记录抽取题目顺序的数组
        //随机顺序
        var arr = new Array(obj.length);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = i;
        };
        while (arr.length) {
            var e = parseInt(Math.random() * arr.length);
            out = out.concat(arr.splice(e, 1));
        };
        log = {}; //全局声明保存用户选择的json对象
        //开始前声明题目和次序为0
        x = 0;
        num = 0;
		answer = null;//声明默认空回答值
		next();//进入答题
    }
}

function choose(choose){//未确认前记录活跃选项
	answer = choose;
}

function next() {
    if (num < obj.length) {
        x++;//进入下一题
        num = out[x];
        document.getElementById("q").innerHTML = obj[num].q;//获取并填充题目问题
        for (var i = 1; i < 5; i++) {
            var a = 'a' + i;//获取并填充题目四选项
            document.getElementById(a).innerHTML = obj[num][a];
        };
        log[num + 1] = answer;//确认记录当前回答于log
		answer = null;//回答值清空
    } else {
        log = JSON.stringify(log);//完成答题后转换json记录为字符串
        alert("结束");
        console.log(log);
    }
}

//屏蔽鼠标右键
window.oncontextmenu = function (e){
	e.preventDefault();
}

//移动端屏蔽长按菜单
window.ontouchstart = function (e) {
    e.preventDefault();
}
