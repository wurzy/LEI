const monthsJS = require('../datasets/months.js');
const months = monthsJS.months

const monthsAPI = {
    month(lang, i) {
        return months[lang][Math.floor(Math.random() * months[lang].length)]
    }
}

module.exports = monthsAPI