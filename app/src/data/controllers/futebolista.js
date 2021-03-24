import playerJS from '../datasets/futebolista';
const players = playerJS.futebolistas

const soccer_playerAPI = {
   soccer_player(lang){
       return players[Math.floor(Math.random() * players.length)]
   }
}

export default soccer_playerAPI