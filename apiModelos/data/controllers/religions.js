const religionsJS = require('../datasets/religions.js');
const religions = religionsJS.religions

const religionsAPI = {
    religion(lang, i) {
        return religions[lang][Math.floor(Math.random() * religions[lang].length)]
    }
}

module.exports = religionsAPI