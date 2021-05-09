<template>
  <div class="container">
    <br/>
    <h2>Documentação</h2>
    <hr/>
    <div>
        <h4>Definição da DSL <i>(Domain Specific Language)</i></h4>
        <p>A DSL é definida por pares de chave-valor agrupados dentro de um bloco iniciado pela diretiva <code>repeat</code>, envolta de parêntesis retos.</p>
        <p>Esta definição é importante para o utilizador final, uma vez que a sintaxe é muito semelhante a outras linguagens de programação e, portanto, permite uma melhor compreensão da gramática.</p>
        <p>É possível, também, existirem objetos aninhados. Assim, permite tipar arbritrariamente <i>arrays</i> de objetos para o <i>dataset</i> final.</p>
    </div>

    <hr/>

    <div>
        <h4>Definição de Pares Chave-Valor</h4>
        <p>Um par chave-valor é composto por dois elementos separadas por dois pontos (<b>:</b>).</p> 
        <p>A chave não pode conter espaços brancos (exceto entre o último caractere da <i>String</i> e o separador) nem qualquer outro caractere que não percença ao alfabeto ou que não seja um <i>underscore</i>.</p>
        <p>Por exemplo, <code>lorem_ipsum</code> é uma chave válida enquanto <code>lorem ipsum</code>, <code>lorem:ipsum</code> ou <code>lorem-ipsum</code> não são.</p>
        <p>A única exceção é a diretiva <code>repeat</code>, que está entre plicas e que recebe como argumento um inteiro. Esta é responsável por gerar um <i>array</i> de objetos cujo comprimento é o dado por argumento.</p>
        <p>Os valores podem ser um dos seguintes:</p>
        <ul>
            <li>Número</li>
            <li><i>String</i></li>
            <li><i>Array</i></li>
            <li>Booleano</li>
            <li>null</li>
            <li>Objeto DSL</li>
            <li>Função "Moustache" (a ver mais à frente)</li>
        </ul>
    </div>

    <hr/>
    <div>
        <h4>Funções "Moustache"</h4>
        <p>A utilidade destas funções é automatizar diretivas para o utilizador, de modo a ter um maior leque de <i>datasets</i> possíveis.</p>
        <p>Têm de ser escritas envoltas de duas chavetas no par chave-valor pretendido assim como plicas a englobar toda a estrutura.</p>
        <p>Por exemplo, <code v-html="'\'{{ integer() }}\''"></code> é uma função "Moustache" válida.</p>
        <p>De seguida estão explícitas todas as que se encontram atualmente disponíveis.</p>
    </div>
    <div class="method">
        <div class="row margin-0 list-header hidden-sm hidden-xs">
            <div class="col-md-2"><div class="header">Moustache</div></div>
            <div class="col-md-2"><div class="header">Tipo</div></div>
            <div class="col-md-3"><div class="header">Argumento(s)</div></div>
            <div class="col-md-5"><div class="header">Descrição</div></div>
        </div>

        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        objectID 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um ID aleatório com 24 bytes. <br/>
                        Exemplo: "6048e87b9281fc9a1afe8e61"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        guid 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um UUID aleatório. <br/>
                        Exemplo: "3d16d5d0-4b11-4de8-9e26-6668b52d9219"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        index 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Integer</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Retorna o índice atual do objeto gerado pelo 'repeat'. <br/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0"> 
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        boolean
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Boolean</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um booleano aleatório.
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        integer 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Integer</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Integer</code>,<br/>
                        Max:: <code>Integer</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um inteiro aleatório entre Min e Max. <br/>
                        Exemplo: integer(2,4) = 3
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        integer 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Integer</code>,<br/>
                        Max:: <code>Integer</code>,<br/>
                        Unid:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um inteiro aleatório entre Min e Max, mas acrescenta uma <i>String</i> Unid no final. <br/>
                        Exemplo: integer(2,4,"$") = "3$"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        integer 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Integer</code><br/>
                        ou <br/>
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Integer</code>,<br/>
                        Max:: <code>Integer</code>,<br/>
                        Pad:: <code>Integer</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um inteiro aleatório entre Min e Max e garante que tem pelo menos tantos algarismos quantos especificados no Pad. <br/>
                        Se o número tiver menos algarismos que o suposto, faz padding de zeros à esquerda. Caso isto necessário, devolve uma <i>String</i>; caso contrário, um inteiro.<br/>
                        Exemplo1: integer(2,400,3) = 100 <br/>
                        Exemplo2: integer(2,4,3) = "003"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        integer 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Integer</code>,<br/>
                        Max:: <code>Integer</code>,<br/>
                        Pad:: <code>Integer</code>,<br/>
                        Unid:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Combinação dos dois moustaches anteriores.<br/>
                        Exemplo: integer(2,4,3,"$") = "003$"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        floating 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Float</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Float</code>,<br/>
                        Max:: <code>Float</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um número decimal aleatório entre Min e Max. <br/>
                        Exemplo: floating(-180, 180) = -19.1059
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        floating 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Float</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Float</code>,<br/>
                        Max:: <code>Float</code>,<br/>
                        C:: <code>Integer</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um número decimal aleatório entre Min e Max com um total de C casas decimais. <br/>
                        Exemplo: floating(-180, 180, 2) = -19.11
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        floating 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Min:: <code>Float</code>,<br/>
                        Max:: <code>Float</code>,<br/>
                        F:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um número decimal aleatório entre Min e Max, no formato F indicado.<br/>
                        Exemplo: floating(0, 180, "0,0.00€") = "20.56€"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        date
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Init:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera uma data aleatória entre a data atual e a data argumento.<br/>
                        A <i>String</i> de argumento tem de ter o formato "DD[./-]MM[./-]YYYY".<br/>
                        Exemplo: date("12-12-2100") = "20/10/2050"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        date
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Init:: <code>String</code>,<br/>
                        Form:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera uma data aleatória entre a data atual e a data argumento, no formato dado.<br/>
			            Os formatos possíveis são os seguintes: DD.MM.YYYY, DD.MM.AAAA, MM.DD.YYYY, MM.DD.AAAA, YYYY.MM.DD e AAAA.MM.DD, onde o . pode ser / - ou .<br/>
                        Exemplo: date("12-12-2100","DD.MM.AAAA") = "20/10/2050"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        date
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Init:: <code>String</code>,<br/>
                        Fim:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera uma data aleatória entre as datas argumentos.<br/>
                        Exemplo: date("12-12-2100","20-12-2100","AAAA.MM.DD") = "2100/12/15"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        date
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Init:: <code>String</code>,<br/>
                        Fim:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Combinação dos dois moustaches anteriores.<br/>
                        Exemplo: date("12-12-2100","20-12-2100") = "15/12/2100"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        lorem 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Num:: <code>Integer</code>,<br/>
                        Parte:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera Num palavras, frases ou parágrafos de <i>lorem ipsum</i>. A varíavel Parte tem de ser igual a "words", "sentences" ou "paragraphs".<br/>
                        Exemplo: lorem(3,"words") = "mollit fugiat officia"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        random 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Object</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        arg1:: <code>Object</code>,<br/>
                        ...,<br/>
                        argN::<code>Object</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Retorna aleatoriamente um dos argumentos passados à função. <br/>
                        Exemplo: random("blue", null, true, false, 23, 17.56) = 23
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        position 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um conjunto de coordenadas cartesianas aleatórias. <br/>
                        Exemplo: position() = "(22.491, 101.037)"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        position 
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        [MinLat,MaxLat]:: <code>[Float]</code>,<br/>
                        [MinLon,MaxLon]:: <code>[Float]</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um conjunto de coordenadas cartesianas aleatórias, com limites superiores e inferiores. <br/>
                        Exemplo: position([0.03,3],[-5,-2.4]) = "(1.311, -3.97)"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_phone_number
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um número de telemóvel português. <br/>
                        Exemplo: pt_phone_number() = "911 154 239"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_phone_number
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        bool:: <code>Boolean</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um número de telemóvel português, se bool==true é colocada a extensão. <br/>
                        Exemplo: pt_phone_number(true) = "+351 911 154 239"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_district
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um distrito português aleatório.<br/>
                        Exemplo: pt_district() = "Braga"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_district
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Def:: <code>String</code>, <br/>
                        Coun:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera o distrito português do concelho dado em Coun.<br/>
                        O primeiro argumento tem de corresponder à <i>String</i> "county".<br/>
                        Exemplo: pt_district("county","Braga") = "Braga"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_district
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Def:: <code>String</code>, <br/>
                        Par:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera o distrito português da freguesia dada em Par.<br/>
                        O primeiro argumento tem de corresponder à <i>String</i> "parish".<br/>
                        Exemplo: pt_district("parish","Tadim") = "Braga"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_district
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Def:: <code>String</code>, <br/>
                        Cit:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera o distrito português da cidade dada em Cit.<br/>
                        O primeiro argumento tem de corresponder à <i>String</i> "city".<br/>
                        Exemplo: pt_district("city","Barcelos") = "Braga"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_county
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Nenhum
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um concelho português aleatório.<br/>
                        Exemplo: pt_district() = "Barcelos"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_county
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Def:: <code>String</code>, <br/>
                        Dis:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera um concelho aleatório do distrito dado em Dis.<br/>
                        O primeiro argumento tem de corresponder à <i>String</i> "district".<br/>
                        Exemplo: pt_county("district","Braga") = "Barcelos"
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-2">
                <div class="cell">
                    <div class="propertyname">
                        pt_county
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="cell">
                    <div class="isrequired">
                        Def:: <code>String</code>, <br/>
                        Coun:: <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        Gera o concelho português da freguesia dada em Coun.<br/>
                        O primeiro argumento tem de corresponder à <i>String</i> "parish".<br/>
                        Exemplo: pt_country("parish","Tadim") = "Braga"
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br/>
    <hr/>
    <div>
        <h4>Exemplo DSL</h4>
        <codemirror 
                ref="example1"
                :value= "example1"
                :options="cmOption"
        />
    </div>
    <br/>
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import "codemirror/theme/dracula.css";
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript.js'

