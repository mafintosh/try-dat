var WebSocketServer = require('ws').Server
var freeport = require('freeport')
var request = require('request')
var websocket = require('websocket-stream')
var docker = require('docker-browser-console')
var url = require('url')
var send = require('send')
var path = require('path')
var http = require('http')
var pump = require('pump')
var format = require('streaming-format')
var param = require('param')

var DOCKER_HOST = param('docker')
var DOMAIN = param('domain')

var replace = function() {
  return DOMAIN
}

var server = http.createServer()
var wss = new WebSocketServer({server:server})
var subdomains = {}

wss.on('connection', function(connection) {
  var subdomain = Math.random().toString(36).slice(2)+'.'+DOMAIN
  var stream = websocket(connection)

  freeport(function(err, port) {
    if (err) connection.destroy()

    var opts = {
      env: {
        HTTP_DOMAIN: 'http://'+subdomain,
        PORT: 80
      },
      ports: {
        80: port
      }
    }

    subdomains[subdomain] = port
    pump(stream, docker('mafintosh/try-dat', opts), stream, function() {
      delete subdomains[subdomain]
    })
  })
})

server.on('request', function(req, res) {
  var u = url.parse(req.url, true)
  var host = req.headers.host

  console.log('%s %s (%s)', req.method, u.pathname, host)

  if (subdomains[host]) return pump(req, request('http://'+DOCKER_HOST+':'+subdomains[host]+req.url), res)
  if (u.pathname === '/bundle.js') return send(req, __dirname+'/build/bundle.js').pipe(res)

  send(req, __dirname+'/build/index.html').pipe(res)
})

server.listen(param('port'), function() {
  console.log('Server is listening on port %d (%s)', server.address().port, param.env)
})
