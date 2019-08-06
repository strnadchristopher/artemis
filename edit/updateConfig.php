<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


if (hash("ripemd128", $_POST["password"]) == "b2ec03506e48c9cce4a60990ae8860df") { //Check password
    $data = $_POST["configData"];
    file_put_contents("../config.txt", "");
    if(file_put_contents("../config.txt", $data)){
        echo "Updated successfully!";
    }else{
        echo "Something went wrong. Please try again later. If that doesn't work, let your developer know.";
    }
}else{
    echo "Wrong password";
}
?>