<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
if (hash("ripemd128", $_POST["password"]) == "b2ec03506e48c9cce4a60990ae8860df") { 
//Check password     //Upload image
    if (isset($_FILES["image"])) {
        if ($_POST["makeHeader"] == "true") {
            echo "Setting header!";
            uploadImage("../logo.png", $_FILES["image"]);
        } else if ($_POST["makeAbout"] == "true") {
            echo "Setting About image";
            uploadImage("../aboutImage.png", $_FILES["image"]);
        } else if ($_POST["makeCBG"] == "true") {
            echo "Setting About image";
            uploadImage("../cBackground.png", $_FILES["image"]);
        } else {
            //Get data from selects
            if (isset($_POST["name"])) {
                $name = $_POST["name"];
            } else {
                $name = "Untitled";
            }
            $section = $_POST["section"];

            $temp = explode(".", $_FILES["image"]["name"]);

            //add tags system

            $newfilename = $section . '_' . round(microtime(true)) . '.' . end($temp);
            $_FILES["image"]['name'] = $newfilename;
            $fileName = $_FILES["image"]["name"];
            $uploadLocation = "../art/" . $fileName;
            uploadImage($uploadLocation, $_FILES["image"]);
            if (end($temp) != "mp4" && end($temp) != "MP4") { //Create Thumbnail if not a video
                uploadThumbnail($uploadLocation, $fileName);
            }else{
                touch("../art/thumbnails/" . $fileName);
            }
        }
    } else {
        echo 'You gotta choose a file dude.';
        return false;
    }
} else {
    echo 'Wrong password!';
    return false;
}

function uploadImage($target_file, $uploadFile) {
    echo 'Attempting to upload image! ';
    if (move_uploaded_file($uploadFile["tmp_name"], $target_file)) {
        echo "The file " . basename($uploadFile["name"]) . " has been uploaded!\n";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

function uploadThumbnail($imageLocation, $fileName) {
    $file = $imageLocation;
    echo "File: " . $file;
    $source_properties = getimagesize($file);
    echo "Source Properties: " . $source_properties;
    $image_type = $source_properties[2];

    $src_img = imagecreatefromjpeg($file);

    if ($image_type == IMAGETYPE_JPEG) {
        $image_resource_id = imagecreatefromjpeg($file);
        $target_layer = fn_resize($image_resource_id, $source_properties[0], $source_properties[1]);
        touch("../art/thumbnails/" . $fileName);
        imagejpeg($target_layer, "../art/thumbnails/" . $fileName);
        echo "Thumbnail generated";
    } elseif ($image_type == IMAGETYPE_GIF) {
        $image_resource_id = imagecreatefromgif($file);
        $target_layer = fn_resize($image_resource_id, $source_properties[0], $source_properties[1]);
        touch("../art/thumbnails/" . $fileName);
        imagegif($target_layer, "../art/thumbnails/" . $fileName);
        echo "Thumbnail generated";
    } elseif ($image_type == IMAGETYPE_PNG) {
        $image_resource_id = imagecreatefrompng($file);
        $target_layer = fn_resize($image_resource_id, $source_properties[0], $source_properties[1]);
        touch("../art/thumbnails/" . $fileName);
        imagepng($target_layer, "../art/thumbnails/" . $fileName);
        echo "Thumbnail generated";
    }
}

function fn_resize($image_resource_id, $width, $height) {

    $imageWidth = imageSX($image_resource_id);
    $imageHeight = imageSY($image_resource_id);

    //$minHeight = 360;
    //Find best size
    //$sizeMod = 2;
    //$target_width = imageSX($image_resource_id) / $sizeMod; //Cut size in half
    //$target_height = imageSY($image_resource_id) / $sizeMod;


    $target_height = 700;
    $sizeMod = $imageHeight / $target_height;
    $target_width = $imageWidth / $sizeMod;



    $target_layer = imagecreatetruecolor($target_width, $target_height);
    imagecopyresampled($target_layer, $image_resource_id, 0, 0, 0, 0, $target_width, $target_height, $width, $height);
    return $target_layer;
}

?>