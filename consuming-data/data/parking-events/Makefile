BASEURL ?= https://data.melbourne.vic.gov.au/api/views
DATASET ?= 8nfq-mtcn

events.csv:
	wget "${BASEURL}/${DATASET}/rows.csv?accessType=DOWNLOAD" -O events.csv
