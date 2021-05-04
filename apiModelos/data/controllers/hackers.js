const hackerJS = require('../datasets/hackers');
const hackers = hackerJS.hackers

const hackersAPI = {
    hacker(lang, i) {
        return hackers[Math.floor(Math.random() * hackers.length)]
    },
    get(){
        return hackers
    }
}

module.exports = hackersAPI