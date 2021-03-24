import writersJS from '../datasets/writers.js';
const writers = writersJS.writers

const writersAPI = {
    writer(lang) {
        return writers[Math.floor(Math.random() * writers.length)]
    }
}

export default writersAPI