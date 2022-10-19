<?php
if(!isset($_GET['user_id']) || !isset($_GET['key'])) {
    http_response_code(404);
    exit;
};
?>
    <!DOCTYPE HTML>
    <html lang="de">
    <head>
        <title>Kalender <?php if(isset($firstname) && isset($lastname)) echo " - " . $firstname . " " . $lastname; ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"/>
        <link rel="stylesheet" href="/lib/css/styles.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
        <script src="/lib/js/user.js" defer></script>
    </head>
    <body class="preload">
    <div class="centered-panel-container">
        <div class="centered-panel elevated-card">
            <form class="form-column" action="/app/passwordreset/reset_password.php" method="post">
                    <div class="form-header">
                        <h2>Passwort zurücksetzen</h2>
                        <h4>Wie soll dein neues Passwort lauten?</h4>
                    </div>
                    <div class="form-body">
                        <input type="password" placeholder="Passwort" name="pw_reset" required>
                        <input type="password" placeholder="Passwort bestätigen" name="pw_reset_confirm" required>
                        <input type="hidden" name="user_id" value="<?php echo "{$_GET['user_id']}"; ?>">
                        <input type="hidden" name="key" value="<?php echo "{$_GET['key']}"; ?>">
                        <?php if(isset($_GET['error']) && $_GET['error'] == "nomatchpw") echo '<h5 class="red">Passwörter stimmen nicht überein!</h5>';?>
                        <?php if(isset($_GET['error']) && $_GET['error'] == "nopwset") echo '<h5 class="red">Kein Passwort gesetzt.</h5>';?>
                        <button id="button_reset_password" type="submit" value="button_reset_password" name="button_reset_password" class="button--highlighted">Passwort zurücksetzen</button>
                    </div>
            </form>
        </div>
    </div>
    </body>
    </html>
