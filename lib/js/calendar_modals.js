
/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Sets the date and weekday of the selected date and shows it in the day-overview side panel/modal.
    If the side panel is not visible (screen too small), open the day-overview modal instead.
 */
function openDay(day, month, year){
    let side_panel = $('#side-content');
    let cd = $('#calendar-day')
    let cdd = cd.children('#calendar-day-date');
    cdd.children('h2').html(toDateString(day, month, year));
    cdd.children('h4').html(getDayName(day, month, year));

    if (side_panel.css("width") === "0px") {
        openModal('modal-day');
        cd.detach().appendTo('#modal-day');
    }
}

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