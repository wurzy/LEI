import musiciansJS from '../datasets/musicians';
const musicians = musiciansJS.musicians

const musiciansAPI = {
    musician(lang, i) {
        return musicians[Math.floor(Math.random() * musicians.length)]
    }
}

export default musiciansAPI