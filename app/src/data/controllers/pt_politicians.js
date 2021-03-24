import politiciansJS from '../datasets/pt_politicians';
const politicians = politiciansJS.politicians

const pt_politicianAPI = {
    pt_politician(lang) {
        return politicians[Math.floor(Math.random() * politicians.length)]
    }
}

export default pt_politicianAPI