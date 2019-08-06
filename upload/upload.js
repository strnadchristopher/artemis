/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var uploading = false;
var imageData = '';
var mediaIDString = '';
var tweetText = '';
var cb = new Codebird;
$(document).ready(function () {

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

//Cookies.delete('token') reset these hoes
//Cookies.delete('secret')
//Code bird stuff
    cb.setConsumerKey("P46gwQfk1d75OKitpI14Y04Vw", "bmiIn9KEnzN8meDiIBF7rVTPh4Y0zrUhFWDZYnO3u77211ZOns");
    if (Cookies.get('token') != null) {
        $("#tweetButton").remove();
        cb.setToken(Cookies.get('token').toString(), Cookies.get('secret').toString());
        $("#testTweet").click(function () {
            $("#testTweet").remove();
            cb.__call("statuses_update", {status: "This is a test. I really hope it works."}, function (
                    reply,
                    rate,
                    err
                    ) {
                alert(reply.toString() + " " + rate.toString() + " " + err.toString());
                // ...
            });
        });
    } else { //Requre getting OAUTH
        $("#twitterPostText").remove();
        $("#tweetButton").click(function () {
            $("#tweetButton").remove();
            $("#selects").append("<h4>Opening a twitter window....please wait.<br>Follow the twitter page instructions, and enter the pin you receieve in the box below.</h4>")
            $("#selects").append("<input type='text' autocomplete='off' id='pinBox'/>");
            $("#selects").append("<button class='button' id='submitPin'>Submit Pin</button>");
            cb.__call("oauth_requestToken", {oauth_callback: "oob"}, function (
                    reply,
                    rate,
                    err
                    ) {
                if (err) {
                    console.log("error response or timeout exceeded" + err.error);
                }
                if (reply) {
                    if (reply.errors && reply.errors["415"]) {
                        // check your callback URL
                        console.log(reply.errors["415"]);
                        return;
                    }

                    // stores the token
                    cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                    // gets the authorize screen URL
                    cb.__call("oauth_authorize", {}, function (auth_url) {
                        window.codebird_auth = window.open(auth_url);
                    });
                }
            });
            $("#submitPin").click(function () {
                if ($("#pinBox").val() != '') {
                    cb.__call(
                            "oauth_accessToken",
                            {oauth_verifier: $("#pinBox").val()},
                            function (reply, rate, err) {
                                if (err) {
                                    alert("error response or timeout exceeded" + err.error);
                                }
                                if (reply) {
                                    Cookies.set('token', reply.oauth_token);
                                    Cookies.set('secret', reply.oauth_token_secret);
                                    alert('Twitter linked successfully!');
                                    location.reload(true);
                                    // store the authenticated token, which may be different from the request token (!)
                                    //cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                                }

                                // if you need to persist the login after page reload,
                                // consider storing the token in a cookie or HTML5 local storage
                            }
                    );
                } else {
                    alert("Pin box is empty. If the window didn't open, wait a few more seconds, then reload and try again.")
                }
            });
        });
    }

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
        });
    }
    readConfig();

    $('#submitButtonLabel').click(function (e) { //Upload button has been pressed
        e.preventDefault();
        e.stopPropagation();
        if (!uploading) {
            uploading = true;
            if ($("#password").val() !== "") { //makes sure the password field is filled
                if ($("#tweetText").val() == "" && $("#twitterCheck").prop('checked') && !makeHeader && !makeAbout && !makeCBG && extension != 'MP4' && extension != 'mp4') {
                    alert("To automatically share on twitter, write the tweet text.");
                    $("#tweetText").animateCss("tada");
                    uploading = false;
                } else {
                    uploadImage();
                }
            } else {
                uploading = false;
                alert("Password required.");
            }
        }
    });
});

