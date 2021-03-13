import marcasJS from '../datasets/marcas.js';
const marcas = marcasJS.marcas

const Marcas = {
    marca(){
        return marcas[Math.floor(Math.random() * marcas.length)]
    }
}

export default Marcas