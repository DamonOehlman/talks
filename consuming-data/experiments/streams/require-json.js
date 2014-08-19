var buildings;

describe('require json', function() {
  it('- baseline memory usage', function() {
  });

  it('- consumes a lot of memory', function() {
    buildings = require('../../data/melbdata/building-footprints/buildings.json');
  });
});
