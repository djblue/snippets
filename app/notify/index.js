var evts = require('../events')
  , notify = require('./notify')

evts.on('notify:success', function (msg) {
  notify.add(msg)
})
