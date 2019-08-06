<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$directory = "art";
$filenames = glob($directory . "/*.{png,jpg,mp4,MP4}", GLOB_BRACE);

$images = array();

foreach($filenames as $image)
{
    $images[] = array($image);
}
echo json_encode($images);

?>