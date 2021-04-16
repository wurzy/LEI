<!LANGUAGE pt>
{
  	cidades: [ 'repeat_unique(100)': {
        id: 'c{{index(1)}}',
        nome: '{{pt_city()}}',
        população: '{{integer(1500, 550000)}}',
        descrição: '{{lorem(1, "paragraphs")}}',
        distrito: '{{pt_district("city", this.nome)}}'
  	}],
  	ligações(gen) {
      	var cidades = this.cidades.map(x => x.id)
		var possiveis = cidades.flatMap((v, i) => cidades.slice(i+1).map( w => v + '|' + w ))
  		var ligs = []
        
        for (var i = 0; i < 2000; i++) {
			let l = gen.random(...possiveis)
			possiveis.splice(possiveis.indexOf(l), 1)

			var split = l.split('|')
      		ligs.push({origem: split[0], destino: split[1]})
        }

		ligs.forEach(l => l.distância = gen.floating(5, 600))
		return ligs
  	}
}