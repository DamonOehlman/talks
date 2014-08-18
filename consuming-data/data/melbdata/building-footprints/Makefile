BASEURL ?= https://data.melbourne.vic.gov.au/api/geospatial
DATASET ?= qe9w-cym8

BuildingFootprints.shp:
	wget "${BASEURL}/${DATASET}?method=export&format=Shapefile" -O footprints.zip
	unzip footprints.zip
	rm footprints.zip

buildings.json: BuildingFootprints.shp
