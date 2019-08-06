/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var configData = [];
var targetEmail;

function readConfig() {
    $.get("../config.txt", function (result) {
        configData = result.split(";");
        sections = configData[0].split("/");
        sections.push("contact");
        //Do Stuff with Config Data

        $.each(sections, function (i) {
            $(".link").append('<span class="sectionButton" id="' + sections[i].toString() + '">' + sections[i].toString().replace("-", " ") + '</span>');
            if (i < sections.length - 1) {
                $(".link").append(" | ");
            }
        });

        if (configData[4] !== "enable") { //If commissions aren't open right now.
            $("body").css("display","none");
        } else {
            $("#contact").html("contact + commissions");
        }
        
        targetEmail = configData[5];
        
    });
}

readConfig();



var currentImage = 0;
var interval;
var timer = function () {
    interval = setInterval(function () {
        nextImage();
    }, 5000);
};
loadSlides();

function nextImage() {
    $("#backgroundImage").css("background-image", "url('../" + slideshowImages[currentImage] + "')");
    currentImage++;
    if (currentImage >= slideshowImages.length) {
        currentImage = 0;
    }
}

var slideshowImages = new Array();
function loadSlides() {
    $.ajax({
        url: '../getArray.php',
        type: 'post',
        data: {section: "illustrations", shuffle: true},
        success: function (data, status) {
            slideshowImages = data;
            nextImage();
            timer(); //Start the timer for the slideshow
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        },
        dataType: "json"
    }); // end ajax call
}

//Show style window
$("#descriptionPanel").css("display", "block");

var description;
//Description
$('#descriptionBox').bind('input propertychange', function () {
    $("#descNext").html("Next");
    $("#descNext").css("background-color", "white").css("cursor", "pointer").css("color", "black")
            .css("width", "80%").css("height", "50px");
});

//Enter key for textarea
$("#descriptionBox").keypress(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 && $("#descNext").html() === "Next") {
        $("#descNext").trigger('click');
        return true;
    }
});

//Description to ref
$("#descNext").click(function () {
    description = $("#descriptionBox").val();
    $("#descriptionPanel").animate({opacity: 0}, function () {
        $("#descriptionPanel").css("display", "none");
        $("#refPanel").css("opacity", "0");
        $("#refPanel").css("display", "block");
        $("#refPanel").animate({opacity: 1});
        $("#refBox").focus();
    });
});

var refs;
//Refs
$('#refBox').bind('input propertychange', function () {
    $("#refNext").html("Next");
    $("#refNext").css("background-color", "white").css("cursor", "pointer").css("color", "black")
            .css("width", "80%").css("height", "50px");
});

//Enter key for textarea
$("#refBox").keypress(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 && $("#refNext").html() === "Next") {
        $("#refNext").trigger('click');
        return true;
    }
});

//Ref to send
$("#refNext").click(function () {
    refs = $("#refBox").val();
    $("#refPanel").animate({opacity: 0}, function () {
        $("#refPanel").css("display", "none");
        $("#sendPanel").css("opacity", "0");
        $("#sendPanel").css("display", "block");
        $("#sendPanel").find('textarea').css("height", "5vh").css("font-size", "4vh");
        $("#sendPanel").animate({opacity: 1});
        $("#emailBox").focus();
    });
});

var email;
//Send & Email
$('#emailBox').bind('input propertychange', function () {
    $("#finish").html("Finish and Send");
    $("#finish").css("background-color", "white").css("cursor", "pointer").css("color", "black")
            .css("width", "80%").css("height", "50px");
});

//Enter key for textarea
$("#emailBox").keypress(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13 && $("#finish").html() === "Finish and Send") {
        e.preventDefault();
        $("#finish").click();
    }
});

//Send to sent
$("#finish").click(function () {
    email = $("#emailBox").val();
    if (email.length > 0 && email.indexOf("@") > 0) {
        sendEmail();
    }else{
        alert("Cannot be empty, and must be a valid email address.");
    }
});

$("#home").click(function () {
    location.href = "../";
});

function sendEmail() {
    var message = "New commission request! [Description]: " + description +
            ". [References]: " + refs +
            ". [Email]: " + email;
    $.ajax({
        url: 'sendCommission.php',
        type: 'post',
        //data: "{'message':'" + message + "'}",
        data: {message: message, email: email, artistEmail: targetEmail},
        async: false,
        datatype: 'text',
        success: function (data, textStatus, jqXHR) {
            //alert("Email sent successfully! Data: " + data + ". Text Status: " + textStatus + ". jqXHR: " + jqXHR + ".");
            $("#finalMessage").html("Commission request has been sent! We'll get back to you as soon as we can!");
        },
        error: function (jqXHR, textStatus, errorMessage) {
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
            //alert("Message " + msg + ". Error Message: " + errorMessage);
            $("#finalMessage").html("Something didn't work right and the email couldn't send. Please send your message to averycooper1998@gmail.com");
            $("#backupMessage").val(message);
            $("#backupMessage").css("display", "block");
        },
        complete: function () {
            $("#sendPanel").animate({opacity: 0}, function () {
                $("#sendPanel").css("display", "none");
                $("#sentPanel").css("opacity", "0");
                $("#sentPanel").css("display", "flex");
                $("#sentPanel").animate({opacity: 1});
                $("#home").css("background-color", "white").css("cursor", "pointer").css("color", "black")
                        .css("width", "100px").css("height", "50px");
            });
        }
    });
}