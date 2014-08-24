# Getting Data

---

## There are a few different options

1. Download manually through the browser (often the most pragmatic)
2. Write a simple `Makefile` to make the process more repeatable
3. If the platform supports it, integrate with the API.

---

## A Simple Makefile

```no-highlight
BASEURL ?= https://data.melbourne.vic.gov.au/api/views
DATASET ?= b2ak-trbp

data.json: data.csv
	../node_modules/.bin/csv-parser data.csv > data.json

data.csv:
	wget "${BASEURL}/${DATASET}/rows.csv?accessType=DOWNLOAD" -O data.csv
```

---

## Consider OpenData Platform Integration

Some of the systems used around Australia (and globally):

- CKAN: <http://ckan.org>
- Socrata: <http://www.socrata.com/>
- DAT: <http://dat-data.com/> _(not yet, but I reckon it will be)_

---

## Using Socrata's API

[`get-sensors.js`](examples/using-socrata/get-sensors.js)
