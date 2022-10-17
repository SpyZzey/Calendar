function getContrastColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function convertToInputDate(date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);

    return date.getFullYear()+"-"+(month)+"-"+(day) ;
}

function convertToInputDatetime(datetime) {
    let day = ("0" + datetime.getDate()).slice(-2);
    let month = ("0" + (datetime.getMonth() + 1)).slice(-2);
    let hour = ("0" + datetime.getMinutes()).slice(-2);
    let minute = ("0" + datetime.getHours()).slice(-2);

    return datetime.getFullYear() + "-" + (month) + "-" + (day) + " " + (hour) + ":" + (minute);
}

function convertDateTime(dateString) {
    const t = dateString.split(/[- :]/);
    return  new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
}

function getDaysBetweenDates(date1, date2) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function padZero(str, len) {
    len = len || 2;
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}