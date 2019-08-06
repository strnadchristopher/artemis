<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$msg = test_input($_POST['message']);
$email = test_input($_POST['email']);

//$mail_to_send_to = 'strnadchristopher@gmail.com';
$mail_to_send_to = $_POST['artistEmail'];
$your_feedbackmail = "contact@lavalampwebdesign.com";

$mail = new PHPMailer;
try {

    $mail->isMail();
    //Recipients
    $mail->setFrom($your_feedbackmail, 'Commissions');
    $mail->addAddress($mail_to_send_to);     // Add a recipient
    $mail->addReplyTo($email);
    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = "New Commission Request: #" + mt_rand(1000000, 9999999);
    $mail->Body = $msg;
    $mail->AltBody = $msg;

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}


function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

?>