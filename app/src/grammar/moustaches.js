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

function boolean() { return Math.random() < 0.5 }

function integer(min_arg, max_arg, size_arg, unit, i) {
    var min = Array.isArray(min_arg) ? min_arg[i] : min_arg
    var max = Array.isArray(max_arg) ? max_arg[i] : max_arg
    var size = Array.isArray(size_arg) ? size_arg[i] : size_arg

    var rand = Math.floor(Math.random() * ((max+1) - min) + min).toString()
    var negative = false, pad = false

    if (rand[0] == '-') {negative = true; rand = rand.substr(1)}
    while (rand.length < size) {pad = true; rand = "0" + rand}

    if (negative) rand = '-' + rand
    if (!pad) rand = parseInt(rand)
    
    return unit == null ? rand : (rand + unit)
}

function floating(min_arg, max_arg, decimals_arg, format, i) {
    var min = Array.isArray(min_arg) ? min_arg[i] : min_arg
    var max = Array.isArray(max_arg) ? max_arg[i] : max_arg
    var decimals = Array.isArray(decimals_arg) ? decimals_arg[i] : decimals_arg

    decimals = decimals == null ? getDecimalsCount(min,max) : decimals
    var random = min + (max - min) * Math.random();
    var rounded = Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  
    if (format != null) {
        var split = formatNumber(String(rounded)).split('.')
        rounded = split[0].replace(/,/g, format[1])
  
        if (split[1] != null) rounded += format[3] + split[1] 
        if (format.length == 7) rounded += format[6]
    }
    return rounded
}

function position(lat_arg, long_arg, i) {
    var lat = (lat_arg != null && Array.isArray(lat_arg[0])) ? lat_arg[i] : lat_arg
    var long = (long_arg != null && Array.isArray(long_arg[0])) ? long_arg[i] : long_arg

    if (!lat) return "(" + floating(-90,90,5) + ", " + floating(-180,180,5) + ")"
    else {
        if (lat[0] > lat[1]) {var latmax = lat[0]; lat[0] = lat[1]; lat[1] = latmax}
        if (long[0] > long[1]) {var longmax = long[0]; long[0] = long[1]; long[1] = longmax}

        return "(" + floating(lat[0], lat[1], 5) + ", " + floating(long[0], long[1], 5) + ")"
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

function newDate(str) {
    var split = str.split("/")
    return new Date(parseInt(split[2]), parseInt(split[1]), parseInt(split[0]))
}

function date(start, end, format) {
    start = newDate(start)
    end = !end ? new Date() : newDate(end)

    var random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return moment(random).format(format.replace(/A/g, "Y"))
}

function lorem(count, units) { return loremIpsum({ count, units }) }

function random(values) { return values[Math.floor(Math.random() * values.length)] }

function range(init, end, step) {
    if (end == null) {
      end = init; init = 0
      step = init < end ? 1 : -1
    }
    else if (step == null) step = init < end ? 1 : -1

    var range = []
    for (let i = init; (init < end) ? i < end : i > end; i += step) range.push(i)
    return range
}

export default {
    objectId,
    guid,
    boolean,
    integer,
    floating,
    position,
    phone,
    date,
    lorem,
    random,
    range
}