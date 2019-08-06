<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <link href="commissionsStylesheet.css" rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:700|Open+Sans" rel="stylesheet">
        <title>Commissions</title>
    </head>
    <body>
        <!--            <div class="infoPanel" id='typePanel'>
                        <h1>Select a commission type</h1>
                        <div id="commissionTypes">
                            <div class="type" id="quickie"><h2>Quickie</h2><div style='background-image:url("res/better whisk ref.png")' class='imgDiv'></div></div>
                            <div class="type" id="full-body"><h2>Full Body</h2><div style='background-image:url("res/sonicyref.png")' class='imgDiv'></div></div>
                            <div class="type" id="painting"><h2>Painting</h2><div style='background-image:url("res/panic.png")' class='imgDiv'></div></div>
                            <div class="type" id="other"><h2>Other</h2><div style='background-image:url("res/commmmmmmmission.png")' class='imgDiv'></div></div>
                        </div>
                        <div class="nextButton" id="styleNext">
                            Pick a type to keep going!
                        </div>
                    </div>-->
        <div class="infoPanel" id='descriptionPanel'>
            <h1>Describe what you want</h1>
            <div id='descriptionBoxDiv'>
                <textarea id='descriptionBox'></textarea>
            </div>
            <div class="nextButton" id="descNext">
                Give as much detail as possible!
            </div>
        </div>
        <div class="infoPanel" id='refPanel'>
            <h1>Send us a link to any references (optional)</h1>
            <div id='refBoxDiv'>
                <textarea id='refBox'></textarea>
            </div>
            <div class="nextButton" id="refNext">
                The more references for what you want the better!
            </div>
        </div>
        <div class="infoPanel" id='sendPanel'>
            <h1>Give us your email so we can get back to you</h1>
            <div id='emailBoxDiv'>
                <textarea id='emailBox'></textarea>
            </div>
            <div class="nextButton" id="finish">
                Make sure it's an email you check often so you don't miss our reply
            </div>
        </div>
        <div class="infoPanel" id='sentPanel'>
            <h1 id="finalMessage">Commission request has been sent! We'll get back to you as soon as we can!</h1>
            <textarea id="backupMessage"></textarea>
            <div class="nextButton" id="home">
                Home
            </div>
        </div>
        <div id="backgroundImage"></div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <link rel="stylesheet" href="../animate.css">
        <script src="orderScript.js"></script>
    </body>
</html>
