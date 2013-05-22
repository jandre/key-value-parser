var KeyValueParser = require('../lib/index.js');
var line = 'hello=you big="beautiful and lovely" bear=friend';
var audit = new KeyValueParser(line, { quoted: '\"' }); 
audit.on('end', function(data) {
  console.log("got:", data);
});
