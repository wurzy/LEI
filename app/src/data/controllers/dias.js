import diasJS from '../datasets/dias.js';
const dias = diasJS.dias

const daysAPI = {
    day(lang){
        return dias[Math.floor(Math.random() * dias.length)]
    }
}

export default daysAPI