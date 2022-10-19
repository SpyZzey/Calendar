<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id'])) {
        echo "not logged in";
        exit;
    }
    if(!isset($_POST['name']) || !isset($_POST['start_time']) || !isset($_POST['end_time']) || !isset($_POST['all_day'])) {
        echo "missing attributes";
        exit;
    }

    $userId = htmlspecialchars($_SESSION['user_id'], ENT_QUOTES);
    $eventName = htmlspecialchars($_POST['name'], ENT_QUOTES);
    $eventDesc = htmlspecialchars($_POST['description'] ?? "", ENT_QUOTES);
    $eventStart = htmlspecialchars($_POST['start_time'], ENT_QUOTES);
    $eventEnd = htmlspecialchars($_POST['end_time'], ENT_QUOTES);
    $eventAllday = htmlspecialchars($_POST['all_day'] ?? 1, ENT_QUOTES);
    $eventColor = htmlspecialchars($_POST['color'] ?? "#000000", ENT_QUOTES);
    $eventType = htmlspecialchars($_POST['type'] ?? "Meeting", ENT_QUOTES);

    $db = new SafeMySQL();
    $sql = "INSERT INTO calendar_events (user_id, name, description, start_time, end_time, event_color, type, allday) VALUES(?i, ?s, ?s, ?s, ?s, ?s, ?s, ?s);";
    $db->query($sql, $userId, $eventName, $eventDesc, $eventStart, $eventEnd, $eventColor, $eventType, $eventAllday);
    $lastId = $db->insertId();

    echo "success: " . $lastId;



