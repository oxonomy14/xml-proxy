<?php
$url = "https://vipchanger.com/res/xml/exprates.xml";
$file = "exprates.xml";

$options = [
    "http" => [
        "header" => "User-Agent: Mozilla/5.0"
    ]
];

$data = file_get_contents($url, false, stream_context_create($options));

if ($data) {
    file_put_contents($file, $data);
    echo "Файл загружен!";
} else {
    echo "Ошибка загрузки.";
}
?>
