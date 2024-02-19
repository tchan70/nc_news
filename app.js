const express = require('express')
const { getAllTopics } = require("./controllers/topics.controllers")
const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)


app.all('/*', (request, response, next) => {
  response.status(404).send({msg: "Path not found"})
})

app.use((err, request, response, next) =>{
  if(err.status && err.msg){
    response.status(err.status).send({msg: err.msg})
  } 
  else if (err.code === '22P02' || err.code === '23502'){
    response.status(400).send({msg: "Bad request"})
  } 
  else {
    response.status(500).send({msg: "Internal server error!"})
  }
})

module.exports = app