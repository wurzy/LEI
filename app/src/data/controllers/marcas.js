import marcasJS from '../datasets/marcas.js';
const marcas = marcasJS.marcas

const brandsAPI = {
    brand(lang){
        return marcas[Math.floor(Math.random() * marcas.length)]
    }
}

export default brandsAPI