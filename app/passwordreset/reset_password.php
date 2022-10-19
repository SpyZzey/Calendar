<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

// Deny access to this page if there is no user_id and key given
if(!isset($_POST['user_id']) || !isset($_POST['key'])) {
    http_response_code(404);
    exit;
};

$key = htmlspecialchars($_POST['key'], ENT_QUOTES);
$userId = htmlspecialchars($_POST['user_id'], ENT_QUOTES);

// If password is not set, return error
if(!isset($_POST['pw_reset']) && !isset($_POST['pw_reset_confirm'])) header("Location: /app/passwordreset?user_id={$userId}&key={$key}&error=nopwset");

// If password and confirmation do not match, return error
if($_POST['pw_reset'] !== $_POST['pw_reset_confirm']) header("Location: /app/passwordreset?user_id={$userId}&key={$key}&error=nomatchpw");

//TODO: Implement verification_date check
$db = new SafeMySQL();
$sql = "SELECT verification_id, u.user_id, key_value, verification_date, verification_type FROM email_verification AS ev INNER JOIN users AS u ON ev.user_id = u.user_id WHERE u.user_id= ?i AND verification_type = 'password_reset';";
$verification = $db->getRow($sql, $userId);

// If a password reset has not been requested, return error
if(!isset($verification) || $verification['key_value'] != $key) return;

// Update password in database
$hashed_password = password_hash($_POST['pw_reset'], PASSWORD_DEFAULT);
$sql = "UPDATE users SET password = ?s WHERE user_id = ?i;";
$db->query($sql, $hashed_password, $userId);
$user_id = $db->insertId();

// Delete verification-entry from database after successful password reset
$sql = "DELETE FROM email_verification WHERE verification_id = ?i;";
$db->query($sql, $verification['verification_id']);

header("Location: /app/index.php?info=successful_pw_change");