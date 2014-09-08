// the purpose of this file to to configure the express application
// object, mount all of the API end points
var express     = require('express')
  , bodyParser  = require('body-parser')
  , morgan      = require('morgan')
  , path        = require('path')
  , fs          = require('fs')
  , browserify = require('browserify-middleware')
  , lessMiddleware = require('less-middleware')


module.exports = function () { 

  var app = express()
    , router = express.Router()

  // for requiring templates
  browserify.settings({ transform: ['jstify'] })

  var shared = ['underscore', 'zepto-browserify', 'backbone', 'marked', 'highlight.js']

  app.get('/js/bundle.js', browserify(shared))
  app.get('/js/main.js', browserify('./app/main.js', {external: shared}))
  app.get('/js/test.js', browserify('./test/app/main.js', {external: shared}))

  app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, './app/index.html'))
  })

  app.get('/test', function (req, res) {
    res.sendFile(path.resolve(__dirname, './test/app/index.html'))
  })

  // rendering less
  app.use(lessMiddleware(path.resolve(__dirname, './app/less')))
  app.use(express.static(path.resolve(__dirname, './app/less')))

  // all environments
  app.set('port', process.env.PORT || 3000)
  app.set('env', process.env.NODE_ENV || 'development')

  // setup server logging with morgan.js
  app.use(morgan('tiny'))

  // enable express app to parse json body (for rest api)
  app.use(bodyParser.json())

  // setup static files serving in the app directoy
  app.use(express.static(path.join(__dirname, 'public')))

  app.use('/', router) // register router with express

  // synchronously load all api end points in api directory
  fs.readdirSync('./api').forEach(function (file) {
    // check file is javascript file
    if (file.match(/\.js$/)) {
      var api = require('./api/'+file)
      if (typeof api.setup == 'function') {
        console.log('#setup() in : ' + file)
        api.setup(router)
      }
    }
  })

  return app
}
