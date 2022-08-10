<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/user_properties.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/get_file.php';

$isLoggedIn = isLoggedIn();
if($isLoggedIn) {
    $firstname = $_SESSION['firstname'];
    $lastname = $_SESSION['lastname'];
}

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
        <script src="/lib/js/modal.js" defer></script>
        <script src="/lib/js/calendar.js" defer></script>
        <script src="/lib/js/calendar_modals.js" defer></script>
    </head>
    <body class="preload">
        <div id="nav-bar">
            <div id="nav-title" class="nav-item"><span>Mein Kalender <?php if(isset($firstname) && isset($lastname)) echo " - " . $firstname . " " . $lastname; ?></span></div>
            <div id="nav-profile-container" class="nav-item">
                <div id="nav-profile" class="nav-item  <?php if(!isset($_SESSION['user_id'])) echo "login";?>">
                    <?php if(!isset($_SESSION['user_id'])) {?> <span>Einloggen</span> <?php } ?>
                    <?php if(isset($_SESSION['user_id'])) {?><img src="<?php get_profile_picture($_SESSION['user_id']);?>" alt="profile picture"/> <?php } ?>
                </div>
            </div>
        </div>
        <div id="content">
            <main id="main-content" class="panel">
                <div id="calendar">
                    <div id="calendar-header">
                        <button id="calendar-today-button" class="button button--text resize_event default-show">
                            Heute
                        </button>

                        <div id="calendar-month-picker" class="month-picker">
                            <span class="month-picker-back--year non-selectable material-icons">keyboard_double_arrow_left</span>
                            <span class="month-picker-back non-selectable material-icons">chevron_left</span>
                            <span class="month-picker-text padding-horizontal">September 2021</span>
                            <span class="month-picker-forward non-selectable material-icons">chevron_right</span>
                            <span class="month-picker-forward--year non-selectable material-icons">keyboard_double_arrow_right</span>
                        </div>

                        <button id="calendar-add-entry-button" class="button button--highlighted">
                            Neuer Eintrag
                        </button>
                    </div>
                    <div id="calendar-body" >
                        <div class="flex--stretch calendar-grid">
                            <div class="calendar-grid-header">
                                <div>Mo</div>
                                <div>Di</div>
                                <div>Mi</div>
                                <div>Do</div>
                                <div>Fr</div>
                                <div>Sa</div>
                                <div class="red">So</div>
                            </div>
                            <div id="calendar-date-days" class="calendar-grid-content keep-border-box">
                                <!--DRAW-->
                                <div class="cal-event-container cal-event-container--test relative">
                                    <div class="cal-event cal-event--test" style="margin-top: 30px;">Test</div>
                                </div>
                                <div class="cal-event-container cal-event-container--test2 relative">
                                    <div class="cal-event cal-event--test" style="margin-top: 55px;">Test</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <aside id="side-content" class="panel">
                <div id="calendar-day">
                    <div id="calendar-day-date">
                        <h2>03. September 2021</h2>
                        <h4>Freitag</h4>
                    </div>
                    <div id="calendar-day-events" class="flex-list">
                        <div class="calendar-day-item panel flex-list-item">
                            <span class="event-title">Elternsprechtag</span>
                            <h3 class="event-desc">Elternsprechtag für die Stufen 5-8 im kompletten E-Trakt Gebäude.</h3>
                            <h4 class="event-time">Ganzer Tag</h4>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
        <div id="modal-day" class="modal"></div>
        <div id="modal-event" class="modal">Das ist ein Test</div>
        <div id="modal-user-login" class="modal <?php if(!$isLoggedIn) echo "show";?>">
            <div class="modal-header">
                <span class="material-icons modal-close">close</span>
            </div>
            <div class="modal-body">
                <form action="/lib/php/forms/user_login.php" method="post" class="form-column">
                    <div class="form-header">
                        <h2>Anmelden</h2>
                        <h4>Du musst dich anmelden.</h4>
                    </div>
                    <div class="form-body">
                        <input type="text" placeholder="Email" name="email" required>
                        <input type="password" placeholder="Passwort" name="password" required>
                        <a id="forgot_password" href=""><h6>PASSWORT VERGESSEN</h6></a>
                        <button type="submit" value="login" name="login" class="button--highlighted">Einloggen</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                Du hast noch kein Konto? <a href="" id="register_button">Hier registrieren!</a>
            </div>
        </div>
        <div id="modal-user-reset-password" class="modal">
            <div class="modal-header">
                <span class="material-icons modal-close">close</span>
            </div>
            <div class="modal-body">
                <form action="/lib/php/forms/user_password_reset.php" method="post" class="form-column">
                    <div class="form-header">
                        <h2>Passwort zurücksetzen</h2>
                        <h4>Um dein Passwort zurückzusetzen, musst du uns die Email deines
                            Accounts nennen, welchen du wiederherstellen möchtest.</h4>
                    </div>
                    <div class="form-body">
                        <input type="text" placeholder="Email" name="email" required>
                        <button type="submit" value="login" name="login" class="button--highlighted">Passwort zurücksetzen</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="modal-user-register" class="modal">
            <div class="modal-header">
                <span class="material-icons modal-close">close</span>
            </div>
            <div class="modal-body">
                <form action="/lib/php/forms/user_register.php" method="post" class="form-column">
                    <div class="form-header">
                        <h2>Registrieren</h2>
                    </div>
                    <div class="form-body">
                        <input type="text" placeholder="Vorname" name="firstname" required>
                        <input type="text" placeholder="Nachname" name="lastname" required>
                        <hr/>
                        <input type="text" placeholder="Email" name="email" required>
                        <input type="password" placeholder="Passwort" name="password" required>
                        <button type="submit" value="register" name="register"  class="button--highlighted">Registrieren</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                Du hast bereits ein Konto? <a href="" id="login_button">Einloggen!</a>
            </div>
        </div>
        <div id="modal-user" class="modal">
            <a href="/app/logout">Logout</a>
        </div>
        <div id="modal-scrim" class="<?php if(!$isLoggedIn) echo "show";?>"></div>

    </body>
</html>