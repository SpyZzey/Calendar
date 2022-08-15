<?php
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id']) || !isset($_POST['month']) || !isset($_POST['year'])) {
        echo "not logged in";
        return;
    }
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

    $userId = $_SESSION['user_id'];
    $month = $_POST['month'] + 1;
    $year = $_POST['year'];

    $db = new SafeMySQL();
    if(isset($_POST['day'])) {
        $day = $_POST['day'];
        $time = $year . "-" . $month . "-" . $day;
        $sql = "SELECT calendar_id, name, description, start_time, end_time, event_color, type, allday 
                FROM calendar_events WHERE user_id = ?i AND start_time <= ?s AND end_time >= ?s;";
        $events = $db->getAll($sql, $userId, $time, $time);
    } else {
        $sql = "SELECT calendar_id, name, description, start_time, end_time, event_color, type
                FROM calendar_events WHERE user_id = ?i AND YEAR(start_time) <= ?i AND MONTH(start_time) <= ?i
                AND YEAR(end_time) >= ?i AND MONTH(end_time) >= ?i;";
        $events = $db->getAll($sql, $userId, $year, $month, $year, $month);
    }


    $jsonEvent = json_encode($events);
    echo $jsonEvent;

