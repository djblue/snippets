"use strict";

var Backbone = require('backbone')
  , _ = require('underscore')
  , shortid = require('shortid')
  , marked = require('marked')
  , hljs = require('highlight.js')
  , moment = require('moment')

marked.setOptions({
  gfm: true,
  tables: true,
  highlight: function (code, lang) {
    return hljs.highlightAuto(code, [lang]).value;
  }
})

var Snippet = exports.Snippet = Backbone.Model.extend({
  defaults: function () {
    return {
      id: shortid.generate(),
      title: 'new snippet',
      body: '',
      tags: [],
      active: false,
      _updated: new Date()
    }
  },
  urlRoot: '/api/snippets',
  initialize: function () { },
  getBodyRendered: function () {
    // return dom nodes of rendered markdown
    return marked(this.get('body'))
  },
  // prevent ui variables from being saved to server
  blacklist: ['active', 'state', 'hide'],
  toJSON: function (options) {
    return _.omit(this.attributes, this.blacklist)
  },
  select: function () {
    this.collection.trigger('reset')
    this.set('state', 'active')
    this.collection.trigger('selected', this)
  }
})

var Snippets = exports.Snippets = Backbone.Collection.extend({
  url: '/api/snippets',
  model: Snippet,
  initialize: function () { },
  // keep elements sorted by when they were last updated
  comparator: function (first, second) {
    var f = moment(first.get('_updated'))
    var s = moment(second.get('_updated'))
    return s.diff(f)
  }
})

var Tag = exports.Tag = Backbone.Model.extend({
  initialize: function () {}
})

var Tags = exports.Tags = Backbone.Collection.extend({
  initialize: function () {}
})
