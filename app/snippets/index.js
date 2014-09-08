var Snippet = require('./snippet')
  , Backbone = require('backbone')
  , Router = Backbone.Router.extend({})
  , evts = require('../events')


module.exports = function ($el) {

  var router = new Router()
  $el.html('<div class="text-center"><h1>No Snippet Selected</h1></div>')

  evts.on('snippet:selected', function (snippet) {
    var snippet = new Snippet({
      model: snippet
    })
    $el.html(snippet.$el)
  })

}
