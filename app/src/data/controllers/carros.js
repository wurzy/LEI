import carrosJS from '../datasets/carros.js';
const carros = carrosJS.carros

const Carros = {
    marca(){
        return carros[Math.floor(Math.random() * carros.length)]
    }
}

export default Carros