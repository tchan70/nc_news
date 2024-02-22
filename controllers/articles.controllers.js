const { selectArticleById, selectAllArticles, selectCommentsByArticleId, insertComment, updateArticleById, countCommentsByArticleId} = require("../models/articles.models")
const { selectTopicByName } = require("../models/topics.models")
const { selectUserByUsername } = require("../models/users.models")

function getAllArticles(req, res, next){
  const { topic } = req.query
  const promises = [selectAllArticles(topic)]
  if (topic) {
    promises.push(selectTopicByName(topic))
  }
  Promise.all(promises)
  .then((articles) =>{
    res.status(200).send({articles: articles[0]})
  })
  .catch(next)
}

function getArticleById(req, res, next){
  const {article_id} = req.params
  const promises = [selectArticleById(article_id), countCommentsByArticleId(article_id)]
  Promise.all(promises)
  .then(([article, comment_count]) =>{
    article.comment_count = comment_count
    res.status(200).send({article})
  })
  .catch(next)
}

function patchArticleById(req, res, next){
 const {article_id} = req.params
 const {inc_votes} = req.body
 const promises = [selectArticleById(article_id), updateArticleById(article_id, inc_votes)]
 Promise.all(promises)
 .then((updatedArticle) =>{
  res.status(200).send({article: updatedArticle[1]})
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
  const promises = [selectArticleById(article_id), selectUserByUsername(username), insertComment(article_id, username, body)]
  Promise.all(promises)
  .then((comment) =>{
    res.status(201).send({ comment: comment[2] })
  })
  .catch(next)
}

module.exports = { getAllArticles, getArticleById, patchArticleById, getCommentsFromArticleId, postCommentToArticle}