/**
 * phant-output-repeater
 * https://github.com/sparkfun/phant-output-repeater
 *
 * Copyright (c) 2014 SparkFun Electronics
 * Licensed under the GPL v3 license.
 */

'use strict';

/**** Module dependencies ****/
var dgram = require('dgram'),
    _ = require('underscore'),
    events = require('events');

/**** PhantOutput prototype ****/
var app = {};

/**** Expose PhantOutput ****/
exports = module.exports = PhantOutput;

/**** Initialize a new PhantOutput ****/
function PhantOutput(config) {

  config = config || {};

  var output = {};

  _.extend(output, app);
  _.extend(output, events.EventEmitter.prototype);
  _.extend(output, config);

  output.socket = dgram.createSocket('udp4');
  output.socket.on('error', function(err) {
    output.emit('error', err);
  });

  return output;

}

/**** Defaults ****/
app.name = 'phant output repeater';
app.target_address = 'localhost';
app.host = 5000;
app.port = false;

app.receive = function(id, data) {

  var payload = {
    id: id,
    data: data
  };

  this.send(JSON.stringify(payload));

};

app.send = function(payload) {

  var buffer = new Buffer(payload),
      output = this;

  this.socket.send(buffer, 0, buffer.length, this.port, this.host, function(err, bytes) {
    if(err) {
      output.emit('error', err);
    }
  });

};
