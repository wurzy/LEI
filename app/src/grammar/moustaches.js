import {loremIpsum} from 'lorem-ipsum'
import moment from 'moment'

function hex(x) { return Math.floor(x).toString(16) }

function getDecimalsCount(min, max) {
    var decimals = 3; //3 caracteres decimais por predefinição
    const maxStr = String(max);
    const minStr = String(min);

    if (minStr.includes('.')) decimals = minStr.split('.')[1].length;
    if (maxStr.includes('.')) {
        var maxDecimals = maxStr.split('.')[1].length;
        if (decimals < maxDecimals) decimals = maxDecimals;
    }

    return decimals
}

function formatNumber(num) {
    var x = num.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace( rgx, '$1' + ',' + '$2' );
    }
    return x1 + x2;
}

function objectId() {
    return hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

function guid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

function index(i) { return i }

function boolean() { return Math.random() < 0.5 }

function integer(min, max, unit) {
    if (!unit) return Math.floor(Math.random() * (min - max + 1) + max)
    return String(Math.floor(Math.random() * (max - min + 1) + min)) + unit
}

function floating(min, max, decimals, format) {
    decimals = decimals == null ? getDecimalsCount(min,max) : decimals
    var random = min + (max - min) * Math.random();
    var rounded = Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)

    if (format != null) {
        var split = formatNumber(String(rounded)).split('.')
        rounded = split[0].replace(/,/g, format.int_sep) + format.dec_sep + split[1] + format.unit
    }
    return rounded
}

function position(lat, long) {
    if (!lat) return "(" + floating(-90,90,5) + ", " + floating(-180,180,5) + ")"
    else {
        if (lat.min > lat.max) {var latmax = lat.min; lat.min = lat.max; lat.max = latmax}
        if (long.min > long.max) {var longmax = long.min; long.min = long.max; long.max = longmax}

        return "(" + floating(lat.min, lat.max, 5) + ", " + floating(long.min, long.max, 5) + ")"
    }
}

function phone(extension) {
    var number = "9" + random([1,2,3,6])
    while (number.length < 11) {
        if (number.length == 3 || number.length == 7) number += " "
        else number += (Math.floor(Math.random() * 9) + 1)
    }
    return extension ? ("+351 " + number) : number
}

function date(start, end, format) {
    var random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return moment(random).format(format.replace(/A/g, "Y"))
}

function lorem(count, units) { return loremIpsum({ count, units }) }

function random(values) { return values[Math.floor(Math.random() * values.length)] }

export default {
    objectId,
    guid,
    index,
    boolean,
    integer,
    floating,
    position,
    phone,
    date,
    lorem,
    random
}