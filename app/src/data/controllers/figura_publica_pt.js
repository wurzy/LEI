import figurasJS from '../datasets/figura_publica_pt.js';
const publicfigures = figurasJS.figuras_publicas

const pt_public_figuresAPI = {
   pt_public_figure(lang){
       return publicfigures[Math.floor(Math.random() * publicfigures.length)]
   }
}

export default pt_public_figuresAPI