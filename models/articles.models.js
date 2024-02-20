const db = require("../db/connection")

function selectAllArticles(){
  return db.query(
    `
    SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `)
  .then((result) =>{
    return result.rows;
  })
}

function selectArticleById(article_id) {
  return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
  .then((result) => {
      if(result.rows.length === 0 ){
        return Promise.reject({status: 404, msg: "article does not exist"})
      }
    return result.rows[0];
  })
}

function selectCommentsByArticleId(article_id) {
  return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;', [article_id])
  .then((result) => {
      if(result.rows.length === 0 ){
        return Promise.reject({status: 404, msg: "article does not exist"})
      }
    return result.rows;
  })
}

module.exports = { selectArticleById, selectAllArticles, selectCommentsByArticleId}
