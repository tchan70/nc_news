const { selectArticleById, selectAllArticles, selectCommentsByArticleId, insertComment} = require("../models/articles.models")

function getAllArticles(req, res, next){
  selectAllArticles()
  .then((articles) =>{
    res.status(200).send({articles})
  })
  .catch(next)
}

function getArticleById(req, res, next){
  const {article_id} = req.params
  selectArticleById(article_id)
  .then((article) =>{
    res.status(200).send({article})
  })
  .catch(next)
}

function getCommentsFromArticleId(req, res, next){
  const { article_id } = req.params
  const promises = [selectCommentsByArticleId(article_id), selectArticleById(article_id)]
  Promise.all(promises)
  .then((comments) =>{
    if(comments[0].length === 0){
      res.status(204).send()
    }
    else{
      res.status(200).send({comments: comments[0]})
    }
  })
  .catch(next)
}

function postCommentToArticle(req, res, next){
  const {article_id} = req.params
  const {username, body} = req.body
  const promises = [selectArticleById(article_id), insertComment(article_id, username, body)]
  Promise.all(promises)
  .then((comment) =>{
    res.status(201).send({ comment: comment[1] })
  })
  .catch(next)
}

module.exports = { getArticleById, getAllArticles, getCommentsFromArticleId, postCommentToArticle}