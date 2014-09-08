"use strict";

var Backbone = require('backbone')
  , $ = require('zepto-browserify').$
  , _ = require('underscore')

var Tag = Backbone.View.extend({
  events: {
    'click .tag': 'toggle'
  },
  initialize: function () {
    this.model.on('change', this.render, this)
    this.render()
  },
  template: require('./tag.html'),
  render: function () {
    this.$el.html(this.template({
      tag: this.model
    }))
  },
  toggle: function () {
    var state = this.model.get('state')
    if (state == 'selected') {
      this.model.set('state', null)
    } else {
      this.model.set('state', 'selected')
    }
    this.model.collection.trigger('tag:selected', this.model)
  }
})

var TagList = Backbone.View.extend({
  className: 'tags-list',
  initialize: function () {
    this.render()
  },
  render: function () {
    _.each(this.collection, function (model) {
      var tag = new Tag({ model: model })
      this.$el.append(tag.$el)
    }, this)
  }
})

var Find = module.exports = Backbone.View.extend({
  initialize: function () {
    this.found = this.collection.models
    this.render()
  },
  events: {
    'input .input': 'filter'
  },
  render: function () {
    this.search = $('<div class="search"><input class="input" placeholder="search tags..." /></div>')
    this.$el.append(this.search)
    
    this.list = new TagList({
      collection: this.found
    })

    this.$el.append(this.list.$el)
  },
  update: function () {
    this.list.remove() 
    this.list = new TagList({
      collection: this.found
    })
    this.$el.append(this.list.$el)
  },
  filter: function () {
    var terms = this.search.find('input').val().split(' ')
    this.found = this.collection.filter(function (tag) {
      for (var i = 0; i < terms.length; i++) {
        if (tag.get('name').match(terms[i])) {
          return true
        }
      }
      return false
    })
    this.update()
  }
})
