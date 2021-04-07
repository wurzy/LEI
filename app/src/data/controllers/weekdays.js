import weekdaysJS from '../datasets/weekdays.js';
const weekdays = weekdaysJS.weekdays

const weekdaysAPI = {
    weekday(lang) {
        return weekdays[lang][Math.floor(Math.random() * weekdays[lang].length)]
    }
}

export default weekdaysAPI