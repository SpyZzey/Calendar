$('#register_button').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-login').removeClass("show");
    $('#modal-user-register').addClass("show");
});
$('#login_button').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-login').addClass("show");
    $('#modal-user-register').removeClass("show");
})
$('#forgot_password').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-reset-password').addClass("show");
    $('#modal-user-login').removeClass("show");
})
$('#nav-profile').on('click', function () {
    if($(this).hasClass('login')) {
        $('#modal-user-login').addClass("show");
        $('#modal-scrim').addClass("show");
    } else {
        $('#modal-user').addClass("show");
        $('#modal-scrim').addClass("show");
    }
});
