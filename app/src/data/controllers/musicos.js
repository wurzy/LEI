import musicosJS from '../datasets/musicos';
const musicos = musicosJS.musicos

const musiciansAPI = {
   musician(){
       return musicos[Math.floor(Math.random() * musicos.length)]
   }
}

export default musiciansAPI