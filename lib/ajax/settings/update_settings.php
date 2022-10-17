<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
    $allows_keys = ['theme'];

    if(!isset($_SESSION)) session_start();
    if(!isset($_SESSION['user_id'])) {
        echo "not logged in";
        exit;
    }
    if(!isset($_POST['key']) || !isset($_POST['value'])) {
        echo "missing attributes";
        exit;
    }
    //Check if the key/value is valid
    if($_POST['key'] == 'theme') {
        $allowed_values = ['light', 'dark'];
        if(!in_array($_POST['value'], $allowed_values)) {
            echo "invalid value";
            exit;
        }
    } else if($_POST['key'] == 'lang'){
        $allowed_values = ['en-US', 'de-DE'];
        if(!in_array($_POST['value'], $allowed_values)) {
            echo "invalid value";
            exit;
        }
    } else {
        echo "invalid key";
        exit;
    }

    $userId = $_SESSION['user_id'];
    $key = htmlspecialchars($_POST['key'], ENT_QUOTES);
    $value = htmlspecialchars($_POST['value'], ENT_QUOTES);

    $db = new SafeMySQL();
    $sql = "INSERT INTO user_settings (user_id, settings_key, settings_value) VALUES (?i, ?s, ?s) ON DUPLICATE KEY UPDATE settings_key = ?s, settings_value = ?s;";
    $db->query($sql, $_SESSION['user_id'], $_POST['key'], $_POST['value'], $_POST['key'], $_POST['value']);

    $_SESSION[$key] = $value;
    echo "success";

