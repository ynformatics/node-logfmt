var parse = require('./lib/logfmt_parser').parse;

exports.parse = parse;
exports.stream = process.stdout;

var logger = require('./lib/logger');
exports.log = function(data, stream) {
  if(stream == undefined) stream = exports.stream;
  return logger.log(data, stream);
}

//Syncronous Body Parser
var bodyParser = require('./lib/body_parser')

var logfmtBodyParser = function (body) {
  var lines = []
  body.split("\n").forEach(function(line){
    lines.push(parse(line))
  })
  return lines;
}

exports.bodyParser = function(options) {
  if(options == null) options = {};
  var mime = options.contentType || "application/logplex-1"
  return bodyParser({contentType: mime, parser: logfmtBodyParser})
}

//Stream Body Parser
var bodyParserStream = require('./lib/body_parser_stream');

exports.bodyParserStream = function(options) {
  if(options == null) options = {};
  var mime = options.contentType || "application/logplex-1"
  return bodyParserStream({contentType: mime, parser: logfmtBodyParser})
}

exports.time = function(timed_func) {
  var startTime = (new Date()).getTime();
  var our_callback = function(label, data){
    if(!data) data = {};
    if(!label) label = 'elapsed';
    var now = (new Date()).getTime()
    data[label] = now - startTime;
    exports.log(data);
  }

  return timed_func(our_callback);
}