function uploadImage() {
    $("#submitButtonLabel").css("background-color", "#FFDC00");
    $("#fileUploadLabel").css("display", "none");
    //Create form data
    var form = $('form')[0];
    var formData = new FormData(form);
    //ADD form data
    formData.append('password', $("#password").val());
    formData.append('image', $('input[type=file]')[0].files[0]);
    formData.append('name', $("#name").val());
    formData.append('section', $("#section").val());
    
    //Use Twitter
    var useTwitter = false;
    if ($("#twitterCheck").prop('checked')) {
        useTwitter = true;
    }
    tweetText = "";
    if ($("#tweetText").val()) {
        tweetText = $("#tweetText").val();
    }

    formData.append('makeHeader', makeHeader.toString());
    formData.append('makeAbout', makeAbout.toString());
    formData.append('makeCBG', makeCBG.toString());
    $("#selects").empty();
    $("#selects").append("<h3 class='animated slideInUp'>Uploading File...</h3>");
    //////////////////////////////////DISPLAY FORMDATA
    //for (var pair in $('input[type=file]')[0].files[0]) {
    //alert("Set: " + pair[0] + ', ' + pair[1]);
    //}


    //Ajax call
    $.ajax({
        type: "POST",
        url: "upload.php",
        processData: false,
        contentType: false,
        data: formData,
        success: function (data, textStatus, jqXHR) {
            //alert("Output: " + data); //Debug
            if (!useTwitter || makeHeader || makeAbout || makeCBG || extension == 'MP4' || extension == 'mp4') {
                $("#selects").append("<h3 class='animated slideInUp'>Done.</h3>");
                $("#submitButtonLabel").css("background-color", "#2ECC40");
                $('#submitButtonLabel').html("Click here to upload another.");
                $("#submitButtonLabel").click(function () {
                    location.reload();
                });
            } else {
                $("#selects").append("<h3 class='animated slideInUp'>File Uploaded. Posting to Twitter automatically...</h3>");
                tweetImage();
            }
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
            alert("*****ERROR MESSAGE*****  " + msg);
        },
        async: true
    });
}

function tweetImage() {
    $('#submitButtonLabel').html("Thinking...");
    var params = {
        "media_data": imageData.toString()
    };
    cb.__call(
            "media_upload",
            params,
            function (reply, rate, err) {
                // you get a media id back:
                //alert(err.error)
                mediaIDString = reply.media_id_string;
                //alert("Media Id String: " + mediaIDString);
                sendTweet();
            }
    );
}

function sendTweet() {
    cb.__call(
            "statuses_update",
            {
                media_ids: mediaIDString,
                status: tweetText
            },
            function (reply, rate, err) {
                //alert("Image posted Successfully");
                $("#submitButtonLabel").html("Click here to upload another.");
                $("#submitButtonLabel").click(function () {
                    location.reload();
                });
                $("#selects").append("<h3 class='animated slideInUp'>Image Tweeted Successfully</h3>");
            }
    );
}


var makeHeader = false;
$("#setHeader").click(function () {
    if (filePicked) {
        if (confirm("Are you sure you want to set a new header image? You may want to save the old one just in case.")) {
            makeHeader = true;
            $("#submitButtonLabel").click();
        }
    } else {
        alert("You must pick a file first.")
    }
});
var makeAbout = false;
$("#setAbout").click(function () {
    if (filePicked) {
        if (confirm("Are you sure you want to set a new about image?")) {
            makeAbout = true;
            $("#submitButtonLabel").click();
        }
    } else {
        alert("You must pick a file first.")
    }
});
var makeCBG = false;
$("#setCBG").click(function () {
    if (filePicked) {
        if (confirm("Are you sure you want to set a new commissions page background?")) {
            makeCBG = true;
            $("#submitButtonLabel").click();
        }
    } else {
        alert("You must pick a file first.")
    }
});
var filePicked = false;
var extension;
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var name = input.files[0].name;
            extension = name.toString().substr((name.toString().lastIndexOf('.') + 1));
            $("#previewImageDiv").empty();
            if (extension === "mp4" || extension === "MP4") {
                $("#previewImageDiv").append("<video autoplay id='previewImage'></video>");
            } else {
                $("#previewImageDiv").append("<img id='previewImage'/>");
            }
            $('#previewImage')
                    .attr('src', e.target.result);
            $('#fileUploadLabel').html("Choose a different image");
            imageData = e.target.result.toString().split(",")[1];
               filePicked = true;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function escapeTags(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

$("#previewImageDiv").on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
})
        .on('dragover dragenter', function () {
            $("#previewImageDiv").addClass('is-dragover');
        })
        .on('dragleave dragend drop', function () {
            $("#previewImageDiv").removeClass('is-dragover');
        })
        .on('drop', function (e) {
            $('input[type=file]')[0].value = '';
            $('input[type=file]')[0].files = e.originalEvent.dataTransfer.files;
            readURL($('input[type=file]')[0]);
        });

$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function')
                callback();
        });

        return this;
    },
});