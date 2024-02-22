const express = require('express')
const { getAllTopics } = require("./controllers/topics.controllers")
const { handleInvalidEndpoint, handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errorHandler')
const { getAllEndpoints } = require('./controllers/endpoints.controllers')
const { getArticleById, getAllArticles, getCommentsFromArticleId, postCommentToArticle, patchArticleById} = require('./controllers/articles.controllers')
const { deleteCommentById } = require('./controllers/comments.controllers')

const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)

app.get('/api/articles/:article_id/comments', getCommentsFromArticleId)
app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.all('/*', handleInvalidEndpoint)

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app