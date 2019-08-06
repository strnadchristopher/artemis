/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
                    $("#password").val(Cookies.get('password'));
                } else {
                    Cookies.remove('password');
                    location.reload();
                }
            }
        });
    } else {
        var pass = prompt("Enter password");
        Cookies.set('password', pass);
        location.reload();
    }

    $(document).delegate('textarea', 'keydown', function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(this).val($(this).val().substring(0, start)
                    + "\t"
                    + $(this).val().substring(end));

            // put caret at right position again
            this.selectionStart =
                    this.selectionEnd = start + 1;
        }
    });

    function getCSS() { //Read Custom CSS file and put it in textarea
        $.get("../custom.css", function (data) {
            $("textarea").text(data);
            $('textarea').bind('input propertychange', function () {
                window.onbeforeunload = function () {
                    return 'Are you sure you want to leave without saving your work?';
                };
            });
        });
    }

    getCSS();



    function updateCSS(dir) {
        var cssData = $("textarea").val();
        $.ajax({
            type: "POST",
            url: "updateCSS.php",
            data: {password: $("#password").val(), toUpdate: dir, cssText: cssData},
            success: function (data) {
                //alert(data);
                if (dir === "../custom.css") {
                    //alert("Custom CSS Updated");
                    window.onbeforeunload = null;
                }
            },
            error: function (data) {
                alert(data);
            }
        });
        document.getElementById('previewWindow').contentDocument.location.reload(true); //Reload preview window
    }

    function clearTest() {
        $.ajax({
            type: "POST",
            url: "updateCSS.php",
            data: {password: $("#password").val(), cssText: "", toUpdate: "test.css", clear: "true"},
            success: function (data) {
                //alert(data);
            },
            error: function (data) {
                alert(data);
            }
        });
    }
    clearTest();


    $("#testButton").click(function () {
        if ($("#password").val() != "") {
            updateCSS("test.css");
        } else {
            alert("For security reasons, you need your password.");
        }
    });

    $("#saveButton").click(function () {
        if ($("#password").val() != "") {
            if (confirm("Are you sure you want to publish your CSS? This will change the way your site looks for all visitors until you change it again.")) {
                updateCSS("../custom.css");
            }
        }else{
            alert("For security reasons, you need your password.");
        }
    });

    $("#defaultButton").click(function () {
        if ($("#password").val() != "") {
            if (confirm("Are you sure you want to completetly clear your CSS changes?")) {
                $("textarea").val("");
                clearTest();
                updateCSS("../custom.css");
            }
        }else{
            alert("For security reasons, you need your password.");
        }
    });

});