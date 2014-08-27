## processing data
# CSV

---

## Importing a CSV file

---

[`process-csv.js`](../examples/streaming-csv/process-csv.js)

---

## Serve it to the Browser

---

[`serve-csv.js`](../examples/streaming-csv/serve-csv.js ":10")

---

```no-highlight
$ curl --head http://localhost:3000/data.csv
```

```no-highlight
HTTP/1.1 200 OK
X-Powered-By: Express
content-type: text/csv
etag: abde8d92a4fcedbb7ede3ab6b5f1f003
last-modified: Sat, 23 Aug 2014 11:45:42 +1000
content-length: 6374105
Date: Sat, 23 Aug 2014 02:03:45 GMT
Connection: keep-alive
```

---

[`consume-csv-xhr.js`](../examples/streaming-csv/client/consume-csv-xhr.js)

---

## You can do the same with a WebSocket connection

---

[`serve-csv-websocket.js`](../examples/streaming-csv/serve-csv-websocket.js)

---

[`consume-csv.js`](../examples/streaming-csv/client/consume-csv.js)
