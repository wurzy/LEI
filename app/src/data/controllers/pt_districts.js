import districtsJS from '../datasets/pt_districts.js';
const districts = districtsJS.districts

const districtsAPI = {
    pt_district(lang) {
        return districts[Math.floor(Math.random() * districts.length)].district
    },

    pt_county(lang) {
        const counties = districts[Math.floor(Math.random() * districts.length)].counties
        return counties[Math.floor(Math.random() * counties.length)].county
    },

    pt_countyFromDistrict(lang, district) {
        for (let d of districts) {
            if (d.district==district) {
                return d.counties[Math.floor(Math.random() * d.counties.length)].county
            }
        }
    },

    pt_parish(lang) {
        const counties = districts[Math.floor(Math.random() * districts.length)].counties
        const parishes = counties[Math.floor(Math.random() * counties.length)].parishes
        return parishes[Math.floor(Math.random() * parishes.length)]
    },

    pt_parishFromDistrict(lang, district) {
        for (let d of districts) {
            if (d.district==district) {
                const parishes = d.counties[Math.floor(Math.random() * d.counties.length)].parishes
                return parishes[Math.floor(Math.random() * parishes.length)]
            }
        }
    },

    pt_parishFromCounty(lang, county) {
        for (let d of districts) {
            for (let c of d.counties) {
                if (c.county==county) {
                    return c.parishes[Math.floor(Math.random() * c.parishes.length)]
                }
            }
        }
    }
}

export default districtsAPI