import top100JS from '../datasets/pt_top100_celebrities';
const top100 = top100JS.pt_top100_celebrities

const pt_top100_celebritiesAPI = {
    pt_top100_celebrity(lang) {
        return top100[Math.floor(Math.random() * top100.length)]
    }
}

export default pt_top100_celebritiesAPI