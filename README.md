# Key Value Parser

Simple nodejs library to do key=value parsing for lines that look like:

`a=apple b=babycakes d="dog smiles"`

## Installation

```
$ npm install key-value-parser 
 ```

## Usage

### Example

```js

var KeyValueParser = require('key-value-parser');

var line = 'hello=you big="beautiful" bear=friend'

var parser = new KeyValueParser(line, { quoted: '\"' }); 

parser.on('end', function(data) {
  console.log("got:", data);
});

// ouputs: { hello: 'you', big: 'beautiful and lovely', bear: 'friend' }

```

### Debug logging

pass in `DEBUG=key-value-parser` as an environment variable to turn on debug logging.

## License

Copyright (C) 2013 Jen Andre <jandre@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


