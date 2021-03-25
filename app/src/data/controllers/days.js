import daysJS from '../datasets/days.js';
const days = daysJS.days

const daysAPI = {
    day(lang) {
        return days[lang][Math.floor(Math.random() * days[lang].length)]
    }
}

export default daysAPI