BASEURL ?= https://data.melbourne.vic.gov.au/api/geospatial
DATASET ?= qe9w-cym8

buildings.json: BuildingFootprints.shp
	ogr2ogr -f GeoJSON buildings.json BuildingFootprints.shp

BuildingFootprints.shp:
	wget "${BASEURL}/${DATASET}?method=export&format=Shapefile" -O footprints.zip
	unzip footprints.zip
	rm footprints.zip
