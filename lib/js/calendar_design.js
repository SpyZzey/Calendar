
/*
    Check screen size on resize.
 */
function checkResizing() {
    showSidePanelOnResize();
    showAddEntryButtonOnResize();
}

/*
    Show the side panel if the screen is large enough (900px), otherwise attach content to the day-overview modal.
 */
function showSidePanelOnResize() {
    if(window.matchMedia("only screen and (min-width: 900px)").matches) {
        // Screen large enough for sidepanel
        $('#calendar-day').detach().appendTo('#side-content');
        if($('#modal-day').hasClass("show")) closeModal('modal-day');
    }
}
/*
    Show the add entry button if the screen is large enough (600px), otherwise attach it to the side panel/modal.
 */
function showAddEntryButtonOnResize() {
    if(window.matchMedia("only screen and (min-width: 600px)").matches) {
        // Screen large enough for Add-Entry Button
        $('#calendar-add-entry-button').detach().appendTo('#calendar-header');
    } else {
        $('#calendar-add-entry-button').detach().appendTo('#calendar-day');
    }
}

/*
    Checks for resizing
 */
$(window).on('resize', function () {
    checkResizing();
});

checkResizing();