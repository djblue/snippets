"use strict";

var _ = require('underscore')
  , Backbone = require('backbone')
  , $ = require('zepto-browserify').$
  , expect = require('chai').expect

Backbone.$ = $

var index = require('../../app/list')
  , Snippets = require('../../app/models').Snippets
  , evts = require('../../app/events')

require('source-map-support').install()

describe('A snippet list', function () {

  var el, snippets

  beforeEach(function () {
    // root element for testing
    el = $('<div>')

    // mock data
    snippets = new Snippets([
      {
        id: 0,
        title: 'testing',
        body: 'blah',
        tags: ['beep', 'boop']
      },
      {
        id: 1,
        title: 'another',
        body: '# hello \n This is my snippet.',
        tags: ['deet', 'doot']
      }
    ])

    // initialize view
    index(el)
    // tell app that snippets have been loaded
    evts.trigger('snippets:loaded', snippets)
  })

  it('should load snippet collection', function () {
    // assert on html structure
    var tabs = el.find('.tab')
    expect(tabs.length).to.equal(snippets.length)
    var h1 = $(tabs[0]).find('h1')
    var html = snippets.models[0].get('title')
    expect($(h1).html()).to.equal(html)
  })

  it('should select a snippet', function () {
    snippets.models[0].select()
    var tab = el.find('.active')
    expect(tab.length).to.equal(1)
  })

})
