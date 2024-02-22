const { selectCommentById, removeCommentById } = require("../models/comments.models")

function deleteCommentById(req, res, next){
  const{comment_id} = req.params
  const promises = [selectCommentById(comment_id), removeCommentById(comment_id)]
  Promise.all(promises)
  .then(() =>{
    res.status(204).send()
  })
  .catch(next)
}

module.exports = {deleteCommentById}