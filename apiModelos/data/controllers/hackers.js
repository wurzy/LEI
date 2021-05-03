const hackerJS = require('../datasets/hackers');
const hackers = hackerJS.hackers

const hackersAPI = {
    hacker(lang, i) {
        return hackers[Math.floor(Math.random() * hackers.length)]
    }
}

module.exports = hackersAPI