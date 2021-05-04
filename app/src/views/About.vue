<template>
   <div class="container">
    <br/>
    <h2>Sobre</h2>
    <hr/>
    <div class="intro">
        <h4>Introdução</h4>
        <p>O DataGen é uma ferramenta versátil e poderosa que permite a rápida prototipagem e teste de aplicações de software, uma vez que atualmente poucas soluções oferecem a 
        complexidade e escalabilidade necessárias para gerar conjuntos de dados adequados a fim de analisar adequadamente a funcionalidade de um sistema, um problema que 
        surpreendentemente passou despercebido ou não recebeu a atenção necessária na última década.</p>

        <p>Muitas das ferramentas já existentes carecem de recursos críticos que prejudicam gravemente a capacidade do usuário de gerar conjuntos de dados complexos, o que acaba 
        tornando-os úteis para casos de uso simples, principalmente para fins académicos, mas não para ambientes de produção reais. Com o DataGen, a equipe se concentrou em 
        desenvolver os mesmos recursos que faltavam, além dos já existentes.</p>

        <p>Todos os aplicativos e softwares desenvolvidos devem ser exaustivamente testados antes do lançamento, a fim de determinar a capacidade do sistema de suportar quantidades 
        realistas de dados e tráfego, e isso implica o uso de conjuntos de dados representativos que se ajustem aos seus casos de uso. A criação dos referidos conjuntos de dados é 
        um processo trabalhoso e demorado, pois implica em primeiro lugar gerar os dados de teste de alguma forma, num formato de ficheiro compatível com o sistema. Do jeito que está, 
        atualmente não há ferramentas eficientes, intuitivas e escaláveis   para fazer isso e, portanto, os desenvolvedores muitas vezes acabam tendo que criar registros de teste 
        manualmente, o que é incrivelmente ineficiente e demorado, ou usando ferramentas existentes com alguns táticas para gerenciar suas deficiências.</p>

        <p>Um exemplo de tal ferramenta é a aplicação web "Gerador JSON", que permite ao usuário criar um modelo de conjunto de dados de acordo com suas diretrizes, a partir do qual o 
        programa é capaz de gerar registros aleatórios. No entanto, esse aplicativo tem muitas deficiências que diminuem sua utilidade: sem dúvida o pior de tudo, ele só pode produzir 
        até 100 registros por vez, o que é muito pouco no contexto de teste de software. Assim, o usuário é forçado a utilizá-lo repetidamente e concatenar manualmente todos os dados 
        produzidos posteriormente, caso deseje um conjunto de dados maior e mais completo, o que está longe do ideal.</p>

        <p>Mesmo com uma ferramenta de geração confiável, o usuário pode querer ter controle sobre os dados dos registros resultantes, podendo observá-los e manipulá-los livremente, 
        por meio de solicitações de CRUD, adaptando-os como quiser. Embora existam produtos capazes de fazer isso - por exemplo, o pacote json-server, que cria uma API REST totalmente 
        falsa -, seu uso envolve o usuário iniciar manualmente o aplicativo toda vez que quiser editar o conteúdo do conjunto de dados e garantir que o formato dos dados seja compatível 
        com o software que está usando, o que acaba exigindo muito esforço extra e configuração por parte do usuário.</p>

        <p>Assim, a equipe surgiu com a ideia de acoplar o processo de geração e a API REST, de forma a permitir ao usuário gerar automaticamente dados compatíveis com uma API RESTful 
        integrada - para a qual foi escolhido o software Strapi, permitindo ao usuário carregar os registros em um servidor API e realizar operações CRUD sobre ele, seja por meio da
        interface do usuário ou por meio de solicitações HTTP.</p>


    </div>

    <hr/>
    <h4>Equipa</h4>
    
    <div class="team-post row topmargin-lg">
        <div class="col-md-3" style="justify-content: center; align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
        <div class="col-md-9 team-post-info">
            <h5>Filipa Santos</h5>
            <b>Estudante do Mestrado Integrado de Engenharia Informática na Universidade do Minho</b>
            <p> </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>                           
            <div id="social" class="rightS">
                <a href="https://github.com/fliper6" target="_blank" class="fa fa-github" style="margin-right:10px"></a>
                <a href="https://www.linkedin.com/in/filipa-santos-00111b1b5/" target="_blank" class="fa fa-linkedin"></a>
            </div>
        </div>
    </div>

    <div class="team-post row topmargin-lg">
        <div class="col-md-9 team-post-info" style="text-align: right">
            <h5>Hugo Cardoso</h5>
            <b>Estudante do Mestrado Integrado de Engenharia Informática na Universidade do Minho</b>
            <p> </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>                           
            <div id="social" class="leftS">
                <a href="https://github.com/Abjiri" target="_blank" class="fa fa-github" style="margin-right:10px"></a>
                <a href="https://www.linkedin.com/in/hugo-cardoso-b868a474/" target="_blank" class="fa fa-linkedin"></a>
            </div>
        </div>
        <div class="col-md-3" style="justify-content: center;  align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
    </div>

    <div class="team-post row topmargin-lg">
        <div class="col-md-3" style="justify-content: center; align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
        <div class="col-md-9 team-post-info">
            <h5>João Cunha</h5>
            <b>Estudante do Mestrado Integrado de Engenharia Informática na Universidade do Minho</b>
            <p> </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>                           
            <div id="social" class="rightS">
                <a href="https://github.com/Jcc20" target="_blank" class="fa fa-github" style="margin-right:10px"></a>
                <a href="" target="_blank" class="fa fa-linkedin"></a>
            </div>
        </div>
    </div>

    <div class="team-post row topmargin-lg">
        <div class="col-md-9 team-post-info" style="text-align: right">
            <h5>Válter Carvalho</h5>
            <b>Estudante do Mestrado Integrado de Engenharia Informática na Universidade do Minho</b>
            <p> </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>                           
            <div id="social" class="leftS">
                <a href="https://github.com/wurzy" target="_blank" class="fa fa-github" style="margin-right:10px"></a>
                <a href="https://www.linkedin.com/in/valterfpcarvalho/" target="_blank" class="fa fa-linkedin"></a>
            </div>
        </div>
        <div class="col-md-3" style="justify-content: center;  align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
    </div>

    <div class="team-post row topmargin-lg">
        <div class="col-md-3" style="justify-content: center; align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
        <div class="col-md-9 team-post-info">
            <h5>José Ramalho</h5>
            <b>Professor do Departamento de Informática da Universidade do Minho</b>
            <p> </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>                           
            <div id="social" class="rightS">
                <a href="https://github.com/Jcc20" target="_blank" class="fa fa-github" style="margin-right:10px"></a>
                <a href="" target="_blank" class="fa fa-linkedin"></a>
            </div>
        </div>
    </div>

   </div>
</template>

<style scoped>
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

html {
    scroll-behavior: smooth;
}

a:hover {
    color: #38C2B4;
    opacity: .9;
    text-decoration: none;
}

section {
    padding: 80px 0; 
}

.topmargin-sm {
    margin-top: 30px;
}

.topmargin-lg {
    margin-top: 60px;
}

.mark{
    background-color: #B3DADA;   
}

.intro {
    margin-bottom: 40px !important;
}

.team-post {
    background-color: #ffffff;
    box-shadow: #d7d8e2 0px 2px 4px 0px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin: 15px 0; 
    transition: all .2s ease-in-out;
    filter: grayscale(100%);
}

.team-post:hover {
    transform: scale(1.05);
    filter: grayscale(0%);
}

.team-post img {
    max-width: 200px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.team-post-info {
    padding: 24px;
}

#social {
    font-size: 1.2em;
    filter: grayscale(100%);
}

.rightS {
    float: left;
    margin-right: 15px;
}

.leftS {
    float: right;
    margin-left: 15px;
}

</style>