<?php
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id']) || !isset($_POST['id'])) {
        echo "not logged in";
        return;
    }
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

    $userId = $_SESSION['user_id'];
    $calendarId = $_POST['id'];

    $db = new SafeMySQL();
    $sql = "SELECT calendar_id, name, description, start_time, end_time, event_color, type, allday FROM calendar_events WHERE user_id = ?i AND calendar_id = ?i;";
    $event = $db->getRow($sql, $userId, $calendarId);

    $jsonEvent = json_encode($event);
    echo $jsonEvent;



