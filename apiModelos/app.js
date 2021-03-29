var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var mongoose = require('mongoose');
var User = require('./controllers/user')

mongoose.connect('mongodb://127.0.0.1:27017/LEI2021', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
});

// Configuração da estratégia local
passport.use('login-auth', new LocalStrategy(
    {usernameField: 'email'}, (email, password, done) => {
      User.consultar(email)
        .then(dados => {
          const user = dados
  
          if(!user) { return done(null, {strat: 'login-auth', success: false, invalidInput: 'email', message: 'Combinação inválida de e-mail e/ou password.\n'})}
          if(password != user.password) { return done(null, {strat: 'login-auth', success: false, invalidInput: 'password', message: 'Combinação inválida de e-mail e/ou password.\n'})}
          
          return done(null, {strat: 'login-auth', success: true, user})
        })
        .catch(e => done(e))
      })
  )
  
  // Configuração da estratégia local
passport.use('signup-auth', new LocalStrategy(
  {usernameField: 'email', passReqToCallback: true}, 
  (req, email, password, done) => {
    User.consultar(email)
      .then(dados => {
        if (dados) return done(null, {strat: 'signup-auth', success: false, invalidInput: 'email', message: 'Email já se encontra utilizado.\n'})
        else {
          var date = new Date().toISOString().substr(0,19)
          console.log(date)
          User.inserir({
              nome: req.body.nome,
              email: email, 
              password: password,
              dataRegisto: date,
              dataUltimoAcesso: date
            })
            .then(dados => {
              return done(null, {strat: 'signup-auth', success: true, user: dados})
            })
            .catch(e => done(e))
        }
      })
      .catch(e => done(e))
    })
)
  
// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  if (user.success) {
    done(null, {strat: user.strat, success: user.success, email: user.user.email})
  }
  else done(null, user)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((user, done) => {
  if (user.success) {
    User.consultar(user.email)
      .then(dados => done(null, {success: true, ...dados}))
      .catch(erro => done(erro, false))
  }
  else {
    delete user.strat
    done(null, user)
  }
})

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/utilizadores', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error 
  res.status(err.status || 500).jsonp(err);
});

module.exports = app;