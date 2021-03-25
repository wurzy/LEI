import religionsJS from '../datasets/religions.js';
const religions = religionsJS.religions

const religionsAPI = {
    religion(lang) {
        return religions[lang][Math.floor(Math.random() * religions[lang].length)]
    }
}

export default religionsAPI