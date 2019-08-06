<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (hash("ripemd128", $_POST["password"]) == "b2ec03506e48c9cce4a60990ae8860df") { //Check password
    
    
    
    //Get all the information from POST
    
    //Get array of changed files, which has the OLDNAME and the NEWNAME
    $changes = $_POST["order"];
    
    updateDB($changes);
} else {
    echo 'Wrong password!';
    return false;
}

function updateDB($o) {
    foreach ($o as $item) {
        rename("../art/" . $item[0], "../art/" . $item[1]);
        rename("../art/thumbnails/" . $item[0], "../art/thumbnails/" . $item[1]);
    }
}

?>