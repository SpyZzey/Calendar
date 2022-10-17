<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/mailer.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

if(!isset($_SESSION)) session_start();
if(!isset($_POST['firstname'])
    || !isset($_POST['lastname'])
    || !isset($_POST['email'])
    || !isset($_POST['password']))
    return;


$hashed_password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$email = htmlspecialchars($_POST['email'], ENT_QUOTES);
$firstname = htmlspecialchars($_POST['firstname'], ENT_QUOTES);
$lastname = htmlspecialchars($_POST['lastname'], ENT_QUOTES);

$db = new SafeMySQL();
$sql = "INSERT INTO users (email, password, firstname, lastname, verified) VALUES (?s, ?s, ?s, ?s, 0);";
$db->query($sql, $email, $hashed_password, $firstname, $lastname);
$user_id = $db->insertId();

$token = openssl_random_pseudo_bytes(16);
$token = bin2hex($token);
$user = ["email" => $email, "firstname" => $firstname,  "lastname" => $lastname, "id" => $user_id];

$sql = "DELETE FROM email_verification WHERE user_id = ?i;";
$db->query($sql, $user_id);
$sql = "INSERT INTO email_verification (user_id, key_value, verification_date, verification_type) VALUES (?s, ?s, CURRENT_TIMESTAMP(), 'email');";
$db->query($sql, $user['id'], $token);

$verification_link = "{$_SERVER['HTTP_HOST']}/app/register?user_id={$user['id']}&key={$token}";
sendEmail($user, "Kalender - Email bestätigen", "
<html>
    <body>
        Hallo {$firstname},<br>
        <br>
        bitte klicken Sie auf den folgenden Link oder kopieren ihn in die Adresszeile, um den Registrierungsprozess abzuschließen.<br>
        Sie haben 24 Stunden Zeit den Registrierungsvorgang abzuschließen. Ansonsten wird ihr Konto automatisch gelöscht.<br>
        <br>
        <a href='{$verification_link}'>{$verification_link}</a><br>
        <br>
        <br>
        Mit freundlichen Grüßen<br>
        <br>
        Simon Brebeck
    </body>
</html>");