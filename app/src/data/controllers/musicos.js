import musicosJS from '../datasets/musicos';
const musicos = musicosJS.musicos

const musiciansAPI = {
   musician(lang){
       return musicos[Math.floor(Math.random() * musicos.length)]
   }
}

export default musiciansAPI