<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/object_storage/ObjectStorageInterface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/database/safemysql.class.php';

function get_profile_picture($user_id){
    if(isset($user_id)) {
        $db = new SafeMySQL();
        $sql = "SELECT profile_picture FROM users WHERE user_id = ?i;";
        $pb = $db->getOne($sql, $user_id);
        if (!isset($pb)) $pb = "default/user.png";
        //$osi->upload_file_by_key("profiles/1/profile_picture.jpg", $_SERVER["DOCUMENT_ROOT"] . "/res/user.jpg");
    } else {
        $pb = "default/user.png";
    }
    $osi = new ObjectStorageInterface("calendar");
    $result = $osi->get_image_url_by_key($pb);
    echo "$result";
}