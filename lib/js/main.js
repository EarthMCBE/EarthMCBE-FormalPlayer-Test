var obj;
var num = 0;
var answer = {};

window.onload = function main() {
	var url = "./lib/js/qa.json"
	var request = new XMLHttpRequest();
	request.open("get", url); 
	request.send(null); 
	request.onload = function () { 
	    if (request.status == 200) {
			obj =  JSON.parse(request.responseText);
		}
	}
}


function next(a){
	if(num<obj.length-1){
	num++;
	document.getElementById("q").innerHTML = obj[num].q;
	for(var i=1;i<5;i++){
		var x = 'a'+i;
		document.getElementById(x).innerHTML = obj[num].x;
		};
	console.log(x);
	console.log(document.getElementById(x));
	console.log(obj[num].a1);
	console.log(obj[num].x);
	answer.num = a;
	} else {
		alert("结束");
		answer = JSON.stringify(answer);
		console.log(answer);
	}
}