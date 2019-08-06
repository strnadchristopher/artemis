/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fileList = new Array();
var selectedImage;
var currentSection;
var imageSelected = false;
$(document).ready(function ()
{
    //Cookies.remove('password')

    if (Cookies.get('password')) { //If password is set
        //Test password
        $.ajax({
            type: "POST",
            url: "../testPassword.php",
            data: {password: Cookies.get('password')},
            success: function (data) {
                if (data == "Good") {
                    $('body').css('display', "flex");
                    $("#password").val(Cookies.get('password'))
                } else {
                    Cookies.remove('password');
                    location.reload(true);
                }
            }
        });
    } else {
        var pass = prompt("Enter password");
        Cookies.set('password', pass);
        location.reload(true);
    }




    $("#user").change(function () {
        update();
    });
    $("#section").change(function () {
        update();
    });
    $('html').keyup(function (e) {
        //alert(selectedImage);
        if (e.keyCode === 46) {
            e.preventDefault();
            $("#deleteButton").click();
        }
    });

    // handles the click event, sends the query
    var update = function () {
        currentSection = $("#section").val();
        $.ajax({
            url: '../getArt.php',
            type: "POST",
            dataType: "json",
            data: {},
            success: function (response) {
                fileList = response;
                fileList.sort();
                fillGallery();
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert("Message: " + msg);
            }
        });
    };

    var highlightedImage;

    //Gallery
    function fillGallery()
    {
        $("#galleryGrid").empty();
        imageSelected = false;
        var imgN = 0;
        //alert(galleryImages[imgN][0])
        $.each(fileList, function (index, value) {
            if (~fileList[index][0].indexOf($("#section").val())) { //Fills the gallery with every image that starts with the current section
                var extension = value.toString().substr((value.toString().lastIndexOf('.') + 1));
                if (extension != "mp4" && extension != "MP4") { //If not a video
                    $("#galleryGrid").append("<img data-position='" + imgN + "' class='galleryImage' src='../" + value + "'/>");
                } else {
                    $("#galleryGrid").append("<video autoplay loop data-position='" + imgN + "' class='galleryImage' src='../" + value.toString() + "'/>");
                }
                imgN++;
            }
        });
        $("#galleryGrid *").click(function () {
            $("#galleryGrid *").each(function (i) {
                highlightedImage = i;
                $(this).css("border", "black solid 2px");
            });
            $(this).css("border", "red solid 2px");
            selectedImage = $(this).attr("src");
            imageSelected = true;
        });
    }

    $("#fileUploadLabel").click(function (e) { //On Form Submit
        e.preventDefault();
        var order = [];
        var re = /(?:\.([^.]+))?$/;
        var dt = new Date();
        var time = dt.getTime();
        $("#galleryGrid").children().each(function (index) { //Create array in new order
            var oldname = "";
            oldname = $(this).attr("src").toString();
            oldname = oldname.substring(7);
            var ext = re.exec(oldname)[1]; //Get File Extension
            var newname = currentSection + "_" + (time + index) + "." + ext; //Set new name (section_datetime.png)
            order.push([oldname, newname]);
        });
        updateDatabase(e, order);
    });


    function updateDatabase(e, o) {
        e.preventDefault();
        e.stopPropagation();
        $.ajax({
            url: 'update.php',
            type: "POST",
            data: ({password: $("#password").val(), order: o}),
            success: function (response) {
                alert("Order changed!");
                location.reload(true);
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert("Message: " + msg);
            }
        });
    }

    function confirmDelete() {
        if (selectedImage !== "") {
            if (confirm("Do you really wanna delete " + selectedImage + "?")) {
                deleteFile();
            } else {
            }
        } else {
            alert("Please select an image");
        }
    }

    function deleteFile() {
        $.ajax({
            url: 'delete.php',
            type: "POST",
            data: ({password: $("#password").val(), file: selectedImage}),
            success: function (data, textStatus, jqXHR) {
                //alert(response);
                location.reload(true);
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert("Message: " + msg);
            }
        });
    }

    $("#galleryGrid").sortable().disableSelection();

    var configData = [];
    var sections = [];

    function readConfig() {
        $.get("../config.txt", function (result) {
            configData = result.split(";");
            sections = configData[0].split("/");
            $.each(sections, function (i) {
                var o = new Option(sections[i], sections[i]);
                /// jquerify the DOM object 'o' so we can use the html method
                $(o).html(sections[i]);
                $("#section").append(o);
            });
            update();
        });
    }
    
    readConfig();

    function updateConfig() {
        //Call PHP script that writes file
        //alert(configData);
        var dataString = "";
        $.each(configData, function (i) {
            dataString += configData[i] + ";";
        });
        dataString = dataString.substring(0, dataString.length - 1);
        $.post("updateConfig.php", {password: $("#password").val(), configData: dataString}, function (data) {
            alert(data);
        });
        location.reload(true);
    }

    $("#removeSection").click(function () {
        if (confirm("Are you sure you want to get rid of everything under " + currentSection + "?")) {
            configData[0] = "";
            $.each(sections, function (i) {
                configData[0] += sections[i] + "/";
            });
            configData[0] = configData[0].replace(currentSection.toString() + "/", "");
            configData[0] = configData[0].substring(0, configData[0].length - 1);
            updateConfig();
        }
    });

    $("#addSection").click(function () {
        var sectionName = prompt("Section name:");
        if (sectionName != null) {
            if (sectionName != "contact") {
                sections.push(sectionName);
                configData[0] = "";
                $.each(sections, function (i) {
                    configData[0] += sections[i] + "/";
                });
                configData[0] = configData[0].substring(0, configData[0].length - 1);
                updateConfig();
            } else {
                alert("Sorry, you can't name it 'Contact', anything else is cool though.");
            }
        }
    });

    $("#aboutTextBtn").click(function () {
        configData[1] = prompt("New About Text:");
        if (configData[1].length > 0) {
            if (confirm("Are you sure you want to change your about text to '" + configData[1] + "'?")) {
                updateConfig();
            }
        } else {
            alert("Field cannot be empty.");
        }
    });

    $("#bgColorBtn").click(function () {
        configData[2] = prompt("New Background Color Hexcode: (Default is #FFFFFF)");
        if (configData[2] !== "") {
            if (!~configData[2].indexOf("#")) {
                configData[2] = "#" + configData[2];
            }
            updateConfig();
        } else {
            alert("Field cannot be empty.");
        }
    });

    $("#textColorBtn").click(function () {
        configData[3] = prompt("New Text Color Hexcode: (Default is #000000)")
        if (configData[3] !== "") {
            if (!~configData[3].indexOf("#")) {
                configData[3] = "#" + configData[3];
            }
            updateConfig();
        } else {
            alert("Field cannot be empty.");
        }
    });

    $("#deleteButton").click(function () {
        if (imageSelected) {
            if ($("#password").val() !== "") {
                confirmDelete();
            } else {
                alert("Password first please!");
            }
        } else {
            alert("Pick an image by clicking on it first!.");
        }
    });

    $("#commissionsBtn").click(function () {
        configData[4] = prompt("To switch between open commissions and closed commissions, enter 'enable' or 'disable'.").toLowerCase();
        if (configData[4].length > 0 && (configData[4] == 'enable' || configData[4] == 'disable')) {
            if (confirm("Are you sure you want to " + configData[4] + " commissions?")) {
                updateConfig();
            }
        } else {
            alert("You must enter enable or disable, without quotes.");
            location.reload(true);
        }
    })

    $("#changeEmailBtn").click(function () {
        var newEmail = prompt("Enter a new email address").toLowerCase();
        if (newEmail.length > 0 && newEmail.indexOf("@") > 0) {
            if (confirm("Are you sure you want to update your email to '" + newEmail + "'?")) {
                configData[5] = newEmail;
                updateConfig();
            }
        } else {
            alert("Cannot be empty, and must be a valid email address.");
        }
    });
});