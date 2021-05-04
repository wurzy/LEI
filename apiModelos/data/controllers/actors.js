const actorsJS = require('../datasets/actors.js');
const actors = actorsJS.actors

const actorsAPI = {
    actor(lang, i) {
        return actors[Math.floor(Math.random() * actors.length)]
    },
    get(){
        return actors
    }
}

module.exports = actorsAPI