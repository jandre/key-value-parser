var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('key-value-parser');


/**
 * Parse a set of key value separated items.
 * 
 * 
 * `options` can be the following:
 *  - `async` begin parsing in next tick. default: true
 *  - `delimiter` delimiter between key value pairs. default: space
 *  - `separator` separator beteween key=value.  default: "="
 *  - `quoted` set if values can be quoted.  e.g. key="hello".
 *     { quoted: '\"' }
 *
 * @param {String} line input line, e.g. `a=b b=c e="g"`
 * @param {Object} options options object
 *
 */
function KeyValueParser(line, options) {
  var self = this;
  options = options || {};
  self.line = line;
  self.items = {};
  self.delimiter = options.delimiter || '\s';
  self.separator = options.separator || '='; 
  self.quoted = false;

  if (options.quoted) {
    self.quote_delimiter = options.quoted;
    self.quoted = true;
  };

  if (options.async != false) {
    setTimeout(function() {
      self._parse();
    }) 
  };
};

util.inherits(KeyValueParser, EventEmitter);

/**
 * Runs the parser.
 *
 * @public
 */
KeyValueParser.prototype.run = function() {
  this._parse();
};


/** 
 * End the parser
 *
 * @private
 */
KeyValueParser.prototype._end = function() {
  return this.emit('end', this.items); 
};

/** 
 * Read a key.
 *
 * @param {String} line line to read
 * @param {Integer} position position in line
 *
 * @public
 */
KeyValueParser.prototype.readKey = function(line, position) {
  var self = this;
  position = position || 0;

  if (position >= line.length) {
    return self._end();
  };

  var end = -1; 
  var i = position;

  while (i < line.length) {
   if (line[i] == self.separator) {
     end = i;
     break;
   } 
   i += 1;
  };

  if (end == -1) {
    debug('no key found')
    return self._end();
  };

  var key = line.substring(position, end);
  key = key.trim();
  self.key = key;
  debug('read key:', key)

  self.readValue(line, end + 1);
};

/** 
 * Read a value.
 *
 * @param {String} line line to read
 * @param {Integer} position position in line
 *
 * @private
 */
KeyValueParser.prototype.readValue = function(line, position) {
  var self = this;
  position = position || 0;

  if (position >= line.length) {
    return self._end();
  };

  var end = -1; 
  var quoted = false;
  var i = position;

  if (line[i] == self.quote_delimiter && self.quoted) {
    quoted = true; 
    i++;
    position++;
  };

  while (i < line.length) {
   if (line[i] == self.quote_delimiter && quoted) {
     end = i;
     break;
   } 
   if (line[i] == self.delimiter && !quoted) {
     end = i;
     break;
   }

   i += 1;
  };

  if (end == -1) {
    if (quoted) {
      debug('no end')
      return self.emit('error', "unable to find end quote for:", line); 
    }
    end = i;
   
  };

  var value = line.substring(position, end);
  value = value.trim();
  debug("read value:", value)

  self.items[self.key] = value;
  self.key = null;
  self.value = null;
  self.readKey(line, end + 1);
}

/**
 * Begin parsing
 *
 * @private
 */
KeyValueParser.prototype._parse = function() {
  var self = this;
  self.readKey(this.line);
};

module.exports = KeyValueParser;

