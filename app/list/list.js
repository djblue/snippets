"use strict";

var Backbone = require('backbone')
  , $ = require('zepto-browserify').$

var Tab = Backbone.View.extend({
  className: 'tab',
  initialize: function () {
    // clear state of tabs on reset event
    this.model.collection.on('reset', function () {
      this.model.set('state', null)
    }, this)
    // rerender tab on change event
    this.model.on('change', this.render, this)
    this.model.on('destroy', this.del, this)
    // initial render
    this.render()
  },
  template: require('./tab.html'),
  events: {
    'click div': 'selected'
  },
  render: function () {
    if (this.model.get('hide')) {
      this.$el.css('display', 'none')
    } else {
      this.$el.css('display', 'block')
      this.$el.html(this.template({
        snippet: this.model
      }))
    }
  },
  selected: function () {
    this.model.select()
  },
  del: function () {
    this.remove() // remove view
  }
})

// list all snippets
var TabList = module.exports = Backbone.View.extend({
  events: {
    'click #add': 'add'
  },
  initialize: function () {
    // initial render
    this.collection.on('add', this.sync, this)
    this.tabs = $('<div class="tabs">')
    var self = this;
    this.tabs.on('scroll', function () {
      self.checkScroll()
    })
    this.render()
  },
  sync: function (model) {
    var tab = new Tab({ model: model })
    // append new tab to top of this
    this.tabs.prepend(tab.$el)
    model.select()
  },
  render: function () {
    var self = this;
    this.$el.append('<div class="add"><button class="btn-green" id="add">Add</button></div>')
    this.$el.append(this.tabs)
    this.i = 0;
    this.load()
  },
  // push tabs into the dom progressively
  load: function () {
    var more = this.i + 10
    var len = this.collection.models.length
    for (; this.i < more && this.i < len; this.i++) {
      var tab = new Tab({
        model: this.collection.models[this.i]
      })
      this.tabs.append(tab.$el)
    }
  },
  add: function () {
    // model defaults will populate object
    this.collection.create()
  },
  checkScroll: function () {

    var height = this.tabs.height()

    var lastTab = $(this.tabs.find('.tab').last())
    var y = lastTab.position().top

    if (y < height) {
      this.load()
    }
  }
})
