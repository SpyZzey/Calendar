/*
    Opens the register modal
 */
$('#register_button').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-login').removeClass("show");
    $('#modal-user-register').addClass("show");
});

/*
    Opens the login modal
 */
$('#login_button').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-login').addClass("show");
    $('#modal-user-register').removeClass("show");
})

/*
    Opens the forget password modal
 */
$('#forgot_password').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-reset-password').addClass("show");
    $('#modal-user-login').removeClass("show");
})

/*
    Opens the profile
 */
$('#nav-profile').on('click', function () {
    if($(this).hasClass('login')) {
        $('#modal-user-login').addClass("show");
        $('#modal-scrim').addClass("show");
    } else {
        $('#modal-user').addClass("show");
        $('#modal-scrim').addClass("show");
    }
});

/*
    Adds Switch Theme Button functionality
 */
$('#button--switch-theme').on('click', function () {
    let currentTheme = sessionStorage.getItem('theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if(currentTheme === 'dark') sessionStorage.setItem('theme', 'light');

    changeTheme(newTheme);

});

/*
    @param newTheme - The new theme that should be applied. ['light', 'dark']
 */

function changeTheme(newTheme) {
    $.ajax({
        url: '/lib/ajax/settings/update_settings.php',
        type: 'POST',
        data: {
            key: 'theme',
            value: newTheme
        },
        success: function () {
            location.reload();
        }
    });
}
