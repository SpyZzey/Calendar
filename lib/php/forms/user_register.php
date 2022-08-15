<?php
if(!isset($_SESSION)) session_start();

if(!isset($_POST['firstname'])
    || !isset($_POST['lastname'])
    || !isset($_POST['email'])
    || !isset($_POST['password']))
    return;

require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/mailer.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

$hashed_password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$db = new SafeMySQL();
$sql = "INSERT INTO users (email, password, firstname, lastname, verified) VALUES (?s, ?s, ?s, ?s, ?i);";
$db->query($sql, $_POST['email'], $hashed_password, $_POST['firstname'], $_POST['lastname'], 0);
$user_id = $db->insertId();

$token = openssl_random_pseudo_bytes(16);
$token = bin2hex($token);
$user = ["email" => $_POST['email'], "firstname" => $_POST['firstname'],  "lastname" => $_POST['lastname'], "id" => $user_id];

$sql = "DELETE FROM email_verification WHERE user_id = ?i;";
$db->query($sql, $user_id);
$sql = "INSERT INTO email_verification (user_id, key_value, verification_date, verification_type) VALUES (?s, ?s, CURRENT_TIMESTAMP(), 'email');";
$db->query($sql, $user['id'], $token);

$verification_link = "{$_SERVER['SERVER_ADDR']}/app/register?user_id={$user['id']}&key={$token}";
sendEmail($user, "Kalender - Email bestätigen", "
<html>
    <body>
        Hallo {$user['firstname']},<br>
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