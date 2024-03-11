const db = require("../db/connection")

function selectAllArticles(topic) {
  let queryString = `
    SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `

  const values = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`
    values.push(topic)
  }
  queryString += `
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
  `

  return db.query(queryString, values)
    .then((result) => {
      return result.rows
    })
}

function selectArticleById(article_id) {
  return db.query(
  `
  SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`, [article_id])
  .then((result) => {
    if(result.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "article does not exist"})
      }
    return result.rows[0]
  })
}

function selectCommentsByArticleId(article_id) {
  return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;', [article_id])
  .then((result) => {
    return result.rows
  })
}

function insertComment(article_id, username, body){
  return db.query(
    `
    INSERT INTO comments 
    (article_id, author, body) 
    VALUES ($1, $2, $3) 
    RETURNING *;`,[article_id, username, body])
  .then((result) => {
    if(result.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "article does not exist"})
    }
    return result.rows[0]
  })
}

function updateArticleById(article_id, newVote){
  return db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,[newVote, article_id])
  .then((result) => {
    return result.rows[0];
  })
}

module.exports = { selectArticleById, selectAllArticles, selectCommentsByArticleId, insertComment, updateArticleById}
