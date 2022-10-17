<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
if(!isset($_SESSION)) session_start();

/*
 * Checks if login is valid. If not, redirect to login-page, otherwise redirect to main-app.
 *
 * @param $user_login email entered by the user
 * @param $user_password password entered by the user
 */
function login($user_login, $user_password) {
    if(!isValidEmail($user_login) || empty($user_password)) {
        header("Location: /app?error=invalid-input");
    } else {
        $db = new SafeMySQL();

        //Check in database if user is valid and get hashed password if so
        $user_data = $db->getRow('SELECT user_id, email, password, firstname, lastname, verified FROM users WHERE email=?s', $user_login);
        if ($user_data != null && password_verify($user_password, $user_data["password"])) {
            $settings = $db->getAll('SELECT settings_key, settings_value FROM user_settings WHERE user_id = ?i', $user_data['user_id']);
            setUserSettings($settings);

            //Set session data if login was successful and redirect to main-page.
            if($user_data["verified"] == 1) {
                setUserSessionData($user_data);
                header("Location: /app");
            } else {
                header("Location: /app?error=not-verified");
            }
        } else {
            header("Location: /app?error=invalid-credentials");
        }
    }
}

//TODO: Check if email is valid
function isValidEmail($user_login) : bool {
    return filter_var($user_login, FILTER_VALIDATE_EMAIL);
}

//Set session data
function setUserSessionData($user_data) {
    $_SESSION['user_id'] = $user_data['user_id'];
    $_SESSION['email'] = htmlspecialchars($user_data['email'], ENT_QUOTES);
    $_SESSION['firstname'] = htmlspecialchars($user_data['firstname'], ENT_QUOTES);
    $_SESSION['lastname'] = htmlspecialchars($user_data['lastname'], ENT_QUOTES);
    $_SESSION['lastname'] = htmlspecialchars($user_data['theme'], ENT_QUOTES);

    echo true;
}
function setUserSettings($settings) {
    $_SESSION['theme'] = "light";
    $_SESSION['lang'] = "en-US";
    foreach ($settings as $setting) {
        $_SESSION[$setting['settings_key']] = $setting['settings_value'];
    }
}
//Perform Login with POST
if(isset($_POST['email']) && isset($_POST['password'])){
    login($_POST['email'], $_POST['password']);
}