import distritosJS from '../datasets/distritos.js';
const distritos = distritosJS.distritos

const districtsAPI = {
    district(){
        return distritos[Math.floor(Math.random() * distritos.length)].distrito
    },

    county(){
        const concelhos = distritos[Math.floor(Math.random() * distritos.length)].concelhos
        return concelhos[Math.floor(Math.random() * concelhos.length)].concelho
    },

    countyFromDistrict(distrito){
        for (let d of distritos){
            if(d.distrito==distrito){
                return d.concelhos[Math.floor(Math.random() * d.concelhos.length)].concelho
            }
        }
    },

    parish(){
        const concelhos = distritos[Math.floor(Math.random() * distritos.length)].concelhos
        const freguesias = concelhos[Math.floor(Math.random() * concelhos.length)].freguesias
        return freguesias[Math.floor(Math.random() * freguesias.length)]
    },

    parishFromDistrict(distrito){
        for (let d of distritos){
            if(d.distrito==distrito){
                const freguesias = d.concelhos[Math.floor(Math.random() * d.concelhos.length)].freguesias
                return freguesias[Math.floor(Math.random() * freguesias.length)]
            }
        }
    },

    parishFromCounty(concelho){
        for (let d of distritos){
            for (let c of d.concelhos){
                if(c.concelho==concelho){
                    return c.freguesias[Math.floor(Math.random() * c.freguesias.length)]
                }
            }
        }
    }
}

export default districtsAPI