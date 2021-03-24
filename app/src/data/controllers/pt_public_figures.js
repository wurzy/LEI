import public_figuresJS from '../datasets/pt_public_figures.js';
const public_figures = public_figuresJS.public_figures

const pt_public_figuresAPI = {
    pt_public_figure(lang) {
        return public_figures[Math.floor(Math.random() * public_figures.length)]
    }
}

export default pt_public_figuresAPI