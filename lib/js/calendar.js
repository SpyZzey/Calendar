$(window).on('load', function() {
    $("body").removeClass("preload");
});
let firstLoad = true;
const currDate = new Date();

let currentYear = currDate.getFullYear();
let currentMonth = currDate.getMonth();

let selectedYear = currentYear;
let selectedMonth = currentMonth;
let selectedDay = currDate.getDate();

const calendarRows = 6;
const calendarCols = 7;

let side_panel = $('#side-content');
let calendarDay = $('#calendar-day')
let calendarDayDate = calendarDay.children('#calendar-day-date');
let eventName = $('#event-add-name');
let eventDescription = $('#event-add-description');
let eventStartDate = $('#event-add-date-start_time');
let eventEndDate = $('#event-add-date-end_time');
let eventStartDatetime = $('#event-add-datetime-start_time');
let eventEndDatetime = $('#event-add-datetime-end_time');
let eventAllday = $('#event-add-cb_allday');
let eventColor = $('#event-add-color');

/*
    @param month: the month
    @param year: the year
    Calculates the next month after month, year
 */
function getNextMonth(month, year) {
    if(year === new Date().getFullYear() + 100 && month === 11) return {month: month, year: year};

    if(month === 11) {
        year++;
        month = 0;
    } else {
        month++;
    }
    return {month: month, year: year};
}
/*
    @param month: the month
    @param year: the year
    Calculates the previous month after month, year
 */
function getPreviousMonth(month, year){
    if(currentYear === new Date().getFullYear() - 100 && currentMonth === 0) return {month: month, year: year};

    if(month === 0) {
        year--;
        month = 11;
    } else {
        month--;
    }
    return {month: month, year: year};
}

/*
    Adds one month to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function nextMonth() {
    let next = getNextMonth(currentMonth, currentYear);
    currentMonth = next.month;
    currentYear = next.year;
}
/*
    Removes one month to the month/year pointer. currentYear must be in [YEAR - 100; YEAR + 100] where YEAR is the actual year.
 */
function prevMonth(){
    let previous = getPreviousMonth(currentMonth, currentYear);
    currentMonth = previous.month;
    currentYear = previous.year;
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
    const firstWeekdayOfMonth = getWeekdayOfDate(1, month, year);

    // Remove all day-elements from before
    $("#calendar-date-days").empty();

    // Set name of month to month-picker-text
    $("#calendar-month-picker > span.month-picker-text").text(nameOfMonth + " " + year);

    // Insert the days as grid-items to the DOM tree.
    insertDays(days, firstWeekdayOfMonth, daysOfMonthBefore, numOfVisibleDays);
    fetchCalendarEventsByMonth(currentMonth, currentYear, days, firstWeekdayOfMonth);
}

