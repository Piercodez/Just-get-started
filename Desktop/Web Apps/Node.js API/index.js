const express = require("express");
const bodyParser = require("body-parser");
const client = express();
const listeningPort = 3000;

client.use(bodyParser.urlencoded({extended: false}))
client.use(bodyParser.json())

client.get("/posts", (req, res) => {
  res.send("posts page")
})

client.get("/", (req, res) => {
  res.send("Hello World!")
})

client.post("/authenticate", (req, res) => {
  if (req.body.username === undefined || req.body.password === undefined) {
    res.send("please prodive username and password")
    return;
}

  let username = req.body.username
  let password = req.body.password

  console.log("username: " + username)
  console.log("username: " + password)

  console.log(req.headers["user-agent"])
  res.send("authenticated")
})

client.listen(3000, () => {
console.log(`Listening to port ${listeningPort}`)
}) 