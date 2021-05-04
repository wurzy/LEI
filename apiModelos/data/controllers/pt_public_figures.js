const public_figuresJS = require('../datasets/pt_public_figures.js');
const public_figures = public_figuresJS.public_figures

const pt_public_figuresAPI = {
    pt_public_figure(lang, i) {
        return public_figures[Math.floor(Math.random() * public_figures.length)]
    },
    get(){
        return public_figures
    }
}

module.exports = pt_public_figuresAPI