<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/user_properties.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/lib/php/get_file.php';

$isLoggedIn = isLoggedIn();
if($isLoggedIn) {
    $firstname = htmlspecialchars($_SESSION['firstname'], ENT_QUOTES);
    $lastname = htmlspecialchars($_SESSION['lastname'], ENT_QUOTES);
    $email = htmlspecialchars($_SESSION['email'], ENT_QUOTES);
    $theme = htmlspecialchars($_SESSION['theme'], ENT_QUOTES) ?? 'light';
} else {
    $theme = 'light';
}

?>
<!DOCTYPE HTML>
<html lang="de">
    <head>
        <title>Kalender <?php if(isset($firstname) && isset($lastname)) echo " - " . $firstname . " " . $lastname; ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"/>
        <link rel="stylesheet" href="/lib/css/themes/theme--<?= $theme; ?>.css">
        <link rel="stylesheet" href="/lib/css/styles.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="/lib/css/library/coloris.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
        <script src="/lib/js/utils.js" defer></script>
        <script src="/lib/js/user.js" defer></script>
        <script src="/lib/js/calendar.js" defer></script>
        <script src="/lib/js/calendar_design.js" defer></script>
        <script src="/lib/js/library/coloris.min.js"></script>

        <svg style="display: none;" class="checkbox-symbol">
            <symbol id="check" viewBox="0 0 12 10">
                <polyline
                        points="1.5 6 4.5 9 10.5 1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2">
                </polyline>
            </symbol>
            <symbol id="indeterminate" viewBox="0 0 12 10">
                <polyline
                        points="0 5 12 5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2">
                </polyline>
            </symbol>
        </svg>
    </head>
    <body class="preload">
        <div id="nav-bar">
            <div id="nav-title" class="nav-item"><span>Mein Kalender</span></div>
            <div id="nav-profile-container" class="nav-item">
                <div id="nav-profile" class="nav-item  <?php if(!isset($_SESSION['user_id'])) echo "login";?>">
                    <?php if(!isset($_SESSION['user_id'])) {?> <span>Einloggen</span> <?php } ?>
                    <?php if(isset($_SESSION['user_id'])) {?><img src="<?php get_profile_picture($_SESSION['user_id']);?>" alt="profile picture"/> <?php } ?>
                    <?php if(isset($firstname) && isset($lastname)) echo "<span>" . $firstname . " " . $lastname . "</span>"; ?>
                </div>
            </div>
        </div>
        <div class="banner error hidden">
            <div class="banner-icon"><i class="material-icons">error</i></div>
            <span class="banner-text">Passwort oder Email ist falsch!</span>
            <div class="banner-close"><i class="material-icons">close</i></div>
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

                        <?php if($isLoggedIn) { ?>
                            <button id="calendar-add-entry-button" class="button button--highlighted"> Neuer Eintrag </button>
                        <?php }?>
                    </div>
                    <div id="calendar-body" >
                        <div class="calendar-grid">
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

                    </div>
                </div>
            </aside>
        </div>
        <div id="modal-day" class="modal"></div>
        <div id="modal-add-event" class="modal">
            <div class="modal-header">
                <i class="modal-close material-icons" data-modal_id="modal--profile">close</i>
                <h2 id="event-add-title" class="title">Neuer Termin</h2>
                <i class="modal-back material-icons invisible">arrow_back</i>
            </div>
            <div class="modal-body calendar-modal-event">
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">event</i>
                        <div class="name">Neuer Termin</div>
                    </div>
                    <div class="description">
                        <input type="text" placeholder="Neuer Termin" id="event-add-name" name="event-add-name" maxlength="256" required>
                    </div>
                </div>
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">access_time</i>
                        <div class="name">Uhrzeit</div>
                    </div>
                    <div class="description">
                        <div id="event-add-time" style="padding: 2px">
                            <div id="event-add-date">
                                <input type="date" id="event-add-date-start_time" name="event-add-start_time" required>
                                <span>bis</span>
                                <input type="date" id="event-add-date-end_time" name="event-add-end_time" required>
                            </div>
                            <div id="event-add-datetime" class="hidden">
                                <input type="datetime-local" id="event-add-datetime-start_time" name="event-add-start_time" required>
                                <span>bis</span>
                                <input type="datetime-local" id="event-add-datetime-end_time" name="event-add-end_time" required>
                            </div>
                        </div>
                        <div class="checkbox-container">
                            <div>
                                <input class="checkbox-input" id="event-add-cb_allday" type="checkbox" checked/>
                                <label class="checkbox" for="event-add-cb_allday">
                                    <span>
                                      <svg width="12px" height="10px">
                                          <use xlink:href="#check" class="checked-polyline"></use>
                                          <use xlink:href="#indeterminate" class="indeterminate-polyline"></use>
                                      </svg>
                                    </span>
                                </label>
                            </div>
                            <div class="checkbox-description">
                                Ganztägig
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">description</i>
                        <div class="name">Beschreibung</div>
                    </div>
                    <div class="description">
                        <textarea id="event-add-description" class="fw"></textarea>
                    </div>
                </div>
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">palette</i>
                        <div class="name">Event Farbe</div>
                    </div>
                    <div class="description">
                        <input id="event-add-color" type="text" class="coloris non-selectable" value="#888" />
                    </div>
                </div>
            </div>
            <div class="modal-footer spaced">
                <button id="event-add-submit" data-action="create" data-event_id="-1" class="button button--icon-text">
                    <i class="material-icons">check</i>
                    <span>Speichern</span>
                </button>
            </div>
        </div>
        <div id="modal-event" class="modal">
            <div class="modal-header">
                <i class="modal-close material-icons" data-modal_id="modal--profile">close</i>
                <h2 id="event-title">Event Name</h2>
                <i class="modal-back material-icons invisible">arrow_back</i>
            </div>
            <div class="modal-body calendar-modal-event">
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">access_time</i>
                        <div class="name">Uhrzeit</div>
                    </div>
                    <div id="event-time" class="description">
                        Montag, 04. Juli - Freitag, 08. Juli
                    </div>
                </div>
                <div class="item">
                    <div class="item-header">
                        <i class="material-icons">description</i>
                        <div class="name">Beschreibung</div>
                    </div>
                    <div id="event-description" class="description">
                        Beschreibung
                    </div>
                </div>

            </div>
            <div class="modal-footer spaced">
                <button id='button-event-edit' class="button button--icon-text">
                    <i class="material-icons">edit</i>
                    <span>Bearbeiten</span>
                </button>
                <button id='button-event-delete' class="button button--icon-text">
                    <i class="material-icons red">delete</i>
                    <span class="red">Löschen</span>
                </button>
            </div>
        </div>
        <div id="modal-user-login" class="modal">
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
            <div class="modal-header">
                <i class="modal-close material-icons" data-modal_id="modal--profile">close</i>
                <h2></h2>
                <i class="modal-control material-icons invisible">arrow_back</i>
            </div>
            <div class="modal-body">
                <div class="profile-overview">
                    <?php if(isset($_SESSION['user_id'])) {?><img class="non-interactable" src="<?php get_profile_picture($_SESSION['user_id']);?>" alt="user_profile_picture"/> <?php } ?>
                    <h2 class="center-text margin-top"><?php if(isset($firstname) && isset($lastname)) echo $firstname . " " . $lastname; ?></h2>
                    <h3 class="center-text"><?php if(isset($email)) echo "(" . $email . ")"; ?></h3>
                </div>
            </div>
            <div class="modal-footer right-flow">
                <button class="button--text" onclick="location.href='/app/logout/'">Logout</button>
                <button id="button--switch-theme" class="button-icon--round">
                    <i id="button--theme-dark" class="material-icons <?php if($theme == 'light') echo 'hidden';?>">dark_mode</i>
                    <i id="button--theme-light" class="material-icons <?php if($theme == 'dark') echo 'hidden';?>">light_mode</i>
                </button>
            </div>
        </div>

        <div id="modal-scrim" class="<?php if(!$isLoggedIn) echo "show";?>"></div>
        <script src="/lib/js/modal.js"></script>
        <script src="/lib/js/banner.js"></script>
        <script>
            <?php if(!$isLoggedIn) {?>
                openModal('modal-user-login');

                const urlParams = new URLSearchParams(window.location.search);
                if(urlParams.has('error')) {
                    const error = urlParams.get('error');
                    if(error === 'email-in-use') {
                        spawnBanner('error', 'Diese Email wird bereits verwendet.');
                        closeModal('modal-user-login');
                        openModal('modal-user-register');
                    } else if(error === 'invalid-login') {
                        spawnBanner('error', 'Falsche Email oder Passwort.');
                    } else if(error === 'not-verified') {
                        spawnBanner('error', 'Dein Account wurde noch nicht verifiziert.');
                    }
                }
            <?php } ?>

            sessionStorage.setItem('theme', '<?php echo $theme;?>');
            Coloris({
                el: '.coloris',
                themeMode: 'light', // light, dark, auto
                format: 'hex',
                defaultColor: '#888',
                alpha: false,
                swatches: [
                    '#264653',
                    '#2a9d8f',
                    '#e9c46a',
                    '#f4a261',
                    '#e76f51',
                    '#d62828',
                    '#023e8a',
                    '#0077b6',
                    '#0096c7',
                    '#00b4d8',
                ]
            });
        </script>
    </body>
</html>