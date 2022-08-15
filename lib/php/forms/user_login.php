<?php
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
        require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';
        $db = new SafeMySQL();

        //Check in database if user is valid and get hashed password if so
        $user_data = $db->getRow('SELECT user_id, email, password, firstname, lastname FROM users WHERE email=?s', $user_login);
        if ($user_data != null && password_verify($user_password, $user_data["password"])) {
            //Set session data if login was successful and redirect to main-page.
            setUserSessionData($user_data);
            header("Location: /app");
        } else {
            header("Location: /app?error=invalid-password");
        }
    }
}

//TODO: Check if email is valid
function isValidEmail($user_login) : bool {
    return !empty($user_login);
}

//Set session data
function setUserSessionData($user_data) {
    $_SESSION['user_id'] = $user_data['user_id'];
    $_SESSION['email'] = $user_data['email'];
    $_SESSION['firstname'] = $user_data['firstname'];
    $_SESSION['lastname'] = $user_data['lastname'];

    echo true;
}

//Perform Login with POST
if(isset($_POST['email']) && isset($_POST['password'])){
    login($_POST['email'], $_POST['password']);
}