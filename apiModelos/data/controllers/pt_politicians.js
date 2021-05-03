const politiciansJS = require('../datasets/pt_politicians');
const politicians = politiciansJS.politicians

const pt_politicianAPI = {
    pt_politician(lang, i) {
        return politicians[Math.floor(Math.random() * politicians.length)]
    }
}

module.exports = pt_politicianAPI