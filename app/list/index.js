"use strict";

var List = require('./list')
  , Backbone = require('backbone')
  , _ = require('underscore')
  , Router = Backbone.Router.extend({
               routes: {
                 'snippet/:id': 'view'
               }
             })
  , evts = require('../events')

module.exports = function ($el) {

  var router = new Router()

  var snippets
    , list

  router.on('route:view', function (id) {
    evts.on('snippets:loaded', function (snippets) {
      var snippet = snippets.findWhere({ id: id })
      if (snippet != null) {
        snippet.set('state', 'active')
        list.collection.trigger('selected', snippet)
        evts.trigger('snippet:selected', snippet)
      } else {
        router.navigate('/')
      }
    })
  })

  evts.on('snippets:loaded', function (snippets) {

    list = new List({
      collection: snippets
    })

    $el.html(list.$el)

    list.collection.on('selected', function (snippet) {
      router.navigate("#/snippet/" + snippet.id)
      evts.trigger('snippet:selected', snippet)
    })

    evts.on('tags:selected', function (tags) {

      // just in case we need to bring in extra snippets
      list.load()

      snippets.each(function (snippet) {

        if (tags.length > 0) {
          var found = _.reduce(snippet.get('tags'), function (memo, tag) {
            var find = _.find(tags, function (t) {
              return tag == t.get('name')
            })
            if (!find) {
              return memo
            } else {
              return memo + 1
            }

          }, 0)
        } else {
          var found = 1
        }

        // update snippet based on if found
        if (found == 0) {
          snippet.set('hide', true)
        } else {
          snippet.set('hide', false)
        }

      })

    })

  })
}
