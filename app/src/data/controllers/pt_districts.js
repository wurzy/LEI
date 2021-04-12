import districtsJS from '../datasets/pt_districts.js';
const districts = districtsJS.districts

function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

const districtsAPI = {
    pt_district(lang) {
        return districts[Math.floor(Math.random() * districts.length)].district
    },

    pt_districtOfCounty(lang, county) {
        county = normalize(county)

        for (let dist of districts) {
            let counties = dist.counties.map(x => normalize(x.county))
            if (counties.includes(county)) return dist.district
        }
    },

    pt_districtOfParish(lang, parish) {
        parish = normalize(parish)

        for (let dist of districts) {
            let parishes = dist.counties.map(x => x.parishes).flat().map(x => normalize(x))
            if (parishes.includes(parish)) return dist.district
        }
    },

    pt_districtOfCity(lang, city) {
        city = normalize(city)

        for (let dist of districts) {
            let cities = dist.cities.map(x => normalize(x.city))
            if (cities.includes(city)) return dist.district
        }
    },

    pt_county(lang) {
        const counties = districts[Math.floor(Math.random() * districts.length)].counties
        return counties[Math.floor(Math.random() * counties.length)].county
    },

    pt_countyOfParish(lang, parish) {
        parish = normalize(parish)
        
        for (let dist of districts) {
            for (let count of dist.counties) {
                count.parishes.map(x => normalize(x))
                if (count.parishes.includes(parish)) return count.county
            }
        }
    },

    pt_countyFromDistrict(lang, district) {
        district = normalize(district)
        let dists = districts.map(x => normalize(x.district))

        if (dists.includes(district)) {
            let counties = districts[dists.indexOf(district)].counties
            return counties[Math.floor(Math.random() * counties.length)].county
        }
    },

    pt_parish(lang) {
        const counties = districts[Math.floor(Math.random() * districts.length)].counties
        const parishes = counties[Math.floor(Math.random() * counties.length)].parishes
        return parishes[Math.floor(Math.random() * parishes.length)]
    },

    pt_parishFromDistrict(lang, district) {
        district = normalize(district)
        let dists = districts.map(x => normalize(x.district))

        if (dists.includes(district)) {
            let counties = districts[dists.indexOf(district)].counties
            let parishes = counties[Math.floor(Math.random() * counties.length)].parishes
            return parishes[Math.floor(Math.random() * parishes.length)]
        }
    },

    pt_parishFromCounty(lang, county) {
        county = normalize(county)

        for (let d of districts) {
            let counts = d.counties.map(x => normalize(x.county))
            if (counts.includes(county)) {
                let parishes = d.counties[counts.indexOf(county)].parishes
                return parishes[Math.floor(Math.random() * parishes.length)]
            }
        }
    },

    pt_city(lang) {
        const cities = districts[Math.floor(Math.random() * districts.length)].cities
        return cities[Math.floor(Math.random() * cities.length)].city
    },

    pt_cityCoordinates(lang, city) {
        city = normalize(city)

        let cities = districts.map(x => x.cities).flat().map(x => { return {
            city: normalize(x.city),
            latitude: x.lat,
            longitude: x.lng
        }})
        
        let c = cities.find(x => x.city == city)
        if (c !== undefined) delete c.city
        return c
    }
}

export default districtsAPI