<template>
   <div class="container">
    <br/>
    <h2>Sobre</h2>
    <hr/>
    <div class="intro">
        <h4>Introdução</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
         quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
         dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
         veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
         consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci 
         velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem 
         ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil 
         molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
    </div>

    <hr/>
    <h4>Equipa</h4>
    
    <div class="team-post row topmargin-lg">
        <div class="col-md-3" style="justify-content: center; align-items: center; display: flex;">
            <a><img src="../assets/user-default.png" class="img-fluid" alt=""></a>
        </div>
        <div class="col-md-9 team-post-info">
            <h5>Filipa Santos</h5>
            <b>Programador</b>
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
            <b>Programador</b>
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
            <b>Programador</b>
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
            <b>Programador</b>
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