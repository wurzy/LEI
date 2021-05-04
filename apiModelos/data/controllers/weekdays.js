const weekdaysJS = require('../datasets/weekdays.js');
const weekdays = weekdaysJS.weekdays

const weekdaysAPI = {
    weekday(lang, i) {
        return weekdays[lang][Math.floor(Math.random() * weekdays[lang].length)]
    },
    get(){
        return weekdays
    }
}

module.exports = weekdaysAPI