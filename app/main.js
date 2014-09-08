"use strict";

var Backbone = require('backbone')
  , _ = require('underscore')
  , $ = require('zepto-browserify').$
  , models = require('./models')
  , tags = new models.Tags()
  , snippets = new models.Snippets()
  , evts = require('./events')

Backbone.$ = $ // make sure backbone is using zepto

// wait to render until page has finished loading
$(function () {

  require('./list')($('#list'))
  require('./snippets')($('#snippets'))
  require('./tags')($('#tags'))

  snippets.fetch({
    success: function (data) {
      evts.trigger('snippets:loaded', data)
      var count = {}
      _.each(data.models, function (snippet) {
        _.each(snippet.get('tags'), function (tag) {
          if (!count[tag]) count[tag] = 0
          count[tag] += 1
        })
      })
      _.each(_.keys(count), function (tag) {
        tags.add({
          name: tag,
          count: count[tag]
        }) 
      })
      evts.trigger('tags:loaded', tags)
    }
  })
  Backbone.history.start()
})
