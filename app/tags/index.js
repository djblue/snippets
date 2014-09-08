"use strict";

var Find = require('./find')
  , evts = require('../events')

module.exports = function ($el) {
  evts.on('tags:loaded', function (tags) {

    var find = new Find({
      collection: tags
    })
    $el.html(find.$el)

    tags.on('tag:selected', function () {
      var selected = tags.where({ state: 'selected' })
      evts.trigger('tags:selected', selected)
    })
  })
}
