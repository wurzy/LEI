import monthsJS from '../datasets/months.js';
const months = monthsJS.months

const monthsAPI = {
    month(lang) {
        return months[lang][Math.floor(Math.random() * months[lang].length)]
    }
}

export default monthsAPI