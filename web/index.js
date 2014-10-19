var docker = require('docker-browser-console')
var websocket = require('websocket-stream')
var pump = require('pump')

var terminal = docker()
var url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host

pump(terminal, websocket(url), terminal)
terminal.appendTo(document.getElementById('console'))