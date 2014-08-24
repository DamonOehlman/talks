BASEURL ?= https://data.melbourne.vic.gov.au/api/views
DATASET ?= b2ak-trbp

data.json: data.csv
	../node_modules/.bin/csv-parser data.csv > data.json

data.csv:
	wget "${BASEURL}/${DATASET}/rows.csv?accessType=DOWNLOAD" -O data.csv
