<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id']) || !isset($_GET['month']) || !isset($_GET['year'])) {
        echo "not logged in";
        exit;
    }

    $userId = $_SESSION['user_id'];
    $month = $_GET['month'] + 1;
    $year = $_GET['year'];

    $db = new SafeMySQL();
    if(isset($_GET['day'])) {
        $day = $_GET['day'];
        $time = $year . "-" . $month . "-" . $day;
        $sql = "SELECT calendar_id, name, description, start_time, end_time, event_color, type, allday 
                FROM calendar_events WHERE user_id = ?i AND start_time <= ?s AND end_time >= ?s;";
        $events = $db->getAll($sql, $userId, $time, $time);
    } else {


        $start_year = $year;
        $start_month = $month-1;
        $end_year = $year;
        $end_month = $month+1;
        if($month == 1) {
            $start_year = $year - 1;
            $start_month = 12;
        }
        if($month == 12) {
            $end_year = $year + 1;
            $end_month = 1;
        }
        $end_time = $end_year . "-" . ($end_month) . "-15";
        $start_time = $start_year . "-" . ($start_month) . "-15";

        $sql = "SELECT calendar_id, name, description, start_time, end_time, event_color, type
                FROM calendar_events WHERE user_id = ?i AND 
                ((start_time <= ?s AND end_time >= ?s) -- Starting before timespan and reaching into timespan --
                OR (start_time <= ?s AND end_time >= ?s) -- Starting inside timespan and reaching out of timespan --
                OR (start_time >= ?s AND end_time <= ?s)) -- Starting and ending inside timespan --";

        $events = $db->getAll($sql, $userId, $start_time, $start_time, $end_time, $end_time, $start_time, $end_time);

    }


    echo htmlspecialchars(json_encode($events), ENT_NOQUOTES);

