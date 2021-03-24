import mesesJS from '../datasets/meses.js';
const meses = mesesJS.meses

const monthsAPI = {
    month(lang){
        return meses[Math.floor(Math.random() * meses.length)]
    }
}

export default monthsAPI