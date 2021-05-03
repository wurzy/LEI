const loremIpsum = require("lorem-ipsum").loremIpsum;
const moment = require('moment')
const getRandomValues = require('get-random-values');

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

function objectId(i) {
    return hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

function guid(i) {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

function boolean(i) { return Math.random() < 0.5 }

function integer(min, max, size, unit, i) {
    min = Array.isArray(min) ? min[i] : min
    max = Array.isArray(max) ? max[i] : max
    size = Array.isArray(size) ? size[i] : size

    var rand = Math.floor(Math.random() * ((max+1) - min) + min).toString()
    var negative = false, pad = false

    if (rand[0] == '-') {negative = true; rand = rand.substr(1)}
    while (rand.length < size) {pad = true; rand = "0" + rand}

    if (negative) rand = '-' + rand
    if (!pad) rand = parseInt(rand)
    
    return unit == null ? rand : (rand + unit)
}

function floating(min, max, decimals, format, i) {
    min = Array.isArray(min) ? min[i] : min
    max = Array.isArray(max) ? max[i] : max
    decimals = Array.isArray(decimals) ? decimals[i] : decimals
    
    decimals = decimals == null ? getDecimalsCount(min,max) : decimals
    var random = min + (max - min) * Math.random();
    var rounded = Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  
    if (format != null) {
        var split = formatNumber(String(rounded)).split('.')
        rounded = split[0].replace(/,/g, format[1])
  
        if (split[1] != null) rounded += format[3] + split[1] 
        if (format.length > 6) rounded += format.substring(6)
    }
    return rounded
}

function position(lat, long, i) {
    lat = (lat != null && Array.isArray(lat[0])) ? lat[i] : lat
    long = (long != null && Array.isArray(long[0])) ? long[i] : long

    if (!lat) return "(" + floating(-90,90,5) + ", " + floating(-180,180,5) + ")"
    else {
        if (lat[0] > lat[1]) {var latmax = lat[0]; lat[0] = lat[1]; lat[1] = latmax}
        if (long[0] > long[1]) {var longmax = long[0]; long[0] = long[1]; long[1] = longmax}

        return "(" + floating(lat[0], lat[1], 5) + ", " + floating(long[0], long[1], 5) + ")"
    }
}

function pt_phone_number(extension, i) {
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

function date(start, end, format, i) {
    start = Array.isArray(start) ? start[i] : start
    end = Array.isArray(end) ? end[i] : end
    
    start = newDate(start)
    end = !end ? new Date() : newDate(end)

    var random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return moment(random).format(format.replace(/A/g, "Y"))
}

function lorem(count, units, i) {
    count = Array.isArray(count) ? count[i] : count
    return loremIpsum({ count, units })
}

function random(values, i, sample) {
    values = values.map(x => Array.isArray(x) ? x[i] : x)
    if (sample > -1) return _.sampleSize(values, sample)
    return values[Math.floor(Math.random() * values.length)]
}

function range(init, end, step, i) {
    init = Array.isArray(init) ? init[i] : init

    if (end == null) {
      end = init; init = 0
      step = init < end ? 1 : -1
    }
    else {
        end = Array.isArray(end) ? end[i] : end
        if (step == null) step = init < end ? 1 : -1
        else step = Array.isArray(step) ? step[i] : step
    }

    var range = []
    for (let i = init; (init < end) ? i < end : i > end; i += step) range.push(i)
    return range
}

module.exports = {
    objectId,
    guid,
    boolean,
    integer,
    floating,
    position,
    pt_phone_number,
    date,
    lorem,
    random,
    range
}