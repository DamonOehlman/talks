## Installation

```no-highlight
npm install -g dat
```

---

## Initialisation

```no-highlight
mkdir foo
cd foo
dat init
```

---

## Store an Object

```no-highlight
echo '{"hello": "world"}' | dat import --json
```

---

## Stream Recent Rows to STDOUT

```no-highlight
dat cat
```

---

## Stream a CSV into dat

```no-highlight
cat some_csv.csv | dat import --csv
dat import --csv some_csv.csv
```

---

## Specify Primary Key on Import

```no-highlight
echo $'a,b,c\n1,2,3' | dat import --csv --primary=a
echo $'{"foo":"bar"}' | dat import --json --primary=foo
```

---

## Start a DAT server

```no-highlight
dat listen
```

---

## Test the REST API

```no-highlight
/api/changes
/api/changes?data=true
/api/metadata
/api/rows/:docid
POST /api/bulk content-type: application/json (newline separated json)
```

---

## Pull data from another DAT server

```no-highlight
dat pull http://localhost:6461
```

---

## Push to another DAT server

```no-highlight
dat push http://localhost:6461
```

---

## Cleanup


```no-highlight
rm -rf .dat
```

---

## Explore the data


```no-highlight
npm install superlevel -g
superlevel .dat/store.dat createReadStream
```

_OR_

```no-highlight
npm install -g lev
lev .dat/store.dat/
```
