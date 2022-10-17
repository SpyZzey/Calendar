<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/mailer.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

if(!isset($_SESSION)) session_start();
if(!isset($_POST['email'])) return;


$email = htmlspecialchars($_POST['email'], ENT_QUOTES);

$db = new SafeMySQL();
$sql = "SELECT user_id, firstname, lastname FROM users WHERE email = ?s;";
$user_data = $db->getRow($sql, $email);
$user_id = $user_data['user_id'];

$firstname = htmlspecialchars($user_data['firstname'], ENT_QUOTES);
$lastname = htmlspecialchars($user_data['lastname'], ENT_QUOTES);

$token = openssl_random_pseudo_bytes(16);
$token = bin2hex($token);
$user = ["email" => $email, "firstname" => $firstname,  "lastname" => $lastname, "id" => $user_id];

$sql = "DELETE FROM email_verification WHERE user_id = ?i;";
$db->query($sql, $user_id);
$sql = "INSERT INTO email_verification (user_id, key_value, verification_date, verification_type) VALUES (?s, ?s, CURRENT_TIMESTAMP(), 'password_reset');";
$db->query($sql, $user['id'], $token);

$verification_link = "192.168.178.29/app/passwordreset?user_id={$user['id']}&key={$token}";
try {
    sendEmail($user, "Kalender - Passwort zurücksetzen", "
    <html>
        <body>
            Hallo {$firstname},<br>
            <br>
            bitte klicken Sie auf den folgenden Link oder kopieren ihn in die Adresszeile, um ihr Passwort zurückzusetzen.<br>
            Sie haben 24 Stunden Zeit das Passwort zurückzusetzen. <br>
            <br>
            <a href='{$verification_link}'>{$verification_link}</a><br>
            <br>
            <br>
            Mit freundlichen Grüßen<br>
            <br>
            Simon Brebeck
        </body>
    </html>");
} catch (\PHPMailer\PHPMailer\Exception $e) {
}