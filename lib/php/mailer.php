<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

/**
 * @throws Exception
 */
function sendEmail($sendTo, $subject, $body){
    require $_SERVER['DOCUMENT_ROOT'] . '/lib/php/extern/PHPMailer/src/Exception.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/lib/php/extern/PHPMailer/src/PHPMailer.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/lib/php/extern/PHPMailer/src/SMTP.php';

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->CharSet   = 'UTF-8';
    $mail->Encoding  = 'base64';
    $mail->SMTPDebug = 1;
    $mail->SMTPAuth = true;
    $mail->Host = "smtp-relay.sendinblue.com";
    $mail->Port = 587;
    $mail->IsHTML(true);
    $mail->Username = "email";
    $mail->Password = "password";
    $mail->SetFrom("sender", "Kalender App");
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->AddAddress($sendTo['email'], $sendTo['firstname'] . " " . $sendTo['lastname']);

    !$mail->Send();
    header("Location: /app");
}


?>
