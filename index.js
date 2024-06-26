const express = require("express");
const cors = require('cors');
var path = require('path');

// const { QuickDB } = require("quick.db");
// const db = new QuickDB(); // will make a json.sqlite in the root folder
if (typeof localStorage === "undefined" || localStorage === null) {
  var db = require('node-localstorage').LocalStorage;
  console.log(process.cwd())
  db = new db(path.join(process.cwd(), '/scratch'));
}
const PORT = process.env.PORT || 7145;
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())

app.use(cors({
  origin: '*',
}));

app.get("/", async (req, res) => {
  res.send("🎈🎈🎈")
});


app.get("/sync/get/", async (req, res) => {
  const syncKey = req.query.key;
  console.log(syncKey)
  res.send(JSON.parse(await db.getItem(syncKey)))
});


app.post("/sync/set/", async (req, res) => {
  const syncKey = req.query.key;
  const data = req.body
  console.log(req.body)
  db.setItem(syncKey,JSON.stringify(data))
  res.status(200).send("YIPEE")
});


app.get("/sync/move/set", async (req, res) => {
  const syncKey = req.query.key;
  const code = Math.floor(Math.random()*(999999 - 100000) + 100000)
  let listofcodes = await db.get("CODES") || []
  listofcodes.push({
    key:syncKey,
    code:code
  })
  await db.setItem("CODES",listofcodes)
  res.send(
    {
      code:code
    }
  )
});

app.get("/sync/move/get", async (req, res) => {
  const tempCode = req.query.code;
  let listofcodes = await db.getItem("CODES") || []
  console.log(listofcodes)
  if (listofcodes == []) {
    res.status(500).send("NO")
  } else {
    listofcodes = listofcodes.filter(elem => elem.code == tempCode)
    res.send(listofcodes[0])
  }
});


app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});