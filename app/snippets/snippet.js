"use strict";

var Backbone = require('backbone')
  , view = require('./view.ejs')
  , edit = require('./edit.ejs')
  , $ = require('zepto-browserify').$


module.exports = Backbone.View.extend({
  events: {
    'click #edit': 'edit',
    'click #save': 'save',
    'click #delete': 'delete'
  },
  initialize: function () {
    this.render()
  },
  render: function () {
    this.$el.html(view({ snippet: this.model }))
    var rendered = this.model.getBodyRendered()
    this.$el.find('#body').html($(rendered))
  },
  edit: function () {
    var view = $(edit({ snippet: this.model }))
    this.$el.html(view)
  },
  save: function () {
    this.model.set('title',
      this.$el.find('#title').val())
    this.model.set('body',
      this.$el.find('#body').val())
    this.model.set('tags',
      this.$el.find('#tags').val().split(' '))
    this.model.save()
    this.render()
  },
  delete: function () {
    var self = this;
    this.model.destroy({
      success: function () {
        self.$el.html('')
      }
    })
  }
})
