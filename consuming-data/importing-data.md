# Efficiently Importing Data

Taking a look at the Melbourne building footprints as geojson:

```
[gh-pages][doehlman@nicta-djo building-footprints]$ wc -c buildings.json
27318368 buildings.json
```

Baseline RES memory usage of the node repl on my machine is about `8Mb`:

```
[master][doehlman@nicta-djo ogr2ogr]$ top | grep node
22942 doehlman  20   0  656296   8132   4440 S   0.7  0.1   0:00.02 node
```

If I was to read the `buildings.json` file into memory by simply doing the following:

<<< experiments/streams/require-json.js
[`require-json.js`](experiments/streams/require-json.js)

Memory usage jumps increases by ~ `100MB`

---

## Running with Streams

```
node --trace-gc --expose-gc stream-json.js
```
