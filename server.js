#!/usr/bin/env node

var minimist = require('minimist')
var WebSocketServer = require('ws').Server
var freeport = require('freeport')
var request = require('request')
var websocket = require('websocket-stream')
var docker = require('docker-browser-console')
var root = require('root')
var url = require('url')
var send = require('send')
var path = require('path')
var pump = require('pump')

var argv = minimist(process.argv, {
  alias: {port:'p', host:'h', docker:'d', help:'h'},
  default: {port:8080, host:'dev.try-dat.com'} 
})

if (argv.help) {
  console.log('Usage: try-dat [options]')
  console.log()
  console.log('  --port,    -p  [8080]          (port to listen on)')
  console.log('  --host,    -h  [try-dat.com]   (public host of the server')
  console.log('  --docker,  -d  [$DOCKER_HOST]  (optional host of the docker daemon)')
  console.log('')
  return
}

var DOCKER_HOST = argv.docker || (process.env.DOCKER_HOST || '127.0.0.1').replace(/^.+:\/\//, '').replace(/:\d+$/, '').replace(/^\/.+$/, '127.0.0.1')
var host = (argv.host+':'+argv.port).replace(/\:(80|443)$/, '')

var server = root()
var wss = new WebSocketServer({server:server})
var containers = {}

wss.on('connection', function(connection) {
  var id = connection.upgradeReq.url.slice(1) || Math.random().toString(36).slice(2)
  var subdomain = id+'.c.'+host
  var stream = websocket(connection)

  freeport(function(err, filesPort) {
    if (err) return connection.destroy()
    freeport(function(err, httpPort) {
      if (err) return connection.destroy()

      var container = containers[id] = {
        id: id,
        host: 'http://'+subdomain,
        ports: {http:httpPort, fs:filesPort}
      }

      console.log('Spawning new container (%s)', id)

      var opts = {
        env: {
          CONTAINER_ID: container.id,
          HOST: container.host,
          PORT: 80
        },
        ports: {
          80: httpPort,
          8441: filesPort
        }
      }

      pump(stream, docker('mafintosh/try-dat', opts), stream, function(err) {
        console.log('Terminated container (%s)', id)
        delete containers[id]
      })
    })
  })
})

server.all(function(req, res, next) {
  var host = req.headers.host || ''
  var i = host.indexOf('.c.')

  if (i > -1) {
    var id = host.slice(0, i)
    var container = containers.hasOwnProperty(id) && containers[id]
    if (container) return pump(req, request('http://'+DOCKER_HOST+':'+container.ports.http+req.url), res)
    return res.error(404, 'Could not find container')
  }

  next()
})

server.get('/-/*', function(req, res) {
  send(req, req.params.glob, {root:path.join(__dirname, 'web')}).pipe(res)
})

server.get('/containers/{id}', function(req, res) {
  var id = req.params.id
  var container = containers.hasOwnProperty(id) && containers[id]
  if (!container) return res.error(404, 'Could not find container')
  res.send(container)
})

server.all('/http/{id}/*', function(req, res) {
  var id = req.params.id
  var url = req.url.slice(('/http/'+id).length)
  var container = containers.hasOwnProperty(id) && containers[id]
  if (!container) return res.error(404, 'Could not find container')
  pump(req, request('http://'+DOCKER_HOST+':'+container.ports.http+'/'+url), res)
})

server.all('/files/{id}/*', function(req, res) {
  var id = req.params.id
  var url = req.url.slice(('/files/'+id).length)
  var container = containers.hasOwnProperty(id) && containers[id]
  if (!container) return res.error(404, 'Could not find container')
  pump(req, request('http://'+DOCKER_HOST+':'+container.ports.fs+'/'+url), res)
})

server.get('/bundle.js', '/-/bundle.js')
server.get('/index.html', '/-/index.html')
server.get('/', '/-/index.html')

server.listen(argv.port, function() {
  console.log('Server is listening on port %d', server.address().port)
  console.log('Open a browser and visit http://%s', host)
})
