const express = require('express')
const { getAllTopics} = require("./controllers/topics.controllers")
const { pathNotFound, errorHandling } = require('./errorHandler')
const { getAllEndpoints } = require('./controllers/endpoints.controllers')

const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.all('/*', pathNotFound)

app.use(errorHandling)

module.exports = app