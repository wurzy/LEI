import carrosJS from '../datasets/carros.js';
const carros = carrosJS.carros

const carsAPI = {
    brand(){
        return carros[Math.floor(Math.random() * carros.length)]
    }
}

export default carsAPI