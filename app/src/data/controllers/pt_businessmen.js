import businessmenJS from '../datasets/pt_businessmen.js';
const businessmen = businessmenJS.pt_businessmen

const businessmenAPI = {
    pt_businessman(lang) {
        return businessmen[Math.floor(Math.random() * businessmen.length)]
    }
}

export default businessmenAPI