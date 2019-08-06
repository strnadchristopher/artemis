<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (hash("ripemd128", $_POST["password"]) == "b2ec03506e48c9cce4a60990ae8860df") {

    //Get all the information from POST
    $file = $_POST["file"];
    unlink($file);
    $fileBig = explode("/", strval($file));
    unlink("../art/thumbnails/" . $fileBig[2]);
} else {
    echo 'Wrong password!';
    return false;
}

?>