export default {
  name: 'Documentation',
  data() {
      return {
        example1: `[
	'repeat(3)': {
        _id: '{{objectId()}}',
  		missing(50): {
        	boleano: '{{bool()}}'
        },
        posicao: '{{position()}}',
        telemovel: '{{phone()}}',
	  	range: range(5),
	  	string: "string",
	  	numero: 93,
	  	name: {
	    	first: "Universidade",
	    	last: "do Minho"
	  	},
	  	lista_exemplo: [
	  		"string",
	  		32,
	  		{
	  			elem: 1, 
                indice: 2, 
                lista_nested: [1,2,3], 
                range: range(3) 
            }
    	],
  		objeto: [
			'repeat(5)': {
  				indice_objeto: '{{index()}}'
  			}
		]
    }
]`,
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'text/javascript',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "dracula",
          extraKeys: { "Ctrl": "autocomplete" },
          hintOptions:{
            completeSingle: false
          }
        }
      }
    },
    computed: {
      codemirror() {
        return this.$refs.example1.codemirror
      }
    },
    mounted() {
      this.codemirror.setSize("100%", "100%")
    }
  }
</script>
<style scoped>
/* Methods */
.method .header, .method .cell {
  padding: 6px 6px 6px 10px; }
.method .list-header .header {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.8em;
  color: #999;
  background-color: #eee; }
.method [class^="row"],
.method [class*=" row"] {
  border-bottom: 1px solid #ddd; }
  .method [class^="row"]:hover,
  .method [class*=" row"]:hover {
    background-color: #f7f7f7; }
.method .cell {
  font-size: 0.85em; }
  .method .cell .mobile-isrequired {
    display: none;
    font-weight: normal;
    text-transform: uppercase;
    color: #aaa;
    font-size: 0.8em; }
  .method .cell .propertyname {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; }
  .method .cell .type {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; }
  .method .cell code {
    color: #428bca; }
  .method .cell a, .method .cell a:hover {
    text-decoration: none; }
  .method .cell code.custom {
    color: #8a6d3b;
    text-decoration: none; }
  .method .cell .text-muted {
    color: #ddd; }
@media (max-width: 991px) {
  .method [class^="row"],
  .method [class*=" row"] {
    padding-top: 10px;
    padding-bottom: 10px; }
  .method .cell {
    padding: 0 10px; }
    .method .cell .propertyname {
      font-weight: bold;
      font-size: 1.2em; }
      .method .cell .propertyname .lookuplink {
        font-weight: normal;
        font-size: 1.5em;
        position: absolute;
        top: 0;
        right: 10px; }
    .method .cell .type {
      padding-left: 10px;
      font-size: 1.1em; }
    .method .cell .isrequired {
      padding-left: 10px;
      display: none; }
    .method .cell .description {
      padding-left: 10px; }
    .method .cell .mobile-isrequired {
      display: inline; } }


/* Row Utilities */
[class^='row'].margin-0,
[class*=' row'].margin-0,
[class^='form-group'].margin-0,
[class*=' form-group'].margin-0 {
  margin-left: -0px;
  margin-right: -0px; }
  [class^='row'].margin-0 > [class^='col-'],
  [class^='row'].margin-0 > [class*=' col-'],
  [class*=' row'].margin-0 > [class^='col-'],
  [class*=' row'].margin-0 > [class*=' col-'],
  [class^='form-group'].margin-0 > [class^='col-'],
  [class^='form-group'].margin-0 > [class*=' col-'],
  [class*=' form-group'].margin-0 > [class^='col-'],
  [class*=' form-group'].margin-0 > [class*=' col-'] {
    padding-right: 0px;
    padding-left: 0px; }
  [class^='row'].margin-0 [class^='row'],
  [class^='row'].margin-0 [class*=' row'],
  [class^='row'].margin-0 [class^='form-group'],
  [class^='row'].margin-0 [class*=' form-group'],
  [class*=' row'].margin-0 [class^='row'],
  [class*=' row'].margin-0 [class*=' row'],
  [class*=' row'].margin-0 [class^='form-group'],
  [class*=' row'].margin-0 [class*=' form-group'],
  [class^='form-group'].margin-0 [class^='row'],
  [class^='form-group'].margin-0 [class*=' row'],
  [class^='form-group'].margin-0 [class^='form-group'],
  [class^='form-group'].margin-0 [class*=' form-group'],
  [class*=' form-group'].margin-0 [class^='row'],
  [class*=' form-group'].margin-0 [class*=' row'],
  [class*=' form-group'].margin-0 [class^='form-group'],
  [class*=' form-group'].margin-0 [class*=' form-group'] {
    margin-left: 0;
    margin-right: 0; }
</style>