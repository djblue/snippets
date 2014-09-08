"use strict";

var _ = require('underscore')
  , level = require('level')
  , db = level('./db', { valueEncoding: 'json' })

exports.setup = function (api) {

  api.get('/api/snippets', function (req, res) {
    var docs = []
      , stream = db.createReadStream()
    stream.on('data', function (doc) {
      doc.value.id = doc.key
      docs.push(doc.value)
    })
    stream.on('end', function () {
      res.status(200).json(docs)
    })
  })

/*
  var array = []

  for (var i = 0; i < 100; i++) {
    array.push({
      id: String(i),
      title: 'test',
      body: 'test',
      tags: ['test']
    })
  }

  api.get('/api/snippets', function (req, res) {
    res.json(array)
  })*/

  api.get('/api/snippets/:id', function (req, res) {
    db.get(req.params.id, function (err, doc) {
      if (err) {
        res.status(404).json(err)
      } else {
        doc.id = req.params.id
        res.status(200).json(doc)
      }
    })
  })

  api.put('/api/snippets/:id', function (req, res) {
    db.put(req.params.id, req.body, function (err, doc) {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(201).json(doc)
      }
    })
  })

  api.delete('/api/snippets/:id', function (req, res) {
    db.del(req.params.id, function (err, doc) {
      if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(doc)
      }
    })
  })
}
