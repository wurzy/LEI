const musiciansJS = require('../datasets/musicians');
const musicians = musiciansJS.musicians

const musiciansAPI = {
    musician(lang, i) {
        return musicians[Math.floor(Math.random() * musicians.length)]
    }
}

module.exports = musiciansAPI