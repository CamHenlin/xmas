var express = require('express');
var ffi = require('ffi');
var app = express();

// track positions of servo motors
positions = [0, 0];

/**
 * [pixy_rcs_set_position]
 * @param  {[type]} channel  [motor channel to change position of [0,1]]
 * @param  {[type]} position [position to set, [0-999]]
 */
var pixy_rcs_set_position = ffi.Library('./libpixyusb', {
  'pixy_rcs_set_position': [ 'int', [ 'uint8_t', 'uint16_t' ] ]
});

/**
 * [set_position, pixy_rcs_set_position wrapper]
 * @param  {[type]} channel  [motor channel to change position of [0,1]]
 * @param  {[type]} position [position to set, [0-999]]
 */
var set_position = function(channel, position) {
  if (position < 0 || position > 999) { return; }
  positions[channel] = position;
  pixy_rcs_set_position(channel, position);
};

set_position(0, 500);
set_position(1, 500);

app.get('/left', function(req, res) {
  set_position(0, positions[0] - 50);
  res.send(true);
});

app.get('/right', function(req, res) {
  set_position(0, positions[0] + 50);
  res.send(true);
});

app.get('/up', function(req, res) {
  set_position(0, positions[1] - 50);
  res.send(true);
});

app.get('/down', function(req, res) {
  set_position(0, positions[1] + 50);
  res.send(true);
});

app.listen(3000);