# Potential Datasets

## City of Melbourne

### Interesting Datasets

- [Pedestrian Counts](https://data.melbourne.vic.gov.au/Transport/Pedestrian-Counts/b2ak-trbp)

  - nice existing visualization at: http://www.pedestrian.melbourne.vic.gov.au/
  - separate downloads available at: http://www.pedestrian.melbourne.vic.gov.au/datadownload.html
  - 2013 + 2014 data format: http://www.pedestrian.melbourne.vic.gov.au/datadownload/%MonthName%_%Year%.csv
  - Locations: https://data.melbourne.vic.gov.au/Community/Pedestrian-Sensor-Locations-Map/ummz-yqx8

- [Parking Events - From Parking Bays with Sensors](https://data.melbourne.vic.gov.au/Transport/Parking-Events-From-Parking-Bays-With-Sensors/8nfq-mtcn)

  - Nice big dataset (12208178 rows)
  - accessible through the soda api:

    ```
    curl "https://data.melbourne.vic.gov.au/resource/8nfq-mtcn.csv?%24limit=10"
    curl "https://data.melbourne.vic.gov.au/resource/8nfq-mtcn.json?%24limit=10"
    ```

- [Building Footprints](https://data.melbourne.vic.gov.au/Property-and-Planning/Building-Foot-Prints/qe9w-cym8)
- [Road Corridor](https://data.melbourne.vic.gov.au/Property-and-Planning/Road-Corridor/9mdh-8yau)

- Tree Canopy

  - [2008](https://data.melbourne.vic.gov.au/Environment/2008-Tree-Canopy-Urbanforest/xmnz-a7qy)
  - [2011](https://data.melbourne.vic.gov.au/Environment/Tree-Canopy-2011-urbanforest/y79a-us3f)

### Backend

- [socrata](http://www.socrata.com/)
- [soda api docs](http://dev.socrata.com/docs/endpoints.html)

## data.vic

### Interesting Datasets

- [Transport Safety Victoria - Waterways data (GovHack 2014 Subset)](http://www.data.vic.gov.au/raw_data/transport-safety-victoria-waterways-data-govhack-2014-subset/7761)

- [Speed Zone Data](http://www.data.vic.gov.au/raw_data/speed-zone-data/7754)

  126Mb, ZIP

- [Speed Sign Data](http://www.data.vic.gov.au/raw_data/speed-sign-data/7753)

  4.4Mb, ZIP

- [Crash Stats Extract](http://www.data.vic.gov.au/raw_data/crash-stats-data-extract/7752)

  01/01/2006 - 30/06/2013

- [Building Permit Activity Data 2014](http://www.data.vic.gov.au/raw_data/building-permit-activity-data-2014/7760)

- [Metropolitan car parking at train stations](http://www.data.vic.gov.au/raw_data/metropolitan-car-parking-at-train-stations/6595)

  WMS: http://services.land.vic.gov.au/catalogue/publicproxy/guest/sdm_geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&WIDTH=512&HEIGHT=512&LAYERS=sii%3ARAEDATA.DPS_4362_METRO_TRAIN_CARPR&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A4283&BBOX=140.501%2C-39.137%2C150.068%2C-33.0

- [Metropolitan bike stores at train stations](http://www.data.vic.gov.au/raw_data/metropolitan-bike-stores-at-train-stations/6596)

  WMS: http://services.land.vic.gov.au/catalogue/publicproxy/guest/sdm_geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&WIDTH=512&HEIGHT=512&LAYERS=sii%3ARAEDATA.DPS_4376_METRO_BIKE_STORE&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A4283&BBOX=140.501%2C-39.137%2C150.068%2C-33.0

- [PTV Timetable API](http://www.data.vic.gov.au/raw_data/ptv-timetable-api/6056)

- [Speeding Catagories Highway cameras annually](http://www.data.vic.gov.au/raw_data/speeding-catagories-highway-cameras-annually/6572)

  XLS

- [Index of Stream Condition - Full Set of ISC2010 Data Sets](http://www.data.vic.gov.au/raw_data/2010-index-of-stream-condition-full-set-of-isc2010-data-sets/6060)

- [Guide to Property Values](http://www.data.vic.gov.au/raw_data/guide-to-property-values/6045)

  XLS

- [Locality Point - Vicmap](http://www.data.vic.gov.au/raw_data/foi-locality-point-vicmap-features-of-interest/6039)

  Needs to be ordeded?

- [Register of Geographic Place Names: VICNAMES](http://www.data.vic.gov.au/raw_data/register-of-geographic-place-names-vicnames/5951)

  XLS

- Towns in Time series

- [Popular Baby Names 2013](http://www.data.vic.gov.au/raw_data/popular-baby-names-2013/6029)

  XLS

- [Gold Nuggets Discovered](http://www.data.vic.gov.au/raw_data/gold-nuggets-discovered/5871)

  WMS

- [Fossils](http://www.data.vic.gov.au/raw_data/fossils/5869)

  WMS?

- [Mineral Points](http://www.data.vic.gov.au/raw_data/mineral-points-1-1-000-000/5859)

  WMS

- [Coastal Levees](http://www.data.vic.gov.au/raw_data/coastal-levees/5950)

  LIDAR?

- [Libraries](http://www.data.vic.gov.au/data/dataset/libraries)

### Backend

- [ckan](http://ckan.org/)
