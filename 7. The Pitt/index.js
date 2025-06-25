const express = require("express")
const ImedHistory = require("./models/historyModel.js")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")


mongoose.connect("mongodb+srv://quavix0000:z30fdMvAO51oJgrS@mongo.u1rtift.mongodb.net/Medicine?retryWrites=true&w=majority")

const app = express()
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.post("/api/imedhistory", async(req,res)=>{
   const history = new ImedHistory(req.body)
   await history.save().then(console.log("history saved")).catch(err=>{console.log("error saving history:   " + err)})
   res.send("message sent successfully")
})

app.listen(3000, ()=>{
   console.log("app is listening on http://localhost:3000")
})