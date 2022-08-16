$(window).on('load', function() {
    $("body").removeClass("preload");
});

const currDate = new Date();
let currentYear = currDate.getFullYear();
let currentMonth = currDate.getMonth();
let currentDay = currDate.getDate();
const calendarRows = 6;
const calendarCols = 7;

let side_panel = $('#side-content');
let cd = $('#calendar-day')
let cdd = cd.children('#calendar-day-date');
let name = $('#event-add-name');
let desc = $('#event-add-description');
let start_date = $('#event-add-date-start_time');
let end_date = $('#event-add-date-end_time');
let start_datetime = $('#event-add-datetime-start_time');
let end_datetime = $('#event-add-datetime-end_time');
let allday = $('#event-add-cb_allday');
let color = $('#event-add-color');

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
    @param day: day of the month
    @param month: month of the year
    @param year: year
    Converts date to string
 */
function toDateString(day, month, year){
    const nameOfMonth = new Date(year, month, day).toLocaleString('de-DE', {month: 'long'});
    const zf_day = ('00' + day).slice(-2);
    return `${zf_day}. ${nameOfMonth} ${year}`;
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
    @param date: date object
    Converts date to string
 */
function dateToDateString(date){
    const nameOfMonth = date.toLocaleString('de-DE', {month: 'long'});
    const zf_day = ('00' + date.getDate()).slice(-2);
    return `${zf_day}. ${nameOfMonth}` + (date.getFullYear() === (new Date()).getFullYear() ? "" : " " + date.getFullYear());
}

/*
    @param date: date object
    Covnerts date to weekday name
 */
function dateToDayName(date) {
    return date.toLocaleString('de-DE', {weekday: 'long'});
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Updates the date text in the day-overview side panel/modal
    If the side panel is not visible (screen too small), open the day-overview modal instead.
 */
function openDay(day, month, year){
    updateDateText(day, month, year);
    fetchCalendarEventsByDay(day, month, year);

    if (side_panel.css("width") === "0px") {
        openModal('modal-day');
        cd.detach().appendTo('#modal-day');
    }
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Updates the date text in the day-overview side panel/modal
    If the side panel is not visible (screen too small), open the day-overview modal instead.
 */
function openEvent(event_id) {
    $.ajax({
        url: '/lib/ajax/calendar/get.php',
        type: 'POST',
        data: {
            id: event_id
        },
        success: function (data) {
            if(data === "not logged in") {
            } else {
                console.log(data);
                let item = JSON.parse(data);
                let start = new Date((Date).parse(item['start_time'].replace(/[-]/g, '/')));
                let end = new Date((Date).parse(item['end_time'].replace(/[-]/g, '/')));
                let time = "";
                if(item['allday'] === "1") {
                    time = dateToDayName(start) + ", " + dateToDateString(start) + " - " + dateToDayName(end) + ", " + dateToDateString(end);
                } else {
                    let startHoursAndMinutes = start.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
                    let endHoursAndMinutes = end.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
                    time = dateToDayName(start) + ", " + dateToDateString(start) + " (" + startHoursAndMinutes + ")"
                        + " - " + dateToDayName(end) + ", " + dateToDateString(end) + " (" + endHoursAndMinutes + ")";
                }

                $('#event-title').html(item['name']);
                $('#event-description').html(item['description']);
                $('#event-time').html(time.toLocaleString('de-DE'));
                openModal('modal-event');
            }
        }
    });
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Updates the date text in the day-overview side panel/modal
 */
function updateDateText(day, month, year){
    cdd.children('h2').html(toDateString(day, month, year));
    cdd.children('h4').html(getDayName(day, month, year));
    console.log(toDateString(day, month, year));
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Fetches the events for the given date and updates the day-overview side panel/modal.
 */
function fetchCalendarEventsByDay(day, month, year){
    $.ajax({
        url: '/lib/ajax/calendar/events.php',
        type: 'POST',
        data: {
            day: day,
            month: month,
            year: year
        },
        success: function (data) {
            if(data === "not logged in") {
                $('#calendar-day-events').html('<div class="calendar-day-item panel flex-list-item noevents"><span>Keine Termine</span></div>');
            } else {
                let items = JSON.parse(data);
                if(items.length > 0) {
                    $('#calendar-day-events').html("");
                    $.each(items, function (i, item) {
                        createEventItem(item);
                    });
                } else {
                    $('#calendar-day-events').html('<div class="calendar-day-item panel flex-list-item noevents"><span>Keine Termine</span></div>');
                }
            }
        }
    });
}

/*
    @param {string} content - The content of an event
    Adds event to day-overview side panel/modal
 */
function createEventItem(item){
    let eventTime = "Ganzer Tag";
    let color = getContrastColor(item['event_color'], true);
    $('#calendar-day-events').append(
        "<div class='calendar-day-item panel flex-list-item' data-event_id='" + item['calendar_id'] + "'" +
        " style='background-color: " + item['event_color'] + "'>" +
        "<span class='event-add-title' style='color: " + color + "'>" + item['name'] + "</span>" +
        "<h3 class='event-desc' style='color: " + color + "'>" + item['description'] + "</h3>" +
        "<h4 class='event-time' style='color: " + color + "'>" + eventTime + "</h4>" +
        "</div>"
    );
}


/*
    Submits an event to the database.
 */
function submitEvent() {
    let title = name.val();
    let description = desc.val();
    let event_color = color.val();
    let all_day = allday.is(':checked');
    let start = start_date.val();
    let end = end_date.val();
    let type = 'Meeting';

    if(!all_day) {
        start = start_datetime.val();
        end = end_datetime.val();
    }

    if(new Date(start) > new Date(end)) {
        alert("Startdatum muss vor dem Enddatum liegen!");
        return;
    }

    $.ajax({
        url: '/lib/ajax/calendar/add.php',
        type: 'POST',
        data: {
            name: title,
            description: description,
            start_time: start,
            end_time: end,
            all_day: (all_day ? 1 : 0),
            color: event_color,
            type: type
        },
        success: function (data) {
            console.log(data);
            if(data === "not logged in") {
                alert("Du bist nicht eingeloggt!");
            } else if(data === "missing attributes") {
                alert("Bitte fülle alle Felder aus!");
            } else if(data.startsWith("Inserted")){
                let id = data.replace("Inserted: ", "");

                let item = {
                    "calendar_id": id,
                    "name": title,
                    "description": description,
                    "start_time": start,
                    "end_time": end,
                    "allday": (all_day ? 1 : 0),
                    "event_color": event_color,
                    "type": type
                };
                createEventItem(item);
            } else {
                alert("Ein Fehler ist aufgetreten!");
            }
        }
    });
    resetAddEntryModal();
    closeModal('modal-add-event');
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Fetches the events for the given month and updates the calendar.
 */
function fetchCalendarEventsByMonth(month, year){
    $.ajax({
        url: '/lib/ajax/calendar/events.php',
        type: 'POST',
        data: {
            month: month,
            year: year
        },
        success: function (data) {
            // Update calendar events
        }
    });
}

function resetAddEntryModal() {

    $('#event-add-title').html("Neuer Termin");
    name.val("");
    desc.val("");
    allday.prop('checked', true);

    let now = new Date(currentYear, currentMonth, currentDay);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(null)
    now.setSeconds(null)
    start_date.val(now.toISOString().slice(0, 10));
    end_date.val(now.toISOString().slice(0, 10));
    start_datetime.val(now.toISOString().slice(0, -1));
    end_datetime.val(now.toISOString().slice(0, -1));

}

/*
    If a date is clicked, update the current date and open the day-overview side panel/modal
 */
$('#calendar-date-days').on('click', '.day',function () {
    let day = $(this).children("span").html();
    let index = $(this).index();
    let month = currentMonth;
    let year = currentYear;
    currentDay = day;
    if(index <= 7 && day >= 8) {
        month--;
        if(month === 11) year--;
    } else if(index >= 28 && day <= 14) {
        month++;
        if(month === 0) year++;
    }
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
$('#calendar-add-entry-button').on('click', function () {
    resetAddEntryModal();
    openModal('modal-add-event');
});
$('#event-add-cb_allday').on('change', function () {
    if($(this).is(':checked')) {
        $('#event-add-date').removeClass('hidden');
        $('#event-add-datetime').addClass('hidden');
    } else {
        $('#event-add-date').addClass('hidden');
        $('#event-add-datetime').removeClass('hidden');
    }
});
$('#event-add-name').on('input', function () {
    let title = $('#event-add-title');
    if($(this).val() === "") {
        title.html("Neuer Termin");
    } else {
        title.html($(this).val());
    }
});
$('#event-add-submit').on('click', function () {
    submitEvent();
});
$('#calendar-day-events').on('click', '.calendar-day-item', function () {
    openEvent($(this).data('event_id'));
});


// Initialize calendar
drawMonthOfYear(currDate.getMonth(), currDate.getFullYear(), calendarRows * calendarCols)
arrangeCalendarDays(calendarRows, calendarCols);

updateDateText(currDate.getDate(), currDate.getMonth(), currDate.getFullYear());
fetchCalendarEventsByDay(currDate.getDate(), currDate.getMonth(), currDate.getFullYear());
