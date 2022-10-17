<?php
if(!isset($_GET['user_id']) || !isset($_GET['key'])) return;
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

$userId = htmlspecialchars($_GET['user_id'], ENT_QUOTES);
$key = htmlspecialchars($_GET['key'], ENT_QUOTES);


//TODO: Implement verification_date check and Delete account after 24h
$db = new SafeMySQL();
$sql = "SELECT verification_id, u.user_id, key_value, verification_date FROM email_verification AS ev INNER JOIN users AS u ON ev.user_id = u.user_id WHERE u.user_id= ?i AND verification_type = 'email';";
$verification = $db->getRow($sql, $userId);
if(!isset($verification) || $verification['key_value'] != $key) return;
$sql = "UPDATE users SET verified = 1 WHERE user_id = ?i;";
$db->query($sql, $verification['user_id']);

// Delete verification-entry from database after successful registration
$sql = "DELETE FROM email_verification WHERE verification_id = ?i;";
$db->query($sql, $verification['verification_id']);

header("Location: /app/index.php");