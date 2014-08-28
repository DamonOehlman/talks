BASEURL ?= https://data.melbourne.vic.gov.au/api/geospatial
DATASET ?= qe9w-cym8

buildings.json: buildings.zip
	ogr2ogr -f "ESRI Shapefile" buildings.json /vsizip/buildings.zip

buildings.zip:
	wget "${BASEURL}/${DATASET}?method=export&format=Shapefile" -O buildings.zip
