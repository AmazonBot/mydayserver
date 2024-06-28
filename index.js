const express = require("express");
const cors = require('cors');
var path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder
// if (typeof localStorage === "undefined" || localStorage === null) {
//   var db = require('node-localstorage').LocalStorage;
//   console.log(process.cwd())
//   db = new db(path.join(process.cwd(), '/scratch'));
// }
const PORT = process.env.PORT || 7145;
var bodyParser = require('body-parser');
const { type } = require("os");
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
  if (typeof syncKey == "undefined") {
    res.status(500).send({reply:"NO"})
  } else if (await db.has(syncKey)) {
    res.send(JSON.parse(await db.get(syncKey)))
  } else {
    res.status(500).send({reply:"NO"})
  }
  
});


app.post("/sync/set/", async (req, res) => {
  const syncKey = req.query.key;
  const data = req.body
  console.log(req.body)
  db.set(syncKey,JSON.stringify(data))
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
  await db.set("CODES",listofcodes)
  res.send(
    {
      code:code
    }
  )
});

app.get("/sync/move/get", async (req, res) => {
  const tempCode = req.query.code;
  let endres = {}
  var listofcodes = await db.get("CODES") || []
  console.log(listofcodes)
  if (listofcodes == []) {
    res.status(500).send("NO")
  } else {
    listofcodes.map(elem => {
      console.log(elem.code,tempCode,elem.code == parseInt(tempCode))
      if (elem.code == parseInt(tempCode)) {
        endres = 
          {
            "key":elem.key,
            "code":elem.code
          }

      }
    })
    
    console.log(endres)
    res.send(endres)
  }
});


app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});