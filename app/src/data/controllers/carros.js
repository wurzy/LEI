import carrosJS from '../datasets/carros.js';
const carros = carrosJS.carros

const carsAPI = {
    car_brand(){
        return carros[Math.floor(Math.random() * carros.length)]
    }
}

export default carsAPI