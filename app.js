const express = require('express')
const { getAllTopics } = require("./controllers/topics.controllers")
const { handleInvalidEndpoint, handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errorHandler')
const { getAllEndpoints } = require('./controllers/endpoints.controllers')
const { getArticleById, getAllArticles } = require('./controllers/articles.controllers')

const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)

app.all('/*', handleInvalidEndpoint)

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app