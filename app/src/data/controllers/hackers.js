import hackerJS from '../datasets/hackers';
const hackers = hackerJS.hackers

const hackersAPI = {
    hacker(lang) {
        return hackers[Math.floor(Math.random() * hackers.length)]
    }
}

export default hackersAPI