/*
    @param days: number of days in the month
    @param firstWeekdayOfMonth: The weekday of the first day. The number of days rendered before the 1st.
    @param daysOfMonthBefore: number of days in the previous month
    @param numOfVisibleDays: number of days that are visible in the calendar
    Insert the days as grid-items to the DOM tree.
*/
function insertDays(days, firstWeekdayOfMonth, daysOfMonthBefore, numOfVisibleDays) {
    for(let i = 0; i < numOfVisibleDays; i++){
        if(i < firstWeekdayOfMonth) {
            // If the first day of a month is not on a monday, display last days of previous month.
            $("#calendar-date-days").append("<div class='grayed-out'><span>" + (daysOfMonthBefore - firstWeekdayOfMonth + i + 1) + "</span></div>");
        } else if (i - firstWeekdayOfMonth < days) {
            // Display days of the current month
            const date = (i - firstWeekdayOfMonth + 1);
            if(isToday(new Date(currentYear, currentMonth, date))) {
                $("#calendar-date-days").append("<div class='current-date'><span>" + date + "</span></div>");
            } else {
                $("#calendar-date-days").append("<div><span>" + date + "</span></div>");
            }
        } else if (i >= days) {
            // Display first days of next month, to fill the remaining space
            $("#calendar-date-days").append("<div class='grayed-out'><span>" + (i - firstWeekdayOfMonth - days + 1) + "</span></div>");
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
    $('.calendar-grid-content > div:not(.cal-event-container)').each(function (i, obj){
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


}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Updates the date text in the day-overview side panel/modal
    If the side panel is not visible (screen too small), open the day-overview modal instead.
 */
function openEvent(eventId) {
    $.ajax({
        url: '/lib/ajax/calendar/get.php?id=' + eventId,
        type: 'GET',
        success: function (data) {
            if(data !== "not logged in") {
                let item = JSON.parse(data);
                let start = new Date((Date).parse(item['start_time'].replace(/[-]/g, '/')));
                let end = new Date((Date).parse(item['end_time'].replace(/[-]/g, '/')));
                let time = "";
                if(item['all_day'] === "1") {
                    time = dateToDayName(start) + ", " + dateToDateString(start) + " - " + dateToDayName(end) + ", " + dateToDateString(end);
                } else {
                    let startHoursAndMinutes = start.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
                    let endHoursAndMinutes = end.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
                    time = dateToDayName(start) + ", " + dateToDateString(start) + " (" + startHoursAndMinutes + ")"
                        + " - " + dateToDayName(end) + ", " + dateToDateString(end) + " (" + endHoursAndMinutes + ")";
                }
                $('#event-title').text(item['name']);
                $('#event-description').text(item['description']);
                $('#event-time').text(time.toLocaleString('de-DE'));
                $('#modal-event').data('event_id', eventId);
                openModal('modal-event');
            }
        }
    });
}

function editEvent(eventId) {
    $.ajax({
        url: '/lib/ajax/calendar/get.php?id=' + eventId,
        type: 'GET',
        success: function (data) {
            if(data !== "not logged in") {
                let item = JSON.parse(data);
                let start = new Date((Date).parse(item['start_time'].replace(/[-]/g, '/')));
                let end = new Date((Date).parse(item['end_time'].replace(/[-]/g, '/')));

                if(item['allday'] === "1") {
                    $('#event-add-date').removeClass('hidden');
                    $('#event-add-datetime').addClass('hidden');
                } else {
                    $('#event-add-date').addClass('hidden');
                    $('#event-add-datetime').removeClass('hidden');
                }
                $('#event-add-date-start_time').val(convertToInputDate(start));
                $('#event-add-date-end_time').val(convertToInputDate(end));
                $('#event-add-datetime-start_time').val(convertToInputDatetime(start));
                $('#event-add-datetime-end_time').val(convertToInputDatetime(end));

                $('#event-add-title').text(item['name']);
                $('#event-add-name').val(item['name']);
                $('#event-add-description').val(item['description']);
                $('#event-add-all_day').prop('checked', item['all_day'] === "1");
                $('#event-add-color').val(item['event_color']).parents('.clr-field').css('color', item['event_color']);
                $('#event-add-submit').data('event_id', eventId).data('action', 'edit');
                $('#modal-add-event').data('event_id');
                openModal('modal-add-event');
            }
        }
    });
}

function deleteEvent(eventId) {
    $.ajax({
        url: '/lib/ajax/calendar/delete.php?id=' + eventId,
        type: 'GET',
        success: function (data) {
            if(data === "success") {
                closeModal('modal-event');
                redraw();
                openDay(selectedDay, selectedMonth, selectedYear);
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
    calendarDayDate.children('h2').text(toDateString(day, month, year));
    calendarDayDate.children('h4').text(getDayName(day, month, year));
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
    @param {string} title - The title of the event
    @param {string} description - The description of the event
    @param {string} event_color - The color of the event
    @param {boolean} all_day - Whether the event is all day or not
    @param {string} start - The start date of the event
    @param {string} end - The end date of the event
    @param {string} type - The type of the event
    Submit Event to the database, Reset the form and close the modal
 */
function submitEvent(edit_type) {
    let eventId = $('#event-add-submit').data('event_id');
    let title = eventName.val();
    let description = eventDescription.val();
    let event_color = eventColor.val();
    let all_day = eventAllday.is(':checked');
    let start = eventStartDate.val();
    let end = eventEndDate.val();
    let type = 'Meeting';

    if(!all_day) {
        start = eventStartDatetime.val();
        end = eventEndDatetime.val();
    }

    if(new Date(start) > new Date(end)) {
        spawnBanner("error", "Startdatum muss vor dem Enddatum liegen");
        return;
    }

    pushEventToServer(edit_type, eventId, title, description, event_color, all_day, start, end, type);
    resetAddEntryModal();
    closeModal('modal-add-event');
}

/*
    @param {string} title - The title of the event
    @param {string} description - The description of the event
    @param {string} event_color - The color of the event
    @param {boolean} all_day - Whether the event is all day or not
    @param {string} start - The start date of the event
    @param {string} end - The end date of the event
    @param {string} type - The type of the event
    Pushes an event to the server
 */
function pushEventToServer(edit_type, eventId, title, description, event_color, all_day, start, end, type) {
    $.ajax({
        url: '/lib/ajax/calendar/' + edit_type + '.php',
        type: 'POST',
        data: {
            id: eventId,
            name: title,
            description: description,
            start_time: start,
            end_time: end,
            all_day: (all_day ? 1 : 0),
            color: event_color,
            type: type
        },
        success: function (data) {
            if(data === "not logged in") {
                spawnBanner("error", "Bitte fülle alle Pflichtfelder aus!");
            } else if(data.startsWith("missing attributes")) {
                spawnBanner("info", "Bitte fülle alle Pflichtfelder aus!");
            } else if(data.startsWith("success")){
                redraw();
                openDay(selectedDay, selectedMonth, selectedYear);
            } else {
                spawnBanner("error", "Fehler beim Speichern des Termins!");
            }
        }
    });
}

/*
    @param {string} day - The day of the month to open [0-31].
    @param {string} month - The month to open [0-11].
    @param {string} year - The year to open.
    Fetches the events for the given month and updates the calendar.
 */
function fetchCalendarEventsByMonth(month, year, days, firstWeekdayOfMonth){
    $.ajax({
        url: '/lib/ajax/calendar/events.php?month=' + month + '&year=' + year,
        type: 'GET',
        success: function (data) {
            if(data !== "not logged in") {
                updateMonthView(data, firstWeekdayOfMonth);
            }
        }
    });
}

/*
    @param {date} a - The first date to compare.
    @param {date} b - The second date to compare.
    Returns the difference between two dates a and b in days.
 */
function dateCompare(a, b) {
    let dateStartA = new Date(a['start_time']);
    let dateStartB = new Date(b['start_time']);
    let dateEndA = new Date(a['end_time']);
    let dateEndB = new Date(b['end_time']);
    return getDaysBetweenDates(dateStartB, dateEndB) - getDaysBetweenDates(dateStartA, dateEndA);
}

/*
    @param {string} data - JSON Data of the events received from the server.
    @param {int} firstWeekdayOfMonth: The weekday of the first day. The number of days rendered before the 1st.
    Updates the calendar month view with the given events.
 */
function updateMonthView(data, firstWeekdayOfMonth) {
    let items = JSON.parse(data);
    items.sort(dateCompare);
    if(items.length > 0) {
        $.each(items, function (i, item) {
            updateMonthEventView(items, item, i, firstWeekdayOfMonth);
        });
    }
}

/*
    @param {array} events - An array of all events in the current month.
    @param {object} currentEvent - The current event to update.
    @param {int} i - The index of the current event.
    @param {int} firstWeekdayOfMonth: The weekday of the first day. The number of days rendered before the 1st.
    Updates the calendar month view with the given event.
 */
function updateMonthEventView(events, currentEvent, i, firstWeekdayOfMonth){
    const startTime = convertDateTime(currentEvent['start_time']);
    const endTime = convertDateTime(currentEvent['end_time']);
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    const previousMonth = getPreviousMonth(currentMonth, currentYear);
    const nextMonth = getNextMonth(currentMonth, currentYear);
    const visibleDaysBeforeCurrentMonth = daysInMonth(previousMonth.month, previousMonth.year) - firstWeekdayOfMonth;
    const visibleDaysAfterCurrentMonth = calendarRows*calendarCols - firstWeekdayOfMonth - daysInCurrentMonth;
    const dateOfFirstVisibleDay = new Date(previousMonth.year, previousMonth.month, visibleDaysBeforeCurrentMonth);
    const dateOfLastVisibleDay = new Date(nextMonth.year, nextMonth.month, visibleDaysAfterCurrentMonth);

    if (startTime < dateOfFirstVisibleDay && endTime < dateOfFirstVisibleDay) return;
    if(startTime > dateOfLastVisibleDay) return;

    let startPosition = firstWeekdayOfMonth;
    let endPosition = daysInCurrentMonth + firstWeekdayOfMonth - 1;

    startPosition = calculateEventPosition(startPosition, startTime, firstWeekdayOfMonth);
    endPosition = calculateEventPosition(endPosition, endTime, firstWeekdayOfMonth);

    let startRow = Math.floor(startPosition / 7) + 1;
    let endRow = Math.floor(endPosition / 7) + 1;

    insertEventIntoCalendar(events, currentEvent, startRow, endRow, startPosition, endPosition);
}

/*
    @param {array} events - An array of all events in the current month.
    @param {object} currentEvent - The current event to insert.
    @param {int} startRow - The row to start the event.
    @param {int} endRow - The row to end the event.
    @param {int} startPosition - The offset position from the grid element to start the event.
    @param {int} endPosition - The offset position from the grid element to end the event.
    Inserts the given event into the calendar.
*/
function insertEventIntoCalendar(events, currentEvent, startRow, endRow, startPosition, endPosition){
    for(let i = 0; i < endRow - startRow + 1; i++){
        let row = startRow + i;
        let startDay = 1;
        let endDay = 7;
        if(i === 0){
            startDay = startPosition % 7 + 1;
        }
        if(i === endRow - startRow) {
            endDay = endPosition % 7 + 1;
            endDay = endDay - startDay + 1;
        }
        let eventsAboveCurrentEvent = countEventsIntersectCurrentEvent(events, currentEvent, i);
        createMonthEventViewItem(currentEvent, eventsAboveCurrentEvent, row, startDay, endDay);
    }
}

/*
    @param {int} currentPos - Current position of the start/end of event.
    @param {date} time - The time when the event starts/ends.
    @param {int} firstWeekdayOfMonth - The weekday of the first day. The number of days rendered before the 1st.
    Calculates the offset position from the first day of an event time (start/end) in the calendar.
 */
function calculateEventPosition(currentPos, time, firstWeekdayOfMonth) {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);

    if(time < monthStart) {
        let daysBeforeStart = getDaysBetweenDates(monthStart, time);
        if(daysBeforeStart > firstWeekdayOfMonth) daysBeforeStart = firstWeekdayOfMonth;
        currentPos = firstWeekdayOfMonth - daysBeforeStart;
    } else if(time > monthEnd){
        let daysAfterMonth = getDaysBetweenDates(monthEnd, time);
        let daysAfter = calendarRows * calendarCols - daysInCurrentMonth - firstWeekdayOfMonth;
        if(daysAfterMonth > daysAfter) daysAfterMonth = daysAfter;
        currentPos = daysInCurrentMonth + firstWeekdayOfMonth + daysAfterMonth - 1;
    } else if(time.getMonth() === currentMonth && time.getFullYear() === currentYear) {
        currentPos = time.getDate() - 1 + firstWeekdayOfMonth;
    }
    return currentPos;
}

/*
    @param {array} events - An array of all events in the current month.
    @param {object} currentEvent - The current event.
    Counts the number of events that intersect with the current event.
 */
function countEventsIntersectCurrentEvent(events, currentEvent){
    let count = 0;

    $.each(events, function (i, event) {
        let eventStart = convertDateTime(event['start_time']);
        let eventEnd = convertDateTime(event['end_time']);
        let currentEventStart = convertDateTime(currentEvent['start_time']);
        let currentEventEnd = convertDateTime(currentEvent['end_time']);
        if(event === currentEvent) return false;

        if ((eventStart <= currentEventStart && eventEnd >= currentEventStart)
            || (eventStart >= currentEventStart && eventStart <= currentEventEnd)) {
            if(event['eventsAbove'] != null && event['eventsAbove'] >= count){
                count = event['eventsAbove'] + 1;
            } else {
                count++;
            }

        }
    });
    currentEvent['eventsAbove'] = count;
    return count;
}

/*
    @param {eventObject} event - The current event
    @param {int} intersectingEvents = The number of events that intersect with the current event.
    @param {int} row - The row of the calendar to insert the event into.
    @param {int} column - The column of the week to insert the event into.
    @param {int} span - The number of days the event spans.
 */
function createMonthEventViewItem(event, intersectingEvents, row, column, span){
    const itemName = event['name'];
    const backgroundColor = event['event_color'];
    const color = getContrastColor(backgroundColor, true);

    $('#calendar-date-days').append(
        '<div class="cal-event-container relative" style="grid-column: ' +  column + ' / span ' + span + '; grid-row: ' + row + '">'
            + '<div class="cal-event" style="margin-top: '+ (35 + 25 * (intersectingEvents)) + 'px; background-color: ' + backgroundColor + '; color: ' + color + '">' + itemName +'</div>'
        + '</div>'
    );
}


/*
    @param {int} day - The day of the month to open [0-31].
    @param {int} month - The month to open [0-11].
    @param {int} year - The year to open.
    Fetches the events for the given date and updates the day-overview side panel/modal.
 */
function fetchCalendarEventsByDay(day, month, year){
    $.ajax({
        url: '/lib/ajax/calendar/events.php?day=' + day + '&month=' + month + '&year=' + year,
        type: 'GET',
        success: function (data) {
            if(data === "not logged in") loadEmptyDayView();
            else loadDayView(data);

            showDayView();
        }
    });
}

/*
    Resets the day-overview side panel/modal to its default state/empty.
 */
function loadEmptyDayView(){
    $('#calendar-day-events').html('<div class="calendar-day-item panel flex-list-item noevents"><span>Keine Termine</span></div>');
}

/*
    @param {string} data - JSON string of all events for the given date.
    Updates the day-overview side panel/modal with the given events.
 */
function loadDayView(data) {
    let items = JSON.parse(data);

    // Loads empty day view if no events are found
    if(items.length === 0) {
        loadEmptyDayView();
        return;
    }

    // Loads all events for the given date
    $('#calendar-day-events').text("");
    $.each(items, function (i, item) {
        createEventItem(item);
    });
}

/*
    Opens the day overview modal if its not on startup
 */
function showDayView() {
    calendarDay.hide().show(0);
    if(firstLoad){
        firstLoad = false;
        return;
    }
    if (side_panel.css("width") === "0px") {
        openModal('modal-day');
        calendarDay.detach().appendTo('#modal-day');
    }
}

function resetAddEntryModal() {
    $('#event-add-title').text("Neuer Termin");
    eventName.val("");
    eventDescription.val("");
    eventAllday.prop('checked', true);
    $('#event-add-submit').data('event_id', "-1").data('action', "create");

    resetAddEntryDateSelection();
}

function resetAddEntryDateSelection() {
    let now = new Date(selectedYear, selectedMonth, selectedDay);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(null)
    now.setSeconds(null)
    eventStartDate.val(now.toISOString().slice(0, 10));
    eventEndDate.val(now.toISOString().slice(0, 10));
    eventStartDatetime.val(now.toISOString().slice(0, -1));
    eventEndDatetime.val(now.toISOString().slice(0, -1));
}

/*
    If a date is clicked, update the current date and open the day-overview side panel/modal
 */
$('#calendar-date-days').on('click', '.day',function () {
    let day = $(this).children("span").text();
    let index = $(this).index();
    selectedYear = currentYear;
    selectedMonth = currentMonth;
    selectedDay = day;
    if(index <= 7 && day >= 8) {
        selectedMonth--;
        if(selectedMonth === 11) selectedYear--;
    } else if(index >= 28 && day <= 14) {
        selectedMonth++;
        if(selectedMonth === 0) selectedYear++;
    }
    if(selectedMonth === 12) {
        selectedYear++;
        selectedMonth = 0;
    } else if(selectedMonth === -1) {
        selectedYear--;
        selectedMonth = 11;
    }
    selectDay($(this));
    openDay(selectedDay, selectedMonth, selectedYear);
});

function selectDay(dayElement) {
    dayElement.addClass("calendar-day-selected").siblings().removeClass("calendar-day-selected");
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
        title.text("Neuer Termin");
    } else {
        title.text($(this).val());
    }
});
$('#event-add-submit').on('click', function () {
    if($(this).data('action') === "edit") {
        submitEvent('edit');
    } else {
        submitEvent('add');
    }
});
$('#button-event-edit').on('click', function () {
    editEvent($(this).parents('#modal-event').data('event_id'));
});
$('#button-event-delete').on('click', function () {
    deleteEvent($(this).parents('#modal-event').data('event_id'));
});
$('#calendar-day-events').on('click', '.calendar-day-item', function () {
    openEvent($(this).data('event_id'));
});


// Initialize calendar
drawMonthOfYear(currDate.getMonth(), currDate.getFullYear(), calendarRows * calendarCols)
arrangeCalendarDays(calendarRows, calendarCols);

updateDateText(currDate.getDate(), currDate.getMonth(), currDate.getFullYear());
fetchCalendarEventsByDay(currDate.getDate(), currDate.getMonth(), currDate.getFullYear());
