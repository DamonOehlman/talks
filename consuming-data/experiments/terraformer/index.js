var fs = require('fs');
var path = require('path');
var JSONStream = require('JSONStream');
var es = require('event-stream');

// initialise the target file location
var targetFile = path.resolve(__dirname, '../../data/melbdata/building-footprints/buildings.json');

// require geostore, an RTree index, and a LevelDB data store
var GeoStore = require('terraformer-geostore').GeoStore;
var RTree = require('terraformer-rtree').RTree;
var LevelStore = require('terraformer-geostore-leveldb');

// create the store
var store = new GeoStore({
  store: new LevelStore(),
  index: new RTree()
});

fs.createReadStream(targetFile)
  .pipe(JSONStream.parse('features.*'))
  .pipe(es.map(store.add.bind(store));
