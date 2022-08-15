$('#modal-scrim').on('click', function () {
    closeAllModals();
});
$('.modal-close').on('click', function () {
    closeAllModals();
});

function closeAllModals(){
    $('.modal').removeClass("show");
    $('#modal-scrim').removeClass("show");
}

/*
    @param {string} modal_id - The id of the modal to open.
    Opens the modal with the given id.
 */
function openModal(modal_id) {
    $('.modal').removeClass("show");
    $('#' + modal_id).addClass("show");
    $('#modal-scrim').addClass("show");
}

/*
    @param {string} modal_id - The id of the modal to close.
    Closes the modal with the given id.
 */
function closeModal(modal_id) {
    $('#' + modal_id).removeClass("show");
    $('#modal-scrim').removeClass("show");
}
