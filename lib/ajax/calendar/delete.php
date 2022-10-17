<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
if(!isset($_SESSION)) session_start();
if(!isset($_SESSION['user_id'])) {
    echo "not logged in";
    exit;
}
if(!isset($_GET['id'])) {
    echo "missing attributes";
    exit;
}

$userId = htmlspecialchars($_SESSION['user_id'], ENT_QUOTES);
$eventId = htmlspecialchars($_GET['id'], ENT_QUOTES);

$db = new SafeMySQL();
$sql = "DELETE FROM calendar_events WHERE calendar_id = ?i AND user_id = ?i";
$db->query($sql, $eventId, $userId);
echo "success";