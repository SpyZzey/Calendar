$(window).on('load', function() {
    $("body").removeClass("preload");
});

const currDate = new Date();
let currentYear = currDate.getFullYear();
let currentMonth = currDate.getMonth();
const calendarRows = 6;
const calendarCols = 7;

/*
    Adds one month to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function nextMonth() {
    if(currentYear === new Date().getFullYear() + 100 && currentMonth === 11) return;

    if(currentMonth === 11) {
        currentYear++;
        currentMonth = 0;
    } else {
        currentMonth++;
    }
}
/*
    Removes one month to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function prevMonth(){
    if(currentYear === new Date().getFullYear() - 100 && currentMonth === 0) return;

    if(currentMonth === 0) {
        currentYear--;
        currentMonth = 11;
    } else {
        currentMonth--;
    }
}
/*
    Adds one year to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function nextYear(){
    if(currentYear === new Date().getFullYear() + 100) return;
    currentYear++;
}
/*
    Removes one year to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function prevYear(){
    if(currentYear === new Date().getFullYear() - 100) return;
    currentYear--;
}

/*
    Display calendar days
*/
function drawMonthOfYear(month, year, numOfVisibleDays){
    // Name of the month
    const nameOfMonth = new Date(year, month + 1, 0).toLocaleString('de-DE', {month: 'long'});

    // Number of days
    const days = daysInMonth(month, year);
    const daysOfMonthBefore = daysInMonth(month - 1, year);
    const daysBefore = getWeekdayOfDate(1, month, year);

    // Remove all day-elements from before
    $("#calendar-date-days").html("");

    // Set name of month to month-picker-text
    $("#calendar-month-picker > span.month-picker-text").html(nameOfMonth + " " + year);

    // Insert the days as grid-items to the DOM tree.
    insertDays(days, daysBefore, daysOfMonthBefore, numOfVisibleDays);
}

/*
    @param days: number of days in the month
    @param daysBefore: number of days from the previous month that are displayed in the calendar before the first day of the month
    @param daysOfMonthBefore: number of days in the previous month
    @param numOfVisibleDays: number of days that are visible in the calendar
    Insert the days as grid-items to the DOM tree.
*/
function insertDays(days, daysBefore, daysOfMonthBefore, numOfVisibleDays) {
    for(let i = 0; i < numOfVisibleDays; i++){
        if(i < daysBefore) {
            // If the first day of a month is not on a monday, display last days of previous month.
            $("#calendar-date-days").append("<div class='grayed-out'><span>" + (daysOfMonthBefore - daysBefore + i + 1) + "</span></div>");
        } else if (i - daysBefore < days) {
            // Display days of the current month
            const date = (i - daysBefore + 1);
            if(isToday(new Date(currentYear, currentMonth, date))) {
                $("#calendar-date-days").append("<div class='current-date'><span>" + date + "</span></div>");
            } else {
                $("#calendar-date-days").append("<div><span>" + date + "</span></div>");
            }
        } else if (i >= days) {
            // Display first days of next month, to fill the remaining space
            $("#calendar-date-days").append("<div class='grayed-out'><span>" + (i - daysBefore - days + 1) + "</span></div>");
        }
    }
}
/*
    @param date: Date object
    Returns true if the given date is today.
 */
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth()  === today.getMonth() && date.getFullYear() === today.getFullYear();
}

/*
    Returns the amount of days in a given month.
*/
function daysInMonth(month, year) {
    return new Date(year, (month+1), 0).getDate();
}

/*
    @param day: day of the month
    @param month: month of the year
    @param year: year
    Returns the weekday of the given date [0-6].
*/
function getWeekdayOfDate(day, month, year){
    var curr = new Date(year, month, day);
    return (curr.getDay()+6)%7;
}

/*
    @param rows: number of rows in the calendar
    @param cols: number of columns in the calendar
    Arranges the days in the calendar according to the number of rows and columns.
    Also, mark sundays :)
*/
function arrangeCalendarDays(rows, columns){
    $('.calendar-grid-content > div').each(function (i, obj){
        if(i < rows * columns) {
            var col = ((i % 7) + 1);
            var row = ((i - (col - 1)) / 7) + 1;
            $(obj).addClass("day")
            $(obj).css("grid-area", row + " / " + col);
            if(i % 7 === 6) {
                $(obj).addClass("red")
            }
        }
    });
}

/*
    Update the calendar.
*/
function redraw(){
    drawMonthOfYear(currentMonth, currentYear, calendarRows * calendarCols)
    arrangeCalendarDays(calendarRows, calendarCols);
}

/*
    If a date is clicked, update the current date and open the day-overview side panel/modal
 */
$('#calendar-date-days').on('click', '.day',function () {
    let day = $(this).children("span").html();
    let index = $(this).index();
    let month = currentMonth;
    let year = currentYear;
    if(index <= 7 && day >= 8) month--;
    else if(index >= 28 && day <= 14) month++;
    if(month === 12) {
        year++;
        month = 0;
    } else if(month === -1) {
        year--;
        month = 11;
    }

    $(this).addClass("calendar-day-selected").siblings().removeClass("calendar-day-selected");

    openDay(day, month, year);

});

/*
    @param day: day of the month
    @param month: month of the year
    @param year: year
    Converts date to string
 */
function toDateString(day, month, year){
    var nameOfMonth = new Date(year, month, day).toLocaleString('de-DE', { month: 'long' });
    var zf_day = ('00'+day).slice(-2);
    return `${zf_day}. ${nameOfMonth} ${currentYear}`;
}

/*
    @param day: day of the month
    @param month: month of the year
    @param year: year
    Returns the name of the weekday.
 */
function getDayName(day, month, year) {
    return new Date(year, month, day).toLocaleString('de-DE', {weekday: 'long'});
}


/*
 ActionListeners for picking a date:
*/
$('#calendar-month-picker > span.month-picker-back').on('click', function () {
    prevMonth();
    redraw();
});
$('#calendar-month-picker > span.month-picker-forward').on('click', function () {
    nextMonth();
    redraw();
});
$('#calendar-month-picker > span.month-picker-back--year').on('click', function () {
    prevYear();
    redraw();
});
$('#calendar-month-picker > span.month-picker-forward--year').on('click', function () {
    nextYear();
    redraw();
});
$('#calendar-today-button').on('click', function () {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    redraw();
});

// Initialize calendar
drawMonthOfYear(currDate.getMonth(), currDate.getFullYear(), calendarRows * calendarCols)
arrangeCalendarDays(calendarRows, calendarCols);
