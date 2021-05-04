const businessmenJS = require('../datasets/pt_businessmen.js');
const businessmen = businessmenJS.pt_businessmen

const businessmenAPI = {
    pt_businessman(lang, i) {
        return businessmen[Math.floor(Math.random() * businessmen.length)]
    },
    get(){
        return businessmen
    }
}

module.exports = businessmenAPI