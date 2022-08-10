<?php
if(!isset($_SESSION)) session_start();
    //Check if user is logged in
    function isLoggedIn() : bool{
        return (isset($_SESSION['user_id']));
    }