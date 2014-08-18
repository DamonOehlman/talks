// require geostore, an RTree index, and a LevelDB data store
var GeoStore = require('terraformer-geostore').GeoStore;
var RTree = require('terraformer-rtree').RTree;
var LevelStore = require('terraformer-geostore-leveldb');

// create the store
var store = new GeoStore({
  store: new LevelStore(),
  index: new RTree()
});

// add the sample geojson
store.add(require('./sample.json'), function(err, res) {
  console.log(arguments);
});

