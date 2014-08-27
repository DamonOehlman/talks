# Liberating Data

This is a presentation done for [YOW! Nights](http://yownights.yowconference.com.au/) in conjuction with a Hack event organised for Melbourne Infrastructure (see: [infrahack.org](http://infrahack.org)).  The slides are available online here:

<http://damonoehlman.github.io/talks/consuming-data/>

## Examples

Throughout the slides there are a number of examples (and segments of examples shown), and these examples are available in the [examples](examples/) folder but for convenience's sake are also listed below:

### Small / Trivial Examples Demonstrating Streams

#### Server / CLI Examples:

- [Process CSV using `csv-parser`](examples/streaming-csv/process-csv.js)
- [Serve CSV using `filed`](examples/streaming-csv/serve-csv.js)
- [Serve CSV over Websockets](examples/streaming-csv/serve-csv-websockets.js)
- [Convert Shapefile to GeoJSON](examples/processing-shapefile/to-geojson.js)
- [Convert GeoJSON in reponse to a HTTP request](examples/processing-shapefile/serve-geojson.js)

#### Client Examples:

- [Consume CSV via XHR](examples/streaming-csv/client/consume-csv-xhr.js)
- [Consume CSV via WebSockets](examples/streaming-csv/client/consume-csv.js) (_requires some packages to work_)
- [Consume CSV from Socrata API](examples/using-socrata/get-sensors.js)

### More Complicated Examples

- [Transfer CSV Files using Drag and Drop and WebRTC Data Channels](examples/p2p/transfer-csv.js)
- [Import Time Series CSV Data (Parking Sensors) into LevelDB using Pull Streams](examples/level-importer/index.js)

## Running the Examples

The first step in running the examples is cloning this repository, which can be done using the following command:

```
git clone https://github.com/DamonOehlman/talks.git do-talks
cd do-talks/consuming-data
```

The next thing you should do is download any data that you require for the examples to work.  It should be reasonably easy to identify the data that is required for an example, and once identified simply change to the relevent directory and run `make`.  For example, to download the pedestrian sensor data you would do the following:

```
cd data/pedestrians
make
```

Once the data is available, you are then ready to run the examples.  Each of the example folders comes with a `package.json` file that describes the dependencies required to run the example, so we will need to run `npm install` in the example directory before we attempt to run the example using node. For example:

```
cd examples/streaming-csv
npm install
```

Assuming that the installation of the required node modules has succeeded you should then be able to run an example:

```
node serve-csv-websocket.js
```

To run the client component of this example, open a new terminal window and two modules that will help [browserify](http://browserify.org) the required files in a useful development sandbox:

```
npm install -g browserify beefy
```

After these tools have been installed, then we will use beefy to run the client code that complements this server code:

```
beefy client/consume-csv.js
```

This will start a new beefy server that you can then open in your browser at a url similar (the port is auto increment if 9966 is in use):

<http://localhost:9966/>

You are then able to make modifications to the client file and reload the changes to see the impact of the changes you have just made.
