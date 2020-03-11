<?php
include_once 'config.php';
$right_answer = array(
    "q1" => "a4",
    "q2" => "a2",
    "q3" => "a2",
    "q4" => "a4",
    "q5" => "a2",
    "q6" => "a3",
    "q7" => "a1",
    "q8" => "a1",
    "q9" => "a1",
    "q10" => "a4",
    "q11" => "a2",
    "q12" => "a3",
    "q13" => "a1",
    "q14" => "a3",
    "q15" => "a2",
    "q16" => "a4",
    "q17" => "a1",
    "q18" => "a1",
    "q19" => "a3",
    "q20" => "a4",
    "q21" => "a1",
    "q22" => "a3",
    "q23" => "a4",
    "q24" => "a2",
    "q25" => "a3",
    "q26" => "a3",
    "q27" => "a2",
    "q28" => "a1",
    "q29" => "a1",
    "q30" => "a4",
    "q31" => "a1",
    "q32" => "a2",
    "q33" => "a4",
    "q34" => "a3",
    "q35" => "a2",
    "q36" => "a1",
    "q37" => "a2",
    "q38" => "a3",
    "q39" => "a1",
    "q40" => "a2",
    "q41" => "a3",
    "q42" => "a4",
    "q43" => "a2",
    "q44" => "a3",
    "q45" => "a1",
    "q46" => "a3",
    "q47" => "a2",
    "q48" => "a3",
    "q49" => "a1",
    "q50" => "a4",
);
$mark = 0;
$data = json_decode($_POST['answer'], true);


$recaptcha_secret = "6LcPhtkUAAAAALVfG1AuNgWP6EUBVb8RE8Ll0Z35";
$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
);
$recaptcha_response = file_get_contents("https://www.recaptcha.net/recaptcha/api/siteverify?secret=$recaptcha_secret&response=$data[recaptcha]",false,stream_context_create($arrContextOptions));
$recaptcha_response = json_decode($recaptcha_response);



if ($recaptcha_response != null && $recaptcha_response->success) {
    foreach ($data as $key => $value) {
        if ($data[$key] == $right_answer['q' . $key]) {
            $mark = $mark + 3;
        }
    }
    if ($mark >= 80) {
        $response = array(
            "result" => "success",
            "mark" => $mark
        );
        echo json_encode($response);


        $api = "api/Server/ExecuteCommand";
        $url = "$base_url$api";
        $api_lower = strtolower($api);
        $token = hash(sha256, "$user/$api_lower$password");
        $username = $data[XboxId];
        function microtime_float()
        {
            list($usec, $sec) = explode(" ", microtime());
            return ((float)$usec + (float)$sec);
        }

        $t1 = microtime_float();
        $t2 = microtime(false);
        $t3 = microtime(true);
        $timestamp = (int)(microtime(true) * 1000);
//headers数组内的格式
        $headers = array();
        $headers[] = "X-Lode-Authentication:token=$token;ts=$timestamp";
        $headers[] = "Content-Type:application/json";
        $command = 'whitelist add "' . $username . '"';
        $body = array(
            "command" => "$command",
        );
        $postBody = json_encode($body);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);//设置请求头
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postBody);//设置请求体
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');//使用一个自定义的请求信息来代替"GET"或"HEAD"作为HTTP请求。(这个加不加没啥影响)
        $data = curl_exec($curl);
        $command = "whitelist reload";
        $body = array(
            "command" => "$command",
        );
        $postBody = json_encode($body);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);//设置请求头
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postBody);//设置请求体
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');//使用一个自定义的请求信息来代替"GET"或"HEAD"作为HTTP请求。(这个加不加没啥影响)
        $data = curl_exec($curl);


    } else {
        $response = array(
            "result" => "failed",
            "mark" => $mark
        );
        echo json_encode($response);
    }
} else {
    $response = array(
        "result" => "no_recaptcha"
    );
    echo json_encode($response);
}
?>