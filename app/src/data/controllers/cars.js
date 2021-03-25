import carsJS from '../datasets/cars.js';
const cars = carsJS.cars

const carsAPI = {
    car_brand(lang) {
        return cars[Math.floor(Math.random() * cars.length)]
    }
}

export default carsAPI