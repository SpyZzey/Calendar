<?php
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id'])) {
        echo "not logged in";
        return;
    }
    if(!isset($_POST['name']) || !isset($_POST['start_time']) || !isset($_POST['end_time']) || !isset($_POST['all_day'])) {
        echo "missing attributes";
        return;
    }
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

    $userId = $_SESSION['user_id'];
    $eventName = $_POST['name'];
    $eventDesc = $_POST['description'] ?? "";
    $eventStart = $_POST['start_time'];
    $eventEnd = $_POST['end_time'];
    $eventAllday = $_POST['all_day'] ?? 1;
    $eventColor = $_POST['color'] ?? '#888';
    $eventType = $_POST['type'] ?? 'Meeting';

    $db = new SafeMySQL();
    $sql = "INSERT INTO calendar_events (user_id, name, description, start_time, end_time, event_color, type, allday) VALUES(?i, ?s, ?s, ?s, ?s, ?s, ?s, ?s);";
    $db->query($sql, $userId, $eventName, $eventDesc, $eventStart, $eventEnd, $eventColor, $eventType, $eventAllday);
    $lastId = $db->insertId();

    echo "Inserted: " . $lastId;



