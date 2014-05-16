var deck = require('decker')();
var defaultCss = require('defaultcss');
var fs = require('fs');

defaultCss('theme', fs.readFileSync('./node_modules/decker/themes/basic.css', 'utf8'));
defaultCss('highlighting', fs.readFileSync('./node_modules/decker/themes/code/docco.css', 'utf8'));
deck.add(fs.readFileSync('./README.md', 'utf8'));

document.body.appendChild(deck.render());

/**

  <<< sections/intro.md

  ---

  ## A Browserify Baseline

  <<< examples/empty.js

  ```
  ~ browserify examples/empty.js | wc -c
  485
  ```

  ---

  ## OK, Let's use Streams

  <<< examples/stream.js

  ```
  ~ browserify examples/stream.js | wc -c
  105607
  ```

  ---

  ## Buffers in the Browser

  <<< examples/simple-buffer.js

  ```
  ~ browserify examples/simple-buffer.js | wc -c
  36455
  ```

  ---

  # Response to High Byte Count

  ![](//damonoehlman.github.io/streaming-the-web/icons/icon_22084/icon_22084.svg)

  <small class="attribution">Sad by Adil Siddiqui from The Noun Project</small>


  ---

  # The Pull-Streams Alternative

  ![](//damonoehlman.github.io/streaming-the-web/icons/icon_23535/icon_23535.svg)

  <small class="attribution">Pull by Pavel Nikandrov from The Noun Project</small>

  ---

  ## Pull Streams Overhead

  <<< examples/ps-require.js

  ```
  ~ browserify examples/ps-require.js | wc -c
  17923
  ```

  ---

  ## Pull Streams in Node

  <<< examples/flickr-search.js

  ---

  ## Server Sent Events with Pull Streams

  <<< examples/flickr-search-sse.js

  ---

  ## Server: LevelDB -> (Transformation) -> SSE

  <<< examples/d3-cpu/routes/cpu.js

  ---

  ## Client: SSE -> ?

  <<< examples/d3-cpu/client/js/index.js

  ---

  <<< sections/outro.md

**/
