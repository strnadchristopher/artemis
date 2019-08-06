/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var galleryImages = new Array();
var sections = [];
var currentSection = "";
var prevSection = "";
var shadowBoxImage = 0;
var showName = false;
var goRight = false;
var totalImages;
var direction;
var animating = false;
var inFrame = false;
var comEnabled = '';

$(document).ready(function () {

    var configData = [];

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    inFrame = inIframe();

    if (inFrame) {
        $('head').append('<link rel="stylesheet" href="css/test.css" type="text/css" />');
    }

    function readConfig() {
        $.get("config.txt", function (result) {
            configData = result.split(";");
            sections = configData[0].split("/");
            currentSection = sections[0];
            prevSection = sections[0];
            sections.push("contact");
            //Do Stuff with Config Data

            $.each(sections, function (i) {
                $(".link").append('<span class="sectionButton" id="' + sections[i].toString() + '">' + sections[i].toString().replace("-", " ") + '</span>');
                if (i < sections.length - 1) {
                    $(".link").append(" | ");
                }
            });

            if (configData[4] != "enable") { //If commissions aren't open right now.
                $("#commissionLink").remove();
            }else{
                $("#contact").html("contact + commissions");
            }

            $(".sectionButton").first().addClass("selectedSection");

            $("#contactText").html(configData[1]);

            $("body").css("background-color", configData[2]);

            $("body *").css("color", configData[3]);

            $(".sectionButton").click(function () { //Switch Section
                switchSection(this);
            });
            loadGallery();
        });
    }

    readConfig();

    function loadGallery() {
        $.ajax({
            url: 'getArt.php',
            type: 'post',
            success: function (data, status) {
                galleryImages = data;
                galleryImages.sort();
                fillGallery();
            },
            error: function (xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
                alert("Error: " + err);
            },
            dataType: "json"
        });
    }

    function switchSection(link) {
        if (!animating) {
            if ($(link).attr("id") !== currentSection) {
                animating = true;
                $(".sectionButton").each(function () {
                    $(this).css("text-decoration", "none");
                });
                prevSection = currentSection;
                currentSection = "";
                $(link).css("text-decoration", "underline");
                currentSection = $(link).attr("id");
                goRight = false;
                if (sections.indexOf(prevSection) < sections.indexOf(currentSection)) { //If its going left
                    goRight = true;
                }

                var offset = $("#gallery").offset().top;
                var oldGallery = $("<div id='gallery'></div>");
                $("#gallery").children().each(function () {
                    $(this).appendTo(oldGallery);
                });
                oldGallery.css("position", "fixed");
                oldGallery.css("top", offset);
                oldGallery.css("animation-delay", "0s");
                oldGallery.appendTo($('body'));

                $("#gallery").empty();

                $("#gallery").css("animation-delay", "500ms");

                oldGallery.animateCss("fadeOut", function () {
                    oldGallery.remove();
                });
                fillGallery();
            }
        }
    }

    function fillGallery()
    {
        $("#galleryPage").scrollTop(0);
        if (currentSection === "contact" || currentSection === "contact") { //Show contact page
            $("#gallery").empty();
            $("#gallery").append($("#contactPage").clone());
            $("#gallery").children("div").css("display", "block");
            $("#gallery").css("display", "block");
            $("#gallery").animateCss("fadeIn", function () {
                animating = false;
            });
        } else { //Fill Gallery with Everything in current Section
            var imgN = 0;
            totalImages = 0;
            $.each(galleryImages, function (index, value) {
                if (~galleryImages[index][0].indexOf(currentSection)) { //Fills the gallery with every image that starts with the current section
                    totalImages++;
                    var extension = value.toString().substr((value.toString().lastIndexOf('.') + 1));
                    if (extension != "mp4" && extension != "MP4") { //If not a video
                        var thumbnailSrc = value.toString().split("/")[0] + "/thumbnails/" + value.toString().split("/")[1];
                        $("#gallery").append("<img data-position='" + imgN + "' class='galleryImage' src='" + thumbnailSrc + "'/>");
                    } else {
                        $("#gallery").append("<video autoplay loop data-position='" + imgN + "' class='galleryImage' src='" + value.toString() + "'/>");
                    }
                    imgN++;
                }
            });

            $("#gallery").append("<div id='shares'></div>");
            $("#shares").jsSocials({
                showLabel: false,
                showCount: false,
                shares: ["twitter", "facebook", "pinterest"]
            });
            
            var isMobile = false; //initiate as false
            // device detection
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
            {
                isMobile = true;
            }

            //Shadowbox
            $(".galleryImage").click(function () {
                if ($(this).prop('nodeName') == "IMG") {
                    showShadowbox(this, $(this).index());
                }
            });

            $("#gallery").css("display", "block");
            $("#gallery").animateCss("fadeIn", function () {
                animating = false;
            });
        }
    }

    var shadowBoxVisible;
    function showShadowbox(target, index) {
        shadowBoxVisible = true;
        shadowBoxImage = $(target).data('position');
        $("#overlay").empty();
        $("#overlay").css("display", "flex");
        $("#overlay").append($(target).clone().attr("src", $(target).attr("src").replace("thumbnails/", ""))
                .css("max-width", "100%")
                .css("max-height", "100%")
                .css("z-index", "5")
                .css("border", "none"));
        $.each($(".arrow"), function () {
            $(this).css("display", "flex");
        });
        $("body").css("overflow", "hidden");
    }

    function hideShadowbox() {
        shadowBoxVisible = false;
        $("#overlay").css("display", "none");
        $.each($(".arrow"), function () {
            $(this).css("display", "none");
        });
        $("body").css("overflow", "auto");
    }

    $("#overlay").click(function () {
        hideShadowbox();
    });

    $(document).keydown(function (e) {
        switch (e.which) {
            case 27:
                hideShadowbox();
                break;

            case 37: // left
                if (shadowBoxVisible) {
                    previousImage();
                } else {
                    previousSection();
                }
                break;

            case 38: // up
                break;

            case 39: // right
                if (shadowBoxVisible) {
                    nextImage();
                } else {
                    nextSection();
                }
                break;

            case 40: // down
                break;
                
            case 9:
                e.preventDefault();
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $(".arrow").click(function () {
        if ($(this).attr("id") === "leftArrow") {
            previousImage();
        } else {
            nextImage();
        }
    });
    var newImage;
    function nextImage() {
        shadowBoxImage++;
        if (shadowBoxImage >= totalImages) {
            shadowBoxImage = 0;
        }
        $("#overlay").empty();
        newImage = $("#gallery").children().eq(shadowBoxImage);
        $("#overlay").append(
                $("#gallery").children().eq(shadowBoxImage)
                .clone().attr("src", $("#gallery").children().eq(shadowBoxImage).attr("src").replace("thumbnails/", ""))
                .css("max-width", "100%")
                .css("max-height", "100%")
                .css("z-index", "5")
                .css("border", "none"));
        //Slide to image
        //$("#galleryPage").scrollTop(newImage.offset().top - $("#galleryPage").offset().top + $("#galleryPage").scrollTop());
        // Or you can animate the scrolling:
        if (shadowBoxImage === 0)
        {
            $(window).scrollTop(0);
        } else {
            $(window).scrollTop(newImage.parent().offset().top - 150);
        }
    }

    function previousImage() {
        shadowBoxImage--;
        if (shadowBoxImage < 0) {
            shadowBoxImage = totalImages - 1;
        }
        $("#overlay").empty();
        newImage = $("#gallery").children().eq(shadowBoxImage);
        $("#overlay").append(
                $("#gallery").children().eq(shadowBoxImage)
                .clone().attr("src", $("#gallery").children().eq(shadowBoxImage).attr("src").replace("thumbnails/", ""))
                .css("max-width", "100%")
                .css("max-height", "100%")
                .css("z-index", "5")
                .css("border", "none"));
        //Slide to image
        //$("#galleryPage").scrollTop(newImage.offset().top - $("#galleryPage").offset().top + $("#galleryPage").scrollTop());
        // Or you can animate the scrolling:
        if (shadowBoxImage === 0)
        {
            $(window).scrollTop(0);
        } else {
            $(window).scrollTop(newImage.parent().offset().top - 150);
        }
    }

    $(document).swipe({
        swipeRight: function (event, direction, distance, duration, fingerCount) {
            previousSection();
        },
        swipeLeft: function (event, direction, distance, duration, fingerCount) {
            nextSection();
        },
        allowPageScroll: "auto"
    });

    function previousSection() {
        $("#" + currentSection).prev().click();
    }

    function nextSection() {
        $("#" + currentSection).next().click();
    }

    function copyEmail() {
        /* Get the text field */
        var copyText = document.getElementById("emailText");

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("Copy");

        /* Alert the copied text */
        alert("Copied the text: " + copyText.value);
    }

    $("#emailLink").click(function () {
        alert("daas");
        copyEmail();
    });

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