const db = require("../db/connection")

function selectCommentById(comment_id) {
  return db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id])
  .then((result) => {
    if(result.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "comment does not exist"})
      }
    return result.rows[0];
  })
}

function removeCommentById(comment_id){
  return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
  .then((result) =>{
    return result.rows[0]
  })
}

module.exports = {selectCommentById, removeCommentById}