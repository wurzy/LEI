import nacionalidadesJS from '../datasets/nacionalidades.js';
const nacionalidades = nacionalidadesJS.nacionalidades

const nationalitiesAPI = {
    nationality(lang){
        return nacionalidades[Math.floor(Math.random() * nacionalidades.length)]
    }
}

export default nationalitiesAPI