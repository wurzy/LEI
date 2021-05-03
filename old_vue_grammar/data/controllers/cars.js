import carsJS from '../datasets/cars.js';
const cars = carsJS.cars

import _ from 'lodash'

const carsAPI = {
    car_brand(lang, i, sample) {
        if (sample > -1) return _.sampleSize(cars, sample)
        return cars[Math.floor(Math.random() * cars.length)]
    }
}

export default carsAPI