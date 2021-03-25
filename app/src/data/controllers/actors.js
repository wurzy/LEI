import actorsJS from '../datasets/actors.js';
const actors = actorsJS.actors

const actorsAPI = {
    actor(lang) {
        return actors[Math.floor(Math.random() * actors.length)]
    }
}

export default actorsAPI