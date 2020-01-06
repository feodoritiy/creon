<?php

ob_start(); //start buffering

require './Parsedown.php';

require './parts/head.php';

$parsedown = new Parsedown();

$parsed = $parsedown->text(file_get_contents('./markdown/docs.md'));

require './parts/main-part.php';

require './parts/foot.php';

$target_folder = '../../docs/';

echo is_string($page = ob_get_contents());
file_put_contents($target_folder . 'index.html', $page);
chmod($target_folder . 'index.html', 0777);

$cssDir = scandir('./css');

foreach ($cssDir as $i => $filename) {
    if (is_file('./css/' . $filename)) {
        copy('css/' . $filename, $target_folder . 'css/' . $filename);
        chmod($target_folder . 'css/' . $filename, 0777);
    }
}

copy('js/index.js', $target_folder . 'js/index.js');
chmod($target_folder . 'js/index.js', 0777);
