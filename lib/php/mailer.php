<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Dotenv\Dotenv;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/**
 * @throws Exception
 */
function sendEmail($sendTo, $subject, $body){
    $dotenv = Dotenv::createImmutable($_SERVER['DOCUMENT_ROOT'] . '/_secure');
    $dotenv->safeLoad();

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->CharSet   = 'UTF-8';
    $mail->Encoding  = 'base64';
    $mail->SMTPDebug = 1;
    $mail->SMTPAuth = true;
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->Port = 587;
    $mail->IsHTML(true);
    $mail->Username = $_ENV['SMTP_USERNAME'];
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SetFrom($_ENV['SMTP_SENDER'], "Kalender App");
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->AddAddress($sendTo['email'], $sendTo['firstname'] . " " . $sendTo['lastname']);

    !$mail->Send();
    header("Location: /app");
}


?>