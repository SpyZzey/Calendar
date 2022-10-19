<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id'])) {
        echo "not logged in";
        exit;
    }
    if(!isset($_POST['id']) || !isset($_POST['name']) || !isset($_POST['start_time']) || !isset($_POST['end_time']) || !isset($_POST['all_day'])) {
        echo "missing attributes";
        exit;
    }

    $userId = htmlspecialchars($_SESSION['user_id'], ENT_QUOTES);
    $eventId = htmlspecialchars($_POST['id'], ENT_QUOTES);
    $eventName = htmlspecialchars($_POST['name'], ENT_QUOTES);
    $eventDesc = htmlspecialchars($_POST['description'] ?? "", ENT_QUOTES);
    $eventStart = htmlspecialchars($_POST['start_time'], ENT_QUOTES);
    $eventEnd = htmlspecialchars($_POST['end_time'], ENT_QUOTES);
    $eventAllday = htmlspecialchars($_POST['all_day'] ?? 1, ENT_QUOTES);
    $eventColor = htmlspecialchars($_POST['color'] ?? "#000000", ENT_QUOTES);
    $eventType = htmlspecialchars($_POST['type'] ?? "Meeting", ENT_QUOTES);

    $db = new SafeMySQL();
    $sql = "UPDATE calendar_events SET name = ?s, description = ?s, start_time = ?s, end_time = ?s, allday = ?i, event_color = ?s, `type` = ?s WHERE calendar_id = ?i AND user_id = ?i";
    $db->query($sql, $eventName, $eventDesc, $eventStart, $eventEnd, $eventAllday, $eventColor, $eventType, $eventId, $userId);
    echo "success";

