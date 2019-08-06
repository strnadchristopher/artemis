<?php

$directory = "art/";
if (!empty($_POST["section"])) {
    $section = $_POST["section"];
    $images = glob($directory . $section . "/" . "*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}", GLOB_BRACE);
} else {
    $images = array_merge(glob($directory . "characterdesign/" . "*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}", GLOB_BRACE), 
            glob($directory . "illustration/" . "*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}", GLOB_BRACE), 
            glob($directory . "fanart/" . "*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}", GLOB_BRACE));
}

if($_POST["shuffle"] === true) {
    shuffle($images);
}
echo json_encode($images);
?>