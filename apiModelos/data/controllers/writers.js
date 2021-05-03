const writersJS = require('../datasets/writers.js');
const writers = writersJS.writers

const writersAPI = {
    writer(lang, i) {
        return writers[Math.floor(Math.random() * writers.length)]
    }
}

module.exports = writersAPI