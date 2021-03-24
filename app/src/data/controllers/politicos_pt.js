import politicosJS from '../datasets/politicos_pt';
const politicos = politicosJS.politicos

const pt_politicianAPI = {
   pt_politician(lang){
       return politicos[Math.floor(Math.random() * politicos.length)]
   }
}

export default pt_politicianAPI