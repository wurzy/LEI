import empresariosJS from '../datasets/pt_businessmen.js';
const empresarios = empresariosJS.empresarios

const empresariosAPI = {
   pt_businessman(lang){
       return empresarios[Math.floor(Math.random() * empresarios.length)]
   }
}

export default empresariosAPI